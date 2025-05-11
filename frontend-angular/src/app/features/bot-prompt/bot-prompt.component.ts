import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { BOT_PROMPTS, DEFAULT_PROMPT } from '../../shared/constants/bot-prompts';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';
import { BotPromptService } from '../../services/bot-prompt.service';

@Component({
  selector: 'app-bot-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bot-prompt.component.html',
  styleUrl: './bot-prompt.component.scss',
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class BotPromptComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() promptText: string = '';
  @Input() botPersona: keyof typeof BOT_PROMPTS = 'default';

  displayedText: string = '';
  typingSpeed: number = 50;
  isTypingComplete: boolean = false;

  private typingInterval: any;
  private readonly destroy$ = new Subject<void>();

  constructor(private promptSvc: BotPromptService) {}

  ngOnInit() {
    console.log('[ngOnInit] botPersona:', this.botPersona);
    console.log('[ngOnInit] promptText:', this.promptText);

    this.setPromptAndType();
  }

  /* ---------- life‑cycle ---------- */
  ngAfterViewInit(): void {
      // initial render
      setTimeout(() => this.setPromptAndType(), 0);

    /* optional: auto‑refresh if someone updates the store at runtime */
    this.promptSvc.changes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.setPromptAndType());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promptText'] || changes['botPersona']) {
      this.setPromptAndType();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.typingInterval);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setPromptAndType() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    const trimmed = this.promptText?.trim();
    const personaKey = this.botPersona?.toLowerCase() as keyof typeof BOT_PROMPTS;

    const prompt = trimmed && trimmed.length > 0
      ? trimmed
      : this.getRandomPrompt(personaKey);

    console.log('[setPromptAndType] Final Prompt:', prompt);

    this.displayedText = '';
    this.isTypingComplete = false;
    this.startTyping(prompt);
  }

  private getRandomPrompt(persona: keyof typeof BOT_PROMPTS): string {
    const prompts = BOT_PROMPTS[persona] || BOT_PROMPTS['default'];
    const index = Math.floor(Math.random() * prompts.length);
    return prompts[index] || DEFAULT_PROMPT;
  }

  private startTyping(text: string) {
    let index = 0;
    this.typingInterval = setInterval(() => {
      if (index < text.length) {
        this.displayedText = text.substring(0, index + 1);
        index++;
      } else {
        clearInterval(this.typingInterval);
        this.isTypingComplete = true;
      }
    }, this.typingSpeed);
  }
}
