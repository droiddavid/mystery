import { Injectable } from '@angular/core';
import { MysteryInput } from '../models/mysteryInput.model';
import { Setting } from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class MysteryInputBuilderService {
  mysteryInputBuilder(formDataAndSetting: {
    playerName: string;
    mysteryType: string;
    mood: string;
    setting: Setting;
  }): MysteryInput {
    // Basic validation
    if (!formDataAndSetting.playerName || !formDataAndSetting.mysteryType || !formDataAndSetting.mood) {
      throw new Error('Missing required fields for MysteryInput');
    }
    if (!formDataAndSetting.setting || !formDataAndSetting.setting.name || !formDataAndSetting.setting.description || !formDataAndSetting.setting.locationType) {
      throw new Error('Setting is incomplete for MysteryInput');
    }

    // Return the object in the exact shape expected by the backend
    return {
      playerName: formDataAndSetting.playerName,
      mysteryType: formDataAndSetting.mysteryType,
      mood: formDataAndSetting.mood,
      setting: {
        name: formDataAndSetting.setting.name,
        description: formDataAndSetting.setting.description,
        locationType: formDataAndSetting.setting.locationType
      }
    };
  }
}
