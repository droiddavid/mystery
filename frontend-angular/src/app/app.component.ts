import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from './services/game-state.service';
import { GameStateStoreService } from './services/game-state-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private gameStateService: GameStateService,
    private gameStateStore: GameStateStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedState = this.gameStateService.loadGame();
    if (savedState) {
      this.gameStateStore.setCurrentState(savedState);
      // Navigate to the saved scene or main game view
      // Adjust route as needed for your app structure
      this.router.navigate([`/mystery/${savedState.mysteryId}/scene/${savedState.currentSceneId}`]);
    } else {
      // No saved state: go to start or tutorial
      this.router.navigate(['/start']);
    }
  }
}
