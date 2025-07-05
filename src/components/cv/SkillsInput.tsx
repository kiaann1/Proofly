/**
 * Enhanced Skills Input Component
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { searchSkills, getSkillCategories, getSkillsByCategory } from '../../lib/skillSuggestions';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = getSkillCategories();

  useEffect(() => {
    if (inputValue.length >= 2) {
      const results = searchSkills(inputValue);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);
  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    
    // Validate skill input - prevent URLs
    if (!trimmedSkill) return;
    
    // Check if the input looks like a URL
    const urlPattern = /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i;
    if (urlPattern.test(trimmedSkill)) {
      alert('Skills should not be URLs. Please enter skill names like "JavaScript", "Project Management", etc.');
      return;
    }
    
    // Check if it contains common URL indicators
    if (trimmedSkill.includes('://') || trimmedSkill.includes('www.') || trimmedSkill.includes('.com') || trimmedSkill.includes('.org')) {
      alert('Skills should be technologies, tools, or abilities - not websites or URLs.');
      return;
    }
    
    // Prevent very long entries (likely URLs or descriptions)
    if (trimmedSkill.length > 50) {
      alert('Skill names should be concise. Please use shorter terms like "React", "Machine Learning", etc.');
      return;
    }
    
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

  const handleCategorySelection = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    if (categoryKey !== 'all') {
      const categorySkills = getSkillsByCategory(categoryKey as any);
      setSuggestions(categorySkills);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Browse by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategorySelection(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

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
            placeholder="Type a skill or select from suggestions..."
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
            No skills added yet. Start typing to add skills or select from categories above.
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Adding Skills</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Include both technical and soft skills relevant to your field</li>
          <li>• Use industry-standard terms and technologies</li>
          <li>• Add skills that match the job requirements you're targeting</li>
          <li>• Mix programming languages, frameworks, tools, and soft skills</li>
        </ul>
      </div>
    </div>
  );
}
