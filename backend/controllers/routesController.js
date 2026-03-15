import express from 'express';
import routesService from '../services/routesService.js';
import Stop from '../models/Stop.js';

const routesController = express.Router();

routesController.get('/', async (req, res) => {
    try {
        const routes = await routesService.getAll();
        res.status(200).json(routes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

routesController.post('/create-route', async (req, res) => {
    try {
        const { routeData } = req.body;
        if (!routeData) return res.status(400).json({ message: 'No routeData provided' });

        const newRoute = await routesService.newRoute(routeData);
        res.status(201).json(newRoute);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

routesController.get('/search', async (req, res) => {
    try {
        const results = await routesService.searchRoutes(req.query);
        res.status(200).json(results);
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

routesController.get('/departures/:station', async (req, res) => {
    try {
        const stationObj = await getStationByPosition(req.params.station);
        if (!stationObj) return res.status(404).json({ message: 'Station not found' });
        const routes = await routesService.getStationDepartures(stationObj._id);
        res.status(200).json(routes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

routesController.get('/arrivals/:station', async (req, res) => {
    try {
        const stationObj = await getStationByPosition(req.params.station);
        if (!stationObj) return res.status(404).json({ message: 'Station not found' });
        const routes = await routesService.getStationArrivals(stationObj._id);
        res.status(200).json(routes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

routesController.put('/:routeId/update', async (req, res) => {
    try {
        const routeId = req.params.routeId;
        const updateData = req.body
        if (!routeId) return res.status(404).json({ message: 'Route not found' });
        const savedRoute = await routesService.updateRoute(routeId, updateData);
        res.status(200).json({ message: "Route updated!", route: savedRoute });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

routesController.patch('/:id', async (req, res) => {
    try {
        const route = await routesService.patchRoute(req.params.id, req.body);
        res.status(200).json(route);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
export default routesController;