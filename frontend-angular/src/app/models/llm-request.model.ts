export interface LlmRequest {
  provider: LlmProvider;
  model: string;
  prompt: string;
  options?: Record<string, any>; // optional per-provider options
}

export interface LlmResponse {
  response: string;
}

export enum LlmProvider {
  OLLAMA = 'ollama',
  OPENAI = 'openai',
  GROQ = 'groq',
  CLAUDE = 'claude'
}
