import { MysteryStoreService } from './mystery-store.service';
import { Mystery } from '../models/mystery.model';

describe('MysteryStoreService', () => {
  let service: MysteryStoreService;
  const mockMystery: Mystery = {
    title: 'Test Mystery',
    summary: 'A test summary',
    setting: { name: 'Test Place', description: 'desc', locationType: 'type' },
    difficulty: 'Easy',
    characters: [],
    clues: [],
    solution: { suspect: '', method: '', motive: '', reveal: '', discoveredBy: '' },
    timeline: [],
    locations: []
  };

  beforeEach(() => {
    service = new MysteryStoreService();
  });

  it('should emit null by default', (done) => {
    service.getMystery().subscribe(val => {
      expect(val).toBeNull();
      done();
    });
  });

  it('should set and emit a mystery', (done) => {
    service.setMystery(mockMystery);
    service.getMystery().subscribe(val => {
      expect(val).toEqual(mockMystery);
      done();
    });
  });

  it('should return the current snapshot', () => {
    expect(service.getSnapshot()).toBeNull();
    service.setMystery(mockMystery);
    expect(service.getSnapshot()).toEqual(mockMystery);
  });

  it('should clear the mystery', (done) => {
    service.setMystery(mockMystery);
    service.clear();
    service.getMystery().subscribe(val => {
      expect(val).toBeNull();
      done();
    });
  });
});
