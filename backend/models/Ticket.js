import { Schema, model, Types } from 'mongoose';

const ticketSchema = new Schema({
    passenger: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    trip: {
        type: Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    status: {
        type: String,
        enum: ['cancelled', 'active', 'passed', 'reserved'],
        default: 'active'
    },
    booking: {
        type: Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Ticket = model('Ticket', ticketSchema)

export default Ticket;