import Stop from '../models/Stop.js'

export default {
    newStop(stopData) {
        const stop = new Stop(stopData);

        return stop.save();
    }
}