/**
 * CV Styling Component - Allows customization of fonts, colors, and sizes
 */
'use client';

import { useState } from 'react';
import { CVStyling, FontOption, ColorOption } from '../../types';

interface CVStylingProps {
  styling: CVStyling;
  onStylingChange: (styling: CVStyling) => void;
}

const fontOptions: FontOption[] = [
  { value: 'font-sans', label: 'Inter (Sans-serif)', category: 'sans-serif' },
  { value: 'font-serif', label: 'Times (Serif)', category: 'serif' },
  { value: 'font-mono', label: 'JetBrains Mono', category: 'monospace' },
  { value: 'font-system', label: 'System Default', category: 'sans-serif' },
];

const fontSizes = [
  { value: 'text-xs', label: 'Extra Small' },
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Medium' },
  { value: 'text-lg', label: 'Large' },
  { value: 'text-xl', label: 'Extra Large' },
  { value: 'text-2xl', label: '2X Large' },
  { value: 'text-3xl', label: '3X Large' },
];

const fontWeights = [
  { value: 'font-light', label: 'Light' },
  { value: 'font-normal', label: 'Normal' },
  { value: 'font-medium', label: 'Medium' },
  { value: 'font-semibold', label: 'Semi Bold' },
  { value: 'font-bold', label: 'Bold' },
];

const colorOptions: ColorOption[] = [
  { value: 'text-white', label: 'White', preview: '#FFFFFF' },
  { value: 'text-gray-900', label: 'Black', preview: '#111827' },
  { value: 'text-gray-700', label: 'Dark Gray', preview: '#374151' },
  { value: 'text-gray-600', label: 'Gray', preview: '#4B5563' },
  { value: 'text-blue-600', label: 'Blue', preview: '#2563EB' },
  { value: 'text-blue-700', label: 'Dark Blue', preview: '#1D4ED8' },
  { value: 'text-purple-600', label: 'Purple', preview: '#9333EA' },
  { value: 'text-green-600', label: 'Green', preview: '#059669' },
  { value: 'text-red-600', label: 'Red', preview: '#DC2626' },
  { value: 'text-orange-600', label: 'Orange', preview: '#EA580C' },
];

const backgroundColors = [
  { value: 'bg-white', label: 'White', preview: '#FFFFFF' },
  { value: 'bg-gray-100', label: 'Light Gray', preview: '#F3F4F6' },
  { value: 'bg-gray-800', label: 'Dark Gray', preview: '#1F2937' },
  { value: 'bg-gray-900', label: 'Very Dark Gray', preview: '#111827' },
  { value: 'bg-blue-100', label: 'Light Blue', preview: '#DBEAFE' },
  { value: 'bg-blue-800', label: 'Dark Blue', preview: '#1E40AF' },
  { value: 'bg-blue-50', label: 'Very Light Blue', preview: '#EFF6FF' },
  { value: 'bg-purple-100', label: 'Light Purple', preview: '#EDE9FE' },
  { value: 'bg-purple-800', label: 'Dark Purple', preview: '#6B21A8' },
  { value: 'bg-green-100', label: 'Light Green', preview: '#D1FAE5' },
  { value: 'bg-green-800', label: 'Dark Green', preview: '#065F46' },
  { value: 'bg-yellow-100', label: 'Light Yellow', preview: '#FEF3C7' },
  { value: 'bg-orange-100', label: 'Light Orange', preview: '#FED7AA' },
];

const lineHeights = [
  { value: 'leading-tight', label: 'Tight' },
  { value: 'leading-normal', label: 'Normal' },
  { value: 'leading-relaxed', label: 'Relaxed' },
  { value: 'leading-loose', label: 'Loose' },
];

export default function CVStylingComponent({ styling, onStylingChange }: CVStylingProps) {
  const [activeSection, setActiveSection] = useState<string>('name');

  const updateStyling = (section: keyof CVStyling, property: string, value: string) => {
    const newStyling = {
      ...styling,
      [section]: {
        ...styling[section],
        [property]: value
      }
    };
    onStylingChange(newStyling);
  };

  const resetToDefaults = () => {
    const defaultStyling: CVStyling = {
      name: {
        fontFamily: 'font-sans',
        fontSize: 'text-2xl',
        color: 'text-gray-900',
        fontWeight: 'font-bold',
      },
      contact: {
        fontFamily: 'font-sans',
        fontSize: 'text-sm',
        color: 'text-gray-600',
      },
      sectionTitle: {
        fontFamily: 'font-sans',
        fontSize: 'text-lg',
        color: 'text-gray-800',
        fontWeight: 'font-semibold',
      },
      position: {
        fontFamily: 'font-sans',
        fontSize: 'text-base',
        color: 'text-gray-900',
        fontWeight: 'font-semibold',
      },
      company: {
        fontFamily: 'font-sans',
        fontSize: 'text-base',
        color: 'text-gray-700',
      },
      description: {
        fontFamily: 'font-sans',
        fontSize: 'text-sm',
        color: 'text-gray-600',
        lineHeight: 'leading-relaxed',
      },
      skills: {
        fontFamily: 'font-sans',
        fontSize: 'text-sm',
        color: 'text-gray-700',
        backgroundColor: 'bg-gray-100',
      },
    };
    onStylingChange(defaultStyling);
  };

  const sections = [
    { key: 'name', label: 'Name', icon: '👤' },
    { key: 'contact', label: 'Contact Info', icon: '📧' },
    { key: 'sectionTitle', label: 'Section Titles', icon: '📝' },
    { key: 'position', label: 'Job Positions', icon: '💼' },
    { key: 'company', label: 'Company Names', icon: '🏢' },
    { key: 'description', label: 'Descriptions', icon: '📄' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
  ];

  const renderStyleControls = (sectionKey: keyof CVStyling) => {
    const section = styling[sectionKey];
    
    return (
      <div className="space-y-6">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={section.fontFamily}
            onChange={(e) => updateStyling(sectionKey, 'fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <select
            value={section.fontSize}
            onChange={(e) => updateStyling(sectionKey, 'fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            {fontSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Weight (if applicable) */}
        {('fontWeight' in section) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
            <select
              value={(section as any).fontWeight}
              onChange={(e) => updateStyling(sectionKey, 'fontWeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              {fontWeights.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => updateStyling(sectionKey, 'color', color.value)}
                className={`p-3 border-2 rounded-lg transition-all flex items-center space-x-2 ${
                  section.color === color.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.preview }}
                ></div>
                <span className="text-xs font-medium text-gray-900">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Line Height (for description) */}
        {('lineHeight' in section) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
            <select
              value={(section as any).lineHeight}
              onChange={(e) => updateStyling(sectionKey, 'lineHeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              {lineHeights.map((height) => (
                <option key={height.value} value={height.value}>
                  {height.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Background Color (for skills) */}
        {('backgroundColor' in section) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <div className="grid grid-cols-2 gap-2">
              {backgroundColors.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() => updateStyling(sectionKey, 'backgroundColor', bg.value)}
                  className={`p-3 border-2 rounded-lg transition-all flex items-center space-x-2 ${
                    (section as any).backgroundColor === bg.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: bg.preview }}
                  ></div>
                  <span className="text-xs font-medium text-black">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-900">Style Elements</h3>
        <button
          onClick={resetToDefaults}
          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {/* Section Selector */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">CV Elements</h4>
          <div className="grid grid-cols-2 gap-1">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`text-left px-2 py-2 rounded-md transition-colors flex items-center space-x-2 text-xs ${
                  activeSection === section.key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{section.icon}</span>
                <span className="truncate">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style Controls */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Customize {sections.find(s => s.key === activeSection)?.label}
          </h4>
          {renderStyleControls(activeSection as keyof CVStyling)}
        </div>
      </div>

      {/* Preview Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 See changes instantly in the preview panel
        </p>
      </div>
    </div>
  );
}
