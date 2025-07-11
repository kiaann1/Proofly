import axios from 'axios';

const HF_API_KEY = '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';

// Monitoring hook for LLM API usage and errors
function logLLMUsage(prompt: string, response: string, error?: any) {
  // In production, send to monitoring service
  if (error) {
    console.error('LLM API Error:', error, { prompt });
  } else {
    console.log('LLM API Success:', { prompt, response });
  }
}

export async function getSmolLMSuggestion(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/openai-community/gpt2',
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );
    const result = response.data[0]?.generated_text || response.data.generated_text || '';
    logLLMUsage(prompt, result);
    return result;
  } catch (error) {
    logLLMUsage(prompt, '', error);
    throw error;
  }
}
