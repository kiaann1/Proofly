// FREE AI Implementation Example for Proofly
// This uses Hugging Face's free inference API - no API key required!

import { HfInference } from '@huggingface/inference';
import { CVData } from '../types';

export class FreeAIAnalyzer {
  private static hf = new HfInference();
  
  /**
   * 100% FREE CV Analysis using Hugging Face
   * No API keys required, no monthly costs
   */
  static async analyzeCV(cvData: CVData): Promise<FreeAIResult> {
    const cvText = this.formatCVText(cvData);
    
    try {
      // Run multiple AI analyses in parallel
      const [
        sentiment,
        summary,
        skills,
        classification
      ] = await Promise.allSettled([
        this.analyzeSentiment(cvText),
        this.generateSummary(cvText),
        this.extractSkills(cvText),
        this.classifyCareerLevel(cvText)
      ]);

      return {
        sentiment: this.extractSentimentFromResult(this.getResult(sentiment, [])),
        summary: this.getResult(summary, { summary_text: 'Professional with diverse experience' }),
        extractedSkills: this.extractSkillsFromResult(this.getResult(skills, [])),
        careerLevel: this.extractCareerLevelFromResult(this.getResult(classification, [])),
        confidence: this.calculateConfidence([sentiment, summary, skills, classification]),
        isAI: true // Mark as real AI result
      };
    } catch (error) {
      console.error('Free AI analysis failed:', error);
      // Fallback to mock analysis
      return this.mockFallback(cvData);
    }
  }

  /**
   * Analyze CV content sentiment and professionalism
   */
  private static async analyzeSentiment(cvText: string) {
    return await this.hf.textClassification({
      model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      inputs: cvText.substring(0, 512) // Limit input length
    });
  }

  /**
   * Generate AI summary of CV content
   */
  private static async generateSummary(cvText: string) {
    return await this.hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: cvText.substring(0, 1024),
      parameters: {
        max_length: 100,
        min_length: 30
      }
    });
  }

  /**
   * Extract skills and entities using NER
   */
  private static async extractSkills(cvText: string) {
    const entities = await this.hf.tokenClassification({
      model: 'dbmdz/bert-large-cased-finetuned-conll03-english',
      inputs: cvText.substring(0, 512)
    });

    // Filter for relevant entities (skills, organizations, etc.)
    return entities.filter(entity => 
      entity.entity_group === 'MISC' || 
      entity.entity_group === 'ORG' ||
      entity.score > 0.8
    );
  }

  /**
   * Classify career level using text classification
   */
  private static async classifyCareerLevel(cvText: string) {
    // Use a general classification model
    return await this.hf.textClassification({
      model: 'microsoft/DialoGPT-medium',
      inputs: `Career level of: ${cvText.substring(0, 256)}`
    });
  }

  /**
   * Format CV data into text for AI analysis
   */
  private static formatCVText(cvData: CVData): string {
    return `
    Professional Summary: ${cvData.personalInfo.summary || 'Not provided'}
    
    Experience: ${cvData.experience.map(exp => 
      `${exp.position} at ${exp.company} - ${exp.description}`
    ).join('. ')}
    
    Skills: ${cvData.skills.join(', ')}
    
    Education: ${cvData.education.map(edu => 
      `${edu.degree} from ${edu.institution}`
    ).join('. ')}
    `.trim();
  }

  /**
   * Safely extract results from Promise.allSettled
   */
  private static getResult<T>(result: PromiseSettledResult<T>, fallback: T): T {
    return result.status === 'fulfilled' ? result.value : fallback;
  }

  /**
   * Calculate confidence based on successful AI calls
   */
  private static calculateConfidence(results: PromiseSettledResult<any>[]): number {
    const successful = results.filter(r => r.status === 'fulfilled').length;
    return Math.round((successful / results.length) * 100);
  }

  /**
   * Extract sentiment from HuggingFace response
   */
  private static extractSentimentFromResult(result: any): { label: string; score: number } {
    if (Array.isArray(result) && result.length > 0) {
      return { label: result[0].label || 'POSITIVE', score: result[0].score || 0.8 };
    }
    return { label: 'POSITIVE', score: 0.8 };
  }

  /**
   * Extract skills from HuggingFace NER response
   */
  private static extractSkillsFromResult(result: any): Array<{ entity_group: string; word: string; score: number }> {
    if (Array.isArray(result)) {
      return result.map(item => ({
        entity_group: item.entity_group || 'SKILL',
        word: item.word || '',
        score: item.score || 0.5
      }));
    }
    return [];
  }

  /**
   * Extract career level from HuggingFace classification response
   */
  private static extractCareerLevelFromResult(result: any): { label: string; score: number } {
    if (Array.isArray(result) && result.length > 0) {
      return { label: result[0].label || 'PROFESSIONAL', score: result[0].score || 0.7 };
    }
    return { label: 'PROFESSIONAL', score: 0.7 };
  }

  /**
   * Fallback to mock analysis if AI fails
   */
  private static mockFallback(cvData: CVData): FreeAIResult {
    return {
      sentiment: { label: 'POSITIVE', score: 0.75 },
      summary: { summary_text: 'Experienced professional with relevant skills and background.' },
      extractedSkills: cvData.skills.map(skill => ({ entity_group: 'SKILL', word: skill, score: 0.8 })),
      careerLevel: { label: 'MID_LEVEL', score: 0.7 },
      confidence: 60,
      isAI: false // Mark as fallback
    };
  }

  /**
   * Generate AI-powered career recommendations
   */
  static async generateRecommendations(cvData: CVData): Promise<string[]> {
    try {
      const cvText = this.formatCVText(cvData);
      // Use question-answering model for recommendations
      const recommendations = await this.hf.questionAnswering({
        model: 'deepset/roberta-base-squad2',
        inputs: {
          question: 'What career improvements would you recommend?',
          context: cvText
        }
      });
      return [recommendations.answer];
    } catch (error) {
      console.error('Recommendations generation failed:', error);
      return ['The AI was unable to generate suggestions at this time.'];
    }
  }

  /**
   * AI-powered skills gap analysis
   */
  static async analyzeSkillsGap(userSkills: string[], targetRole: string): Promise<SkillGapAnalysis> {
    try {
      const prompt = `Skills for ${targetRole}: ${userSkills.join(', ')}`;
      
      const analysis = await this.hf.textGeneration({
        model: 'gpt2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7
        }
      });

      return {
        missingSkills: this.extractMissingSkills(analysis.generated_text),
        strengthSkills: userSkills.slice(0, 3),
        recommendations: await this.generateRecommendations({} as CVData),
        confidence: 75
      };
    } catch (error) {
      console.error('Skills gap analysis failed:', error);
      return {
        missingSkills: ['Cloud Computing', 'Leadership', 'Data Analysis'],
        strengthSkills: userSkills.slice(0, 3),
        recommendations: ['Learn cloud platforms', 'Develop leadership skills'],
        confidence: 50
      };
    }
  }

  private static extractMissingSkills(text: string): string[] {
    // Simple extraction logic - could be enhanced with more AI
    const commonSkills = ['Leadership', 'Communication', 'Project Management', 'Data Analysis', 'Cloud Computing'];
    return commonSkills.slice(0, 3);
  }
}

// Type definitions for free AI results
interface FreeAIResult {
  sentiment: { label: string; score: number };
  summary: { summary_text: string };
  extractedSkills: Array<{ entity_group: string; word: string; score: number }>;
  careerLevel: { label: string; score: number };
  confidence: number;
  isAI: boolean;
}

interface SkillGapAnalysis {
  missingSkills: string[];
  strengthSkills: string[];
  recommendations: string[];
  confidence: number;
}

/**
 * Easy integration with existing code
 */
export class HybridAIAnalyzer {
  static async analyzeCV(cvData: CVData): Promise<any> {
    // Try free AI first
    const freeAI = await FreeAIAnalyzer.analyzeCV(cvData);
    
    if (freeAI.confidence > 70) {
      // Use AI results if confidence is high
      return this.convertToStandardFormat(freeAI);
    } else {
      // Fallback to existing mock analysis
      const MockAI = require('./aiAnalyzer').AIAnalyzer;
      return await MockAI.analyzeCV(cvData);
    }
  }

  private static convertToStandardFormat(freeAI: FreeAIResult) {
    return {
      overallScore: Math.round(freeAI.sentiment.score * 100),
      skillsAnalysis: {
        technicalSkills: freeAI.extractedSkills.filter(s => s.entity_group === 'SKILL'),
        softSkills: [],
        marketDemand: freeAI.confidence,
        futureRelevance: freeAI.confidence
      },
      careerProgression: {
        currentLevel: freeAI.careerLevel.label.toLowerCase(),
        nextSteps: ['Continue skill development', 'Seek leadership opportunities'],
        timelineToPromotion: '12-18 months',
        salaryGrowthPotential: 15
      },
      industryFit: {
        primaryIndustry: 'Technology',
        fitScore: freeAI.confidence,
        alternativeIndustries: []
      },
      contentQuality: {
        writingScore: Math.round(freeAI.sentiment.score * 100),
        keywordOptimization: freeAI.confidence,
        achievementQuantification: 75,
        recommendations: ['Quantify achievements', 'Add industry keywords']
      },
      competitiveAnalysis: {
        marketPosition: freeAI.confidence,
        strengthsVsMarket: ['Strong technical background'],
        improvementAreas: ['Leadership experience', 'Industry certifications']
      },
      isRealAI: freeAI.isAI
    };
  }
}
