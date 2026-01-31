export interface RoutePopulated {
    _id?: String;
    startStop: {
        stopId: {
            _id: string,
            location: [],
            name: string,
            sectors: number, 
            type: string
        };
        sector: number;
    };
    endStop: {
        stopId: {
            _id: string,
            location: [],
            name: string,
            sectors: number, 
            type: string
        };
        sector: number;
    };
    distance: Number;
    duration: String;
    days: String[];
    stops: {
        stopId: {
            _id: string,
            location: [],
            name: string,
            sectors: number, 
            type: string
        };
        arrivalTime: string;
        departureTime: string;
        order: number;
        sector: number;
    }[];
    transportOperator: string;
    startHour: String;
    arrivalHour: String;
}