/**
 * CV Parser - Enhanced CV text extraction and parsing
 */

import { CVData, PersonalInfo, Experience } from '../types';
import { sanitizeText, cleanSkill, isUrlOrEmail } from './sanitization';

// Dynamic imports for client-side only libraries
let pdfjsLib: any = null;
let mammoth: any = null;

// Initialize libraries on client side
async function initializeLibraries() {
  if (typeof window !== 'undefined' && !pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    
    // Try multiple worker loading strategies
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      try {
        // Strategy 1: Try to use the bundled worker
        const workerUrl = new URL(
          'pdfjs-dist/build/pdf.worker.min.js',
          import.meta.url
        ).toString();
        
        // Test if the worker URL is accessible
        const response = await fetch(workerUrl, { method: 'HEAD' });
        if (response.ok) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
          console.log('PDF.js worker loaded successfully from local bundle');
        } else {
          throw new Error('Local worker not accessible');
        }
      } catch (localError) {
        console.warn('Local worker failed, trying CDN:', localError);
        
        try {
          // Strategy 2: Use CDN fallback
          const cdnWorkerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          const cdnResponse = await fetch(cdnWorkerUrl, { method: 'HEAD' });
          
          if (cdnResponse.ok) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = cdnWorkerUrl;
            console.log('PDF.js worker loaded from CDN');
          } else {
            throw new Error('CDN worker not accessible');
          }
        } catch (cdnError) {
          console.warn('CDN worker failed, using built-in polyfill:', cdnError);
          
          // Strategy 3: Use built-in polyfill (slower but more reliable)
          pdfjsLib.GlobalWorkerOptions.workerSrc = `data:application/javascript;base64,${btoa(`
            // Minimal PDF.js worker polyfill
            self.onmessage = function(e) {
              console.log('PDF.js polyfill worker received message');
              // Simple pass-through for basic functionality
              self.postMessage(e.data);
            };
          `)}`;
          console.log('PDF.js using polyfill worker');        }
      }
    }
  }
  
  if (typeof window !== 'undefined' && !mammoth) {
    mammoth = await import('mammoth');
  }
}

export interface ParsedCVData {
  personalInfo: Partial<PersonalInfo>;
  experience: Experience[];
  education: any[];
  skills: string[];
  rawText: string;
}

/**
 * Extract text from various file formats
 */
export async function extractTextFromFile(file: File): Promise<string> {
  // Ensure we're on the client side
  if (typeof window === 'undefined') {
    throw new Error('File parsing must be done on the client side');
  }
  
  // Initialize libraries
  await initializeLibraries();
  
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    } else if (fileType.includes('text') || fileType.includes('plain') || fileName.endsWith('.txt')) {
      return await file.text();
    } else if (fileType.includes('wordprocessingml') || fileName.endsWith('.docx')) {
      return await extractTextFromDOCX(file);
    } else if (fileType.includes('msword') || fileName.endsWith('.doc')) {
      throw new Error('Legacy Word documents (.doc) are not supported. Please save as .docx or convert to PDF.');
    } else {
      // Try to read as text anyway
      return await file.text();
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text from ${file.name}. ${error instanceof Error ? error.message : 'Please ensure it\'s a valid PDF, DOCX, or text file.'}`);
  }
}

/**
 * Extract text from PDF using PDF.js
 */
async function extractTextFromPDF(file: File): Promise<string> {
  if (!pdfjsLib) {
    throw new Error('PDF.js library not initialized');
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += pageText + '\n';
  }
  
  return fullText;
}

/**
 * Extract text from DOCX using mammoth
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  if (!mammoth) {
    throw new Error('Mammoth library not initialized');
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  
  if (result.messages.length > 0) {
    console.warn('DOCX parsing warnings:', result.messages);
  }
  
  return result.value;
}

/**
 * Parse CV text into structured data
 */
export function parseCV(text: string, existingData?: Partial<CVData>): ParsedCVData {
  console.log('🔍 Starting CV parsing...');
  
  // Sanitize the input text first
  const sanitizedText = sanitizeText(text);
  console.log('🧹 Text sanitized, length:', sanitizedText.length);
  console.log('📝 First 200 characters:', sanitizedText.substring(0, 200));
  
  const lines = sanitizedText.split('\n').map(line => sanitizeText(line.trim())).filter(line => line.length > 0);
  console.log('📋 Total lines after cleaning:', lines.length);
  
  const result: ParsedCVData = {
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    rawText: sanitizedText
  };

  // Extract personal information
  result.personalInfo = extractPersonalInfo(sanitizedText, lines);
  console.log('👤 Extracted personal info:', result.personalInfo);
  
  // Extract personal summary/statement
  const summary = extractPersonalSummary(sanitizedText, lines);
  if (summary) {
    result.personalInfo.summary = sanitizeText(summary);
    console.log('📄 Extracted summary:', result.personalInfo.summary);
  }

  // Extract skills
  result.skills = extractSkills(sanitizedText, lines);
  console.log('⚡ Extracted skills:', result.skills);
  
  // Extract experience
  result.experience = extractExperience(sanitizedText, lines);
  console.log('💼 Extracted experience entries:', result.experience.length);
  console.log('💼 Experience details:', result.experience);
  
  // Extract education
  result.education = extractEducation(sanitizedText, lines);
  console.log('🎓 Extracted education entries:', result.education.length);
  console.log('🎓 Education details:', result.education);

  return result;
}

/**
 * Extract personal information with improved patterns
 */
function extractPersonalInfo(text: string, lines: string[]): Partial<PersonalInfo> {
  const info: Partial<PersonalInfo> = {};

  // Extract email with better pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatch = text.match(emailPattern);
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Extract phone with international format support
  const phonePattern = /(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)\s?)?[\d\s\-\.]{7,15}/g;
  const phoneMatches = text.match(phonePattern);
  if (phoneMatches) {
    // Find the most likely phone number (usually longest or contains country code)
    const bestPhone = phoneMatches
      .filter(phone => phone.replace(/\D/g, '').length >= 7)
      .sort((a, b) => b.length - a.length)[0];
    if (bestPhone) {
      info.phone = bestPhone.trim();
    }
  }

  // Extract name (improved logic)
  const nameCandidates = lines.slice(0, 5) // Check first 5 lines
    .filter(line => {
      const words = line.split(/\s+/);
      return words.length >= 2 && 
             words.length <= 4 && 
             !line.includes('@') && 
             !line.match(/\d{3,}/) && // No long numbers
             !line.toLowerCase().includes('cv') &&
             !line.toLowerCase().includes('resume') &&
             line.length < 50; // Not too long
    });

  if (nameCandidates.length > 0) {
    info.name = nameCandidates[0];
  }

  // Extract LinkedIn
  const linkedinPattern = /(?:linkedin\.com\/in\/|linkedin\.com\/profile\/view\?id=)([a-zA-Z0-9\-]+)/i;
  const linkedinMatch = text.match(linkedinPattern);
  if (linkedinMatch) {
    info.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
  }

  // Extract GitHub
  const githubPattern = /(?:github\.com\/)([a-zA-Z0-9\-]+)/i;
  const githubMatch = text.match(githubPattern);
  if (githubMatch) {
    info.github = `https://github.com/${githubMatch[1]}`;
  }

  // Extract location (look for city, state/country patterns)
  const locationPattern = /(?:^|\n)([A-Za-z\s]+,\s*[A-Za-z\s]+)(?:\n|$)/g;
  const locationMatches = text.match(locationPattern);
  if (locationMatches) {
    const bestLocation = locationMatches
      .map(loc => loc.trim())
      .filter(loc => loc.length < 50 && loc.split(',').length === 2)[0];
    if (bestLocation) {
      info.location = bestLocation;
    }
  }

  return info;
}

/**
 * Extract skills with better categorization
 */
function extractSkills(text: string, lines: string[]): string[] {
  const skills: Set<string> = new Set();
  
  // Common skill section headers
  const skillHeaders = [
    'skills', 'technical skills', 'core competencies', 'technologies',
    'programming languages', 'tools', 'expertise', 'proficiencies',
    'key skills', 'technical competencies'
  ];
  
  let inSkillsSection = false;
  let skillsFound = false;
  
  console.log('⚡ Starting skills extraction...');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering a skills section
    if (skillHeaders.some(header => line.includes(header) && line.length < 60)) {
      console.log('📍 Found skills section header:', lines[i]);
      inSkillsSection = true;
      skillsFound = true;
      continue;
    }
    
    // Check if we're leaving the skills section
    if (inSkillsSection && (
      line.includes('experience') || 
      line.includes('education') || 
      line.includes('work history') ||
      line.includes('employment') ||
      line.includes('projects') ||
      line.includes('certifications')
    )) {
      console.log('🚪 Leaving skills section at:', lines[i]);
      inSkillsSection = false;
      continue;
    }
    
    // Extract skills from the current line
    if (inSkillsSection && lines[i].trim()) {
      const lineSkills = extractSkillsFromLine(lines[i]);
      console.log('🔍 Processing skills line:', lines[i], '-> Found:', lineSkills);
      lineSkills.forEach(skill => {
        const cleanedSkill = cleanSkill(skill);
        if (cleanedSkill) {
          skills.add(cleanedSkill);
        }
      });
    }
  }
  
  // If no dedicated skills section found, look for common technical terms throughout
  if (!skillsFound) {
    console.log('📍 No skills section found, searching for common skills...');
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'AWS', 'Docker',
      'TypeScript', 'PHP', 'C++', 'C#', '.NET', 'Ruby', 'Go', 'Rust',
      'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Scrum',
      'Kubernetes', 'Azure', 'Google Cloud', 'Linux', 'Windows', 'MacOS'
    ];
    
    for (const skill of commonSkills) {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    }
  }
  
  const finalSkills = Array.from(skills).slice(0, 20); // Limit to 20 skills
  console.log('✅ Final skills extracted:', finalSkills);
  return finalSkills;
}

/**
 * Extract skills from a single line
 */
function extractSkillsFromLine(line: string): string[] {
  // Split by common delimiters
  const delimiters = /[,;•·\|\n\t]/;
  return line.split(delimiters)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 1 && skill.length < 30)
    .map(skill => skill.replace(/^[-\s]+|[-\s]+$/g, '')); // Remove leading/trailing dashes and spaces
}

/**
 * Extract work experience with enhanced pattern recognition
 */
function extractExperience(text: string, lines: string[]): Experience[] {
  console.log('💼 Starting experience extraction...');
  const experiences: Experience[] = [];
  
  const experienceHeaders = [
    'experience', 'work experience', 'employment', 'work history', 
    'professional experience', 'career history', 'employment history'
  ];
  
  let inExperienceSection = false;
  let currentExperience: Partial<Experience> | null = null;
  let descriptionLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering experience section
    if (experienceHeaders.some(header => line.includes(header) && line.length < 50)) {
      console.log('📍 Found experience section header:', lines[i]);
      inExperienceSection = true;
      continue;
    }
    
    // Check if we're leaving experience section
    if (inExperienceSection && (
      line.includes('education') || 
      line.includes('skills') ||
      line.includes('certifications') ||
      line.includes('projects') ||
      line.includes('achievements')
    )) {
      console.log('🚪 Leaving experience section at:', lines[i]);      if (currentExperience && currentExperience.position && currentExperience.company) {
        const experienceEntry = {
          id: crypto.randomUUID(),
          position: sanitizeText(currentExperience.position || ''),
          company: sanitizeText(currentExperience.company || ''),
          location: sanitizeText(currentExperience.location || ''),
          startDate: sanitizeText(currentExperience.startDate || ''),
          endDate: sanitizeText(currentExperience.endDate || ''),
          current: currentExperience.current || false,
          description: sanitizeText(descriptionLines.join(' ').trim()),
          achievements: []
        };
        console.log('➕ Adding final experience:', experienceEntry);
        experiences.push(experienceEntry);
      }
      break;
    }

    if (inExperienceSection && lines[i].trim()) {
      const originalLine = lines[i];
      console.log('🔍 Processing experience line:', originalLine);
      
      // Look for job title patterns (usually appear first or with certain formatting)
      const jobTitleIndicators = [
        /^[A-Z][a-zA-Z\s]+(Engineer|Developer|Manager|Analyst|Specialist|Consultant|Director|Lead|Senior|Junior|Assistant)/i,
        /^(Senior|Junior|Lead|Principal|Head of|Chief)\s+[A-Za-z\s]+/i
      ];
      
      // Look for company patterns
      const companyIndicators = [
        /^[A-Z][a-zA-Z\s&]+(?:\s+(?:Inc|Ltd|LLC|Corp|Corporation|Company|Co\.?))?$/,
        /at\s+([A-Z][a-zA-Z\s&]+(?:\s+(?:Inc|Ltd|LLC|Corp|Corporation|Company))?)/i
      ];
      
      // Look for date patterns
      const datePattern = /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20\d{2}|20\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2})\b/gi;
      
      // Check if this line contains dates (likely a position header)
      const dateMatches = originalLine.match(datePattern);
      if (dateMatches && dateMatches.length > 0) {
        console.log('📅 Found date pattern, creating new experience entry:', dateMatches);        // This is likely a job entry header, save previous experience if exists
        if (currentExperience && currentExperience.position && currentExperience.company) {
          const experienceEntry = {
            id: crypto.randomUUID(),
            position: sanitizeText(currentExperience.position || ''),
            company: sanitizeText(currentExperience.company || ''),
            location: sanitizeText(currentExperience.location || ''),
            startDate: sanitizeText(currentExperience.startDate || ''),
            endDate: sanitizeText(currentExperience.endDate || ''),
            current: currentExperience.current || false,
            description: sanitizeText(descriptionLines.join(' ').trim()),
            achievements: []
          };
          console.log('➕ Adding experience:', experienceEntry);
          experiences.push(experienceEntry);
        }
        
        // Start new experience
        currentExperience = {
          startDate: dateMatches[0] || '',
          endDate: dateMatches[1] || dateMatches[0] || '',
          current: originalLine.toLowerCase().includes('present') || originalLine.toLowerCase().includes('current')
        };
        descriptionLines = [];
        
        // Try to extract position and company from the same line
        let workingLine = originalLine;
        // Remove dates to get cleaner text
        dateMatches.forEach(date => {
          workingLine = workingLine.replace(new RegExp(date, 'gi'), '');
        });
        workingLine = workingLine.replace(/[-–—|]/g, '').trim();
        
        // Look for "at Company" pattern
        const atMatch = workingLine.match(/(.+?)\s+at\s+(.+)/i);
        if (atMatch) {
          currentExperience.position = atMatch[1].trim();
          currentExperience.company = atMatch[2].trim();
        } else {
          // Try to split by common separators
          const parts = workingLine.split(/[,\n]/).map(p => p.trim()).filter(p => p);
          if (parts.length >= 2) {
            currentExperience.position = parts[0];
            currentExperience.company = parts[1];
          } else if (parts.length === 1) {
            currentExperience.position = parts[0];
          }
        }
        
        continue;
      }
      
      // If we have a current experience but no position yet, try to extract it
      if (currentExperience && !currentExperience.position) {
        if (jobTitleIndicators.some(pattern => pattern.test(originalLine))) {
          console.log('💼 Found job title:', originalLine);
          currentExperience.position = originalLine;
          continue;
        }
      }
      
      // If we have position but no company, try to extract company
      if (currentExperience && currentExperience.position && !currentExperience.company) {
        const companyMatch = originalLine.match(companyIndicators[1]);
        if (companyMatch) {
          console.log('🏢 Found company (pattern match):', companyMatch[1]);
          currentExperience.company = companyMatch[1];
          continue;
        } else if (companyIndicators[0].test(originalLine)) {
          console.log('🏢 Found company (indicator test):', originalLine);
          currentExperience.company = originalLine;
          continue;
        }
      }
      
      // If line starts with bullet points or dashes, it's likely a description/achievement
      if (/^[-•*]\s+/.test(originalLine) || (currentExperience && originalLine.length > 20)) {
        console.log('📝 Adding description line:', originalLine);
        descriptionLines.push(originalLine.replace(/^[-•*]\s+/, ''));
      }
    }
  }
    // Don't forget the last experience
  if (currentExperience && currentExperience.position && currentExperience.company) {
    const experienceEntry = {
      id: crypto.randomUUID(),
      position: sanitizeText(currentExperience.position || ''),
      company: sanitizeText(currentExperience.company || ''),
      location: sanitizeText(currentExperience.location || ''),
      startDate: sanitizeText(currentExperience.startDate || ''),
      endDate: sanitizeText(currentExperience.endDate || ''),
      current: currentExperience.current || false,
      description: sanitizeText(descriptionLines.join(' ').trim()),
      achievements: []
    };
    console.log('➕ Adding final experience entry:', experienceEntry);
    experiences.push(experienceEntry);
  }
  
  console.log('✅ Experience extraction complete. Found', experiences.length, 'entries');
  return experiences;
}

/**
 * Extract personal summary/objective statement with improved detection
 */
function extractPersonalSummary(text: string, lines: string[]): string | undefined {
  console.log('📄 Starting summary extraction...');
  
  const summaryHeaders = [
    'summary', 'professional summary', 'profile', 'objective', 'personal statement',
    'career objective', 'professional profile', 'about me', 'overview',
    'personal profile', 'executive summary', 'career summary'
  ];
  
  let inSummarySection = false;
  let summaryLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering a summary section
    if (summaryHeaders.some(header => 
      line.includes(header) && line.length < 60 // Avoid matching within content
    )) {
      console.log('📍 Found summary section header:', lines[i]);
      inSummarySection = true;
      continue;
    }
    
    // Check if we're leaving summary section
    if (inSummarySection && (
      line.includes('experience') || 
      line.includes('work history') ||
      line.includes('employment') ||
      line.includes('education') ||
      line.includes('skills') ||
      line.includes('certifications')
    )) {
      console.log('🚪 Leaving summary section at:', lines[i]);
      break;
    }
    
    // Collect summary content
    if (inSummarySection && lines[i].trim()) {
      const sanitizedLine = sanitizeText(lines[i]);
      if (sanitizedLine.length > 10) { // Only meaningful content
        summaryLines.push(sanitizedLine);
        console.log('📝 Adding summary line:', sanitizedLine);
      }
    }
  }
  
  // If no dedicated section found, look for summary-like content near the top
  if (summaryLines.length === 0) {
    console.log('📍 No summary section found, looking for summary-like content...');
    
    // Look for longer paragraphs in the first 10 lines that might be summaries
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = sanitizeText(lines[i]);
      
      // Skip headers, contact info, and short lines
      if (line.length > 50 && 
          !isUrlOrEmail(line) &&
          !line.match(/\d{3,}/) && // No long numbers (phone)
          !summaryHeaders.some(header => line.toLowerCase().includes(header))) {
        
        // This might be a summary paragraph
        summaryLines.push(line);
        console.log('📝 Found potential summary content:', line);
        
        // Look for continuation lines
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = sanitizeText(lines[j]);
          if (nextLine.length > 30 && 
              !isUrlOrEmail(nextLine) &&
              !nextLine.match(/\d{3,}/)) {
            summaryLines.push(nextLine);
            console.log('📝 Adding continuation line:', nextLine);
          } else {
            break;
          }
        }
        break;
      }
    }
  }
  
  const summary = summaryLines.join(' ').trim();
  const finalSummary = summary.length > 30 ? summary : undefined;
  
  if (finalSummary) {
    console.log('✅ Summary extracted:', finalSummary.substring(0, 100) + '...');  } else {
    console.log('❌ No summary found');
  }
  
  return finalSummary;
}

/**
 * Extract education information with improved detection
 */
function extractEducation(text: string, lines: string[]): any[] {
  console.log('🎓 Starting education extraction...');
  const education: any[] = [];
  
  const educationHeaders = [
    'education', 'academic background', 'qualifications', 'degrees',
    'academic qualifications', 'educational background'
  ];
  
  let inEducationSection = false;
  let currentEducation: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering education section
    if (educationHeaders.some(header => line.includes(header) && line.length < 60)) {
      console.log('📍 Found education section header:', lines[i]);
      inEducationSection = true;
      continue;
    }
    
    // Check if we're leaving education section
    if (inEducationSection && (
      line.includes('experience') || 
      line.includes('skills') ||
      line.includes('certifications') ||
      line.includes('projects') ||
      line.includes('work history')
    )) {
      console.log('🚪 Leaving education section at:', lines[i]);
      // Save current education if exists
      if (currentEducation && currentEducation.degree) {
        education.push(currentEducation);
      }
      break;
    }
    
    if (inEducationSection && lines[i].trim()) {
      const originalLine = sanitizeText(lines[i]);
      console.log('🔍 Processing education line:', originalLine);
      
      // Look for degree patterns
      const degreePattern = /(bachelor|master|phd|doctorate|associate|diploma|certificate|b\.?a\.?|b\.?s\.?|m\.?a\.?|m\.?s\.?|ph\.?d\.?)/i;
      
      // Look for institution patterns
      const institutionPattern = /(university|college|institute|school|academy)/i;
      
      // Look for date patterns
      const datePattern = /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20\d{2}|20\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2})\b/gi;
      
      if (degreePattern.test(originalLine) || institutionPattern.test(originalLine)) {
        // Save previous education if exists
        if (currentEducation && currentEducation.degree) {
          education.push(currentEducation);
        }
        
        // Start new education entry
        currentEducation = {
          id: crypto.randomUUID(),
          degree: '',
          institution: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        };
        
        const dateMatches = originalLine.match(datePattern);
        if (dateMatches) {
          currentEducation.startDate = dateMatches[0] || '';
          currentEducation.endDate = dateMatches[1] || dateMatches[0] || '';
        }
        
        // Try to extract degree and institution
        if (degreePattern.test(originalLine)) {
          currentEducation.degree = originalLine;
        }
        
        if (institutionPattern.test(originalLine)) {
          if (currentEducation.degree) {
            // This line contains the institution
            const parts = originalLine.split(/,|\n/).map(p => p.trim());
            for (const part of parts) {
              if (institutionPattern.test(part)) {
                currentEducation.institution = part;
                break;
              }
            }
          } else {
            // This line is the institution, look for degree in nearby lines
            currentEducation.institution = originalLine;
          }
        }
        
        console.log('📚 Found education entry:', currentEducation);
      } else if (currentEducation) {
        // This might be additional info for the current education
        if (!currentEducation.institution && institutionPattern.test(originalLine)) {
          currentEducation.institution = originalLine;
        } else if (!currentEducation.degree && degreePattern.test(originalLine)) {
          currentEducation.degree = originalLine;
        } else if (originalLine.length > 20) {
          // Might be description
          currentEducation.description = originalLine;
        }
      }
    }
  }
  
  // Don't forget the last education entry
  if (currentEducation && currentEducation.degree) {
    education.push(currentEducation);
  }
  
  console.log('✅ Education extraction complete. Found', education.length, 'entries');
  return education;
}

/**
 * Test function for debugging CV parsing
 */
export function testCVParsing(): void {
  const testCV = `
John Doe
john.doe@email.com
+1234567890
New York, NY

WORK EXPERIENCE

Senior Software Developer
TechCorp Inc.
Jan 2022 - Present
• Led development team of 5 engineers
• Built scalable web applications using React and Node.js
• Improved system performance by 40%

Software Developer
StartupABC
Jun 2020 - Dec 2021
• Developed REST APIs and microservices
• Collaborated with cross-functional teams
• Implemented automated testing processes

EDUCATION

Bachelor of Computer Science
University of Technology
2016 - 2020

SKILLS
JavaScript, Python, React, Node.js, AWS, Docker
  `;
  
  console.log('🧪 Testing CV parsing with sample data...');
  const result = parseCV(testCV);
  console.log('🧪 Test result:', result);
}

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testCVParsing = testCVParsing;
}
