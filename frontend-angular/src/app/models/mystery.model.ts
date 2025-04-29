import { Character } from "./character.model";
import { Clue } from "./clue.model";
import { Setting } from "./setting.model";
import { Solution } from "./solution.model";
import { MysteryLocation } from "./location.model";

// src/app/models/mystery.model.ts
export interface Mystery {
  title: string;
  summary: string;
  setting: Setting;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  characters: Character[];
  clues: Clue[];
  timeline: TimelineEvent[];
  locations: MysteryLocation[]; // Location[];
  solution: Solution;
}

export interface TimelineEvent {
  time: string;
  description: string;
  involvedCharacters: string[];
}
