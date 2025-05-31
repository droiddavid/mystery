import { ComponentFixture, TestBed } from '@angular/core/testing';
import TimelineComponent from './timeline.component';
import { TimelineEvent } from '../../../models/timeline-event.model';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  const mockEvents: TimelineEvent[] = [
    {
      time: '10:00 PM',
      description: 'A scream was heard near the marsh.',
      involvedCharacters: ['Caretaker', 'Stranger']
    },
    {
      time: '10:15 PM',
      description: 'Police arrived at the scene.',
      involvedCharacters: []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all timeline events', () => {
    component.events = mockEvents;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const eventEls = compiled.querySelectorAll('[data-testid="timeline-event"]');
    expect(eventEls.length).toBe(2);
    expect(compiled.textContent).toContain('10:00 PM');
    expect(compiled.textContent).toContain('A scream was heard near the marsh.');
    expect(compiled.textContent).toContain('Caretaker, Stranger');
    expect(compiled.textContent).toContain('10:15 PM');
    expect(compiled.textContent).toContain('Police arrived at the scene.');
  });

  it('should show involved characters only if present', () => {
    component.events = [mockEvents[1]];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const chars = compiled.querySelector('[data-testid="timeline-characters"]');
    expect(chars).toBeNull();
  });

  it('should show empty state if no events', () => {
    component.events = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Timeline is empty.');
  });

  it('should render custom label if provided', () => {
    component.events = mockEvents;
    component.label = 'Chronology';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Chronology');
  });
});
