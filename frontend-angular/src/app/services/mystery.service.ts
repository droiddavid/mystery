import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mystery } from '../models/mystery/mystery.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MysteryInput } from '../models/mystery/mysteryInput.model';

@Injectable({
  providedIn: 'root'
})
export class MysteryService {
  baseUrl: any = "/api/mystery";

  constructor(
    private http: HttpClient
  ) { }
  
  createMystery(mystery: Mystery): Observable<Mystery> {
    return this.http.post<Mystery>(`${this.baseUrl}/create`, mystery);
  }

  generateMystery(input: MysteryInput): Observable<Mystery> {
    return this.http.post<Mystery>(this.baseUrl + '/generate', input).pipe(
      // Enrich the returned Mystery object with default clues and timeline if needed

      map((mystery: Mystery) => {
        // Use settingName throughout
        const settingName = mystery.setting?.name || 'the scene';

        // Add default clues if missing or empty
        if (!mystery.clues || mystery.clues.length < 2) {
          const clues = [
            {
              id: 'c-default1',
              description: `A shattered lamp near ${settingName}`,
              foundAt: settingName,
              discoveredBy: mystery.characters?.[0]?.name || 'Caretaker',
              relevance: 'Suggests struggle or cover-up',
              location: settingName,
              reveals: 'The intruder might have panicked'
            },
            {
              id: 'c-default2',
              description: `A torn piece of fabric caught on a fence at ${settingName}`,
              foundAt: settingName,
              discoveredBy: mystery.characters?.[1]?.name || 'Priest',
              relevance: 'Could belong to the suspect',
              location: settingName,
              reveals: 'The suspect may have fled in a hurry'
            }
          ];
          mystery.clues = clues;
        }

        // Add default timeline if missing or empty
        if (!mystery.timeline || mystery.timeline.length < 1) {
          mystery.timeline = [
            {
              time: '11:00 PM',
              description: `Witness reports seeing a figure near the back entrance of ${settingName}`,
              involvedCharacters: [mystery.characters?.[0]?.name || 'Caretaker']
            },
            {
              time: '11:15 PM',
              description: `A loud crash was heard in ${settingName}`,
              involvedCharacters: [mystery.characters?.[1]?.name || 'Priest']
            }
          ];
        }

        // Optionally auto-fill solution if not present
        if (!mystery.solution) {
          mystery.solution = {
            suspect: mystery.characters?.[0]?.name || 'Caretaker',
            method: 'Unknown',
            motive: 'Unknown',
            reveal: 'The truth is revealed at dawn',
            discoveredBy: ''
          };
        }

        return mystery;
      })
    );
  }
}
