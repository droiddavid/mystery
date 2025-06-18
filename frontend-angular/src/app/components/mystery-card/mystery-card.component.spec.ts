import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysteryCardComponent } from './mystery-card.component';

describe('MysteryCardComponent', () => {

  let component: MysteryCardComponent;
  let fixture: ComponentFixture<MysteryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysteryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysteryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should flip the card when onCardClick is called and not clicking .start-btn', () => {
    component.flipped = false;
    const mockEvent = { target: document.createElement('div') } as unknown as MouseEvent;
    component.onCardClick(mockEvent);
    expect(component.flipped).toBe(true);
    component.onCardClick(mockEvent);
    expect(component.flipped).toBe(false);
  });

  it('should not flip the card when clicking .start-btn', () => {
    component.flipped = false;
    const btn = document.createElement('button');
    btn.classList.add('start-btn');
    const mockEvent = { target: btn } as unknown as MouseEvent;
    component.onCardClick(mockEvent);
    expect(component.flipped).toBe(false);
  });

  it('should return the correct themeClass', () => {
    component.mystery = { id: 1, title: '', description: '', imageUrl: '', cardBackImage: '', theme: 'Victorian Steampunk', difficulty: 3, duration: '', players: '' };
    expect(component.themeClass).toBe('victorian-steampunk');
    component.mystery.theme = 'Noir';
    expect(component.themeClass).toBe('noir');
    component.mystery.theme = '';
    expect(component.themeClass).toBe('');
    component.mystery = undefined as any;
    expect(component.themeClass).toBe('');
  });

  it('should return the correct difficultyLabel', () => {
    component.mystery = { id: 1, title: '', description: '', imageUrl: '', cardBackImage: '', theme: '', difficulty: 4, duration: '', players: '' };
    expect(component.difficultyLabel).toBe('Hard');
    component.mystery.difficulty = 3;
    expect(component.difficultyLabel).toBe('Intermediate');
    component.mystery.difficulty = 2;
    expect(component.difficultyLabel).toBe('Intermediate');
    component.mystery.difficulty = 1;
    expect(component.difficultyLabel).toBe('Easy');
    component.mystery = undefined as any;
    expect(component.difficultyLabel).toBe('');
  });
});
