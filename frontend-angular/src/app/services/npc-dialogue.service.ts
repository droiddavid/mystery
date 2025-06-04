
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { NpcPromptBuilderService } from './npc-prompt-builder.service';
import { LlmService } from './llm.service';
import { LlmProvider, LlmRequest, LlmResponse } from '../models/llm-request.model';
import { NPC } from '../models/npc-models/npc.model';
// MYS-57: MemoryToken model
export interface MemoryToken {
  npcId: string;
  playerId: string;
  summary: string;
  timestamp: string;
}
export interface DialogueOptions {
  provider?: LlmProvider;
  model?: string;
  modifiers?: {
    honestyBoost?: number;
    friendlinessBoost?: number;
    paranoiaDrop?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class NpcDialogueService {
  // MYS-57: In-memory token store (can be replaced with localStorage)
  private memoryTokens = new Map<string, MemoryToken>();
  private readonly playerId = 'player-001'; // Hardcoded for now

  // MYS-57: Get memory token for NPC/player
  getMemoryToken(npcId: string, playerId: string = this.playerId): Observable<MemoryToken | null> {
    const key = `${npcId}::${playerId}`;
    return of(this.memoryTokens.get(key) || null);
  }

  // MYS-57: Save memory token
  saveMemoryToken(token: MemoryToken): Observable<void> {
    const key = `${token.npcId}::${token.playerId}`;
    this.memoryTokens.set(key, token);
    return of(void 0);
  }
  private history: Record<string, string[]> = {};
  readonly npcResponse$ = new BehaviorSubject<Record<string, string>>({});

  constructor(
    private promptBuilder: NpcPromptBuilderService,
    private llmService: LlmService
  ) {}

  interactWithNPC(
    npc: NPC,
    userInput: string,
    options?: DialogueOptions
  ): Observable<string> {
    if (!userInput || !userInput.trim()) {
      return of('');
    }
    const npcId = npc.id;
    if (!this.history[npcId]) this.history[npcId] = [];
    const lastExchanges = this.history[npcId].slice(-3);
    const basePrompt = this.promptBuilder.buildPrompt(npc);
    const modifiers = options?.modifiers || {};
    const modifiedTraits = this.applyModifiers(npc, modifiers);
    // MYS-57: Fetch memory token and include in prompt
    return this.getMemoryToken(npcId, this.playerId).pipe(
      switchMap((memoryToken) => {
        let prompt = basePrompt;
        if (memoryToken) {
          prompt += `\n\nNPC Memory: ${memoryToken.summary}`;
        }
        prompt = this.composePrompt(prompt, modifiedTraits, lastExchanges, userInput);
        const provider = options?.provider || LlmProvider.OLLAMA;
        const model = options?.model || 'llama3';
        const llmRequest: LlmRequest = {
          provider,
          model,
          prompt,
          options: { ...modifiers }
        };
        return this.llmService.send(llmRequest).pipe(
          tap((resp: LlmResponse) => {
            this.history[npcId].push(`User: ${userInput}`);
            this.history[npcId].push(`${npc.name}: ${resp.response}`);
            const current = this.npcResponse$.value;
            this.npcResponse$.next({ ...current, [npcId]: resp.response });
          }),
          // MYS-57: After response, update memory token (simple summary for now)
          switchMap((resp: LlmResponse) => {
            const summary = `Last: ${userInput} / ${resp.response}`;
            const token: MemoryToken = {
              npcId,
              playerId: this.playerId,
              summary,
              timestamp: new Date().toISOString()
            };
            return this.saveMemoryToken(token).pipe(
              switchMap(() => of(resp.response))
            );
          })
        );
      })
    );
  }

  resetHistory(npcId: string): void {
    this.history[npcId] = [];
    const current = this.npcResponse$.value;
    this.npcResponse$.next({ ...current, [npcId]: '' });
  }

  getHistory(npcId: string): string[] {
    return this.history[npcId] || [];
  }

  private applyModifiers(npc: NPC, modifiers: DialogueOptions['modifiers'] = {}) {
    // Example: adjust base traits with modifiers
    const baseTraits = npc.personality || {};
    return {
      honesty: (baseTraits.honesty || 0) + (modifiers.honestyBoost || 0),
      friendliness: (baseTraits.friendliness || 0) + (modifiers.friendlinessBoost || 0),
      paranoia: (baseTraits.paranoia || 0) + (modifiers.paranoiaDrop ? -modifiers.paranoiaDrop : 0),
      base: baseTraits
    };
  }

  private composePrompt(
    basePrompt: string,
    traits: any,
    history: string[],
    userInput: string
  ): string {
    // Compose the prompt as described in the requirements
    const traitLines = [
      `- Honesty: ${traits.honesty} (base: ${traits.base.honesty || 0}${traits.honesty - (traits.base.honesty || 0) ? `, boost: ${traits.honesty - (traits.base.honesty || 0)}` : ''})`,
      `- Paranoia: ${traits.paranoia} (base: ${traits.base.paranoia || 0}${traits.paranoia - (traits.base.paranoia || 0) ? `, drop: ${traits.paranoia - (traits.base.paranoia || 0)}` : ''})`,
      `- Friendliness: ${traits.friendliness} (base: ${traits.base.friendliness || 0}${traits.friendliness - (traits.base.friendliness || 0) ? `, boost: ${traits.friendliness - (traits.base.friendliness || 0)}` : ''})`
    ];
    return `${basePrompt}\n\nYour personality traits (modified):\n${traitLines.join('\n')}\n\nRecent conversation:\n${history.join('\n')}\n\nYou just heard: \"${userInput}\"\n\nHow do you respond?`;
  }
}
