import { Stop } from "./stop.model";
import { Ticket } from "./ticket.model";
import { Trip } from "./trip.model";

export interface PopulatedBooking {
    _id: string;
    passenger: String | undefined,
    trip: Trip,
    totalPrice: number,
    departureStopId: Stop,
    destinationStopId: Stop,
    tickets: Ticket[],
    status: String;
    seats: number
}