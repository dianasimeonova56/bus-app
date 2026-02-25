import Route from '../models/Route.js';
import Trip from '../models/Trip.js';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

export default {
    async newRoute(routeData) {
        const route = new Route(routeData);
        const savedRoute = await route.save();

        const trips = [];
        for (let i = 0; i < 7; i++) {
            const date = dayjs().add(i, 'day');
            const dayName = date.format('dddd'); // Генерира: "Monday", "Tuesday" и т.н.

            if (savedRoute.days.includes(dayName)) {
                trips.push({
                    route: savedRoute._id,
                    date: date.startOf('day').toDate(),
                    status: 'scheduled',
                    availableSeats: 40
                });
            }
        }

        if (trips.length > 0) {
            await Trip.insertMany(trips);
        }

        return savedRoute;
    },

    getAll() {
        return Route.find();
    },

    // Връща днешните Trip-ове за заминаващи
    async getStationDepartures(stationId) {
        const todayStart = dayjs().startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();

        const routes = await Route.find({ 'startStop.stopId': stationId }).select('_id');
        const routeIds = routes.map(r => r._id);

        return Trip.find({
            route: { $in: routeIds },
            date: { $gte: todayStart, $lte: todayEnd }
        }).populate({
            path: 'route',
            populate: [
                { path: 'startStop.stopId' },
                { path: 'endStop.stopId' },
                { path: 'stops.stopId' },
                { path: 'transportOperator' }
            ]
        }).sort({ 'route.startHour': 1 });
    },

    // Връща днешните Trip-ове за пристигащи
    async getStationArrivals(stationId) {
        const todayStart = dayjs().startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();

        const routes = await Route.find({ 'endStop.stopId': stationId }).select('_id');
        const routeIds = routes.map(r => r._id);

        return Trip.find({
            route: { $in: routeIds },
            date: { $gte: todayStart, $lte: todayEnd }
        }).populate({
            path: 'route',
            populate: [
                { path: 'startStop.stopId' },
                { path: 'endStop.stopId' },
                { path: 'stops.stopId' },
                { path: 'transportOperator' }
            ]
        }).sort({ 'route.arrivalHour': 1 });
    },

    async searchRoutes(filter = {}) {
        const { stop, transportOperatorId, date, time } = filter;

        const routeQuery = {};
        if (stop) {
            routeQuery.$or = [
                { 'startStop.stopId': new mongoose.Types.ObjectId(stop) },
                { 'endStop.stopId': new mongoose.Types.ObjectId(stop) },
                { 'stops.stopId': new mongoose.Types.ObjectId(stop) }
            ];
        }
        if (transportOperatorId) {
            routeQuery.transportOperator = new mongoose.Types.ObjectId(transportOperatorId);
        }
        if (time) {
            routeQuery.startHour = { $gte: time };
        }

        const matchingRoutes = await Route.find(routeQuery).select('_id');
        const routeIds = matchingRoutes.map(r => r._id);

        const tripQuery = { route: { $in: routeIds } };

        if (date) {
            const start = dayjs(date).startOf('day').toDate();
            const end = dayjs(date).endOf('day').toDate();
            tripQuery.date = { $gte: start, $lte: end };
        }

        return Trip.find(tripQuery)
            .populate({
                path: 'route',
                populate: [
                    { path: 'startStop.stopId' },
                    { path: 'endStop.stopId' },
                    { path: 'stops.stopId' },
                    { path: 'transportOperator' }
                ]
            }).sort({ 'route.startHour': 1 });
    }
}