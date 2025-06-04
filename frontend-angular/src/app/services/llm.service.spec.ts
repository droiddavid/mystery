import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LlmService, LlmProviderStrategy } from './llm.service';
import { LlmProvider, LlmRequest } from '../models/llm-request.model';
import { environment } from '../../environments/environment';

const mockRequest: LlmRequest = {
  provider: LlmProvider.OLLAMA,
  model: 'llama3',
  prompt: 'Say hello',
  options: { temperature: 0.7 }
};

describe('LlmService', () => {
  let service: LlmService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LlmService]
    });
    service = TestBed.inject(LlmService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send request to Ollama and return response', (done) => {
    service.send(mockRequest).subscribe(resp => {
      expect(resp.response).toBe('Hello!');
      done();
    });
    const req = httpMock.expectOne(environment.llmEndpoints.ollama);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.model).toBe('llama3');
    expect(req.request.body.prompt).toBe('Say hello');
    req.flush({ response: 'Hello!' });
  });

  it('should map res.message to response if response is missing', (done) => {
    service.send(mockRequest).subscribe(resp => {
      expect(resp.response).toBe('From message');
      done();
    });
    const req = httpMock.expectOne(environment.llmEndpoints.ollama);
    req.flush({ message: 'From message' });
  });

  it('should return empty string if both response and message are missing', (done) => {
    service.send(mockRequest).subscribe(resp => {
      expect(resp.response).toBe('');
      done();
    });
    const req = httpMock.expectOne(environment.llmEndpoints.ollama);
    req.flush({});
  });

  it('should error for unsupported provider (no strategy)', (done) => {
    const badRequest = { ...mockRequest, provider: 'notarealprovider' as any };
    // Remove all strategies to force the branch
    (service as any).strategies = {};
    service.send(badRequest).subscribe({
      error: (err) => {
        expect(err.message).toMatch(/Unsupported LLM provider/);
        done();
      }
    });
  });

  it('should error for unsupported provider (strategy exists but throws)', (done) => {
    const badRequest = { ...mockRequest, provider: LlmProvider.OPENAI };
    service.send(badRequest).subscribe({
      error: (err) => {
        expect(err.message).toMatch(/not implemented|Unsupported/);
        done();
      }
    });
  });

  it('should catch and propagate HTTP errors', (done) => {
    service.send(mockRequest).subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.error).toBe('fail');
        done();
      }
    });
    const req = httpMock.expectOne(environment.llmEndpoints.ollama);
    req.flush('fail', { status: 500, statusText: 'Server Error' });
  });
});
