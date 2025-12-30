import { Schema, model, Types } from 'mongoose';

const routeSchema = new Schema({
    startStopId: {
        type: Types.ObjectId,
        ref: 'Stop'
    },
    endStopId: {
        type: Types.ObjectId,
        ref: 'Stop'
    },
    distance: Number,
    durationMinutes: Number,
    days: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    sector: {
        type: Number,
    },
    stops: [{
        stopId: {
            type: Types.ObjectId,
            ref: 'Stop'
        },
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