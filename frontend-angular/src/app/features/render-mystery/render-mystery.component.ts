import { EditableTimelineEvent } from './timeline-editable/timeline-editable.component';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mystery } from '../../models/mystery/mystery.model';
import { ClueListComponent } from './clue-list/clue-list.component';
import { CharacterListComponent } from './character-list/character-list.component';
import TimelineComponent from './timeline/timeline.component';
import { TimelineEditableComponent } from './timeline-editable/timeline-editable.component';

@Component({
  selector: 'app-render-mystery',
  standalone: true,
  imports: [CommonModule, ClueListComponent, CharacterListComponent, TimelineComponent, TimelineEditableComponent],
  templateUrl: './render-mystery.component.html',
  styleUrls: ['./render-mystery.component.scss']
})
export class RenderMysteryComponent {
  @Input() mystery!: Mystery;
  editMode = false; // Set this to true to enable editable timeline

  get editableTimeline(): EditableTimelineEvent[] {
    return (this.mystery?.timeline ?? []).map((e: any, i: number) => ({
      ...e,
      id: e.id ?? `${e.time}-${e.description}-${i}`,
      source: e.source ?? 'player',
      suspectedFalse: e.suspectedFalse ?? false,
      editable: e.editable ?? true,
    }));
  }
}
