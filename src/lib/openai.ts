import { createOpenAI } from '@ai-sdk/openai';

// Create OpenAI provider instance with GPT-OSS model
export const openai = createOpenAI({
    name: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1',
});
