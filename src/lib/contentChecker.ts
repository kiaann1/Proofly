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

// Common clichés and overused phrases to avoid in CVs
const CV_CLICHES = [
  'results-driven',
  'proven track record',
  'think outside the box',
  'hit the ground running',
  'work hard play hard',
  'go-getter',
  'team player',
  'detail-oriented',
  'hardworking',
  'self-motivated',
  'passionate',
  'dynamic',
  'synergy',
  'leverage',
  'utilize',
  'customer-focused',
  'innovative',
  'cutting-edge',
  'world-class',
  'best of breed',
  'value-add',
  'best practices',
  'low-hanging fruit',
  'move the needle',
  'touch base',
  'circle back',
  'deep dive',
  'game changer',
  'paradigm shift',
];

// Weak/filler words that should be avoided or used sparingly
const WEAK_WORDS = [
  'very',
  'really',
  'quite',
  'rather',
  'fairly',
  'pretty',
  'somewhat',
  'sort of',
  'kind of',
  'stuff',
  'things',
  'just',
  'maybe',
  'perhaps',
  'probably',
];

// Strong action verbs for CV optimization
const STRONG_ACTION_VERBS = [
  'achieved', 'accelerated', 'accomplished', 'analyzed', 'built', 'created',
  'delivered', 'developed', 'enhanced', 'established', 'executed', 'generated',
  'implemented', 'improved', 'increased', 'initiated', 'launched', 'led',
  'managed', 'optimized', 'organized', 'reduced', 'resolved', 'streamlined',
  'transformed', 'coordinated', 'supervised', 'directed', 'pioneered',
  'spearheaded', 'orchestrated', 'facilitated', 'negotiated', 'collaborated'
];

// Common grammar mistakes
const GRAMMAR_PATTERNS = [
  {
    pattern: /\bi\s/gi,
    message: 'Avoid using first person ("I") in CV descriptions',
    suggestion: 'Use action verbs directly (e.g., "Managed team" instead of "I managed team")'
  },
  {
    pattern: /\bme\b/gi,
    message: 'Avoid using first person pronouns in CV descriptions',
    suggestion: 'Rephrase without personal pronouns'
  },
  {
    pattern: /\bmy\b/gi,
    message: 'Avoid using possessive pronouns in CV descriptions',
    suggestion: 'Rephrase to be more direct (e.g., "the team" instead of "my team")'
  },
  {
    pattern: /\.\s*\./g,
    message: 'Duplicate periods found',
    suggestion: 'Remove extra periods'
  },
  {
    pattern: /\s{2,}/g,
    message: 'Multiple spaces found',
    suggestion: 'Use single spaces between words'
  },
  {
    pattern: /[a-z]\.[A-Z]/g,
    message: 'Missing space after period',
    suggestion: 'Add space after periods'
  }
];

/**
 * Analyze content for grammar, style, and professionalism
 */
export function analyzeContent(text: string): ContentAnalysis {
  const issues: ContentIssue[] = [];
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Check for clichés
  CV_CLICHES.forEach(cliche => {
    const regex = new RegExp(`\\b${cliche.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(() => {
        issues.push({
          type: 'cliche',
          severity: 'medium',
          message: `Avoid the cliché phrase "${cliche}"`,
          suggestion: 'Use more specific, measurable language instead'
        });
      });
    }
  });

  // Check for weak words
  WEAK_WORDS.forEach(weakWord => {
    const regex = new RegExp(`\\b${weakWord}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 2) { // Allow occasional use
      issues.push({
        type: 'style',
        severity: 'low',
        message: `Overuse of weak word "${weakWord}" (${matches.length} times)`,
        suggestion: 'Consider removing or replacing with stronger language'
      });
    }
  });

  // Check grammar patterns
  GRAMMAR_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern.pattern);
    if (matches) {
      matches.forEach(() => {
        issues.push({
          type: 'grammar',
          severity: pattern.message.includes('first person') ? 'high' : 'medium',
          message: pattern.message,
          suggestion: pattern.suggestion
        });
      });
    }
  });

  // Check for missing action verbs at start of bullet points
  const lines = text.split('\n').filter(line => line.trim());
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.substring(1).trim();
      const firstWord = content.split(' ')[0]?.toLowerCase();
      
      if (firstWord && !STRONG_ACTION_VERBS.includes(firstWord) && !firstWord.endsWith('ed')) {
        issues.push({
          type: 'suggestion',
          severity: 'medium',
          message: 'Consider starting bullet points with strong action verbs',
          suggestion: `Try starting with: ${STRONG_ACTION_VERBS.slice(0, 3).join(', ')}, etc.`
        });
      }
    }
  });

  // Check for quantifiable achievements
  const hasNumbers = /\d/.test(text);
  const hasPercentages = /%/.test(text);
  const hasCurrency = /\$|€|£|¥/.test(text);
  
  if (!hasNumbers && !hasPercentages && !hasCurrency && wordCount > 50) {
    issues.push({
      type: 'suggestion',
      severity: 'medium',
      message: 'Consider adding quantifiable achievements',
      suggestion: 'Include numbers, percentages, or metrics to demonstrate impact'
    });
  }

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

  // Calculate scores
  const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2));
  
  const criticalIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;
  const lowIssues = issues.filter(i => i.severity === 'low').length;
  
  const professionalismScore = Math.max(0, 100 - (criticalIssues * 15) - (mediumIssues * 5) - (lowIssues * 2));
  
  const overallScore = Math.round((readabilityScore + professionalismScore) / 2);

  return {
    score: overallScore,
    issues,
    wordCount,
    readabilityScore: Math.round(readabilityScore),
    professionalismScore: Math.round(professionalismScore)
  };
}

/**
 * Get suggestions for improving CV content
 */
export function getContentSuggestions(analysis: ContentAnalysis): string[] {
  const suggestions: string[] = [];
  
  if (analysis.score < 70) {
    suggestions.push('Your CV content could benefit from professional review');
  }
  
  const clicheIssues = analysis.issues.filter(i => i.type === 'cliche').length;
  if (clicheIssues > 3) {
    suggestions.push('Reduce cliché phrases and use more specific, unique language');
  }
  
  const grammarIssues = analysis.issues.filter(i => i.type === 'grammar').length;
  if (grammarIssues > 0) {
    suggestions.push('Review grammar and avoid first-person language');
  }
  
  if (analysis.wordCount < 100) {
    suggestions.push('Consider adding more detail to showcase your achievements');
  } else if (analysis.wordCount > 400) {
    suggestions.push('Consider condensing content for better readability');
  }
  
  const hasQuantifiableAchievements = analysis.issues.some(i => 
    i.message.includes('quantifiable achievements')
  );
  
  if (hasQuantifiableAchievements) {
    suggestions.push('Add specific numbers, percentages, and metrics to demonstrate impact');
  }
  
  return suggestions;
}
