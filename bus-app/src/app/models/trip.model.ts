import { RoutePopulated } from "./routePopulated.model";

export interface Trip {
    _id?: string;
    route: RoutePopulated;
    date: Date | string;
    status: 'scheduled' | 'active' | 'cancelled' | 'completed';
    delayMinutes: number;
    availableSeats: number;
}