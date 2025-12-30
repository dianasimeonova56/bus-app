import { Stop } from "./stop.model";

export interface Route {
    startStopId: Stop,
    endStopId: Stop,
    distance: Number,
    durationMinutes: Number,
    days: string[],
    sector: Number,
    stops: Stop[],
    transportOperator: String,
    buses: []
}