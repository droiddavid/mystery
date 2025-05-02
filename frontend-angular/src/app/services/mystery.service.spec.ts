// mystery.service.spec.ts
import { MysteryService } from './mystery.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Mystery } from '../models/mystery.model';
import { MysteryInput } from '../models/mysteryInput.model';


describe('MysteryService', () => {
  let service: MysteryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),provideHttpClientTesting(), MysteryService],
    });
    service = TestBed.inject(MysteryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createMystery() and return expected data', () => {
    const mockData: Mystery = {
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

    service.createMystery(mockData).subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/mystery/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockData);
  });

  it('should call generateMystery() and return expected data', () => {
    const mockData: MysteryInput = {
      theme: 'Mock Theme',
      setting: {
        name: 'Mock Name',
        description: 'Mock Description',
        locationType: 'Mock Location Type'
      },
      characters: ['Mock Character'],
      difficulty: 'Beginner',
    };
    const mockResponse: Mystery = {
      title: 'Generated Mystery',
      summary: 'Some summary',
      setting: mockData.setting,
      difficulty: mockData.difficulty,
      characters: [],
      clues: [],
      solution: {
        suspect: 'Someone',
        method: 'Some method',
        motive: 'Some motive',
        reveal: 'Some reveal',
        discoveredBy: ''
      },
      timeline: [],
      locations: []
    };
  
    service.generateMystery(mockData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne('/api/mystery/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockResponse);
  });
});
