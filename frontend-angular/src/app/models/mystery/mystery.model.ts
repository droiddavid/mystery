import { Character } from "../character.model";
import { Clue } from "../clue.model";
import { Setting } from "../setting.model";
import { Solution } from "../solution.model";
import { MysteryLocation } from "./mystery-location.model";
import { TimelineEvent } from "../timeline-event.model";

// src/app/models/mystery.model.ts
export interface Mystery {
  title: string;
  summary: string;
  setting: Setting;
  difficulty: string; // 'Beginner' | 'Intermediate' | 'Expert';
  characters: Character[];
  clues: Clue[];
  timeline: TimelineEvent[];
  locations: MysteryLocation[]; // Location[];
  solution: Solution;
}