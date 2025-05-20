export interface MysteryLocation {
    locationName: string;
    type: string;
    LocationDetails: LocationDetails;
    description: string;
    relevantClues: string[];
}

export interface LocationDetails {
    ambience: string;
    lighting: string;
}
