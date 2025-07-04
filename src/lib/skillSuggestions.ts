/**
 * Skill suggestions and utilities for CV building
 */

export const skillSuggestions = {
  // Technical Skills
  programming: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'Swift', 'Kotlin', 'Dart', 'SQL', 'HTML', 'CSS', 'SASS', 'SCSS'
  ],
  
  frameworks: [
    'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Flask',
    'Spring Boot', 'Laravel', 'Rails', 'ASP.NET', 'Flutter', 'React Native'
  ],
  
  databases: [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite',
    'Cassandra', 'DynamoDB', 'Firebase'
  ],
  
  tools: [
    'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Google Cloud',
    'Terraform', 'Ansible', 'Webpack', 'Vite', 'npm', 'yarn', 'Jest', 'Cypress'
  ],
  
  // Soft Skills
  leadership: [
    'Team Leadership', 'Project Management', 'Strategic Planning', 'Mentoring',
    'Change Management', 'Conflict Resolution', 'Decision Making'
  ],
  
  communication: [
    'Public Speaking', 'Technical Writing', 'Cross-functional Collaboration',
    'Client Communication', 'Presentation Skills', 'Stakeholder Management'
  ],
  
  analytical: [
    'Problem Solving', 'Critical Thinking', 'Data Analysis', 'Research',
    'Requirements Analysis', 'Process Improvement', 'Quality Assurance'
  ],
  
  // Business Skills
  business: [
    'Business Analysis', 'Market Research', 'Financial Analysis', 'Sales',
    'Marketing', 'Customer Service', 'Operations Management', 'Risk Management'
  ],
  
  // Design Skills
  design: [
    'UI/UX Design', 'Graphic Design', 'Adobe Creative Suite', 'Figma', 'Sketch',
    'Prototyping', 'Wireframing', 'User Research', 'Design Systems'
  ]
};

export const getAllSkills = (): string[] => {
  return Object.values(skillSuggestions).flat();
};

export const getSkillsByCategory = (category: keyof typeof skillSuggestions): string[] => {
  return skillSuggestions[category] || [];
};

export const searchSkills = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const allSkills = getAllSkills();
  const lowercaseQuery = query.toLowerCase();
  
  return allSkills.filter(skill => 
    skill.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 10); // Limit to 10 suggestions
};

export const getSkillCategories = (): Array<{ key: keyof typeof skillSuggestions; label: string }> => {
  return [
    { key: 'programming', label: 'Programming Languages' },
    { key: 'frameworks', label: 'Frameworks & Libraries' },
    { key: 'databases', label: 'Databases' },
    { key: 'tools', label: 'Tools & Technologies' },
    { key: 'leadership', label: 'Leadership' },
    { key: 'communication', label: 'Communication' },
    { key: 'analytical', label: 'Analytical' },
    { key: 'business', label: 'Business' },
    { key: 'design', label: 'Design' },
  ];
};
