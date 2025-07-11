/**
 * Contextual AI Assistant - Visible AI help integrated into the interface
 * Provides field-specific suggestions based on what the user is currently editing
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { CVData } from '../../types';

interface ContextualAIAssistantProps {
  cvData: CVData;
  activeTab: string;
  activeField?: string;
  fieldValue?: string;
  onApplySuggestion: (field: string, value: string) => void;
}

interface ContextualSuggestion {
  id: string;
  type: 'enhance' | 'complete' | 'improve' | 'rewrite';
  title: string;
  suggestion: string;
  reasoning: string;
  confidence: number;
}

export default function ContextualAIAssistant({ 
  cvData, 
  activeTab, 
  activeField, 
  fieldValue = '', 
  onApplySuggestion 
}: ContextualAIAssistantProps) {
  const [suggestions, setSuggestions] = useState<ContextualSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Track if user has explicitly closed the assistant
  const hasBeenExplicitlyClosed = useRef(false);

  // Generate contextual suggestions based on current field and content
  const generateContextualSuggestions = async (): Promise<ContextualSuggestion[]> => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate AI processing

    const suggestions: ContextualSuggestion[] = [];

    // If no active field but we're in a specific tab, show tab-specific suggestions
    if (!activeField && activeTab !== 'form') {
      switch (activeTab) {
        case 'ats':
          suggestions.push({
            id: 'ats-general',
            type: 'improve',
            title: 'ATS Optimization Overview',
            suggestion: 'Your CV will be analyzed for keyword density, formatting compatibility, and structure. Focus on including industry-specific keywords and measurable achievements.',
            reasoning: 'ATS systems scan for specific keywords and proper formatting to rank candidates',
            confidence: 95
          });
          break;
        case 'content':
          suggestions.push({
            id: 'content-general',
            type: 'improve',
            title: 'Content Quality Overview',
            suggestion: 'AI will check for grammar, clarity, and professional tone. Ensure each section tells a compelling story of your professional journey.',
            reasoning: 'Professional writing and clear communication are essential for making a strong impression',
            confidence: 95
          });
          break;
        case 'preview':
          suggestions.push({
            id: 'preview-general',
            type: 'improve',
            title: 'Visual Impact Overview',
            suggestion: 'Review how your CV looks to employers. Check for consistent formatting, appropriate length, and visual hierarchy.',
            reasoning: 'First impressions matter - employers often spend only 6 seconds scanning a CV initially',
            confidence: 95
          });
          break;
      }
      setIsAnalyzing(false);
      return suggestions;
    }

    if (!activeField || !fieldValue) {
      setIsAnalyzing(false);
      return [];
    }

    switch (activeField) {
      case 'summary':
        if (fieldValue.length < 50) {
          const relevantSkills = cvData.skills.slice(0, 3).join(', ') || 'key technologies';
          const yearsExp = cvData.experience.length > 0 ? cvData.experience.length + '+' : '3+';
          suggestions.push({
            id: 'summary-expand',
            type: 'enhance',
            title: 'Expand with professional details',
            suggestion: `${fieldValue} ${yearsExp} years experienced professional specializing in ${relevantSkills}. Proven track record of delivering high-impact solutions and driving innovation in dynamic environments.`,
            reasoning: 'Professional summaries should be 80-120 words and highlight your expertise with specific skills',
            confidence: 90
          });
        }

        if (fieldValue && !fieldValue.match(/\d+/) && cvData.experience.length > 0) {
          const yearsExp = cvData.experience.length;
          suggestions.push({
            id: 'summary-quantify',
            type: 'improve',
            title: 'Add quantifiable experience',
            suggestion: fieldValue.replace(/experienced|professional/i, `${yearsExp}+ years experienced`),
            reasoning: 'Adding specific years of experience makes your summary more credible',
            confidence: 85
          });
        }

        if (fieldValue && cvData.skills.length > 0) {
          const topSkills = cvData.skills.slice(0, 3);
          const missingSkills = topSkills.filter(skill => !fieldValue.toLowerCase().includes(skill.toLowerCase()));
          if (missingSkills.length > 0) {
            const skillsToAdd = missingSkills.slice(0, 2).join(' and ');
            suggestions.push({
              id: 'summary-skills',
              type: 'enhance',
              title: 'Integrate your key skills naturally',
              suggestion: `${fieldValue.trim()} Specialized in ${skillsToAdd} with expertise in delivering scalable, high-quality solutions that drive business growth.`,
              reasoning: 'Integrating your top skills naturally improves ATS compatibility and readability',
              confidence: 80
            });
          }
        }

        // Suggest powerful action words and industry keywords
        if (fieldValue && fieldValue.length > 20) {
          const powerWords = ['strategic', 'innovative', 'results-driven', 'collaborative', 'analytical'];
          const missingPowerWords = powerWords.filter(word => !fieldValue.toLowerCase().includes(word));
          if (missingPowerWords.length > 0) {
            const wordToAdd = missingPowerWords[0];
            suggestions.push({
              id: 'summary-power-words',
              type: 'improve',
              title: 'Add impact with powerful descriptors',
              suggestion: fieldValue.replace(/professional/i, `${wordToAdd} professional`),
              reasoning: `Adding "${wordToAdd}" makes your summary more compelling and shows leadership qualities`,
              confidence: 75
            });
          }
        }
        break;

      case 'experience-description':
        if (fieldValue && !fieldValue.match(/\d+%|\$\d+|\d+\+|increased|improved|reduced|achieved/i)) {
          // Generate contextual metrics based on the role description
          const metrics = generateRelevantMetrics(fieldValue);
          suggestions.push({
            id: 'exp-quantify',
            type: 'improve',
            title: 'Add measurable impact with specific metrics',
            suggestion: `${fieldValue.trim()} ${metrics}`,
            reasoning: 'Quantified achievements with specific percentages and numbers make your experience more credible and impactful',
            confidence: 95
          });
        }

        if (fieldValue && fieldValue.split(' ').length < 20) {
          const actionWords = ['spearheaded', 'orchestrated', 'implemented', 'optimized', 'collaborated with cross-functional teams to'];
          const randomAction = actionWords[Math.floor(Math.random() * actionWords.length)];
          suggestions.push({
            id: 'exp-expand',
            type: 'enhance',
            title: 'Expand with comprehensive details',
            suggestion: `${fieldValue.trim()} ${randomAction} deliver innovative solutions, mentored junior team members, and consistently exceeded performance targets through strategic planning and execution.`,
            reasoning: 'Detailed descriptions with action verbs showcase your full impact and leadership capabilities',
            confidence: 75
          });
        }

        if (fieldValue && !fieldValue.toLowerCase().match(/led|managed|supervised|coordinated|directed/)) {
          suggestions.push({
            id: 'exp-leadership',
            type: 'improve',
            title: 'Highlight leadership and initiative',
            suggestion: fieldValue.replace(/worked with|handled|responsible for/i, 'Led and coordinated'),
            reasoning: 'Leadership language demonstrates your ability to take initiative and manage responsibilities',
            confidence: 80
          });
        }

        // Add industry-specific keywords intelligently
        if (fieldValue && fieldValue.length > 30) {
          const techKeywords = ['agile', 'stakeholder management', 'process improvement', 'quality assurance'];
          const missingKeywords = techKeywords.filter(keyword => !fieldValue.toLowerCase().includes(keyword.toLowerCase()));
          if (missingKeywords.length > 0) {
            const keywordToAdd = missingKeywords[0];
            suggestions.push({
              id: 'exp-keywords',
              type: 'enhance',
              title: 'Integrate relevant industry keywords',
              suggestion: `${fieldValue.trim()} Utilized ${keywordToAdd} methodologies to ensure optimal outcomes and maintain high standards.`,
              reasoning: `Adding "${keywordToAdd}" improves ATS compatibility and shows familiarity with industry practices`,
              confidence: 70
            });
          }
        }
        break;

      case 'skills':
        const suggestedSkills = generateSkillSuggestions(cvData);
        if (suggestedSkills.length > 0) {
          suggestions.push({
            id: 'skills-suggest',
            type: 'enhance',
            title: 'Add relevant skills',
            suggestion: suggestedSkills.slice(0, 3).join(', '),
            reasoning: 'These skills are commonly required in your field',
            confidence: 85
          });
        }
        break;

      case 'education-description':
        if (fieldValue && fieldValue.length < 30) {
          suggestions.push({
            id: 'edu-expand',
            type: 'enhance',
            title: 'Add relevant coursework and achievements',
            suggestion: `${fieldValue.trim()} Relevant coursework: ${getRelevantCoursework(cvData.skills, fieldValue)} | GPA: 3.7/4.0 | Honors: Dean's List, Academic Excellence Award`,
            reasoning: 'Relevant coursework and academic achievements strengthen your education section and show specialized knowledge',
            confidence: 80
          });
        }

        if (fieldValue && !fieldValue.toLowerCase().match(/coursework|gpa|honors|thesis|project/)) {
          suggestions.push({
            id: 'edu-keywords',
            type: 'enhance',
            title: 'Highlight academic achievements',
            suggestion: `${fieldValue.trim()} Completed honors thesis on industry applications, graduated with distinction, and participated in research projects.`,
            reasoning: 'Academic achievements and research experience demonstrate dedication and advanced knowledge',
            confidence: 75
          });
        }
        break;

      case 'certifications':
        const suggestedCerts = generateCertificationSuggestions(cvData);
        if (suggestedCerts.length > 0) {
          suggestions.push({
            id: 'certs-suggest',
            type: 'enhance',
            title: 'Consider these industry certifications',
            suggestion: `Based on your skills, consider: ${suggestedCerts.slice(0, 3).join(', ')}`,
            reasoning: 'These certifications are highly valued in your field and can significantly boost your credentials',
            confidence: 85
          });
        }
        break;

      case 'languages':
        const commonLanguages = ['Spanish', 'French', 'German', 'Mandarin', 'Portuguese', 'Arabic'];
        const missingLanguages = commonLanguages.filter(lang => 
          !cvData.languages.some(cvLang => cvLang.name.toLowerCase().includes(lang.toLowerCase()))
        );
        if (missingLanguages.length > 0) {
          suggestions.push({
            id: 'languages-suggest',
            type: 'enhance',
            title: 'Consider adding valuable languages',
            suggestion: `Consider adding: ${missingLanguages.slice(0, 2).join(', ')} - even basic proficiency can be valuable in global markets`,
            reasoning: 'Multilingual abilities are increasingly valuable in the global job market',
            confidence: 70
          });
        }
        break;
    }

    setIsAnalyzing(false);
    return suggestions;
  };

  // Helper functions
  const generateSkillSuggestions = (cvData: CVData): string[] => {
    const existingSkills = cvData.skills.map(s => s.toLowerCase());
    const experienceText = cvData.experience.map(e => e.description).join(' ').toLowerCase();
    
    const skillSuggestions = [
      'Leadership', 'Project Management', 'Problem Solving', 'Communication',
      'Teamwork', 'Analytical Thinking', 'Time Management', 'Adaptability'
    ];

    return skillSuggestions.filter(skill => 
      !existingSkills.includes(skill.toLowerCase()) &&
      (experienceText.includes(skill.toLowerCase()) || Math.random() > 0.6)
    );
  };

  const getRelevantCoursework = (skills: string[], educationText: string = ''): string => {
    const lowerEducation = educationText.toLowerCase();
    
    // Business/Management/Economics
    if (lowerEducation.includes('business') || lowerEducation.includes('management') || 
        lowerEducation.includes('economics') || lowerEducation.includes('finance') ||
        lowerEducation.includes('accounting') || lowerEducation.includes('marketing')) {
      const coursework = ['Strategic Management', 'Financial Analysis', 'Marketing Research', 'Operations Management', 'Business Ethics'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Psychology/Social Sciences
    if (lowerEducation.includes('psychology') || lowerEducation.includes('social') ||
        lowerEducation.includes('sociology') || lowerEducation.includes('anthropology')) {
      const coursework = ['Research Methods', 'Statistical Analysis', 'Cognitive Psychology', 'Social Theory', 'Behavioral Studies'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Engineering (non-software)
    if (lowerEducation.includes('engineering') && !lowerEducation.includes('software') && !lowerEducation.includes('computer')) {
      const coursework = ['Engineering Mathematics', 'Thermodynamics', 'Materials Science', 'Systems Design', 'Project Management'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Medicine/Health Sciences
    if (lowerEducation.includes('medicine') || lowerEducation.includes('health') ||
        lowerEducation.includes('nursing') || lowerEducation.includes('biology') ||
        lowerEducation.includes('biomedical')) {
      const coursework = ['Anatomy & Physiology', 'Pharmacology', 'Medical Ethics', 'Research Methods', 'Clinical Practice'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Education/Teaching
    if (lowerEducation.includes('education') || lowerEducation.includes('teaching') ||
        lowerEducation.includes('pedagogy')) {
      const coursework = ['Educational Psychology', 'Curriculum Development', 'Assessment Methods', 'Classroom Management', 'Learning Theory'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Arts/Design/Creative
    if (lowerEducation.includes('art') || lowerEducation.includes('design') ||
        lowerEducation.includes('creative') || lowerEducation.includes('media') ||
        lowerEducation.includes('graphic')) {
      const coursework = ['Design Theory', 'Visual Communication', 'Art History', 'Digital Media', 'Creative Process'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Law/Legal Studies
    if (lowerEducation.includes('law') || lowerEducation.includes('legal') ||
        lowerEducation.includes('jurisprudence')) {
      const coursework = ['Constitutional Law', 'Contract Law', 'Legal Research', 'Ethics in Law', 'Civil Procedure'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Communications/Journalism/English
    if (lowerEducation.includes('communication') || lowerEducation.includes('journalism') ||
        lowerEducation.includes('english') || lowerEducation.includes('literature') ||
        lowerEducation.includes('writing')) {
      const coursework = ['Media Ethics', 'Research Methods', 'Writing & Composition', 'Digital Communication', 'Public Relations'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Computer Science/Software Engineering (only if specifically mentioned)
    if (lowerEducation.includes('computer') || lowerEducation.includes('software') ||
        lowerEducation.includes('information technology') || lowerEducation.includes('programming')) {
      const coursework = ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems', 'Machine Learning'];
      return coursework.slice(0, 3).join(', ');
    }
    
    // Default - General academic coursework if no specific field detected
    const generalCoursework = ['Research Methods', 'Critical Thinking', 'Written Communication', 'Project Management', 'Analytical Methods'];
    return generalCoursework.slice(0, 3).join(', ');
  };

  const generateCertificationSuggestions = (cvData: CVData): string[] => {
    const skills = cvData.skills.map(s => s.toLowerCase());
    const certSuggestions: string[] = [];

    if (skills.some(skill => skill.includes('aws') || skill.includes('cloud'))) {
      certSuggestions.push('AWS Certified Solutions Architect');
    }
    if (skills.some(skill => skill.includes('project') || skill.includes('management'))) {
      certSuggestions.push('PMP Certification');
    }
    if (skills.some(skill => skill.includes('security') || skill.includes('cyber'))) {
      certSuggestions.push('CISSP Certification');
    }
    if (skills.some(skill => skill.includes('data') || skill.includes('analytics'))) {
      certSuggestions.push('Google Data Analytics Certificate');
    }
    if (skills.some(skill => skill.includes('microsoft') || skill.includes('azure'))) {
      certSuggestions.push('Microsoft Azure Fundamentals');
    }

    return certSuggestions;
  };

  const generateRelevantMetrics = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    const metrics: string[] = [];

    // Sales/Revenue related
    if (lowerDesc.includes('sales') || lowerDesc.includes('revenue') || lowerDesc.includes('business')) {
      metrics.push('increased revenue by 25%', 'exceeded quarterly targets by $50K', 'improved conversion rates by 30%');
    }
    // Development/Technical
    else if (lowerDesc.includes('develop') || lowerDesc.includes('code') || lowerDesc.includes('software') || lowerDesc.includes('system')) {
      metrics.push('reduced loading time by 40%', 'improved system performance by 60%', 'decreased bug reports by 45%');
    }
    // Management/Leadership
    else if (lowerDesc.includes('manage') || lowerDesc.includes('lead') || lowerDesc.includes('team') || lowerDesc.includes('supervise')) {
      metrics.push('managed team of 8+ members', 'improved team productivity by 35%', 'reduced project delivery time by 25%');
    }
    // Customer Service
    else if (lowerDesc.includes('customer') || lowerDesc.includes('support') || lowerDesc.includes('service')) {
      metrics.push('achieved 95% customer satisfaction rate', 'reduced response time by 50%', 'handled 200+ inquiries weekly');
    }
    // Marketing/Growth
    else if (lowerDesc.includes('marketing') || lowerDesc.includes('growth') || lowerDesc.includes('campaign')) {
      metrics.push('increased engagement by 65%', 'grew audience by 2,500+ followers', 'improved CTR by 40%');
    }
    // Operations/Process
    else if (lowerDesc.includes('process') || lowerDesc.includes('operation') || lowerDesc.includes('efficiency')) {
      metrics.push('streamlined processes, saving 15 hours weekly', 'reduced operational costs by 20%', 'improved efficiency by 45%');
    }
    // Generic achievements
    else {
      metrics.push('achieved 90% success rate', 'completed projects 20% ahead of schedule', 'improved overall performance by 30%');
    }

    // Return 2-3 relevant metrics
    return metrics.slice(0, 2).join(' and ') + '.';
  };

  // Update suggestions when field or content changes
  useEffect(() => {
    const updateSuggestions = async () => {
      if (activeField && fieldValue !== undefined) {
        const newSuggestions = await generateContextualSuggestions();
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    updateSuggestions();
  }, [activeField, fieldValue, cvData]);

  const handleApplySuggestion = (suggestion: ContextualSuggestion) => {
    if (activeField) {
      onApplySuggestion(activeField, suggestion.suggestion);
      // Remove applied suggestion
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    }
  };

  const handleCloseAssistant = () => {
    setIsVisible(false);
    hasBeenExplicitlyClosed.current = true;
    
    // Reset the flag after some time to allow showing again for new content
    setTimeout(() => {
      hasBeenExplicitlyClosed.current = false;
    }, 30000); // 30 seconds
  };

  if (!isVisible || (!activeField && suggestions.length === 0 && activeTab === 'form')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🤖</span>
          </div>
          <h3 className="font-semibold text-gray-900">AI Writing Assistant</h3>
          {isAnalyzing && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600">Analyzing...</span>
            </div>
          )}
        </div>
        <button
          onClick={handleCloseAssistant}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {activeField && (
        <div className="mb-3">
          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block">
            Currently editing: {activeField.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
      )}

      {isAnalyzing ? (
        <div className="flex items-center gap-2 text-blue-600">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">AI is crafting personalized suggestions...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        suggestion.confidence >= 90 ? 'bg-green-500' :
                        suggestion.confidence >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-xs text-gray-500">{suggestion.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{suggestion.reasoning}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-2 mb-2">
                    <p className="text-sm text-gray-800 italic">"{suggestion.suggestion}"</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="flex-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  ✨ Apply Suggestion
                </button>
                <button
                  onClick={() => setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : activeField || activeTab !== 'form' ? (
        <div className="text-center py-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            {activeField ? 'Start typing to get AI-powered suggestions!' : 'AI is ready to help with this section!'}
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Click on any field to get contextual AI assistance</p>
        </div>
      )}
    </div>
  );
}
