/**
 * Content Checker Component - Provides content analysis and suggestions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { CVData } from '../../types';
import { analyzeContent, ContentAnalysis, ContentIssue } from '../../lib/contentChecker';
import { getLLMContentSuggestions } from '../../lib/llmContentChecker';

interface ContentCheckerProps {
  cvData: CVData;
  onSuggestionApply?: (suggestion: string) => void;
}

const ContentChecker: React.FC<ContentCheckerProps> = ({ cvData, onSuggestionApply }) => {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [llmSuggestions, setLlmSuggestions] = useState<string[]>([]);
  const [llmLoading, setLlmLoading] = useState(false);

  // Combine all CV text content for analysis
  const getCombinedContent = (section: string = 'all') => {
    let content = '';
    if (section === 'all' || section === 'summary') {
      content += cvData.personalInfo.summary || '';
    }
    if (section === 'all' || section === 'experience') {
      cvData.experience.forEach(exp => {
        content += ` ${exp.description || ''} ${exp.achievements.join(' ')}`;
      });
    }
    if (section === 'all' || section === 'education') {
      cvData.education.forEach(edu => {
        content += ` ${edu.description || ''}`;
      });
    }
    if (section === 'all' || section === 'certifications') {
      cvData.certifications.forEach(cert => {
        content += ` ${cert.name} ${cert.issuer}`;
      });
    }
    return content.trim();
  };

  // Analyze content when CV data changes
  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      setLlmSuggestions([]);
      setLlmLoading(false);
      const content = getCombinedContent(selectedSection);
      if (content.length > 10) {
        const result = analyzeContent(content);
        setAnalysis(result);
        setLlmLoading(true);
        try {
          const suggestions = await getLLMContentSuggestions(result, content);
          setLlmSuggestions(suggestions);
        } catch {
          setLlmSuggestions(['The AI was unable to generate suggestions at this time.']);
        }
        setLlmLoading(false);
      } else {
        setAnalysis(null);
        setLlmSuggestions([]);
      }
      setIsAnalyzing(false);
    };
    const debounceTimer = setTimeout(performAnalysis, 500);
    return () => clearTimeout(debounceTimer);
  }, [cvData, selectedSection]);

  const getSeverityColor = (severity: ContentIssue['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!analysis && !isAnalyzing) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-500 mb-2">📝</div>
        <p className="text-gray-600">Add content to your CV to get analysis and suggestions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Checker</h3>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Sections</option>
          <option value="summary">Summary</option>
          <option value="experience">Experience</option>
          <option value="education">Education</option>
          <option value="certifications">Certifications</option>
        </select>
      </div>
      {isAnalyzing ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Analyzing content...</p>
        </div>
      ) : analysis ? (
        <>
          {/* Score Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}
                </div>
                <div className="text-sm text-gray-600">Readability</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.professionalismScore)}`}>
                  {analysis.professionalismScore}
                </div>
                <div className="text-sm text-gray-600">Professionalism</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {analysis.wordCount}
                </div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
            </div>
          </div>
          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                Issues Found ({analysis.issues.length})
              </h4>
              <div className="space-y-3">
                {analysis.issues.slice(0, 10).map((issue, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{issue.message}</div>
                        {issue.suggestion && (
                          <div className="text-sm mt-1 opacity-75">
                            💡 {issue.suggestion}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded capitalize">
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                ))}
                {analysis.issues.length > 10 && (
                  <p className="text-sm text-gray-500 text-center">
                    And {analysis.issues.length - 10} more issues...
                  </p>
                )}
              </div>
            </div>
          )}
          {/* LLM Suggestions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">AI Improvement Suggestions</h4>
            {llmLoading ? (
              <div className="text-blue-500">Generating AI suggestions...</div>
            ) : (
              <div className="space-y-3">
                {llmSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="text-blue-600 mt-1">💡</div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-800">{suggestion}</p>
                    </div>
                    {onSuggestionApply && (
                      <button
                        onClick={() => onSuggestionApply(suggestion)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ContentChecker;
