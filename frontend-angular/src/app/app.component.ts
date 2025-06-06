import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from './services/game-state.service';
import { GameStateStoreService } from './services/game-state-store.service';
import { Mystery } from './models/mystery/mystery.model';
import { HttpClient } from '@angular/common/http';
import { MysteryService } from './services/mystery.service';
import { HeaderComponent } from './site-layout/header/header.component';
import { FooterComponent } from './site-layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'solve-the-mystery';
  baseUrl: any;

  botPromptText = '';

  showLeftSidebar = true;
  showRightSidebar = true;

  constructor(
    private gameStateService: GameStateService,
    private gameStateStore: GameStateStoreService,
    private router: Router,private mysteryService: MysteryService, private http: HttpClient
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
      // this.router.navigate(['/start']);
    }
  }

  // onToggleLeftSidebar() {
  // this.showLeftSidebar = !this.showLeftSidebar;
  // }

  // onToggleRightSidebar() {
  // this.showRightSidebar = !this.showRightSidebar;
  // }

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
