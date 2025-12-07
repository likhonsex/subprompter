// OpenRouter API Service - Direct fetch for browser compatibility

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  id: string;
  model: string;
  choices: {
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Featured models for the playground
export const FEATURED_MODELS = [
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', badge: 'Best' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', badge: 'Popular' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'Google', badge: 'Fast' },
  { id: 'codestral', name: 'Codestral', provider: 'Mistral', badge: 'Code', isCodestral: true },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', badge: 'Value' },
  { id: 'mistralai/mistral-large-2411', name: 'Mistral Large', provider: 'Mistral' },
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', provider: 'Alibaba' },
];

export async function chatCompletion(request: ChatRequest): Promise<ChatResponse> {
  if (!API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'SubPrompter',
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  return response.json();
}

export function isConfigured(): boolean {
  return !!API_KEY;
}
