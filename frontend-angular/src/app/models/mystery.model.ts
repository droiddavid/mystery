// src/app/models/mystery.model.ts
export interface Mystery {
  title: string;
  summary: string;
  setting: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  characters: Character[];
  clues: Clue[];
  timeline: TimelineEvent[];
  locations: Location[];
  solution: string;
}

export interface Character {
  name: string;
  role: string; // suspect, witness, etc.
  personality: string;
  knowledge: string;
  secrets?: string[];
  connections: string[];
}

export interface Clue {
  id: string;
  description: string;
  foundAt: string;
  reveals: string;
}

export interface TimelineEvent {
  time: string;
  description: string;
  involvedCharacters: string[];
}

export interface Location {
  name: string;
  description: string;
  relevantClues: string[];
}
