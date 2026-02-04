import express from 'express'
import routesService from '../services/routesService.js'
import Stop from '../models/Stop.js'

const routesController = express.Router();

routesController.post('/create-route', async (req, res) => {
    try {
        const { routeData } = req.body;

        if (!routeData) {
            return res.status(400).json({ message: 'No routeData provided' });
        }

        const newRoute = await routesService.newRoute(routeData);

        res.status(201).json(newRoute);
    } catch (err) {
        console.error('Error while saving route:', err.message);
        res.status(400).json({ message: err.message });
    }
});

routesController.get('/', async (req, res) => {
    try {
        const routes = await routesService.getAll()
            .populate({
                path: 'stops',
                populate: {
                    path: 'stopId'
                }
            }
            )
            .populate({
                path: 'endStop',
                populate: {
                    path: 'stopId'
                }
            }
            )
            .populate({
                path: 'startStop',
                populate: {
                    path: 'stopId'
                }
            }
            )

        res.status(200).json(routes);
    } catch (err) {
        console.error('Error while saving route:', err.message);
        res.status(400).json({ message: err.message });
    }
});

routesController.get('/departures/:station', async (req, res) => {
    try {
        const station = req.params.station; // "south" или "west"
        const mainStations = await Stop.find({ isMainStation: true });

        const stationObj = mainStations.find(s => {
            if (station === 'south') return s.south === true;
            if (station === 'west') return s.west === true;
            return false;
        });

        if (!stationObj) {
            return res.status(404).json({ message: 'Station not found' });
        }

        const routes = await routesService.getStationDepartures(stationObj._id);

        res.status(200).json(routes);
    } catch (err) {
        console.error('Error while loading routes:', err);
        res.status(400).json({ message: err.message });
    }
});

routesController.get('/arrivals/:station', async (req, res) => {
    try {
        const station = req.params.station; // "south" или "west"
        const mainStations = await Stop.find({ isMainStation: true });

        const stationObj = mainStations.find(s => {
            if (station === 'south') return s.south === true;
            if (station === 'west') return s.west === true;
            return false;
        });

        if (!stationObj) {
            return res.status(404).json({ message: 'Station not found' });
        }

        const routes = await routesService.getStationArrivals(stationObj._id);

        res.status(200).json(routes);
    } catch (err) {
        console.error('Error while loading routes:', err);
        res.status(400).json({ message: err.message });
    }
});

routesController.get('/search', async (req, res) => {
    try {
        const filter = req.query;

        const routes = await routesService.searchRoutes(filter);

        res.status(200).json(routes);
    } catch (err) {
        console.error('Error while searching routes:', err.message);
        res.status(400).json({ message: err.message });
    }

})

export default routesController