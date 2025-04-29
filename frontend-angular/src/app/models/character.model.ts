import { Alibi } from "./alibi.model";

export interface Character {
    name: string;
    secrets: string[];
    motive: string;
    alibi: Alibi;
    role: string; // suspect, witness, etc.
    personality: string;
    knowledge: string;
    connections: string[];
}
