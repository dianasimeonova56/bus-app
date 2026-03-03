export interface Booking {
    _id?: String;
    passenger: String | undefined,
    trip: String | null,
    totalPrice: number,
    departureStopId: string,
    destinationStopId: string
}