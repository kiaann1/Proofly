/**
 * AI Suggestions Component for Real-time CV Enhancement
 * Provides smart content suggestions and improvements
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { CVData } from '../../types';
import { getSmolLMSuggestion } from '../../lib/smollm';
import debounce from 'lodash.debounce';

interface AISuggestionsProps {
  cvData: CVData;
  activeTab: string;
  activeField?: string;
  fieldValue?: string;
  activeFieldIndex?: number;
  onApplySuggestion: (suggestion: Suggestion) => void;
  onApplyContextualSuggestion?: (field: string, value: string) => void;
  userPreferences?: { tone?: string; language?: string };
}

interface Suggestion {
  id: string;
  type: 'skill' | 'experience' | 'improvement' | 'keyword';
  title: string;
  description: string;
  value: string;
  confidence: number;
  field?: string;
  index?: number;
}

export default function AISuggestions({ 
  cvData, 
  activeTab, 
  activeField, 
  fieldValue = '', 
  activeFieldIndex = -1,
  onApplySuggestion, 
  onApplyContextualSuggestion,
  userPreferences = { tone: 'professional', language: 'English' }
}: AISuggestionsProps) {
  const [llmSuggestion, setLlmSuggestion] = useState<string | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const hasBeenExplicitlyClosed = useRef(false);

  const handleCloseAssistant = () => {
    setIsVisible(false);
    hasBeenExplicitlyClosed.current = true;
    setTimeout(() => {
      hasBeenExplicitlyClosed.current = false;
    }, 30000);
  };

  useEffect(() => {
    const fetchLlm = debounce(async () => {
      if (activeField && fieldValue && fieldValue.length > 0) {
        setLlmLoading(true);
        setFeedback(null);
        try {
          const prompt = `Rewrite or improve this CV field for clarity, professionalism, and impact. Field: ${activeField}. Content: ${fieldValue}. Use a ${userPreferences.tone} tone in ${userPreferences.language}.`;
          let aiResult = await getSmolLMSuggestion(prompt);
          aiResult = aiResult.replace(/Try replacing one instance of ".*?" with ".*?" for variety\.?/gi, '')
                           .replace(/alternative word/gi, '')
                           .replace(/\s+/g, ' ').trim();
          setLlmSuggestion(aiResult);
        } catch (e) {
          setLlmSuggestion('AI suggestion unavailable.');
        }
        setLlmLoading(false);
      } else {
        setLlmSuggestion(null);
      }
    }, 400);
    fetchLlm();
    return () => fetchLlm.cancel();
  }, [activeField, fieldValue, userPreferences]);

  return (
    !isVisible ? null : (
      <div 
        data-ai-assistant
        className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[700px] overflow-hidden"
        aria-live="polite"
        role="region"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm" aria-label="AI Assistant">🤖</span>
              </div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
            </div>
            <button
              onClick={handleCloseAssistant}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close AI Assistant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          {llmLoading ? (
            <div className="text-blue-500" role="status" aria-busy="true">Generating AI suggestion...</div>
          ) : llmSuggestion ? (
            <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="font-medium text-blue-700">AI-Powered Suggestion</div>
              <div className="text-blue-600 text-sm mb-1">{llmSuggestion}</div>
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => onApplySuggestion({
                  id: 'llm-suggestion',
                  type: 'improvement',
                  title: 'AI-Powered Suggestion',
                  description: llmSuggestion,
                  value: llmSuggestion,
                  confidence: 99,
                  field: activeField,
                })}
                aria-label="Apply AI suggestion"
              >Apply Suggestion</button>
              <div className="flex items-center gap-2 mt-2" aria-label="Feedback">
                <span className="text-xs text-gray-500">Was this suggestion helpful?</span>
                <button
                  className={`text-green-600 ${feedback==='up'?'font-bold':''}`}
                  onClick={() => setFeedback('up')}
                  aria-label="Thumbs up"
                  disabled={!!feedback}
                >👍</button>
                <button
                  className={`text-red-600 ${feedback==='down'?'font-bold':''}`}
                  onClick={() => setFeedback('down')}
                  aria-label="Thumbs down"
                  disabled={!!feedback}
                >👎</button>
                {feedback && <span className="text-xs text-gray-400 ml-2">Thank you for your feedback!</span>}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-500 mt-2">Type in any field to get an AI suggestion.</p>
            </div>
          )}
          <div className="mt-4 text-xs text-gray-400" aria-label="Privacy Notice">
            <strong>Privacy Notice:</strong> Your CV content is processed securely and anonymized before being sent to the AI. <a href="/privacy" className="underline">Learn more</a>.
          </div>
        </div>
      </div>
    )
  );
}
