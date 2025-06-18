import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mystery-card',
  imports: [
    CommonModule
  ],
  templateUrl: './mystery-card.component.html',
  styleUrls: ['./mystery-card.component.scss'],
})
export class MysteryCardComponent {
  /** Accepts a mystery object from the home-page's mysteries array. */
  @Input() mystery!: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    cardBackImage: string;
    theme: string;
    difficulty: number;
    duration: string;
    players: string;
  };

  flipped = false;

  onCardClick(event: MouseEvent) {
    // Prevent flipping if the Start Mission button was clicked
    if ((event.target as HTMLElement).closest('.start-btn')) return;
    this.flipped = !this.flipped;
  }

  /**
   * Returns a CSS-friendly class name for the theme (lowercase, spaces to dashes)
   */
  get themeClass(): string {
    return this.mystery?.theme ? this.mystery.theme.toLowerCase().split(' ').join('-') : '';
  }

  get difficultyLabel(): string {
    if (!this.mystery) return '';
    if (this.mystery.difficulty >= 4) return 'Hard';
    if (this.mystery.difficulty === 3 || this.mystery.difficulty === 2) return 'Intermediate';
    return 'Easy';
  }
}

