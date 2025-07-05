/**
 * Cover Letter Writer Page
 * Generates personalised cover letters based on CV data and job descriptions
 */
'use client';

import { useState, useEffect } from 'react';
import { cvStorage } from '../../lib/storage';
import { CVData } from '../../types';
import { exportCoverLetterToPDF, exportCoverLetterToDOCX } from '../../lib/exportUtils';

interface CoverLetterData {
  companyName: string;
  position: string;
  jobDescription: string;
  recipientName: string;
  generatedLetter: string;
}

interface CoverLetterTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  template: string;
  keywords: string[];
}

// Cover letter templates for common jobs
const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology',
    description: 'For software development roles, emphasising technical skills and problem-solving abilities.',
    keywords: ['programming', 'development', 'software', 'coding', 'technical'],
    template: `Dear [RECIPIENT],

I am writing to express my strong interest in the [POSITION] position at [COMPANY]. With my expertise in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your engineering team.

In my current role as [CURRENT_ROLE], I have developed proficiency in [TECHNICAL_SKILLS] and have successfully delivered [ACHIEVEMENT]. My experience includes:

• Building scalable applications using modern technologies
• Collaborating with cross-functional teams in agile environments
• Writing clean, maintainable code following best practices
• [SPECIFIC_EXPERIENCE]

What particularly excites me about [COMPANY] is [COMPANY_SPECIFIC_REASON]. I am eager to bring my technical expertise and problem-solving skills to help drive your product development forward.

I would welcome the opportunity to discuss how my background in software engineering can contribute to your team's success. Thank you for your consideration.

Best regards,
[YOUR_NAME]`
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    category: 'Marketing',
    description: 'For marketing roles, highlighting creativity, campaign management, and analytical skills.',
    keywords: ['marketing', 'campaigns', 'brand', 'digital', 'analytics'],
    template: `Dear [RECIPIENT],

I am excited to apply for the [POSITION] role at [COMPANY]. With my proven track record in developing successful marketing campaigns and driving brand growth, I am confident I can help elevate your marketing efforts.

In my [YEARS] years of marketing experience, I have:

• Developed and executed integrated marketing campaigns that increased [METRIC] by [PERCENTAGE]
• Managed multi-channel digital marketing strategies across [CHANNELS]
• Led cross-functional teams to deliver projects on time and within budget
• Analysed market trends and consumer behavior to inform strategic decisions

I am particularly drawn to [COMPANY]'s innovative approach to [SPECIFIC_AREA]. Your commitment to [COMPANY_VALUE] aligns perfectly with my passion for creating meaningful connections between brands and consumers.

I would love to discuss how my creativity, analytical mindset, and strategic thinking can contribute to [COMPANY]'s continued success.

Sincerely,
[YOUR_NAME]`
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Technology',
    description: 'For data science roles, emphasising analytical skills, machine learning, and insights generation.',
    keywords: ['data', 'analytics', 'machine learning', 'statistics', 'insights'],
    template: `Dear [RECIPIENT],

I am writing to apply for the [POSITION] position at [COMPANY]. With my strong background in data analysis, machine learning, and statistical modeling, I am excited about the opportunity to turn data into actionable insights for your organisation.

My experience includes:

• Developing machine learning models that improved [BUSINESS_METRIC] by [PERCENTAGE]
• Working with large datasets using [TOOLS] to extract meaningful patterns
• Creating data visualisations and dashboards to communicate findings to stakeholders
• Collaborating with product and engineering teams to implement data-driven solutions

I am particularly impressed by [COMPANY]'s commitment to data-driven decision making and innovation in [SPECIFIC_AREA]. I believe my expertise in [SPECIFIC_SKILLS] would be valuable in helping [COMPANY] achieve its analytical goals.

I look forward to discussing how my passion for data science and proven ability to deliver insights can contribute to your team's success.

Best regards,
[YOUR_NAME]`
  },
  {
    id: 'sales-representative',
    title: 'Sales Representative',
    category: 'Sales',
    description: 'For sales roles, highlighting relationship building, target achievement, and communication skills.',
    keywords: ['sales', 'targets', 'relationships', 'revenue', 'client'],
    template: `Dear [RECIPIENT],

I am excited to apply for the [POSITION] role at [COMPANY]. With my proven track record of exceeding sales targets and building lasting client relationships, I am confident I can drive significant revenue growth for your organisation.

In my sales career, I have:

• Consistently exceeded quarterly sales targets by an average of [PERCENTAGE]
• Built and maintained a portfolio of [NUMBER] key accounts
• Generated [AMOUNT] in new business revenue through prospecting and relationship building
• Collaborated with marketing and product teams to develop effective sales strategies

What attracts me to [COMPANY] is your reputation for [COMPANY_STRENGTH] and commitment to [COMPANY_VALUE]. I am excited about the opportunity to represent your innovative products and help expand your market presence.

I would welcome the opportunity to discuss how my sales expertise and relationship-building skills can contribute to [COMPANY]'s continued growth.

Sincerely,
[YOUR_NAME]`
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    category: 'Management',
    description: 'For project management roles, emphasising leadership, organisation, and delivery capabilities.',
    keywords: ['project', 'management', 'leadership', 'agile', 'delivery'],
    template: `Dear [RECIPIENT],

I am writing to express my interest in the [POSITION] role at [COMPANY]. With my extensive experience in leading cross-functional teams and delivering complex projects on time and within budget, I am excited about the opportunity to drive successful outcomes for your organisation.

My project management experience includes:

• Successfully managing [NUMBER] projects with budgets ranging from [AMOUNT] to [AMOUNT]
• Leading teams of [SIZE] across multiple departments and time zones
• Implementing agile methodologies that improved delivery efficiency by [PERCENTAGE]
• Ensuring stakeholder alignment and managing expectations throughout project lifecycles

I am particularly impressed by [COMPANY]'s commitment to [COMPANY_VALUE] and your innovative approach to [SPECIFIC_AREA]. I believe my expertise in [PROJECT_METHODOLOGY] and passion for delivering results would be valuable additions to your team.

I look forward to discussing how my leadership skills and project management expertise can help [COMPANY] achieve its strategic objectives.

Best regards,
[YOUR_NAME]`
  },
  {
    id: 'hr-specialist',
    title: 'HR Specialist',
    category: 'Human Resources',
    description: 'For HR roles, highlighting people management, recruitment, and organisational development skills.',
    keywords: ['human resources', 'recruitment', 'talent', 'people', 'culture'],
    template: `Dear [RECIPIENT],

I am excited to apply for the [POSITION] position at [COMPANY]. With my passion for people development and proven experience in talent acquisition and employee engagement, I am eager to contribute to your HR team's success.

My HR experience encompasses:

• Recruiting and onboarding [NUMBER] employees across various departments
• Developing and implementing HR policies that improved employee satisfaction by [PERCENTAGE]
• Managing performance review processes and professional development programs
• Leading diversity and inclusion initiatives that enhanced workplace culture

I am particularly drawn to [COMPANY]'s commitment to [COMPANY_VALUE] and your focus on creating an inclusive work environment. I believe my expertise in [HR_SPECIALIsATION] aligns perfectly with your organisational goals.

I would welcome the opportunity to discuss how my HR expertise and passion for people development can support [COMPANY]'s talent strategy.

Sincerely,
[YOUR_NAME]`
  },
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    category: 'Finance',
    description: 'For finance roles, emphasising analytical skills, financial modeling, and business insights.',
    keywords: ['finance', 'analysis', 'modeling', 'budgeting', 'forecasting'],
    template: `Dear [RECIPIENT],

I am writing to apply for the [POSITION] role at [COMPANY]. With my strong analytical skills and expertise in financial modeling and forecasting, I am excited about the opportunity to provide valuable insights that drive business decisions.

My financial analysis experience includes:

• Developing financial models that supported [AMOUNT] in strategic investments
• Preparing monthly and quarterly reports for senior leadership
• Conducting variance analysis and providing actionable recommendations
• Collaborating with cross-functional teams to improve financial processes

I am particularly impressed by [COMPANY]'s financial performance and growth trajectory in [INDUSTRY]. I believe my expertise in [FINANCIAL_AREA] would be valuable in supporting your continued success.

I look forward to discussing how my analytical skills and financial expertise can contribute to [COMPANY]'s strategic initiatives.

Best regards,
[YOUR_NAME]`
  },
  {
    id: 'customer-service',
    title: 'Customer Service Representative',
    category: 'Customer Service',
    description: 'For customer service roles, highlighting communication skills, problem-solving, and customer satisfaction.',
    keywords: ['customer service', 'support', 'communication', 'satisfaction', 'problem-solving'],
    template: `Dear [RECIPIENT],

I am excited to apply for the [POSITION] position at [COMPANY]. With my passion for helping customers and proven track record of resolving complex issues, I am eager to contribute to your customer service team's success.

In my customer service experience, I have:

• Maintained a customer satisfaction rating of [PERCENTAGE] while handling [NUMBER] inquiries daily
• Resolved customer issues with an average resolution time of [TIME]
• Collaborated with product and technical teams to address recurring customer concerns
• Mentored new team members on best practices and company policies

I am particularly drawn to [COMPANY]'s commitment to customer excellence and your reputation for [COMPANY_STRENGTH]. I believe my communication skills and problem-solving abilities would be valuable additions to your team.

I would welcome the opportunity to discuss how my customer service expertise can help [COMPANY] maintain its high standards of customer satisfaction.

Sincerely,
[YOUR_NAME]`
  }
];

export default function CoverLetterPage() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    companyName: '',
    position: '',
    jobDescription: '',
    recipientName: '',
    generatedLetter: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'input' | 'preview'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const data = cvStorage.getCVData();
    setCvData(data);
  }, []);

  // Filter templates based on search query
  const filteredTemplates = COVER_LETTER_TEMPLATES.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTemplateSelect = (template: CoverLetterTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('input');
  };
  const handleInputChange = (field: keyof CoverLetterData, value: string) => {
    setCoverLetterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyTemplate = (template: CoverLetterTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('input');
  };

  const generateFromTemplate = () => {
    if (!cvData || !selectedTemplate) return '';

    const { personalInfo, experience, skills } = cvData;
    const { companyName, position, recipientName } = coverLetterData;
    
    let letter = selectedTemplate.template;
    
    // Replace placeholders with actual data
    letter = letter.replace(/\[RECIPIENT\]/g, recipientName || 'Hiring Manager');
    letter = letter.replace(/\[POSITION\]/g, position || '[Position]');
    letter = letter.replace(/\[COMPANY\]/g, companyName || '[Company]');
    letter = letter.replace(/\[YOUR_NAME\]/g, personalInfo.name || '[Your Name]');
    letter = letter.replace(/\[CURRENT_ROLE\]/g, experience[0]?.position || '[Current Role]');
    letter = letter.replace(/\[TECHNICAL_SKILLS\]/g, skills.slice(0, 3).join(', ') || '[Technical Skills]');
    letter = letter.replace(/\[YEARS\]/g, experience.length > 0 ? experience.length.toString() : '[X]');
    
    // Add contact information
    if (personalInfo.email) {
      letter += `\n\n${personalInfo.email}`;
    }
    if (personalInfo.phone) {
      letter += `\n${personalInfo.phone}`;
    }
    
    return letter;
  };
  const generateCoverLetter = async () => {
    if (!cvData) {
      alert('Please ensure you have CV data.');
      return;
    }

    // If using template and basic info is filled
    if (selectedTemplate && coverLetterData.companyName && coverLetterData.position) {
      const letter = generateFromTemplate();
      setCoverLetterData(prev => ({
        ...prev,
        generatedLetter: letter
      }));
      setActiveTab('preview');
      return;
    }

    // Original generation logic for custom cover letters
    if (!coverLetterData.jobDescription) {
      alert('Please fill out the job description for custom generation.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation - in a real app this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const letter = generateCoverLetterContent(cvData, coverLetterData);
      setCoverLetterData(prev => ({
        ...prev,
        generatedLetter: letter
      }));
      setActiveTab('preview');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCoverLetterContent = (cv: CVData, data: CoverLetterData): string => {
    const { personalInfo, experience, skills } = cv;
    const { companyName, position, jobDescription, recipientName } = data;
    
    // Extract key skills and experiences relevant to the job
    const relevantSkills = skills.slice(0, 5).join(', ');
    const latestExperience = experience[0];
    
    // Extract keywords from job description
    const jobKeywords = jobDescription.toLowerCase().split(/\s+/)
      .filter(word => word.length > 4)
      .slice(0, 10);
    
    const matchingSkills = skills.filter(skill => 
      jobKeywords.some(keyword => 
        skill.toLowerCase().includes(keyword) || keyword.includes(skill.toLowerCase())
      )
    ).slice(0, 3);

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `${currentDate}

${recipientName ? `Dear ${recipientName},` : 'Dear Hiring Manager,'}

I am writing to express my strong interest in the ${position} position at ${companyName}. With my background in ${latestExperience?.position || 'my field'} and expertise in ${relevantSkills}, I am confident that I would be a valuable addition to your team.

In my ${latestExperience ? `current role as ${latestExperience.position} at ${latestExperience.company}` : 'professional experience'}, I have developed strong skills in ${matchingSkills.join(', ') || relevantSkills}. ${latestExperience?.description ? `My achievements include ${latestExperience.description.split('.')[0]}.` : 'I have consistently delivered results that exceed expectations.'}

What particularly excites me about this opportunity at ${companyName} is the chance to apply my technical expertise to your innovative projects. Based on the job description, I believe my experience with ${matchingSkills.slice(0, 2).join(' and ') || skills.slice(0, 2).join(' and ')} aligns perfectly with your requirements.

I am particularly drawn to ${companyName}'s commitment to excellence and innovation. I am eager to contribute to your team's success and would welcome the opportunity to discuss how my background and enthusiasm can benefit your organisation.

Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
${personalInfo.name}
${personalInfo.email}
${personalInfo.phone}`;
  };

  const downloadCoverLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetterData.generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${coverLetterData.companyName}_${coverLetterData.position}_cover_letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const exportCoverLetter = async (format: 'pdf' | 'docx') => {
    if (!coverLetterData.generatedLetter) return;

    try {
      const fileName = `${coverLetterData.companyName || 'Company'}_${coverLetterData.position || 'Position'}_cover_letter.${format}`;
      
      if (format === 'pdf') {
        await exportCoverLetterToPDF(coverLetterData.generatedLetter, fileName);
      } else if (format === 'docx') {
        await exportCoverLetterToDOCX(
          coverLetterData.generatedLetter, 
          coverLetterData.companyName, 
          coverLetterData.position,
          fileName
        );
      }    } catch (error) {
      console.error('Error exporting cover letter:', error);
      alert('Failed to export cover letter. Please try again.');
    }
  };

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No CV Data Found</h2>
          <p className="text-gray-600 mb-6">Please create your CV first before generating a cover letter.</p>
          <a
            href="/cv"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to CV Builder
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letter Writer</h1>
          <p className="text-gray-600">Generate personalised cover letters based on your CV and job requirements</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'input'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Job Details
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Generated Letter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'templates' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cover Letter Templates</h2>
                
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search templates by title or category..."
                  />
                </div>

                <div className="space-y-4">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {template.keywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search criteria or create a new template.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}            {activeTab === 'input' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Job Information</h2>
                  {selectedTemplate && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Using template:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                        {selectedTemplate.title}
                      </span>
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={coverLetterData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="e.g., Google, Microsoft, Startup Inc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position Title *
                      </label>
                      <input
                        type="text"
                        value={coverLetterData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={coverLetterData.recipientName}
                      onChange={(e) => handleInputChange('recipientName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="e.g., Mr. Smith, Mrs Johnson"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      If you know the hiring manager's name, enter it here. Otherwise, we'll use "Dear Hiring Manager"
                    </p>
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description {!selectedTemplate && '*'}
                    </label>
                    <textarea
                      value={coverLetterData.jobDescription}
                      onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder={selectedTemplate 
                        ? "Optional: Add job description for more personalization..." 
                        : "Paste the full job description here. Include requirements, responsibilities, and company information..."
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedTemplate 
                        ? "When using a template, the job description is optional but helps with personalization."
                        : "The more detailed the job description, the better we can tailor your cover letter"
                      }
                    </p>
                  </div>                  <button
                    onClick={generateCoverLetter}
                    disabled={isGenerating || !coverLetterData.companyName || !coverLetterData.position || (!selectedTemplate && !coverLetterData.jobDescription)}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Cover Letter...
                      </span>
                    ) : selectedTemplate ? (
                      'Generate from Template'
                    ) : (
                      'Generate Cover Letter'
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Cover Letter</h2>
                  {coverLetterData.generatedLetter && (
                    <div className="flex gap-2">
                      <button
                        onClick={downloadCoverLetter}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download TXT
                      </button>
                      <button
                        onClick={() => exportCoverLetter('pdf')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to PDF
                      </button>
                      <button
                        onClick={() => exportCoverLetter('docx')}
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to DOCX
                      </button>
                    </div>
                  )}
                </div>
                  {coverLetterData.generatedLetter ? (
                  <div id="cover-letter-preview" className="prose prose-gray max-w-none">
                    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                      <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                        {coverLetterData.generatedLetter}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No cover letter generated</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill out the job details and click "Generate Cover Letter" to get started.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CV Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your CV Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Personal Info</h4>
                  <p className="text-sm text-gray-600">{cvData.personalInfo.name}</p>
                  <p className="text-sm text-gray-600">{cvData.personalInfo.email}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Latest Position</h4>
                  <p className="text-sm text-gray-600">
                    {cvData.experience.length > 0 
                      ? `${cvData.experience[0].position} at ${cvData.experience[0].company}`
                      : 'No experience added yet'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Top Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {cvData.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href="/cv"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit CV →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
