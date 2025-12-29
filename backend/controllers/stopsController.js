import express from 'express';
import Stop from '../models/Stop.js';

const stopsController = express.Router();

stopsController.post('/create-stop', async (req, res) => {
    try {
        const { stopData } = req.body;

        if (!stopData) {
            return res.status(400).json({ message: 'No stopData provided' });
        }

        const newStop = new Stop(stopData);
        await newStop.save();

        res.status(201).json(newStop);
    } catch (err) {
        console.error('Error while saving stop:', err.message);
        res.status(400).json({ message: err.message });
    }
});

export default stopsController;
