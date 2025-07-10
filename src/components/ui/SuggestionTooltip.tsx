/**
 * Tooltip Component for ATS Suggestions using react-tooltip
 */
import React from 'react';
import { Tooltip } from 'react-tooltip';

interface TooltipProps {
  whyImportant?: string;
  howToImplement?: string;
  children: React.ReactNode;
  id?: string; // Unique identifier for the tooltip
}

export default function SuggestionTooltip({ whyImportant, howToImplement, children, id }: TooltipProps) {
  if (!whyImportant && !howToImplement) {
    return <>{children}</>;
  }

  const tooltipId = id || `tooltip-${Date.now()}-${Math.floor(performance.now())}`;

  return (
    <>
      <div 
        data-tooltip-id={tooltipId}
        className="inline-block cursor-help"
      >
        {children}
      </div>
      
      <Tooltip
        id={tooltipId}
        clickable
        place="top"
        style={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          borderRadius: '8px',
          padding: '12px',
          maxWidth: '320px',
          fontSize: '14px',
          lineHeight: '1.4',
          zIndex: 1000,
        }}
      >
        <div className="max-w-sm">
          {whyImportant && (
            <div className="mb-3">
              <h5 className="font-semibold text-blue-200 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Why this matters
              </h5>
              <p className="text-gray-200 text-sm leading-relaxed">{whyImportant}</p>
            </div>
          )}

          {howToImplement && (
            <div>
              <h5 className="font-semibold text-green-200 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                How to implement
              </h5>
              <p className="text-gray-200 text-sm leading-relaxed">{howToImplement}</p>
            </div>
          )}
        </div>
      </Tooltip>
    </>
  );
}
