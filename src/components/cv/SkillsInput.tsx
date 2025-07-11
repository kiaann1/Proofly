/**
 * Enhanced Skills Input Component
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { getLLMSkillSuggestions } from '../../lib/llmSkills';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  cvText?: string; // Pass the user's CV text for context
}

export default function SkillsInput({ skills, onChange, cvText = '' }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (inputValue.length >= 2) {
      setLoading(true);
      getLLMSkillSuggestions(cvText, inputValue).then((results) => {
        if (active) {
          setSuggestions(results);
          setShowSuggestions(true);
          setLoading(false);
        }
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [inputValue, cvText]);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) return;
    if (!skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkill(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Skills Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Skills
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill to get AI suggestions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <kbd className="px-2 py-0.5 text-xs bg-gray-100 rounded">Enter</kbd>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addSkill(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {loading && (
          <div className="absolute left-0 mt-1 text-blue-500 text-xs">Generating AI suggestions...</div>
        )}
      </div>

      {/* Selected Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Skills ({skills.length})
        </label>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm italic">
            No skills added yet. Start typing to get AI-powered suggestions.
          </div>
        )}
      </div>
    </div>
  );
}
