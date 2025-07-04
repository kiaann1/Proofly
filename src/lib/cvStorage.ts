/**
 * CV data storage and management utilities
 */

import { CVData } from '../types';

const CV_KEY = 'proofly_cv_data';

export const cvStorage = {
  /**
   * Get CV data from localStorage
   */
  getCV: (): CVData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(CV_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      return parsed;
    } catch (error) {
      console.error('Error loading CV data:', error);
      return null;
    }
  },

  /**
   * Save CV data to localStorage
   */
  saveCV: (cvData: CVData): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CV_KEY, JSON.stringify(cvData));
    } catch (error) {
      console.error('Error saving CV data:', error);
    }
  },

  /**
   * Clear CV data
   */
  clearCV: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CV_KEY);
    } catch (error) {
      console.error('Error clearing CV data:', error);
    }
  },

  /**
   * Export CV data for backup
   */
  exportCV: (cvData: CVData): string => {
    return JSON.stringify(cvData, null, 2);
  },

  /**
   * Import CV data from backup
   */
  importCV: (data: string): CVData | null => {
    try {
      const parsed = JSON.parse(data);
      
      // Validate basic structure
      if (!parsed.personalInfo || !parsed.template) {
        throw new Error('Invalid CV data structure');
      }
      
      return parsed;
    } catch (error) {
      console.error('Error importing CV data:', error);
      return null;
    }
  },
};
