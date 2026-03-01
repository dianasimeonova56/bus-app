import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js'
import Trip from '../models/Trip.js';

export default {
    createTicket(ticketData, userId, tripId, bookingId) {
        return Ticket.create({ ...ticketData, passenger: userId, trip: tripId, booking: bookingId });
    },
    getAll() {
        const tickets = Ticket.find();

        return tickets;
    },
    async generateTicketsForBooking(bookingId) {
        const booking = await Booking.findById(bookingId);
        if (!booking) throw new Error("Booking not found!");

        const trip = await Trip.findById(booking.trip);
        if (!trip) throw new Error("Trip not found!");

        const ticketsToCreate = booking.seats.map(seatNumber => ({
            booking: booking._id,
            trip: booking.trip,
            passenger: booking.passenger,
            seatNumber,
            price: booking.totalPrice / booking.seats.length,
            status: "pending"
        }));

        const tickets = await Ticket.insertMany(ticketsToCreate);

        booking.tickets = tickets.map(t => t._id);
        await booking.save();

        return tickets;
    }
}