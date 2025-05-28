import { FooterComponent } from '../footer/footer.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { Component } from '@angular/core';
import { Mystery } from '../../models/mystery.model';
import { MysteryService } from '../../services/mystery.service';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterOutlet, LeftSidebarComponent, RightSidebarComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  title = 'solve-the-mystery';
  baseUrl: any;

  botPromptText = '';

  showLeftSidebar = true;
  showRightSidebar = true;


  constructor(private mysteryService: MysteryService, private http: HttpClient) {
    
  }

  onToggleLeftSidebar() {
  this.showLeftSidebar = !this.showLeftSidebar;
  }

  onToggleRightSidebar() {
  this.showRightSidebar = !this.showRightSidebar;
  }

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
