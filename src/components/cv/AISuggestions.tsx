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
  onApplySuggestion, 
  onApplyContextualSuggestion 
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [contextualSuggestions, setContextualSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState<'general' | 'contextual'>('general');

  // Generate contextual AI suggestions for the active field
  const generateContextualSuggestions = async () => {
    if (!activeField || !fieldValue) return [];

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const contextualSugs: any[] = [];

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
        break;

      case 'experience-description':
        if (fieldValue && !fieldValue.match(/\d+%|\$\d+|\d+\+|increased|improved|reduced|achieved/i)) {
          const metrics = generateRelevantMetrics(fieldValue);
          contextualSugs.push({
            id: 'exp-quantify',
            type: 'improve',
            title: 'Add measurable impact',
            suggestion: `${fieldValue.trim()} ${metrics}`,
            reasoning: 'Quantified achievements make your experience more credible',
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
            reasoning: 'These skills are commonly required in your field',
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
      return 'Increased revenue by 25% and exceeded quarterly targets by $50K.';
    } else if (lowerDesc.includes('develop') || lowerDesc.includes('code')) {
      return 'Reduced loading time by 40% and improved system performance by 60%.';
    } else if (lowerDesc.includes('manage') || lowerDesc.includes('lead')) {
      return 'Managed team of 8+ members and improved productivity by 35%.';
    } else if (lowerDesc.includes('customer') || lowerDesc.includes('support')) {
      return 'Achieved 95% customer satisfaction rate and reduced response time by 50%.';
    } else {
      return 'Achieved 90% success rate and completed projects 20% ahead of schedule.';
    }
  };

  const generateSkillSuggestions = (): string[] => {
    const existingSkills = cvData.skills.map(s => s.toLowerCase());
    const skillSuggestions = ['Leadership', 'Project Management', 'Problem Solving', 'Communication'];
    return skillSuggestions.filter(skill => !existingSkills.includes(skill.toLowerCase()));
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
      className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden"
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
            className={`flex-1 text-sm py-2 px-3 rounded transition-colors ${
              activeView === 'contextual' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Writing Help {activeField && `(${activeField.replace('-', ' ')})`}
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
      <div className="max-h-96 overflow-y-auto">
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
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-full inline-block mb-4">
                Editing: {activeField.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            )}
            {contextualSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">{suggestion.title}</h4>
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
