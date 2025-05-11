import { BotPromptService } from './bot-prompt.service';
import { BOT_PROMPTS, DEFAULT_PROMPT } from '../shared/constants/bot-prompts';
import { firstValueFrom } from 'rxjs';

describe('BotPromptService', () => {
  let svc: BotPromptService;

  beforeEach(() => (svc = new BotPromptService()));

  it('returns a random prompt for a known persona', () => {
    const prompt = svc.getRandomPrompt('default');
    expect(BOT_PROMPTS.default).toContain(prompt);
  });

  it('falls back to "default" prompts when persona unknown', () => {
    const prompt = svc.getRandomPrompt('unknown‑persona');
    expect(BOT_PROMPTS.default).toContain(prompt);
  });

  it('falls back to DEFAULT_PROMPT when no prompts exist', () => {
    // wipe out every stored prompt
    svc.updatePrompts('default', []);
    const prompt = svc.getRandomPrompt('still‑unknown');
    expect(prompt).toBe(DEFAULT_PROMPT);
  });

  it('updatePrompts() mutates store and emits via changes()', async () => {
    const newSet = ['one', 'two'];
    const change$ = firstValueFrom(svc.changes());
    svc.updatePrompts('detective', newSet);
    const store = await change$;

    expect(store.get('detective')).toEqual(newSet);
  });

  it('returns the first item when Math.random() is stubbed to 0', () => {
    svc.updatePrompts('special', ['alpha', 'beta']);
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0);   // force index 0
  
    const prompt = svc.getRandomPrompt('special');
    expect(prompt).toBe('alpha');
  
    rnd.mockRestore();
  });

  it('falls back to DEFAULT_PROMPT when *both* persona and default are missing', () => {
    // remove the 'default' entry entirely so second lookup is undefined
    (svc as any).store.delete('default');
  
    const prompt = svc.getRandomPrompt('nobody');
    expect(prompt).toBe(DEFAULT_PROMPT);
  });
  
  it('returns DEFAULT_PROMPT when persona entry exists but is empty', () => {
    // persona key present, but no prompts inside
    svc.updatePrompts('silent', []);          // empty array
    const prompt = svc.getRandomPrompt('silent');
    expect(prompt).toBe(DEFAULT_PROMPT);      // falls through to default text
  });

  it('uses the "default" persona when no argument is passed', () => {
    // call with zero arguments → hits the default‑arg branch
    const prompt = svc.getRandomPrompt();
    expect(BOT_PROMPTS.default).toContain(prompt);
  });
  
  
});
