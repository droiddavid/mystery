import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NpcDialogueService } from '../../services/npc-dialogue.service';
import { GameStateService } from '../../services/game-state.service';
import { GameState } from '../../models/game-state.model';

interface ChatMessage {
  sender: 'player' | 'npc';
  text: string;
}

@Component({
  selector: 'app-npc-dialogue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './npc-dialogue.component.html',
  styleUrls: ['./npc-dialogue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NPCDialogueComponent implements OnInit {
  @Input() npcId!: string;
  @Input() npcName!: string;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('chatWindow') chatWindowRef!: ElementRef<HTMLDivElement>;

  chat: ChatMessage[] = [];
  userInput = '';
  typing = false;

  constructor(
    private npcDialogueService: NpcDialogueService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    const history = this.npcDialogueService.getHistory(this.npcId);
    for (const line of history) {
      if (line.startsWith('User: ')) {
        this.chat.push({ sender: 'player', text: line.replace('User: ', '') });
      } else if (line.startsWith(this.npcName + ': ')) {
        this.chat.push({ sender: 'npc', text: line.replace(this.npcName + ': ', '') });
      }
    }
    setTimeout(() => this.scrollToBottom(), 0);
  }

  sendMessage(): void {
    const input = this.userInput.trim();
    if (!input) return;
    this.chat.push({ sender: 'player', text: input });
    this.userInput = '';
    this.typing = true;
    setTimeout(() => this.scrollToBottom(), 0);
    this.npcDialogueService.interactWithNPC({ id: this.npcId, name: this.npcName } as any, input).subscribe(resp => {
      this.chat.push({ sender: 'npc', text: resp });
      this.typing = false;
      setTimeout(() => this.scrollToBottom(), 0);
      // --- MYS-61: Save game after NPC interaction ---
      // TODO: Replace with actual updated GameState from your app state
      const updatedGameState: GameState = {} as any;
      this.gameStateService.saveGame(updatedGameState);
    });
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  scrollToBottom(): void {
    if (this.chatWindowRef) {
      const el = this.chatWindowRef.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  close(): void {
    this.closed.emit();
  }
}
