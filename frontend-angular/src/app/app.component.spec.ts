
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BotPromptComponent } from './features/bot-prompt/bot-prompt.component';
import { MysteryService } from './services/mystery.service';
import { GameStateService } from './services/game-state.service';
import { GameStateStoreService } from './services/game-state-store.service';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

const mockMysteryService = {
  createMystery: jest.fn(),
};
const mockGameStateService = {
  loadGame: jest.fn()
};
const mockGameStateStore = {
  setCurrentState: jest.fn(),
  getCurrentState: jest.fn()
};
const mockRouter = {
  navigate: jest.fn()
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BotPromptComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: MysteryService, useValue: mockMysteryService },
        { provide: GameStateService, useValue: mockGameStateService },
        { provide: GameStateStoreService, useValue: mockGameStateStore },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load and parse GameState and route to mystery if state exists', () => {
    const mockState = {
      playerId: 'p1',
      mysteryId: 'm1',
      currentSceneId: 'scene1',
      npcStates: {},
      inventory: [],
      discoveredClues: [],
      visitedLocations: [],
      choicesMade: {},
      timestamp: new Date().toISOString()
    };
    mockGameStateService.loadGame.mockReturnValueOnce(mockState);
    component.ngOnInit();
    expect(mockGameStateStore.setCurrentState).toHaveBeenCalledWith(mockState);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/mystery/${mockState.mysteryId}/scene/${mockState.currentSceneId}`]);
  });

  it('should route to /start if no saved state exists', () => {
    mockGameStateService.loadGame.mockReturnValueOnce(null);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/start']);
  });
});
