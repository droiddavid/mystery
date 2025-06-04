
import { MemoryToken } from './npc-dialogue.service';
import { NpcDialogueService, DialogueOptions } from './npc-dialogue.service';
import { of } from 'rxjs';
import { LlmProvider, LlmResponse } from '../models/llm-request.model';

const mockNpc = {
  id: 'npc1',
  name: 'Maeve',
  personality: { honesty: 40, paranoia: 20, friendliness: 30 }
} as any;

const mockPrompt = 'You are Maeve...';
const mockResponse: LlmResponse = { response: 'I saw nothing.' };

class MockPromptBuilder {
  buildPrompt = jest.fn().mockReturnValue(mockPrompt);
}

class MockLlmService {
  send = jest.fn().mockReturnValue(of(mockResponse));
}

describe('NpcDialogueService', () => {
  let service: NpcDialogueService;
  let promptBuilder: MockPromptBuilder;
  let llmService: MockLlmService;

  beforeEach(() => {
    promptBuilder = new MockPromptBuilder();
    llmService = new MockLlmService();
    service = new NpcDialogueService(promptBuilder as any, llmService as any);
  });

  it('composePrompt should use fallback 0 for base trait if missing and show boost/drop for nonzero trait', () => {
    const traits = { honesty: 5, paranoia: 7, friendliness: 0, base: {} };
    const prompt = service['composePrompt']('Base', traits, [], 'Test');
    const honestyLine = prompt.split('\n').find((line: string) => line.startsWith('- Honesty:')) || '';
    const paranoiaLine = prompt.split('\n').find((line: string) => line.startsWith('- Paranoia:')) || '';
    expect(honestyLine).toBe('- Honesty: 5 (base: 0, boost: 5)');
    expect(paranoiaLine).toBe('- Paranoia: 7 (base: 0, drop: 7)');
  });
  
  it('composePrompt should use fallback 0 when base trait is undefined and trait is 0', () => {
    // base.honesty is undefined, honesty is 0
    const traits = { honesty: 0, paranoia: 5, friendliness: 10, base: {} };
    const prompt = service['composePrompt']('Base', traits, [], 'Test');
    // Should show base: 0 and not show boost for Honesty
    expect(prompt).toContain('- Honesty: 0 (base: 0)');
    const honestyLine = prompt.split('\n').find(line => line.includes('Honesty')) || '';
    expect(honestyLine).not.toContain('boost:');
  });
  
  it('composePrompt should show boost/drop if present', () => {
    const traits = {
      honesty: 50,
      paranoia: 10,
      friendliness: 20,
      base: { honesty: 40, paranoia: 20, friendliness: 10 }
    };
    const prompt = service['composePrompt']('Base', traits, [], 'Test');
    expect(prompt).toContain('- Honesty: 50 (base: 40, boost: 10)');
    expect(prompt).toContain('- Paranoia: 10 (base: 20, drop: -10)');
    expect(prompt).toContain('- Friendliness: 20 (base: 10, boost: 10)');
  });

  it('should build prompt, call LLM, update history and emit response', (done) => {
    service.interactWithNPC(mockNpc, 'What happened?', { provider: LlmProvider.OLLAMA, model: 'llama3' }).subscribe(resp => {
      expect(promptBuilder.buildPrompt).toHaveBeenCalledWith(mockNpc);
      expect(llmService.send).toHaveBeenCalled();
      expect(resp).toBe(mockResponse.response);
      expect(service.getHistory('npc1').length).toBe(2);
      expect(service.npcResponse$.value['npc1']).toBe(mockResponse.response);
      done();
    });
  });

  it('should use default provider and model if not specified', (done) => {
    service.interactWithNPC(mockNpc, 'Default test').subscribe(() => {
      const req: any = llmService.send.mock.calls[0][0];
      expect(req.provider).toBe(LlmProvider.OLLAMA);
      expect(req.model).toBe('llama3');
      done();
    });
  });

  it('getHistory should return [] if no history exists', () => {
    expect(service.getHistory('unknown')).toEqual([]);
  });

  it('applyModifiers should handle missing modifiers and missing personality', () => {
    const npc: any = { id: 'x', name: 'NoPersonality' };
    const traits = service['applyModifiers'](npc);
    expect(traits.honesty).toBe(0);
    expect(traits.friendliness).toBe(0);
    expect(traits.paranoia).toBe(0);
    expect(traits.base).toEqual({});
  });

  it('applyModifiers should handle explicit 0 values', () => {
    const npc: any = { id: 'x', name: 'Zero', personality: { honesty: 0, friendliness: 0, paranoia: 0 } };
    const traits = service['applyModifiers'](npc, { honestyBoost: 0, friendlinessBoost: 0, paranoiaDrop: 0 });
    expect(traits.honesty).toBe(0);
    expect(traits.friendliness).toBe(0);
    expect(traits.paranoia).toBe(0);
  });

  it('composePrompt should show 0 and not show boost/drop if not present', () => {
    const traits = { honesty: 0, paranoia: 0, friendliness: 0, base: { honesty: 0, paranoia: 0, friendliness: 0 } };
    const prompt = service['composePrompt']('Base', traits, [], 'Test');
    expect(prompt).toContain('- Honesty: 0 (base: 0)');
    expect(prompt).toContain('- Paranoia: 0 (base: 0)');
    expect(prompt).toContain('- Friendliness: 0 (base: 0)');
    // No boost/drop text for zero traits
    const honestyLine = prompt.split('\n').find(line => line.startsWith('- Honesty:')) || '';
    const paranoiaLine = prompt.split('\n').find(line => line.startsWith('- Paranoia:')) || '';
    const friendlinessLine = prompt.split('\n').find(line => line.startsWith('- Friendliness:')) || '';
    expect(honestyLine).not.toContain('boost:');
    expect(paranoiaLine).not.toContain('drop:');
    expect(friendlinessLine).not.toContain('boost:');
  });

  it('should reset history for an NPC', () => {
    service['history']['npc1'] = ['User: hi', 'Maeve: hello'];
    service.npcResponse$.next({ npc1: 'hello' });
    service.resetHistory('npc1');
    expect(service.getHistory('npc1')).toEqual([]);
    expect(service.npcResponse$.value['npc1']).toBe('');
  });

  it('should apply modifiers to personality', () => {
    const traits = service['applyModifiers'](mockNpc, { honestyBoost: 10, paranoiaDrop: 5, friendlinessBoost: 7 });
    expect(traits.honesty).toBe(50);
    expect(traits.paranoia).toBe(15);
    expect(traits.friendliness).toBe(37);
  });

  it('should compose prompt with correct format', () => {
    const prompt = service['composePrompt']('Base', { honesty: 50, paranoia: 10, friendliness: 20, base: { honesty: 40, paranoia: 20, friendliness: 10 } }, ['User: hi', 'Maeve: hello'], 'What did you see?');
    expect(prompt).toContain('Base');
    expect(prompt).toContain('Your personality traits (modified):');
    expect(prompt).toContain('Recent conversation:');
    expect(prompt).toContain('You just heard: "What did you see?"');
  });

  it('should return null if no memory exists', (done) => {
    service.getMemoryToken('npcX', 'playerX').subscribe(token => {
      expect(token).toBeNull();
      done();
    });
  });

  it('should return stored memory for npcId + playerId', (done) => {
    const token: MemoryToken = {
      npcId: 'npc1',
      playerId: 'player-001',
      summary: 'Test summary',
      timestamp: new Date().toISOString()
    };
    service.saveMemoryToken(token).subscribe(() => {
      service.getMemoryToken('npc1', 'player-001').subscribe(found => {
        expect(found).toBeTruthy();
        expect(found?.summary).toBe('Test summary');
        done();
      });
    });
  });

  it('should include memory in sendMessage LLM prompts', (done) => {
    const token: MemoryToken = {
      npcId: 'npc1',
      playerId: 'player-001',
      summary: 'Memory summary',
      timestamp: new Date().toISOString()
    };
    service.saveMemoryToken(token).subscribe(() => {
      const npc: any = { id: 'npc1', name: 'Maeve', personality: { honesty: 1, paranoia: 2, friendliness: 3 } };
      const spy = jest.spyOn(service['llmService'], 'send').mockReturnValue(of({ response: 'ok' }));
      service.interactWithNPC(npc, 'hello').subscribe(() => {
        const prompt = spy.mock.calls[0][0].prompt;
        expect(prompt).toContain('NPC Memory: Memory summary');
        done();
      });
    });
  });

  it('should update memory after response', (done) => {
    const npc: any = { id: 'npc1', name: 'Maeve', personality: { honesty: 1, paranoia: 2, friendliness: 3 } };
    jest.spyOn(service['llmService'], 'send').mockReturnValue(of({ response: 'NPC says hi' }));
    service.interactWithNPC(npc, 'player says hi').subscribe(() => {
      service.getMemoryToken('npc1', 'player-001').subscribe(token => {
        expect(token).toBeTruthy();
        expect(token?.summary).toContain('player says hi');
        expect(token?.summary).toContain('NPC says hi');
        done();
      });
    });
  });
    it('getMemoryToken uses default playerId when not provided', (done) => {
    const token: MemoryToken = {
      npcId: 'npc1',
      playerId: 'player-001',
      summary: 'Default player memory',
      timestamp: new Date().toISOString()
    };
    service.saveMemoryToken(token).subscribe(() => {
      // Call with only npcId, should use default playerId
      service.getMemoryToken('npc1').subscribe(found => {
        expect(found).toBeTruthy();
        expect(found?.summary).toBe('Default player memory');
        expect(found?.playerId).toBe('player-001');
        done();
      });
    });
  });
});

describe('MYS-58: NPC Dialogue Flow and Personality Adherence', () => {
  let service: NpcDialogueService;
  let promptBuilder: any;
  let llmService: any;

  beforeEach(() => {
    promptBuilder = {
      buildPrompt: jest.fn()
    };
    llmService = {
      send: jest.fn()
    };
    service = new NpcDialogueService(promptBuilder, llmService);
  });

  it('should inject memory and personality into the LLM prompt and return a sarcastic response', (done) => {
    // 1. Mock NPC profile and memory
    const npc = {
      id: 'npc-001',
      name: 'Jonas',
      personality: { honesty: 30, paranoia: 10, friendliness: 20, traits: ['sarcastic'] }
    } as any;
    const memoryToken: MemoryToken = {
      npcId: 'npc-001',
      playerId: 'player-001',
      summary: 'Player once lied about their identity.',
      timestamp: new Date().toISOString()
    };
    // 2. Mock prompt builder to include traits and memory
    promptBuilder.buildPrompt.mockReturnValue(
      "You are a sarcastic NPC named Jonas."
    );
    // 3. Save memory
    service.saveMemoryToken(memoryToken).subscribe(() => {
      // 4. Mock LLM response
      llmService.send.mockReturnValue(of({
        response: "Oh sure, like I trusted you the last time you fibbed, right? 😏"
      }));
      // 5. Simulate player message
      service.interactWithNPC(npc, "Can I trust you?").subscribe(resp => {
        // 6. Assert prompt includes memory and personality
        const prompt = llmService.send.mock.calls[0][0].prompt;
        expect(prompt).toContain('sarcastic');
        expect(prompt).toContain('Jonas');
        expect(prompt).toContain('NPC Memory: Player once lied about their identity.');
        expect(prompt).toContain('Can I trust you?');
        // 7. Assert response is sarcastic and injected
        expect(resp).toMatch(/fibbed|trusted/i);
        expect(service.getHistory('npc-001')).toContain('Jonas: Oh sure, like I trusted you the last time you fibbed, right? 😏');
        done();
      });
    });
  });

  it('should update memoryToken if LLM returns a new summary', (done) => {
    const npc = { id: 'npc-001', name: 'Jonas', personality: {} } as any;
    llmService.send.mockReturnValue(of({ response: 'New info.' }));
    service.interactWithNPC(npc, 'Reveal something').subscribe(() => {
      service.getMemoryToken('npc-001', 'player-001').subscribe(token => {
        expect(token).toBeTruthy();
        expect(token?.summary).toContain('Reveal something');
        expect(token?.summary).toContain('New info.');
        done();
      });
    });
  });

  it('should fallback to generic prompt if no memoryToken exists', (done) => {
    const npc = { id: 'npc-002', name: 'Ava', personality: { traits: ['friendly'] } } as any;
    promptBuilder.buildPrompt.mockReturnValue("You are a friendly NPC named Ava.");
    llmService.send.mockReturnValue(of({ response: 'Hello there!' }));
    service.interactWithNPC(npc, 'Hi!').subscribe(resp => {
      const prompt = llmService.send.mock.calls[0][0].prompt;
      expect(prompt).not.toContain('NPC Memory:');
      expect(prompt).toContain('friendly');
      expect(resp).toBe('Hello there!');
      done();
    });
  });

  it('should show compound personality traits in the prompt', (done) => {
    const npc = {
      id: 'npc-003',
      name: 'Mira',
      personality: { traits: ['grumpy', 'cryptic'] }
    } as any;
    promptBuilder.buildPrompt.mockReturnValue("You are a grumpy, cryptic NPC named Mira.");
    llmService.send.mockReturnValue(of({ response: '...Maybe. Or maybe not.' }));
    service.interactWithNPC(npc, 'What do you know?').subscribe(resp => {
      const prompt = llmService.send.mock.calls[0][0].prompt;
      expect(prompt).toContain('grumpy');
      expect(prompt).toContain('cryptic');
      expect(prompt).toContain('Mira');
      expect(resp).toMatch(/maybe/i);
      done();
    });
  });

  it('should not send or update anything if player message is empty or whitespace', (done) => {
    const npc = { id: 'npc-004', name: 'Null', personality: {} } as any;
    const spy = jest.spyOn(llmService, 'send');
    service.interactWithNPC(npc, '   ').subscribe(resp => {
      expect(spy).not.toHaveBeenCalled();
      expect(resp).toBe('');
      done();
    });
  });
});  
