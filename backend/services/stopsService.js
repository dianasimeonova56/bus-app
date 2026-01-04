import Stop from '../models/Stop.js'
const BusStation = Stop.discriminators['Bus Station'];

export default {
    newStop(stopData) {
        let stop;
        if(stopData.type == "Bus Station") {
            stop = new BusStation(stopData)
        } else {
            stop = new Stop(stopData);
        }

        return stop.save();
    },
    getAll() {
        let stops = Stop.find();

        return stops;
    },
    getStop(stopId) {
        let stop = Stop.findById(stopId);
        
        return stop;
    },
    getBusStations() {
        return BusStation.find();
    },
    async getNormalStops() {
        const normalStops = await Stop.find({type: "Normal Stop"});

        return normalStops;
    }
}