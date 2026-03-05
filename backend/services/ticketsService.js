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
}