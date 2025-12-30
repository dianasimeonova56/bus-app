import { Passenger } from "./passenger.model";
import { Stop } from "./stop.model";
import { Trip } from "./trip.model";

export interface Ticket {
    passenger: Passenger,
    trip: Trip,
    seatNumber: Number,
    price: Number,
    purchaseDate: Date,
    departureStopId: Stop,
    destinationStopId: Stop
}