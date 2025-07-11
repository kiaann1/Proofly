import { getSmolLMSuggestion } from './smollm';

const llmCache = new Map<string, string[]>();

function anonymizeCVData(cvText: string): string {
  // Optionally implement anonymization if cvText is a JSON string
  // For now, just return as is
  return cvText;
}

export async function getLLMContentSuggestions(analysis: any, cvText: string, options?: { tone?: string; language?: string }): Promise<string[]> {
  const tone = options?.tone || 'professional';
  const language = options?.language || 'English';
  const prompt = `You are an expert CV reviewer. Given this CV content: "${anonymizeCVData(cvText)}", and the following analysis: ${JSON.stringify(analysis)}, generate a list of 5-10 actionable, specific suggestions to improve the CV. Only return a JSON array of suggestion strings. Use a ${tone} tone in ${language}. Do not include any static or template advice.`;
  const cacheKey = `${cvText}|${JSON.stringify(analysis)}|${tone}|${language}`;
  if (llmCache.has(cacheKey)) {
    return llmCache.get(cacheKey)!;
  }
  let llmResult = '';
  try {
    llmResult = await getSmolLMSuggestion(prompt);
    const parsed = JSON.parse(llmResult);
    llmCache.set(cacheKey, parsed);
    return parsed;
  } catch (e) {
    return ['The AI was unable to generate suggestions at this time.'];
  }
}
