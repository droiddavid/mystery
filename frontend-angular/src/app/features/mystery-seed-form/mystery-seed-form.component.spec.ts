import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MysterySeedFormComponent } from './mystery-seed-form.component';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
// import { HttpClient } from '@angular/common/http';
import { MysteryInputBuilderService } from '../../services/mystery-input.service';
import { MysteryService } from '../../services/mystery.service';
import { MysteryInput } from '../../models/mystery/mysteryInput.model';

describe('MysterySeedFormComponent', () => {
  let component: MysterySeedFormComponent;
  let fixture: ComponentFixture<MysterySeedFormComponent>;
  let mysteryInputBuilderService: MysteryInputBuilderService;
  let mysteryService: MysteryService;

  beforeEach(async () => {

    const mockSeedLogic = {
      mysteryInputBuilder: jest.fn()
    };

    const mockMysteryService = {
      generateMystery: jest.fn().mockReturnValue(of({
        title: 'Generated Mystery',
        summary: 'A thrilling mystery',
        setting: {
          name: 'The Hollow Raven Inn',
          description: 'The air is thick with the scent of old ale and woodsmoke.',
          locationType: 'The Hollow Raven Inn'
        },
        difficulty: 'Beginner',
        characters: [{
          name: 'David',
          secrets: ['secret1', 'secret2'],
          motive: 'Revenge',
          alibi: { time: '10:00 AM', location: 'The Hollow Raven Inn' },
          role: 'suspect',
          personality: 'Brooding',
          knowledge: 'Criminal Psychology',
          connections: ['Alex']
        }],
        clues: [{
          description: 'A bloody knife',
          location: 'The Hollow Raven Inn',
          discoveredBy: 'David',
          relevance: 'High',
          id: 'clue1',
          foundAt: '10:00 AM',
          reveals: 'The killer is someone close to the victim.'
        }],
        solution: {
          suspect: 'Unknown',
          method: 'Unknown',
          motive: 'Unknown',
          reveal: 'Unknown',
          discoveredBy: ''
        },
        timeline: [{
          time: '10:00 AM',
          description: 'The air is thick with the scent of old ale and woodsmoke.',
          involvedCharacters: ['David', 'Alex'],
        }],
        locations: [{
          locationName: 'The Hollow Raven Inn',
          type: 'Inn',
          LocationDetails: {
            ambience: 'cozy',
            lighting: 'warm'
          },
          description: 'The air is thick with the scent of old ale and woodsmoke.',
          relevantClues: ['clue1', 'clue2'],
        }]
      })),
    };
    await TestBed.configureTestingModule({
      imports: [MysterySeedFormComponent],
      providers: [
        provideHttpClient(),
        FormsModule,
        // SeedLogicService,
        // MysteryService
        
        { provide: MysteryInputBuilderService, useValue: mockSeedLogic },
        { provide: MysteryService, useValue: mockMysteryService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysterySeedFormComponent);
    component = fixture.componentInstance;
    mysteryInputBuilderService = TestBed.inject(MysteryInputBuilderService);
    mysteryService = TestBed.inject(MysteryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not proceed if form is invalid', () => {
    const form = { invalid: true } as NgForm;
    component.onSubmit(form);
    expect(mysteryInputBuilderService.mysteryInputBuilder).not.toHaveBeenCalled();
    expect(mysteryService.generateMystery).not.toHaveBeenCalled();
  });

  it('should call services when form is valid', () => {
    const form = { invalid: false } as NgForm;
    const mockSetting = {
      name: 'The Hollow Raven Inn',
      description: 'The air is thick with the scent of old ale and woodsmoke.',
      locationType: 'The Hollow Raven Inn'
    };
    component.selectedSetting = mockSetting;
    const seed: MysteryInput = {
      playerName: 'Alex',
      mysteryType: 'crime',
      mood: 'tense',
      setting: mockSetting
    };
    component.formData = {
      playerName: 'Alex',
      mysteryType: 'crime',
      mood: 'tense'
    };
    jest.spyOn(mysteryInputBuilderService, 'mysteryInputBuilder').mockReturnValue(seed);
    jest.spyOn(mysteryService, 'generateMystery').mockReturnValue(of({
      title: 'Generated Mystery',
      summary: 'A thrilling mystery',
      setting: seed.setting,
      difficulty: 'Beginner',
      characters: [{
        name: 'David',
        secrets: ['secret1', 'secret2'],
        motive: 'Revenge',
        alibi: { time: '10:00 AM', location: 'The Hollow Raven Inn', verifiedBy: 'Alex' },
        role: 'suspect',
        personality: 'Brooding',
        knowledge: 'Criminal Psychology',
        connections: ['Alex']
      }],
      clues: [{
        description: 'A bloody knife',
        location: 'The Hollow Raven Inn',
        discoveredBy: 'David',
        relevance: 'High',
        id: 'clue1',
        foundAt: '10:00 AM',
        reveals: 'The killer is someone close to the victim.'
      }],
      solution: {
        suspect: 'Unknown',
        method: 'Unknown',
        motive: 'Unknown',
        reveal: 'Unknown',
        discoveredBy: ''
      },
      timeline: [{
        time: '10:00 AM',
        description: 'The air is thick with the scent of old ale and woodsmoke.',
        involvedCharacters: ['David', 'Alex'],
      }],
      locations: [{
        locationName: 'The Hollow Raven Inn',
        type: 'Inn',
        LocationDetails: {
          ambience: 'cozy',
          lighting: 'warm'
        },
        description: 'The air is thick with the scent of old ale and woodsmoke.',
        relevantClues: ['clue1', 'clue2'],
      }]
    }));
    component.onSubmit(form);
    expect(mysteryInputBuilderService.mysteryInputBuilder).toHaveBeenCalledWith({ ...component.formData, setting: mockSetting });
    expect(mysteryService.generateMystery).toHaveBeenCalledWith(seed);
  });

  it('should update selectedSetting when onSettingSelected is called', () => {
    const mockSetting = {
      name: 'Ancient Library',
      description: 'Dusty shelves filled with forgotten books.',
      locationType: 'library'
    };

    expect(component.selectedSetting).toBeUndefined(); // Initially undefined

    component.onSettingSelected(mockSetting);

expect(component.selectedSetting).toEqual(mockSetting);
  });

  it('should render input fields for playerName, mysteryType, and mood', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[name="playerName"]')).toBeTruthy();
    expect(compiled.querySelector('select[name="mysteryType"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="mood"]')).toBeTruthy();
  });

  it('should disable submit button when form is invalid', async () => {
    component.formData = { playerName: '', mysteryType: '', mood: '' };
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should not submit if setting is not selected', () => {
    const form = { invalid: false } as NgForm;
    component.selectedSetting = undefined;
    component.onSubmit(form);
    expect(mysteryInputBuilderService.mysteryInputBuilder).not.toHaveBeenCalled();
    expect(mysteryService.generateMystery).not.toHaveBeenCalled();
  });

  it('should set mystery after successful generateMystery', () => {
    const form = { invalid: false } as NgForm;
    const mockSetting = {
      name: 'Test Setting',
      description: 'desc',
      locationType: 'type'
    };
    component.selectedSetting = mockSetting;
    component.formData = { playerName: 'A', mysteryType: 'crime', mood: 'tense' };
    const mockSeed = { test: 'seed' };
    const mockMystery = { title: 'Mystery!' };
    (mysteryInputBuilderService.mysteryInputBuilder as jest.Mock).mockReturnValue(mockSeed);
    (mysteryService.generateMystery as jest.Mock).mockReturnValue(of(mockMystery));
    component.onSubmit(form);
    expect(mysteryInputBuilderService.mysteryInputBuilder).toHaveBeenCalledWith({ ...component.formData, setting: mockSetting });
    expect(mysteryService.generateMystery).toHaveBeenCalledWith(mockSeed);
    expect(component.mystery).toEqual(mockMystery);
  });

});

