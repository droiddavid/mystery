import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';

const STORAGE_KEY = 'mystery-game-state';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  saveGame(state: GameState): void {
    try {
      const data = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
      // Optionally log error
    }
  }

  loadGame(): GameState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as GameState;
    } catch (e) {
      return null;
    }
  }

  clearGame(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
