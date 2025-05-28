import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mystery } from '../../models/mystery.model';

@Component({
  selector: 'app-mystery-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mystery-result.component.html',
  styleUrls: ['./mystery-result.component.scss']
})
export class MysteryResultComponent {
  @Input() mystery!: Mystery;
}
