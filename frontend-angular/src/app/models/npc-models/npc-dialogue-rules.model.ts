// Add greeting property for test compatibility
export interface NPCDialogueRules {
  greeting: string;
  farewell: string;
  topics: string[];
}
// Rules governing NPC dialogue behavior
export interface NPCDialogueRules {
  /** Words that trigger special responses */
  triggerWords: string[];
  /** Topics the NPC will not discuss */
  forbiddenTopics: string[];
  /** General tone of speech */
  tone: 'formal' | 'casual' | 'sarcastic' | 'nervous' | 'neutral';
  /** Determines if the NPC should respond to input */
  shouldRespond: (input: string, context: any) => boolean;
}
