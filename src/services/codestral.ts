// Codestral API Service - Mistral's Code Completion Model

const CODESTRAL_FIM_URL = 'https://codestral.mistral.ai/v1/fim/completions';
const CODESTRAL_CHAT_URL = 'https://codestral.mistral.ai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_CODESTRAL_API_KEY;

export interface FIMRequest {
  prompt: string;       // Code before cursor
  suffix?: string;      // Code after cursor
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stop?: string[];
}

export interface FIMResponse {
  id: string;
  model: string;
  choices: {
    text: string;
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
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

// Fill-in-the-Middle code completion
export async function codeCompletion(request: FIMRequest): Promise<FIMResponse> {
  if (!API_KEY) {
    throw new Error('Codestral API key not configured');
  }

  const response = await fetch(CODESTRAL_FIM_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model || 'codestral-latest',
      prompt: request.prompt,
      suffix: request.suffix || '',
      temperature: request.temperature ?? 0.2,
      max_tokens: request.max_tokens ?? 256,
      stop: request.stop || ['\n\n', '```'],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Codestral API error: ${response.status}`);
  }

  return response.json();
}

// Chat completion with Codestral
export async function codestralChat(request: ChatRequest): Promise<ChatResponse> {
  if (!API_KEY) {
    throw new Error('Codestral API key not configured');
  }

  const response = await fetch(CODESTRAL_CHAT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model || 'codestral-latest',
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Codestral API error: ${response.status}`);
  }

  return response.json();
}

export function isCodestralConfigured(): boolean {
  return !!API_KEY;
}

// Debounce helper for code completion
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
