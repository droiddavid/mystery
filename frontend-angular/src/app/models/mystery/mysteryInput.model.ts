import { Setting } from "../setting.model";

// mystery-input.model.ts
export interface MysteryInput {
  playerName: string;
  mysteryType: string;
  mood: string;
  setting: {
    name: string;
    description: string;
    locationType: string;
  };
}
  