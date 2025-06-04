import { NPCPersonality } from './npc-personality.model';
import { NPCKnowledge } from './npc-knowledge.model';
import { NPCDialogueRules } from './npc-dialogue-rules.model';

// Represents a non-player character (NPC)
export interface NPC {
  /** Unique identifier for the NPC */
  id: string;
  /** Display name of the NPC */
  name: string;
  /** Role or occupation of the NPC */
  role: string;
  /** Personality traits */
  personality: NPCPersonality;
  /** Knowledge and secrets */
  knowledge: NPCKnowledge;
  /** Dialogue rules and behavior */
  dialogueRules: NPCDialogueRules;
}
