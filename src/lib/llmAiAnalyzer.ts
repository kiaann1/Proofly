import { getSmolLMSuggestion } from './smollm';
import { CVData } from '../types';

export async function getLLMRecommendations(cvData: CVData): Promise<string[]> {
  const cvText = JSON.stringify(cvData);
  const prompt = `You are an expert CV reviewer. Given this CV data: ${cvText}, generate a list of 5-10 actionable, specific recommendations to improve the CV for skills, achievements, ATS, and recruiter success. Only return a JSON array of suggestion strings. Do not include any static or template advice.`;
  let llmResult = '';
  try {
    llmResult = await getSmolLMSuggestion(prompt);
    return JSON.parse(llmResult);
  } catch (e) {
    return ['The AI was unable to generate suggestions at this time.'];
  }
}
