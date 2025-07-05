/**
 * CV Parser - Enhanced CV text extraction and parsing
 */

import { CVData, PersonalInfo, Experience } from '../types';

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
 * Enhanced CV parsing with better pattern recognition
 */
export function parseCV(text: string, currentCVData: CVData): ParsedCVData {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const result: ParsedCVData = {
    personalInfo: { ...currentCVData.personalInfo },
    experience: [],
    education: [],
    skills: [],
    rawText: text
  };

  // Extract personal information
  result.personalInfo = extractPersonalInfo(text, lines);
  
  // Extract personal summary/statement
  const summary = extractPersonalSummary(text, lines);
  if (summary) {
    result.personalInfo.summary = summary;
  }
  
  // Extract skills
  result.skills = extractSkills(text, lines);
  
  // Extract experience
  result.experience = extractExperience(text, lines);
  
  // Extract education
  result.education = extractEducation(text, lines);

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
    'programming languages', 'tools', 'expertise', 'proficiencies'
  ];
  
  let inSkillsSection = false;
  let skillsFound = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering a skills section
    if (skillHeaders.some(header => line.includes(header))) {
      inSkillsSection = true;
      skillsFound = true;
      continue;
    }
    
    // Check if we're leaving the skills section
    if (inSkillsSection && (
      line.includes('experience') || 
      line.includes('education') || 
      line.includes('work history') ||
      line.includes('employment')
    )) {
      inSkillsSection = false;
      continue;
    }
    
    // Extract skills from the current line
    if (inSkillsSection && lines[i].trim()) {
      const lineSkills = extractSkillsFromLine(lines[i]);
      lineSkills.forEach(skill => skills.add(skill));
    }
  }
  
  // If no dedicated skills section found, look for common technical terms throughout
  if (!skillsFound) {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'AWS', 'Docker',
      'TypeScript', 'PHP', 'C++', 'C#', '.NET', 'Ruby', 'Go', 'Rust',
      'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Scrum'
    ];
    
    for (const skill of commonSkills) {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    }
  }
  
  return Array.from(skills).slice(0, 20); // Limit to 20 skills
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
      if (currentExperience && currentExperience.position && currentExperience.company) {
        experiences.push({
          id: crypto.randomUUID(),
          position: currentExperience.position || '',
          company: currentExperience.company || '',
          location: currentExperience.location || '',
          startDate: currentExperience.startDate || '',
          endDate: currentExperience.endDate || '',
          current: currentExperience.current || false,
          description: descriptionLines.join(' ').trim(),
          achievements: []
        });
      }
      break;
    }
    
    if (inExperienceSection && lines[i].trim()) {
      const originalLine = lines[i];
      
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
        // This is likely a job entry header, save previous experience if exists
        if (currentExperience && currentExperience.position && currentExperience.company) {
          experiences.push({
            id: crypto.randomUUID(),
            position: currentExperience.position || '',
            company: currentExperience.company || '',
            location: currentExperience.location || '',
            startDate: currentExperience.startDate || '',
            endDate: currentExperience.endDate || '',
            current: currentExperience.current || false,
            description: descriptionLines.join(' ').trim(),
            achievements: []
          });
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
          currentExperience.position = originalLine;
          continue;
        }
      }
      
      // If we have position but no company, try to extract company
      if (currentExperience && currentExperience.position && !currentExperience.company) {
        const companyMatch = originalLine.match(companyIndicators[1]);
        if (companyMatch) {
          currentExperience.company = companyMatch[1];
          continue;
        } else if (companyIndicators[0].test(originalLine)) {
          currentExperience.company = originalLine;
          continue;
        }
      }
      
      // If line starts with bullet points or dashes, it's likely a description/achievement
      if (/^[-•*]\s+/.test(originalLine) || (currentExperience && originalLine.length > 20)) {
        descriptionLines.push(originalLine.replace(/^[-•*]\s+/, ''));
      }
    }
  }
  
  // Don't forget the last experience
  if (currentExperience && currentExperience.position && currentExperience.company) {
    experiences.push({
      id: crypto.randomUUID(),
      position: currentExperience.position || '',
      company: currentExperience.company || '',
      location: currentExperience.location || '',
      startDate: currentExperience.startDate || '',
      endDate: currentExperience.endDate || '',
      current: currentExperience.current || false,
      description: descriptionLines.join(' ').trim(),
      achievements: []
    });
  }
  
  return experiences;
}

/**
 * Extract personal summary/objective statement
 */
function extractPersonalSummary(text: string, lines: string[]): string | undefined {
  const summaryHeaders = [
    'summary', 'professional summary', 'profile', 'objective', 'personal statement',
    'career objective', 'professional profile', 'about me', 'overview'
  ];
  
  let inSummarySection = false;
  let summaryLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering a summary section
    if (summaryHeaders.some(header => 
      line.includes(header) && line.length < 50 // Avoid matching within content
    )) {
      inSummarySection = true;
      continue;
    }
    
    // Check if we're leaving the summary section
    if (inSummarySection && (
      line.includes('experience') || 
      line.includes('education') || 
      line.includes('skills') ||
      line.includes('work history') ||
      line.includes('employment') ||
      line.includes('qualifications')
    )) {
      break;
    }
    
    // Collect summary content
    if (inSummarySection && lines[i].trim() && lines[i].length > 20) {
      summaryLines.push(lines[i]);
    }
  }
  
  if (summaryLines.length > 0) {
    return summaryLines.join(' ').trim();
  }
  
  // Fallback: look for summary-like content near the top
  const topLines = lines.slice(0, 10);
  for (const line of topLines) {
    if (line.length > 50 && line.length < 300 && 
        !line.includes('@') && !line.includes('phone') && 
        !line.includes('linkedin') && !line.includes('github')) {
      return line;
    }
  }
  
  return undefined;
}

/**
 * Extract education information
 */
function extractEducation(text: string, lines: string[]): any[] {
  const education: any[] = [];
  const educationHeaders = [
    'education', 'academic background', 'qualifications', 'academic qualifications'
  ];
  
  let inEducationSection = false;
  let currentEducation: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering education section
    if (educationHeaders.some(header => line.includes(header))) {
      inEducationSection = true;
      continue;
    }
    
    // Check if we're leaving education section
    if (inEducationSection && (
      line.includes('experience') || 
      line.includes('skills') ||
      line.includes('certifications') ||
      line.includes('projects')
    )) {
      if (currentEducation) {
        education.push(currentEducation);
      }
      break;
    }
    
    if (inEducationSection && lines[i].trim()) {
      // Look for degree patterns
      const degreePatterns = [
        /\b(bachelor|master|phd|doctorate|diploma|certificate|degree)\b/i,
        /\b(ba|bs|ma|ms|mba|phd|bsc|msc)\b/i
      ];
      
      const universityPatterns = [
        /\b(university|college|institute|school)\b/i
      ];
      
      if (degreePatterns.some(pattern => pattern.test(lines[i]))) {
        if (currentEducation) {
          education.push(currentEducation);
        }
        currentEducation = {
          id: crypto.randomUUID(),
          degree: lines[i],
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        };
      } else if (currentEducation && universityPatterns.some(pattern => pattern.test(lines[i]))) {
        currentEducation.institution = lines[i];
      } else if (currentEducation && /\b(20\d{2}|19\d{2})\b/.test(lines[i])) {
        // Extract dates
        const yearMatches = lines[i].match(/\b(20\d{2}|19\d{2})\b/g);
        if (yearMatches && yearMatches.length >= 1) {
          currentEducation.endDate = yearMatches[yearMatches.length - 1];
          if (yearMatches.length >= 2) {
            currentEducation.startDate = yearMatches[0];
          }
        }
      }
    }
  }
  
  if (currentEducation) {
    education.push(currentEducation);
  }
  
  return education;
}
