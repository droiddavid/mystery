import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MysteryService } from './services/mystery.service';
import { of, throwError } from 'rxjs';
import { BotPromptComponent } from './features/bot-prompt/bot-prompt.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const mockMysteryService = {
  createMystery: jest.fn(),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BotPromptComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: MysteryService, useValue: mockMysteryService }
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

  it('should have title "solve-the-mystery"', () => {
    expect(component.title).toBe('solve-the-mystery');
  });

  it('should initialize botPromptText correctly', () => {
    expect(component.botPromptText).toBe('Choose your mystery path...');
  });

  it('should call generate() on ngOnInit', () => {
    mockMysteryService.createMystery.mockReturnValue(of({ success: true })); // ← Add this line
    const generateSpy = jest.spyOn(component, 'generate');
    component.ngOnInit();
    expect(generateSpy).toHaveBeenCalled();
  });
  

  it('should call createMystery()', () => {
    mockMysteryService.createMystery.mockReturnValue(of({ success: true }));
    component.createMystery();
    expect(mockMysteryService.createMystery).toHaveBeenCalled();
  });

  it('should handle success in generate()', () => {
    mockMysteryService.createMystery.mockReturnValue(of({ success: true }));
    component.generate();
    expect(mockMysteryService.createMystery).toHaveBeenCalled();
  });

  it('should handle error in generate()', () => {
    const error = new Error('Failed to create mystery');
    console.error = jest.fn();
    mockMysteryService.createMystery.mockReturnValue(throwError(() => error));
    component.generate();
    expect(console.error).toHaveBeenCalledWith('Failed to create mystery:', error);
  });

  it('should log user input on submission', () => {
    console.log = jest.fn();
    component.botPromptText = 'Test Path';
    component.onUserSubmit();
    expect(console.log).toHaveBeenCalledWith('User submitted:', 'Test Path');
  });
  
  it('should handle error in createMystery()', () => {
    const error = new Error('Something went wrong');
    console.error = jest.fn();
    mockMysteryService.createMystery.mockReturnValue(throwError(() => error));
  
    component.createMystery();
  
    expect(console.error).toHaveBeenCalledWith('Error:', error);
  });
  
});
