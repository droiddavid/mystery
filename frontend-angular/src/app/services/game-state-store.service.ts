import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';

@Injectable({ providedIn: 'root' })
export class GameStateStoreService {
  private currentState: GameState | null = null;

  setCurrentState(state: GameState) {
    this.currentState = state;
  }

  getCurrentState(): GameState | null {
    return this.currentState;
  }
}
