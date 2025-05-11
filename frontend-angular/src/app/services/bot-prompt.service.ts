import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BOT_PROMPTS, DEFAULT_PROMPT } from '../shared/constants/bot-prompts';

/** Map key is just the persona name (string keeps it open-ended). */
export type PersonaKey = string;

@Injectable({ providedIn: 'root' })
export class BotPromptService {

  /** In‑memory store → can be replaced with HTTP or indexed‑db later. */
  private readonly store = new Map<PersonaKey, string[]>();
  private readonly store$ = new BehaviorSubject(this.store);

  constructor() {
    // seed with the static file so nothing changes for existing users
    Object.entries(BOT_PROMPTS).forEach(([k, arr]) =>
      this.store.set(k.toLowerCase(), [...arr])
    );
  }

  /** Pull one random prompt, falling back to “default” and finally DEFAULT_PROMPT. */
  getRandomPrompt(persona: PersonaKey = 'default'): string {
    const list = this.store.get(persona.toLowerCase()) ??
                 this.store.get('default') ??
                 [];
    if (!list.length) { return DEFAULT_PROMPT; }
    return list[Math.floor(Math.random() * list.length)];
  }

  /** Runtime update (e.g. after the LLM invents new persona lines). */
  updatePrompts(persona: PersonaKey, prompts: string[]): void {
    this.store.set(persona.toLowerCase(), prompts);
    this.store$.next(this.store);
  }

  /** Consumers can subscribe if they want to refresh automatically. */
  changes(): Observable<Map<PersonaKey, string[]>> {
    return this.store$.asObservable();
  }
}
