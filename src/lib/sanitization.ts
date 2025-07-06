/**
 * Input sanitization utilities for CV parsing
 */

/**
 * Sanitize text input to prevent XSS and code injection
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event attributes
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: urls
    .replace(/javascript:/gi, '')
    // Remove data: urls
    .replace(/data:/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
    // Limit length to prevent memory issues
    .substring(0, 10000);
}

/**
 * Check if a string is likely a URL or email
 */
export function isUrlOrEmail(text: string): boolean {
  const urlPattern = /^(https?:\/\/|www\.|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return urlPattern.test(text) || emailPattern.test(text);
}

/**
 * Check if a string is likely a skill (not a URL, email, or description)
 */
export function isValidSkill(text: string): boolean {
  if (!text || text.length < 2 || text.length > 50) return false;
  
  // Exclude URLs and emails
  if (isUrlOrEmail(text)) return false;
  
  // Exclude sentences (skills are usually short phrases)
  if (text.includes('.') && text.split(' ').length > 3) return false;
  
  // Exclude common non-skill phrases
  const excludePatterns = [
    /^(the|and|or|but|in|on|at|to|for|of|with|by)$/i,
    /years?\s+of\s+experience/i,
    /experience\s+with/i,
    /responsible\s+for/i,
    /worked\s+(with|on)/i,
    /managed\s+/i,
    /developed\s+/i,
    /created\s+/i,
    /designed\s+/i,
    /implemented\s+/i
  ];
  
  return !excludePatterns.some(pattern => pattern.test(text));
}

/**
 * Clean and validate a skill entry
 */
export function cleanSkill(skill: string): string | null {
  const cleaned = sanitizeText(skill)
    .replace(/^[-•*\s]+/, '') // Remove bullet points
    .replace(/[-•*\s]+$/, '') // Remove trailing bullet points
    .trim();
    
  return isValidSkill(cleaned) ? cleaned : null;
}
