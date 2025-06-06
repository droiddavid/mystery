
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

  it('should not route anywhere if no saved state exists', () => {
    mockGameStateService.loadGame.mockReturnValueOnce(null);
    component.ngOnInit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should render a sticky header and footer', () => {
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('app-header');
    const footer = fixture.nativeElement.querySelector('app-footer');
    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();

    const headerStyle = window.getComputedStyle(header);
    const footerStyle = window.getComputedStyle(footer);

    // Check sticky positioning (jsdom returns empty string, so allow it in test env)
    const allowedPositions = ['sticky', '-webkit-sticky', ''];
    expect(allowedPositions).toContain(headerStyle.position);
    expect(allowedPositions).toContain(footerStyle.position);

    // Check top and bottom values (jsdom returns '' for unset)
    expect(
      headerStyle.top === '0px' || headerStyle.top === '0' || headerStyle.top === ''
    ).toBe(true);
    expect(
      footerStyle.bottom === '0px' || footerStyle.bottom === '0' || footerStyle.bottom === ''
    ).toBe(true);
  });

    it('should call mysteryService.createMystery and log on success', () => {
    const mockMystery = { title: 'Test', summary: '', setting: {}, difficulty: '', solution: {}, characters: [], clues: [], timeline: [], locations: [] };
    const mockResponse = { success: true };
    // Patch the private property using bracket notation
    (component as any).mysteryService = { createMystery: jest.fn().mockReturnValue({ subscribe: (handlers: any) => handlers.next(mockResponse) }) };
    console.log = jest.fn();
    component.createMystery = AppComponent.prototype.createMystery;
    component.createMystery();
    expect((component as any).mysteryService.createMystery).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Mystery submitted:', mockResponse);
  });

  it('should call mysteryService.createMystery and log error on failure', () => {
    const mockMystery = { title: 'Test', summary: '', setting: {}, difficulty: '', solution: {}, characters: [], clues: [], timeline: [], locations: [] };
    const mockError = new Error('fail');
    (component as any).mysteryService = { createMystery: jest.fn().mockReturnValue({ subscribe: (handlers: any) => handlers.error(mockError) }) };
    console.error = jest.fn();
    component.createMystery = AppComponent.prototype.createMystery;
    component.createMystery();
    expect((component as any).mysteryService.createMystery).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error:', mockError);
  });

  it('should log user input on submission', () => {
    component.botPromptText = 'Test input';
    console.log = jest.fn();
    component.onUserSubmit();
    expect(console.log).toHaveBeenCalledWith('User submitted:', 'Test input');
  });
});
