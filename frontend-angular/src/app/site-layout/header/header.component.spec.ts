import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleLeftSidebar when toggleLeft is called', () => {
    const spy = jest.spyOn(component.toggleLeftSidebar, 'emit');
    component.toggleLeft();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit toggleRightSidebar when toggleRight is called', () => {
    const spy = jest.spyOn(component.toggleRightSidebar, 'emit');
    component.toggleRight();
    expect(spy).toHaveBeenCalled();
  });
});
