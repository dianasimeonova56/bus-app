import { Schema, model, Types } from 'mongoose';

const routeSchema = new Schema({
    startStopId: {
        type: Types.ObjectId,
    },
    endStopId: {
        type: Types.ObjectId,
    },
    distance: Number,
    durationMinutes: Number,
    days: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    stops: [{
        type: Types.ObjectId, 
        arrivalTime: String,
        departureTime: String,
        order: Number
    }],
    transportOperator: {
        type: Types.ObjectId,
        ref: 'TransportOperator',
        required: true
    },
    buses: [
        {
            type: Types.ObjectId,
            ref: 'Bus'
        }
    ]
})

const Route = model('Route', routeSchema)

export default Route;