import { getSmolLMSuggestion } from './smollm';
import { CVData } from '../types';

export async function getLLMMarketInsights(cvData: CVData): Promise<any> {
  const cvText = JSON.stringify(cvData);
  const prompt = `You are an expert career and market intelligence advisor. Given this CV data: ${cvText}, generate a JSON object with: {role, industry, location, salaryData, demandMetrics, skillsAnalysis, careerProgression}. All fields should be actionable, specific, and based on the CV. Do not include any static or template advice.`;
  let llmResult = '';
  try {
    llmResult = await getSmolLMSuggestion(prompt);
    return JSON.parse(llmResult);
  } catch (e) {
    return { error: 'The AI was unable to generate market insights at this time.' };
  }
}
