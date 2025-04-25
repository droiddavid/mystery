import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMysteryComponent } from './create-mystery.component';

describe('CreateMysteryComponent', () => {
  let component: CreateMysteryComponent;
  let fixture: ComponentFixture<CreateMysteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMysteryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMysteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
