import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterListComponent } from './character-list.component';
import { Character } from '../../../models/character.model';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;

  const mockCharacters: Character[] = [
    {
      name: 'Alice',
      role: 'Detective',
      personality: 'Clever',
      motive: 'Justice',
      alibi: { location: 'Library', time: '10:00', verifiedBy: 'Bob' },
      secrets: ['Secret 1'],
      connections: ['Bob', 'Charlie'],
      knowledge: 'Knows the layout of the mansion'
    },
    {
      name: 'Bob',
      role: 'Suspect',
      personality: '',
      motive: '',
      alibi: { location: 'Kitchen', time: '10:05', verifiedBy: '' },
      secrets: [],
      connections: [],
      knowledge: ''
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterListComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all character fields', () => {
    component.characters = mockCharacters;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alice');
    expect(compiled.textContent).toContain('Detective');
    expect(compiled.textContent).toContain('Clever');
    expect(compiled.textContent).toContain('Justice');
    expect(compiled.textContent).toContain('Library');
    expect(compiled.textContent).toContain('10:00');
    expect(compiled.textContent).toContain('Bob');
    expect(compiled.textContent).toContain('Secret 1');
    expect(compiled.textContent).toContain('Charlie');
    // Suspect highlight
    const suspect = compiled.querySelector('li.suspect');
    expect(suspect).toBeTruthy();
  });

  it('should show empty state if no characters', () => {
    component.characters = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No characters found.');
  });

  it('should not render optional fields if not present', () => {
    component.characters = [{
      name: 'Eve',
      role: 'Witness',
      alibi: { location: '', time: '', verifiedBy: '' },
      secrets: [],
      connections: [],
      personality: '',
      motive: '',
      knowledge: ''
    }];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Eve');
    expect(compiled.textContent).toContain('Witness');
    expect(compiled.textContent).not.toContain('Personality:');
    expect(compiled.textContent).not.toContain('Motive:');
  });
});
