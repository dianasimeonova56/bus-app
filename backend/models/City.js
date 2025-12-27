import { Schema, model } from 'mongoose';

const citySchema = new Schema({
    name: {
        type: String,
        required: [true, "City name field is required!"]
    },
    bus_stations: [{
        name: { type: String, required: [true, "Bus station name field is required!"] },
        address: { type: String, required: [true, "Bus station address field is required!"] }
    }]
})

const City = model('City', citySchema)

export default City;