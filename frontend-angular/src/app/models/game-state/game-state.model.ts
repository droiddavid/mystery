import { MemoryToken } from '../../services/npc-dialogue.service';

// Helper interface for per-NPC state
export interface NPCState {
  lastInteraction: string; // ISO timestamp of last dialogue
  memoryToken?: MemoryToken; // Optional: memory of prior chats
  relationshipScore?: number; // Optional: friendliness or affinity score
}

// Serializable interface for overall game state
export interface GameState {
  playerId: string; // Identifier for current player session
  mysteryId: string; // Active mystery being played
  currentSceneId: string; // Scene the player is currently in
  npcStates: Record<string, NPCState>; // Track per-NPC interactions
  inventory: string[]; // List of item IDs or labels
  discoveredClues: string[]; // List of found clue identifiers
  visitedLocations: string[]; // History of scene/location IDs visited
  choicesMade: Record<string, string>; // Player decisions keyed by action/event
  timestamp: string; // Last save or checkpoint time
}
