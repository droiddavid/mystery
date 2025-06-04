import { GameStateStoreService } from './game-state-store.service';
import { GameState } from '../models/game-state.model';

describe('GameStateStoreService', () => {
  let service: GameStateStoreService;
  beforeEach(() => {
    service = new GameStateStoreService();
  });

  it('should set and get the current state', () => {
    const mockState: GameState = {
      playerId: 'p1',
      mysteryId: 'm1',
      currentSceneId: 'scene1',
      npcStates: {},
      inventory: [],
      discoveredClues: [],
      visitedLocations: [],
      choicesMade: {},
      timestamp: new Date().toISOString()
    };
    service.setCurrentState(mockState);
    expect(service.getCurrentState()).toEqual(mockState);
  });

  it('should return null if no state is set', () => {
    expect(service.getCurrentState()).toBeNull();
  });
});
