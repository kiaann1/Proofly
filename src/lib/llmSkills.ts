import { getSmolLMSuggestion } from './smollm';

const llmCache = new Map<string, string[]>();

function anonymizeCVData(cvText: string): string {
  // Optionally implement anonymization if cvText is a JSON string
  // For now, just return as is
  return cvText;
}

export async function getLLMSkillSuggestions(cvText: string, input: string, options?: { tone?: string; language?: string }): Promise<string[]> {
  const tone = options?.tone || 'professional';
  const language = options?.language || 'English';
  const prompt = `Suggest 10 concise, industry-relevant skills for a CV. The user has typed: "${input}". Their CV content: ${anonymizeCVData(cvText)}. Only return a comma-separated list of skills, no explanations or extra text. Use a ${tone} tone in ${language}.`;
  const cacheKey = `${input}|${cvText}|${tone}|${language}`;
  if (llmCache.has(cacheKey)) {
    return llmCache.get(cacheKey)!;
  }
  const result = await getSmolLMSuggestion(prompt);
  const skills = result
    .split(',')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
  llmCache.set(cacheKey, skills);
  return skills;
}
