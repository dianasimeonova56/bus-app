import Trip from '../models/Trip.js';
import Route from '../models/Route.js'
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { getPagination, formatResponse } from '../utils/paginationUtil.js';

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
        const { page, limit, skip } = getPagination(filter);

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

        const matchingRouteIds = await Route.find(routeQuery).distinct('_id');

        if ((stop || transportOperator || time) && matchingRouteIds.length === 0) {
            return formatResponse([], 0, page, limit);
        }

        const tripQuery = { status: 'scheduled' };
        if (matchingRouteIds.length > 0) {
            tripQuery.route = { $in: matchingRouteIds };
        }

        const todayStart = dayjs().startOf('day').toDate();

        if (date) {
            const searchDate = dayjs(date).startOf('day');
            if (searchDate.isBefore(dayjs().startOf('day'))) {
                return formatResponse([], 0, page, limit);
            }

            tripQuery.date = {
                $gte: searchDate.toDate(),
                $lte: searchDate.endOf('day').toDate()
            };
        } else {
            tripQuery.date = { $gte: todayStart };
        }

        const [totalDocs, trips] = await Promise.all([
            Trip.countDocuments(tripQuery),
            Trip.find(tripQuery)
                .populate({
                    path: 'route',
                    populate: [
                        {
                            path: 'startStop.stopId',
                            model: 'Stop'
                        },
                        {
                            path: 'endStop.stopId',
                            model: 'Stop'
                        },
                        {
                            path: 'transportOperator',
                            model: 'TransportOperator'
                        },
                        {
                            path: 'stops.stopId',
                            model: 'Stop'
                        }
                    ]
                })
                .sort({ date: 1 })
                .skip(skip)
                .limit(limit)
        ]);

        return formatResponse(trips, totalDocs, page, limit);
    },

    async getStationDepartures(stationId, query) {
        const { page, limit, skip } = getPagination(query);
        const now = dayjs();
        const currentHour = now.format('HH:mm');

        const startOfSearch = now.subtract(1, 'day').endOf('day').toDate();

        const routes = await Route.find({ 'startStop.stopId': stationId }).select('_id startHour');
        const routeIds = routes.map(r => r._id);

        const tripQuery = {
            route: { $in: routeIds },
            status: 'scheduled',
            date: { $gte: startOfSearch }
        };

        const [totalDocs, trips] = await Promise.all([
            Trip.countDocuments(tripQuery),
            Trip.find(tripQuery)
                .populate({
                    path: 'route',
                    populate: [
                        {
                            path: 'startStop.stopId',
                            model: 'Stop'
                        },
                        {
                            path: 'endStop.stopId',
                            model: 'Stop'
                        },
                        {
                            path: 'transportOperator',
                            model: 'TransportOperator'
                        },
                        {
                            path: 'stops.stopId',
                            model: 'Stop'
                        }
                    ]
                })
                .sort({ date: 1, 'route.startHour': 1 })
                .skip(skip)
                .limit(limit)
        ]);


        const filteredTrips = trips.filter(trip => {
            const tripDate = dayjs(trip.date);
            if (tripDate.isSame(now, 'day') || tripDate.add(3, 'hour').isSame(now, 'day')) {
                return trip.route.startHour >= currentHour;
            }
            return true;
        });

        return formatResponse(filteredTrips, totalDocs, page, limit);
    },

    async getStationArrivals(stationId, query) {
        const { page, limit, skip } = getPagination(query);
        const now = dayjs();
        const currentHour = now.format('HH:mm'); // И ТУК

        const startOfSearch = now.subtract(1, 'day').endOf('day').toDate();

        const routes = await Route.find({ 'endStop.stopId': stationId }).select('_id arrivalHour');
        const routeIds = routes.map(r => r._id);

        const tripQuery = {
            route: { $in: routeIds },
            status: 'scheduled',
            date: { $gte: startOfSearch }
        };

        const [totalDocs, trips] = await Promise.all([
            Trip.countDocuments(tripQuery),
            Trip.find(tripQuery)
                .populate({
                    path: 'route',
                    populate: [
                        {
                            path: 'startStop.stopId',
                            model: 'Stop'
                        },
                        {
                            path: 'endStop.stopId',
                            model: 'Stop'
                        },
                        {
                            path: 'transportOperator',
                            model: 'TransportOperator'
                        },
                        {
                            path: 'stops.stopId',
                            model: 'Stop'
                        }
                    ]
                })
                .sort({ date: 1, 'route.arrivalHour': 1 })
                .skip(skip)
                .limit(limit)
        ]);

        const filteredTrips = trips.filter(trip => {
            const tripDate = dayjs(trip.date);
            if (tripDate.isSame(now, 'day') || tripDate.add(3, 'hour').isSame(now, 'day')) {
                return trip.route.arrivalHour >= currentHour;
            }
            return true;
        });

        return formatResponse(filteredTrips, totalDocs, page, limit);
    }
}