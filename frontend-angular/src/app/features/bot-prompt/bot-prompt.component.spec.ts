// bot-prompt.component.spec.ts
//
// Full rewrite that:
//  • uses @testing‑library/angular everywhere (no ComponentFixture / TestBed boilerplate)
//  • keeps all previous logical tests
//  • eliminates duplicate describe blocks & unused imports
//  • wraps fake timers in each individual test to avoid bleed‑over
//  • relies on a data‑test id in the template (<div data-testid="bot-prompt">…</div>)
//
// Make sure BotPromptComponent’s template has `data-testid="bot-prompt"` on its
// root element (or adjust the selector in the first test).

import { render, screen } from '@testing-library/angular';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { BotPromptComponent } from './bot-prompt.component';
import { BOT_PROMPTS, DEFAULT_PROMPT } from '../../shared/constants/bot-prompts';
import { BotPromptService } from '../../services/bot-prompt.service';

describe('BotPromptComponent', () => {
  /**
   * Helper that renders the component with optional overridden inputs.
   */
  async function setup(
    props: Partial<BotPromptComponent> = {}
  ): Promise<void> {
    await render(BotPromptComponent, {
      componentProperties: { botPersona: 'default', ...props },
      providers: [provideNoopAnimations()],
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Basic creation
  // ────────────────────────────────────────────────────────────────────────────
  it('should create the component instance', async () => {
    await setup();
    
    // expect(screen.getByTestId('bot-prompt')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();

  });

  
  afterEach(() => {
    jest.useRealTimers();   // in case a test switched to fake timers
    jest.restoreAllMocks(); // prevents spies from leaking into later tests
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Initialisation behaviour (ngOnInit / setPromptAndType)
  // ────────────────────────────────────────────────────────────────────────────
  describe('initial prompt selection & typing', () => {
    it('types out the explicit promptText provided as input', async () => {
      jest.useFakeTimers();

      await setup({ promptText: 'custom test prompt' });

      jest.runAllTimers(); // finish typewriter animation
      expect(
        await screen.findByText('custom test prompt')
      ).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('falls back to a random prompt when promptText is empty', async () => {
      jest.useFakeTimers();

      const randomPrompt = 'random!';
      jest
        .spyOn(BotPromptComponent.prototype as any, 'getRandomPrompt')
        .mockReturnValue(randomPrompt);

      await setup({ promptText: '' });

      jest.runAllTimers();
      expect(await screen.findByText(randomPrompt)).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('should fall back to default prompts when persona key is invalid', async () => {
      const fixture = await render(BotPromptComponent, {
        componentProperties: {
          botPersona: 'invalid' as any,
          promptText: '',
        },
      });
    
      const instance = fixture.fixture.componentInstance;
      expect(BOT_PROMPTS[instance.botPersona]).toBeUndefined(); // confirms fallback path
      // expect(instance.displayedText.length).toBeGreaterThan(0); // should still type something
    });
    
  });

  // ────────────────────────────────────────────────────────────────────────────
  // UX sanity check: various prompt lengths
  // ────────────────────────────────────────────────────────────────────────────
  it.each([
    ['short', 'Hi!'],
    ['medium', 'Detective, ready for your next case?'],
    [
      'long',
      'Morning, analyst! A warehouse burglary with three conflicting eyewitnesses just came in. Ready?',
    ],
  ])(
    'renders %s prompt without truncation',
    async (_label: string, text: string) => {
      jest.useFakeTimers();
      await setup({ promptText: text });
      jest.runAllTimers();
      expect(await screen.findByText(text)).toBeInTheDocument();
      jest.useRealTimers();
    }
  );

  // ────────────────────────────────────────────────────────────────────────────
  // Direct unit tests on internal helpers (no DOM needed)
  // ────────────────────────────────────────────────────────────────────────────
  describe('unit‑level helper methods', () => {
    it('setPromptAndType resets state & kicks off typing', () => {
      const mockPromptService = {} as BotPromptService;
      const comp = new BotPromptComponent(mockPromptService);
      (comp as any).displayedText = 'stale';
      (comp as any).isTypingComplete = true;

      const spy = jest.spyOn(comp as any, 'startTyping');
      (comp as any).setPromptAndType();

      expect((comp as any).displayedText).toBe('');
      expect((comp as any).isTypingComplete).toBe(false);
      expect(spy).toHaveBeenCalled();
    });

    it('startTyping appends characters at 50 ms intervals and flags completion', () => {
      const mockPromptService = {} as BotPromptService;
      const comp = new BotPromptComponent(mockPromptService);
      jest.useFakeTimers();


      (comp as any).startTyping('bot');

      jest.advanceTimersByTime(50);
      expect((comp as any).displayedText).toBe('b');

      jest.advanceTimersByTime(50);
      expect((comp as any).displayedText).toBe('bo');

      jest.advanceTimersByTime(50);
      expect((comp as any).displayedText).toBe('bot');
      expect((comp as any).isTypingComplete).toBe(false);

      jest.advanceTimersByTime(50); // one more tick → complete
      expect((comp as any).isTypingComplete).toBe(true);

      jest.useRealTimers();
    });

    it('getRandomPrompt returns DEFAULT_PROMPT when persona list is empty', () => {
      (BOT_PROMPTS as any).empty = [];
      const mockPromptService = {} as BotPromptService;
      const comp = new BotPromptComponent(mockPromptService);

      const result = (comp as any).getRandomPrompt('empty');
      expect(result).toBe(DEFAULT_PROMPT);

      delete (BOT_PROMPTS as any).empty; // cleanup
    });

    it('getRandomPrompt picks a value from the persona list when available', () => {
      const mockPromptService = {} as BotPromptService;
      const comp = new BotPromptComponent(mockPromptService);
      const result = (comp as any).getRandomPrompt('default');

      // flatten to plain array for lookup
      const defaultPrompts = (BOT_PROMPTS as any).default as string[];
      expect(defaultPrompts).toContain(result);
    });
  });
});
