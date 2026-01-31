import Route from '../models/Route.js'
import mongoose from 'mongoose';

export default {
    newRoute(routeData) {
        const route = new Route(routeData);

        return route.save();
    },
    getAll() {
        const routes = Route.find();

        return routes;
    },
    searchRoutes(filter = {}) {
        const { stop, transportOperatorId, day, time } = filter;
        console.log(filter);
        

        const query = {};

        if (stop) {
            query.$or = [
                { 'startStop.stopId': stop },
                { 'endStop.stopId': stop },
                { 'stops.stopId': stop }
            ].map(obj => {
                return Object.fromEntries(
                    Object.entries(obj).map(([k, v]) => [k, new mongoose.Types.ObjectId(v)])
                );
            });
        }

        if (transportOperatorId) {
            query.transportOperator = new mongoose.Types.ObjectId(transportOperatorId);
        }

        if (day) {
            query.days = day;
        }

        if (time) {
            query.startHour = { $gte: time };
        }

        return Route.find(query)
            .populate('startStop.stopId')
            .populate('endStop.stopId')
            .populate('stops.stopId')
            .populate('transportOperator')
    }
}