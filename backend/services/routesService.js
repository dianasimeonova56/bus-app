import Route from '../models/Route.js'

export default {
    newRoute(routeData) {
        const route = new Route(routeData);

        return route.save();
    },
    getAll() {
        const routes = Route.find();

        return routes;
    },
}