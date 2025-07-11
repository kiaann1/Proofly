/**
 * AI Suggestions Component for Real-time CV Enhancement
 * Provides smart content suggestions and improvements
 */
'use client';

import { useState, useEffect } from 'react';
import { CVData } from '../../types';

interface AISuggestionsProps {
  cvData: CVData;
  activeTab: string;
  activeField?: string;
  fieldValue?: string;
  activeFieldIndex?: number;
  onApplySuggestion: (suggestion: Suggestion) => void;
  onApplyContextualSuggestion?: (field: string, value: string) => void;
}

interface Suggestion {
  id: string;
  type: 'skill' | 'experience' | 'improvement' | 'keyword';
  title: string;
  description: string;
  value: string;
  confidence: number;
  field?: string;
  index?: number;
}

export default function AISuggestions({ 
  cvData, 
  activeTab, 
  activeField, 
  fieldValue = '', 
  activeFieldIndex = -1,
  onApplySuggestion, 
  onApplyContextualSuggestion 
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [contextualSuggestions, setContextualSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState<'general' | 'contextual'>('general');

  // Calculate writing quality score
  const calculateWritingScore = (text: string) => {
    if (!text || text.length < 10) return 0;
    
    let score = 70; // Base score
    
    // Grammar checks
    if (text.trim().endsWith('.') || text.trim().endsWith('!')) score += 5;
    if (text.charAt(0) === text.charAt(0).toUpperCase()) score += 5;
    
    // Content quality checks
    if (text.match(/\d+%|\$\d+|\d+\+/)) score += 10; // Has metrics
    if (text.match(/^(Led|Managed|Developed|Implemented|Created|Optimized|Delivered|Achieved)/i)) score += 10; // Strong action verb
    if (text.length > 50 && text.length < 150) score += 5; // Good length
    if (!text.match(/very|really|quite|pretty|somewhat|rather/i)) score += 5; // No weak words
    
    // Penalties
    if (text.match(/things|stuff|various|many|several|some/)) score -= 10; // Vague language
    if (text.toLowerCase().split(/\s+/).length < 5) score -= 10; // Too short
    
    return Math.max(0, Math.min(100, score));
  };

  // Analyze text for grammar, style, and content improvements
  const analyzeWriting = (text: string) => {
    const suggestions = [];
    
    // Grammar and punctuation checks
    if (text && !text.trim().endsWith('.') && !text.trim().endsWith('!') && text.length > 10) {
      suggestions.push({
        type: 'punctuation',
        issue: 'Missing period',
        suggestion: `${text.trim()}.`,
        explanation: 'Professional descriptions should end with proper punctuation'
      });
    }
    
    // Capitalization check
    if (text && text.length > 0 && text.charAt(0) !== text.charAt(0).toUpperCase()) {
      suggestions.push({
        type: 'capitalization',
        issue: 'Lowercase start',
        suggestion: text.charAt(0).toUpperCase() + text.slice(1),
        explanation: 'Sentences should start with capital letters'
      });
    }
    
    // Weak words detection
    const weakWords = ['very', 'really', 'quite', 'pretty', 'somewhat', 'rather'];
    const foundWeak = weakWords.find(word => text.toLowerCase().includes(word));
    if (foundWeak) {
      suggestions.push({
        type: 'word-choice',
        issue: `Weak word: "${foundWeak}"`,
        suggestion: text.replace(new RegExp(foundWeak, 'gi'), '[stronger alternative]'),
        explanation: 'Avoid weak qualifiers in professional writing'
      });
    }
    
    // Passive voice detection
    const passiveIndicators = ['was', 'were', 'been', 'being'];
    const hasPassive = passiveIndicators.some(word => 
      text.toLowerCase().includes(word + ' ') && text.toLowerCase().includes('by ')
    );
    if (hasPassive) {
      suggestions.push({
        type: 'voice',
        issue: 'Possible passive voice',
        suggestion: 'Consider using active voice',
        explanation: 'Active voice is more engaging and direct'
      });
    }
    
    // Repetitive words
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    const repeatedWords = Object.entries(wordCounts).filter(([word, count]) => (count as number) > 2);
    if (repeatedWords.length > 0) {
      suggestions.push({
        type: 'repetition',
        issue: `Repeated word: "${repeatedWords[0][0]}"`,
        suggestion: 'Consider using synonyms for variety',
        explanation: 'Varied vocabulary keeps writing engaging'
      });
    }
    
    return suggestions;
  };

  // Generate contextual AI suggestions for the active field
  const generateContextualSuggestions = async () => {
    if (!activeField || !fieldValue) return [];

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const contextualSugs: any[] = [];
    
    // First, analyze the writing quality
    const writingAnalysis = analyzeWriting(fieldValue);
    writingAnalysis.forEach((analysis, index) => {
      contextualSugs.push({
        id: `writing-${index}`,
        type: 'writing-help',
        title: `Fix ${analysis.issue}`,
        suggestion: analysis.suggestion,
        reasoning: analysis.explanation,
        category: analysis.type
      });
    });

    switch (activeField) {
      case 'summary':
        if (fieldValue.length < 50) {
          const relevantSkills = cvData.skills.slice(0, 3).join(', ') || 'key technologies';
          const yearsExp = cvData.experience.length > 0 ? cvData.experience.length + '+' : '3+';
          contextualSugs.push({
            id: 'summary-expand',
            type: 'enhance',
            title: 'Expand with professional details',
            suggestion: `${fieldValue} ${yearsExp} years experienced professional specializing in ${relevantSkills}. Proven track record of delivering high-impact solutions and driving innovation in dynamic environments.`,
            reasoning: 'Professional summaries should be 80-120 words and highlight your expertise',
          });
        }
        
        // Check for missing key elements
        if (fieldValue && !fieldValue.match(/\d+\s*(years?|yrs?)/i)) {
          contextualSugs.push({
            id: 'summary-experience',
            type: 'content',
            title: 'Add years of experience',
            suggestion: `${fieldValue.replace(/^./, match => match.toUpperCase())} with ${cvData.experience.length}+ years of experience`,
            reasoning: 'Including years of experience provides immediate context to employers'
          });
        }
        
        if (fieldValue && !fieldValue.match(/seeking|looking|pursuing|interested/i)) {
          contextualSugs.push({
            id: 'summary-objective',
            type: 'content',
            title: 'Add career objective',
            suggestion: `${fieldValue} Seeking to leverage expertise in a challenging senior role.`,
            reasoning: 'A clear objective helps employers understand your career goals'
          });
        }
        break;

      case 'experience-description':
        // Check for quantifiable metrics
        if (fieldValue && !fieldValue.match(/\d+%|\$\d+|\d+\+|increased|improved|reduced|achieved|delivered|managed|led/i)) {
          const metrics = generateRelevantMetrics(fieldValue);
          const enhancedDescription = `${fieldValue.trim()} ${metrics}`;
          contextualSugs.push({
            id: 'exp-quantify',
            type: 'improve',
            title: 'Add measurable impact',
            suggestion: enhancedDescription,
            reasoning: 'Quantified achievements make your experience more credible and impressive to employers',
          });
        }
        
        // Suggest action words if the description is lacking strong verbs
        if (fieldValue && !fieldValue.match(/^(Led|Managed|Developed|Implemented|Created|Optimized|Delivered|Achieved|Improved|Reduced|Increased)/i)) {
          const actionVerbs = ['Led', 'Managed', 'Developed', 'Implemented', 'Created', 'Optimized'];
          const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
          contextualSugs.push({
            id: 'exp-action-verb',
            type: 'improve',
            title: 'Start with a strong action verb',
            suggestion: `${randomVerb} ${fieldValue.toLowerCase()}`,
            reasoning: 'Starting bullet points with action verbs makes your experience more impactful',
          });
        }
        
        // Check for vague language
        const vagueWords = ['things', 'stuff', 'various', 'many', 'several', 'some'];
        const foundVague = vagueWords.find(word => fieldValue.toLowerCase().includes(word));
        if (foundVague) {
          contextualSugs.push({
            id: 'exp-specific',
            type: 'word-choice',
            title: 'Be more specific',
            suggestion: fieldValue.replace(new RegExp(foundVague, 'gi'), '[specific details]'),
            reasoning: `Replace "${foundVague}" with specific details to make your impact clearer`
          });
        }
        
        // Suggest adding technology/tools if missing
        if (fieldValue && fieldValue.length > 20 && !fieldValue.match(/using|with|through|via/i)) {
          contextualSugs.push({
            id: 'exp-tools',
            type: 'content',
            title: 'Mention tools or technologies',
            suggestion: `${fieldValue} using [relevant tools/technologies]`,
            reasoning: 'Mentioning specific tools shows technical competency'
          });
        }
        break;

      case 'skills':
        const suggestedSkills = generateSkillSuggestions();
        if (suggestedSkills.length > 0) {
          contextualSugs.push({
            id: 'skills-suggest',
            type: 'enhance',
            title: 'Add relevant skills',
            suggestion: suggestedSkills.slice(0, 3).join(', '),
            reasoning: 'These skills are commonly valued in your field and align with your experience',
          });
        }
        
        // Suggest skill categories if they have less than 5 skills
        if (cvData.skills.length < 5) {
          const skillCategories = ['Technical Skills', 'Soft Skills', 'Tools & Software', 'Industry Knowledge'];
          contextualSugs.push({
            id: 'skills-categories',
            type: 'enhance',
            title: 'Consider organizing skills by category',
            suggestion: 'Group your skills: Technical (programming languages, tools), Soft (communication, leadership), Industry-specific (domain knowledge)',
            reasoning: 'Well-organized skills sections are easier for recruiters to scan and understand',
          });
        }
        break;

      case 'education-description':
        if (fieldValue && fieldValue.length < 30) {
          contextualSugs.push({
            id: 'edu-expand',
            type: 'enhance',
            title: 'Enhance education details',
            suggestion: `${fieldValue} Relevant coursework included Advanced Data Structures, Machine Learning, and Software Engineering. Graduated Magna Cum Laude with active participation in coding competitions and student tech initiatives.`,
            reasoning: 'Detailed education descriptions showcase relevant learning and achievements',
          });
        }
        
        if (fieldValue && !fieldValue.match(/relevant|coursework|project|honor|award|gpa|magna|cum laude/i)) {
          contextualSugs.push({
            id: 'edu-details',
            type: 'improve',
            title: 'Add academic achievements',
            suggestion: `${fieldValue} Relevant coursework: [List key subjects]. Notable achievement: [Academic honors, projects, or GPA if 3.5+].`,
            reasoning: 'Including specific coursework and achievements makes your education more compelling',
          });
        }
        
        // Check for missing GPA mention (if it's good)
        if (fieldValue && fieldValue.length > 10 && !fieldValue.match(/gpa|grade|3\.|4\./i)) {
          contextualSugs.push({
            id: 'edu-gpa',
            type: 'content',
            title: 'Consider mentioning GPA',
            suggestion: `${fieldValue} (GPA: 3.8/4.0)`,
            reasoning: 'Include GPA if 3.5 or higher to demonstrate academic excellence'
          });
        }
        
        // Suggest adding projects if missing
        if (fieldValue && !fieldValue.match(/project|thesis|research|capstone/i)) {
          contextualSugs.push({
            id: 'edu-projects',
            type: 'content',
            title: 'Mention relevant projects',
            suggestion: `${fieldValue} Key project: [Describe a relevant academic project or thesis]`,
            reasoning: 'Academic projects demonstrate practical application of knowledge'
          });
        }
        break;
    }

    setIsAnalyzing(false);
    return contextualSugs;
  };

  const generateRelevantMetrics = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('sales') || lowerDesc.includes('revenue')) {
      return 'Increased revenue by 25% through strategic client engagement and exceeded quarterly targets by $150K.';
    } else if (lowerDesc.includes('develop') || lowerDesc.includes('code') || lowerDesc.includes('software')) {
      return 'Reduced page load time by 40% and improved system performance by 60%, resulting in 15% higher user retention.';
    } else if (lowerDesc.includes('manage') || lowerDesc.includes('lead') || lowerDesc.includes('team')) {
      return 'Managed cross-functional team of 8+ members and improved delivery efficiency by 35%, completing projects 2 weeks ahead of schedule.';
    } else if (lowerDesc.includes('customer') || lowerDesc.includes('support') || lowerDesc.includes('service')) {
      return 'Achieved 95% customer satisfaction rate and reduced average response time by 50%, handling 200+ inquiries daily.';
    } else if (lowerDesc.includes('market') || lowerDesc.includes('campaign') || lowerDesc.includes('advertising')) {
      return 'Drove 45% increase in brand awareness and generated 300+ qualified leads through targeted digital campaigns.';
    } else if (lowerDesc.includes('data') || lowerDesc.includes('analysis') || lowerDesc.includes('report')) {
      return 'Analyzed complex datasets of 10M+ records and delivered insights that improved decision-making accuracy by 30%.';
    } else if (lowerDesc.includes('budget') || lowerDesc.includes('cost') || lowerDesc.includes('financial')) {
      return 'Managed $2M annual budget and reduced operational costs by 20% while maintaining quality standards.';
    } else if (lowerDesc.includes('train') || lowerDesc.includes('mentor') || lowerDesc.includes('teach')) {
      return 'Trained and mentored 15+ junior staff members, resulting in 80% internal promotion rate and improved team productivity.';
    } else {
      return 'Achieved 90% success rate in project delivery and completed initiatives 20% ahead of schedule, exceeding performance targets.';
    }
  };

  const generateSkillSuggestions = (): string[] => {
    const existingSkills = cvData.skills.map(s => s.toLowerCase());
    const experienceText = cvData.experience.map(exp => exp.description).join(' ').toLowerCase();
    
    // Dynamic skill suggestions based on experience
    const suggestedSkills: string[] = [];
    
    // Technical skills based on experience keywords
    if (experienceText.includes('javascript') || experienceText.includes('js')) suggestedSkills.push('JavaScript');
    if (experienceText.includes('react')) suggestedSkills.push('React');
    if (experienceText.includes('python')) suggestedSkills.push('Python');
    if (experienceText.includes('sql') || experienceText.includes('database')) suggestedSkills.push('SQL');
    if (experienceText.includes('aws') || experienceText.includes('cloud')) suggestedSkills.push('AWS');
    if (experienceText.includes('manage') || experienceText.includes('lead')) suggestedSkills.push('Leadership');
    if (experienceText.includes('project')) suggestedSkills.push('Project Management');
    if (experienceText.includes('team') || experienceText.includes('collaborate')) suggestedSkills.push('Team Collaboration');
    if (experienceText.includes('problem') || experienceText.includes('solve')) suggestedSkills.push('Problem Solving');
    if (experienceText.includes('communicate') || experienceText.includes('present')) suggestedSkills.push('Communication');
    
    // Add general professional skills if no specific technical skills found
    if (suggestedSkills.length === 0) {
      suggestedSkills.push('Critical Thinking', 'Time Management', 'Adaptability', 'Strategic Planning');
    }
    
    return suggestedSkills.filter(skill => !existingSkills.includes(skill.toLowerCase())).slice(0, 5);
  };
  const generateSuggestions = async (): Promise<Suggestion[]> => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: Suggestion[] = [];

    // Skill suggestions based on experience
    if (cvData.experience.length > 0) {
      const experienceText = cvData.experience.map(exp => exp.description).join(' ');
      const commonTechSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Git'];
      
      commonTechSkills.forEach(skill => {
        if (!cvData.skills.includes(skill) && experienceText.toLowerCase().includes(skill.toLowerCase())) {
          suggestions.push({
            id: `skill-${skill}`,
            type: 'skill',
            title: `Add "${skill}" to skills`,
            description: `Found mention of ${skill} in your experience. Consider adding it to your skills section.`,
            value: skill,
            confidence: 85
          });
        }
      });
    }

    // Experience enhancement suggestions
    cvData.experience.forEach((exp, index) => {
      if (exp.description && !exp.description.match(/\d+%|\$\d+|\d+\+/)) {
        suggestions.push({
          id: `exp-${index}-metrics`,
          type: 'improvement',
          title: 'Add quantifiable achievements',
          description: `Consider adding specific metrics, percentages, or dollar amounts to make this role more impactful.`,
          value: `${exp.description} (Add specific metrics here)`,
          confidence: 90,
          field: 'experience',
          index
        });
      }

      if (exp.description && exp.description.split(' ').length < 15) {
        suggestions.push({
          id: `exp-${index}-expand`,
          type: 'improvement',
          title: 'Expand role description',
          description: `This role description seems brief. Consider adding more details about your responsibilities and achievements.`,
          value: exp.description,
          confidence: 75,
          field: 'experience',
          index
        });
      }
    });

    // Keyword suggestions for ATS optimization
    const commonKeywords = [
      { keyword: 'leadership', confidence: 80, reason: 'Important for management roles' },
      { keyword: 'project management', confidence: 85, reason: 'Highly valued across industries' },
      { keyword: 'problem-solving', confidence: 75, reason: 'Essential soft skill' },
      { keyword: 'collaboration', confidence: 70, reason: 'Important for team environments' }
    ];

    const allText = (cvData.personalInfo.summary + ' ' + 
                    cvData.experience.map(e => e.description).join(' ')).toLowerCase();

    commonKeywords.forEach(({ keyword, confidence, reason }) => {
      if (!allText.includes(keyword.toLowerCase())) {
        suggestions.push({
          id: `keyword-${keyword}`,
          type: 'keyword',
          title: `Consider adding "${keyword}"`,
          description: `${reason}. This keyword could improve your ATS compatibility.`,
          value: keyword,
          confidence
        });
      }
    });

    // Summary improvement suggestions
    if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 50) {
      suggestions.push({
        id: 'summary-add',
        type: 'improvement',
        title: 'Add professional summary',
        description: 'A strong professional summary can significantly improve your CV\'s impact and ATS performance.',
        value: 'Professional [Your Title] with [X] years of experience in [Industry/Skills]. Proven track record of [Key Achievement]. Seeking to leverage expertise in [Relevant Skills] to drive results at [Target Company Type].',
        confidence: 95,
        field: 'summary'
      });
    }

    setIsAnalyzing(false);
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5); // Top 5 suggestions
  };

  // Analyze CV when data changes or tab switches
  useEffect(() => {
    const analyzeCV = async () => {
      if (cvData.personalInfo.name || cvData.experience.length > 0 || cvData.skills.length > 0) {
        const newSuggestions = await generateSuggestions();
        setSuggestions(newSuggestions);
        if (newSuggestions.length > 0) {
          setIsVisible(true);
        }
      }
    };

    analyzeCV();
  }, [cvData, activeTab]);

  // Generate contextual suggestions when field changes
  useEffect(() => {
    const updateContextual = async () => {
      if (activeField && fieldValue) {
        const contextual = await generateContextualSuggestions();
        setContextualSuggestions(contextual);
        if (contextual.length > 0) {
          setActiveView('contextual');
          setIsVisible(true);
        }
      } else {
        setContextualSuggestions([]);
        setActiveView('general');
      }
    };

    updateContextual();
  }, [activeField, fieldValue, cvData]);

  const handleApplySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion(suggestion);
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  if (!isVisible && suggestions.length === 0 && contextualSuggestions.length === 0) return null;

  return (
    <div 
      data-ai-assistant
      className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[700px] overflow-hidden"
      onMouseDown={(e) => e.preventDefault()} // Prevent losing focus when clicking
    >
      {/* Header with Tabs */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            onClick={() => setActiveView('contextual')}
            className={`flex-1 text-sm py-2 px-3 rounded transition-colors relative ${
              activeView === 'contextual' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Writing Help {activeField && `(${activeField.replace('-', ' ')})`}
            {contextualSuggestions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {contextualSuggestions.length}
              </span>
            )}
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            onClick={() => setActiveView('general')}
            className={`flex-1 text-sm py-2 px-3 rounded transition-colors ${
              activeView === 'general' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            CV Tips ({suggestions.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[550px] overflow-y-auto">
        {isAnalyzing ? (
          <div className="p-4 flex items-center gap-3">
            <svg className="animate-spin w-5 h-5 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm text-gray-600">AI is analyzing...</span>
          </div>
        ) : activeView === 'contextual' && contextualSuggestions.length > 0 ? (
          <div className="p-4 space-y-4">
            {activeField && (
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-full">
                  Editing: {activeField.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                {fieldValue && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Writing Quality:</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      calculateWritingScore(fieldValue) >= 80 ? 'bg-green-100 text-green-700' :
                      calculateWritingScore(fieldValue) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {calculateWritingScore(fieldValue)}%
                    </div>
                  </div>
                )}
              </div>
            )}
            {contextualSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      suggestion.category === 'punctuation' ? 'bg-red-100 text-red-600' :
                      suggestion.category === 'capitalization' ? 'bg-orange-100 text-orange-600' :
                      suggestion.category === 'word-choice' ? 'bg-yellow-100 text-yellow-600' :
                      suggestion.category === 'voice' ? 'bg-purple-100 text-purple-600' :
                      suggestion.category === 'repetition' ? 'bg-pink-100 text-pink-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {suggestion.type === 'writing-help' ? 
                        (suggestion.category === 'punctuation' ? '.' :
                         suggestion.category === 'capitalization' ? 'Aa' :
                         suggestion.category === 'word-choice' ? '📝' :
                         suggestion.category === 'voice' ? '🔄' :
                         suggestion.category === 'repetition' ? '🔁' : '✨') : 
                        '💡'
                      }
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">{suggestion.title}</h4>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{suggestion.reasoning}</p>
                <div className="bg-white rounded-lg p-3 mb-4 border-l-4 border-blue-500 shadow-sm">
                  <p className="text-sm text-gray-800 leading-relaxed">"{suggestion.suggestion}"</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                    onClick={() => onApplyContextualSuggestion?.(activeField!, suggestion.suggestion)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    ✨ Apply Suggestion
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                    onClick={() => setContextualSuggestions(prev => prev.filter(s => s.id !== suggestion.id))}
                    className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeView === 'general' && suggestions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {suggestions.slice(0, 4).map((suggestion) => (
              <div key={suggestion.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                    suggestion.confidence >= 90 ? 'bg-green-500' :
                    suggestion.confidence >= 75 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                    onClick={() => handleApplySuggestion(suggestion)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                    onClick={() => handleDismissSuggestion(suggestion.id)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              {activeView === 'contextual' 
                ? 'Click on any field to get AI writing help!' 
                : 'AI suggestions will appear as you build your CV'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
