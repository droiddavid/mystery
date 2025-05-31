import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineEditableComponent, EditableTimelineEvent } from './timeline-editable.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TimelineEditableComponent', () => {
  let component: TimelineEditableComponent;
  let fixture: ComponentFixture<TimelineEditableComponent>;
  let testEvents: EditableTimelineEvent[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineEditableComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineEditableComponent);
    component = fixture.componentInstance;
    testEvents = [
      {
        id: '1',
        time: '10:00',
        description: 'Event 1',
        involvedCharacters: ['A'],
        source: 'ai',
        suspectedFalse: false,
        editable: true
      },
      {
        id: '2',
        time: '11:00',
        description: 'Event 2',
        involvedCharacters: ['B'],
        source: 'player',
        suspectedFalse: false,
        editable: true
      }
    ];
    component.editableEvents = testEvents.map(e => ({ ...e, involvedCharacters: [...e.involvedCharacters] }));
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should initialize originalOrder on ngOnInit', () => {
    expect(component.originalOrder).toEqual([
      expect.objectContaining(testEvents[0]),
      expect.objectContaining(testEvents[1])
    ]);
  });

  it('should add an event with addEvent()', () => {
    const initialLength = component.editableEvents.length;
    component.addEvent();
    expect(component.editableEvents.length).toBe(initialLength + 1);
    const newEvent = component.editableEvents[component.editableEvents.length - 1];
    expect(newEvent.source).toBe('player');
    expect(newEvent.editable).toBe(true);
    expect(newEvent.description).toBe('');
  });

  it('should remove an event with removeEvent()', () => {
    const initialLength = component.editableEvents.length;
    component.removeEvent(0);
    expect(component.editableEvents.length).toBe(initialLength - 1);
    expect(component.editableEvents[0].id).toBe('2');
  });

  it('should reset order with resetOrder()', () => {
    // Change order
    component.editableEvents.reverse();
    expect(component.editableEvents[0].id).toBe('2');
    component.resetOrder();
    expect(component.editableEvents[0].id).toBe('1');
    expect(component.editableEvents[1].id).toBe('2');
  });

  it('should emit updated event with emitUpdate()', () => {
    jest.spyOn(component.updated, 'emit');
    component.emitUpdate();
    expect(component.updated.emit).toHaveBeenCalledWith(component.editableEvents);
  });

  it('should move items in drop()', () => {
    jest.spyOn(component, 'emitUpdate');
    // Simulate drag from index 0 to 1
    const event = {
      previousIndex: 0,
      currentIndex: 1,
      item: null as any,
      container: null as any,
      previousContainer: null as any,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 },
      // Add the missing properties to satisfy the type
      dropPoint: { x: 0, y: 0 },
      event: {} as any,
    } as import('@angular/cdk/drag-drop').CdkDragDrop<EditableTimelineEvent[]>;
    component.drop(event);
    expect(component.editableEvents[0].id).toBe('2');
    expect(component.editableEvents[1].id).toBe('1');
    expect(component.emitUpdate).toHaveBeenCalled();
  });
});
