/**
 * CV Clear Actions Component - Provides clearing functionality with confirmations
 */
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { cvStorage } from '../../lib/storage';

interface CVClearActionsProps {
  onDataCleared: () => void;
}

export default function CVClearActions({ onDataCleared }: CVClearActionsProps) {
  const [showClearMenu, setShowClearMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [clearAction, setClearAction] = useState<{
    type: 'personalInfo' | 'experience' | 'education' | 'skills' | 'certifications' | 'languages' | 'all';
    label: string;
  } | null>(null);

  const clearOptions = [
    { type: 'personalInfo' as const, label: 'Personal Information', icon: '👤' },
    { type: 'experience' as const, label: 'Work Experience', icon: '💼' },
    { type: 'education' as const, label: 'Education', icon: '🎓' },
    { type: 'skills' as const, label: 'Skills', icon: '⚡' },
    { type: 'certifications' as const, label: 'Certifications', icon: '🏆' },
    { type: 'languages' as const, label: 'Languages', icon: '🌍' },
    { type: 'all' as const, label: 'Entire CV', icon: '🗑️', danger: true },
  ];

  const handleClearRequest = (option: typeof clearOptions[0]) => {
    setClearAction(option);
    setShowClearMenu(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmClear = () => {
    if (!clearAction) return;

    try {
      cvStorage.clearCVSection(clearAction.type);
      
      // Show success toast
      toast.success(`${clearAction.label} cleared successfully!`, {
        icon: clearAction.type === 'all' ? '🗑️' : '✅',
        duration: 3000,
      });

      // Notify parent component to refresh data
      onDataCleared();
      
    } catch (error) {
      console.error('Error clearing CV section:', error);
      toast.error('Failed to clear data. Please try again.', {
        icon: '❌',
        duration: 4000,
      });
    }

    setShowConfirmDialog(false);
    setClearAction(null);
  };

  const handleCancelClear = () => {
    setShowConfirmDialog(false);
    setClearAction(null);
  };

  const cvSummary = cvStorage.getCVSummary();
  const hasCVData = cvStorage.hasCVData();

  if (!hasCVData) {
    return null; // Don't show clear actions if there's no data
  }

  return (
    <div className="relative">
      {/* Clear Button */}
      <button
        onClick={() => setShowClearMenu(!showClearMenu)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear Data
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Clear Options Menu */}
      {showClearMenu && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Clear CV Data</h3>
            <p className="text-xs text-gray-500 mt-1">Choose what to clear from your CV</p>
          </div>
          
          <div className="p-2 space-y-1">
            {clearOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleClearRequest(option)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                  option.danger
                    ? 'text-red-700 hover:bg-red-50 hover:text-red-800'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-base mr-3">{option.icon}</span>
                <span className="flex-1">{option.label}</span>
                {option.danger && (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          <div className="p-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
            <p className="text-xs text-gray-600">
              Current CV contains: {cvSummary}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && clearAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                clearAction.type === 'all' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Clear {clearAction.label}?
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {clearAction.type === 'all' 
                ? 'This will permanently delete all your CV data. This action cannot be undone.'
                : `This will permanently delete your ${clearAction.label.toLowerCase()} data. This action cannot be undone.`
              }
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelClear}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  clearAction.type === 'all'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                Clear {clearAction.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {showClearMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowClearMenu(false)}
        />
      )}
    </div>
  );
}
