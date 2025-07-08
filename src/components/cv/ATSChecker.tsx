'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CVData, ATSAnalysis, ATSSuggestion } from '../../types';
import { analyzeATS } from '../../lib/atsAnalyzer';
import { cvStorage } from '../../lib/storage';
import SuggestionTooltip from '../ui/SuggestionTooltip';

interface ATSCheckerProps {
  cvData: CVData;
  onChange: (data: Partial<CVData>) => void;
  onSwitchToForm?: () => void; // Add callback to switch to form tab
}

export default function ATSChecker({ cvData, onChange, onSwitchToForm }: ATSCheckerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'jobdesc' | 'analysis' | 'suggestions'>('jobdesc');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set()); // Start empty to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true);
    // Set initial expanded sections after hydration
    setExpandedSections(new Set(['high'])); // High priority expanded by default
  }, []);

  // Load job description from storage on mount
  useEffect(() => {
    const savedJobDescription = cvStorage.getJobDescription();
    if (savedJobDescription) {
      setJobDescription(savedJobDescription);
    }
  }, []);

  // Save job description to storage when it changes
  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    cvStorage.saveJobDescription(value);
  };

  // ATS analysis function
  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeATS(cvData, jobDescription);
      setAnalysis(result);
      if (result.score > 0) {
        setActiveTab('analysis');
      }
    } catch (error) {
      console.error('Error analysing CV:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [cvData, jobDescription]);

  useEffect(() => {
    if (cvData.personalInfo.name || cvData.experience.length > 0) {
      // Debounce the analysis to avoid excessive re-computation
      const analysisTimer = setTimeout(() => {
        handleAnalyze();
      }, 1000); // 1 second delay to allow for rapid changes

      return () => clearTimeout(analysisTimer);
    }
  }, [cvData, handleAnalyze]);

  // Re-analyze when job description changes
  useEffect(() => {
    if ((cvData.personalInfo.name || cvData.experience.length > 0) && jobDescription.trim()) {
      const analysisTimer = setTimeout(() => {
        handleAnalyze();
      }, 1500); // Longer delay for job description changes

      return () => clearTimeout(analysisTimer);
    }
  }, [jobDescription, cvData.personalInfo.name, cvData.experience.length, handleAnalyze]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreColorRing = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };
  const applySuggestion = (suggestion: ATSSuggestion) => {
    console.log('Applying suggestion:', suggestion);
    
    // Function to trigger re-analysis after applying a fix
    const triggerReAnalysis = () => {
      setTimeout(() => {
        handleAnalyze();
        toast.success('Analysis updated to reflect your changes!', {
          duration: 2000,
          icon: '🔄',
        });
      }, 500); // Short delay to allow state updates
    };
    
    // Auto-apply certain suggestions
    switch (suggestion.type) {
      case 'keyword':
        // Add missing keywords to skills if they're skill-related
        if (suggestion.title.includes('Add skill') || suggestion.title.includes('keyword')) {
          const keywordMatch = suggestion.description.match(/"([^"]+)"/);
          const keyword = keywordMatch?.[1];
          
          if (keyword && !cvData.skills.includes(keyword)) {
            onChange({ skills: [...cvData.skills, keyword] });
            toast.success(`Added "${keyword}" to your skills!`);
            triggerReAnalysis();
            return;
          }
        }
        
        // Handle missing keywords by adding them to skills
        if (suggestion.title.includes('Missing') || suggestion.title.includes('Critical')) {
          const keywordMatches = suggestion.description.match(/these.*keywords.*:\s*([^.]+)/i);
          if (keywordMatches) {
            const keywords = keywordMatches[1].split(/[,\s]+/)
              .map(k => k.trim().replace(/['"]/g, ''))
              .filter(k => k.length > 1 && !cvData.skills.includes(k));
            
            if (keywords.length > 0) {
              onChange({ skills: [...cvData.skills, ...keywords.slice(0, 3)] }); // Add up to 3 keywords
              toast.success(`Added ${keywords.slice(0, 3).join(', ')} to your skills!`);
              triggerReAnalysis();
              return;
            }
          }
        }
        
        // Handle keyword density improvements
        if (suggestion.title.includes('Keyword Density')) {
          toast('To improve keyword density, review the job description and naturally incorporate relevant keywords throughout your CV. This requires manual editing for best results.', {
            duration: 5000,
            icon: '💡',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        break;
        
      case 'format':
        // Apply formatting improvements
        if (suggestion.title.includes('Phone format') || suggestion.title.includes('phone number')) {
          const phone = cvData.personalInfo.phone.replace(/\D/g, '');
          if (phone.length === 10) {
            const formatted = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
            onChange({
              personalInfo: {
                ...cvData.personalInfo,
                phone: formatted,
              },
            });
            toast.success('Phone number formatted successfully!');
            triggerReAnalysis();
            return;
          } else if (phone.length === 11 && phone.startsWith('1')) {
            const formatted = `+1 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
            onChange({
              personalInfo: {
                ...cvData.personalInfo,
                phone: formatted,
              },
            });
            toast.success('Phone number formatted successfully!');
            triggerReAnalysis();
            return;
          }
        }
        
        // Fix email format
        if (suggestion.title.includes('Email format') && cvData.personalInfo.email) {
          const email = cvData.personalInfo.email.toLowerCase().trim();
          onChange({
            personalInfo: {
              ...cvData.personalInfo,
              email: email,
            },
          });
          toast.success('Email format improved!');
          triggerReAnalysis();
          return;
        }
        
        // Handle missing contact information
        if (suggestion.description.includes('contact information')) {
          toast('Please add complete contact information in the Personal Information section of the form.', {
            duration: 4000,
            icon: '📝',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        break;
        
      case 'content':
        // Handle content suggestions
        if (suggestion.title.includes('Professional summary') || suggestion.title.includes('Enhance Professional Summary')) {
          if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 50) {
            const skills = cvData.skills.slice(0, 3).join(', ');
            const experience = cvData.experience[0]?.position || 'professional';
            const defaultSummary = skills 
              ? `Experienced ${experience} with expertise in ${skills}. Proven track record of delivering results and contributing to team success. Seeking opportunities to leverage skills and drive organisational growth.`
              : `Dedicated ${experience} with strong problem-solving abilities and excellent communication skills. Committed to delivering high-quality results and contributing to team success.`;
            
            onChange({
              personalInfo: {
                ...cvData.personalInfo,
                summary: defaultSummary,
              },
            });
            toast.success('Added a professional summary! You can edit it in the Personal Information section.');
            triggerReAnalysis();
            return;
          }
        }
        
        // Handle skills expansion
        if (suggestion.title.includes('Expand Skills') || suggestion.title.includes('Skills Section')) {
          const commonSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Attention to Detail'];
          const missingSkills = commonSkills.filter(skill => !cvData.skills.includes(skill));
          
          if (missingSkills.length > 0) {
            onChange({ skills: [...cvData.skills, ...missingSkills.slice(0, 3)] });
            toast.success(`Added ${missingSkills.slice(0, 3).join(', ')} to your skills! You can edit these in the Skills section.`);
            triggerReAnalysis();
            return;
          }
        }
        
        // Handle action verbs enhancement
        if (suggestion.title.includes('Action Verbs')) {
          toast('To use stronger action verbs, edit your experience descriptions and replace weak phrases like "responsible for" with strong action words like "managed", "developed", "implemented", or "achieved".', {
            duration: 6000,
            icon: '💪',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        
        // Handle quantifiable achievements
        if (suggestion.title.includes('Quantifiable') || suggestion.title.includes('measurable')) {
          toast('Add specific numbers, percentages, or metrics to your achievements. For example: "Increased sales by 25%" or "Managed team of 10". This requires manual editing in the Experience section.', {
            duration: 6000,
            icon: '📊',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        
        // Handle content expansion
        if (suggestion.title.includes('Expand Content')) {
          toast('Your CV needs more detailed content. Please add more information about your experience, achievements, and responsibilities in the form sections.', {
            duration: 5000,
            icon: '📝',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        break;
        
      case 'structure':
        // Handle structural improvements
        if (suggestion.title.includes('Work Experience') && cvData.experience.length === 0) {
          toast('Please add your work experience in the Experience section of the form.', {
            duration: 4000,
            icon: '💼',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        
        // Handle education section
        if (suggestion.title.includes('Education')) {
          toast('Please add your educational background in the Education section of the form.', {
            duration: 4000,
            icon: '🎓',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        
        // Handle job descriptions expansion
        if (suggestion.title.includes('Job Descriptions') || suggestion.title.includes('Expand Job')) {
          toast('Please expand your job descriptions with more detailed achievements and responsibilities in the Experience section.', {
            duration: 5000,
            icon: '📋',
          });
          if (onSwitchToForm) {
            onSwitchToForm();
          }
          return;
        }
        break;
    }
    
    // Fallback for unhandled suggestions
    toast(`This suggestion requires manual action: ${suggestion.description}. Please make these changes in the form sections.`, {
      duration: 5000,
      icon: '⚠️',
    });
    if (onSwitchToForm) {
      onSwitchToForm();
    }
  };

  const renderJobDescriptionTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Job Description Analysis
        </h2>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
          Paste a job description to get targeted ATS optimisation recommendations.
        </p>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
          Job Description
        </label>        
        <textarea
          value={jobDescription}
          onChange={(e) => handleJobDescriptionChange(e.target.value)}
          rows={10}
          className="w-full px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base leading-relaxed min-h-[200px] sm:min-h-[240px]"
          placeholder="Paste the full job description here. Include requirements, qualifications, responsibilities, and preferred skills for the most accurate analysis..."
        />
        <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
          The more detailed the job description, the better the ATS analysis will be.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
              Analysing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Analyse CV
            </>
          )}
        </button>
        
        {jobDescription && (
          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left px-3 py-2 bg-gray-50 rounded-lg">
            {jobDescription.split(' ').length} words • {jobDescription.length} characters
          </div>
        )}
      </div>

      {!jobDescription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-medium text-blue-900 mb-3">💡 Pro Tips</h3>
          <ul className="text-sm sm:text-base text-blue-700 space-y-2">
            <li>• Copy the entire job posting, not just the title</li>
            <li>• Include required and preferred qualifications</li>
            <li>• Don&apos;t edit or summarise - paste the full text</li>
            <li>• The analysis works even without a job description</li>
          </ul>
        </div>
      )}
    </div>
  );

  const renderAnalysisTab = () => {
    if (!analysis) {
      return (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
          </svg>
          <p className="text-lg text-gray-600 mb-2">No Analysis Yet</p>
          <p className="text-sm text-gray-500">
            Click "Analyse CV" to see your ATS compatibility score
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Overall Score - Improved mobile layout */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 text-center sm:text-left">
              ATS Compatibility Score
            </h2>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
              <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2.51 * analysis.score} 251.2`}
                  className={getScoreColorRing(analysis.score)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getScoreColor(analysis.score).split(' ')[0]}`}>
                  {analysis.score}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <div className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium mb-3 sm:mb-4 ${getScoreColor(analysis.score)}`}>
              {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : 'Needs Improvement'}
            </div>
            
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              {analysis.overallFeedback}
            </p>
          </div>
        </div>

        {/* Detailed Analysis - Enhanced responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Keyword Analysis */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Keywords</h3>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{analysis.keywordMatch.score}/100</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Matched Keywords
                </div>
                <div className="text-lg font-semibold text-green-600">
                  {jobDescription.trim() ? analysis.keywordMatch.matchedKeywords.length : '-'}
                </div>
                {!jobDescription.trim() && (
                  <div className="text-xs text-gray-500">Add job description first</div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Missing Keywords
                </div>
                <div className="text-lg font-semibold text-red-600">
                  {jobDescription.trim() ? analysis.keywordMatch.missingKeywords.length : '-'}
                </div>
                {!jobDescription.trim() && (
                  <div className="text-xs text-gray-500">Add job description first</div>
                )}
              </div>
            </div>
          </div>

          {/* Format Analysis */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Format</h3>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{analysis.formatAnalysis.score}/100</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {analysis.formatAnalysis.hasGoodStructure ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm text-gray-600">
                  {analysis.formatAnalysis.hasGoodStructure ? 'Good Structure' : 'Structure Issues'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {!analysis.formatAnalysis.hasProblematicElements ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm text-gray-600">
                  {!analysis.formatAnalysis.hasProblematicElements ? 'ATS-Friendly' : 'Format Issues'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Analysis */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Content</h3>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{analysis.contentAnalysis.score}/100</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {analysis.contentAnalysis.hasMeasurableResults ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm text-gray-600">
                  {analysis.contentAnalysis.hasMeasurableResults ? 'Has Metrics' : 'Add Numbers'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {analysis.contentAnalysis.hasActionVerbs ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm text-gray-600">
                  {analysis.contentAnalysis.hasActionVerbs ? 'Strong Verbs' : 'Weak Language'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Details */}
        {jobDescription.trim() ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Matched Keywords */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base">Matched Keywords ({analysis.keywordMatch.matchedKeywords.length})</span>
              </h3>
              
              {analysis.keywordMatch.matchedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatch.matchedKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs sm:text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No keywords found matching the job description
                </p>
              )}
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base">Missing Keywords ({analysis.keywordMatch.missingKeywords.length})</span>
              </h3>
              
              {analysis.keywordMatch.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatch.missingKeywords.slice(0, 10).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs sm:text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                  {analysis.keywordMatch.missingKeywords.length > 10 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs sm:text-sm">
                      +{analysis.keywordMatch.missingKeywords.length - 10} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Great! Your CV includes the key keywords from the job description
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-amber-800 mb-2">Add Job Description for Keyword Analysis</h3>
                <p className="text-amber-700 text-sm leading-relaxed mb-4">
                  To get accurate keyword matching and see which specific terms from the job posting appear in your CV, 
                  please add the job description in the &quot;Job Description&quot; tab above.
                </p>
                <button
                  onClick={() => setActiveTab('jobdesc')}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Add Job Description
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderSuggestionsTab = () => {
    // Prevent hydration errors by only rendering on client
    if (!isClient) {
      return <div className="animate-pulse bg-gray-200 h-64 rounded"></div>;
    }

    if (!analysis || analysis.suggestions.length === 0) {
      return (
        <div className="text-center py-8 sm:py-12">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-lg text-gray-600 mb-2">No Suggestions Available</p>
          <p className="text-sm text-gray-500 px-4">
            Run an analysis first to get personalised recommendations
          </p>
        </div>
      );
    }

    const toggleSection = (priority: string) => {
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(priority)) {
        newExpanded.delete(priority);
      } else {
        newExpanded.add(priority);
      }
      setExpandedSections(newExpanded);
    };

    const groupedSuggestions = analysis.suggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.priority]) {
        acc[suggestion.priority] = [];
      }
      acc[suggestion.priority].push(suggestion);
      return acc;
    }, {} as Record<string, ATSSuggestion[]>);

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Optimisation Suggestions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-2 sm:px-0">
            Actionable recommendations to improve your ATS compatibility score
          </p>
        </div>

        {(['high', 'medium', 'low'] as const).map((priority) => {
          const suggestions = groupedSuggestions[priority] || [];
          if (suggestions.length === 0) return null;

          const priorityConfig = {
            high: { 
              color: 'red', 
              label: 'High Priority', 
              icon: '🔥',
              bgColor: 'bg-red-50',
              borderColor: 'border-red-200',
              textColor: 'text-red-700',
              badgeColor: 'bg-red-100 text-red-800'
            },
            medium: { 
              color: 'yellow', 
              label: 'Medium Priority', 
              icon: '⚡',
              bgColor: 'bg-yellow-50',
              borderColor: 'border-yellow-200',
              textColor: 'text-yellow-700',
              badgeColor: 'bg-yellow-100 text-yellow-800'
            },
            low: { 
              color: 'green', 
              label: 'Low Priority', 
              icon: '💡',
              bgColor: 'bg-green-50',
              borderColor: 'border-green-200',
              textColor: 'text-green-700',
              badgeColor: 'bg-green-100 text-green-800'
            }
          };

          const config = priorityConfig[priority];
          const isExpanded = expandedSections.has(priority);

          return (
            <div
              key={priority}
              className={`rounded-lg sm:rounded-xl border-2 ${config.borderColor} ${config.bgColor} overflow-hidden`}
            >
              <button
                onClick={() => toggleSection(priority)}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">{config.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                      {config.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
                    {suggestions.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4 bg-white/30">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <h4 className="font-medium text-sm sm:text-base text-gray-900 leading-tight">
                                {suggestion.title}
                              </h4>
                              {(suggestion.whyImportant || suggestion.howToImplement) && (
                                <SuggestionTooltip 
                                  whyImportant={suggestion.whyImportant}
                                  howToImplement={suggestion.howToImplement}
                                  id={`suggestion-${priority}-${index}`}
                                >
                                  <button className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </SuggestionTooltip>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                              {suggestion.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                suggestion.type === 'keyword' ? 'bg-blue-100 text-blue-800' :
                                suggestion.type === 'format' ? 'bg-green-100 text-green-800' :
                                suggestion.type === 'content' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {suggestion.type}
                              </span>
                              {suggestion.actionable && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-medium">
                                  Actionable
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {suggestion.autoFixAvailable && (
                            <div className="flex-shrink-0 w-full sm:w-auto">
                              <button
                                onClick={() => applySuggestion(suggestion)}
                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Apply Fix
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Summary Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 text-center sm:text-left">
            Quick Actions
          </h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setExpandedSections(new Set(['high', 'medium', 'low']))}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedSections(new Set())}
              className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Collapse All
            </button>
            <button
              onClick={() => setExpandedSections(new Set(['high']))}
              className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              High Priority Only
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first responsive container with improved spacing */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">

        {/* Main Content Card with better mobile layout */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Tab Navigation - Enhanced mobile responsiveness */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="overflow-x-auto scrollbar-hide">
              <nav className="flex min-w-max sm:min-w-0 px-3 sm:px-4 md:px-6">
                {[
                  { id: 'jobdesc', name: 'Job Description', icon: '📋' },
                  { id: 'analysis', name: 'ATS Analysis', icon: '📊' },
                  { id: 'suggestions', name: 'Suggestions', icon: '💡' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'jobdesc' | 'analysis' | 'suggestions')}
                    className={`flex-shrink-0 py-3 sm:py-4 px-3 sm:px-4 md:px-6 border-b-2 font-medium text-xs sm:text-sm md:text-base flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-base sm:text-lg md:text-xl">{tab.icon}</span>
                    <span className="hidden xs:inline sm:inline">{tab.name}</span>
                    {tab.id === 'suggestions' && analysis && analysis.suggestions.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                        {analysis.suggestions.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content - Improved mobile padding */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {activeTab === 'jobdesc' && renderJobDescriptionTab()}
            {activeTab === 'analysis' && renderAnalysisTab()}
            {activeTab === 'suggestions' && renderSuggestionsTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
