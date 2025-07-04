/**
 * ATS (Applicant Tracking System) Analyzer
 * Comprehensive analysis of CV compatibility with ATS systems
 */

import { CVData, ATSAnalysis, KeywordAnalysis, FormatAnalysis, ContentAnalysis, ATSSuggestion, JobDescription } from '../types';

/**
 * Main function to analyze CV for ATS compatibility
 */
export async function analyzeATS(cvData: CVData, jobDescriptionText: string = ''): Promise<ATSAnalysis> {
  const jobDescription = parseJobDescription(jobDescriptionText);
  
  // Perform individual analyses
  const keywordAnalysis = analyzeKeywords(cvData, jobDescription);
  const formatAnalysis = analyzeFormat(cvData);
  const contentAnalysis = analyzeContent(cvData);
  
  // Calculate more realistic overall score with penalties for common issues
  let baseScore = Math.round(
    keywordAnalysis.score * 0.4 + // 40% weight on keywords
    formatAnalysis.score * 0.3 + // 30% weight on format
    contentAnalysis.score * 0.3   // 30% weight on content
  );
  
  // Apply realistic penalties for common CV issues
  let overallScore = baseScore;
  
  // Major penalty if no job description provided (keyword matching impossible)
  if (!jobDescriptionText.trim()) {
    overallScore = Math.min(overallScore, 75); // Cap at 75% without job description
  }
  
  // Penalty for very sparse CVs
  const cvText = getCVText(cvData);
  if (cvText.length < 500) {
    overallScore -= 15;
  }
  
  // Penalty for missing critical sections
  if (cvData.experience.length === 0) {
    overallScore -= 20;
  }
  
  if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 50) {
    overallScore -= 10;
  }
  
  if (cvData.skills.length < 3) {
    overallScore -= 15;
  }
  
  // Realistic scoring - very few CVs should score above 90%
  if (overallScore > 90) {
    overallScore = Math.min(90, overallScore - Math.floor(Math.random() * 5));
  }
  
  // Ensure minimum realistic floor
  overallScore = Math.max(25, overallScore);
  
  // Generate suggestions based on analysis
  const suggestions = generateSuggestions(keywordAnalysis, formatAnalysis, contentAnalysis, jobDescription);
  
  // Create overall feedback
  const overallFeedback = generateOverallFeedback(overallScore, keywordAnalysis, formatAnalysis, contentAnalysis);
  
  return {
    score: overallScore,
    overallFeedback,
    keywordMatch: keywordAnalysis,
    formatAnalysis,
    contentAnalysis,
    suggestions,
  };
}

/**
 * Parse job description to extract keywords and requirements
 */
function parseJobDescription(text: string): JobDescription {
  if (!text.trim()) {
    return {
      text: '',
      extractedKeywords: [],
      requiredSkills: [],
      preferredSkills: [],
    };
  }

  // Extract keywords using simple regex patterns
  const skillKeywords = extractSkillKeywords(text);
  const actionVerbs = extractActionVerbs(text);
  const technologies = extractTechnologies(text);
  
  const allKeywords = [...skillKeywords, ...actionVerbs, ...technologies];
  
  // Separate required vs preferred (basic implementation)
  const requiredSkills = extractRequiredSkills(text);
  const preferredSkills = extractPreferredSkills(text);
  
  return {
    text,
    extractedKeywords: allKeywords,
    requiredSkills,
    preferredSkills,
  };
}

/**
 * Analyze keyword matching between CV and job description
 */
function analyzeKeywords(cvData: CVData, jobDescription: JobDescription): KeywordAnalysis {
  const cvText = getCVText(cvData);
  const cvWords = cvText.toLowerCase().split(/\s+/);
  
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const keywordDensity: { [key: string]: number } = {};
  
  // If no job description, provide default industry keywords
  if (jobDescription.extractedKeywords.length === 0) {
    const defaultKeywords = ['professional', 'experience', 'skills', 'education', 'management', 'development', 'team', 'project'];
    defaultKeywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const matches = cvWords.filter(word => word.includes(keywordLower)).length;
      
      if (matches > 0) {
        matchedKeywords.push(keyword);
        keywordDensity[keyword] = matches;
      } else {
        missingKeywords.push(keyword);
      }
    });
    
    // Lower score when no job description provided
    const matchPercentage = Math.min(65, (matchedKeywords.length / defaultKeywords.length) * 100);
    return {
      matchedKeywords,
      missingKeywords,
      keywordDensity,
      score: Math.round(matchPercentage),
    };
  }
  
  // Check each keyword from job description
  jobDescription.extractedKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const matches = cvWords.filter(word => word.includes(keywordLower)).length;
    
    if (matches > 0) {
      matchedKeywords.push(keyword);
      keywordDensity[keyword] = matches;
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  // Calculate more realistic keyword match score
  const totalKeywords = jobDescription.extractedKeywords.length;
  let matchPercentage = totalKeywords > 0 ? (matchedKeywords.length / totalKeywords) * 100 : 65;
  
  // Apply realistic penalties
  if (matchPercentage > 85) {
    matchPercentage = 85 - Math.floor(Math.random() * 10); // Random reduction for realism
  }
  
  // Penalty for too many missing critical keywords
  if (missingKeywords.length > totalKeywords * 0.6) {
    matchPercentage -= 15;
  }
  
  return {
    matchedKeywords,
    missingKeywords,
    keywordDensity,
    score: Math.max(25, Math.round(matchPercentage)),
  };
}

/**
 * Analyze CV format for ATS compatibility
 */
function analyzeFormat(cvData: CVData): FormatAnalysis {
  const problematicElements: string[] = [];
  let score = 85; // Start with a more realistic base score
  
  // Check for common ATS-problematic elements
  
  // Template-based issues
  if (cvData.template.category === 'creative') {
    problematicElements.push('Creative templates may contain ATS-unfriendly design elements');
    score -= 15;
  }
  
  // Missing essential contact information
  if (!cvData.personalInfo.email) {
    problematicElements.push('Missing email address - critical for ATS parsing');
    score -= 20;
  }
  
  if (!cvData.personalInfo.phone) {
    problematicElements.push('Missing phone number - important contact information');
    score -= 15;
  }
  
  if (!cvData.personalInfo.location) {
    problematicElements.push('Missing location information - helps with geographic matching');
    score -= 10;
  }
  
  // Check for proper section structure
  if (cvData.experience.length === 0) {
    problematicElements.push('No work experience listed - critical section missing');
    score -= 25;
  }
  
  if (cvData.education.length === 0) {
    problematicElements.push('No education information provided - important for many roles');
    score -= 15;
  }
  
  if (cvData.skills.length === 0) {
    problematicElements.push('No skills listed - essential for keyword matching');
    score -= 20;
  }
  
  // Check for proper date formatting
  let dateIssues = 0;
  cvData.experience.forEach((exp, index) => {
    if (!exp.startDate || (!exp.endDate && !exp.current)) {
      problematicElements.push(`Experience entry ${index + 1} missing or incomplete dates`);
      dateIssues++;
    }
  });
  score -= dateIssues * 5;
  
  // Additional realistic formatting checks
  if (!cvData.personalInfo.name || cvData.personalInfo.name.length < 2) {
    problematicElements.push('Name field is missing or too short');
    score -= 20;
  }
  
  // Penalize overly complex templates
  if (cvData.template.category === 'modern' && score > 75) {
    score -= 5; // Minor penalty for potential complexity
  }
  
  return {
    hasProblematicElements: problematicElements.length > 0,
    problematicElements,
    hasGoodStructure: score > 60,
    score: Math.max(20, score),
  };
}

/**
 * Analyze CV content quality and completeness
 */
function analyzeContent(cvData: CVData): ContentAnalysis {
  const cvText = getCVText(cvData);
  const words = cvText.split(/\s+/);
  
  let score = 100;
  
  // Check for measurable results (numbers, percentages, etc.)
  const numberRegex = /\d+%|\d+\+|\$\d+|\d+[kmb]|\d+x/gi;
  const measurableResults = cvText.match(numberRegex) || [];
  const hasMeasurableResults = measurableResults.length > 0;
  
  if (!hasMeasurableResults) {
    score -= 25;
  }
  
  // Check for action verbs
  const actionVerbs = ['achieved', 'managed', 'led', 'developed', 'created', 'improved', 'increased', 'decreased', 'implemented', 'designed', 'built', 'optimised', 'streamlined', 'delivered', 'collaborated'];
  const hasActionVerbs = actionVerbs.some(verb => cvText.toLowerCase().includes(verb));
  
  if (!hasActionVerbs) {
    score -= 20;
  }
  
  // Check section completeness
  const sectionCompleteness = {
    personalInfo: !!cvData.personalInfo.name && !!cvData.personalInfo.email,
    summary: !!cvData.personalInfo.summary && cvData.personalInfo.summary.length > 50,
    experience: cvData.experience.length > 0,
    education: cvData.education.length > 0,
    skills: cvData.skills.length > 0,
  };
  
  const completeSections = Object.values(sectionCompleteness).filter(Boolean).length;
  const totalSections = Object.keys(sectionCompleteness).length;
  
  if (completeSections < totalSections) {
    score -= (totalSections - completeSections) * 10;
  }
  
  // Word count analysis
  const wordCount = words.length;
  if (wordCount < 200) {
    score -= 20;
  } else if (wordCount > 1000) {
    score -= 10;
  }
  
  return {
    hasMeasurableResults,
    hasActionVerbs,
    sectionCompleteness,
    wordCount,
    score: Math.max(0, score),
  };
}

/**
 * Generate actionable suggestions based on analysis
 */
function generateSuggestions(
  keywordAnalysis: KeywordAnalysis,
  formatAnalysis: FormatAnalysis,
  contentAnalysis: ContentAnalysis,
  jobDescription: JobDescription
): ATSSuggestion[] {
  const suggestions: ATSSuggestion[] = [];
  let suggestionId = 1;
  
  // Keyword suggestions
  if (keywordAnalysis.missingKeywords.length > 0) {
    const topMissing = keywordAnalysis.missingKeywords.slice(0, 5);
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'keyword',
      priority: 'high',
      title: 'Add Missing Keywords',
      description: `Consider adding these relevant keywords: ${topMissing.join(', ')}`,
      actionable: true,
      autoFixAvailable: false,
    });
  }
  
  // Format suggestions
  formatAnalysis.problematicElements.forEach(element => {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'format',
      priority: element.includes('Missing') ? 'high' : 'medium',
      title: 'Format Issue Detected',
      description: element,
      actionable: true,
      autoFixAvailable: element.includes('Missing'),
    });
  });
  
  // Content suggestions
  if (!contentAnalysis.hasMeasurableResults) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'high',
      title: 'Add Quantifiable Achievements',
      description: 'Include numbers, percentages, or metrics to demonstrate your impact (e.g., "Increased sales by 25%")',
      actionable: true,
      autoFixAvailable: false,
    });
  }
  
  if (!contentAnalysis.hasActionVerbs) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'medium',
      title: 'Use Strong Action Verbs',
      description: 'Start bullet points with powerful action verbs like "achieved," "managed," "led," or "developed"',
      actionable: true,
      autoFixAvailable: false,
    });
  }
  
  if (contentAnalysis.wordCount < 200) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'medium',
      title: 'Expand Content',
      description: 'Your CV seems too brief. Add more details about your experience and achievements.',
      actionable: true,
      autoFixAvailable: false,
    });
  }
  
  // Section completeness suggestions
  Object.entries(contentAnalysis.sectionCompleteness).forEach(([section, complete]) => {
    if (!complete) {
      suggestions.push({
        id: (suggestionId++).toString(),
        type: 'structure',
        priority: section === 'personalInfo' ? 'high' : 'medium',
        title: `Complete ${section.charAt(0).toUpperCase() + section.slice(1)} Section`,
        description: `The ${section} section needs more information to be ATS-compatible.`,
        actionable: true,
        autoFixAvailable: false,
      });
    }
  });
  
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Generate overall feedback message
 */
function generateOverallFeedback(
  score: number,
  keywordAnalysis: KeywordAnalysis,
  formatAnalysis: FormatAnalysis,
  contentAnalysis: ContentAnalysis
): string {
  if (score >= 85) {
    return "Excellent! Your CV is highly optimised for ATS systems. You have strong keyword matching, proper formatting, and quality content.";
  } else if (score >= 70) {
    return "Good work! Your CV is well-structured for ATS systems, but there are some areas for improvement to maximize your chances.";
  } else if (score >= 50) {
    return "Your CV needs some optimisation for ATS compatibility. Focus on the high-priority suggestions to improve your score.";
  } else {
    return "Your CV requires significant improvements for ATS compatibility. Please address the critical issues highlighted in the suggestions.";
  }
}

/**
 * Helper function to extract all text from CV data
 */
function getCVText(cvData: CVData): string {
  const parts: string[] = [];
  
  // Personal info
  const { personalInfo } = cvData;
  parts.push(personalInfo.name, personalInfo.summary);
  
  // Experience
  cvData.experience.forEach(exp => {
    parts.push(exp.position, exp.company, exp.description);
    parts.push(...exp.achievements);
  });
  
  // Education
  cvData.education.forEach(edu => {
    parts.push(edu.degree, edu.institution, edu.description);
  });
  
  // Skills
  parts.push(...cvData.skills);
  
  // Certifications
  cvData.certifications.forEach(cert => {
    parts.push(cert.name, cert.issuer);
  });
  
  return parts.filter(Boolean).join(' ');
}

/**
 * Extract skill keywords from job description
 */
function extractSkillKeywords(text: string): string[] {
  const commonSkills = [
    // Programming languages
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    // Frameworks
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sql server',
    // Tools
    'git', 'docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'gcp',
    // Soft skills
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    // Business skills
    'project management', 'agile', 'scrum', 'marketing', 'sales', 'customer service'
  ];
  
  const textLower = text.toLowerCase();
  return commonSkills.filter(skill => textLower.includes(skill));
}

/**
 * Extract action verbs from job description
 */
function extractActionVerbs(text: string): string[] {
  const actionVerbs = [
    'manage', 'lead', 'develop', 'create', 'implement', 'design', 'build', 'optimise',
    'improve', 'increase', 'decrease', 'streamline', 'deliver', 'collaborate', 'coordinate'
  ];
  
  const textLower = text.toLowerCase();
  return actionVerbs.filter(verb => textLower.includes(verb));
}

/**
 * Extract technology keywords from job description
 */
function extractTechnologies(text: string): string[] {
  const technologies = [
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite', 'npm', 'yarn',
    'api', 'rest', 'graphql', 'microservices', 'devops', 'ci/cd', 'testing', 'jest'
  ];
  
  const textLower = text.toLowerCase();
  return technologies.filter(tech => textLower.includes(tech));
}

/**
 * Extract required skills from job description
 */
function extractRequiredSkills(text: string): string[] {
  const requiredSections = text.match(/required.*?(?=preferred|nice to have|plus|$)/gi) || [];
  const skills: string[] = [];
  
  requiredSections.forEach(section => {
    const extractedSkills = extractSkillKeywords(section);
    skills.push(...extractedSkills);
  });
  
  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Extract preferred skills from job description
 */
function extractPreferredSkills(text: string): string[] {
  const preferredSections = text.match(/preferred|nice to have|plus.*?(?=required|$)/gi) || [];
  const skills: string[] = [];
  
  preferredSections.forEach(section => {
    const extractedSkills = extractSkillKeywords(section);
    skills.push(...extractedSkills);
  });
  
  return [...new Set(skills)]; // Remove duplicates
}
