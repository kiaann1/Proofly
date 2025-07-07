/**
 * Sample CV data for testing Proofly CV Builder
 */

import { CVData, Experience, Education, Certification, Language, CVTemplate } from '../types';

export const sampleCVTemplate: CVTemplate = {
  id: 'modern-1',
  name: 'Modern Professional',
  description: 'Clean and modern design perfect for tech and business roles',
  category: 'modern'
};

export const sampleCVData: CVData = {  personalInfo: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://johnsmith.dev',
    linkedin: 'https://linkedin.com/in/johnsmith',
    github: 'https://github.com/johnsmith',
    portfolio: 'https://portfolio.johnsmith.dev',
    salaryExpectation: '$120,000 - $150,000',
    showSalaryInCV: false,
    summary: 'Experienced full-stack developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams. Strong track record of delivering high-quality solutions that drive business growth and improve user experience.',
  },
  experience: [
    {
      id: '1',
      position: 'Senior Full-Stack Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: 'Leading development of cloud-native applications serving 100K+ users',
      achievements: [
        'Architected and implemented microservices platform reducing system downtime by 40%',
        'Led team of 5 developers in building React-based dashboard with 99.9% uptime',
        'Optimised database queries resulting in 60% performance improvement',
        'Mentored 3 junior developers and established code review processes'
      ]
    },
    {
      id: '2',
      position: 'Full-Stack Developer',
      company: 'StartupXYZ',
      location: 'Palo Alto, CA',
      startDate: '2020-01',
      endDate: '2022-02',
      current: false,
      description: 'Built and maintained e-commerce platform from MVP to production',
      achievements: [
        'Developed React/Node.js e-commerce platform handling $2M+ in annual transactions',
        'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
        'Built REST APIs serving 50K+ requests per day with 99.5% uptime',
        'Collaborated with design team to improve user experience, increasing conversion by 25%'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2015-09',
      endDate: '2019-05',
      current: false,
      gpa: '3.8',
      description: 'Specialised in software engineering and database systems. Member of Computer Science Honor Society.'
    }
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
    'Git', 'CI/CD', 'Agile', 'Scrum', 'REST APIs', 'GraphQL'
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-08',
      expiryDate: '2026-08',
      url: 'https://aws.amazon.com/certification/'
    }
  ],
  languages: [
    {
      id: '1',
      name: 'English',
      proficiency: 'Native'
    },
    {
      id: '2',
      name: 'Spanish',
      proficiency: 'Conversational'
    }
  ],
  template: sampleCVTemplate
};

/**
 * Load sample CV data into localStorage
 */
export const loadSampleData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('proofly_cv_data', JSON.stringify(sampleCVData));
    console.log('Sample CV data loaded successfully!');
  }
};

// Make it available globally for console use
if (typeof window !== 'undefined') {
  (window as any).loadSampleData = loadSampleData;
}
