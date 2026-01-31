import { Schema, model } from 'mongoose';

const transportOperatorSchema = new Schema({
    name: {
        type: String,
        required: [true, "Transport operator name field is required!"]
    },
    email: {
        type: String,
        required: [true, "Transport operator email field is required!"],
        minLength: [10, 'Email should be at least 10 chars long']
    },
    phoneNumber: 
    { 
        type: String,
        required: [true, "Transport operator phone number field is required!"] 
    }
})

const TransportOperator = model('TransportOperator', transportOperatorSchema)

export default TransportOperator;