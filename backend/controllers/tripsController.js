import express from 'express';
import tripsService from '../services/tripsService.js';
import routesService from '../services/routesService.js';

const tripsController = express.Router();

tripsController.get("/success", (req, res) => {
    res.status(200).json({message: "All good"})
})


tripsController.get('/', async (req, res) => {
    try {
        const trips = tripsService.getAll();
        res.json(trips);
    } catch (err) {
        res.status(404).json({ message: 'No trips found' });
    }
});

tripsController.get('/:id', async (req, res) => {
    try {
        const tripId = req.params.id;
        
        const trip = await tripsService.getOne(tripId);

        res.json(trip);
    } catch (err) {
        res.status(404).json({ message: 'Trip not found' });
    }
});

tripsController.patch('/:id/cancel', async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const updatedTrip = await tripsService.cancel(tripId);
        res.json(updatedTrip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const getStationByPosition = async (stationParam) => {
    const mainStations = await Stop.find({ isMainStation: true });
    return mainStations.find(s => 
        (stationParam === 'south' && s.south) || (stationParam === 'west' && s.west)
    );
};

tripsController.get('/departures/:station', async (req, res) => {
    try {
        const stationObj = await getStationByPosition(req.params.station);
        if (!stationObj) return res.status(404).json({ message: 'Station not found' });
        const routes = await routesService.getStationDepartures(stationObj._id);
        res.status(200).json(routes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

tripsController.get('/arrivals/:station', async (req, res) => {
    try {
        const stationObj = await getStationByPosition(req.params.station);
        if (!stationObj) return res.status(404).json({ message: 'Station not found' });
        const routes = await routesService.getStationArrivals(stationObj._id);
        res.status(200).json(routes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


export default tripsController;