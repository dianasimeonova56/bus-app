export interface RoutePopulated {
    _id?: string;
    startStop: {
        stopId: PopulatedStop;
        sector: number;
    };
    endStop: {
        stopId: PopulatedStop;
        sector: number;
    };
    distance: number;
    duration: string;
    days: string[];
    stops: {
        stopId: PopulatedStop;
        arrivalTime: string;
        departureTime: string;
        order: number;
        sector: number;
    }[];
    transportOperator: string;
    startHour: string;
    arrivalHour: string;
    oneWayTicketPrice: number;
    twoWayTicketPrice: number;
}

export interface PopulatedStop {
    _id: string;
    name: string;
    sectors: number;
    type: string;
    address?: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
}