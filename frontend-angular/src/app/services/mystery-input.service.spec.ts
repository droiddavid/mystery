import { MysteryInputBuilderService } from './mystery-input.service';
import { Setting } from '../models/setting.model';

describe('MysteryInputBuilderService', () => {
  let service: MysteryInputBuilderService;

  beforeEach(() => {
    service = new MysteryInputBuilderService();
  });

  it('should throw error if required fields are missing', () => {
    const baseSetting: Setting = { name: 'A', description: 'B', locationType: 'C' };
    expect(() => service.mysteryInputBuilder({ playerName: '', mysteryType: 'x', mood: 'y', setting: baseSetting })).toThrow('Missing required fields for MysteryInput');
    expect(() => service.mysteryInputBuilder({ playerName: 'a', mysteryType: '', mood: 'y', setting: baseSetting })).toThrow('Missing required fields for MysteryInput');
    expect(() => service.mysteryInputBuilder({ playerName: 'a', mysteryType: 'x', mood: '', setting: baseSetting })).toThrow('Missing required fields for MysteryInput');
  });

  it('should throw error if setting fields are missing', () => {
    const incompleteSetting: Setting = { name: '', description: 'desc', locationType: 'loc' };
    expect(() => service.mysteryInputBuilder({ playerName: 'a', mysteryType: 'b', mood: 'c', setting: incompleteSetting })).toThrow('Setting is incomplete for MysteryInput');
    const incompleteSetting2: Setting = { name: 'n', description: '', locationType: 'loc' };
    expect(() => service.mysteryInputBuilder({ playerName: 'a', mysteryType: 'b', mood: 'c', setting: incompleteSetting2 })).toThrow('Setting is incomplete for MysteryInput');
    const incompleteSetting3: Setting = { name: 'n', description: 'd', locationType: '' };
    expect(() => service.mysteryInputBuilder({ playerName: 'a', mysteryType: 'b', mood: 'c', setting: incompleteSetting3 })).toThrow('Setting is incomplete for MysteryInput');
  });

  it('should return a valid MysteryInput object when all fields are present', () => {
    const validSetting: Setting = { name: 'N', description: 'D', locationType: 'L' };
    const input = { playerName: 'P', mysteryType: 'M', mood: 'MOOD', setting: validSetting };
    const result = service.mysteryInputBuilder(input);
    expect(result).toEqual({
      playerName: 'P',
      mysteryType: 'M',
      mood: 'MOOD',
      setting: { name: 'N', description: 'D', locationType: 'L' }
    });
  });
});
