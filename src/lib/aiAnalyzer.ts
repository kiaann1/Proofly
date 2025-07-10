import { CVData } from '../types';
import { FreeAIAnalyzer } from './freeAI';

export interface AIAnalysisResult {
  overallScore: number;
  skillsAnalysis: {
    technicalSkills: SkillAnalysis[];
    softSkills: SkillAnalysis[];
    marketDemand: number;
    futureRelevance: number;
  };
  careerProgression: {
    currentLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
    nextSteps: string[];
    timelineToPromotion: string;
    salaryGrowthPotential: number;
  };
  industryFit: {
    primaryIndustry: string;
    fitScore: number;
    alternativeIndustries: IndustryMatch[];
  };
  contentQuality: {
    writingScore: number;
    keywordOptimization: number;
    achievementQuantification: number;
    recommendations: string[];
    isRealAI?: boolean; // NEW: Flag to indicate real AI was used
    aiConfidence?: number; // NEW: AI confidence score
    aiSummary?: string; // NEW: AI-generated summary
  };
  competitiveAnalysis: {
    marketPosition: number; // percentile
    strengthsVsMarket: string[];
    improvementAreas: string[];
  };
}

interface SkillAnalysis {
  skill: string;
  proficiencyLevel: number;
  marketDemand: 'Low' | 'Medium' | 'High' | 'Very High';
  salaryImpact: number;
  futureOutlook: 'Declining' | 'Stable' | 'Growing' | 'Emerging';
}

interface IndustryMatch {
  industry: string;
  fitScore: number;
  reasonsForFit: string[];
  avgSalary: number;
  growthProspects: number;
}

export class AIAnalyzer {
  
  static async analyzeCV(cvData: CVData): Promise<AIAnalysisResult> {
    // First, assess CV completeness and data quality
    const cvQuality = this.assessCVCompleteness(cvData);
    
    // If CV is mostly empty or low quality, return low scores
    if (cvQuality.completenessScore < 30) {
      return this.generateLowQualityAnalysis(cvData, cvQuality);
    }
    
    // Only proceed with detailed analysis if CV has sufficient content
    const skillsAnalysis = this.analyzeSkills(cvData);
    const careerProgression = this.analyzeCareerProgression(cvData);
    const industryFit = this.analyzeIndustryFit(cvData);
    
    // 🚀 REAL AI: Use Hugging Face for content quality analysis
    const contentQuality = await this.analyzeContentQualityWithAI(cvData);
    
    const competitiveAnalysis = this.analyzeCompetitivePosition(cvData);
    
    const overallScore = this.calculateOverallScore({
      skillsAnalysis,
      careerProgression,
      industryFit,
      contentQuality,
      competitiveAnalysis,
      cvQuality
    });
    
    return {
      overallScore,
      skillsAnalysis,
      careerProgression,
      industryFit,
      contentQuality,
      competitiveAnalysis
    };
  }

  private static assessCVCompleteness(cvData: CVData) {
    let completenessScore = 0;
    let issues: string[] = [];

    // Check personal info (20 points max)
    if (cvData.personalInfo.name && cvData.personalInfo.name.trim() !== '' && cvData.personalInfo.name !== '1') {
      completenessScore += 5;
    } else {
      issues.push('Missing or invalid name');
    }
    
    if (cvData.personalInfo.email && cvData.personalInfo.email.includes('@')) {
      completenessScore += 5;
    } else {
      issues.push('Missing or invalid email');
    }
    
    if (cvData.personalInfo.summary && cvData.personalInfo.summary.trim() !== '' && cvData.personalInfo.summary !== '1' && cvData.personalInfo.summary.length > 20) {
      completenessScore += 10;
    } else {
      issues.push('Missing or insufficient professional summary');
    }

    // Check experience (30 points max)
    if (cvData.experience && cvData.experience.length > 0) {
      const validExperience = cvData.experience.filter(exp => 
        exp.position && exp.position !== '1' && exp.position.trim() !== '' &&
        exp.company && exp.company !== '1' && exp.company.trim() !== '' &&
        exp.description && exp.description !== '1' && exp.description.length > 10
      );
      
      if (validExperience.length > 0) {
        completenessScore += Math.min(validExperience.length * 10, 30);
      } else {
        issues.push('No valid work experience entries');
      }
    } else {
      issues.push('No work experience provided');
    }

    // Check education (15 points max)
    if (cvData.education && cvData.education.length > 0) {
      const validEducation = cvData.education.filter(edu => 
        edu.degree && edu.degree !== '1' && edu.degree.trim() !== '' &&
        edu.institution && edu.institution !== '1' && edu.institution.trim() !== ''
      );
      
      if (validEducation.length > 0) {
        completenessScore += Math.min(validEducation.length * 8, 15);
      } else {
        issues.push('No valid education entries');
      }
    } else {
      issues.push('No education provided');
    }

    // Check skills (20 points max)
    if (cvData.skills && cvData.skills.length > 0) {
      const validSkills = cvData.skills.filter(skill => 
        skill && skill !== '1' && skill.trim() !== '' && skill.length > 1
      );
      
      if (validSkills.length > 0) {
        completenessScore += Math.min(validSkills.length * 2, 20);
      } else {
        issues.push('No valid skills listed');
      }
    } else {
      issues.push('No skills provided');
    }

    // Additional content checks (15 points max)
    const totalTextLength = [
      cvData.personalInfo.summary || '',
      ...cvData.experience.map(exp => exp.description || ''),
      ...cvData.education.map(edu => edu.description || '')
    ].join(' ').length;

    if (totalTextLength > 200) {
      completenessScore += 15;
    } else if (totalTextLength > 100) {
      completenessScore += 8;
    } else {
      issues.push('Insufficient descriptive content');
    }

    return {
      completenessScore: Math.min(completenessScore, 100),
      issues,
      hasValidContent: completenessScore >= 30
    };
  }

  private static generateLowQualityAnalysis(cvData: CVData, cvQuality: any): AIAnalysisResult {
    return {
      overallScore: Math.max(cvQuality.completenessScore * 0.6, 15), // Low but not zero
      skillsAnalysis: {
        technicalSkills: [],
        softSkills: [],
        marketDemand: 20,
        futureRelevance: 25
      },
      careerProgression: {
        currentLevel: 'entry',
        nextSteps: [
          'Complete your CV with real information',
          'Add detailed work experience',
          'Include professional summary',
          'List relevant skills'
        ],
        timelineToPromotion: 'Complete CV first',
        salaryGrowthPotential: 10
      },
      industryFit: {
        primaryIndustry: 'Unknown',
        fitScore: 15,
        alternativeIndustries: []
      },
      contentQuality: {
        writingScore: 20,
        keywordOptimization: 15,
        achievementQuantification: 10,
        recommendations: [
          'Replace placeholder text (1s) with real information',
          'Add a professional summary',
          'Include detailed work experience',
          'List your actual skills and achievements'
        ],
        isRealAI: false,
        aiConfidence: 10,
        aiSummary: 'CV appears to contain placeholder or incomplete information. Please add real content for accurate analysis.'
      },
      competitiveAnalysis: {
        marketPosition: 15,
        strengthsVsMarket: ['Potential for improvement'],
        improvementAreas: cvQuality.issues
      }
    };
  }

  private static analyzeSkills(cvData: CVData) {
    // Extract technical and soft skills from real CV data
    const allSkills = cvData.skills || [];
    
    const technicalSkills = allSkills
      .filter(skill => this.isTechnicalSkill(skill))
      .map(skill => ({
        skill,
        proficiencyLevel: this.assessSkillProficiency(skill, cvData),
        marketDemand: this.getSkillDemand(skill),
        salaryImpact: this.getSkillSalaryImpact(skill),
        futureOutlook: this.getSkillFutureOutlook(skill)
      }));
      
    const softSkills = allSkills
      .filter(skill => !this.isTechnicalSkill(skill))
      .map(skill => ({
        skill,
        proficiencyLevel: this.assessSkillProficiency(skill, cvData),
        marketDemand: this.getSkillDemand(skill),
        salaryImpact: this.getSkillSalaryImpact(skill),
        futureOutlook: this.getSkillFutureOutlook(skill)
      }));

    // Calculate market demand based on actual skills in CV
    const avgTechnicalDemand = technicalSkills.length > 0 
      ? technicalSkills.reduce((acc, skill) => acc + this.getNumericDemandScore(skill.marketDemand), 0) / technicalSkills.length
      : 40; // Low baseline if no technical skills

    const avgSoftDemand = softSkills.length > 0
      ? softSkills.reduce((acc, skill) => acc + this.getNumericDemandScore(skill.marketDemand), 0) / softSkills.length
      : 50; // Medium baseline for soft skills

    return {
      technicalSkills,
      softSkills,
      marketDemand: Math.round((avgTechnicalDemand + avgSoftDemand) / 2),
      futureRelevance: this.calculateFutureRelevance(technicalSkills, softSkills)
    };
  }

  private static assessSkillProficiency(skill: string, cvData: CVData): number {
    // Assess proficiency based on where skill appears in CV
    let proficiency = 50; // Base proficiency
    
    // Check if skill appears in experience descriptions
    const experienceText = cvData.experience.map(exp => exp.description + ' ' + exp.achievements.join(' ')).join(' ').toLowerCase();
    const skillLower = skill.toLowerCase();
    
    if (experienceText.includes(skillLower)) {
      proficiency += 20; // Demonstrated usage in work
    }
    
    // Check years of experience
    const yearsExp = this.calculateYearsOfExperience(cvData);
    if (yearsExp > 5) proficiency += 15;
    else if (yearsExp > 2) proficiency += 10;
    
    // Check if skill appears in certifications
    const certText = cvData.certifications.map(cert => cert.name).join(' ').toLowerCase();
    if (certText.includes(skillLower)) {
      proficiency += 15; // Certified in skill
    }
    
    return Math.min(proficiency, 95); // Cap at 95%
  }

  private static getNumericDemandScore(demand: 'Low' | 'Medium' | 'High' | 'Very High'): number {
    switch (demand) {
      case 'Very High': return 90;
      case 'High': return 75;
      case 'Medium': return 60;
      case 'Low': return 40;
      default: return 50;
    }
  }

  private static calculateFutureRelevance(technicalSkills: any[], softSkills: any[]): number {
    const allSkills = [...technicalSkills, ...softSkills];
    if (allSkills.length === 0) return 40;
    
    const relevanceScores = allSkills.map(skill => {
      switch (skill.futureOutlook) {
        case 'Emerging': return 95;
        case 'Growing': return 80;
        case 'Stable': return 65;
        case 'Declining': return 30;
        default: return 50;
      }
    });
    
    return Math.round(relevanceScores.reduce((acc, score) => acc + score, 0) / relevanceScores.length);
  }
  
  private static analyzeCareerProgression(cvData: CVData) {
    const yearsOfExperience = this.calculateYearsOfExperience(cvData);
    const currentLevel = this.determineCareerLevel(yearsOfExperience, cvData);
    
    // Calculate realistic salary growth based on actual career data
    const salaryGrowthPotential = this.calculateRealisticSalaryGrowth(yearsOfExperience, currentLevel, cvData);
    
    return {
      currentLevel,
      nextSteps: this.getNextSteps(currentLevel),
      timelineToPromotion: this.getPromotionTimeline(currentLevel),
      salaryGrowthPotential
    };
  }

  private static calculateRealisticSalaryGrowth(years: number, level: string, cvData: CVData): number {
    // Base growth potential on career level and experience
    const baseGrowth = {
      'entry': 25, // 25% potential growth
      'junior': 20,
      'mid': 15,
      'senior': 12,
      'lead': 10,
      'executive': 8
    };

    const levelGrowth = baseGrowth[level as keyof typeof baseGrowth] || 15;
    
    // Factor in skills relevance
    const skillBonus = cvData.skills.length > 5 ? 3 : cvData.skills.length > 2 ? 1 : 0;
    
    // Factor in education
    const educationBonus = cvData.education.length > 0 ? 2 : 0;
    
    return Math.min(levelGrowth + skillBonus + educationBonus, 35);
  }
  
  private static analyzeIndustryFit(cvData: CVData) {
    const primaryIndustry = this.identifyPrimaryIndustry(cvData);
    const fitScore = this.calculateIndustryFitScore(cvData, primaryIndustry);
    
    const alternativeIndustries = this.findAlternativeIndustries(cvData, primaryIndustry);

    return {
      primaryIndustry,
      fitScore,
      alternativeIndustries
    };
  }

  private static calculateIndustryFitScore(cvData: CVData, industry: string): number {
    let fitScore = 50; // Base score
    
    // Check experience relevance
    const experienceRelevance = cvData.experience.some(exp => 
      exp.company.toLowerCase().includes(industry.toLowerCase()) ||
      exp.position.toLowerCase().includes(industry.toLowerCase()) ||
      exp.description.toLowerCase().includes(industry.toLowerCase())
    );
    
    if (experienceRelevance) fitScore += 25;
    
    // Check skills relevance to industry
    const industryKeywords = this.getIndustryKeywords(industry);
    const skillsText = cvData.skills.join(' ').toLowerCase();
    const matchingKeywords = industryKeywords.filter(keyword => 
      skillsText.includes(keyword.toLowerCase())
    );
    
    fitScore += Math.min(matchingKeywords.length * 3, 20);
    
    // Check education relevance
    const educationRelevance = cvData.education.some(edu =>
      edu.degree.toLowerCase().includes(industry.toLowerCase()) ||
      edu.description.toLowerCase().includes(industry.toLowerCase())
    );
    
    if (educationRelevance) fitScore += 5;
    
    return Math.min(fitScore, 95);
  }

  private static findAlternativeIndustries(cvData: CVData, primaryIndustry: string): IndustryMatch[] {
    const industries = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Education'];
    
    return industries
      .filter(industry => industry !== primaryIndustry)
      .map(industry => ({
        industry,
        fitScore: this.calculateIndustryFitScore(cvData, industry),
        reasonsForFit: this.getIndustryFitReasons(cvData, industry),
        avgSalary: this.getIndustrySalary(industry),
        growthProspects: this.getIndustryGrowthProspects(industry)
      }))
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 2); // Top 2 alternatives
  }

  private static getIndustryKeywords(industry: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'Technology': ['software', 'programming', 'development', 'coding', 'digital', 'tech', 'IT'],
      'Finance': ['financial', 'banking', 'investment', 'accounting', 'economics', 'trading'],
      'Healthcare': ['medical', 'healthcare', 'clinical', 'patient', 'health', 'nursing'],
      'Marketing': ['marketing', 'advertising', 'branding', 'social media', 'digital marketing'],
      'Education': ['teaching', 'education', 'academic', 'training', 'curriculum']
    };
    
    return keywordMap[industry] || [];
  }

  private static getIndustryFitReasons(cvData: CVData, industry: string): string[] {
    const reasons: string[] = [];
    const keywords = this.getIndustryKeywords(industry);
    const cvText = [
      cvData.personalInfo.summary,
      ...cvData.experience.map(exp => exp.description),
      cvData.skills.join(' ')
    ].join(' ').toLowerCase();
    
    keywords.forEach(keyword => {
      if (cvText.includes(keyword)) {
        reasons.push(`Experience with ${keyword}`);
      }
    });
    
    return reasons.slice(0, 3); // Top 3 reasons
  }

  private static getIndustrySalary(industry: string): number {
    const salaryMap: { [key: string]: number } = {
      'Technology': 70000,
      'Finance': 75000,
      'Healthcare': 65000,
      'Marketing': 55000,
      'Education': 45000
    };
    
    return salaryMap[industry] || 55000;
  }

  private static getIndustryGrowthProspects(industry: string): number {
    const growthMap: { [key: string]: number } = {
      'Technology': 85,
      'Finance': 70,
      'Healthcare': 80,
      'Marketing': 75,
      'Education': 60
    };
    
    return growthMap[industry] || 65;
  }
  
  // 🚀 NEW: Real AI-powered content analysis using Hugging Face
  private static async analyzeContentQualityWithAI(cvData: CVData) {
    try {
      // First check if CV has meaningful content
      const cvText = [
        cvData.personalInfo.summary || '',
        ...cvData.experience.map(exp => `${exp.position} ${exp.company} ${exp.description}`),
        ...cvData.education.map(edu => `${edu.degree} ${edu.institution}`),
        cvData.skills.join(' ')
      ].join(' ').trim();

      // If CV is mostly empty or contains placeholders, return low scores
      if (cvText.length < 50 || cvText.includes('1') || cvText.toLowerCase().includes('placeholder')) {
        return {
          writingScore: 25,
          keywordOptimization: 20,
          achievementQuantification: 15,
          recommendations: [
            'Replace placeholder text with real information',
            'Add detailed descriptions of your experience',
            'Include quantified achievements',
            'Write a compelling professional summary'
          ],
          isRealAI: false,
          aiConfidence: 15,
          aiSummary: 'CV contains insufficient or placeholder content for accurate analysis'
        };
      }

      // Use free Hugging Face AI for real analysis only if content exists
      const aiResult = await FreeAIAnalyzer.analyzeCV(cvData);
      
      // Convert AI results to our expected format, but be realistic about scores
      const writingScore = Math.max(Math.round(aiResult.sentiment.score * 100), 30);
      const keywordOptimization = Math.max(aiResult.confidence, 25);
      const achievementQuantification = this.assessAchievementQuantification(cvData);
      
      // Generate AI-powered recommendations
      const aiRecommendations = await FreeAIAnalyzer.generateRecommendations(cvData);
      
      return {
        writingScore,
        keywordOptimization,
        achievementQuantification,
        recommendations: aiRecommendations.slice(0, 4), // Top 4 recommendations
        isRealAI: aiResult.isAI, // Flag to show this used real AI
        aiConfidence: aiResult.confidence,
        aiSummary: aiResult.summary.summary_text
      };
    } catch (error) {
      console.warn('AI analysis failed, falling back to rule-based analysis:', error);
      // Fallback to mock analysis if AI fails
      return this.analyzeContentQuality(cvData);
    }
  }

  private static analyzeContentQuality(cvData: CVData) {
    const writingScore = this.assessWritingQuality(cvData);
    const keywordOptimization = this.assessKeywordOptimization(cvData);
    const achievementQuantification = this.assessAchievementQuantification(cvData);
    
    return {
      writingScore,
      keywordOptimization,
      achievementQuantification,
      recommendations: this.generateContentRecommendations(cvData)
    };
  }
  
  private static analyzeCompetitivePosition(cvData: CVData) {
    const marketPosition = this.calculateMarketPosition(cvData);
    const strengthsVsMarket = this.identifyStrengths(cvData);
    const improvementAreas = this.identifyImprovementAreas(cvData);
    
    return {
      marketPosition,
      strengthsVsMarket,
      improvementAreas
    };
  }

  private static calculateMarketPosition(cvData: CVData): number {
    let position = 50; // Base 50th percentile
    
    // Years of experience factor
    const years = this.calculateYearsOfExperience(cvData);
    if (years > 10) position += 20;
    else if (years > 5) position += 15;
    else if (years > 2) position += 10;
    else if (years > 0) position += 5;
    
    // Education factor
    const hasAdvancedDegree = cvData.education.some(edu => 
      edu.degree.toLowerCase().includes('master') || 
      edu.degree.toLowerCase().includes('phd')
    );
    if (hasAdvancedDegree) position += 10;
    
    // Skills count factor
    if (cvData.skills.length > 15) position += 10;
    else if (cvData.skills.length > 10) position += 7;
    else if (cvData.skills.length > 5) position += 5;
    
    // Certifications factor
    if (cvData.certifications.length > 5) position += 8;
    else if (cvData.certifications.length > 2) position += 5;
    else if (cvData.certifications.length > 0) position += 2;
    
    // Cap at 90th percentile
    return Math.min(position, 90);
  }

  private static identifyStrengths(cvData: CVData): string[] {
    const strengths: string[] = [];
    
    // Check years of experience
    const years = this.calculateYearsOfExperience(cvData);
    if (years > 5) {
      strengths.push('Extensive professional experience');
    } else if (years > 2) {
      strengths.push('Solid professional foundation');
    }
    
    // Check education
    const hasAdvancedDegree = cvData.education.some(edu => 
      edu.degree.toLowerCase().includes('master') || 
      edu.degree.toLowerCase().includes('phd')
    );
    if (hasAdvancedDegree) {
      strengths.push('Advanced education credentials');
    }
    
    // Check technical skills
    const techSkillsCount = cvData.skills.filter(skill => this.isTechnicalSkill(skill)).length;
    if (techSkillsCount > 10) {
      strengths.push('Strong technical skill set');
    } else if (techSkillsCount > 5) {
      strengths.push('Diverse technical capabilities');
    }
    
    // Check certifications
    if (cvData.certifications.length > 3) {
      strengths.push('Professional certifications');
    }
    
    // Check career progression
    if (cvData.experience.length > 3) {
      strengths.push('Proven career progression');
    }
    
    return strengths.length > 0 ? strengths : ['Professional potential'];
  }

  private static identifyImprovementAreas(cvData: CVData): string[] {
    const areas: string[] = [];
    
    // Check for missing professional summary
    if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 50) {
      areas.push('Professional summary needed');
    }
    
    // Check skills count
    if (cvData.skills.length < 5) {
      areas.push('Expand skills section');
    }
    
    // Check certifications
    if (cvData.certifications.length === 0) {
      areas.push('Industry certifications recommended');
    }
    
    // Check quantified achievements
    const hasQuantifiedAchievements = cvData.experience.some(exp => 
      exp.achievements.length > 0 || 
      /\d+%|\d+k|\$\d+|\d+ years?|\d+ months?/.test(exp.description)
    );
    if (!hasQuantifiedAchievements) {
      areas.push('Add quantified achievements');
    }
    
    // Check experience descriptions
    const hasDetailedDescriptions = cvData.experience.every(exp => 
      exp.description && exp.description.length > 50
    );
    if (!hasDetailedDescriptions) {
      areas.push('Expand experience descriptions');
    }
    
    return areas.length > 0 ? areas : ['Continue professional development'];
  }
  
  private static calculateOverallScore(analysis: any): number {
    // If CV quality is poor, heavily penalize the score
    if (analysis.cvQuality && analysis.cvQuality.completenessScore < 50) {
      return Math.max(analysis.cvQuality.completenessScore * 0.6, 15);
    }

    // Weighted average of all components
    const weights = {
      skills: 0.25,
      career: 0.20,
      industry: 0.15,
      content: 0.20,
      competitive: 0.20
    };
    
    const baseScore = Math.round(
      (analysis.skillsAnalysis.marketDemand * weights.skills) +
      (analysis.careerProgression.salaryGrowthPotential * 2 * weights.career) +
      (analysis.industryFit.fitScore * weights.industry) +
      (analysis.contentQuality.writingScore * weights.content) +
      (analysis.competitiveAnalysis.marketPosition * weights.competitive)
    );

    // Apply CV quality modifier
    const qualityModifier = analysis.cvQuality ? (analysis.cvQuality.completenessScore / 100) : 1;
    
    return Math.round(baseScore * qualityModifier);
  }
  
  // Helper methods
  private static isTechnicalSkill(skill: string): boolean {
    const technicalKeywords = [
      'javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker',
      'typescript', 'java', 'c++', 'git', 'kubernetes', 'mongodb'
    ];
    return technicalKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword)
    );
  }
  
  private static getSkillDemand(skill: string): 'Low' | 'Medium' | 'High' | 'Very High' {
    const veryHighDemandSkills = ['react', 'python', 'aws', 'typescript', 'kubernetes', 'docker', 'javascript', 'node', 'ai', 'machine learning'];
    const highDemandSkills = ['java', 'sql', 'angular', 'vue', 'c++', 'golang', 'rust', 'mongodb', 'postgresql'];
    const mediumDemandSkills = ['php', 'ruby', 'perl', 'matlab', 'r', 'scala', 'project management', 'agile'];
    
    const skillLower = skill.toLowerCase();
    
    if (veryHighDemandSkills.some(s => skillLower.includes(s))) return 'Very High';
    if (highDemandSkills.some(s => skillLower.includes(s))) return 'High';
    if (mediumDemandSkills.some(s => skillLower.includes(s))) return 'Medium';
    
    return 'Low';
  }
  
  private static getSkillSalaryImpact(skill: string): number {
    // Return percentage salary increase this skill provides based on market data
    const highImpactSkills = ['machine learning', 'blockchain', 'ai', 'kubernetes', 'aws', 'leadership', 'architect'];
    const mediumImpactSkills = ['python', 'java', 'react', 'typescript', 'docker', 'sql'];
    const skillLower = skill.toLowerCase();
    
    if (highImpactSkills.some(s => skillLower.includes(s))) {
      return 25; // 25% salary impact for high-demand skills
    }
    if (mediumImpactSkills.some(s => skillLower.includes(s))) {
      return 15; // 15% salary impact for medium-demand skills
    }
    return 8; // 8% for other skills
  }
  
  private static getSkillFutureOutlook(skill: string): 'Declining' | 'Stable' | 'Growing' | 'Emerging' {
    const emergingSkills = ['ai', 'machine learning', 'blockchain', 'quantum', 'rust', 'kubernetes', 'webassembly'];
    const growingSkills = ['react', 'typescript', 'python', 'aws', 'docker', 'devops', 'cybersecurity'];
    const decliningSkills = ['flash', 'jquery', 'php', 'perl', 'vb.net', 'silverlight'];
    
    const skillLower = skill.toLowerCase();
    
    if (emergingSkills.some(s => skillLower.includes(s))) return 'Emerging';
    if (decliningSkills.some(s => skillLower.includes(s))) return 'Declining';
    if (growingSkills.some(s => skillLower.includes(s))) return 'Growing';
    
    return 'Stable';
  }
  
  private static calculateYearsOfExperience(cvData: CVData): number {
    if (cvData.experience.length === 0) return 0;
    
    // Calculate from first job to present
    const sortedExperience = cvData.experience.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    const firstJob = sortedExperience[0];
    const startDate = new Date(firstJob.startDate);
    const currentDate = new Date();
    
    return Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }
  
  private static determineCareerLevel(years: number, cvData: CVData): 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive' {
    if (years < 1) return 'entry';
    if (years < 3) return 'junior';
    if (years < 6) return 'mid';
    if (years < 10) return 'senior';
    if (years < 15) return 'lead';
    return 'executive';
  }
  
  private static getNextSteps(level: string): string[] {
    const stepMap = {
      entry: ['Gain foundational skills', 'Build portfolio', 'Seek mentorship'],
      junior: ['Develop specialization', 'Lead small projects', 'Expand network'],
      mid: ['Pursue leadership roles', 'Obtain certifications', 'Mentor others'],
      senior: ['Drive strategic initiatives', 'Build cross-functional expertise', 'Thought leadership'],
      lead: ['Executive education', 'Board positions', 'Industry speaking'],
      executive: ['Scale organizations', 'Venture investing', 'Advisory roles']
    };
    return stepMap[level as keyof typeof stepMap] || ['Continue professional development'];
  }
  
  private static getPromotionTimeline(level: string): string {
    const timelineMap = {
      entry: '12-18 months',
      junior: '18-24 months',
      mid: '2-3 years',
      senior: '3-4 years',
      lead: '4-5 years',
      executive: '5+ years'
    };
    return timelineMap[level as keyof typeof timelineMap] || '2-3 years';
  }
  
  private static identifyPrimaryIndustry(cvData: CVData): string {
    // Analyze CV content to identify primary industry
    const cvText = [
      cvData.personalInfo.summary || '',
      ...cvData.experience.map(exp => `${exp.position} ${exp.company} ${exp.description}`),
      ...cvData.education.map(edu => `${edu.degree} ${edu.institution}`),
      cvData.skills.join(' ')
    ].join(' ').toLowerCase();

    const industryKeywords = {
      'Technology': ['software', 'developer', 'engineer', 'programming', 'coding', 'tech', 'IT', 'digital', 'react', 'python', 'javascript'],
      'Finance': ['financial', 'banking', 'investment', 'accounting', 'economics', 'analyst', 'trader', 'portfolio', 'risk'],
      'Healthcare': ['medical', 'healthcare', 'clinical', 'patient', 'health', 'nursing', 'doctor', 'hospital', 'therapy'],
      'Marketing': ['marketing', 'advertising', 'brand', 'campaign', 'social media', 'content', 'seo', 'digital marketing'],
      'Education': ['teaching', 'teacher', 'education', 'academic', 'university', 'school', 'curriculum', 'training'],
      'Retail': ['retail', 'sales', 'customer', 'ecommerce', 'merchandising', 'inventory', 'store']
    };

    let bestMatch = 'Technology'; // Default
    let highestScore = 0;

    Object.entries(industryKeywords).forEach(([industry, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        const matches = (cvText.match(new RegExp(keyword, 'gi')) || []).length;
        return acc + matches;
      }, 0);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = industry;
      }
    });

    return bestMatch;
  }
  
  private static assessWritingQuality(cvData: CVData): number {
    // Assess based on summary length, grammar, etc.
    const summaryLength = cvData.personalInfo.summary?.length || 0;
    const hasAchievements = cvData.experience.some((exp: any) => 
      exp.achievements && exp.achievements.length > 0
    );
    
    let score = 50;
    if (summaryLength > 100) score += 20;
    if (summaryLength > 200) score += 10;
    if (hasAchievements) score += 20;
    
    return Math.min(score, 95);
  }
  
  private static assessKeywordOptimization(cvData: CVData): number {
    const keywordCount = cvData.skills.length + 
      cvData.experience.reduce((acc: number, exp: any) => 
        acc + (exp.description?.split(' ').length || 0), 0
      );
    
    return Math.min((keywordCount / 10) * 100, 95);
  }
  
  private static assessAchievementQuantification(cvData: CVData): number {
    const achievementsWithNumbers = cvData.experience.reduce((acc: number, exp: any) => {
      const numbersInAchievements = (exp.achievements || []).filter((achievement: string) =>
        /\d+/.test(achievement)
      ).length;
      return acc + numbersInAchievements;
    }, 0);
    
    return Math.min(achievementsWithNumbers * 25, 95);
  }
  
  private static generateContentRecommendations(cvData: CVData): string[] {
    const recommendations = [];
    
    if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 100) {
      recommendations.push('Add a compelling professional summary (150-200 words)');
    }
    
    const hasQuantifiedAchievements = cvData.experience.some((exp: any) =>
      exp.achievements?.some((achievement: string) => /\d+/.test(achievement))
    );
    
    if (!hasQuantifiedAchievements) {
      recommendations.push('Quantify achievements with specific numbers and metrics');
    }
    
    if (cvData.skills.length < 8) {
      recommendations.push('Expand skills section to include more relevant technologies');
    }
    
    recommendations.push('Optimize for ATS with industry-specific keywords');
    recommendations.push('Include action verbs in experience descriptions');
    
    return recommendations.slice(0, 4); // Return top 4 recommendations
  }
}
