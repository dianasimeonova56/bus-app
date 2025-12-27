import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passenger',
        required: true
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    seatNumber: {
        type: Number
    },
    seatNumber: {
        type: price
    },
    purchaseDate:
    {
        type: Date,
        default: Date.now
    },
    departureStopId:
        { type: mongoose.Schema.Types.ObjectId },
    destinationStopId: { type: mongoose.Schema.Types.ObjectId },
})

const Ticket = model('Ticket', ticketSchema)

export default Ticket;