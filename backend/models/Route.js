import { Schema, model, Types } from 'mongoose';

const routeSchema = new Schema({
    startStop: {
        stopId: {
            type: Types.ObjectId,
            ref: 'Stop',
            required: true
        },
        sector: Number
    },
    endStop: {
        stopId: {
            type: Types.ObjectId,
            ref: 'Stop',
            required: true
        },
        sector: Number
    },
    distance: Number,
    duration: String,
    startHour: String,
    arrivalHour: String,
    days: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    stops: [{
        stopId: {
            type: Types.ObjectId,
            ref: 'Stop',
            required: true
        },
        sector: Number,
        arrivalTime: String,
        departureTime: String,
        order: Number
    }],
    transportOperator: {
        type: Types.ObjectId,
        ref: 'TransportOperator',
        required: true
    }
})

const Route = model('Route', routeSchema)

export default Route;