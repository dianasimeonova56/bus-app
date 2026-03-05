import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import Trip from '../models/Trip.js';
import Stripe from 'stripe';
import 'dotenv/config';

export default {
    async createBooking(bookingData) {
        const trip = await Trip.findById(bookingData.trip);
        if (!trip) throw new Error('Trip not found');

        if (new Date(trip.date) < new Date()) {
            throw new Error('Cannot book past trip');
        }

        if (trip.availableSeats < bookingData.seats) {
            throw new Error(`Not enough seats. Only ${trip.availableSeats} available`);
        }

        const booking = new Booking({
            passenger: bookingData.user,
            trip: trip._id,
            seats: bookingData.seats,
            totalPrice: bookingData.totalPrice,
            status: 'pending',
            departureStopId: bookingData.departureStopId,
            destinationStopId: bookingData.destinationStopId
        });

        await booking.save();
        const lastTicket = await Ticket.findOne({
            tripId: trip.id,
            status: { $in: ['active', 'reserved'] }
        }).sort({ seatNumber: -1 });
        const startSeat = lastTicket ? lastTicket.seatNumber + 1 : 1;

        const ticketsToCreate = [];
        for (let seatNum = startSeat; seatNum < startSeat + booking.seats; seatNum++) {
            ticketsToCreate.push({
                passenger: bookingData.user,
                trip: trip._id,
                booking: booking._id,
                seatNumber: seatNum,
                price: bookingData.totalPrice / bookingData.seats,
                status: 'reserved'
            })
        }

        const tickets = await Ticket.insertMany(ticketsToCreate);

        return { booking, tickets };
    },
    async createCheckoutSession(booking, tickets) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
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
       
        

        if (booking.status === 'active') return booking;


        const trip = await Trip.findById(booking.trip);
        if (!trip) throw new Error('Trip not found');


        booking.status = 'active';
        await booking.save();
        console.log("Booking after checkout completed", booking);

        await Ticket.updateMany(
            { booking: booking._id },
            { status: 'active' }
        );

        trip.availableSeats -= booking.seats;
        await trip.save();

        console.log(`Booking ${bookingId} completed. Remaining seats: ${trip.availableSeats}`);

        return booking;
    }
};