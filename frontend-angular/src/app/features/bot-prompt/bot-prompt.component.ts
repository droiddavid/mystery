import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BOT_PROMPTS, DEFAULT_PROMPT } from '../../shared/constants/bot-prompts';

@Component({
  selector: 'app-bot-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bot-prompt.component.html',
  styleUrl: './bot-prompt.component.scss'
})
export class BotPromptComponent implements OnInit {
  @Input() promptText: string =  'this is a test ';
  displayedPrompt: string = DEFAULT_PROMPT;
  
  displayedText: string = '';
  typingSpeed: number = 50; // milliseconds per character
  isTypingComplete: boolean = false;

  ngOnInit() {
    if (this.promptText) {
      this.displayedText = this.promptText;
    } else {
      this.displayedText = this.getRandomPrompt();
    }
    this.startTyping();
  }

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['promptText'] && !changes['promptText'].firstChange) {
      this.prepareTyping();
    }
  }

  private prepareTyping() {
    this.displayedText = '';
    this.isTypingComplete = false;
    this.startTyping();
  }

  private getRandomPrompt(): string {
    debugger;
    const testprompt = BOT_PROMPTS;
    console.log("testprompt", testprompt);
    const randomIndex = Math.floor(Math.random() * BOT_PROMPTS.length);
    return BOT_PROMPTS[randomIndex];
  }

  private startTyping() {
    let index = 0;
    const sourceText = this.displayedText || ''; // always work from displayedText now
  
    const interval = setInterval(() => {
      if (index < sourceText.length) {
        this.displayedText = sourceText.substring(0, index + 1);
        index++;
      } else {
        clearInterval(interval);
        this.isTypingComplete = true;
      }
    }, this.typingSpeed);
  }
  
}
