/**
 * Local storage utilities for Proofly CV data persistence
 */

import { CVData, PersonalInfo, Experience, Education, Certification, Language, CVTemplate, CVStyling } from '../types';

const CV_DATA_KEY = 'proofly_cv_data';
const USER_PREFERENCES_KEY = 'proofly_preferences';
const JOB_DESCRIPTION_KEY = 'proofly_job_description';

// Default CV template
const DEFAULT_TEMPLATE: CVTemplate = {
  id: 'modern-1',
  name: 'Modern Professional',
  description: 'Clean and modern design perfect for tech and business roles',
  category: 'modern'
};

// Default styling configuration
const DEFAULT_STYLING: CVStyling = {
  name: {
    fontFamily: 'font-sans',
    fontSize: 'text-2xl',
    color: 'text-gray-900',
    fontWeight: 'font-bold',
  },
  contact: {
    fontFamily: 'font-sans',
    fontSize: 'text-sm',
    color: 'text-gray-600',
  },
  sectionTitle: {
    fontFamily: 'font-sans',
    fontSize: 'text-lg',
    color: 'text-gray-800',
    fontWeight: 'font-semibold',
  },
  position: {
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    color: 'text-gray-900',
    fontWeight: 'font-semibold',
  },
  company: {
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    color: 'text-gray-700',
  },
  description: {
    fontFamily: 'font-sans',
    fontSize: 'text-sm',
    color: 'text-gray-600',
    lineHeight: 'leading-relaxed',
  },
  skills: {
    fontFamily: 'font-sans',
    fontSize: 'text-sm',
    color: 'text-gray-700',
    backgroundColor: 'bg-gray-100',
  },
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
    showSalaryInCV: false,
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  template: DEFAULT_TEMPLATE,
  styling: DEFAULT_STYLING
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
   * Clear specific CV section
   */
  clearCVSection: (section: 'personalInfo' | 'experience' | 'education' | 'skills' | 'certifications' | 'languages' | 'all'): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentData = cvStorage.getCVData();
        if (section === 'all') {
        // Clear all data by saving the default data
        cvStorage.saveCVData(getDefaultCVData());
        return;
      }
      
      // Clear specific section
      const updatedData = { ...currentData };
      
      switch (section) {
        case 'personalInfo':
          updatedData.personalInfo = getDefaultCVData().personalInfo;
          break;
        case 'experience':
          updatedData.experience = [];
          break;
        case 'education':
          updatedData.education = [];
          break;
        case 'skills':
          updatedData.skills = [];
          break;
        case 'certifications':
          updatedData.certifications = [];
          break;
        case 'languages':
          updatedData.languages = [];
          break;
      }
      
      cvStorage.saveCVData(updatedData);
    } catch (error) {
      console.error('Error clearing CV section:', error);
    }
  },

  /**
   * Check if CV has any data
   */
  hasCVData: (): boolean => {
    const data = cvStorage.getCVData();
    return !!(
      data.personalInfo.name ||
      data.personalInfo.email ||
      data.experience.length > 0 ||
      data.education.length > 0 ||
      data.skills.length > 0 ||
      data.certifications.length > 0 ||
      data.languages.length > 0
    );
  },

  /**
   * Get CV data summary for confirmation dialogs
   */
  getCVSummary: (): string => {
    const data = cvStorage.getCVData();
    const sections = [];
    
    if (data.personalInfo.name || data.personalInfo.email) {
      sections.push('Personal Information');
    }
    if (data.experience.length > 0) {
      sections.push(`${data.experience.length} work experience item(s)`);
    }
    if (data.education.length > 0) {
      sections.push(`${data.education.length} education item(s)`);
    }
    if (data.skills.length > 0) {
      sections.push(`${data.skills.length} skill(s)`);
    }
    if (data.certifications.length > 0) {
      sections.push(`${data.certifications.length} certification(s)`);
    }
    if (data.languages.length > 0) {
      sections.push(`${data.languages.length} language(s)`);
    }    
    return sections.length > 0 ? sections.join(', ') : 'No data';
  },

  /**
   * Get job description from localStorage
   */
  getJobDescription: (): string => {
    if (typeof window === 'undefined') return '';
    
    try {
      const data = localStorage.getItem(JOB_DESCRIPTION_KEY);
      return data || '';
    } catch (error) {
      console.error('Error loading job description:', error);
      return '';
    }
  },

  /**
   * Save job description to localStorage
   */
  saveJobDescription: (jobDescription: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(JOB_DESCRIPTION_KEY, jobDescription);
    } catch (error) {
      console.error('Error saving job description:', error);
    }
  },
};
