import { GameStateService } from './game-state.service';
import { GameState } from '../models/game-state.model';

describe('GameStateService', () => {
  let service: GameStateService;
  const STORAGE_KEY = 'mystery-game-state';
  const sampleState: GameState = {
    playerId: 'p1',
    mysteryId: 'm1',
    currentSceneId: 'scene-1',
    npcStates: {},
    inventory: ['item1'],
    discoveredClues: ['clue1'],
    visitedLocations: ['scene-1'],
    choicesMade: { intro: 'yes' },
    timestamp: '2025-06-02T12:00:00Z'
  };

  beforeEach(() => {
    service = new GameStateService();
    localStorage.clear();
  });

  it('should save game state as stringified JSON', () => {
    service.saveGame(sampleState);
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBe(JSON.stringify(sampleState));
  });

  it('should load and reconstruct a GameState object', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState));
    const loaded = service.loadGame();
    expect(loaded).toEqual(sampleState);
  });

  it('should return null if no data exists', () => {
    localStorage.removeItem(STORAGE_KEY);
    expect(service.loadGame()).toBeNull();
  });

  it('should clear the saved game state', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState));
    service.clearGame();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('should return null if stored data is malformed', () => {
    localStorage.setItem(STORAGE_KEY, '{bad json');
    expect(service.loadGame()).toBeNull();
  });
});
