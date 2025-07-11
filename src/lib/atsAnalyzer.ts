import {
  CVData,
  Experience,
  Education,
  Certification,
  ATSAnalysis,
  KeywordAnalysis,
  FormatAnalysis,
  ContentAnalysis,
  JobDescription,
  ATSSuggestion
} from '../types';
import { getSmolLMSuggestion } from './smollm';
import { getLLMRecommendations } from './llmAiAnalyzer';
import { getLLMContentSuggestions } from './llmContentChecker';

/**
 * Enhanced ATS Format Checker based on ResumeHelp recommendations
 * Checks for ATS-friendly formatting issues that can cause parsing failures
 */
interface ATSFormatIssue {
  type: 'graphics' | 'special_chars' | 'font' | 'layout' | 'headers' | 'typos' | 'file_format';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
  position?: string;
}

interface EnhancedFormatAnalysis extends FormatAnalysis {
  formatIssues: ATSFormatIssue[];
  atsCompatibilityScore: number; // 0-100, with 80+ being ATS-friendly
  readableByATS: boolean;
}

/**
 * Check for ATS-unfriendly formatting issues
 */
function checkATSFormatting(cvData: CVData): ATSFormatIssue[] {
  const issues: ATSFormatIssue[] = [];
  
  // Combine all text content for analysis
  const allText = [
    cvData.personalInfo?.name || '',
    cvData.personalInfo?.email || '',
    cvData.personalInfo?.phone || '',
    cvData.personalInfo?.location || '',
    cvData.personalInfo?.summary || '',
    ...cvData.experience?.map((exp: Experience) => `${exp.company} ${exp.position} ${exp.description} ${exp.achievements?.join(' ') || ''}`) || [],
    ...cvData.education?.map((edu: Education) => `${edu.institution} ${edu.degree} ${edu.gpa || ''}`) || [],
    cvData.skills?.join(' ') || '',
    ...cvData.certifications?.map((cert: Certification) => `${cert.name} ${cert.issuer}`) || []
  ].join(' ');
  
  // 1. Check for special characters that can break ATS parsing
  const problematicChars = /[•▪▫►▸‣⁃◦‧∙❖❯❱⟩]/g;
  if (problematicChars.test(allText)) {
    issues.push({
      type: 'special_chars',
      severity: 'high',
      message: 'Contains special bullet characters that may not be readable by ATS',
      suggestion: 'Use standard bullet points (•) or hyphens (-) instead of decorative bullets',
      position: 'Throughout CV'
    });
  }
  
  // 2. Check for graphics/images indicators (we can't detect actual images, but look for references)
  const imageReferences = /\b(image|photo|picture|logo|graphic|chart|diagram)\b/gi;
  if (imageReferences.test(allText)) {
    issues.push({
      type: 'graphics',
      severity: 'critical',
      message: 'References to images or graphics detected',
      suggestion: 'Remove all images, photos, charts, and graphics as ATS cannot read visual elements',
      position: 'Visual elements'
    });
  }
  
  // 3. Check for typos and misspellings (basic check)
  const commonTypos = [
    { wrong: 'recieve', correct: 'receive' },
    { wrong: 'seperate', correct: 'separate' },
    { wrong: 'occured', correct: 'occurred' },
    { wrong: 'definately', correct: 'definitely' },
    { wrong: 'managment', correct: 'management' },
    { wrong: 'developement', correct: 'development' },
    { wrong: 'experiance', correct: 'experience' },
    { wrong: 'responsibilty', correct: 'responsibility' },
    { wrong: 'acheivement', correct: 'achievement' },
    { wrong: 'sucessful', correct: 'successful' }
  ];
  
  commonTypos.forEach(typo => {
    const typoRegex = new RegExp(`\\b${typo.wrong}\\b`, 'gi');
    if (typoRegex.test(allText)) {
      issues.push({
        type: 'typos',
        severity: 'high',
        message: `Potential typo detected: "${typo.wrong}"`,
        suggestion: `Check spelling - should be "${typo.correct}"`,
        position: 'Content'
      });
    }
  });
  
  // 4. Check for header/footer content (simulate by checking for contact info placement)
  if (cvData.personalInfo?.name && cvData.personalInfo.name.length < 3) {
    issues.push({
      type: 'headers',
      severity: 'medium',
      message: 'Name appears to be too short or in header/footer',
      suggestion: 'Ensure your name and contact information are in the main document body, not in headers/footers',
      position: 'Personal Information'
    });
  }
  
  // 5. Check for creative formatting indicators
  const creativeFmatting = /\b(creative|unique|innovative)\s+(layout|design|format|template)\b/gi;
  if (creativeFmatting.test(allText)) {
    issues.push({
      type: 'layout',
      severity: 'medium',
      message: 'References to creative formatting detected',
      suggestion: 'Use a traditional, simple layout with standard section headings for better ATS compatibility',
      position: 'Layout'
    });
  }
  
  // 6. Check for insufficient content (empty sections)
  const emptySections = [];
  if (!cvData.personalInfo?.summary || cvData.personalInfo.summary.trim().length < 50) {
    emptySections.push('Professional Summary');
  }
  if (!cvData.experience || cvData.experience.length === 0) {
    emptySections.push('Work Experience');
  }
  if (!cvData.skills || cvData.skills.length === 0) {
    emptySections.push('Skills');
  }
  
  if (emptySections.length > 0) {
    issues.push({
      type: 'layout',
      severity: 'critical',
      message: `Missing or insufficient content in: ${emptySections.join(', ')}`,
      suggestion: 'Add substantial content to all major CV sections. ATS scores lower for incomplete profiles.',
      position: 'Content completeness'
    });
  }
  
  return issues;
}

/**
 * Calculate ATS compatibility score based on format analysis
 */
function calculateATSCompatibilityScore(formatIssues: ATSFormatIssue[], cvData: CVData): number {
  let score = 100;
  
  // Deduct points based on issue severity
  formatIssues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        score -= 25;
        break;
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 8;
        break;
      case 'low':
        score -= 3;
        break;
    }
  });
  
  // Additional scoring based on content completeness
  const contentScore = calculateContentCompletenessScore(cvData);
  score = Math.min(score, contentScore + 20); // Content affects overall ATS score
  
  return Math.max(0, Math.round(score));
}

/**
 * Calculate content completeness score (impacts ATS success)
 */
function calculateContentCompletenessScore(cvData: CVData): number {
  let score = 0;
  
  // Personal information completeness (20 points)
  if (cvData.personalInfo?.name && cvData.personalInfo.name.length > 2) score += 5;
  if (cvData.personalInfo?.email && cvData.personalInfo.email.includes('@')) score += 5;
  if (cvData.personalInfo?.phone && cvData.personalInfo.phone.length > 5) score += 5;
  if (cvData.personalInfo?.summary && cvData.personalInfo.summary.length > 100) score += 5;
  
  // Work experience completeness (40 points)
  if (cvData.experience && cvData.experience.length > 0) {
    score += 15;
    // Calculate average experience description length
    const avgExpLength = cvData.experience.reduce((acc: number, exp: Experience) => {
      return acc + (exp.description ? exp.description.length : 0);
    }, 0) / (cvData.experience.length || 1);
    if (avgExpLength > 100) score += 15;
    
    const hasAchievements = cvData.experience.some((exp: Experience) => 
      exp.achievements && exp.achievements.length > 0);
    if (hasAchievements) score += 10;
  }
  
  // Skills section (20 points)
  if (cvData.skills && cvData.skills.length > 0) {
    score += 10;
    if (cvData.skills.length >= 8) score += 10;
  }
  
  // Education section (10 points)
  if (cvData.education && cvData.education.length > 0) {
    score += 10;
  }
  
  // Additional sections (10 points)
  let additionalSections = 0;
  if (cvData.certifications && cvData.certifications.length > 0) additionalSections++;
  if (cvData.languages && cvData.languages.length > 0) additionalSections++;
  
  score += Math.min(additionalSections * 5, 10);
  
  return Math.min(score, 80); // Max 80 from content alone
}

/**
 * Enhanced keyword matching based on ATS best practices
 */
function enhancedKeywordMatching(cvText: string, jobDescription: string): {
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordDensity: number;
  exactMatches: number;
  synonymMatches: number;
} {
  const cvLower = cvText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Extract keywords from job description with better parsing
  const jobKeywords = extractJobKeywords(jobDescription);
  
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  let exactMatches = 0;
  let synonymMatches = 0;
  
  jobKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    
    // Check for exact matches (with word boundaries)
    const exactRegex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (exactRegex.test(cvLower)) {
      matchedKeywords.push(keyword);
      exactMatches++;
    } else {
      // Check for synonyms and variations
      const synonyms = getKeywordSynonyms(keyword);
      const foundSynonym = synonyms.some(synonym => {
        const synonymRegex = new RegExp(`\\b${synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return synonymRegex.test(cvLower);
      });
      
      if (foundSynonym) {
        matchedKeywords.push(keyword);
        synonymMatches++;
      } else {
        missingKeywords.push(keyword);
      }
    }
  });
  
  // Calculate keyword density
  const totalWords = cvText.split(/\s+/).length;
  const keywordDensity = (matchedKeywords.length / totalWords) * 100;
  
  return {
    matchedKeywords,
    missingKeywords,
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    exactMatches,
    synonymMatches
  };
}

/**
 * Extract job keywords with improved parsing
 */
function extractJobKeywords(jobDescription: string): string[] {
  const keywords = new Set<string>();
  
  // Extract skills from common patterns
  const skillPatterns = [
    /(?:required|must have|essential)[\s\S]*?([A-Za-z][A-Za-z\s\-\.]{2,30})/gi,
    /(?:experience with|proficient in|knowledge of|familiar with)[\s\S]*?([A-Za-z][A-Za-z\s\-\.]{2,30})/gi,
    /(?:skills?|technologies?|tools?)[\s\S]*?([A-Za-z][A-Za-z\s\-\.]{2,30})/gi
  ];
  
  skillPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(jobDescription)) !== null) {
      const skill = match[1].trim();
      if (skill.length > 2 && skill.length < 30) {
        keywords.add(skill);
      }
    }
  });
  
  // Extract from bullet points and lists
  const bulletRegex = /[•·▪▫-]\s*([A-Za-z][A-Za-z\s\-\.]{2,30})/g;
  let match;
  while ((match = bulletRegex.exec(jobDescription)) !== null) {
    const skill = match[1].trim();
    if (skill.length > 2 && skill.length < 30) {
      keywords.add(skill);
    }
  });
  
  return Array.from(keywords);
}

/**
 * Get synonyms for keywords to improve matching
 */
function getKeywordSynonyms(keyword: string): string[] {
  const synonymMap: { [key: string]: string[] } = {
    'javascript': ['js', 'ecmascript'],
    'typescript': ['ts'],
    'react': ['reactjs', 'react.js'],
    'vue': ['vuejs', 'vue.js'],
    'angular': ['angularjs'],
    'node': ['nodejs', 'node.js'],
    'python': ['py'],
    'artificial intelligence': ['ai', 'machine learning', 'ml'],
    'user interface': ['ui'],
    'user experience': ['ux'],
    'database': ['db', 'databases'],
    'management': ['managing', 'manage'],
    'development': ['developing', 'develop'],
    'analysis': ['analyzing', 'analyze', 'analytical'],
    'leadership': ['leading', 'lead'],
    'communication': ['communicate', 'communicating'],
    'collaboration': ['collaborate', 'collaborating'],
    'problem solving': ['problem-solving', 'troubleshooting']
  };
  
  const keywordLower = keyword.toLowerCase();
  return synonymMap[keywordLower] || [];
}

/**
 * Detect industry from text using keyword matching
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
  
  return Array.from(new Set(foundSkills)); // Remove duplicates
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
  
  return Array.from(new Set(foundVerbs));
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
  
  return Array.from(new Set(skills)); // Remove duplicates
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
  
  return Array.from(new Set(skills)); // Remove duplicates
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
  
  return Array.from(new Set(skills)); // Remove duplicates
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
      const cvText = getCVText(cvData); // Declare once at the top
      
      // Perform individual analyses including new ATS format checking
      const keywordAnalysis = analyzeKeywords(cvData, jobDescription);
      const formatAnalysis = analyzeFormat(cvData);
      const contentAnalysis = analyzeContent(cvData);
      
      // New enhanced ATS format checking based on ResumeHelp recommendations
      const atsFormatIssues = checkATSFormatting(cvData);
      const atsCompatibilityScore = calculateATSCompatibilityScore(atsFormatIssues, cvData);
      
      // Enhanced keyword matching for better accuracy
      const enhancedKeywordMatch = enhancedKeywordMatching(cvText, jobDescriptionText);
      
      // Calculate overall score with new ATS compatibility weighting
      let baseScore;
      if (!jobDescriptionText.trim()) {
        // When no job description is provided, focus on ATS compatibility and content
        baseScore = Math.round(
          atsCompatibilityScore * 0.5 + // 50% weight on ATS compatibility
          formatAnalysis.score * 0.2 + // 20% weight on general format
          contentAnalysis.score * 0.3   // 30% weight on content
        );
        // Apply major penalty for lack of job description context
        baseScore = Math.min(baseScore, 50); // Slightly higher cap with new scoring
      } else {
        // Normal weighting when job description is available
        baseScore = Math.round(
          enhancedKeywordMatch.matchedKeywords.length > 0 ? 
            (enhancedKeywordMatch.exactMatches + enhancedKeywordMatch.synonymMatches) * 2 : // Keyword relevance
            keywordAnalysis.score * 0.3 + // 30% weight on keywords
          atsCompatibilityScore * 0.3 + // 30% weight on ATS compatibility
          formatAnalysis.score * 0.2 + // 20% weight on general format
          contentAnalysis.score * 0.2   // 20% weight on content
        );
      }
      
      // Apply realistic penalties for common CV issues
      let overallScore = baseScore;
      
      // Additional penalty if no job description provided
      if (!jobDescriptionText.trim()) {
        overallScore -= 10; // Additional reduction beyond the cap
      }
      
      // Penalty for very sparse CVs
      if (cvText.length < 200) {
        overallScore -= 25; // Severe penalty for very short CVs
      } else if (cvText.length < 500) {
        overallScore -= 15;
      }
      
      // Severe penalty for missing critical sections
      if (cvData.experience.length === 0) {
        overallScore -= 25; // Increased penalty
      }
      
      if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 50) {
        overallScore -= 15; // Increased penalty
      }
      
      if (cvData.skills.length < 3) {
        overallScore -= 20; // Increased penalty
      }
      
      // Check for minimal content (likely testing scenario with "all 1s")
      const isMinimalContent = (
        cvData.personalInfo.name === "1" ||
        cvData.personalInfo.summary === "1" ||
        cvData.experience.every(exp => exp.position === "1" || exp.company === "1")
      );
      
      if (isMinimalContent) {
        overallScore = Math.min(overallScore, 35); // Cap minimal content at 35%
      }
      
      // Realistic scoring - very few CVs should score above 85%
      if (overallScore > 85) {
        overallScore = Math.min(85, overallScore - 5); // Apply a consistent penalty, not random
      }
      
      // Ensure minimum realistic floor but keep it low for poor CVs
      overallScore = Math.max(15, overallScore);
      // Generate suggestions based on analysis including new ATS format issues
      // FIX: Make setTimeout callback async to allow await
      setTimeout(async () => {
        const suggestions = await generateSuggestions(keywordAnalysis, formatAnalysis, contentAnalysis, jobDescription, cvData, atsFormatIssues, enhancedKeywordMatch);
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
      }, 0);
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
  // Company size detection (not currently used but available for future enhancements)
  // const companySize = detectCompanySize(text);
  
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
    matchPercentage = 82; // Apply consistent cap, not random
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
  let score = 60; // Start with a lower, more realistic base score
  
  // Check for common ATS-problematic elements
  
  // Template-based issues
  if (cvData.template.category === 'creative') {
    problematicElements.push('Creative templates may contain ATS-unfriendly design elements');
    score -= 15;
  }
  
  // Missing essential contact information
  if (!cvData.personalInfo.email) {
    problematicElements.push('Missing email address - critical for ATS parsing');
    score -= 25;
  }
  
  if (!cvData.personalInfo.phone) {
    problematicElements.push('Missing phone number - important contact information');
    score -= 20;
  }
  
  if (!cvData.personalInfo.location) {
    problematicElements.push('Missing location information - helps with geographic matching');
    score -= 15;
  }
  
  // Check for proper section structure
  if (cvData.experience.length === 0) {
    problematicElements.push('No work experience listed - critical section missing');
    score -= 30;
  }
  
  if (cvData.education.length === 0) {
    problematicElements.push('No education information provided - important for many roles');
    score -= 20;
  }
  
  if (cvData.skills.length === 0) {
    problematicElements.push('No skills listed - essential for keyword matching');
    score -= 25;
  }
  
  // Check for proper date formatting
  let dateIssues = 0;
  cvData.experience.forEach((exp, index) => {
    if (!exp.startDate || (!exp.endDate && !exp.current)) {
      problematicElements.push(`Experience entry ${index + 1} missing or incomplete dates`);
      dateIssues++;
    }
  });
  score -= dateIssues * 8;
  
  // Additional realistic formatting checks
  if (!cvData.personalInfo.name || cvData.personalInfo.name.length < 2) {
    problematicElements.push('Name field is missing or too short');
    score -= 25;
  }
  
  // Check for minimal content entries (test data scenario)
  const hasMinimalEntries = (
    cvData.personalInfo.name === "1" ||
    cvData.experience.some(exp => exp.position === "1" || exp.company === "1")
  );
  
  if (hasMinimalEntries) {
    problematicElements.push('CV contains placeholder or minimal content that needs proper information');
    score -= 35; // Heavy penalty for placeholder content
  }
  
  // Penalize overly complex templates
  if (cvData.template.category === 'modern' && score > 75) {
    score -= 5; // Minor penalty for potential complexity
  }
  
  return {
    hasProblematicElements: problematicElements.length > 0,
    problematicElements,
    hasGoodStructure: score > 50, // Lower threshold for good structure
    score: Math.max(10, score), // Lower minimum floor
  };
}

/**
 * Analyze CV content quality and completeness
 */
function analyzeContent(cvData: CVData): ContentAnalysis {
  const cvText = getCVText(cvData);
  const words = cvText.split(/\s+/);
  
  let score = 70; // Start with lower base score
  
  // Check for measurable results (numbers, percentages, etc.)
  const numberRegex = /\d+%|\d+\+|\$\d+|\d+[kmb]|\d+x/gi;
  const measurableResults = cvText.match(numberRegex) || [];
  const hasMeasurableResults = measurableResults.length > 0;
  
  if (!hasMeasurableResults) {
    score -= 30; // Increased penalty
  }
  
  // Check for action verbs
  const actionVerbs = ['achieved', 'managed', 'led', 'developed', 'created', 'improved', 'increased', 'decreased', 'implemented', 'designed', 'built', 'optimised', 'streamlined', 'delivered', 'collaborated'];
  const hasActionVerbs = actionVerbs.some(verb => cvText.toLowerCase().includes(verb));
  
  if (!hasActionVerbs) {
    score -= 25; // Increased penalty
  }
  
  // Check for minimal content (test scenario)
  const isMinimalContent = (
    cvData.personalInfo.name === "1" ||
    cvData.personalInfo.summary === "1" ||
    cvData.experience.some(exp => exp.position === "1" || exp.company === "1" || exp.description === "1")
  );
  
  if (isMinimalContent) {
    score -= 40; // Heavy penalty for minimal test content
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
    score -= (totalSections - completeSections) * 15; // Increased penalty
  }
  
  // Word count analysis with stricter penalties
  const wordCount = words.length;
  if (wordCount < 100) {
    score -= 35; // Severe penalty for very short CVs
  } else if (wordCount < 200) {
    score -= 25; // Increased penalty
  } else if (wordCount > 1000) {
    score -= 15; // Increased penalty for overly long CVs
  }
  
  return {
    hasMeasurableResults,
    hasActionVerbs,
    sectionCompleteness,
    wordCount,
    score: Math.max(5, score), // Lower minimum floor
  };
}

/**
 * Generate actionable suggestions based on analysis
 */
export async function generateSuggestions(
  keywordAnalysis: KeywordAnalysis,
  formatAnalysis: FormatAnalysis,
  contentAnalysis: ContentAnalysis,
  jobDescription: JobDescription,
  cvData?: CVData,
  atsFormatIssues?: ATSFormatIssue[],
  enhancedKeywordMatch?: any
): Promise<ATSSuggestion[]> {
  // Compose a prompt for the LLM to generate actionable CV suggestions
  const cvText = cvData ? getCVText(cvData) : '';
  const jobText = jobDescription?.text || '';
  const prompt = `You are an expert CV and ATS advisor. Given the following CV content: "${cvText}" and job description: "${jobText}", generate a list of 5-10 actionable, specific suggestions to improve the CV for ATS and recruiter success. Each suggestion should have a title, a short description, and a field (e.g., summary, skills, experience, education, etc). Return as JSON array with objects: {title, description, field}.`;
  let llmResult = '';
  try {
    llmResult = await getSmolLMSuggestion(prompt);
    // Try to parse the LLM output as JSON
    const suggestions = JSON.parse(llmResult);
    // Map to ATSSuggestion[]
    return suggestions.map((s: any, idx: number) => ({
      id: `llm-${idx}`,
      type: 'guidance', // changed from 'improvement' to allowed type
      priority: 'high',
      title: s.title,
      description: s.description,
      value: '',
      confidence: 99,
      field: s.field,
    }));
  } catch (e) {
    // If LLM output is not valid JSON, return a fallback
    return [
      {
        id: 'llm-fallback',
        type: 'improvement',
        priority: 'high',
        title: 'AI Suggestion Unavailable',
        description: 'The AI was unable to generate suggestions at this time.',
        value: '',
        confidence: 0,
        field: '',
      }
    ];
  }
}

/**
 * Generate overall feedback message
 */
function generateOverallFeedback(
  score: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keywordAnalysis: KeywordAnalysis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatAnalysis: FormatAnalysis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

/**
 * All ATS analysis and suggestions should be LLM-driven. Remove static checks and scoring.
 */
export async function getATSSuggestions(cvData: CVData, jobDescription?: JobDescription): Promise<ATSSuggestion[]> {
  const suggestions = await getLLMRecommendations(cvData);
  return suggestions.map((s, i) => ({
    id: `llm-${i}`,
    type: 'guidance',
    priority: 'medium',
    title: s,
    description: s,
    actionable: true
  }));
}

/**
 * ATS analysis and scoring using LLM
 */
export async function getAtsAnalysisLLM(cvData: CVData): Promise<ATSAnalysis> {
  const cvText = JSON.stringify(cvData);
  const analysis = await getLLMContentSuggestions({}, cvText);
  return {
    score: 0, // placeholder, update with real score if available
    overallFeedback: '', // placeholder, update with real feedback if available
    keywordMatch: {
      matchedKeywords: [],
      missingKeywords: [],
      keywordDensity: {},
      score: 0
    },
    formatAnalysis: {
      hasProblematicElements: false,
      problematicElements: [],
      hasGoodStructure: false,
      score: 0
    },
    contentAnalysis: {
      hasMeasurableResults: false,
      hasActionVerbs: false,
      sectionCompleteness: {},
      wordCount: 0,
      score: 0
    },
    suggestions: analysis.map((s: string, i: number) => ({
      id: `llm-${i}`,
      type: 'guidance',
      priority: 'medium',
      title: s,
      description: s,
      actionable: true
    }))
  };
}
