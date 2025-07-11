import { getSmolLMSuggestion } from './smollm';
import { CVData } from '../types';

export async function getLLMCareerInsights(cvData: CVData): Promise<any[]> {
  const cvText = JSON.stringify(cvData);
  const prompt = `You are an expert career advisor. Given this CV data: ${cvText}, generate a JSON array of 5-10 actionable, specific career insights. Each insight should be an object: {title, description, type, priority, actionable, estimatedImpact, nextSteps, timeline}. Do not include any static or template advice.`;
  let llmResult = '';
  try {
    llmResult = await getSmolLMSuggestion(prompt);
    return JSON.parse(llmResult);
  } catch (e) {
    return [{ title: 'AI Suggestion Unavailable', description: 'The AI was unable to generate insights at this time.', type: 'recommendation', priority: 'low', actionable: false, estimatedImpact: {}, nextSteps: [], timeline: '' }];
  }
}
