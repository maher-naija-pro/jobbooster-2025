import OpenAI from 'openai';

// Create OpenAI client instance configured for Ollama
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'ollama',
    baseURL: process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1',
});
