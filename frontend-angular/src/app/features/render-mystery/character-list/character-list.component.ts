import { Component, Input } from '@angular/core';
import { Character } from '../../../models/character.model';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent {
  @Input() characters: Character[] = [];
}
