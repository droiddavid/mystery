import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LlmRequest, LlmResponse, LlmProvider } from '../models/llm-request.model';
import { environment } from '../../environments/environment';

// Strategy interface for LLM providers
export interface LlmProviderStrategy {
  sendRequest(request: LlmRequest): Observable<LlmResponse>;
}

// Ollama strategy implementation
class OllamaStrategy implements LlmProviderStrategy {
  constructor(private http: HttpClient) {}
  sendRequest(request: LlmRequest): Observable<LlmResponse> {
    const url = environment.llmEndpoints.ollama;
    return this.http.post<any>(url, {
      model: request.model,
      prompt: request.prompt,
      ...request.options
    }).pipe(
      map(res => ({ response: res.response || res.message || '' })),
      catchError(err => throwError(() => err))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class LlmService {

  private strategies: Record<LlmProvider, LlmProviderStrategy>;

  constructor(private http: HttpClient) {
    // Stub strategies for all providers to satisfy the type system
    const unsupported: LlmProviderStrategy = {
      sendRequest: () => throwError(() => new Error('Provider not implemented'))
    };
    this.strategies = {
      [LlmProvider.OLLAMA]: new OllamaStrategy(this.http),
      [LlmProvider.OPENAI]: unsupported,
      [LlmProvider.GROQ]: unsupported,
      [LlmProvider.CLAUDE]: unsupported
    };
  }

  send(request: LlmRequest): Observable<LlmResponse> {
    const strategy = this.strategies[request.provider];
    if (!strategy) {
      return throwError(() => new Error('Unsupported LLM provider'));
    }
    return strategy.sendRequest(request);
  }
}
