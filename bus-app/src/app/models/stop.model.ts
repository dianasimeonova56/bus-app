export interface Stop {
    _id?: string;
    name: string;
    location: {
        type: string;
        coordinates: [number, number];
    },
    type: string,
    sectors?: number
}
