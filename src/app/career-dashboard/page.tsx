'use client';

import { useState, useEffect } from 'react';
import { CVData } from '../../types';
import { cvStorage } from '../../lib/storage';
import { AIAnalyzer, AIAnalysisResult } from '../../lib/aiAnalyzer';
import { AIMarketIntelligenceService, AIMarketData, AICareerInsights } from '../../lib/aiMarketIntelligence';
import AppLayout from '../../components/layout/AppLayout';

export default function CareerDashboard() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [careerInsights, setCareerInsights] = useState<AICareerInsights | null>(null);
  const [marketData, setMarketData] = useState<AIMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const savedCV = cvStorage.getCVData();
      setCvData(savedCV);

      if (savedCV) {
        // Load AI-powered analytics data
        console.log('🚀 Loading AI-powered career insights...');
        
        const [
          analysis,
          insights,
          market
        ] = await Promise.all([
          AIAnalyzer.analyzeCV(savedCV),
          AIMarketIntelligenceService.generateCareerInsights(savedCV),
          AIMarketIntelligenceService.generateMarketIntelligence(savedCV)
        ]);

        console.log('✅ AI Analysis Complete:', { analysis, insights, market });

        setAiAnalysis(analysis);
        setCareerInsights(insights);
        setMarketData(market);
      }
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 55) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="animate-pulse space-y-6 max-w-7xl mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!cvData) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No CV Data Found</h1>
            <p className="text-gray-600 mb-8">Please create your CV first to access the career dashboard.</p>
            <a
              href="/cv"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Your CV
            </a>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 AI Career Intelligence Dashboard</h1>
            <p className="text-gray-600">Real AI-powered insights for your career growth</p>
            {(careerInsights?.confidence || marketData?.salaryData.aiConfidence) && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-sm">
                <span className="text-green-600">🤖</span>
                <span className="text-green-700">
                  Powered by real AI - {Math.max(careerInsights?.confidence || 0, marketData?.salaryData.aiConfidence || 0)}% confidence
                </span>
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${getScoreColor(aiAnalysis?.overallScore || 0)}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Overall Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{aiAnalysis?.overallScore || 0}/100</p>
                  {aiAnalysis?.contentQuality?.isRealAI && (
                    <p className="text-xs text-green-600">✨ AI Enhanced</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">AI Salary Estimate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    £{marketData?.salaryData.median.toLocaleString() || '60,000'}
                  </p>
                  {marketData?.salaryData.aiConfidence && (
                    <p className="text-xs text-green-600">🤖 {marketData.salaryData.aiConfidence}% AI confidence</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Market Position</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {aiAnalysis?.competitiveAnalysis.marketPosition.toFixed(0) || 75}th %ile
                  </p>
                  <p className="text-xs text-blue-600">AI Market Analysis</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Career Level</p>
                  <p className="text-2xl font-semibold text-gray-900 capitalize">
                    {aiAnalysis?.careerProgression.currentLevel || 'Mid'}
                  </p>
                  <p className="text-xs text-purple-600">AI Career Assessment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'AI Overview' },
                { id: 'insights', name: 'Career Insights' },
                { id: 'market', name: 'Market Intelligence' },
                { id: 'recommendations', name: 'AI Recommendations' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI-Powered Analysis Summary</h3>
                
                {aiAnalysis?.contentQuality?.isRealAI && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600">🤖</span>
                      <span className="font-semibold text-green-800">Real AI Analysis Active</span>
                    </div>
                    {aiAnalysis.contentQuality?.aiSummary && (
                      <div className="mt-3 p-3 bg-green-100 rounded text-sm">
                        <strong className="text-green-900">AI Summary:</strong> 
                        <span className="text-green-800 ml-2">{aiAnalysis.contentQuality.aiSummary}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Strengths Analysis</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      {careerInsights?.strengthsAnalysis || 'Strong professional background with relevant experience'}
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {careerInsights?.competitiveAdvantages.map((advantage, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Market Intelligence</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      {careerInsights?.marketPositioning || 'Well-positioned in the current market'}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Demand:</span>
                        <span className="font-medium text-gray-900">
                          {marketData?.demandMetrics.demandLevel || 'Medium'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Competition:</span>
                        <span className="font-medium text-gray-900">
                          {marketData?.demandMetrics.competitionLevel || 'Medium'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Confidence:</span>
                        <span className="font-medium text-green-600">
                          {marketData?.demandMetrics.confidence || careerInsights?.confidence || 70}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && careerInsights && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 AI Career Insights</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Strengths Analysis</h4>
                    <p className="text-gray-700 mb-4">{careerInsights.strengthsAnalysis}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h5 className="font-medium text-green-800 mb-2">Competitive Advantages</h5>
                        <ul className="space-y-1">
                          {careerInsights.competitiveAdvantages.map((advantage, idx) => (
                            <li key={idx} className="text-green-700 text-sm flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h5 className="font-medium text-yellow-800 mb-2">Areas for Growth</h5>
                        <ul className="space-y-1">
                          {careerInsights.improvementAreas.map((area, idx) => (
                            <li key={idx} className="text-yellow-700 text-sm flex items-start gap-2">
                              <span className="text-yellow-500">→</span>
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Market Positioning</h4>
                    <p className="text-gray-700">{careerInsights.marketPositioning}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'market' && marketData && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 AI Market Intelligence</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Salary Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Median Salary:</span>
                        <span className="font-medium text-blue-900">£{marketData.salaryData.median.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Range:</span>
                        <span className="font-medium text-blue-900">
                          £{marketData.salaryData.min.toLocaleString()} - £{marketData.salaryData.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">AI Confidence:</span>
                        <span className="font-medium text-green-600">{marketData.salaryData.aiConfidence}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-3">Market Demand</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Demand Level:</span>
                        <span className="font-medium text-purple-900">{marketData.demandMetrics.demandLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Competition:</span>
                        <span className="font-medium text-purple-900">{marketData.demandMetrics.competitionLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">AI Analysis:</span>
                        <span className="font-medium text-green-600">{marketData.demandMetrics.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">AI Market Analysis</h4>
                  <p className="text-gray-700 text-sm">{marketData.demandMetrics.aiAnalysis}</p>
                </div>
              </div>

              {marketData.skillsAnalysis && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Skills Intelligence</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Top Skills</h4>
                      <div className="space-y-3">
                        {marketData.skillsAnalysis.topRequiredSkills.map((skill, idx) => (
                          <div key={idx} className="bg-green-50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-green-800">{skill.skill}</span>
                              <span className="text-green-600 text-sm">{skill.demandScore.toFixed(0)}% demand</span>
                            </div>
                            <p className="text-green-700 text-xs">{skill.aiAnalysis}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Emerging Opportunities</h4>
                      <div className="space-y-3">
                        {marketData.skillsAnalysis.emergingSkills.map((skill, idx) => (
                          <div key={idx} className="bg-blue-50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-blue-800">{skill.skill}</span>
                              <span className="text-blue-600 text-sm">+{skill.salaryImpact.toFixed(0)}% salary</span>
                            </div>
                            <p className="text-blue-700 text-xs">{skill.aiAnalysis}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">AI Skills Analysis</h4>
                    <p className="text-gray-700 text-sm">{marketData.skillsAnalysis.aiInsights}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 AI-Powered Recommendations</h3>
                
                {careerInsights?.aiRecommendations && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Career Development Recommendations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {careerInsights.aiRecommendations.map((recommendation, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <p className="text-blue-800 text-sm">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {marketData?.careerProgression && (
                  <div className="mt-6 bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">Career Progression Path</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-green-700 text-sm mb-2">
                          <strong>Next Role:</strong> {marketData.careerProgression.nextRole}
                        </p>
                        <p className="text-green-700 text-sm mb-2">
                          <strong>Timeframe:</strong> {marketData.careerProgression.timeframe}
                        </p>
                      </div>
                      <div>
                        <p className="text-green-700 text-sm mb-2"><strong>Required Skills:</strong></p>
                        <div className="flex flex-wrap gap-1">
                          {marketData.careerProgression.requiredSkills.map((skill, idx) => (
                            <span key={idx} className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-green-100 rounded">
                      <p className="text-green-800 text-sm">
                        <strong>AI Recommendation:</strong> {marketData.careerProgression.aiRecommendations}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
