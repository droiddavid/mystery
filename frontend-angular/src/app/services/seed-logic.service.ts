import { Injectable } from '@angular/core';
import { MysteryInput } from '../models/mysteryInput.model';
import { Setting } from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SeedLogicService {
  createSeed(playerResponses: {
    playerName: string;
    mysteryType: string;
    mood: string;
    setting?: Setting; // optional, to allow fallback
  }): MysteryInput {
    // Generate values from playerResponses
    const theme = playerResponses.mysteryType;
    const difficulty = 'Intermediate'; // You may generate this dynamically
    const characters = [playerResponses.playerName];
    
    // Dummy placeholder for Setting — you should replace with logic or default
    const setting: Setting = {
      name: "The Hollow Raven Inn",
      description: "The air is thick with the scent of old ale and woodsmoke.",
      locationType: "The Hollow Raven Inn"
    };

    return {
      theme,
      difficulty,
      characters,
      setting
    };
  }
}
