
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { GameStateStoreService } from '../../services/game-state-store.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() leftSidebarOpen: boolean = true;
  @Input() rightSidebarOpen: boolean = true;

  @Output() toggleLeftSidebar = new EventEmitter<void>();
  @Output() toggleRightSidebar = new EventEmitter<void>();

  saveMessage: string | null = null;

  constructor(
    private gameStateService: GameStateService,
    private gameStateStore: GameStateStoreService
  ) {}

  toggleLeft() {
    this.toggleLeftSidebar.emit();
  }

  toggleRight() {
    this.toggleRightSidebar.emit();
  }

  onSaveGame() {
    const state = this.gameStateStore.getCurrentState();
    if (state) {
      state.timestamp = new Date().toISOString();
      this.gameStateService.saveGame(state);
      this.saveMessage = 'Game saved successfully';
      setTimeout(() => (this.saveMessage = null), 2000);
      console.log('Game saved successfully');
    } else {
      this.saveMessage = 'No game state to save!';
      setTimeout(() => (this.saveMessage = null), 2000);
      console.warn('No game state to save!');
    }
  }
}
