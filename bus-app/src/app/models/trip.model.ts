import { Route } from "./route.model";
import { Stop } from "./stop.model";
import { TransportOperator } from "./transportOperator.model";

export interface Trip {
    route: Route,
    date: Date,
    departureTime: String,
    arrivalTime: String,
    stops: Stop[],
    transportOperator: TransportOperator
}