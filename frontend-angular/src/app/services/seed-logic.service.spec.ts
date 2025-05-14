import { TestBed } from '@angular/core/testing';
import { SeedLogicService } from './seed-logic.service';
import { MysteryInput } from '../models/mysteryInput.model';
import { provideHttpClient } from '@angular/common/http';

describe('SeedLogicService', () => {
  let service: SeedLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        SeedLogicService
      ]
    });
    service = TestBed.inject(SeedLogicService);
  });

  it('should generate MysteryInput from player responses', () => {
    const input = { playerName: 'Alex', mysteryType: 'heist', mood: 'tense' };
    const result = service.createSeed(input);

    expect(result.theme).toBe('heist');
    expect(result.difficulty).toBe('Intermediate');
    expect(result.characters).toEqual(['Alex']);
    expect(result.setting).toBeDefined();
    expect(result.setting.name).toBe('The Hollow Raven Inn');
  });

  it('should default to the correct setting structure', () => {
    const input = { playerName: 'Jamie', mysteryType: 'murder', mood: 'dark' };
    const result = service.createSeed(input);

    expect(result.setting).toEqual({
      name: "The Hollow Raven Inn",
      description: "The air is thick with the scent of old ale and woodsmoke.",
      locationType: "The Hollow Raven Inn"
    });
  });
});