import OpenAI from 'openai';

// Create OpenAI client instance configured for Ollama
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'ollama',
    baseURL: process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1',
    timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'), // 30 seconds timeout
    maxRetries: 3, // Retry failed requests up to 3 times
});
