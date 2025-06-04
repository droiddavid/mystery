import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { MysteryService } from './mystery.service';
import { Mystery } from '../models/mystery/mystery.model';
import { MysteryInput } from '../models/mystery/mysteryInput.model';

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
      playerName: 'Jax',
      mysteryType: 'Dark Alley',
      mood: 'tense',
      setting: {
        name: 'Alleyway',
        description: 'Narrow and eerie',
        locationType: 'Urban'
      }
    } as MysteryInput;
    
    const output = { 
      title: 'Generated Title',
      summary: 'Auto summary',
      setting: input.setting,
      difficulty: 'Hard',
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

    it('generateMystery() should auto-fill solution if missing', () => {
    const input: MysteryInput = {
      playerName: 'Jax',
      mysteryType: 'Dark Alley',
      mood: 'tense',
      setting: {
        name: 'Alleyway',
        description: 'Narrow and eerie',
        locationType: 'Urban'
      }
    };
    // Simulate backend response with no solution
    const backendMystery: Mystery = {
      title: 'Generated Title',
      summary: 'Auto summary',
      setting: input.setting,
      difficulty: 'Hard',
      characters: [{ name: 'Jax' }],
      clues: [],
      timeline: [],
      locations: []
      // no solution
    } as any;

    service.generateMystery(input).subscribe((resp) => {
      expect(resp.solution).toBeDefined();
      expect(resp.solution.suspect).toBe('Jax');
      expect(resp.solution.method).toBe('Unknown');
      expect(resp.solution.motive).toBe('Unknown');
      expect(resp.solution.reveal).toBe('The truth is revealed at dawn');
      expect(resp.solution.discoveredBy).toBe('');
    });

    const req = httpMock.expectOne('/api/mystery/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush(backendMystery);
  });

    it('generateMystery() should auto-fill solution with fallback values', () => {
    const input: MysteryInput = {
      playerName: 'Jax',
      mysteryType: 'Dark Alley',
      mood: 'tense',
      setting: {
        name: '', // triggers fallback for settingName
        description: 'Narrow and eerie',
        locationType: 'Urban'
      }
    };
    // Simulate backend response with no solution and no characters
    const backendMystery: Mystery = {
      title: 'Generated Title',
      summary: 'Auto summary',
      setting: input.setting,
      difficulty: 'Hard',
      characters: [], // triggers fallback for suspect/discoveredBy
      clues: [],
      timeline: [],
      locations: []
      // no solution
    } as any;

    service.generateMystery(input).subscribe((resp) => {
      expect(resp.solution).toBeDefined();
      expect(resp.solution.suspect).toBe('Caretaker');
      expect(resp.solution.method).toBe('Unknown');
      expect(resp.solution.motive).toBe('Unknown');
      expect(resp.solution.reveal).toBe('The truth is revealed at dawn');
      expect(resp.solution.discoveredBy).toBe('');
      // Also check that clues and timeline use 'the scene' as fallback
      expect(resp.clues[0].description).toContain('the scene');
      expect(resp.timeline[0].description).toContain('the scene');
    });

    const req = httpMock.expectOne('/api/mystery/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush(backendMystery);
  });

});
