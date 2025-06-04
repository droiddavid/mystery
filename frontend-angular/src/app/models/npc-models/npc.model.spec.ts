import { NPC } from './npc.model';
import { NPCPersonality } from './npc-personality.model';
import { NPCKnowledge } from './npc-knowledge.model';
import { NPCDialogueRules } from './npc-dialogue-rules.model';

describe('NPC Model', () => {
  it('should match the expected NPC shape', () => {
    const personality: NPCPersonality = {
      honesty: 50,
      paranoia: 10,
      friendliness: 80,
      curiosity: 70,
      traits: ['sarcastic', 'friendly']
    };
    const knowledge: NPCKnowledge = {
      secrets: ['Has a hidden key'],
      facts: ['Knows the mayor'],
      rumors: ['Seen at the docks'],
      relationships: {}
    };
    const dialogueRules: NPCDialogueRules = {
      greeting: 'Hello, stranger!',
      farewell: 'Goodbye!',
      topics: ['weather', 'gossip'],
      triggerWords: [],
      forbiddenTopics: [],
      tone: 'neutral',
      shouldRespond: () => true
    };
    const npc: NPC = {
      id: 'npc-001',
      name: 'Jonas',
      role: 'Bartender',
      personality,
      knowledge,
      dialogueRules
    };
    expect(npc.id).toBe('npc-001');
    expect(npc.personality.traits).toContain('sarcastic');
    expect(npc.knowledge.secrets[0]).toBe('Has a hidden key');
    expect(npc.dialogueRules.greeting).toBe('Hello, stranger!');
  });

  it('should serialize and deserialize an NPC object correctly', () => {
    const npc: NPC = {
      id: 'npc-002',
      name: 'Ava',
      role: 'Detective',
      personality: { honesty: 90, paranoia: 20, friendliness: 60, curiosity: 50, traits: [] },
      knowledge: { secrets: [], facts: ['Investigating the case'], rumors: [], relationships: {} },
      dialogueRules: { greeting: 'Detective Ava here.', farewell: 'Stay safe.', topics: ['case', 'suspects'], triggerWords: [], forbiddenTopics: [], tone: 'neutral', shouldRespond: () => true }
    };
    const json = JSON.stringify(npc);
    const parsed = JSON.parse(json) as NPC;
    expect(parsed.name).toBe('Ava');
    expect(parsed.personality.honesty).toBe(90);
    expect(parsed.dialogueRules.topics).toContain('case');
  });
});
