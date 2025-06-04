import { ComponentFixture, TestBed } from '@angular/core/testing';


import { HeaderComponent } from './header.component';
import { GameStateService } from '../../services/game-state.service';
import { GameStateStoreService } from '../../services/game-state-store.service';

const mockGameStateService = { saveGame: jest.fn() };
const mockGameStateStore = { getCurrentState: jest.fn() };

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    jest.useRealTimers(); // Always start with real timers
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: GameStateService, useValue: mockGameStateService },
        { provide: GameStateStoreService, useValue: mockGameStateStore }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
  });
  it('should save game and update timestamp when state exists, and clear saveMessage after timeout', () => {
    jest.useFakeTimers();
    const realDate = global.Date;
    global.Date = jest.fn(() => ({ toISOString: () => 'now' })) as any;
    const mockState = {
      timestamp: 'old',
      playerId: 'p', mysteryId: 'm', currentSceneId: 's', npcStates: {}, inventory: [], discoveredClues: [], visitedLocations: [], choicesMade: {}
    };
    mockGameStateStore.getCurrentState.mockReturnValueOnce(mockState);
    component.onSaveGame();
    expect(mockState.timestamp).toBe('now');
    expect(mockGameStateService.saveGame).toHaveBeenCalledWith(mockState);
    expect(component.saveMessage).toBe('Game saved successfully');
    jest.advanceTimersByTime(2000);
    expect(component.saveMessage).toBeNull();
    global.Date = realDate;
    jest.useRealTimers();
  });

  it('should warn and not save if no state exists, and clear saveMessage after timeout', () => {
    jest.useFakeTimers();
    mockGameStateStore.getCurrentState.mockReturnValueOnce(null);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    component.onSaveGame();
    expect(mockGameStateService.saveGame).not.toHaveBeenCalled();
    expect(component.saveMessage).toBe('No game state to save!');
    expect(warnSpy).toHaveBeenCalledWith('No game state to save!');
    jest.advanceTimersByTime(2000);
    expect(component.saveMessage).toBeNull();
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleLeftSidebar when toggleLeft is called', () => {
    const spy = jest.spyOn(component.toggleLeftSidebar, 'emit');
    component.toggleLeft();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit toggleRightSidebar when toggleRight is called', () => {
    const spy = jest.spyOn(component.toggleRightSidebar, 'emit');
    component.toggleRight();
    expect(spy).toHaveBeenCalled();
  });
});
