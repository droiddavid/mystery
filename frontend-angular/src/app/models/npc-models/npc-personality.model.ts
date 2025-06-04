// Add traits property for test compatibility
export interface NPCPersonality {
  honesty: number;
  paranoia: number;
  friendliness: number;
  traits: string[];
}
// Represents the personality traits of an NPC
export interface NPCPersonality {
  /** Hostility (-100) to friendliness (100) */
  friendliness: number;
  /** Level of paranoia (0-100) */
  paranoia: number;
  /** Level of curiosity (0-100) */
  curiosity: number;
  /** Level of honesty (0-100) */
  honesty: number;
}
