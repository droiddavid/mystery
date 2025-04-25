import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MysteryService } from './services/shared.service';
import { Mystery } from './models/mystery.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'solve-the-mystery';
  baseUrl: any;

  constructor(private mysteryService: MysteryService, private http: HttpClient) {
    
  }

  ngOnInit() {
    this.generate();
  }

  generate(): void {
    const exampleMystery: Mystery = {
      title: 'The Shadow in the Pew',
      summary: 'A priceless artifact has gone missing...',
      setting: 'Quiet town church',
      difficulty: 'Beginner',
      solution: 'A jealous altar boy took the artifact to impress his peers.',
      characters: [
        {
          name: 'Reverend Amos',
          role: 'witness',
          personality: 'solemn and careful',
          knowledge: 'Saw someone late at night',
          secrets: [],
          connections: ['Altar Boy']
        }
      ],
      clues: [
        {
          id: 'c1',
          description: 'Shattered glass behind the altar',
          foundAt: 'Sanctuary',
          reveals: 'Someone broke in'
        }
      ],
      timeline: [
        {
          time: '10 PM',
          description: 'Reverend hears a noise in the sanctuary',
          involvedCharacters: ['Reverend Amos']
        }
      ],
      locations: [
        {
          name: 'Sanctuary',
          description: 'Main area of the church with pews and altar',
          relevantClues: ['c1']
        }
      ]
    };

    this.mysteryService.createMystery(exampleMystery).subscribe({
      next: (response) => {
        console.log('Mystery created successfully:', response);
      },
      error: (err) => {
        console.error('Failed to create mystery:', err);
      }
    });
  }

  createMystery(): void {
    const mystery: Mystery = {
      title: 'The Vanishing Bell',
      summary: 'A church bell went missing in the dead of night.',
      setting: 'Hillside Chapel',
      difficulty: 'Beginner',
      solution: 'A prank by the youth group',
      characters: [],
      clues: [],
      timeline: [],
      locations: []
    };
  
    this.mysteryService.createMystery(mystery).subscribe({
      next: (res: any) => console.log('Mystery submitted:', res),
      error: (err: any) => console.error('Error:', err)
    });
  }
  
}
