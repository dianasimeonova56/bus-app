import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import Trip from '../models/Trip.js';
import 'dotenv/config';
import Stripe from '../index.js'

export default {
    async createBooking(bookingData) {
        const trip = await Trip.findById(bookingData.trip);
        if (!trip) throw new Error('Trip not found');

        if (new Date(trip.playDate) < new Date()) {
            throw new Error('Cannot book past trip');
        }

        if (trip.availableSeats < bookingData.seats.length) {
            throw new Error(`Not enough seats. Only ${trip.availableSeats} available`);
        }

        trip.availableSeats -= bookingData.seats.length;
        await trip.save();

        const booking = new Booking({
            passenger: bookingData.user,
            trip: trip._id,
            seats: bookingData.seats,
            totalPrice: bookingData.totalPrice,
            status: 'pending'
        });

        await booking.save();

        const tickets = [];
        for (let seat of bookingData.seats) {
            const ticket = await Ticket.create({
                passenger: bookingData.user,
                trip: trip._id,
                booking: booking._id,
                seatNumber: seat,
                price: bookingData.totalPrice / bookingData.seats.length,
                status: 'reserved'
            });
            tickets.push(ticket);
        }

        return { booking, tickets };
    },
    async createCheckoutSession(booking, tickets) {
        const session = await Stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: tickets.map((ticket, i) => ({
                price_data: {
                    currency: 'eur',
                    product_data: { name: `Trip ${ticket.trip} - Seat ${ticket.seatNumber}` },
                    unit_amount: Math.round(ticket.price * 100)
                },
                quantity: 1
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
            metadata: { bookingId: booking._id.toString() }
        });

        return session;
    },
    async handleCheckoutCompleted(bookingId) {
        const booking = await Booking.findById(bookingId);
        if (!booking) throw new Error('Booking not found');

        booking.status = 'active';
        await booking.save();

        await Ticket.updateMany(
            { booking: booking._id },
            { status: 'active' }
        );

        return booking;
    }
};