import { getSmolLMSuggestion } from './smollm';

// Simple in-memory cache for LLM responses
const llmCache = new Map<string, any>();

function anonymizeCVData(cvData: any): any {
  if (!cvData) return '';
  // Remove or mask PII fields (example: name, email, phone)
  const { name, email, phone, ...rest } = cvData;
  return rest;
}

export async function getLLMTooltipContent(
  fieldType: string,
  context: string,
  cvData?: any,
  options?: { tone?: string; language?: string }
): Promise<any> {
  const cvText = cvData ? JSON.stringify(anonymizeCVData(cvData)) : '';
  const tone = options?.tone || 'professional';
  const language = options?.language || 'English';
  const prompt = `You are an expert CV writing assistant. For the field type: "${fieldType}", and the current field content: "${context}", and the user's CV: ${cvText}, generate a JSON object with: {title, suggestions (array), examples (array), tips (array)}. Suggestions should be concise, actionable, and tailored to the field and context. Use a ${tone} tone in ${language}. Do not include any static or template advice.`;
  // Caching key
  const cacheKey = `${fieldType}|${context}|${cvText}|${tone}|${language}`;
  if (llmCache.has(cacheKey)) {
    return llmCache.get(cacheKey);
  }
  let llmResult = '';
  try {
    llmResult = await getSmolLMSuggestion(prompt);
    const parsed = JSON.parse(llmResult);
    llmCache.set(cacheKey, parsed);
    return parsed;
  } catch (e) {
    return {
      title: 'AI Suggestion Unavailable',
      suggestions: ['The AI was unable to generate suggestions at this time.'],
      examples: [],
      tips: []
    };
  }
}
