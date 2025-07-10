import { CVData } from '../types';

export interface CareerInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'recommendation' | 'warning' | 'trend';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  estimatedImpact: {
    salaryIncrease?: number;
    careerAcceleration?: string;
    skillDevelopment?: string;
  };
  nextSteps?: string[];
  timeline?: string;
}

export interface CareerPathway {
  title: string;
  description: string;
  requiredSkills: string[];
  optionalSkills: string[];
  typicalProgression: {
    role: string;
    yearsExperience: string;
    avgSalary: number;
  }[];
  marketOutlook: {
    growth: number;
    demand: 'Low' | 'Medium' | 'High' | 'Very High';
    automation_risk: number;
  };
}

export interface PersonalizedRecommendations {
  skillsToLearn: {
    skill: string;
    reason: string;
    priority: number;
    timeToLearn: string;
    resources: string[];
  }[];
  certificationsSuggested: {
    certification: string;
    provider: string;
    cost: number;
    timeToComplete: string;
    roi: number;
  }[];
  careerMoves: {
    role: string;
    company: string;
    salaryRange: [number, number];
    fitScore: number;
    reasoning: string;
  }[];
  networkingOpportunities: {
    event: string;
    type: 'conference' | 'meetup' | 'webinar' | 'workshop';
    date: string;
    relevanceScore: number;
  }[];
}

export class CareerInsightsEngine {
  
  static async generateInsights(cvData: CVData): Promise<CareerInsight[]> {
    const insights: CareerInsight[] = [];
    
    // Skill gap analysis
    insights.push(...this.analyzeSkillGaps(cvData));
    
    // Career progression opportunities
    insights.push(...this.identifyCareerOpportunities(cvData));
    
    // Market trend insights
    insights.push(...this.generateMarketTrendInsights(cvData));
    
    // Salary optimization insights
    insights.push(...this.analyzeSalaryOptimization(cvData));
    
    // Industry transition opportunities
    insights.push(...this.identifyIndustryTransitions(cvData));
    
    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  static async generateCareerPathways(cvData: CVData): Promise<CareerPathway[]> {
    const currentRole = this.extractCurrentRole(cvData);
    const skills = cvData.skills;
    
    return [
      {
        title: 'Senior Software Engineer',
        description: 'Lead complex technical projects and mentor junior developers',
        requiredSkills: ['Advanced Programming', 'System Design', 'Leadership'],
        optionalSkills: ['Cloud Architecture', 'DevOps', 'Agile Methodologies'],
        typicalProgression: [
          { role: 'Software Engineer', yearsExperience: '0-3', avgSalary: 55000 },
          { role: 'Senior Software Engineer', yearsExperience: '3-6', avgSalary: 75000 },
          { role: 'Lead Engineer', yearsExperience: '6-10', avgSalary: 95000 },
          { role: 'Engineering Manager', yearsExperience: '8-12', avgSalary: 110000 }
        ],
        marketOutlook: {
          growth: 22,
          demand: 'Very High',
          automation_risk: 15
        }
      },
      {
        title: 'Product Manager',
        description: 'Drive product strategy and coordinate cross-functional teams',
        requiredSkills: ['Product Strategy', 'Analytics', 'Communication'],
        optionalSkills: ['Technical Background', 'UX Design', 'Data Analysis'],
        typicalProgression: [
          { role: 'Associate Product Manager', yearsExperience: '0-2', avgSalary: 65000 },
          { role: 'Product Manager', yearsExperience: '2-5', avgSalary: 85000 },
          { role: 'Senior Product Manager', yearsExperience: '5-8', avgSalary: 105000 },
          { role: 'Director of Product', yearsExperience: '8-12', avgSalary: 130000 }
        ],
        marketOutlook: {
          growth: 18,
          demand: 'High',
          automation_risk: 8
        }
      },
      {
        title: 'Data Scientist',
        description: 'Extract insights from data to drive business decisions',
        requiredSkills: ['Statistics', 'Machine Learning', 'Programming'],
        optionalSkills: ['Deep Learning', 'Big Data', 'Business Intelligence'],
        typicalProgression: [
          { role: 'Data Analyst', yearsExperience: '0-2', avgSalary: 50000 },
          { role: 'Data Scientist', yearsExperience: '2-5', avgSalary: 75000 },
          { role: 'Senior Data Scientist', yearsExperience: '5-8', avgSalary: 95000 },
          { role: 'Principal Data Scientist', yearsExperience: '8+', avgSalary: 120000 }
        ],
        marketOutlook: {
          growth: 35,
          demand: 'Very High',
          automation_risk: 12
        }
      }
    ];
  }
  
  static async generatePersonalizedRecommendations(cvData: CVData): Promise<PersonalizedRecommendations> {
    return {
      skillsToLearn: [
        {
          skill: 'Machine Learning',
          reason: 'High market demand and salary impact in your industry',
          priority: 90,
          timeToLearn: '3-6 months',
          resources: ['Coursera ML Course', 'Kaggle Learn', 'Fast.ai']
        },
        {
          skill: 'Cloud Architecture (AWS)',
          reason: 'Essential for senior roles and remote work opportunities',
          priority: 85,
          timeToLearn: '2-4 months',
          resources: ['AWS Training', 'A Cloud Guru', 'Linux Academy']
        },
        {
          skill: 'Leadership & Team Management',
          reason: 'Critical for career progression to senior roles',
          priority: 80,
          timeToLearn: '6-12 months',
          resources: ['LinkedIn Learning', 'Harvard Business Review', 'Local Leadership Workshops']
        }
      ],
      certificationsSuggested: [
        {
          certification: 'AWS Solutions Architect',
          provider: 'Amazon Web Services',
          cost: 150,
          timeToComplete: '2-3 months',
          roi: 15 // 15% salary increase
        },
        {
          certification: 'PMP (Project Management)',
          provider: 'PMI',
          cost: 400,
          timeToComplete: '3-4 months',
          roi: 12
        }
      ],
      careerMoves: [
        {
          role: 'Senior Software Engineer',
          company: 'Tech Startup',
          salaryRange: [70000, 90000],
          fitScore: 85,
          reasoning: 'Strong technical skills match, growth opportunity'
        },
        {
          role: 'Technical Lead',
          company: 'Enterprise Company',
          salaryRange: [80000, 100000],
          fitScore: 78,
          reasoning: 'Leadership potential, stable environment'
        }
      ],
      networkingOpportunities: [
        {
          event: 'TechConnect London',
          type: 'conference',
          date: '2024-03-15',
          relevanceScore: 92
        },
        {
          event: 'React London Meetup',
          type: 'meetup',
          date: '2024-02-20',
          relevanceScore: 88
        }
      ]
    };
  }
  
  private static analyzeSkillGaps(cvData: CVData): CareerInsight[] {
    const insights: CareerInsight[] = [];
    
    // Check for missing in-demand skills
    const inDemandSkills = ['React', 'Python', 'AWS', 'Machine Learning', 'TypeScript'];
    const userSkills = cvData.skills.map(s => s.toLowerCase());
    
    const missingSkills = inDemandSkills.filter(skill => 
      !userSkills.some(userSkill => userSkill.includes(skill.toLowerCase()))
    );
    
    if (missingSkills.length > 0) {
      insights.push({
        id: 'skill-gaps',
        title: 'High-Value Skills Missing',
        description: `You're missing ${missingSkills.length} high-demand skills that could increase your earning potential by 15-25%.`,
        type: 'opportunity',
        priority: 'high',
        actionable: true,
        estimatedImpact: {
          salaryIncrease: 20,
          careerAcceleration: '6-12 months faster progression'
        },
        nextSteps: [
          `Learn ${missingSkills[0]} through online courses`,
          'Build portfolio projects demonstrating new skills',
          'Update CV and LinkedIn profile'
        ],
        timeline: '3-6 months'
      });
    }
    
    return insights;
  }
  
  private static identifyCareerOpportunities(cvData: CVData): CareerInsight[] {
    const insights: CareerInsight[] = [];
    const yearsExperience = this.calculateExperienceYears(cvData);
    
    if (yearsExperience >= 3 && yearsExperience < 6) {
      insights.push({
        id: 'senior-transition',
        title: 'Ready for Senior Role Transition',
        description: 'Your experience level suggests you\'re ready to transition to senior positions with significant salary increases.',
        type: 'opportunity',
        priority: 'high',
        actionable: true,
        estimatedImpact: {
          salaryIncrease: 25,
          careerAcceleration: 'Immediate opportunity'
        },
        nextSteps: [
          'Apply for senior-level positions',
          'Highlight leadership experiences',
          'Prepare for technical leadership interviews'
        ],
        timeline: '1-3 months'
      });
    }
    
    return insights;
  }
  
  private static generateMarketTrendInsights(cvData: CVData): CareerInsight[] {
    const insights: CareerInsight[] = [];
    
    insights.push({
      id: 'ai-trend',
      title: 'AI Skills in High Demand',
      description: 'AI and machine learning skills are seeing 300% growth in job postings. Early adoption could position you ahead of the curve.',
      type: 'trend',
      priority: 'medium',
      actionable: true,
      estimatedImpact: {
        salaryIncrease: 30,
        skillDevelopment: 'Future-proof your career'
      },
      nextSteps: [
        'Take introductory AI/ML courses',
        'Apply AI concepts to current projects',
        'Join AI communities and forums'
      ],
      timeline: '6-12 months'
    });
    
    return insights;
  }
  
  private static analyzeSalaryOptimization(cvData: CVData): CareerInsight[] {
    const insights: CareerInsight[] = [];
    
    insights.push({
      id: 'salary-negotiation',
      title: 'Potential for Salary Negotiation',
      description: 'Based on your skills and experience, you may be earning 10-15% below market rate.',
      type: 'recommendation',
      priority: 'medium',
      actionable: true,
      estimatedImpact: {
        salaryIncrease: 12
      },
      nextSteps: [
        'Research salary benchmarks for your role',
        'Document your achievements and value-add',
        'Schedule performance review meeting'
      ],
      timeline: '1-2 months'
    });
    
    return insights;
  }
  
  private static identifyIndustryTransitions(cvData: CVData): CareerInsight[] {
    const insights: CareerInsight[] = [];
    
    insights.push({
      id: 'fintech-transition',
      title: 'Strong Fit for FinTech Industry',
      description: 'Your technical skills and analytical background make you an excellent candidate for high-paying FinTech roles.',
      type: 'opportunity',
      priority: 'medium',
      actionable: true,
      estimatedImpact: {
        salaryIncrease: 20,
        careerAcceleration: 'Access to high-growth industry'
      },
      nextSteps: [
        'Learn about financial technologies',
        'Network with FinTech professionals',
        'Apply to FinTech companies'
      ],
      timeline: '3-6 months'
    });
    
    return insights;
  }
  
  private static extractCurrentRole(cvData: CVData): string {
    if (cvData.experience.length === 0) return 'Entry Level';
    return cvData.experience[0].position || 'Professional';
  }
  
  private static calculateExperienceYears(cvData: CVData): number {
    if (cvData.experience.length === 0) return 0;
    
    const sortedExperience = cvData.experience.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    
    const mostRecentJob = sortedExperience[0];
    const startDate = new Date(mostRecentJob.startDate);
    const endDate = mostRecentJob.endDate ? new Date(mostRecentJob.endDate) : new Date();
    
    const totalExperience = cvData.experience.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);
    
    return Math.floor(totalExperience);
  }
}
