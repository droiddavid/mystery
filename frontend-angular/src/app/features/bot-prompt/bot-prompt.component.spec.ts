import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotPromptComponent } from './bot-prompt.component';

describe('BotPromptComponent', () => {
  let component: BotPromptComponent;
  let fixture: ComponentFixture<BotPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotPromptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
