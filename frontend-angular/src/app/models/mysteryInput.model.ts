import { Setting } from "./setting.model";

// mystery-input.model.ts
export interface MysteryInput {
    theme: string;
    setting: Setting;
    characters: string[];
    difficulty: string;
  }
  