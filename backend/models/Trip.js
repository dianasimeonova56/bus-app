import { Schema, model } from 'mongoose';

const tripSchema = new Schema({
    route: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    departureTime: String,
    arrivalTime: String,
    stops: [{
        type: mongoose.Schema.Types.ObjectId, 
        arrivalTime: String,
        departureTime: String,
        order: Number
    }],
    transportOperator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransportOperator',
        required: true
    },
})

const Trip = model('Trip', tripSchema)

export default Trip;