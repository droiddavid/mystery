import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { MysteryService } from './mystery.service';
import { Mystery } from '../models/mystery.model';
import { MysteryInput } from '../models/mysteryInput.model';

describe('MysteryService', () => {
  let service: MysteryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), MysteryService],
    });

    service   = TestBed.inject(MysteryService);
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createMystery() should POST and return expected data', () => {
    const mockData = { 
      title: 'Mystery Title',
      summary: 'Mystery Summary',
      setting: {
        name: 'Setting Name',
        description: 'Setting Description',
        locationType: 'Urban'
      },
      difficulty: 'Medium',
      characters: [],
      clues: [],
      solution: {
        suspect: 'Suspect',
        method: 'Method',
        motive: 'Motive',
        reveal: 'Reveal',
        discoveredBy: ''
      },
      timeline: [],
      locations: []
    } as Mystery;

    service.createMystery(mockData).subscribe((resp) => {
      expect(resp).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/mystery/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockData);
  });

  it('generateMystery() should POST and return expected data', () => {
    const input  = { 
      theme: 'Dark Alley',
      setting: {
        name: 'Alleyway',
        description: 'Narrow and eerie',
        locationType: 'Urban'
      },
      characters: ['Jax'],
      difficulty: 'Hard'
    } as MysteryInput;
    
    const output = { 
      title: 'Generated Title',
      summary: 'Auto summary',
      setting: input.setting,
      difficulty: input.difficulty,
      characters: [],
      clues: [],
      solution: {
        suspect: 'Someone',
        method: 'Something',
        motive: 'Unknown',
        reveal: 'Climactic',
        discoveredBy: ''
      },
      timeline: [],
      locations: []
    } as Mystery;

    service.generateMystery(input).subscribe((resp) => {
      expect(resp).toEqual(output);
    });

    const req = httpMock.expectOne('/api/mystery/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush(output);
  });
});
