import { Schema, model, Types } from 'mongoose';

const busSchema = new Schema({
    registration_number: {
        type: String,
        required: [true, "Registration number field is required!"],
        validate: [new RegExp("^([A-ZА-Я]{2})\\s?\\d{4}\\s?([A-ZА-Я]{1,2})$"), "Invalid format!"]
    },
    capacity: {
        type: Number,
        required: [true, "Bus capacity field is required!"],
    },
    transport_operators: {
        type: Types.ObjectId,
        ref: 'TransportOperator',
        required: [true, "Please provide a transport opreator reference!"],
    }
})

const Bus = model('Bus', busSchema)

export default Bus;