import { Schema, model } from 'mongoose';

const driverSchema = new Schema({
    first_name: {
        type: String,
        required: [true, "First name field is required!"],
        minLength: [3, 'First name should be at least 3 chars long'],
    },
    last_name: {
        type: String,
        required: [true, "Last name field is required!"],
        minLength: [3, 'Last name should be at least 3 chars long'],
    },
    phone_number: {
        type: String,
        required: [true, "Phone number field is required!"],
    },
    transportOperator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransportOperator',
        required: true
    },
    buses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bus'
        }
    ]
})

const Driver = model('Driver', driverSchema)

export default Driver;