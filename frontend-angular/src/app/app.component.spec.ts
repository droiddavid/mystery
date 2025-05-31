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
});
