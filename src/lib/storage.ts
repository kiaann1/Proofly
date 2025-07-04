/**
 * Local storage utilities for Proofly CV data persistence
 */

import { CVData, PersonalInfo, Experience, Education, Certification, Language, CVTemplate } from '../types';

const CV_DATA_KEY = 'proofly_cv_data';
const USER_PREFERENCES_KEY = 'proofly_preferences';

// Default CV template
const DEFAULT_TEMPLATE: CVTemplate = {
  id: 'modern-1',
  name: 'Modern Professional',
  description: 'Clean and modern design perfect for tech and business roles',
  category: 'modern'
};

// Default CV data structure
const getDefaultCVData = (): CVData => ({
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    salaryExpectation: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  template: DEFAULT_TEMPLATE
});

export const cvStorage = {
  /**
   * Get CV data from localStorage
   */
  getCVData: (): CVData => {
    if (typeof window === 'undefined') return getDefaultCVData();
    
    try {
      const data = localStorage.getItem(CV_DATA_KEY);
      if (!data) return getDefaultCVData();
      
      const cvData = JSON.parse(data);
      return {
        ...getDefaultCVData(),
        ...cvData,
        template: cvData.template || DEFAULT_TEMPLATE
      };
    } catch (error) {
      console.error('Error loading CV data:', error);
      return getDefaultCVData();
    }
  },

  /**
   * Save CV data to localStorage
   */
  saveCVData: (cvData: CVData): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CV_DATA_KEY, JSON.stringify(cvData));
    } catch (error) {
      console.error('Error saving CV data:', error);
    }
  },

  /**
   * Update personal information
   */
  updatePersonalInfo: (personalInfo: Partial<PersonalInfo>): CVData => {
    const cvData = cvStorage.getCVData();
    const updatedData = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        ...personalInfo
      }
    };
    cvStorage.saveCVData(updatedData);
    return updatedData;
  },

  /**
   * Add or update experience
   */
  saveExperience: (experience: Experience): CVData => {
    const cvData = cvStorage.getCVData();
    const existingIndex = cvData.experience.findIndex(exp => exp.id === experience.id);
    
    if (existingIndex >= 0) {
      cvData.experience[existingIndex] = experience;
    } else {
      cvData.experience.push(experience);
    }
    
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Delete experience
   */
  deleteExperience: (id: string): CVData => {
    const cvData = cvStorage.getCVData();
    cvData.experience = cvData.experience.filter(exp => exp.id !== id);
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Add or update education
   */
  saveEducation: (education: Education): CVData => {
    const cvData = cvStorage.getCVData();
    const existingIndex = cvData.education.findIndex(edu => edu.id === education.id);
    
    if (existingIndex >= 0) {
      cvData.education[existingIndex] = education;
    } else {
      cvData.education.push(education);
    }
    
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Delete education
   */
  deleteEducation: (id: string): CVData => {
    const cvData = cvStorage.getCVData();
    cvData.education = cvData.education.filter(edu => edu.id !== id);
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Update skills
   */
  updateSkills: (skills: string[]): CVData => {
    const cvData = cvStorage.getCVData();
    cvData.skills = skills;
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Add or update certification
   */
  saveCertification: (certification: Certification): CVData => {
    const cvData = cvStorage.getCVData();
    const existingIndex = cvData.certifications.findIndex(cert => cert.id === certification.id);
    
    if (existingIndex >= 0) {
      cvData.certifications[existingIndex] = certification;
    } else {
      cvData.certifications.push(certification);
    }
    
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Delete certification
   */
  deleteCertification: (id: string): CVData => {
    const cvData = cvStorage.getCVData();
    cvData.certifications = cvData.certifications.filter(cert => cert.id !== id);
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Update languages
   */
  updateLanguages: (languages: Language[]): CVData => {
    const cvData = cvStorage.getCVData();
    cvData.languages = languages;
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Update CV template
   */
  updateTemplate: (template: CVTemplate): CVData => {
    const cvData = cvStorage.getCVData();
    cvData.template = template;
    cvStorage.saveCVData(cvData);
    return cvData;
  },

  /**
   * Clear all CV data
   */
  clearCVData: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CV_DATA_KEY);
    } catch (error) {
      console.error('Error clearing CV data:', error);
    }
  },

  /**
   * Get user preferences
   */
  getPreferences: () => {
    if (typeof window === 'undefined') return {};
    
    try {
      const data = localStorage.getItem(USER_PREFERENCES_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading preferences:', error);
      return {};
    }
  },

  /**
   * Save user preferences
   */
  savePreferences: (preferences: any): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },
};
