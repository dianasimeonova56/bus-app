import { Schema, model } from 'mongoose';

const routeSchema = new Schema({
    startStationId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    endStationId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    distance: Number,
    durationMinutes: Number,
    days: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
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
    buses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bus'
        }
    ]
})

const Route = model('Route', routeSchema)

export default Route;