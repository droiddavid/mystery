import { GameState, NPCState } from './game-state.model';
import { MemoryToken } from '../../services/npc-dialogue.service';

describe('GameState Model', () => {
  it('should match the expected GameState shape', () => {
    const npcState: NPCState = {
      lastInteraction: '2025-06-02T12:00:00Z',
      memoryToken: {
        npcId: 'npc-1',
        playerId: 'player-1',
        summary: 'Met at the tavern',
        timestamp: '2025-06-02T12:00:00Z'
      },
      relationshipScore: 42
    };
    const state: GameState = {
      playerId: 'player-1',
      mysteryId: 'mystery-42',
      currentSceneId: 'scene-3',
      npcStates: { 'npc-1': npcState },
      inventory: ['key', 'map'],
      discoveredClues: ['clue-1', 'clue-2'],
      visitedLocations: ['scene-1', 'scene-2', 'scene-3'],
      choicesMade: { 'intro': 'talked', 'door': 'opened' },
      timestamp: '2025-06-02T12:05:00Z'
    };
    expect(state.npcStates['npc-1'].lastInteraction).toBe('2025-06-02T12:00:00Z');
    expect(state.inventory).toContain('key');
    expect(state.choicesMade['door']).toBe('opened');
  });

  it('should serialize and deserialize a GameState object correctly', () => {
    const state: GameState = {
      playerId: 'p2',
      mysteryId: 'm2',
      currentSceneId: 's1',
      npcStates: {},
      inventory: [],
      discoveredClues: [],
      visitedLocations: [],
      choicesMade: {},
      timestamp: new Date().toISOString()
    };
    const json = JSON.stringify(state);
    const parsed = JSON.parse(json) as GameState;
    expect(parsed.playerId).toBe('p2');
    expect(parsed.npcStates).toEqual({});
    expect(parsed.timestamp).toBe(state.timestamp);
  });
});
