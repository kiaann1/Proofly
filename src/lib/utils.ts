/**
 * Utility functions for Proofly CV Builder
 */

/**
 * Utility function for class name merging
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(dateObj);
};

/**
 * Format date range for experience/education
 */
export const formatDateRange = (startDate: string, endDate: string, current?: boolean): string => {
  const start = formatDate(startDate);
  if (current) {
    return `${start} - Present`;
  }
  const end = formatDate(endDate);
  return `${start} - ${end}`;
};

/**
 * Calculate duration between dates
 */
export const calculateDuration = (startDate: string, endDate: string, current?: boolean): string => {
  const start = new Date(startDate);
  const end = current ? new Date() : new Date(endDate);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  
  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month' : `${diffMonths} months`;
  }
  
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  
  if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  
  const yearText = years === 1 ? '1 year' : `${years} years`;
  const monthText = months === 1 ? '1 month' : `${months} months`;
  
  return `${yearText} ${monthText}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Extract domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

/**
 * Clean and format text
 */
export const cleanText = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file type for CV uploads
 */
export const isValidFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  
  return allowedTypes.includes(file.type);
};

/**
 * Get skill category color
 */
export const getSkillCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Programming Languages': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Frameworks & Libraries': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Databases': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Tools & Technologies': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Cloud & DevOps': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'Design & UI/UX': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'Soft Skills': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'Languages': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Marketing & Analytics': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Other': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  };
  
  return colors[category] || colors['Other'];
};

/**
 * Extract keywords from job description
 */
export const extractKeywords = (text: string): string[] => {
  // Common tech keywords and skills
  const keywords = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  
  // Filter and deduplicate
  const filtered = keywords
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word));
  
  return [...new Set(filtered)];
};

/**
 * Score text based on keyword presence
 */
export const scoreKeywordMatch = (text: string, keywords: string[]): number => {
  const textLower = text.toLowerCase();
  const matches = keywords.filter(keyword => textLower.includes(keyword.toLowerCase()));
  return keywords.length > 0 ? (matches.length / keywords.length) * 100 : 0;
};
