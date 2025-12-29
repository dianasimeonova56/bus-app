export interface Stop {
    name: string;
    location: {
        type: string;
        coordinates: [number, number];
    }
}
