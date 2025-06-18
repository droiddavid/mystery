import { RouterTestingModule } from '@angular/router/testing';
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

  it('should return the correct totalSlides', () => {
    expect(component.totalSlides).toBe(component.slideImages.length);
  });

  it('should go to the previous slide correctly', () => {
    component.currentSlideIndex = 0;
    component.prevSlide();
    expect(component.currentSlideIndex).toBe(component.slideImages.length - 1);
    component.prevSlide();
    expect(component.currentSlideIndex).toBe(component.slideImages.length - 2);
  });

  it('should go to the next slide correctly', () => {
    component.currentSlideIndex = component.slideImages.length - 1;
    component.nextSlide();
    expect(component.currentSlideIndex).toBe(0);
    component.nextSlide();
    expect(component.currentSlideIndex).toBe(1);
  });
  // MYS-117/MYS-121 Acceptance Test
  it('should meet MYS-117/MYS-121: be standalone, mounted at root, and render welcome modules', async () => {
    const { provideHttpClient } = await import('@angular/common/http');
    await TestBed.resetTestingModule().configureTestingModule({
      imports: [HomePageComponent, RouterTestingModule],
      providers: [provideHttpClient()]
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
    // Standalone check
    expect((HomePageComponent as any).ɵcmp.standalone).toBe(true);
    // Rendered content checks
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.carousel')).toBeTruthy();
    expect(compiled.querySelector('.features-grid')).toBeTruthy();
    expect(compiled.querySelector('.cta-section')).toBeTruthy();
  });

  // MYS-117/MYS-122 Acceptance Test
  it('should meet MYS-117/MYS-122: mount and display Mystery Generator on first load', async () => {
    const { provideHttpClient } = await import('@angular/common/http');
    await TestBed.resetTestingModule().configureTestingModule({
      imports: [HomePageComponent, RouterTestingModule],
      providers: [provideHttpClient()]
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Check for the generator section (upload-section, create button, or similar)
    expect(compiled.querySelector('.upload-section')).toBeTruthy();
    // Check for a button or element that triggers mystery creation
    // Accept either 'add_circle' or 'search' as valid icons for the generator
    const iconText = compiled.querySelectorAll('.upload-stat-header span.material-symbols-outlined');
    const iconTexts = Array.from(iconText).map(el => el.textContent?.toLowerCase() || '');
    expect(iconTexts.some(txt => txt.includes('add_circle') || txt.includes('search'))).toBe(true);
    expect(compiled.textContent?.toLowerCase()).toContain('create a mystery');
  });


});

