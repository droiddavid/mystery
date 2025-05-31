import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClueListComponent } from './clue-list.component';
import { Clue } from '../../../models/clue.model';
import { By } from '@angular/platform-browser';

describe('ClueListComponent', () => {
  let component: ClueListComponent;
  let fixture: ComponentFixture<ClueListComponent>;

  const mockClues: Clue[] = [
    {
      id: '1',
      description: 'Bloody knife',
      foundAt: 'Kitchen',
      discoveredBy: 'Alice',
      relevance: 'High',
      location: 'Drawer',
      reveals: 'Weapon used in the crime'
    },
    {
      id: '2',
      description: 'Footprint',
      foundAt: 'Garden',
      discoveredBy: 'Bob',
      relevance: 'Medium',
      location: 'Mud',
      reveals: '' // required by model, empty string if not present
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClueListComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ClueListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all clue fields', () => {
    component.clues = mockClues;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Debug output for troubleshooting
    // console.log(compiled.innerHTML);
    const clueItems = compiled.querySelectorAll('.clue-item');
    expect(clueItems.length).toBe(2);
    const firstClue = clueItems[0];
    expect(firstClue.textContent).toContain('Bloody knife');
    expect(firstClue.textContent).toContain('Kitchen');
    expect(firstClue.textContent).toContain('Alice');
    expect(firstClue.textContent).toContain('High');
    expect(firstClue.textContent).toContain('Drawer');
    expect(firstClue.textContent).toContain('Weapon used in the crime');
    const secondClue = clueItems[1];
    expect(secondClue.textContent).toContain('Footprint');
    expect(secondClue.textContent).toContain('Garden');
    expect(secondClue.textContent).toContain('Bob');
    expect(secondClue.textContent).toContain('Medium');
    expect(secondClue.textContent).toContain('Mud');
  });

  it('should not render reveals if not present', () => {
    component.clues = [mockClues[1]];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Reveals:');
  });

  it('should show empty state if no clues', () => {
    component.clues = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Look for the .no-clues element directly
    const noClues = compiled.querySelector('.no-clues');
    expect(noClues).toBeTruthy();
    expect(noClues?.textContent).toContain('No clues discovered yet.');
  });
});
