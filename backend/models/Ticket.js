import { Schema, model, Types } from 'mongoose';

const ticketSchema = new Schema({
    passenger: {
        type: Types.ObjectId,
        ref: 'Passenger',
        required: true
    },
    trip: {
        type: Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    seatNumber: {
        type: Number
    },
    price: {
        type: Number
    },
    purchaseDate:
    {
        type: Date,
        default: Date.now
    },
    departureStopId:
    {  
        type: Types.ObjectId 
    },
    destinationStopId: 
    { 
        type: Types.ObjectId 
    },
})

const Ticket = model('Ticket', ticketSchema)

export default Ticket;