/**
 * CV Form Component - Step-by-step form for building CV
 */
'use client';

import { useState } from 'react';
import { CVData, PersonalInfo, Experience } from '../../types';
import CVClearActions from './CVClearActions';
import { cvStorage } from '../../lib/storage';
import { sanitizeText } from '../../lib/sanitization';

interface CVFormProps {
  cvData: CVData;
  onChange: (data: Partial<CVData>) => void;
  onDataRefresh?: () => void;
}

export default function CVForm({ cvData, onChange, onDataRefresh }: CVFormProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [newSkill, setNewSkill] = useState('');
  const [showDebug, setShowDebug] = useState(false);

  const sections = [
    { id: 'personal', name: 'Personal Information', icon: '👤' },
    { id: 'experience', name: 'Work Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'skills', name: 'Skills', icon: '⚡' },
    { id: 'certifications', name: 'Certifications', icon: '🏆' },
    { id: 'languages', name: 'Languages', icon: '🌍' },
  ];
  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string | boolean) => {
    // Sanitize string inputs but preserve boolean values
    const sanitizedValue = typeof value === 'string' ? sanitizeText(value) : value;
    
    onChange({
      personalInfo: {
        ...cvData.personalInfo,
        [field]: sanitizedValue,
      },
    });
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    // Sanitize string inputs
    const sanitizedValue = typeof value === 'string' ? sanitizeText(value) : value;
    
    const newExperience = [...cvData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: sanitizedValue,
    };
    onChange({ experience: newExperience });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    onChange({ experience: [...cvData.experience, newExperience] });
  };

  const removeExperience = (index: number) => {
    const newExperience = cvData.experience.filter((_, i) => i !== index);
    onChange({ experience: newExperience });
  };

  const addAchievement = (expIndex: number) => {
    const newExperience = [...cvData.experience];
    newExperience[expIndex].achievements.push('');
    onChange({ experience: newExperience });
  };

  const updateAchievement = (expIndex: number, achievementIndex: number, value: string) => {
    const sanitizedValue = sanitizeText(value);
    const newExperience = [...cvData.experience];
    newExperience[expIndex].achievements[achievementIndex] = sanitizedValue;
    onChange({ experience: newExperience });
  };

  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const newExperience = [...cvData.experience];
    newExperience[expIndex].achievements.splice(achievementIndex, 1);
    onChange({ experience: newExperience });
  };

  const handleSkillsChange = (skills: string[]) => {
    onChange({ skills });
  };

  const addSkill = (skill: string) => {
    const sanitizedSkill = sanitizeText(skill);
    if (sanitizedSkill.trim() && !cvData.skills.includes(sanitizedSkill.trim())) {
      onChange({ skills: [...cvData.skills, sanitizedSkill.trim()] });
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = cvData.skills.filter((_, i) => i !== index);
    onChange({ skills: newSkills });
  };

  // Education handlers
  const handleEducationChange = (index: number, field: keyof any, value: any) => {
    const newEducation = [...cvData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    onChange({ education: newEducation });
  };

  const addEducation = () => {
    const newEducation = {
      id: crypto.randomUUID(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
    };
    onChange({ education: [...cvData.education, newEducation] });
  };

  const removeEducation = (index: number) => {
    const newEducation = cvData.education.filter((_, i) => i !== index);
    onChange({ education: newEducation });
  };

  // Certification handlers
  const handleCertificationChange = (index: number, field: keyof any, value: any) => {
    const newCertifications = [...cvData.certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value,
    };
    onChange({ certifications: newCertifications });
  };

  const addCertification = () => {
    const newCertification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      url: '',
    };
    onChange({ certifications: [...cvData.certifications, newCertification] });
  };

  const removeCertification = (index: number) => {
    const newCertifications = cvData.certifications.filter((_, i) => i !== index);
    onChange({ certifications: newCertifications });
  };

  // Language handlers
  const handleLanguageChange = (index: number, field: keyof any, value: any) => {
    const newLanguages = [...cvData.languages];
    newLanguages[index] = {
      ...newLanguages[index],
      [field]: value,
    };
    onChange({ languages: newLanguages });
  };

  const addLanguage = () => {
    const newLanguage = {
      id: crypto.randomUUID(),
      name: '',
      proficiency: 'Basic' as const,
    };
    onChange({ languages: [...cvData.languages, newLanguage] });
  };

  const removeLanguage = (index: number) => {
    const newLanguages = cvData.languages.filter((_, i) => i !== index);
    onChange({ languages: newLanguages });
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            value={cvData.personalInfo.name}
            onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700   mb-2">
            Email Address *
          </label>
          <input
            type="text"
            value={cvData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            <select
              value={cvData.personalInfo.phone.split(' ')[0] || '+44'}
              onChange={(e) => {
                const currentNumber = cvData.personalInfo.phone.replace(/^\+\d+\s*/, '');
                handlePersonalInfoChange('phone', `${e.target.value} ${currentNumber}`);
              }}
              className="w-24 px-2 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
            >
              <option value="+44">🇬🇧 +44</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+39">🇮🇹 +39</option>
              <option value="+31">🇳🇱 +31</option>
              <option value="+32">🇧🇪 +32</option>
              <option value="+41">🇨🇭 +41</option>
              <option value="+43">🇦🇹 +43</option>
              <option value="+46">🇸🇪 +46</option>
              <option value="+47">🇳🇴 +47</option>
              <option value="+45">🇩🇰 +45</option>
              <option value="+358">🇫🇮 +358</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+82">🇰🇷 +82</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+64">🇳🇿 +64</option>
            </select>
            <input
              type="tel"
              value={cvData.personalInfo.phone.replace(/^\+\d+\s*/, '')}
              onChange={(e) => {
                const countryCode = cvData.personalInfo.phone.split(' ')[0] || '+44';
                handlePersonalInfoChange('phone', `${countryCode} ${e.target.value}`);
              }}
              className="flex-1 px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500"
              placeholder="7700 900123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={cvData.personalInfo.location}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900  bg-white   placeholder-gray-500 "
            placeholder="e.g., London, UK | Berlin, Germany | Remote"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700   mb-2">
            Website
          </label>
          <input
            type="url"
            value={cvData.personalInfo.website}
            onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900  bg-white   placeholder-gray-500 "
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700   mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={cvData.personalInfo.linkedin}
            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900  bg-white   placeholder-gray-500 "
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700   mb-2">
            GitHub Profile
          </label>
          <input
            type="url"
            value={cvData.personalInfo.github}
            onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900  bg-white   placeholder-gray-500 "
            placeholder="https://github.com/yourhandle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio URL
          </label>
          <input
            type="url"
            value={cvData.personalInfo.portfolio}
            onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900  bg-white   placeholder-gray-500 "
            placeholder="https://portfolio.yourname.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700   mb-2">
          Professional Summary
        </label>
        <textarea
          value={cvData.personalInfo.summary}
          onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
          placeholder="A brief professional summary highlighting your key skills and experience..."
        />
      </div>      <div>
        <label className="block text-sm font-medium text-gray-700   mb-2">
          Salary Expectation (Optional)
        </label>
        <input
          type="text"
          value={cvData.personalInfo.salaryExpectation}
          onChange={(e) => handlePersonalInfoChange('salaryExpectation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
          placeholder="Amount in your local currency (e.g., £50,000)"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-2">
          <p className="text-xs text-gray-500 ">
            {cvData.personalInfo.showSalaryInCV ? 'Salary will be shown on your CV' : 'Salary is private and won\'t be shown on your CV'}
          </p>
          <button
            type="button"
            onClick={() => handlePersonalInfoChange('showSalaryInCV', !cvData.personalInfo.showSalaryInCV)}
            className={`px-3 py-1 text-xs rounded-md transition-colors flex-shrink-0 ${
              cvData.personalInfo.showSalaryInCV
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cvData.personalInfo.showSalaryInCV ? '👁️ Visible' : '🔒 Hidden'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
        <button
          onClick={addExperience}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {cvData.experience.length === 0 ? (
        <div className="text-center py-8 bg-gray-50  rounded-lg">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <p className="text-gray-500">No work experience added yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Experience #{index + 1}
                </h3>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1V4m7 3H4" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="Tech Company Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="sm:col-span-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700   mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white  "
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700   mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900  bg-white  "
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                    className="rounded border-gray-300  text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 "
                  />
                  <span className="ml-2 text-sm text-gray-700  ">
                    I currently work here
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700   mb-2">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                  placeholder="Brief description of your role and responsibilities..."
                />
              </div>

              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                  <label className="block text-sm font-medium text-gray-700  ">
                    Key Achievements
                  </label>
                  <button
                    onClick={() => addAchievement(index)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Achievement
                  </button>
                </div>

                <div className="space-y-2">
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(index, achievementIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                        placeholder="Increased sales by 25% through improved customer engagement"
                      />
                      <button
                        onClick={() => removeAchievement(index, achievementIndex)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSkills = () => {
    const handleAddSkill = () => {
      if (newSkill.trim()) {
        addSkill(newSkill);
        setNewSkill('');
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSkill();
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 ">Skills</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
            placeholder="Add a skill (e.g., JavaScript, Project Management)"
          />
          <button
            onClick={handleAddSkill}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>

        {cvData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100   text-blue-800  rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50   rounded-lg">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-gray-500 ">No skills added yet</p>
          </div>
        )}

        <div className="bg-blue-50  /20 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900  mb-2">💡 Skill Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Include both technical and soft skills</li>
            <li>• Focus on skills relevant to your target job</li>
            <li>• Consider industry-specific tools and technologies</li>
            <li>• Include certifications as separate entries</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 ">Education</h2>
        <button
          onClick={addEducation}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </button>
      </div>

      {cvData.education.length > 0 ? (
        <div className="space-y-6">
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 ">Education #{index + 1}</h3>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Degree/Qualification *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Institution *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="e.g., Oxford University, University of London, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="e.g., London, UK"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Grade (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="e.g., 2.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Start Date</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white  "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">End Date</label>
                  <div className="space-y-2">
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                      disabled={edu.current}
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900  bg-white  "
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300  rounded focus:ring-blue-500 "
                      />
                      <span className="ml-2 text-sm text-gray-700  ">Currently studying</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700   mb-2">Description (Optional)</label>
                <textarea
                  value={edu.description}
                  onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                  placeholder="Relevant coursework, honors, extracurricular activities..."
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50   rounded-lg">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500 ">No education added yet</p>
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 ">Certifications</h2>
        <button
          onClick={addCertification}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Certification
        </button>
      </div>

      {cvData.certifications.length > 0 ? (
        <div className="space-y-4">
          {cvData.certifications.map((cert, index) => (
            <div key={cert.id} className="bg-white   border border-gray-200 rounded-lg p-4 lg:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 ">Certification #{index + 1}</h3>
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Certification Name *</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Issuing Organisation *</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Issue Date</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white  "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Expiry Date (Optional)</label>
                  <input
                    type="month"
                    value={cert.expiryDate}
                    onChange={(e) => handleCertificationChange(index, 'expiryDate', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white  "
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700   mb-2">Verification URL (Optional)</label>
                <input
                  type="url"
                  value={cert.url}
                  onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                  placeholder="https://verify.example.com/123456"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50   rounded-lg">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-gray-500 ">No certifications added yet</p>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 ">Languages</h2>
        <button
          onClick={addLanguage}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Language
        </button>
      </div>

      {cvData.languages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cvData.languages.map((lang, index) => (
            <div key={lang.id} className="bg-white   border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 ">Language #{index + 1}</h3>
                <button
                  onClick={() => removeLanguage(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Language *</label>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white   placeholder-gray-500 "
                    placeholder="e.g., Spanish, Mandarin, French"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700   mb-2">Proficiency Level *</label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900  bg-white  "
                  >
                    <option value="Basic">Basic</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50   rounded-lg">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <p className="text-gray-500 ">No languages added yet</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'certifications':
        return renderCertifications();
      case 'languages':
        return renderLanguages();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Mobile Navigation - Horizontal Scroll */}
      <div className="lg:hidden">
        <nav className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm">{section.icon}</span>
              <span className="font-medium">{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium">{section.name}</span>
            </button>
          ))}
        </nav>

        {/* Progress Indicator - Hidden on mobile, shown on desktop */}
        <div className="mt-8 p-4 bg-gray-50   rounded-lg">
          <h3 className="text-sm font-medium text-gray-900  mb-2">Completion Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 ">Personal Info</span>
              <span className={cvData.personalInfo.name && cvData.personalInfo.email ? 'text-green-600 ' : 'text-gray-400  '}>
                {cvData.personalInfo.name && cvData.personalInfo.email ? '✓' : '○'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 ">Experience</span>
              <span className={cvData.experience.length > 0 ? 'text-green-600 ' : 'text-gray-400  '}>
                {cvData.experience.length > 0 ? '✓' : '○'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 ">Skills</span>
              <span className={cvData.skills.length > 0 ? 'text-green-600 ' : 'text-gray-400  '}>
                {cvData.skills.length > 0 ? '✓' : '○'}
              </span>            </div>
          </div>
        </div>

        {/* Clear Actions */}
        <div className="mt-6">
          <CVClearActions onDataCleared={() => onDataRefresh?.()} />
        </div>

        {/* Debug Panel */}
        <div className="mt-4 p-4 bg-yellow-50   border border-yellow-200   rounded-lg">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm font-medium text-yellow-800   hover:text-yellow-900  "
          >
            🐛 Debug Panel {showDebug ? '▼' : '▶'}
          </button>
          
          {showDebug && (
            <div className="mt-3 space-y-2 text-xs text-gray-700  ">
              <div>
                <strong>Experience entries:</strong> {cvData.experience.length}
              </div>
              <div>
                <strong>Sample experience check:</strong>
                {cvData.experience.some(exp => 
                  exp.company === 'TechCorp Solutions' || 
                  exp.company === 'StartupXYZ'
                ) ? ' ⚠️ Sample data detected' : ' ✅ No sample data'}
              </div>
              <button
                onClick={() => {
                  cvStorage.clearAllData();
                  onDataRefresh?.();
                }}
                className="px-2 py-1 bg-red-100   text-red-800   rounded text-xs hover:bg-red-200 "
              >
                Clear All Data
              </button>
              <button
                onClick={() => {
                  console.log('Current CV Data:', cvData);
                  console.log('Experience entries:', cvData.experience);
                }}
                className="px-2 py-1 bg-blue-100   text-blue-800  rounded text-xs hover:bg-blue-200  ml-2"
              >
                Log Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}
