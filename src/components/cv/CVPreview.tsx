/**
 * CV Preview Component - Live preview of CV with template selection
 */
'use client';

import { useState } from 'react';
import { CVData, CVTemplate } from '../../types';
import { exportToPDF, exportToDOCX } from '../../lib/exportUtils';

interface CVPreviewProps {
  cvData: CVData;
  onTemplateChange: (template: CVTemplate) => void;
}

const templates: CVTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design focusing on content',
    category: 'minimal',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    category: 'classic',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with subtle colors',
    category: 'modern',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative professionals',
    category: 'creative',
  },
];

export default function CVPreview({ cvData, onTemplateChange }: CVPreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(cvData.template.id);

  const handleTemplateChange = (template: CVTemplate) => {
    setSelectedTemplate(template.id);
    onTemplateChange(template);
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(cvData, 'cv-preview');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportDOCX = async () => {
    try {
      await exportToDOCX(cvData);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
    }
  };

  const getTemplateStyles = (templateId: string) => {
    switch (templateId) {
      case 'minimal':
        return {
          container: 'bg-white text-gray-900 font-sans',
          header: 'border-b-2 border-gray-200 pb-6 mb-6',
          name: 'text-2xl font-bold mb-2',
          contact: 'text-sm text-gray-600 space-y-1',
          section: 'mb-6',
          sectionTitle: 'text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1',
          experience: 'mb-4 last:mb-0',
          experienceHeader: 'flex justify-between items-start mb-2',
          position: 'font-semibold text-gray-900',
          company: 'text-gray-700',
          dates: 'text-sm text-gray-500',
          description: 'text-sm text-gray-600 mt-2',
          achievements: 'text-sm text-gray-600 mt-2 space-y-1',
          skills: 'flex flex-wrap gap-2',
          skill: 'px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm',
        };
      case 'classic':
        return {
          container: 'bg-white text-gray-900 font-serif',
          header: 'text-center border-b border-gray-300 pb-6 mb-6',
          name: 'text-3xl font-bold mb-2',
          contact: 'text-sm text-gray-600 space-y-1',
          section: 'mb-6',
          sectionTitle: 'text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide',
          experience: 'mb-5 last:mb-0',
          experienceHeader: 'mb-2',
          position: 'font-bold text-gray-900 text-lg',
          company: 'text-gray-700 italic',
          dates: 'text-sm text-gray-500 font-normal',
          description: 'text-gray-600 mt-2 leading-relaxed',
          achievements: 'text-gray-600 mt-2 space-y-1',
          skills: 'grid grid-cols-3 gap-2',
          skill: 'text-center py-2 border border-gray-300 text-gray-700',
        };
      case 'modern':
        return {
          container: 'bg-white text-gray-900 font-sans',
          header: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-6 rounded-t-lg',
          name: 'text-3xl font-light mb-2',
          contact: 'text-blue-100 space-y-1 text-sm',
          section: 'mb-6 px-6',
          sectionTitle: 'text-lg font-semibold mb-3 text-blue-600 border-l-4 border-blue-600 pl-3',
          experience: 'mb-4 last:mb-0',
          experienceHeader: 'flex justify-between items-start mb-2',
          position: 'font-semibold text-gray-900',
          company: 'text-blue-600',
          dates: 'text-sm text-gray-500',
          description: 'text-sm text-gray-600 mt-2',
          achievements: 'text-sm text-gray-600 mt-2 space-y-1',
          skills: 'flex flex-wrap gap-2',
          skill: 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm',
        };
      case 'creative':
        return {
          container: 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 font-sans',
          header: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 mb-6 rounded-lg',
          name: 'text-3xl font-bold mb-2',
          contact: 'text-purple-100 space-y-1 text-sm',
          section: 'mb-6 px-6',
          sectionTitle: 'text-lg font-bold mb-3 text-purple-600 bg-white rounded-lg px-3 py-2 shadow-sm',
          experience: 'mb-4 last:mb-0 bg-white rounded-lg p-4 shadow-sm',
          experienceHeader: 'flex justify-between items-start mb-2',
          position: 'font-bold text-gray-900',
          company: 'text-purple-600',
          dates: 'text-sm text-gray-500',
          description: 'text-sm text-gray-600 mt-2',
          achievements: 'text-sm text-gray-600 mt-2 space-y-1',
          skills: 'flex flex-wrap gap-2',
          skill: 'px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm shadow-sm',
        };
      default:
        return {
          container: 'bg-white text-gray-900 font-sans',
          header: 'border-b-2 border-gray-200 pb-6 mb-6',
          name: 'text-2xl font-bold mb-2',
          contact: 'text-sm text-gray-600 space-y-1',
          section: 'mb-6',
          sectionTitle: 'text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1',
          experience: 'mb-4 last:mb-0',
          experienceHeader: 'flex justify-between items-start mb-2',
          position: 'font-semibold text-gray-900',
          company: 'text-gray-700',
          dates: 'text-sm text-gray-500',
          description: 'text-sm text-gray-600 mt-2',
          achievements: 'text-sm text-gray-600 mt-2 space-y-1',
          skills: 'flex flex-wrap gap-2',
          skill: 'px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm',
        };
    }
  };

  const styles = getTemplateStyles(selectedTemplate);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderCV = () => {
    const { personalInfo, experience, skills } = cvData;

    return (
      <div id="cv-preview" className={`${styles.container} p-8 max-w-4xl mx-auto shadow-lg min-h-[297mm]`}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.name}>{personalInfo.name || 'Your Name'}</h1>
          <div className={styles.contact}>
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            <div className="flex flex-wrap gap-4">
              {personalInfo.website && (
                <div>🌐 {personalInfo.website.replace(/^https?:\/\//, '')}</div>
              )}
              {personalInfo.linkedin && (
                <div>💼 {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</div>
              )}
              {personalInfo.github && (
                <div>⚡ {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</div>
              )}
              {personalInfo.portfolio && (
                <div>🎨 {personalInfo.portfolio.replace(/^https?:\/\//, '')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className={styles.experience}>
                <div className={styles.experienceHeader}>
                  <div>
                    <div className={styles.position}>{exp.position}</div>
                    <div className={styles.company}>
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </div>
                  </div>
                  <div className={styles.dates}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <div className={styles.description}>{exp.description}</div>
                )}
                {exp.achievements.length > 0 && (
                  <ul className={styles.achievements}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skills}>
              {skills.map((skill, index) => (
                <span key={index} className={styles.skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!personalInfo.name && experience.length === 0 && skills.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg mb-2">Your CV Preview</p>
            <p className="text-sm">Start adding your information to see the preview</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Template</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateChange(template)}
              className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
              </div>
              {selectedTemplate === template.id && (
                <div className="mt-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Live Preview
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Export buttons in preview */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          <button
            onClick={handleExportDOCX}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            DOCX
          </button>
          
          <div className="text-gray-300 dark:text-gray-600">|</div>
          
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            A4 Size
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            Zoom to Fit
          </button>
        </div>
      </div>

      {/* CV Preview */}
      <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
        <div className="max-w-4xl mx-auto">
          {renderCV()}
        </div>
      </div>

      {/* Preview Tips */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Preview Tips</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
          <li>• The preview updates automatically as you edit your information</li>
          <li>• Try different templates to see which style suits your profession</li>
          <li>• Your CV will print on standard A4 paper size</li>
          <li>• ATS-friendly templates prioritise readability for applicant tracking systems</li>
        </ul>
      </div>
    </div>
  );
}
