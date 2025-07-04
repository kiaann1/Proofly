/**
 * CV Builder Page - Main interface for building and editing CVs
 */
'use client';

import { useState, useEffect } from 'react';
import { CVData, CVTemplate, PersonalInfo } from '../../types';
import AppLayout from '../../components/layout/AppLayout';
import CVForm from '../../components/cv/CVForm';
import CVPreview from '../../components/cv/CVPreview';
import ATSChecker from '../../components/cv/ATSChecker';
import { cvStorage } from '../../lib/storage';
import { exportToPDF, exportToDOCX } from '../../lib/exportUtils';

const defaultPersonalInfo: PersonalInfo = {
  name: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  portfolio: '',
  salaryExpectation: '',
  summary: '',
};

const defaultTemplate: CVTemplate = {
  id: 'modern-1',
  name: 'Modern Professional',
  description: 'Clean and modern design',
  category: 'modern',
};

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: defaultPersonalInfo,
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    template: defaultTemplate,
  });

  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'ats'>('form');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCV = cvStorage.getCVData();
        setCvData(savedCV);
      } catch (error) {
        console.error('Error loading CV data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      handleSave(true);
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [cvData]);

  const handleSave = async (isAutoSave = false) => {
    if (isAutoSave && !cvData.personalInfo.name) return; // Don't auto-save empty CVs

    setIsSaving(true);
    try {
      cvStorage.saveCVData(cvData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving CV:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCVDataChange = (newData: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...newData }));
  };

  const handleTemplateChange = (template: CVTemplate) => {
    setCvData(prev => ({ ...prev, template }));
  };

  const handleExportPDF = async () => {
    try {
      if (activeTab !== 'preview') {
        setActiveTab('preview');
        // Wait for the tab to switch and render
        setTimeout(async () => {
          await exportToPDF(cvData, 'cv-preview');
        }, 100);
      } else {
        await exportToPDF(cvData, 'cv-preview');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportDOCX = async () => {
    try {
      await exportToDOCX(cvData);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Failed to export DOCX. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-row">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  CV Builder
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a professional CV with live preview and ATS optimization
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Auto-save indicator */}
                {isSaving && (
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </div>
                )}

                {/* Export buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    📄 Export PDF
                  </button>
                  <button
                    onClick={handleExportDOCX}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    📝 Export DOCX
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('form')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'form'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                  }`}
                >
                  ✏️ Edit CV
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'preview'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                  }`}
                >
                  👁️ Preview
                </button>
                <button
                  onClick={() => setActiveTab('ats')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'ats'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                  }`}
                >
                  🎯 ATS Check
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'form' && (
                <CVForm cvData={cvData} onChange={handleCVDataChange} />
              )}
              {activeTab === 'preview' && (
                <CVPreview cvData={cvData} onTemplateChange={handleTemplateChange} />
              )}
              {activeTab === 'ats' && (
                <ATSChecker cvData={cvData} onChange={handleCVDataChange} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
