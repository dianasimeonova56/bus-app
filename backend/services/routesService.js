import Route from '../models/Route'

export default {
    newRoute(routeData) {
        const route = new Route(routeData);

        return route.save();
    }
}