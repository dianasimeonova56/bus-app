import Stop from '../models/Stop.js'
import Route from '../models/Route.js'
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
    },
    async getOperatorStops(operatorName) {
        const operator = await TransportOperator.findOne({ name: operatorName });
        if (!operator) return res.status(404).json({ message: "Operator not found" });

        const routes = await Route.find({ transportOperator: operator._id }).select('stops');

        const stopIds = [...new Set(routes.flatMap(route => route.stops))];

        const stops = await Stop.find({ _id: { $in: stopIds } });

        return stops;
    }
}