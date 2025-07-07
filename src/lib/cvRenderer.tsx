/**
 * Standalone CV Renderer for PDF Export
 */
import React from 'react';
import { CVData } from '../types';

export function renderCVHTML(cvData: CVData): string {
  const { personalInfo, experience, skills, education, certifications, languages } = cvData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Get template styles (simplified for PDF)
  const getTemplateStyles = (templateId: string) => {
    switch (templateId) {
      case 'minimal':
        return {
          container: 'bg-white text-gray-900 font-sans p-8 max-w-4xl mx-auto shadow-lg min-h-[297mm]',
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
      case 'modern':
        return {
          container: 'bg-white text-gray-900 font-sans p-8 max-w-4xl mx-auto shadow-lg min-h-[297mm]',
          header: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-6 rounded-t-lg -mx-8 mt-[-32px]',
          name: 'text-3xl font-light mb-2',
          contact: 'text-blue-100 space-y-1 text-sm',
          section: 'mb-6 px-0',
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
      default:
        return {
          container: 'bg-white text-gray-900 font-sans p-8 max-w-4xl mx-auto shadow-lg min-h-[297mm]',
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

  const styles = getTemplateStyles(cvData.template.id);

  // Build the HTML string
  const html = `
    <div id="temp-cv-preview" class="${styles.container}" style="width: 210mm; min-height: 297mm; background-color: white; color: #1f2937; font-family: Arial, sans-serif; padding: 32px; box-sizing: border-box;">
      <!-- Header -->
      <div class="${styles.header}" style="border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 24px;">
        <h1 class="${styles.name}" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 8px; color: #1f2937;">
          ${personalInfo.name || 'Your Name'}
        </h1>
        <div class="${styles.contact}" style="font-size: 0.875rem; color: #6b7280;">
          ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
          ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
          <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px;">
            ${personalInfo.website ? `<div>🌐 ${personalInfo.website.replace(/^https?:\/\//, '')}</div>` : ''}
            ${personalInfo.linkedin ? `<div>💼 ${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</div>` : ''}
            ${personalInfo.github ? `<div>⚡ ${personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Professional Summary -->
      ${personalInfo.summary ? `
        <div class="${styles.section}" style="margin-bottom: 24px;">
          <h2 class="${styles.sectionTitle}" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            Professional Summary
          </h2>
          <p style="color: #374151; line-height: 1.6;">${personalInfo.summary}</p>
        </div>
      ` : ''}

      <!-- Work Experience -->
      ${experience.length > 0 ? `
        <div class="${styles.section}" style="margin-bottom: 24px;">
          <h2 class="${styles.sectionTitle}" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            Work Experience
          </h2>
          ${experience.map(exp => `
            <div class="${styles.experience}" style="margin-bottom: 16px;">
              <div class="${styles.experienceHeader}" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <div class="${styles.position}" style="font-weight: 600; color: #1f2937;">${exp.position}</div>
                  <div class="${styles.company}" style="color: #374151;">
                    ${exp.company}${exp.location ? ` • ${exp.location}` : ''}
                  </div>
                </div>
                <div class="${styles.dates}" style="font-size: 0.875rem; color: #6b7280; white-space: nowrap;">
                  ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              ${exp.description ? `<div class="${styles.description}" style="font-size: 0.875rem; color: #6b7280; margin-top: 8px;">${exp.description}</div>` : ''}
              ${exp.achievements.length > 0 ? `
                <ul class="${styles.achievements}" style="font-size: 0.875rem; color: #6b7280; margin-top: 8px; list-style: none; padding: 0;">
                  ${exp.achievements.map(achievement => `
                    <li style="display: flex; align-items: flex-start; margin-bottom: 4px;">
                      <span style="margin-right: 8px; flex-shrink: 0;">•</span>
                      <span>${achievement}</span>
                    </li>
                  `).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${education && education.length > 0 ? `
        <div class="${styles.section}" style="margin-bottom: 24px;">
          <h2 class="${styles.sectionTitle}" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            Education
          </h2>
          ${education.map(edu => `
            <div class="${styles.experience}" style="margin-bottom: 16px;">
              <div class="${styles.experienceHeader}" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <div class="${styles.position}" style="font-weight: 600; color: #1f2937;">${edu.degree}</div>
                  <div class="${styles.company}" style="color: #374151;">
                    ${edu.institution}${edu.location ? ` • ${edu.location}` : ''}
                  </div>
                </div>
                <div class="${styles.dates}" style="font-size: 0.875rem; color: #6b7280; white-space: nowrap;">
                  ${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}
                </div>
              </div>
              ${edu.description ? `<div class="${styles.description}" style="font-size: 0.875rem; color: #6b7280; margin-top: 8px;">${edu.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Skills -->
      ${skills.length > 0 ? `
        <div class="${styles.section}" style="margin-bottom: 24px;">
          <h2 class="${styles.sectionTitle}" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            Skills
          </h2>
          <div class="${styles.skills}" style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.map(skill => `
              <span class="${styles.skill}" style="padding: 4px 8px; background-color: #f3f4f6; color: #374151; border-radius: 4px; font-size: 0.875rem;">
                ${skill}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Languages -->
      ${languages && languages.length > 0 ? `
        <div class="${styles.section}" style="margin-bottom: 24px;">
          <h2 class="${styles.sectionTitle}" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            Languages
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            ${languages.map(lang => `
              <div style="font-size: 0.875rem;">
                <span style="font-weight: 500; color: #1f2937;">${lang.name}</span>
                <span style="color: #6b7280; margin-left: 8px;">(${lang.proficiency})</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Certifications -->
      ${certifications && certifications.length > 0 ? `
        <div class="${styles.section}" style="margin-bottom: 24px;">
          <h2 class="${styles.sectionTitle}" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            Certifications
          </h2>
          ${certifications.map(cert => `
            <div class="${styles.experience}" style="margin-bottom: 16px;">
              <div class="${styles.experienceHeader}" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <div class="${styles.position}" style="font-weight: 600; color: #1f2937;">${cert.name}</div>
                  <div class="${styles.company}" style="color: #374151;">${cert.issuer}</div>
                </div>
                <div class="${styles.dates}" style="font-size: 0.875rem; color: #6b7280; white-space: nowrap;">
                  ${formatDate(cert.date)}${cert.expiryDate ? ` - ${formatDate(cert.expiryDate)}` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  return html;
}
