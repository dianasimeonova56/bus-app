import express from 'express';
import Stop from '../models/Stop.js';
import stopsService from '../services/stopsService.js';

const stopsController = express.Router();

stopsController.post('/create-stop', async (req, res) => {
    try {
        const { stopData } = req.body;

        if (!stopData) {
            return res.status(400).json({ message: 'No stopData provided' });
        }

        const newStop = await stopsService.newStop(stopData);

        res.status(201).json(newStop);
    } catch (err) {
        console.error('Error while saving stop:', err.message);
        res.status(400).json({ message: err.message });
    }
});

stopsController.get('/', async (req, res) => {
    try {
        const stops = await stopsService.getAll();

        res.status(200).json(stops);
    } catch (err) {
        console.error('Error while fetching stops:', err.message);
        res.status(400).json({ message: err.message });
    }
})

stopsController.get('/bus-stations', async (req, res) => {
    try {
        const busStations = await stopsService.getBusStations();

        res.status(200).json(busStations);
    } catch (err) {
        console.error('Error while fetching stops:', err.message);
        res.status(400).json({ message: err.message });
    }
})

stopsController.get('/normal-stops', async (req, res) => {
    try {
        const busStations = await stopsService.getNormalStops();

        res.status(200).json(busStations);
    } catch (err) {
        console.error('Error while fetching stops:', err.message);
        res.status(400).json({ message: err.message });
    }
})

stopsController.get('/:stopId', async (req, res) => {
    try {
        const { stopId } = req.params;
        const stop = await stopsService.getStop(stopId);

        res.status(200).json(stop);
    } catch (err) {
        console.error('Error while fetching stops:', err.message);
        res.status(400).json({ message: err.message });
    }
})

export default stopsController;
