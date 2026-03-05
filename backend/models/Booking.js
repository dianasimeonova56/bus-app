import { Schema, model, Types } from 'mongoose';

const bookingSchema = new Schema({
    passenger: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    trip: {
        type: Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    totalPrice: {
        type: Number
    },
    paymentIntentId: {
        type: String
    },
    purchaseDate:
    {
        type: Date,
        default: Date.now
    },
    departureStopId:
    {  
        type: Types.ObjectId,
        ref: 'Stop',
        required: true
    },
    destinationStopId: 
    { 
        type: Types.ObjectId,
        ref: 'Stop',
        required: true
    },
    tickets: [{
        type: Types.ObjectId,
        ref: 'Ticket',
        required: true
    }],
    status: {
        type: String,
        enum: ['pending', 'reserved', 'active', 'passed']
    },
    seats: {
        type: Number
    }
})

const Booking = model('Booking', bookingSchema)

export default Booking;