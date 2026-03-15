import { Schema, Types, model } from 'mongoose';

const subscriptionCardSchema = new Schema({
    stop: {
        type: Types.ObjectId,
        ref: 'Stop',
        required: [true, "Stop field is required!"]
    },
    regularPrice: {
        type: Number,
        required: [true, "Regular price field is required!"]
    },
    studentDiscountPrice: {
        type: Number,
        required: [true, "Student discount price field is required!"]
    },
    seniorDiscountPrice: {
        type: Number,
        required: [true, "Senior citizen discount price field is required!"]
    },
    disabilitesDiscountPrice: {
        type: Number,
        required: [true, "People with disabilities discount price field is required!"]
    }
})

const SubscriptionCard = model('SubscriptionCard', subscriptionCardSchema)

export default SubscriptionCard;