import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    const { provideHttpClient } = await import('@angular/common/http');
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle showLeftSidebar when onToggleLeftSidebar is called', () => {
    const initial = component.showLeftSidebar;
    component.onToggleLeftSidebar();
    expect(component.showLeftSidebar).toBe(!initial);
  });

  it('should toggle showRightSidebar when onToggleRightSidebar is called', () => {
    const initial = component.showRightSidebar;
    component.onToggleRightSidebar();
    expect(component.showRightSidebar).toBe(!initial);
  });

  it('should call mysteryService.createMystery and log on success', () => {
    const mockMystery = { title: 'Test', summary: '', setting: {}, difficulty: '', solution: {}, characters: [], clues: [], timeline: [], locations: [] };
    const mockResponse = { success: true };
    // Patch the private property using bracket notation
    (component as any).mysteryService = { createMystery: jest.fn().mockReturnValue({ subscribe: (handlers: any) => handlers.next(mockResponse) }) };
    console.log = jest.fn();
    component.createMystery = HomePageComponent.prototype.createMystery;
    component.createMystery();
    expect((component as any).mysteryService.createMystery).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Mystery submitted:', mockResponse);
  });

  it('should log user input on submission', () => {
    component.botPromptText = 'Test input';
    console.log = jest.fn();
    component.onUserSubmit();
    expect(console.log).toHaveBeenCalledWith('User submitted:', 'Test input');
  });






  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle showLeftSidebar when onToggleLeftSidebar is called', () => {
    const initial = component.showLeftSidebar;
    component.onToggleLeftSidebar();
    expect(component.showLeftSidebar).toBe(!initial);
  });

  it('should toggle showRightSidebar when onToggleRightSidebar is called', () => {
    const initial = component.showRightSidebar;
    component.onToggleRightSidebar();
    expect(component.showRightSidebar).toBe(!initial);
  });

  it('should call mysteryService.createMystery and log on success', () => {
    const mockMystery = { title: 'Test', summary: '', setting: {}, difficulty: '', solution: {}, characters: [], clues: [], timeline: [], locations: [] };
    const mockResponse = { success: true };
    // Patch the private property using bracket notation
    (component as any).mysteryService = { createMystery: jest.fn().mockReturnValue({ subscribe: (handlers: any) => handlers.next(mockResponse) }) };
    console.log = jest.fn();
    component.createMystery = HomePageComponent.prototype.createMystery;
    component.createMystery();
    expect((component as any).mysteryService.createMystery).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Mystery submitted:', mockResponse);
  });

  it('should call mysteryService.createMystery and log error on failure', () => {
    const mockMystery = { title: 'Test', summary: '', setting: {}, difficulty: '', solution: {}, characters: [], clues: [], timeline: [], locations: [] };
    const mockError = new Error('fail');
    (component as any).mysteryService = { createMystery: jest.fn().mockReturnValue({ subscribe: (handlers: any) => handlers.error(mockError) }) };
    console.error = jest.fn();
    component.createMystery = HomePageComponent.prototype.createMystery;
    component.createMystery();
    expect((component as any).mysteryService.createMystery).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error:', mockError);
  });
























});
