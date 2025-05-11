import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MysteryService } from '../../services/mystery.service';
import { Mystery } from '../../models/mystery.model';
import { MysteryInput } from '../../models/mysteryInput.model';

@Component({
    selector: 'app-create-mystery',
    imports: [CommonModule],
    templateUrl: './create-mystery.component.html',
    styleUrl: './create-mystery.component.scss'
})
export class CreateMysteryComponent {

  mystery?: Mystery;

  constructor(private mysteryService: MysteryService) { }

  generateMystery(): void {
    const input: MysteryInput = {
      theme: 'Buried Secrets',
      setting: {
        name: 'Churchyard in Georgia',
        description: 'A quiet churchyard with a history of buried secrets. The church is old, with a graveyard that has seen many generations. The atmosphere is eerie, especially at night.',
        locationType: 'Churchyard'
      },
      characters: ['Chartaker', 'Priest', 'Choir Member'],
      difficulty: 'Intermediate'
    };

    this.mysteryService.generateMystery(input).subscribe({
      next: (data) => {
        // console.log('Generated Mystery:', data);
        this.mystery = data;
      },
      error: (err) => {
        console.error('Error generating mystery:', err);
      }
    });
  }
}
