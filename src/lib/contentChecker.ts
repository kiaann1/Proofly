/**
 * Content Checker - Grammar and style analysis for CV content
 */

export interface ContentIssue {
  type: 'grammar' | 'style' | 'cliche' | 'format' | 'suggestion';
  severity: 'high' | 'medium' | 'low';
  message: string;
  suggestion?: string;
  position?: {
    start: number;
    end: number;
  };
}

export interface ContentAnalysis {
  score: number; // 0-100
  issues: ContentIssue[];
  wordCount: number;
  readabilityScore: number;
  professionalismScore: number;
}

/**
 * Analyze content for grammar, style, and professionalism
 */
export function analyzeContent(text: string): ContentAnalysis {
  const issues: ContentIssue[] = [];
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Check for clichés
  // Check for weak words
  // Check grammar patterns
  // Check for missing action verbs at start of bullet points
  // Check for quantifiable achievements
  // Check sentence length (readability)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? 
    sentences.reduce((sum, sentence) => sum + sentence.trim().split(/\s+/).length, 0) / sentences.length : 0;
  
  if (avgWordsPerSentence > 25) {
    issues.push({
      type: 'style',
      severity: 'medium',
      message: 'Sentences are too long on average',
      suggestion: 'Break long sentences into shorter, more impactful statements'
    });
  }

  // Calculate scores with more realistic content requirements
  const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2));
  
  const criticalIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;
  const lowIssues = issues.filter(i => i.severity === 'low').length;
  
  // Base professionalism score with issue deductions
  let professionalismScore = Math.max(0, 100 - (criticalIssues * 15) - (mediumIssues * 5) - (lowIssues * 2));
  
  // Content completeness penalty - more realistic scoring
  let contentCompletenessScore = 100;
  
  // Penalize for insufficient content length
  if (wordCount < 20) {
    contentCompletenessScore -= 60; // Major penalty for very little content
  } else if (wordCount < 50) {
    contentCompletenessScore -= 40; // Significant penalty for minimal content
  } else if (wordCount < 100) {
    contentCompletenessScore -= 20; // Moderate penalty for light content
  } else if (wordCount < 150) {
    contentCompletenessScore -= 10; // Small penalty for somewhat brief content
  }
  
  // Penalize for lack of quantifiable achievements
  if (!hasNumbers && !hasPercentages && !hasCurrency) {
    contentCompletenessScore -= 15;
  }
  
  // Penalize for excessive clichés
  const clicheCount = issues.filter(i => i.type === 'cliche').length;
  if (clicheCount > 3) {
    contentCompletenessScore -= (clicheCount - 3) * 5;
  }
  
  // Penalize for too many weak words
  const weakWordCount = issues.filter(i => i.type === 'style' && i.message.includes('weak word')).length;
  if (weakWordCount > 2) {
    contentCompletenessScore -= (weakWordCount - 2) * 3;
  }
  
  // Ensure content completeness score doesn't go below 0
  contentCompletenessScore = Math.max(0, contentCompletenessScore);
  
  // Calculate final score as weighted average (content completeness is heavily weighted)
  const overallScore = Math.round((readabilityScore * 0.25) + (professionalismScore * 0.35) + (contentCompletenessScore * 0.4));

  return {
    score: Math.max(0, Math.min(100, overallScore)), // Ensure score is between 0-100
    issues,
    wordCount,
    readabilityScore: Math.round(readabilityScore),
    professionalismScore: Math.round(professionalismScore)
  };
}

/**
 * Get suggestions for improving CV content
 */
import { getLLMContentSuggestions } from './llmContentChecker';

export async function getContentSuggestionsLLM(text: string): Promise<string[]> {
  return await getLLMContentSuggestions({}, text);
}
