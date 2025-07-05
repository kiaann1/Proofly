/**
 * Core type definitions for Proofly CV Builder
 */

// CV Builder Types
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  portfolio: string;
  salaryExpectation: string;
  showSalaryInCV: boolean;
  summary: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  template: CVTemplate;
  styling?: CVStyling;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview?: string;
  category: 'minimal' | 'classic' | 'creative' | 'modern';
}

// ATS Checker Types
export interface ATSAnalysis {
  score: number;
  overallFeedback: string;
  keywordMatch: KeywordAnalysis;
  formatAnalysis: FormatAnalysis;
  contentAnalysis: ContentAnalysis;
  suggestions: ATSSuggestion[];
}

export interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordDensity: { [key: string]: number };
  score: number;
}

export interface FormatAnalysis {
  hasProblematicElements: boolean;
  problematicElements: string[];
  hasGoodStructure: boolean;
  score: number;
}

export interface ContentAnalysis {
  hasMeasurableResults: boolean;
  hasActionVerbs: boolean;
  sectionCompleteness: { [key: string]: boolean };
  wordCount: number;
  score: number;
}

export interface ATSSuggestion {
  id: string;
  type: 'keyword' | 'format' | 'content' | 'structure';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: boolean;
  autoFixAvailable?: boolean;
}

export interface JobDescription {
  text: string;
  extractedKeywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
}

// Filter and Sort Types
export type FilterType = 'all' | 'recent' | 'experience' | 'education';
export type SortType = 'date' | 'name' | 'relevance';

// CV Styling Types
export interface CVStyling {
  name: {
    fontFamily: string;
    fontSize: string;
    color: string;
    fontWeight: string;
  };
  contact: {
    fontFamily: string;
    fontSize: string;
    color: string;
  };
  sectionTitle: {
    fontFamily: string;
    fontSize: string;
    color: string;
    fontWeight: string;
  };
  position: {
    fontFamily: string;
    fontSize: string;
    color: string;
    fontWeight: string;
  };
  company: {
    fontFamily: string;
    fontSize: string;
    color: string;
  };
  description: {
    fontFamily: string;
    fontSize: string;
    color: string;
    lineHeight: string;
  };
  skills: {
    fontFamily: string;
    fontSize: string;
    color: string;
    backgroundColor: string;
  };
}

export interface FontOption {
  value: string;
  label: string;
  category: 'serif' | 'sans-serif' | 'monospace';
}

export interface ColorOption {
  value: string;
  label: string;
  preview: string;
}
