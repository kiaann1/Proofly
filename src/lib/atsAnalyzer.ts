/**
 * ATS (Applicant Tracking System) Analyser
 * Comprehensive analysis of CV compatibility with ATS systems
 */

import { CVData, ATSAnalysis, KeywordAnalysis, FormatAnalysis, ContentAnalysis, ATSSuggestion, JobDescription } from '../types';

// ============================================================================
// HELPER FUNCTIONS - Industry Detection & Smart Analysis
// ============================================================================

/**
 * Detect industry from job description text
 */
function detectIndustry(text: string): string {
  const textLower = text.toLowerCase();
  
  const industryKeywords = {
    technology: ['software', 'developer', 'engineer', 'programming', 'coding', 'tech', 'frontend', 'backend', 'fullstack', 'devops', 'data science', 'machine learning', 'ai', 'artificial intelligence', 'cloud', 'api', 'database'],
    finance: ['financial', 'banking', 'investment', 'trading', 'fintech', 'accounting', 'audit', 'compliance', 'risk management', 'portfolio', 'analyst', 'cfa', 'cpa'],
    healthcare: ['medical', 'healthcare', 'hospital', 'clinical', 'patient', 'pharmaceutical', 'biotech', 'nursing', 'doctor', 'physician', 'medical device'],
    marketing: ['marketing', 'digital marketing', 'social media', 'content marketing', 'seo', 'sem', 'ppc', 'campaign', 'brand', 'advertising', 'growth marketing'],
    sales: ['sales', 'business development', 'account management', 'revenue', 'quota', 'pipeline', 'crm', 'lead generation', 'customer acquisition'],
    education: ['education', 'teaching', 'teacher', 'professor', 'curriculum', 'academic', 'university', 'school', 'learning', 'training'],
    retail: ['retail', 'ecommerce', 'merchandising', 'inventory', 'supply chain', 'customer service', 'store management'],
    consulting: ['consulting', 'consultant', 'advisory', 'strategy', 'transformation', 'process improvement', 'project management']
  };
  
  let maxMatches = 0;
  let detectedIndustry = 'general';
  
  Object.entries(industryKeywords).forEach(([industry, keywords]) => {
    const matches = keywords.filter(keyword => textLower.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedIndustry = industry;
    }
  });
  
  return detectedIndustry;
}

/**
 * Detect role level from job description (entry, mid, senior, executive)
 */
function detectRoleLevel(text: string): string {
  const textLower = text.toLowerCase();
  
  const levelIndicators = {
    entry: ['entry level', 'junior', 'graduate', 'intern', 'trainee', '0-2 years', 'recent graduate', 'no experience required'],
    mid: ['mid level', 'intermediate', '2-5 years', '3-7 years', 'experienced', 'professional'],
    senior: ['senior', 'lead', 'principal', '5+ years', '7+ years', 'expert', 'specialist', 'architect'],
    executive: ['director', 'manager', 'head of', 'vp', 'vice president', 'chief', 'executive', 'c-level', '10+ years', 'leadership']
  };
  
  let maxScore = 0;
  let detectedLevel = 'mid'; // Default to mid-level
  
  Object.entries(levelIndicators).forEach(([level, indicators]) => {
    const score = indicators.reduce((acc, indicator) => {
      return acc + (textLower.includes(indicator) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      detectedLevel = level;
    }
  });
  
  return detectedLevel;
}

/**
 * Detect company size from job description
 */
function detectCompanySize(text: string): string {
  const textLower = text.toLowerCase();
  
  const sizeIndicators = {
    startup: ['startup', 'early stage', 'growing team', 'small team', 'fast-paced', 'agile environment', 'wear many hats'],
    smallmedium: ['small company', 'medium company', 'family business', 'close-knit team', 'collaborative environment'],
    enterprise: ['fortune 500', 'large corporation', 'multinational', 'global company', 'enterprise', 'established company', 'thousands of employees']
  };
  
  let maxScore = 0;
  let detectedSize = 'medium'; // Default
  
  Object.entries(sizeIndicators).forEach(([size, indicators]) => {
    const score = indicators.reduce((acc, indicator) => {
      return acc + (textLower.includes(indicator) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      detectedSize = size;
    }
  });
  
  return detectedSize;
}

/**
 * Enhanced smart skill keyword extraction with industry context
 */
function extractSmartSkillKeywords(text: string, industry: string): string[] {
  const commonSkills = {
    technology: [
      // Programming languages & frameworks
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'react', 'angular', 'vue', 'svelte', 'node.js', 'express', 'django', 'flask', 'spring boot', 'laravel',
      // Databases & tools
      'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sql', 'nosql',
      'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'aws', 'azure', 'gcp',
      // Concepts
      'microservices', 'api development', 'rest', 'graphql', 'ci/cd', 'devops', 'agile', 'scrum',
      'machine learning', 'ai', 'data science', 'big data', 'analytics'
    ],
    finance: [
      'financial modeling', 'risk management', 'portfolio management', 'derivatives', 'fixed income',
      'equity research', 'quantitative analysis', 'bloomberg', 'excel', 'vba', 'sql', 'python', 'r',
      'regulatory compliance', 'basel iii', 'ifrs', 'gaap', 'sarbanes-oxley', 'aml', 'kyc',
      'trading', 'investment banking', 'asset management', 'hedge funds', 'private equity'
    ],
    marketing: [
      'digital marketing', 'content marketing', 'social media marketing', 'email marketing',
      'seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'linkedin ads',
      'marketing automation', 'hubspot', 'salesforce', 'marketo', 'mailchimp',
      'analytics', 'google analytics', 'adobe analytics', 'conversion optimization',
      'a/b testing', 'customer segmentation', 'lead generation', 'brand management'
    ],
    sales: [
      'business development', 'account management', 'lead generation', 'pipeline management',
      'crm', 'salesforce', 'hubspot', 'customer acquisition', 'revenue growth',
      'negotiation', 'relationship building', 'consultative selling', 'solution selling',
      'sales enablement', 'sales operations', 'forecasting', 'territory management'
    ],
    healthcare: [
      'clinical research', 'medical devices', 'pharmaceutical', 'regulatory affairs',
      'fda', 'gcp', 'ich', 'clinical trials', 'protocol development', 'data management',
      'biostatistics', 'pharmacovigilance', 'medical writing', 'quality assurance',
      'hipaa', 'ehr', 'electronic health records', 'telemedicine', 'healthcare analytics'
    ]
  };
  
  const industrySkills = commonSkills[industry as keyof typeof commonSkills] || commonSkills.technology;
  const textLower = text.toLowerCase();
  const foundSkills: string[] = [];
  
  // Enhanced matching with context awareness
  industrySkills.forEach(skill => {
    const skillWords = skill.toLowerCase().split(/\s+/);
    const hasAllWords = skillWords.every(word => {
      // Check for exact word match with word boundaries
      const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return wordRegex.test(textLower);
    });
    
    if (hasAllWords) {
      foundSkills.push(skill);
    }
  });
  
  // Extract skills from common patterns
  const skillPatterns = [
    /experience (?:with|in|using)\s+([^.!?\n]+)/gi,
    /proficient (?:with|in)\s+([^.!?\n]+)/gi,
    /knowledge of\s+([^.!?\n]+)/gi,
    /familiar with\s+([^.!?\n]+)/gi,
    /expertise in\s+([^.!?\n]+)/gi,
    /skilled in\s+([^.!?\n]+)/gi
  ];
  
  skillPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const skillText = match[1].trim();
      // Split by common delimiters and clean up
      const skills = skillText.split(/[,;|&+\n]/).map(s => s.trim().replace(/^(and|or)\s+/i, ''));
      skills.forEach(skill => {
        if (skill.length > 2 && skill.length < 50) {
          foundSkills.push(skill);
        }
      });
    }
  });
  
  return [...new Set(foundSkills)]; // Remove duplicates
}

/**
 * Extract action verbs from job description
 */
function extractActionVerbs(text: string): string[] {
  const actionVerbs = [
    // Leadership verbs
    'manage', 'lead', 'direct', 'supervise', 'oversee', 'coordinate', 'guide', 'mentor',
    // Development verbs
    'develop', 'create', 'build', 'design', 'implement', 'establish', 'construct', 'engineer',
    // Improvement verbs
    'improve', 'optimise', 'enhance', 'streamline', 'refactor', 'modernise', 'upgrade',
    // Achievement verbs
    'achieve', 'accomplish', 'deliver', 'complete', 'execute', 'perform', 'attain',
    // Analysis verbs
    'analyse', 'evaluate', 'assess', 'research', 'investigate', 'examine', 'review',
    // Communication verbs
    'communicate', 'present', 'collaborate', 'negotiate', 'facilitate', 'consult',
    // Quantifiable verbs
    'increase', 'decrease', 'reduce', 'maximise', 'minimise', 'boost', 'accelerate',
    // Process verbs
    'automate', 'standardise', 'integrate', 'deploy', 'maintain', 'monitor', 'troubleshoot'
  ];
  
  const textLower = text.toLowerCase();
  const foundVerbs: string[] = [];
  
  actionVerbs.forEach(verb => {
    const verbRegex = new RegExp(`\\b${verb}[ds]?\\b`, 'i'); // Include variations like managed, manages
    if (verbRegex.test(textLower)) {
      foundVerbs.push(verb);
    }
  });
  
  return [...new Set(foundVerbs)];
}

/**
 * Extract technology keywords from job description
 */
function extractTechnologies(text: string): string[] {
  const technologies = [
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite', 'npm', 'yarn',
    'api', 'rest', 'graphql', 'microservices', 'devops', 'ci/cd', 'testing', 'jest',
    'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github'
  ];
  
  const textLower = text.toLowerCase();
  return technologies.filter(tech => {
    const techRegex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return techRegex.test(textLower);
  });
}

/**
 * Enhanced technical term extraction
 */
function extractTechnicalTerms(text: string, industry: string): string[] {
  const industryTerms = {
    technology: [
      // Programming concepts
      'object-oriented', 'functional programming', 'design patterns', 'algorithms', 'data structures',
      'microservices', 'api design', 'database design', 'system architecture', 'scalability',
      // Development practices
      'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'ci/cd', 'devops', 'version control',
      // Technologies
      'machine learning', 'artificial intelligence', 'blockchain', 'cloud computing',
      'containerization', 'orchestration', 'serverless', 'edge computing'
    ],
    finance: [
      'financial modeling', 'risk assessment', 'portfolio management', 'derivatives',
      'fixed income', 'equity research', 'quantitative analysis', 'regulatory compliance',
      'aml', 'kyc', 'basel iii', 'ifrs', 'gaap', 'sarbanes-oxley'
    ],
    healthcare: [
      'clinical trials', 'fda approval', 'medical devices', 'hipaa compliance',
      'electronic health records', 'telemedicine', 'biostatistics', 'pharmacovigilance'
    ],
    marketing: [
      'conversion optimization', 'a/b testing', 'customer segmentation', 'marketing automation',
      'lead scoring', 'attribution modeling', 'customer lifetime value', 'funnel optimization'
    ]
  };
  
  const terms = industryTerms[industry as keyof typeof industryTerms] || [];
  const textLower = text.toLowerCase();
  
  return terms.filter(term => textLower.includes(term));
}

/**
 * Extract skills from structured sections (bullet points, lists, etc.)
 */
function extractFromStructuredSections(text: string): string[] {
  const skills: string[] = [];
  
  // Extract from bullet points
  const bulletRegex = /[•·▪▫-]\s*([^\n\r•·▪▫-]+)/g;
  let match;
  while ((match = bulletRegex.exec(text)) !== null) {
    const skill = match[1].trim();
    if (skill.length > 2 && skill.length < 50) {
      skills.push(skill);
    }
  }
  
  // Extract from numbered lists
  const numberedRegex = /\d+\.\s*([^\n\r\d]+)/g;
  while ((match = numberedRegex.exec(text)) !== null) {
    const skill = match[1].trim();
    if (skill.length > 2 && skill.length < 50) {
      skills.push(skill);
    }
  }
  
  // Extract skills from requirements sections
  const requirementsRegex = /(?:requirements?|qualifications?|skills?|experience)[:\s]*([^.!?\n]+)/gi;
  while ((match = requirementsRegex.exec(text)) !== null) {
    const skillSection = match[1];
    // Split by common delimiters
    const skillParts = skillSection.split(/[,;|&+]/);
    skillParts.forEach(part => {
      const cleanSkill = part.trim().replace(/^(and|or)\s+/i, '');
      if (cleanSkill.length > 2 && cleanSkill.length < 50) {
        skills.push(cleanSkill);
      }
    });
  }
  
  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Prioritize keywords based on context, industry, and role level
 */
function prioritizeKeywords(keywords: string[], text: string, industry: string, roleLevel: string): string[] {
  const textLower = text.toLowerCase();
  
  // Create priority score for each keyword
  const keywordScores = keywords.map(keyword => {
    let score = 1; // Base score
    const keywordLower = keyword.toLowerCase();
    
    // Higher priority for keywords mentioned multiple times
    const occurrences = (textLower.match(new RegExp(keywordLower, 'g')) || []).length;
    score += occurrences * 0.5;
    
    // Higher priority for keywords in important sections
    if (textLower.includes(`required`) && textLower.indexOf(`required`) < textLower.indexOf(keywordLower)) {
      score += 2;
    }
    
    if (textLower.includes(`must have`) && textLower.indexOf(`must have`) < textLower.indexOf(keywordLower)) {
      score += 2;
    }
    
    if (textLower.includes(`essential`) && textLower.indexOf(`essential`) < textLower.indexOf(keywordLower)) {
      score += 1.5;
    }
    
    // Industry-specific priority boosts
    const industryBoosts = {
      technology: ['programming', 'coding', 'development', 'software', 'technical'],
      finance: ['financial', 'analysis', 'modeling', 'risk', 'compliance'],
      healthcare: ['clinical', 'medical', 'patient', 'healthcare', 'regulatory'],
      marketing: ['marketing', 'digital', 'campaign', 'analytics', 'growth'],
      sales: ['sales', 'revenue', 'business development', 'account', 'pipeline']
    };
    
    const boostTerms = industryBoosts[industry as keyof typeof industryBoosts] || [];
    if (boostTerms.some(term => keywordLower.includes(term))) {
      score += 1;
    }
    
    // Role level adjustments
    if (roleLevel === 'senior' || roleLevel === 'executive') {
      const leadershipTerms = ['lead', 'manage', 'strategy', 'architecture', 'design'];
      if (leadershipTerms.some(term => keywordLower.includes(term))) {
        score += 1.5;
      }
    }
    
    return { keyword, score };
  });
  
  // Sort by score and return top keywords (limit to reasonable number)
  return keywordScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 25) // Limit to top 25 keywords
    .map(item => item.keyword);
}

/**
 * Extract required skills from job description with enhanced parsing
 */
function extractRequiredSkills(text: string): string[] {
  const requiredSections = text.match(/(?:required|must have|essential|mandatory)[\s\S]*?(?=preferred|nice to have|plus|desirable|we offer|benefits|$)/gi) || [];
  const skills: string[] = [];
  
  requiredSections.forEach(section => {
    const extractedSkills = extractSmartSkillKeywords(section, detectIndustry(text));
    skills.push(...extractedSkills);
  });
  
  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Extract preferred skills from job description with enhanced parsing
 */
function extractPreferredSkills(text: string): string[] {
  const preferredSections = text.match(/(?:preferred|nice to have|plus|desirable|bonus)[\s\S]*?(?=required|must have|essential|we offer|benefits|$)/gi) || [];
  const skills: string[] = [];
  
  preferredSections.forEach(section => {
    const extractedSkills = extractSmartSkillKeywords(section, detectIndustry(text));
    skills.push(...extractedSkills);
  });
  
  return [...new Set(skills)]; // Remove duplicates
}

// ============================================================================
// MAIN ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Main function to analyse CV for ATS compatibility
 * Uses setTimeout to prevent blocking the UI thread
 */
export async function analyzeATS(cvData: CVData, jobDescriptionText: string = ''): Promise<ATSAnalysis> {
  // Use setTimeout to yield control and prevent UI blocking
  return new Promise((resolve) => {
    setTimeout(() => {
      const jobDescription = parseJobDescription(jobDescriptionText);
      
      // Perform individual analyses
      const keywordAnalysis = analyzeKeywords(cvData, jobDescription);
      const formatAnalysis = analyzeFormat(cvData);
      const contentAnalysis = analyzeContent(cvData);
      
      // Calculate overall score with different weighting based on job description availability
      let baseScore;
      if (!jobDescriptionText.trim()) {
        // When no job description is provided, focus on format and content only
        baseScore = Math.round(
          formatAnalysis.score * 0.5 + // 50% weight on format
          contentAnalysis.score * 0.5   // 50% weight on content
        );
      } else {
        // Normal weighting when job description is available
        baseScore = Math.round(
          keywordAnalysis.score * 0.4 + // 40% weight on keywords
          formatAnalysis.score * 0.3 + // 30% weight on format
          contentAnalysis.score * 0.3   // 30% weight on content
        );
      }
      
      // Apply realistic penalties for common CV issues
      let overallScore = baseScore;
      
      // Major penalty if no job description provided (keyword matching impossible)
      if (!jobDescriptionText.trim()) {
        overallScore = Math.min(overallScore, 65); // Cap at 65% without job description
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
      const suggestions = generateSuggestions(keywordAnalysis, formatAnalysis, contentAnalysis, jobDescription, cvData);
      
      // Create overall feedback
      const overallFeedback = generateOverallFeedback(overallScore, keywordAnalysis, formatAnalysis, contentAnalysis);
      
      resolve({
        score: overallScore,
        overallFeedback,
        keywordMatch: keywordAnalysis,
        formatAnalysis,
        contentAnalysis,
        suggestions,
      });
    }, 0); // Use 0ms timeout to yield control immediately
  });
}

/**
 * Parse job description to extract keywords and requirements with smart analysis
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

  // Enhanced smart extraction with industry context
  const industry = detectIndustry(text);
  const roleLevel = detectRoleLevel(text);
  const companySize = detectCompanySize(text);
  
  const skillKeywords = extractSmartSkillKeywords(text, industry);
  const actionVerbs = extractActionVerbs(text);
  const technologies = extractTechnologies(text);
  const technicalTerms = extractTechnicalTerms(text, industry);
  const structuredSkills = extractFromStructuredSections(text);
  
  // Combine and prioritize keywords based on context
  const allKeywords = [...skillKeywords, ...actionVerbs, ...technologies, ...technicalTerms, ...structuredSkills];
  const prioritizedKeywords = prioritizeKeywords(allKeywords, text, industry, roleLevel);
  
  // Enhanced required vs preferred parsing
  const requiredSkills = extractRequiredSkills(text);
  const preferredSkills = extractPreferredSkills(text);
  
  return {
    text,
    extractedKeywords: prioritizedKeywords,
    requiredSkills,
    preferredSkills,
  };
}

/**
 * Analyze keyword matching between CV and job description
 */
function analyzeKeywords(cvData: CVData, jobDescription: JobDescription): KeywordAnalysis {
  const cvText = getCVText(cvData);
  const cvWords = new Set(cvText.toLowerCase().split(/\W+/).filter(word => word.length > 2));
  
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const keywordDensity: { [key: string]: number } = {};
  
  // Helper function to check if a keyword exists in CV text
  const checkKeywordMatch = (keyword: string): boolean => {
    const keywordLower = keyword.toLowerCase().trim();
    const keywordWords = keywordLower.split(/\W+/).filter(word => word.length > 2);
    
    // Check for exact matches and partial matches
    return keywordWords.some(kw => {
      // Exact word match
      if (cvWords.has(kw)) return true;
      
      // Check for plurals/variations (e.g., skill/skills, manage/management)
      const variations = [
        kw + 's', kw + 'ing', kw + 'ed', kw + 'er', kw + 'ment',
        kw.endsWith('s') ? kw.slice(0, -1) : null,
        kw.endsWith('ing') ? kw.slice(0, -3) : null,
        kw.endsWith('ed') ? kw.slice(0, -2) : null,
        kw.endsWith('er') ? kw.slice(0, -2) : null,
        kw.endsWith('ment') ? kw.slice(0, -4) : null,
      ].filter(Boolean);
      
      return variations.some(variation => cvWords.has(variation as string));
    });
  };
  
  // Count keyword occurrences more accurately
  const countKeywordOccurrences = (keyword: string): number => {
    const keywordLower = keyword.toLowerCase();
    const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*\\b`, 'gi');
    const matches = cvText.match(regex);
    return matches ? matches.length : 0;
  };
  
  // If no job description, return empty analysis to indicate no keywords to match
  if (jobDescription.extractedKeywords.length === 0) {
    return {
      matchedKeywords: [],
      missingKeywords: [],
      keywordDensity: {},
      score: 0, // Score 0 when no job description provided
    };
  }
  
  // Check each keyword from job description with improved matching
  jobDescription.extractedKeywords.forEach(keyword => {
    if (checkKeywordMatch(keyword)) {
      matchedKeywords.push(keyword);
      keywordDensity[keyword] = countKeywordOccurrences(keyword);
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
  jobDescription: JobDescription,
  cvData?: CVData
): ATSSuggestion[] {
  const suggestions: ATSSuggestion[] = [];
  let suggestionId = 1;
  
  // Check if job description is provided
  const hasJobDescription = jobDescription.text.trim().length > 0;
  
  // If no job description, provide guidance on adding one first
  if (!hasJobDescription) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'guidance',
      priority: 'high',
      title: 'Add Job Description for Keyword Analysis',
      description: 'To get accurate keyword matching and targeted suggestions, please add the job description you\'re applying for in the "Job Description" tab.',
      actionable: false,
      autoFixAvailable: false,
      whyImportant: 'ATS systems compare your CV against specific job requirements. Without the job description, we cannot provide targeted keyword recommendations or measure relevance to the specific role.',
      howToImplement: 'Copy and paste the complete job description from the job posting into the "Job Description" tab, then return here for a comprehensive analysis.',
    });
  }
  
  // Keyword Suggestions (only if job description is provided)
  if (hasJobDescription && keywordAnalysis.missingKeywords.length > 0) {
    const criticalKeywords = keywordAnalysis.missingKeywords.slice(0, 3);
    const mediumKeywords = keywordAnalysis.missingKeywords.slice(3, 8);
    
    if (criticalKeywords.length > 0) {
      suggestions.push({
        id: (suggestionId++).toString(),
        type: 'keyword',
        priority: 'high',
        title: `Add ${criticalKeywords.length} Critical Keywords`,
        description: `These high-impact keywords are missing from your CV: ${criticalKeywords.join(', ')}. Consider incorporating them into your professional summary, experience descriptions, or skills section.`,
        actionable: true,
        autoFixAvailable: true,
        whyImportant: 'ATS systems scan for specific keywords to match your CV with job requirements. Missing critical keywords can result in your application being filtered out before human review.',
        howToImplement: 'Add these keywords naturally to your professional summary, work experience bullet points, or skills section. Ensure they accurately reflect your experience and avoid keyword stuffing.',
      });
    }
    
    if (mediumKeywords.length > 0) {
      suggestions.push({
        id: (suggestionId++).toString(),
        type: 'keyword',
        priority: 'medium',
        title: `Consider Adding ${mediumKeywords.length} Additional Keywords`,
        description: `These relevant keywords could strengthen your application: ${mediumKeywords.join(', ')}. Include them where they naturally fit your experience.`,
        actionable: true,
        autoFixAvailable: true,
        whyImportant: 'Additional relevant keywords increase your chances of ranking higher in ATS searches and demonstrate broader competency alignment with the role.',
        howToImplement: 'Review your work experience and add these keywords where they genuinely apply. Use variations in bullet points and ensure they match your actual skills and experience.',
      });
    }
  }
  
  // Professional Summary Enhancement
  if (!cvData?.personalInfo?.summary || cvData.personalInfo.summary.length < 100) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'high',
      title: 'Enhance Professional Summary',
      description: 'Your professional summary should be 3-4 sentences highlighting your key qualifications, years of experience, and career objectives. Include 2-3 keywords from the job description.',
      actionable: true,
      autoFixAvailable: true,
      whyImportant: 'The professional summary is often the first section ATS systems and recruiters read. A strong summary with relevant keywords significantly improves your chances of passing initial screening.',
      howToImplement: 'Write 3-4 sentences: Start with your job title and years of experience, highlight 2-3 key achievements with numbers, mention relevant skills from the job posting, and end with your career objective.',
    });
  }
  
  // Skills Section Optimization
  if (!cvData?.skills || cvData.skills.length < 5) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'high',
      title: 'Expand Skills Section',
      description: 'Add more relevant technical and soft skills. Aim for 8-12 skills that match the job requirements. Include both technical tools and transferable skills.',
      actionable: true,
      autoFixAvailable: true,
      whyImportant: 'A comprehensive skills section helps ATS systems match your profile with job requirements and shows recruiters your full capability range.',
      howToImplement: 'List technical skills from the job posting, add software proficiencies, include relevant certifications, and mention key soft skills like leadership or communication.',
    });
  }
  
  // Experience Quantification
  if (!contentAnalysis.hasMeasurableResults) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'high',
      title: 'Add Quantifiable Achievements',
      description: 'Include specific numbers, percentages, or time frames in your achievements. Examples: "Increased sales by 25%", "Managed team of 10", "Reduced processing time by 30%".',
      actionable: true,
      autoFixAvailable: false,
      whyImportant: 'Quantified achievements demonstrate tangible impact and results. They make your accomplishments more credible and help you stand out from other candidates who use vague descriptions.',
      howToImplement: 'Review each bullet point and ask: How much? How many? How often? By what percentage? Add specific metrics like revenue increases, cost savings, team sizes, project timelines, or process improvements.',
    });
  }
  
  // Action Verbs Enhancement
  if (!contentAnalysis.hasActionVerbs) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'medium',
      title: 'Use Stronger Action Verbs',
      description: 'Replace weak verbs with powerful action words. Instead of "responsible for", use "managed", "led", "developed", "implemented", "optimised", "achieved".',
      actionable: true,
      autoFixAvailable: true,
      whyImportant: 'Strong action verbs make your CV more dynamic and impactful. They clearly demonstrate your active role in achievements and help you stand out to both ATS systems and human recruiters.',
      howToImplement: 'Start each bullet point with a strong action verb. Replace passive phrases like "was responsible for" with active verbs like "managed", "developed", "implemented", or "achieved".',
    });
  }
  
  // Experience Section Completeness
  if (!cvData?.experience || cvData.experience.length === 0) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'structure',
      priority: 'high',
      title: 'Add Work Experience',
      description: 'Include your work history with job titles, company names, dates, and 3-5 bullet points describing your key achievements and responsibilities.',
      actionable: true,
      autoFixAvailable: false,
      whyImportant: 'Work experience is the most important section for most roles. It demonstrates your practical skills, career progression, and relevant background.',
      howToImplement: 'List your recent roles in reverse chronological order. Include job title, company name, dates, and 3-5 bullet points highlighting your key achievements and responsibilities.',
    });
  } else if (cvData.experience.some(exp => exp.achievements.length < 2)) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'medium',
      title: 'Expand Job Descriptions',
      description: 'Each role should have 3-5 bullet points describing specific achievements and responsibilities. Focus on results and impact rather than duties.',
      actionable: true,
      autoFixAvailable: false,
      whyImportant: 'Detailed job descriptions provide context for your experience and help recruiters understand your capabilities and achievements.',
      howToImplement: 'For each role, add 3-5 bullet points focusing on achievements rather than duties. Use the STAR method (Situation, Task, Action, Result) to structure your descriptions.',
    });
  }
  
  // Format suggestions with more detail
  formatAnalysis.problematicElements.forEach(element => {
    let priority: 'high' | 'medium' | 'low' = 'medium';
    let enhancedDescription = element;
    let whyImportant = 'Proper formatting ensures your CV is ATS-friendly and presents a professional appearance to recruiters.';
    let howToImplement = 'Review and update the formatting to meet professional standards.';
    
    if (element.includes('Missing')) {
      priority = 'high';
      if (element.includes('contact')) {
        enhancedDescription = 'Add complete contact information including phone number, professional email, and location (city, state). Consider adding LinkedIn profile.';
        whyImportant = 'Contact information is essential for recruiters to reach you. Missing contact details can result in missed opportunities.';
        howToImplement = 'Add your full name, professional email address, phone number, and location. Include LinkedIn profile URL for professional networking.';
      }
    }
    
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'format',
      priority,
      title: 'Format Optimisation',
      description: enhancedDescription,
      actionable: true,
      autoFixAvailable: element.includes('Missing'),
      whyImportant,
      howToImplement,
    });
  });
  
  // Advanced ATS Optimization
  if (keywordAnalysis.score < 70) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'keyword',
      priority: 'medium',
      title: 'Improve Keyword Density',
      description: 'Your keyword match score is below 70%. Review the job description and naturally incorporate more relevant terms throughout your CV.',
      actionable: true,
      autoFixAvailable: false,
      whyImportant: 'ATS systems rank CVs based on keyword matching. A higher keyword score increases your chances of passing the initial screening and reaching human recruiters.',
      howToImplement: 'Compare your CV with the job description. Identify missing keywords and incorporate them naturally into your experience descriptions, skills section, and professional summary.',
    });
  }
  
  // Education Enhancement
  if (!contentAnalysis.sectionCompleteness.education) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'structure',
      priority: 'low',
      title: 'Add Education Section',
      description: 'Include your educational background with degree, institution, graduation year, and relevant coursework or honors.',
      actionable: true,
      autoFixAvailable: false,
      whyImportant: 'Educational qualifications demonstrate your foundational knowledge and may be required for certain roles. Some ATS systems specifically look for education credentials.',
      howToImplement: 'Add a dedicated education section listing your degrees in reverse chronological order. Include degree name, institution, graduation year, and any relevant honors or coursework.',
    });
  }
  
  // Content length check
  if (contentAnalysis.wordCount < 200) {
    suggestions.push({
      id: (suggestionId++).toString(),
      type: 'content',
      priority: 'medium',
      title: 'Expand Content',
      description: 'Your CV seems too brief. Add more details about your experience and achievements.',
      actionable: true,
      autoFixAvailable: false,
      whyImportant: 'A CV that is too brief may lack sufficient detail to demonstrate your qualifications. Most effective CVs contain enough content to showcase your experience and achievements comprehensively.',
      howToImplement: 'Expand your work experience descriptions with more specific achievements and responsibilities. Add quantifiable results, additional skills, and relevant projects or certifications.',
    });
  }
  
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
    return "Good work! Your CV is well-structured for ATS systems, but there are some areas for improvement to maximise your chances.";
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
