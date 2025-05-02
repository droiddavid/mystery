// create-mystery.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMysteryComponent } from './create-mystery.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MysteryService } from '../../services/mystery.service';
import { of, throwError } from 'rxjs';
import { Mystery } from '../../models/mystery.model';
import { provideHttpClient } from '@angular/common/http';


describe('CreateMysteryComponent', () => {
  let component: CreateMysteryComponent;
  let fixture: ComponentFixture<CreateMysteryComponent>;
  let mockService: MysteryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMysteryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), MysteryService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMysteryComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(MysteryService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateMystery() and handle success', () => {
    const mockResponse: Mystery = {
      title: 'Mock Title',
      // description: 'Mock Description',
      summary: 'Mock Summary',
      setting: {
        name: 'Mock Setting',
        description: 'Mock Setting Description',
        locationType: 'Mock Location Type',
      },
      difficulty: 'Beginner',
      characters: [],
      clues: [],
      solution: {
        suspect: 'Mock Suspect',
        method: 'Mock Method',
        motive: 'Mock Motive',
        reveal: 'Mock Reveal',
        discoveredBy: '',
      },
      timeline: [{
        time: 'Mock Time',
        description: 'Mock Description',
        involvedCharacters: ['Mock Character'],
       }],
      locations: [{
        locationName: 'Location Name Mock',
        type: 'Mock Type',
        details: 'Mock Details',
        description: 'Mock Description',
        relevantClues: ['Mock Clue'],
      }],
    };

    jest.spyOn(mockService, 'generateMystery').mockReturnValue(of(mockResponse));

    component.generateMystery();

  });

  it('should log error if generateMystery() fails', () => {
    const error = new Error('Generation failed');
    console.error = jest.fn();

    jest.spyOn(mockService, 'generateMystery').mockReturnValue(throwError(() => error));

    component.generateMystery();

    expect(console.error).toHaveBeenCalledWith('Error generating mystery:', error);
  });

});