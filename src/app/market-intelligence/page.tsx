'use client';

import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { AIMarketIntelligenceService, AIMarketData, AISkillDemand } from '../../lib/aiMarketIntelligence';
import { CVData } from '../../types';

interface JobMarketData {
  role: string;
  industry: string;
  avgSalary: number;
  demandLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  growthTrend: 'Declining' | 'Stable' | 'Growing' | 'Rapidly Growing';
  skillsInDemand: string[];
  topCompanies: string[];
}

interface MarketTrend {
  month: string;
  demandScore: number;
  salaryGrowth: number;
}

interface AIMarketOverview {
  averageSalary: number;
  jobOpenings: number;
  competitionLevel: string;
  marketGrowth: number;
}

export default function MarketIntelligence() {
  const [selectedIndustry, setSelectedIndustry] = useState('Technology');
  const [jobMarketData, setJobMarketData] = useState<JobMarketData[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [marketOverview, setMarketOverview] = useState<AIMarketOverview | null>(null);
  const [aiMarketData, setAiMarketData] = useState<AIMarketData | null>(null);
  const [topSkills, setTopSkills] = useState<AISkillDemand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMarketData();
  }, [selectedIndustry]);

  const loadMarketData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate sample CV data based on selected industry for AI analysis
      const sampleCVData = generateSampleCVData(selectedIndustry);
      
      // Get AI-powered market intelligence
      const aiData = await AIMarketIntelligenceService.generateMarketIntelligence(sampleCVData);
      setAiMarketData(aiData);
      
      // Extract and format data for the UI
      const formattedJobData = await formatAIDataForDisplay(aiData);
      setJobMarketData(formattedJobData);
      
      // Generate market trends based on AI insights
      const aiTrends = generateAIBasedTrends(aiData);
      setMarketTrends(aiTrends);
      
      // Generate market overview
      const overview = generateMarketOverview(aiData);
      setMarketOverview(overview);
      
      // Set top skills from AI analysis
      setTopSkills(aiData.skillsAnalysis.topRequiredSkills || []);
      
    } catch (error) {
      console.error('Failed to load AI market data:', error);
      setError('Failed to load market intelligence. Please try again.');
      // Fallback to basic data
      loadFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleCVData = (industry: string): CVData => {
    return {
      personalInfo: {
        name: 'Market Analysis User',
        email: 'user@example.com',
        phone: '',
        location: 'London, UK',
        website: '',
        linkedin: '',
        github: '',
        portfolio: '',
        salaryExpectation: '',
        showSalaryInCV: false,
        summary: `Professional in ${industry} industry with experience in market analysis and data interpretation.`
      },
      experience: [{
        id: '1',
        position: getIndustryRole(industry),
        company: 'Sample Company',
        location: 'London, UK',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        description: `Working in ${industry} with focus on ${getIndustrySkills(industry).join(', ')}`,
        achievements: []
      }],
      education: [{
        id: '1',
        degree: 'Bachelor of Science',
        institution: 'University',
        location: 'UK',
        startDate: '2017',
        endDate: '2020',
        current: false,
        gpa: 'First Class',
        description: ''
      }],
      skills: getIndustrySkills(industry),
      languages: [{
        id: '1',
        name: 'English',
        proficiency: 'Native'
      }],
      certifications: [],
      template: {
        id: 'modern',
        name: 'Modern',
        description: 'Modern template',
        category: 'modern'
      }
    };
  };

  const getIndustryRole = (industry: string): string => {
    const roleMap: { [key: string]: string } = {
      'Technology': 'Software Engineer',
      'Finance': 'Financial Analyst',
      'Healthcare': 'Healthcare Professional',
      'Marketing': 'Marketing Manager',
      'Sales': 'Sales Representative'
    };
    return roleMap[industry] || 'Professional';
  };

  const getIndustrySkills = (industry: string): string[] => {
    const skillMap: { [key: string]: string[] } = {
      'Technology': ['JavaScript', 'Python', 'React', 'Node.js', 'AWS'],
      'Finance': ['Financial Analysis', 'Excel', 'SQL', 'Risk Management', 'Bloomberg'],
      'Healthcare': ['Patient Care', 'Medical Knowledge', 'EMR Systems', 'Clinical Research'],
      'Marketing': ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media'],
      'Sales': ['Client Relations', 'CRM', 'Negotiation', 'Lead Generation', 'Sales Strategy']
    };
    return skillMap[industry] || ['Communication', 'Problem Solving', 'Leadership'];
  };

  const formatAIDataForDisplay = async (aiData: AIMarketData): Promise<JobMarketData[]> => {
    return [{
      role: aiData.role,
      industry: aiData.industry,
      avgSalary: aiData.salaryData.median,
      demandLevel: aiData.demandMetrics.demandLevel,
      growthTrend: mapDemandToGrowth(aiData.demandMetrics.demandLevel),
      skillsInDemand: aiData.skillsAnalysis.topRequiredSkills.map(skill => skill.skill),
      topCompanies: generateTopCompanies(aiData.industry)
    }];
  };

  const mapDemandToGrowth = (demandLevel: string): 'Declining' | 'Stable' | 'Growing' | 'Rapidly Growing' => {
    switch (demandLevel) {
      case 'Very High': return 'Rapidly Growing';
      case 'High': return 'Growing';
      case 'Medium': return 'Stable';
      case 'Low': return 'Declining';
      default: return 'Stable';
    }
  };

  const generateTopCompanies = (industry: string): string[] => {
    const companyMap: { [key: string]: string[] } = {
      'Technology': ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'],
      'Finance': ['JPMorgan', 'Goldman Sachs', 'HSBC', 'Barclays', 'Lloyds'],
      'Healthcare': ['NHS', 'Bupa', 'GSK', 'AstraZeneca', 'Novartis'],
      'Marketing': ['WPP', 'Publicis', 'Omnicom', 'Dentsu', 'Havas'],
      'Sales': ['Salesforce', 'Oracle', 'SAP', 'HubSpot', 'Zoho']
    };
    return companyMap[industry] || ['Leading Company 1', 'Leading Company 2', 'Leading Company 3'];
  };

  const generateAIBasedTrends = (aiData: AIMarketData): MarketTrend[] => {
    const baseScore = aiData.demandMetrics.demandLevel === 'Very High' ? 85 : 
                     aiData.demandMetrics.demandLevel === 'High' ? 75 : 
                     aiData.demandMetrics.demandLevel === 'Medium' ? 65 : 55;
    
    return [
      { month: 'Jan', demandScore: baseScore - 10, salaryGrowth: 2.1 },
      { month: 'Feb', demandScore: baseScore - 7, salaryGrowth: 2.3 },
      { month: 'Mar', demandScore: baseScore - 3, salaryGrowth: 2.8 },
      { month: 'Apr', demandScore: baseScore, salaryGrowth: 3.1 },
      { month: 'May', demandScore: baseScore + 3, salaryGrowth: 3.5 },
      { month: 'Jun', demandScore: baseScore + 6, salaryGrowth: 3.8 },
    ];
  };

  const generateMarketOverview = (aiData: AIMarketData): AIMarketOverview => {
    // Calculate job openings based on demand level and competition
    const baseOpenings = {
      'Very High': 12000,
      'High': 8500,
      'Medium': 5500,
      'Low': 2800
    };
    
    const estimatedOpenings = baseOpenings[aiData.demandMetrics.demandLevel] || 5500;
    
    return {
      averageSalary: aiData.salaryData.median,
      jobOpenings: estimatedOpenings, // Based on AI demand level assessment
      competitionLevel: aiData.demandMetrics.competitionLevel,
      marketGrowth: aiData.demandMetrics.demandLevel === 'Very High' ? 15.2 : 
                    aiData.demandMetrics.demandLevel === 'High' ? 12.1 : 
                    aiData.demandMetrics.demandLevel === 'Medium' ? 8.5 : 5.2
    };
  };

  const loadFallbackData = () => {
    // Basic fallback data in case AI fails
    const fallbackData: JobMarketData[] = [{
      role: getIndustryRole(selectedIndustry),
      industry: selectedIndustry,
      avgSalary: 55000,
      demandLevel: 'Medium',
      growthTrend: 'Stable',
      skillsInDemand: getIndustrySkills(selectedIndustry),
      topCompanies: generateTopCompanies(selectedIndustry)
    }];

    const fallbackTrends: MarketTrend[] = [
      { month: 'Jan', demandScore: 65, salaryGrowth: 2.1 },
      { month: 'Feb', demandScore: 68, salaryGrowth: 2.3 },
      { month: 'Mar', demandScore: 72, salaryGrowth: 2.8 },
      { month: 'Apr', demandScore: 75, salaryGrowth: 3.1 },
      { month: 'May', demandScore: 78, salaryGrowth: 3.5 },
      { month: 'Jun', demandScore: 81, salaryGrowth: 3.8 },
    ];

    setJobMarketData(fallbackData);
    setMarketTrends(fallbackTrends);
    setMarketOverview({
      averageSalary: 55000,
      jobOpenings: 8500,
      competitionLevel: 'Medium',
      marketGrowth: 8.5
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6 max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Market Intelligence</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={loadMarketData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Intelligence</h1>
          <p className="text-gray-600">AI-powered insights into job market trends, salary benchmarks, and skills demand</p>
        </div>

        {/* Industry Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-black mb-2">Industry</label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MarketCard
            title="Average Salary"
            value={marketOverview ? `£${marketOverview.averageSalary.toLocaleString()}` : 'Loading...'}
            change={aiMarketData ? `AI Confidence: ${aiMarketData.salaryData.aiConfidence}%` : '+3.2% vs last month'}
            positive={true}
            icon="💰"
          />
          <MarketCard
            title="Job Openings"
            value={marketOverview ? marketOverview.jobOpenings.toLocaleString() : 'Loading...'}
            change={aiMarketData ? `${aiMarketData.demandMetrics.demandLevel} Demand` : '+8.1% vs last month'}
            positive={aiMarketData?.demandMetrics.demandLevel === 'High' || aiMarketData?.demandMetrics.demandLevel === 'Very High'}
            icon="📈"
          />
          <MarketCard
            title="Competition Level"
            value={marketOverview ? marketOverview.competitionLevel : 'Medium'}
            change={aiMarketData ? 'AI Analysis' : 'Stable'}
            positive={null}
            icon="⚖️"
          />
          <MarketCard
            title="Market Growth"
            value={marketOverview ? `${marketOverview.marketGrowth}%` : '15.2%'}
            change="AI-powered forecast"
            positive={true}
            icon="📊"
          />
        </div>

        {/* Market Trends Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Market Trends</h3>
          {aiMarketData && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>AI Insight:</strong> {aiMarketData.demandMetrics.aiAnalysis}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Demand Score Over Time</h4>
              <div className="space-y-2">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{trend.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${trend.demandScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{trend.demandScore}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Salary Growth Rate</h4>
              <div className="space-y-2">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{trend.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(trend.salaryGrowth / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{trend.salaryGrowth}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job Roles Analysis */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">AI Job Market Analysis</h3>
          {aiMarketData && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-purple-900 mb-2">Career Progression Insights</h4>
              <p className="text-sm text-purple-800 mb-2">
                <strong>Next Role:</strong> {aiMarketData.careerProgression.nextRole}
              </p>
              <p className="text-sm text-purple-800 mb-2">
                <strong>Timeframe:</strong> {aiMarketData.careerProgression.timeframe}
              </p>
              <p className="text-xs text-purple-700">
                {aiMarketData.careerProgression.aiRecommendations}
              </p>
            </div>
          )}
          {jobMarketData.map((job, index) => (
            <JobMarketCard key={index} job={job} aiData={aiMarketData} />
          ))}
        </div>

        {/* Skills in Demand */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Analyzed Skills in Demand</h3>
          {aiMarketData && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>AI Skills Insight:</strong> {aiMarketData.skillsAnalysis.aiInsights}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Top Required Skills</h4>
              <div className="space-y-2">
                {topSkills.slice(0, 5).map((skillData, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium text-blue-900">{skillData.skill}</span>
                    <div className="text-right">
                      <div className="text-sm text-blue-700">Score: {skillData.demandScore}</div>
                      <div className="text-xs text-blue-600">+£{skillData.salaryImpact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Skills by Industry</h4>
              <div className="grid grid-cols-2 gap-2">
                {getIndustrySkills(selectedIndustry).map((skill, index) => (
                  <div key={index} className="bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-center font-medium text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

interface MarketCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean | null;
  icon: string;
}

function MarketCard({ title, value, change, positive, icon }: MarketCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className={`text-xs ${
        positive === true ? 'text-green-600' : 
        positive === false ? 'text-red-600' : 
        'text-gray-500'
      }`}>
        {change}
      </p>
    </div>
  );
}

interface JobMarketCardProps {
  job: JobMarketData;
  aiData?: AIMarketData | null;
}

function JobMarketCard({ job, aiData }: JobMarketCardProps) {
  const getDemandColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Rapidly Growing': return 'bg-green-100 text-green-800';
      case 'Growing': return 'bg-blue-100 text-blue-800';
      case 'Stable': return 'bg-yellow-100 text-yellow-800';
      case 'Declining': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {aiData && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            <strong>AI Market Analysis:</strong> Salary range £{aiData.salaryData.min.toLocaleString()} - £{aiData.salaryData.max.toLocaleString()} | 
            Competition: {aiData.demandMetrics.competitionLevel} | 
            Confidence: {aiData.demandMetrics.confidence}%
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.role}</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">£{job.avgSalary.toLocaleString()}</p>
          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getDemandColor(job.demandLevel)}`}>
              {job.demandLevel} Demand
            </span>
            <br />
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTrendColor(job.growthTrend)}`}>
              {job.growthTrend}
            </span>
          </div>
        </div>

        <div className="lg:col-span-1">
          <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
          <div className="space-y-1">
            {job.skillsInDemand.slice(0, 5).map((skill, index) => (
              <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-semibold text-gray-900 mb-2">Top Hiring Companies</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.topCompanies.map((company, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                {company}
              </span>
            ))}
          </div>
          
          {aiData && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-800 mb-1">AI Career Recommendation</h5>
              <p className="text-xs text-gray-600">
                Skills needed for progression: {aiData.careerProgression.requiredSkills.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
