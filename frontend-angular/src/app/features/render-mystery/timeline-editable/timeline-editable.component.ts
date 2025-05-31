import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

export interface EditableTimelineEvent {
  id: string;
  time: string;
  description: string;
  involvedCharacters: string[];
  source: 'ai' | 'player';
  suspectedFalse?: boolean;
  editable?: boolean;
}

@Component({
  selector: 'app-timeline-editable',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './timeline-editable.component.html',
  styleUrls: ['./timeline-editable.component.scss']
})
export class TimelineEditableComponent {
  @Input() editableEvents: EditableTimelineEvent[] = [];
  @Input() readonlyMode = false;
  @Output() updated = new EventEmitter<EditableTimelineEvent[]>();

  originalOrder: EditableTimelineEvent[] = [];

  ngOnInit() {
    this.originalOrder = this.editableEvents.map(e => ({ ...e, involvedCharacters: [...e.involvedCharacters] }));
  }

  drop(event: CdkDragDrop<EditableTimelineEvent[]>) {
    moveItemInArray(this.editableEvents, event.previousIndex, event.currentIndex);
    this.emitUpdate();
  }

  addEvent() {
    this.editableEvents.push({
      id: Math.random().toString(36).slice(2),
      time: '',
      description: '',
      involvedCharacters: [],
      source: 'player',
      suspectedFalse: false,
      editable: true
    });
    this.emitUpdate();
  }

  removeEvent(idx: number) {
    this.editableEvents.splice(idx, 1);
    this.emitUpdate();
  }

  resetOrder() {
    // Instead of reassigning the array (which breaks Angular's change detection for @Input), mutate the array in place
    this.editableEvents.splice(0, this.editableEvents.length, ...this.originalOrder.map(e => ({ ...e, involvedCharacters: [...e.involvedCharacters] })));
    this.emitUpdate();
  }

  emitUpdate() {
    this.updated.emit(this.editableEvents);
  }
}
