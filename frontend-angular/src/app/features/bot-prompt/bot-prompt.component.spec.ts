import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotPromptComponent } from './bot-prompt.component';
import { BOT_PROMPTS, DEFAULT_PROMPT } from '../../shared/constants/bot-prompts';
import { SimpleChange } from '@angular/core';

describe('BotPromptComponent (Jest)', () => {
  let component: BotPromptComponent;
  let fixture: ComponentFixture<BotPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotPromptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotPromptComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should use promptText if provided', () => {
      component.promptText = 'custom test prompt';
      jest.useFakeTimers();
      component.ngOnInit();
      expect(component.displayedText).toBe('custom test prompt');
      jest.runAllTimers();
      expect(component.isTypingComplete).toBe(true);
      jest.useRealTimers();
    });

    it('should use a random prompt if promptText is empty', () => {
      component.promptText = '';
      jest.spyOn(component as any, 'getRandomPrompt').mockReturnValue('random!');
      jest.useFakeTimers();
      component.ngOnInit();
      expect(component.displayedText).toBe('random!');
      jest.runAllTimers();
      expect(component.isTypingComplete).toBe(true);
      jest.useRealTimers();
    });
  });

  describe('ngOnChanges()', () => {
    it('should call prepareTyping when promptText changes (not first change)', () => {
      const spy = jest.spyOn(component as any, 'prepareTyping');
      component.ngOnChanges({
        promptText: new SimpleChange('old', 'new', false),
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should NOT call prepareTyping if firstChange is true', () => {
      const spy = jest.spyOn(component as any, 'prepareTyping');
      component.ngOnChanges({
        promptText: new SimpleChange(null, 'new', true),
      });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('prepareTyping()', () => {
    it('should reset text and start typing', () => {
      const spy = jest.spyOn(component as any, 'startTyping');
      (component as any).prepareTyping();
      expect(component.displayedText).toBe('');
      expect(component.isTypingComplete).toBe(false);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getRandomPrompt()', () => {
    it('should return one of the BOT_PROMPTS', () => {
      const result = (component as any).getRandomPrompt();
      expect(BOT_PROMPTS.includes(result)).toBe(true);
    });
  });

  describe('startTyping()', () => {
    it('should type out each character with delay and mark completion', () => {
      jest.useFakeTimers();
  
      // Manually set the full text to type
      component.displayedText = 'bot';
      component.isTypingComplete = false;
  
      // Invoke private method via casting
      (component as any).startTyping();
  
      // Step through each character
      jest.advanceTimersByTime(50); // 'b'
      expect(component.displayedText).toBe('b');
      expect(component.isTypingComplete).toBe(false);
  
      jest.advanceTimersByTime(50); // 'bo'
      expect(component.displayedText).toBe('bo');
      expect(component.isTypingComplete).toBe(false);
  
      jest.advanceTimersByTime(50); // 'bot'
      expect(component.displayedText).toBe('bot');
      expect(component.isTypingComplete).toBe(false);
  
      // Advance one more interval to allow isTypingComplete = true
      jest.advanceTimersByTime(50);
      expect(component.isTypingComplete).toBe(true);
  
      jest.useRealTimers();
    });
  });
  
  
});
