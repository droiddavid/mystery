import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftSidebarComponent } from './left-sidebar.component';

describe('LeftSidebarComponent', () => {
  let component: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSidebarComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(LeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render sidebar menu', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.left-sidebar')).toBeTruthy();
  });
});
