import express from 'express';
import Trip from '../models/Trip.js';

const tripsController = express.Router();

tripsController.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate({
                path: 'route',
                populate: { path: 'startStop.stopId endStop.stopId stops.stopId transportOperator' }
            });
        res.json(trip);
    } catch (err) {
        res.status(404).json({ message: 'Trip not found' });
    }
});

tripsController.patch('/:id/cancel', async (req, res) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id, 
            { status: 'cancelled' }, 
            { new: true }
        );
        res.json(updatedTrip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default tripsController;