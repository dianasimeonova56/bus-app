import express from 'express'
import routesService from '../services/routesService.js'

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

export default routesController