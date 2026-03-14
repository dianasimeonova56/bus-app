import { User } from "./user.model";
import { Stop } from "./stop.model";
import { Trip } from "./trip.model";

export interface Ticket {
    _id?: string;
    user: User,
    trip: Trip,
    seatNumber: Number,
    price: Number,
    purchaseDate: Date,
    departureStopId: Stop,
    destinationStopId: Stop,
    status: String
}