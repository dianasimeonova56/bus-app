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
            const dayName = date.format('dddd');

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
        return Route.find()
            .populate('startStop.stopId')
            .populate('endStop.stopId')
            .populate('endStop.stopId')
            .populate({
                path: 'stops.stopId',
                model: 'Stop'
            })
            .populate('transportOperator');;
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
    },
    async updateRoute(routeId, updateData) {
        const oldRoute = await Route.findById(routeId);
        if (!oldRoute) throw new Error("Route not found");

        oldRoute.isActive = false;
        await oldRoute.save();

        const { _id, ...rest } = oldRoute.toObject();
        const newRoute = new Route({
            ...rest,
            ...updateData,
            isActive: true
        });
        const savedRoute = await newRoute.save();

        const lastTrip = await Trip.findOne({ route: oldRoute._id })
            .sort({ date: -1 });

        let startDate = lastTrip
            ? dayjs(lastTrip.date).add(1, 'day').startOf('day')
            : dayjs().add(1, 'day').startOf('day');

        const trips = [];

        for (let i = 0; i < 7; i++) {
            const currentDate = startDate.add(i, 'day');

            if (savedRoute.days.includes(currentDate.format('dddd'))) {
                trips.push({
                    route: savedRoute._id,
                    date: currentDate.toDate(),
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
    async patchRoute(routeId, data) {
        const updatedRoute = await Route.findByIdAndUpdate(
            routeId,
            { $set: data },
            { new: true }
        ).populate('startStop.stopId endStop.stopId');

        if (!updatedRoute) throw new Error("Route not found");
        return updatedRoute;
    },
}