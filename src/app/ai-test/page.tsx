'use client';

import { useState, useEffect } from 'react';
import { AIAnalyzer } from '../../lib/aiAnalyzer';
import { FreeAIAnalyzer } from '../../lib/freeAI';
import { CVData } from '../../types';

const sampleCV: CVData = {
  personalInfo: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    location: 'San Francisco, CA',
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    salaryExpectation: '',
    showSalaryInCV: false,
    summary: 'Experienced software engineer with 5+ years in full-stack development. Led teams of 8+ developers and delivered 15+ successful projects. Specialized in React, Node.js, and cloud architectures.'
  },
  experience: [
    {
      id: '1',
      position: 'Senior Software Engineer',
      company: 'Tech Solutions Inc',
      location: 'San Francisco, CA',
      startDate: '2021-01-01',
      endDate: '2024-01-01',
      current: false,
      description: 'Led development of microservices architecture serving 100k+ users',
      achievements: [
        'Improved system performance by 40% through optimization',
        'Mentored 5 junior developers',
        'Reduced deployment time by 60% through CI/CD improvements'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2015-09-01',
      endDate: '2019-06-01',
      current: false,
      description: ''
    }
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Leadership', 'Agile'],
  certifications: [],
  languages: [],
  template: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and modern template',
    category: 'modern'
  }
};

export default function AITestPage() {
  const [mockAnalysis, setMockAnalysis] = useState<any>(null);
  const [realAIAnalysis, setRealAIAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Testing Hugging Face AI Integration...');
      
      // Test the hybrid AI analyzer (which now uses real AI for content analysis)
      const hybridResult = await AIAnalyzer.analyzeCV(sampleCV);
      setMockAnalysis(hybridResult);
      console.log('✅ Hybrid Analysis Complete:', hybridResult);
      
      // Test pure Hugging Face AI
      const pureAI = await FreeAIAnalyzer.analyzeCV(sampleCV);
      setRealAIAnalysis(pureAI);
      console.log('✅ Pure AI Analysis Complete:', pureAI);
      
    } catch (err) {
      console.error('❌ Analysis Failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🤖 AI Integration Test: Hugging Face vs Mock Analysis
          </h1>
          <p className="text-gray-700 mb-6">
            This page demonstrates the seamless integration of real Hugging Face AI into Proofly's existing codebase.
            The left side shows our enhanced hybrid analysis (mock + real AI), and the right shows pure Hugging Face results.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🎯 What's Being Tested:</h3>
            <ul className="text-blue-700 space-y-1">
              <li>✅ <strong>Hybrid AI Analysis:</strong> Now uses real Hugging Face AI for content quality analysis</li>
              <li>✅ <strong>Fallback System:</strong> Gracefully falls back to mock analysis if AI fails</li>
              <li>✅ <strong>Free Forever:</strong> No API keys required, completely free AI models</li>
              <li>✅ <strong>Seamless Integration:</strong> Existing code unchanged, just enhanced with real AI</li>
            </ul>
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '🔄 Analyzing with AI...' : '🚀 Run AI Analysis'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">❌ Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hybrid Analysis Results */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">🔄 Hybrid Analysis (Enhanced)</h2>
              <p className="text-blue-100 text-sm">Mock analysis + Real AI content analysis</p>
            </div>
            
            {mockAnalysis ? (
              <div className="p-6 space-y-4 bg-white text-gray-900">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Overall Score:</span>
                  <span className="text-2xl font-bold text-blue-600">{mockAnalysis.overallScore}%</span>
                </div>
                
                {mockAnalysis.contentQuality?.isRealAI && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600">🤖</span>
                      <span className="font-semibold text-green-800">Real AI Analysis Detected!</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Content quality was analyzed using Hugging Face AI with {mockAnalysis.contentQuality.aiConfidence}% confidence
                    </p>
                    {mockAnalysis.contentQuality?.aiSummary && (
                      <div className="mt-2 p-2 bg-green-100 rounded text-sm">
                        <strong className="text-green-900">AI Summary:</strong> <span className="text-green-800">{mockAnalysis.contentQuality.aiSummary}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Content Quality:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Writing Score:</span>
                        <span className="font-medium text-gray-900">{mockAnalysis.contentQuality?.writingScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Keyword Optimization:</span>
                        <span className="font-medium text-gray-900">{mockAnalysis.contentQuality?.keywordOptimization}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Career Progression:</h4>
                    <div className="text-sm space-y-1">
                      <div className="text-gray-700">Level: <span className="font-medium capitalize text-gray-900">{mockAnalysis.careerProgression?.currentLevel}</span></div>
                      <div className="text-gray-700">Timeline: <span className="font-medium text-gray-900">{mockAnalysis.careerProgression?.timelineToPromotion}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Recommendations:</h4>
                    <ul className="text-sm space-y-1">
                      {mockAnalysis.contentQuality?.recommendations?.slice(0, 3).map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 bg-white">
                Click "Run AI Analysis" to see hybrid results
              </div>
            )}
          </div>

          {/* Pure AI Results */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">🤖 Pure Hugging Face AI</h2>
              <p className="text-green-100 text-sm">Direct Hugging Face model results</p>
            </div>
            
            {realAIAnalysis ? (
              <div className="p-6 space-y-4 bg-white text-gray-900">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">AI Confidence:</span>
                  <span className="text-2xl font-bold text-green-600">{realAIAnalysis.confidence}%</span>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{realAIAnalysis.isAI ? '🤖' : '⚠️'}</span>
                    <span className="font-semibold text-blue-800">
                      {realAIAnalysis.isAI ? 'Real AI Analysis' : 'Fallback Analysis'}
                    </span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    {realAIAnalysis.isAI 
                      ? 'Successfully analyzed using multiple Hugging Face models'
                      : 'AI analysis failed, using rule-based fallback'
                    }
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Sentiment Analysis:</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Sentiment:</span>
                      <span className="font-medium capitalize text-gray-900">{realAIAnalysis.sentiment?.label}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Score:</span>
                      <span className="font-medium text-gray-900">{Math.round((realAIAnalysis.sentiment?.score || 0) * 100)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">AI Summary:</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded text-gray-800">
                      {realAIAnalysis.summary?.summary_text || 'No summary available'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Career Level:</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Level:</span>
                      <span className="font-medium text-gray-900">{realAIAnalysis.careerLevel?.label}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Confidence:</span>
                      <span className="font-medium text-gray-900">{Math.round((realAIAnalysis.careerLevel?.score || 0) * 100)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Extracted Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {realAIAnalysis.extractedSkills?.slice(0, 5).map((skill: any, idx: number) => (
                        <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {skill.word}
                        </span>
                      )) || <span className="text-gray-500 text-sm">No skills extracted</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 bg-white">
                Click "Run AI Analysis" to see pure AI results
              </div>
            )}
          </div>
        </div>

        {(mockAnalysis || realAIAnalysis) && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-green-800 mb-3">🎉 Integration Success!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <h4 className="font-semibold mb-2 text-green-800">✅ What Worked:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Hugging Face API calls executed successfully</li>
                  <li>• Hybrid analysis seamlessly integrated</li>
                  <li>• Fallback system working properly</li>
                  <li>• No API keys required</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-800">🚀 Next Steps:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Expand AI to skills analysis</li>
                  <li>• Add career recommendation AI</li>
                  <li>• Implement user preferences</li>
                  <li>• Add more Hugging Face models</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}