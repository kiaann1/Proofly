/**
 * AI-Powered Tooltip Component for CV Builder
 * Provides contextual AI suggestions for form fields
 */
'use client';

import { useState, useEffect } from 'react';
import { CVData } from '../../types';

interface AITooltipProps {
  fieldType: 'experience' | 'education' | 'skills' | 'certifications' | 'languages' | 'summary';
  context?: string; // Current field value or related context
  cvData?: CVData; // Full CV data for context-aware suggestions
  children: React.ReactNode;
  className?: string;
}

interface AITooltipContent {
  title: string;
  suggestions: string[];
  examples: string[];
  tips: string[];
}

export default function AITooltip({ fieldType, context, cvData, children, className }: AITooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<AITooltipContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Analyze content for context-aware suggestions
  const analyzeContent = (text: string) => {
    const suggestions = [];
    const tips = [];

    if (fieldType === 'experience') {
      if (!text.match(/\d+%|\$\d+|\d+\+/)) {
        suggestions.push("Add quantifiable metrics to show your impact");
      }
      if (!text.match(/^(Led|Managed|Developed|Implemented|Created|Optimized)/i)) {
        suggestions.push("Start with a strong action verb");
      }
      if (text.match(/responsible for|duties included/i)) {
        tips.push("Focus on achievements rather than responsibilities");
      }
    }

    if (fieldType === 'summary') {
      if (text.length < 50) {
        suggestions.push("Expand your summary to 80-120 words for better impact");
      }
      if (!text.match(/\d+\s*(years?|yrs?)/i)) {
        suggestions.push("Include your years of experience");
      }
      if (!text.match(/seeking|looking|pursuing|interested/i)) {
        suggestions.push("Add what type of role you're seeking");
      }
      if (text.match(/very|really|quite|pretty/i)) {
        tips.push("Avoid weak qualifiers - be direct and confident");
      }
    }

    return { suggestions, tips };
  };

  // Generate AI-powered suggestions based on field type and context
  const generateTooltipContent = async (): Promise<AITooltipContent> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Analyze the current context if provided
    const contextAnalysis = context ? analyzeContent(context) : null;

    const baseContent: Record<string, AITooltipContent> = {
      experience: {
        title: "🤖 AI Experience Tips",
        suggestions: contextAnalysis?.suggestions || [
          "Use action verbs (Led, Developed, Implemented, Optimized)",
          "Quantify achievements with numbers and percentages",
          "Focus on results and impact, not just responsibilities",
          "Tailor experience to match target job requirements"
        ],
        examples: [
          "Led a team of 5 developers to deliver project 2 weeks ahead of schedule",
          "Increased sales by 35% through implementation of new CRM system",
          "Reduced processing time by 40% by automating manual workflows"
        ],
        tips: contextAnalysis?.tips || [
          "Start bullet points with strong action verbs",
          "Include specific metrics when possible (%, $, time saved)",
          "Use the STAR method (Situation, Task, Action, Result)",
          "Focus on achievements that match job requirements"
        ]
      },
      education: {
        title: "🎓 AI Education Guide",
        suggestions: [
          "Include relevant coursework for entry-level positions",
          "Mention honors, awards, or high GPA (3.5+)",
          "Add relevant projects or research",
          "Include certifications and professional development"
        ],
        examples: [
          "BSc Computer Science, First Class Honours (GPA: 3.8/4.0)",
          "Relevant coursework: Machine Learning, Data Structures, Software Engineering",
          "Capstone Project: Built e-commerce platform serving 1000+ users"
        ],
        tips: [
          "List most recent education first",
          "Include graduation date if recent (within 5 years)",
          "Mention relevant projects that demonstrate skills",
          "Add online courses from reputable platforms"
        ]
      },
      skills: {
        title: "⚡ AI Skills Optimizer",
        suggestions: [
          "Balance technical and soft skills",
          "Include skills mentioned in target job postings",
          "Group related skills together",
          "Use industry-standard terminology"
        ],
        examples: [
          "Technical: Python, React, AWS, Docker, SQL",
          "Soft Skills: Leadership, Problem-solving, Communication",
          "Tools: Git, Jira, Figma, Google Analytics"
        ],
        tips: [
          "Prioritize skills relevant to target role",
          "Use exact keywords from job descriptions",
          "Include both hard and soft skills",
          "Update skills regularly to stay current"
        ]
      },
      certifications: {
        title: "🏆 AI Certification Guide",
        suggestions: [
          "Include relevant industry certifications",
          "Add completion dates and expiry if applicable",
          "Mention certification authority",
          "Include online course certificates from reputable platforms"
        ],
        examples: [
          "AWS Certified Solutions Architect (Valid until 2026)",
          "Google Analytics Certified (2024)",
          "PMP - Project Management Professional (PMI, 2023)"
        ],
        tips: [
          "List most relevant certifications first",
          "Include certification numbers if required by industry",
          "Mention in-progress certifications",
          "Link to digital badges when possible"
        ]
      },
      languages: {
        title: "🌍 AI Language Tips",
        suggestions: [
          "Use standardized proficiency levels",
          "Include languages relevant to target market",
          "Mention native or business fluency",
          "Add context for language use if relevant"
        ],
        examples: [
          "English (Native), Spanish (Fluent), French (Conversational)",
          "Mandarin (Business Level) - 3 years international experience",
          "German (Intermediate) - Currently studying"
        ],
        tips: [
          "Be honest about proficiency levels",
          "Use standard frameworks (CEFR: A1-C2)",
          "Include languages that add value to target role",
          "Mention any language certifications"
        ]
      },
      summary: {
        title: "📝 AI Summary Assistant",
        suggestions: contextAnalysis?.suggestions || [
          "Start with your professional title and years of experience",
          "Highlight 2-3 key achievements or skills",
          "Mention specific industries or technologies",
          "End with what you're seeking or can offer"
        ],
        examples: [
          "Experienced Software Engineer with 5+ years developing scalable web applications. Led teams of 10+ developers and increased system performance by 40%. Seeking senior role in fintech.",
          "Marketing Manager with proven track record of driving 50%+ growth. Expert in digital marketing, data analytics, and team leadership across B2B and B2C sectors."
        ],
        tips: contextAnalysis?.tips || [
          "Keep it 2-3 sentences and under 100 words",
          "Tailor to specific job you're applying for",
          "Use metrics and specific achievements",
          "Avoid generic phrases and clichés"
        ]
      }
    };

    // Get base content
    let content = baseContent[fieldType];

    // Add context-aware suggestions if we have CV data
    if (cvData && fieldType === 'skills') {
      const experienceKeywords = cvData.experience
        .flatMap(exp => exp.description.split(/\s+/))
        .filter(word => word.length > 3)
        .slice(0, 5);

      if (experienceKeywords.length > 0) {
        content.suggestions.unshift(
          `Consider adding skills from your experience: ${experienceKeywords.join(', ')}`
        );
      }
    }

    return content;
  };

  const handleMouseEnter = async () => {
    if (!isVisible && !tooltipContent) {
      setIsLoading(true);
      setIsVisible(true);
      
      try {
        const content = await generateTooltipContent();
        setTooltipContent(content);
      } catch (error) {
        console.error('Error generating tooltip content:', error);
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
                  {tooltipContent.suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Examples */}
              {tooltipContent.examples.length > 0 && (
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
