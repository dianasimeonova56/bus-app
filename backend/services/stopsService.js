import Stop from '../models/Stop.js'

export default {
    newStop(stopData) {
        const stop = new Stop(stopData);

        return stop.save();
    },
    getAll() {
        let stops = Stop.find();

        return stops;
    },
    async getBusStations() {
        const busStations = await Stop.find({type: "Bus Station"});

        return busStations;
    },
    async getNormalStops() {
        const normalStops = await Stop.find({type: "Normal Stop"});

        return normalStops;
    }
}