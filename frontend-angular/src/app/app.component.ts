import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MysteryService } from './services/mystery.service';
import { Mystery } from './models/mystery.model';
import { HttpClient } from '@angular/common/http';
import { BotPromptComponent } from './features/bot-prompt/bot-prompt.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BotPromptComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'solve-the-mystery';
  baseUrl: any;

  botPromptText = '';


  constructor(private mysteryService: MysteryService, private http: HttpClient) {
    
  }

  // ngOnInit() {
  //   // This generates a mystery object
  //   // this.generate();
  // }

//   generate(): void {
//     const exampleMystery: Mystery = {
//       title: 'The Shadow in the Pew',
//       summary: 'A priceless artifact has gone missing...',
//       setting: {
//         name: 'Quiet town church',
//         description: 'A small, peaceful church in a rural town.',
//         locationType: 'town',
//       },
//       difficulty: 'Beginner',
//       solution:  {
//         suspect: '',
//         method: '',
//         motive: 'A jealous altar boy took the artifact to impress his peers.',
//         reveal: '',
//         discoveredBy: ''
//       },
//       characters: [
//         {
//           name: 'Reverend Amos',
//           role: 'witness',
//           personality: 'solemn and careful',
//           knowledge: 'Saw someone late at night',
//           secrets: [],
//           connections: ['Altar Boy'],
//           motive: 'None',
//           alibi: 'Was in his quarters at the time'
//         }
//       ],
//       clues: [
//         {
//           id: 'c1',
//           description: 'Shattered glass behind the altar',
//           foundAt: 'Sanctuary',
//           reveals: 'Someone broke in',

//           location: 'Sanctuary',
//           discoveredBy: 'Reverend Amos',
//           relevance: 'high'
//         }
//       ],
//       timeline: [
//         {
//           time: '10 PM',
//           description: 'Reverend hears a noise in the sanctuary',
//           involvedCharacters: ['Reverend Amos']
//         }
//       ],
//       locations: [
//         {
//           locationName: 'Sanctuary',
//           description: 'Main area of the church with pews and altar',
//           relevantClues: ['c1'],
//           type: '',
//           LocationDetails: {
//             ambience: 'quiet',
//             lighting: 'dim'
//           }
//         }

//  ]
//     };

//     this.mysteryService.createMystery(exampleMystery).subscribe({
//       next: (response) => {
//         // console.log('Mystery created successfully:', response);
//       },
//       error: (err) => {
//         console.error('Failed to create mystery:', err);
//       }
//     });
//   }

  createMystery(): void {

    const mystery: Mystery = {
      title: 'The Shadow in the Pew',
      summary: 'A priceless artifact has gone missing...',
      setting: {
        name: 'Quiet town church',
        description: 'A peaceful rural church that’s become the scene of mystery.',
        locationType: 'Indoor'
      },
      difficulty: 'Beginner',
      solution: {
        suspect: 'Altar Boy',
        method: 'Theft',
        motive: 'Impress peers',
        reveal: 'The altar boy confesses after being shown security footage.',
        discoveredBy: 'Reverend Amos'
      },
      characters: [
        {
          name: 'Reverend Amos',
          role: 'witness',
          personality: 'solemn and careful',
          knowledge: 'Saw someone late at night',
          secrets: [],
          connections: ['Altar Boy'],
          motive: 'None',
          alibi: {
            location: 'His quarters',
            verifiedBy: 'None',
            time: 'Was in his quarters at the time'
          }
        }
      ],
      clues: [
        {
          id: 'c1',
          description: 'Shattered glass behind the altar',
          foundAt: 'Sanctuary',
          discoveredBy: 'Reverend Amos',
          relevance: 'Proof of forced entry',
          location: 'Sanctuary',
          reveals: 'Someone broke in',
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
          locationName: 'Sanctuary',
          type: 'Indoor',
          LocationDetails: {
            ambience: 'quiet',
            lighting: 'dim'
          },
          description: 'Main area of the church with pews and altar',
          relevantClues: ['c1']
        }
      ]
    };
    
  
    this.mysteryService.createMystery(mystery).subscribe({
      next: (res: any) => console.log('Mystery submitted:', res),
      error: (err: any) => console.error('Error:', err)
    });
  }

  onUserSubmit() {
    // Just triggers refresh of bot-prompt
    console.log('User submitted:', this.botPromptText);
  }
  
}
