import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NPCDialogueComponent } from './npc-dialogue.component';
import { NpcDialogueService } from '../../services/npc-dialogue.service';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { Component } from '@angular/core';

import { delay } from 'rxjs';
class MockNpcDialogueService {
  private history: Record<string, string[]> = {
    'npc1': ['User: Hi', 'Maeve: Hello!']
  };
  getHistory(npcId: string) {
    return this.history[npcId] || [];
  }
  interactWithNPC() {
    return of('NPC response').pipe(delay(0));
  }
}

@Component({
  template: `<app-npc-dialogue [npcId]="'npc1'" [npcName]="'Maeve'" (closed)="onClosed()"></app-npc-dialogue>`,
  standalone: true,
  imports: [NPCDialogueComponent]
})
class HostComponent {
  closedCalled = false;
  onClosed() { this.closedCalled = true; }
}

describe('NPCDialogueComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let service: MockNpcDialogueService;

  beforeEach(async () => {
    const { NO_ERRORS_SCHEMA } = await import('@angular/core');
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: NpcDialogueService, useClass: MockNpcDialogueService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    service = TestBed.inject(NpcDialogueService) as any;
    fixture.detectChanges();
  });

  it('should render initial conversation from service', () => {
    const chatEls = fixture.debugElement.queryAll(By.css('.chat-window .msg-text'));
    expect(chatEls.length).toBe(2);
    expect(chatEls[0].nativeElement.textContent).toContain('Hi');
    expect(chatEls[1].nativeElement.textContent).toContain('Hello!');
  });

  it('should send a message and show NPC response', fakeAsync(() => {
    const subj = new Subject<string>();
    jest.spyOn(service, 'interactWithNPC').mockReturnValue(subj);
    const input = fixture.debugElement.query(By.css('input[type="text"]'));
    input.nativeElement.value = 'Test message';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const sendBtn = fixture.debugElement.query(By.css('button:not(.close-btn)'));
    sendBtn.nativeElement.click();
    fixture.detectChanges();
    // After first tick, only player message should be present
    tick();
    fixture.detectChanges();
    let chatEls = fixture.debugElement.queryAll(By.css('.chat-window .msg-text'));
    expect(chatEls.length).toBe(3);
    expect(chatEls[2].nativeElement.textContent).toContain('Test message');
    // Now emit NPC response
    subj.next('NPC response');
    subj.complete();
    tick();
    fixture.detectChanges();
    chatEls = fixture.debugElement.queryAll(By.css('.chat-window .msg-text'));
    expect(chatEls.length).toBe(4);
    expect(chatEls[3].nativeElement.textContent).toContain('NPC response');
  }));

  it('should emit closed event when close button is clicked', () => {
    const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
    closeBtn.nativeElement.click();
    fixture.detectChanges();
    expect(host.closedCalled).toBe(true);
  });

  it('should show typing indicator while waiting for response', fakeAsync(() => {
    // Use a Subject to simulate delayed response
    const subj = new Subject<string>();
    jest.spyOn(service, 'interactWithNPC').mockReturnValue(subj);
    const input = fixture.debugElement.query(By.css('input[type="text"]'));
    input.nativeElement.value = 'Wait test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const sendBtn = fixture.debugElement.query(By.css('button:not(.close-btn)'));
    sendBtn.nativeElement.click();
    fixture.detectChanges();
    // Typing indicator should show
    const typingEl = fixture.debugElement.query(By.css('.typing-indicator'));
    expect(typingEl).toBeTruthy();
    // Now emit response
    subj.next('Delayed NPC');
    subj.complete();
    tick();
    fixture.detectChanges();
    // Typing indicator should disappear
    expect(fixture.debugElement.query(By.css('.typing-indicator'))).toBeFalsy();
    const chatEls = fixture.debugElement.queryAll(By.css('.chat-window .msg-text'));
    expect(chatEls[chatEls.length - 1].nativeElement.textContent).toContain('Delayed NPC');
  }));


  it('should call sendMessage on Enter keydown', () => {
    const cmp = fixture.debugElement.children[0].componentInstance as NPCDialogueComponent;
    jest.spyOn(cmp, 'sendMessage');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    cmp.userInput = 'Hello';
    cmp.onInputKeydown(event);
    expect(cmp.sendMessage).toHaveBeenCalled();
  });

  it('should not call sendMessage on non-Enter keydown', () => {
    const cmp = fixture.debugElement.children[0].componentInstance as NPCDialogueComponent;
    jest.spyOn(cmp, 'sendMessage');
    const event = new KeyboardEvent('keydown', { key: 'A' });
    cmp.userInput = 'Hello';
    cmp.onInputKeydown(event);
    expect(cmp.sendMessage).not.toHaveBeenCalled();
  });

  it('should not send message if input is empty or whitespace', () => {
    const cmp = fixture.debugElement.children[0].componentInstance as NPCDialogueComponent;
    cmp.userInput = '   ';
    cmp.chat = [];
    cmp.sendMessage();
    expect(cmp.chat.length).toBe(0);
  });

  it('should call scrollToBottom after sending a message', fakeAsync(() => {
    const cmp = fixture.debugElement.children[0].componentInstance as NPCDialogueComponent;
    jest.spyOn(cmp, 'scrollToBottom');
    cmp.userInput = 'Test';
    // Mock interactWithNPC to return a Subject so we can control emission
    const subj = new Subject<string>();
    jest.spyOn(service, 'interactWithNPC').mockReturnValue(subj);
    cmp.sendMessage();
    // Fast-forward setTimeout
    tick();
    expect(cmp.scrollToBottom).toHaveBeenCalled();
    // Emit NPC response and check again
    subj.next('NPC response');
    subj.complete();
    tick();
    expect(cmp.scrollToBottom).toHaveBeenCalledTimes(2);
  }));

  it('should call scrollToBottom in ngOnInit', () => {
    const cmp = fixture.debugElement.children[0].componentInstance as NPCDialogueComponent;
    jest.spyOn(cmp, 'scrollToBottom');
    jest.useFakeTimers();
    cmp.ngOnInit();
    jest.runAllTimers();
    expect(cmp.scrollToBottom).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
