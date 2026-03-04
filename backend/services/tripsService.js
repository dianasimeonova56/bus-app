import Trip from '../models/Trip.js';
import mongoose from 'mongoose';
export default {
    getAll() {
        return Trip.find();
    },
    async getOne(tripId){
        const updatedTrip = await Trip.findById(tripId)
            .populate('route', {path: 'route',
                populate: { path: 'startStop.stopId endStop.stopId stops.stopId' }});
        console.log(updatedTrip);
        
        return updatedTrip;
    },
    async cancel(tripId){
        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            { status: 'cancelled' }, 
            { new: true }
        );
        return updatedTrip;
    },

}