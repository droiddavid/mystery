import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MysteryService } from '../../services/mystery.service';
import { GameStateService } from '../../services/game-state.service';
import { GameState } from '../../models/game-state.model';
import { Mystery } from '../../models/mystery/mystery.model';
import { MysteryInput } from '../../models/mystery/mysteryInput.model';

@Component({
    selector: 'app-create-mystery',
    imports: [CommonModule],
    templateUrl: './create-mystery.component.html',
    styleUrl: './create-mystery.component.scss'
})
export class CreateMysteryComponent {

  mystery?: Mystery;

  constructor(
    private mysteryService: MysteryService,
    private gameStateService: GameStateService
  ) { }

  generateMystery(): void {
    const input: MysteryInput = {
      playerName: 'Chartaker',
      mysteryType: 'Buried Secrets',
      mood: 'eerie',
      setting: {
        name: 'Churchyard in Georgia',
        description: 'A quiet churchyard with a history of buried secrets. The church is old, with a graveyard that has seen many generations. The atmosphere is eerie, especially at night.',
        locationType: 'Churchyard'
      }
    };

    this.mysteryService.generateMystery(input).subscribe({
      next: (data) => {
        // console.log('Generated Mystery:', data);
        this.mystery = data;
        // --- MYS-61: Save game after generating a new mystery ---
        // TODO: Replace with actual updated GameState from your app state
        const updatedGameState: GameState = {} as any;
        this.gameStateService.saveGame(updatedGameState);
      },
      error: (err) => {
        console.error('Error generating mystery:', err);
      }
    });
  }
}
