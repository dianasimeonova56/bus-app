export interface Stop {
    _id?: string;
    name: string;
    address: string,
    location: {
        type: string;
        coordinates: [number, number];
    },
    type: string,
    sectors?: number
}
