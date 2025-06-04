import { NpcPromptBuilderService } from './npc-prompt-builder.service';

describe('NpcPromptBuilderService', () => {
  let service: NpcPromptBuilderService;

  beforeEach(() => {
    service = new NpcPromptBuilderService();
  });

  it('should build a prompt string with all sections', () => {
    const npc: any = {
      id: 'npc1',
      name: 'Maeve',
      role: 'Gallery Assistant',
      personality: { friendliness: 30, paranoia: 20, curiosity: 50, honesty: 40 },
      knowledge: {
        facts: ['Saw Layla leave at 8pm'],
        secrets: ['Has a duplicate key'],
        relationships: { Layla: 'friend', Amos: 'distrust' }
      },
      dialogueRules: {
        triggerWords: ['painting', 'key'],
        forbiddenTopics: ['theft'],
        tone: 'cautious'
      }
    };
    const prompt = service.buildPrompt(npc);
    expect(prompt).toContain('You are Maeve, a Gallery Assistant');
    expect(prompt).toContain('Your personality traits:');
    expect(prompt).toContain('- Friendliness: 30');
    expect(prompt).toContain('- Paranoia: 20');
    expect(prompt).toContain('- Curiosity: 50');
    expect(prompt).toContain('- Honesty: 40');
    expect(prompt).toContain('Your dialogue rules:');
    expect(prompt).toContain('Trigger words: painting, key');
    expect(prompt).toContain('Forbidden topics: theft');
    expect(prompt).toContain('Tone: cautious');
    expect(prompt).toContain('Do not reveal secrets');
    expect(prompt).toContain('Avoid forbidden topics entirely.');
    expect(prompt).toContain('Respond only when trigger words are present.');
  });

  it('should handle missing/empty fields gracefully', () => {
    const npc: any = {
      id: 'npc2',
      name: 'Bob',
      role: 'Guard',
      personality: {},
      knowledge: { facts: [], secrets: [], relationships: {} },
      dialogueRules: { triggerWords: [], forbiddenTopics: [], tone: '' }
    };
    const prompt = service.buildPrompt(npc);
    expect(prompt).toContain('You are Bob, a Guard');
    expect(prompt).toContain('None');
  });
});
