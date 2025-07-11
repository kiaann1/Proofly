/**
 * AI-Powered Tooltip Component for CV Builder
 * Provides contextual AI suggestions for form fields
 */
'use client';

import { useState } from 'react';
import { CVData } from '../../types';
import { getLLMTooltipContent } from '../../lib/llmTooltip';

interface AITooltipProps {
  fieldType: 'experience' | 'education' | 'skills' | 'certifications' | 'languages' | 'summary';
  context?: string; // Current field value or related context
  cvData?: CVData; // Full CV data for context-aware suggestions
  children: React.ReactNode;
  className?: string;
}

export default function AITooltip({ fieldType, context = '', cvData, children, className }: AITooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseEnter = async () => {
    if (!isVisible && !tooltipContent) {
      setIsLoading(true);
      setIsVisible(true);
      try {
        const content = await getLLMTooltipContent(fieldType, context, cvData);
        setTooltipContent(content);
      } catch (error) {
        setTooltipContent({
          title: 'AI Suggestion Unavailable',
          suggestions: ['The AI was unable to generate suggestions at this time.'],
          examples: [],
          tips: []
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* AI Tooltip */}
      {isVisible && (
        <div className="absolute z-50 w-80 p-4 bg-white rounded-xl shadow-2xl border border-gray-200 -top-2 left-full ml-2 transform">
          {/* Arrow */}
          <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          
          {isLoading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">AI is thinking...</span>
            </div>
          ) : tooltipContent && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-2">
                {tooltipContent.title}
              </h3>
              
              {/* Suggestions */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1">Smart Suggestions:</h4>
                <ul className="space-y-1">
                  {tooltipContent.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Examples */}
              {tooltipContent.examples && tooltipContent.examples.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Examples:</h4>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600 italic">
                      "{tooltipContent.examples[0]}"
                    </p>
                  </div>
                </div>
              )}
              
              {/* AI Badge */}
              <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                <span className="text-xs text-blue-600">🤖</span>
                <span className="text-xs text-blue-600 font-medium">AI-Powered Suggestions</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
