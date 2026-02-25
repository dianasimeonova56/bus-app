import { Schema, model, Types } from 'mongoose';

const tripSchema = new Schema({
    route: { type: Types.ObjectId, ref: 'Route', required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'active', 'cancelled', 'completed'],
        default: 'scheduled'
    },
    delayMinutes: { type: Number, default: 0 },
    availableSeats: { type: Number }
})

const Trip = model('Trip', tripSchema)

export default Trip;