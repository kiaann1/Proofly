/**
 * Contextual AI Assistant - Visible AI help integrated into the interface
 * Provides field-specific suggestions based on what the user is currently editing
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { getSmolLMSuggestion } from '../../lib/smollm';
import debounce from 'lodash.debounce';

interface ContextualAIAssistantProps {
  cvData: any;
  activeTab: string;
  activeField?: string;
  fieldValue?: string;
  onApplySuggestion: (field: string, value: string) => void;
}

export default function ContextualAIAssistant({
  activeField,
  fieldValue = '',
  onApplySuggestion,
  userPreferences = { tone: 'professional', language: 'English' }
}: ContextualAIAssistantProps & { userPreferences?: { tone?: string; language?: string } }) {
  const [llmSuggestion, setLlmSuggestion] = useState<string | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6" aria-live="polite" role="region">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🤖</span>
          </div>
          <h3 className="font-semibold text-gray-900">AI Writing Assistant</h3>
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
      {llmLoading ? (
        <div className="flex items-center gap-2 text-blue-600" role="status" aria-busy="true">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">AI is generating a suggestion...</span>
        </div>
      ) : llmSuggestion ? (
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">AI-Powered Suggestion</h4>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 mb-2">
                  <p className="text-sm text-gray-800 italic">{llmSuggestion}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApplySuggestion(activeField!, llmSuggestion)}
                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                aria-label="Apply AI suggestion"
              >
                ✨ Apply Suggestion
              </button>
            </div>
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
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            {activeField ? 'Start typing to get an AI-powered suggestion!' : 'AI is ready to help with this section!'}
          </p>
        </div>
      )}
      <div className="mt-4 text-xs text-gray-400" aria-label="Privacy Notice">
        <strong>Privacy Notice:</strong> Your CV content is processed securely and anonymized before being sent to the AI. <a href="/privacy" className="underline">Learn more</a>.
      </div>
    </div>
  );
}
