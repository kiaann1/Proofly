/**
 * CV Builder Page - Main interface for building and editing CVs
 */
'use client';

import { useState, useEffect } from 'react';
import { CVData, CVTemplate, CVStyling, PersonalInfo } from '../../types';
import AppLayout from '../../components/layout/AppLayout';
import CVForm from '../../components/cv/CVForm';
import CVPreview from '../../components/cv/CVPreview';
import ATSChecker from '../../components/cv/ATSChecker';
import ContentChecker from '../../components/cv/ContentChecker';
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
  showSalaryInCV: false,
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

  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'ats' | 'content'>('form');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

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

  // Refresh CV data from storage
  const refreshCVData = () => {
    try {
      const savedCV = cvStorage.getCVData();
      setCvData(savedCV);
    } catch (error) {
      console.error('Error refreshing CV data:', error);
    }
  };

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

  const handleTabSwitch = (newTab: 'form' | 'preview' | 'ats' | 'content') => {
    if (newTab === activeTab) return;
    
    setIsTabSwitching(true);
    setActiveTab(newTab);
    
    // Quick transition
    setTimeout(() => {
      setIsTabSwitching(false);
    }, 100);
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
  const handleStylingChange = (styling: CVStyling) => {
    setCvData(prev => ({ ...prev, styling }));
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Header with Glass Effect */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      CV Builder
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Create a professional CV with live preview and ATS optimisation
                    </p>
                  </div>
                </div>
                
                {/* Status Indicators */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {isSaving && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm font-medium">Saving...</span>
                    </div>
                  )}
                  

                </div>
              </div>

              {/* Export Actions */}
              {activeTab !== 'preview' && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </button>
                  <button
                    onClick={handleExportDOCX}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export DOCX
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modern Tabbed Interface */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
              <nav className="flex px-6">                {[
                  { id: 'form', label: 'Edit CV', icon: '✏️', description: 'Build your CV' },
                  { id: 'preview', label: 'Preview', icon: '👁️', description: 'See how it looks' },
                  { id: 'ats', label: 'ATS Check', icon: '🎯', description: 'Optimise for ATS' },
                  { id: 'content', label: 'Content Check', icon: '📝', description: 'Grammar & style' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSwitch(tab.id as 'form' | 'preview' | 'ats' | 'content')}
                    className={`group relative flex items-center gap-3 py-5 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-400">{tab.description}</div>
                    </div>
                    
                    {/* Active indicator */}
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-blue-50/50 rounded-t-lg -z-10"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content with Smooth Transitions */}
            <div className={`transition-all duration-300 ${isTabSwitching ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>              {activeTab === 'form' && (
                <div className="p-8">
                  <CVForm cvData={cvData} onChange={handleCVDataChange} onDataRefresh={refreshCVData} />
                </div>
              )}
              
              {activeTab === 'preview' && (
                <div className="p-8 bg-gray-50/50">
                  <CVPreview cvData={cvData} onTemplateChange={handleTemplateChange} onStylingChange={handleStylingChange} />
                </div>
              )}
                {activeTab === 'ats' && (
                <div className="p-8">
                  <ATSChecker 
                    cvData={cvData} 
                    onChange={handleCVDataChange} 
                    onSwitchToForm={() => handleTabSwitch('form')}
                  />
                </div>
              )}

              {activeTab === 'content' && (
                <div className="p-8">
                  <ContentChecker cvData={cvData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
