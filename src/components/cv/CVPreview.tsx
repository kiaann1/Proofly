/**
 * CV Preview Component - Live preview of CV with template selection
 */
'use client';

import { useState } from 'react';
import { CVData, CVTemplate, CVStyling } from '../../types';
import { exportToPDF, exportToPDFWithPageBreaks, exportToDOCX } from '../../lib/exportUtils';
import CVStylingComponent from './CVStyling';

interface CVPreviewProps {
  cvData: CVData;
  onTemplateChange: (template: CVTemplate) => void;
  onStylingChange: (styling: CVStyling) => void;
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
    id: 'two-column',
    name: 'Two Column',
    description: 'Space-efficient two column layout',
    category: 'modern',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative professionals',
    category: 'creative',
  },
];

export default function CVPreview({ cvData, onTemplateChange, onStylingChange }: CVPreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(cvData.template.id);
  const [activeTab, setActiveTab] = useState<'templates' | 'styling'>('templates');

  const handleTemplateChange = (template: CVTemplate) => {
    setSelectedTemplate(template.id);
    onTemplateChange(template);
  };
  const handleExportPDF = async () => {
    try {
      console.log('Starting enhanced PDF export with page breaks...');
      await exportToPDFWithPageBreaks(cvData);
      console.log('Enhanced PDF export with page breaks completed successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'An error occurred during PDF export. Please try again.'}`);
    }
  };

  const handleExportDOCX = async () => {
    try {
      await exportToDOCX(cvData);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
    }
  };  const getTemplateStyles = (templateId: string) => {
    const baseStyles = (() => {
      switch (templateId) {
        case 'minimal':
          return {
            container: 'bg-white text-gray-900 font-sans overflow-hidden',
            header: 'border-b-2 border-gray-200 pb-6 mb-6',
            name: 'text-2xl font-bold mb-2 break-words',
            contact: 'text-sm text-gray-600 space-y-1 break-words',
            section: 'mb-6',
            sectionTitle: 'text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1 break-words',
            experience: 'mb-4 last:mb-0',
            experienceHeader: 'flex justify-between items-start mb-2 flex-wrap gap-2',
            position: 'font-semibold text-gray-900 break-words',
            company: 'text-gray-700 break-words',
            dates: 'text-sm text-gray-500 whitespace-nowrap',
            description: 'text-sm text-gray-600 mt-2 break-words hyphens-auto',
            achievements: 'text-sm text-gray-600 mt-2 space-y-1',
            skills: 'flex flex-wrap gap-2',
            skill: 'px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm break-words',
          };
        case 'classic':
          return {
            container: 'bg-white text-gray-900 font-serif overflow-hidden',
            header: 'text-center border-b border-gray-300 pb-6 mb-6',
            name: 'text-3xl font-bold mb-2 break-words',
            contact: 'text-sm text-gray-600 space-y-1 break-words',
            section: 'mb-6',
            sectionTitle: 'text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide break-words',
            experience: 'mb-5 last:mb-0',
            experienceHeader: 'mb-2',
            position: 'font-bold text-gray-900 text-lg break-words',
            company: 'text-gray-700 italic break-words',
            dates: 'text-sm text-gray-500 font-normal',
            description: 'text-gray-600 mt-2 leading-relaxed break-words hyphens-auto',
            achievements: 'text-gray-600 mt-2 space-y-1',
            skills: 'grid grid-cols-3 gap-2',
            skill: 'text-center py-2 border border-gray-300 text-gray-700 break-words',
          };
        case 'modern':
          return {
            container: 'bg-white text-gray-900 font-sans overflow-hidden',
            header: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-6 rounded-t-lg',
            name: 'text-3xl font-light mb-2 break-words',
            contact: 'text-blue-100 space-y-1 text-sm break-words',
            section: 'mb-6 px-6',
            sectionTitle: 'text-lg font-semibold mb-3 text-blue-600 border-l-4 border-blue-600 pl-3 break-words',
            experience: 'mb-4 last:mb-0',
            experienceHeader: 'flex justify-between items-start mb-2 flex-wrap gap-2',
            position: 'font-semibold text-gray-900 break-words',
            company: 'text-blue-600 break-words',
            dates: 'text-sm text-gray-500 whitespace-nowrap',
            description: 'text-sm text-gray-600 mt-2 break-words hyphens-auto',
            achievements: 'text-sm text-gray-600 mt-2 space-y-1',
            skills: 'flex flex-wrap gap-2',
            skill: 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm break-words',
          };        case 'creative':
          return {
            container: 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 font-sans overflow-hidden',
            header: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 mb-6 rounded-lg',
            name: 'text-3xl font-bold mb-2 break-words',
            contact: 'text-purple-100 space-y-1 text-sm break-words',
            section: 'mb-6 px-6',
            sectionTitle: 'text-lg font-bold mb-3 text-purple-600 bg-white rounded-lg px-3 py-2 shadow-sm break-words',
            experience: 'mb-4 last:mb-0 bg-white rounded-lg p-4 shadow-sm',
            experienceHeader: 'flex justify-between items-start mb-2 flex-wrap gap-2',
            position: 'font-bold text-gray-900 break-words',
            company: 'text-purple-600 break-words',
            dates: 'text-sm text-gray-500 whitespace-nowrap',
            description: 'text-sm text-gray-600 mt-2 break-words hyphens-auto',
            achievements: 'text-sm text-gray-600 mt-2 space-y-1',
            skills: 'flex flex-wrap gap-2',
            skill: 'px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm shadow-sm break-words',
          };
        case 'two-column':
          return {
            container: 'bg-white text-gray-900 font-sans overflow-hidden grid grid-cols-3 gap-6',
            header: 'col-span-3 border-b-2 border-gray-200 pb-6 mb-6',
            name: 'text-2xl font-bold mb-2 break-words',
            contact: 'text-sm text-gray-600 space-y-1 break-words',
            section: 'mb-6',
            sectionTitle: 'text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1 break-words',
            experience: 'mb-4 last:mb-0',
            experienceHeader: 'flex justify-between items-start mb-2 flex-wrap gap-2',
            position: 'font-semibold text-gray-900 break-words',
            company: 'text-gray-700 break-words',
            dates: 'text-sm text-gray-500 whitespace-nowrap',
            description: 'text-sm text-gray-600 mt-2 break-words hyphens-auto',
            achievements: 'text-sm text-gray-600 mt-2 space-y-1',
            skills: 'flex flex-wrap gap-2',
            skill: 'px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm break-words',
            mainContent: 'col-span-2',
            sidebar: 'col-span-1 bg-gray-50 p-4 rounded-lg',
          };
        default:
          return {
            container: 'bg-white text-gray-900 font-sans overflow-hidden',
            header: 'border-b-2 border-gray-200 pb-6 mb-6',
            name: 'text-2xl font-bold mb-2 break-words',
            contact: 'text-sm text-gray-600 space-y-1 break-words',
            section: 'mb-6',
            sectionTitle: 'text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1 break-words',
            experience: 'mb-4 last:mb-0',
            experienceHeader: 'flex justify-between items-start mb-2 flex-wrap gap-2',
            position: 'font-semibold text-gray-900 break-words',
            company: 'text-gray-700 break-words',
            dates: 'text-sm text-gray-500 whitespace-nowrap',
            description: 'text-sm text-gray-600 mt-2 break-words hyphens-auto',
            achievements: 'text-sm text-gray-600 mt-2 space-y-1',
            skills: 'flex flex-wrap gap-2',
            skill: 'px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm',
          };
      }
    })();

    // Apply custom styling if available
    if (cvData.styling) {
      const customStyling = cvData.styling;
      return {
        ...baseStyles,
        name: `${customStyling.name.fontFamily} ${customStyling.name.fontSize} ${customStyling.name.color} ${customStyling.name.fontWeight} mb-2 break-words`,
        contact: `${customStyling.contact.fontFamily} ${customStyling.contact.fontSize} ${customStyling.contact.color} space-y-1 break-words`,
        sectionTitle: `${customStyling.sectionTitle.fontFamily} ${customStyling.sectionTitle.fontSize} ${customStyling.sectionTitle.color} ${customStyling.sectionTitle.fontWeight} mb-3 border-b border-gray-200 pb-1 break-words`,
        position: `${customStyling.position.fontFamily} ${customStyling.position.fontSize} ${customStyling.position.color} ${customStyling.position.fontWeight} break-words`,
        company: `${customStyling.company.fontFamily} ${customStyling.company.fontSize} ${customStyling.company.color} break-words`,
        description: `${customStyling.description.fontFamily} ${customStyling.description.fontSize} ${customStyling.description.color} ${customStyling.description.lineHeight} mt-2 break-words hyphens-auto`,
        skill: `px-2 py-1 ${customStyling.skills.backgroundColor} ${customStyling.skills.color} rounded ${customStyling.skills.fontSize} ${customStyling.skills.fontFamily} break-words`,
      };
    }

    return baseStyles;
  };

  const styles = getTemplateStyles(selectedTemplate);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };  const renderCV = () => {
    const { personalInfo, experience, skills, education, certifications, languages } = cvData;

    if (selectedTemplate === 'two-column') {
      return (
        <div id="cv-preview" className={`${styles.container} p-8 max-w-4xl mx-auto shadow-lg min-h-[297mm] break-words overflow-hidden`}>
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
                  <div>🐙 {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</div>
                )}
                {personalInfo.portfolio && (
                  <div>🎨 {personalInfo.portfolio.replace(/^https?:\/\//, '')}</div>
                )}
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content (Left Side) */}
            <div className="col-span-2">
              {/* Professional Summary */}
              {personalInfo.summary && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Professional Summary</h2>
                  <p className="text-gray-700 leading-relaxed break-words hyphens-auto">{personalInfo.summary}</p>
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
                              <span className="mr-2 flex-shrink-0">•</span>
                              <span className="break-words hyphens-auto">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Education</h2>
                  {education.map((edu, index) => (
                    <div key={index} className={styles.experience}>
                      <div className={styles.experienceHeader}>
                        <div>
                          <div className={styles.position}>{edu.degree}</div>
                          <div className={styles.company}>
                            {edu.institution}
                            {edu.location && ` • ${edu.location}`}
                          </div>
                        </div>
                        <div className={styles.dates}>
                          {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                        </div>
                      </div>
                      {edu.description && (
                        <div className={styles.description}>{edu.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar (Right Side) */}
            <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
              {/* Skills */}
              {skills.length > 0 && (
                <div className="mb-6">
                  <h2 className={`${styles.sectionTitle} text-base`}>Skills</h2>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill, index) => (
                      <span key={index} className={`${styles.skill} text-xs`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div className="mb-6">
                  <h2 className={`${styles.sectionTitle} text-base`}>Languages</h2>
                  <div className="space-y-2">
                    {languages.map((lang, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-gray-500 ml-2">({lang.proficiency})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className={`${styles.sectionTitle} text-base`}>Certifications</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-gray-600">{cert.issuer}</div>
                        {cert.date && (
                          <div className="text-gray-500 text-xs">{formatDate(cert.date)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Salary Expectation */}
              {personalInfo.showSalaryInCV && personalInfo.salaryExpectation && (
                <div className="mb-6">
                  <h2 className={`${styles.sectionTitle} text-base`}>Salary Expectation</h2>
                  <p className="text-sm text-gray-700 break-words">{personalInfo.salaryExpectation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Empty State for Two Column */}
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
    }    // Default single-column layout for other templates
    return (
      <div className={`${styles.container} p-8 max-w-4xl mx-auto shadow-lg min-h-[297mm] break-words overflow-hidden`}>
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
            <p className="text-gray-700 leading-relaxed break-words hyphens-auto">{personalInfo.summary}</p>
          </div>
        )}

        {/* Salary Expectation */}
        {personalInfo.showSalaryInCV && personalInfo.salaryExpectation && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Salary Expectation</h2>
            <p className="text-gray-700 break-words">{personalInfo.salaryExpectation}</p>
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
                        <span className="mr-2 flex-shrink-0">•</span>
                        <span className="break-words hyphens-auto">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className={styles.experience}>
                <div className={styles.experienceHeader}>
                  <div>
                    <div className={styles.position}>{edu.degree}</div>
                    <div className={styles.company}>
                      {edu.institution}
                      {edu.location && ` • ${edu.location}`}
                    </div>
                  </div>
                  <div className={styles.dates}>
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
                {edu.description && (
                  <div className={styles.description}>{edu.description}</div>
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

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Certifications</h2>
            {certifications.map((cert, index) => (
              <div key={index} className={styles.experience}>
                <div className={styles.experienceHeader}>
                  <div>
                    <div className={styles.position}>{cert.name}</div>
                    <div className={styles.company}>{cert.issuer}</div>
                  </div>
                  <div className={styles.dates}>
                    {cert.date && formatDate(cert.date)}
                    {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Languages</h2>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-sm text-gray-500">{lang.proficiency}</span>
                </div>
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
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🎨 Templates
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'styling'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ✏️ Styling
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'templates' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template)}
                    className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
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
          )}          {activeTab === 'styling' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Styling Controls - Left Column */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Customise Styling</h2>
                <CVStylingComponent
                  styling={cvData.styling || {
                    name: { fontFamily: 'font-sans', fontSize: 'text-2xl', color: 'text-gray-900', fontWeight: 'font-bold' },
                    contact: { fontFamily: 'font-sans', fontSize: 'text-sm', color: 'text-gray-600' },
                    sectionTitle: { fontFamily: 'font-sans', fontSize: 'text-lg', color: 'text-gray-800', fontWeight: 'font-semibold' },
                    position: { fontFamily: 'font-sans', fontSize: 'text-base', color: 'text-gray-900', fontWeight: 'font-semibold' },
                    company: { fontFamily: 'font-sans', fontSize: 'text-base', color: 'text-gray-700' },
                    description: { fontFamily: 'font-sans', fontSize: 'text-sm', color: 'text-gray-600', lineHeight: 'leading-relaxed' },
                    skills: { fontFamily: 'font-sans', fontSize: 'text-sm', color: 'text-gray-700', backgroundColor: 'bg-gray-100' },
                  }}
                  onStylingChange={onStylingChange}
                />
              </div>
              
              {/* Live Preview - Right Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Preview updates automatically as you change styles</p>
                  </div>
                  <div className="bg-white p-4 max-h-[600px] overflow-y-auto">
                    <div className="transform scale-75 origin-top-left">
                      {renderCV()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">Live Preview</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Export buttons in preview */}
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={handleExportDOCX}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export DOCX
            </button>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="bg-gray-100 p-8 rounded-lg">
        <div className="max-w-4xl mx-auto">
          {renderCV()}
        </div>
      </div>

      {/* Preview Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Preview Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• The preview updates automatically as you edit your information</li>
          <li>• Try different templates to see which style suits your profession</li>
          <li>• Your CV will print on standard A4 paper size</li>
          <li>• ATS-friendly templates prioritise readability for applicant tracking systems</li>
        </ul>
      </div>
    </div>
  );
}
