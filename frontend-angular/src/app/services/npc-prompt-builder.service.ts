import { Injectable } from '@angular/core';
import { NPC } from '../models/npc-models/npc.model';

@Injectable({ providedIn: 'root' })
export class NpcPromptBuilderService {
  /**
   * Builds a structured prompt string for an NPC, suitable for LLM input.
   * @param npc The NPC object
   * @returns Formatted prompt string
   */
  buildPrompt(npc: NPC): string {
    const { id, name, role, personality, knowledge, dialogueRules } = npc;

    // Format personality traits
    const personalitySection = [
      '- Friendliness: ' + personality.friendliness,
      '- Paranoia: ' + personality.paranoia,
      '- Curiosity: ' + personality.curiosity,
      '- Honesty: ' + personality.honesty
    ].join('\n');

    // Format knowledge
    const facts = knowledge.facts.join('; ');
    const secrets = knowledge.secrets.join('; ');
    const relationships = Object.entries(knowledge.relationships)
      .map(([character, label]) => `${character}: ${label}`)
      .join('; ');

    // Format dialogue rules
    const triggerWords = dialogueRules.triggerWords.join(', ');
    const forbiddenTopics = dialogueRules.forbiddenTopics.join(', ');
    const tone = dialogueRules.tone;

    // Build the prompt
    return [
      `You are ${name}, a ${role} in a mystery game.`,
      '',
      'Your personality traits:',
      personalitySection,
      '',
      'You know the following:',
      `- Facts: ${facts || 'None'}`,
      `- Secrets: ${secrets || 'None'}`,
      `- Relationships: ${relationships || 'None'}`,
      '',
      'Your dialogue rules:',
      `- Trigger words: ${triggerWords || 'None'}`,
      `- Forbidden topics: ${forbiddenTopics || 'None'}`,
      `- Tone: ${tone}`,
      '',
      'Do not reveal secrets unless heavily persuaded and your honesty is high.',
      'Avoid forbidden topics entirely.',
      'Respond only when trigger words are present.'
    ].join('\n');
  }
}
