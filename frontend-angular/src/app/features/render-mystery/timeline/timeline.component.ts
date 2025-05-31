import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from '../../../models/timeline-event.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export default class TimelineComponent {
  @Input() events: TimelineEvent[] = [];
  @Input() label?: string;
}
