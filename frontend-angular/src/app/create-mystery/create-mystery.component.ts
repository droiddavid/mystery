import { Component } from '@angular/core';
import { Mystery } from '../models/mystery.model';
import { MysteryService } from '../services/mystery.service';
import { MysteryInput } from '../models/mystery-input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-mystery',
  standalone: true,
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
      setting: 'Churchyard in Georgia',
      characters: ['Chartaker', 'Priest', 'Choir Member'],
      difficulty: 'Intermediate'
    };

    this.mysteryService.generateMystery(input).subscribe({
      next: (data) => {
        console.log('Generated Mystery:', data);
        this.mystery = data;
      },
      error: (err) => {
        console.error('Error generating mystery:', err);
      }
    });
  }
}
