// Add rumors property for test compatibility
export interface NPCKnowledge {
  secrets: string[];
  facts: string[];
  rumors: string[];
}
// Represents what an NPC knows
export interface NPCKnowledge {
  /** List of known facts */
  facts: string[];
  /** List of secrets (private knowledge) */
  secrets: string[];
  /** Relationships to other characters (characterId: relationship label) */
  relationships: Record<string, string>;
}
