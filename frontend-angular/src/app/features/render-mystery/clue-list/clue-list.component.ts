import { Component, Input } from '@angular/core';
import { Clue } from '../../../models/clue.model';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clue-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clue-list.component.html',
  styleUrls: ['./clue-list.component.scss']
})
export class ClueListComponent {
  @Input() clues: Clue[] = [];
}
