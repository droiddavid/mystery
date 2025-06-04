
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenderMysteryComponent } from './render-mystery.component';
import { Mystery } from '../../models/mystery/mystery.model';
import { By } from '@angular/platform-browser';

describe('RenderMysteryComponent', () => {
  let component: RenderMysteryComponent;
  let fixture: ComponentFixture<RenderMysteryComponent>;
  const mockMystery: Mystery = {
    title: 'Test Mystery',
    summary: 'A test summary',
    setting: { name: 'Test Place', description: 'desc', locationType: 'type' },
    difficulty: 'Easy',
    characters: [
      {
        name: 'Alice',
        role: 'Detective',
        personality: 'Clever',
        motive: 'Justice',
        secrets: [],
        alibi: { time: '', location: '', verifiedBy: '' },
        knowledge: '',
        connections: []
      },
      {
        name: 'Bob',
        role: 'Suspect',
        personality: '',
        motive: '',
        secrets: [],
        alibi: { time: '', location: '', verifiedBy: '' },
        knowledge: '',
        connections: []
      }
    ],
    clues: [
      {
        id: 'c1',
        description: 'A clue',
        location: 'Library',
        relevance: 'High',
        discoveredBy: 'Alice',
        foundAt: 'Library',
        reveals: 'Something important'
      }
    ],
    solution: { suspect: 'Bob', method: 'Poison', motive: 'Greed', reveal: 'At the end', discoveredBy: 'Alice' },
    timeline: [
      { time: '10:00', description: 'Event 1', involvedCharacters: ['Alice'] }
    ],
    locations: []
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderMysteryComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RenderMysteryComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Cleanup for async operations that may keep Jest open
    if (fixture) {
      fixture.destroy();
    }
    if (typeof jest !== 'undefined' && jest.clearAllMocks) {
      jest.clearAllMocks();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all main sections when data is present', () => {
    component.mystery = mockMystery;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Test Mystery');
    expect(compiled.textContent).toContain('A test summary');
    expect(compiled.textContent).toContain('Test Place');
    expect(compiled.textContent).toContain('Detective');
    expect(compiled.textContent).toContain('A clue');
    expect(compiled.textContent).toContain('Event 1');
    expect(compiled.textContent).toContain('Poison');
  });

  it('should show fallback for empty characters, clues, and timeline', () => {
    component.mystery = {
      ...mockMystery,
      characters: [],
      clues: [],
      timeline: []
    };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No characters found.');
    expect(compiled.textContent).toContain('No clues discovered yet.');
    expect(compiled.textContent).toContain('Timeline is empty.');
  });

  it('should not render solution section if not present', () => {
    component.mystery = { ...mockMystery, solution: undefined as any };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Solution');
  });

  it('should render solution section if present', () => {
    component.mystery = mockMystery;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Solution');
    expect(compiled.textContent).toContain('Bob');
    expect(compiled.textContent).toContain('Poison');
    expect(compiled.textContent).toContain('Greed');
    expect(compiled.textContent).toContain('At the end');
    expect(compiled.textContent).toContain('Alice');
  });

      it('should map timeline events to EditableTimelineEvent[] with defaults', () => {
    component.mystery = {
      ...mockMystery,
      timeline: [
        { time: '12:00', description: 'desc', involvedCharacters: ['A'] },
        // Only TimelineEvent properties allowed here
        { time: '13:00', description: 'desc2', involvedCharacters: ['B'] }
      ]
    };
    // Simulate what the getter does: the first event gets defaults, the second as well
    const result = component.editableTimeline;
    expect(result.length).toBe(2);
    // First event: no id/source/suspectedFalse/editable provided
    expect(result[0].id).toBe('12:00-desc-0');
    expect(result[0].source).toBe('player');
    expect(result[0].suspectedFalse).toBe(false);
    expect(result[0].editable).toBe(true);
    // Second event: also gets defaults
    expect(result[1].id).toBe('13:00-desc2-1');
    expect(result[1].source).toBe('player');
    expect(result[1].suspectedFalse).toBe(false);
    expect(result[1].editable).toBe(true);
  });

    it('should return an empty array if mystery or timeline is missing', () => {
      component.mystery = { ...mockMystery, timeline: undefined as any };
      expect(component.editableTimeline).toEqual([]);
      component.mystery = undefined as any;
      expect(component.editableTimeline).toEqual([]);
    });
});
