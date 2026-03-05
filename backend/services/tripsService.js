import Trip from '../models/Trip.js';
import Route from '../models/Route.js'
import mongoose from 'mongoose';
import dayjs from 'dayjs';
export default {
    getAll() {
        return Trip.find();
    },
    async getOne(tripId) {
        const updatedTrip = await Trip.findById(tripId)
            .populate('route')
            .populate({ path: "route", populate: 'startStop.stopId endStop.stopId stops.stopId' });

        return updatedTrip;
    },
    async cancel(tripId) {
        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            { status: 'cancelled' },
            { new: true }
        );
        return updatedTrip;
    },
    async searchTrips(filter = {}) {
        const { stop, transportOperator, date, time } = filter;
        console.log(filter);

        const routeQuery = {};

        if (stop) {
            const sId = new mongoose.Types.ObjectId(stop);
            routeQuery.$or = [
                { 'startStop.stopId': sId },
                { 'endStop.stopId': sId },
                { 'stops.stopId': sId }
            ];
        }

        if (transportOperator) routeQuery.transportOperator = transportOperator;

        if (time) routeQuery.startHour = { $gte: time };

        const matchingRouteIds = await mongoose.model('Route').find(routeQuery).distinct('_id');

        if ((!stop || !transportOperator || !time) && matchingRouteIds.length === 0) {
            return [];
        }

        const tripQuery = { status: 'scheduled' };

        if (matchingRouteIds.length > 0) {
            tripQuery.route = { $in: matchingRouteIds };
        }

        const today = dayjs().startOf('day');

        if (date) {
            const searchDate = dayjs(date).startOf('day');
            if (searchDate.isBefore(today)) return [];

            tripQuery.date = {
                $gte: searchDate.toDate(),
                $lte: searchDate.endOf('day').toDate()
            };
        } else {
            tripQuery.date = { $gte: today.toDate() };
        }

        return Trip.find(tripQuery)
            .populate({
                path: 'route',
                populate: [
                    { path: 'startStop.stopId' },
                    { path: 'endStop.stopId' },
                    { path: 'transportOperator' }
                ]
            })
            .sort({ date: 1 });
    },
    async getStationDepartures(stationId, query) {
        const limit = query.limit ? Number(query.limit) : 0;
        
        const todayStart = dayjs().startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();

        const routes = await Route.find({ 'startStop.stopId': stationId }).select('_id');
        const routeIds = routes.map(r => r._id);

        console.log( routeIds);
        

        return Trip.find({
            route: { $in: routeIds },
            date: { $gte: todayStart, $lte: todayEnd }
        }).limit(limit)
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

    async getStationArrivals(stationId, query) {
        const limit = query.limit ? Number(query.limit) : 0;
        const todayStart = dayjs().startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();

        const routes = await Route.find({ 'endStop.stopId': stationId }).select('_id');
        const routeIds = routes.map(r => r._id);

        return Trip.find({
            route: { $in: routeIds },
            date: { $gte: todayStart, $lte: todayEnd }
        }).limit(limit).populate({
            path: 'route',
            populate: [
                { path: 'startStop.stopId' },
                { path: 'endStop.stopId' },
                { path: 'stops.stopId' },
                { path: 'transportOperator' }
            ]
        }).sort({ 'route.arrivalHour': 1 });
    },
}