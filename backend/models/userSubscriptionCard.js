import { Schema, Types, model } from 'mongoose';

const userSubscriptionCardSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: Types.ObjectId,
        ref: 'SubscriptionCard',
        required: true
    },
    selectedType: {
        type: String,
        enum: ['student', 'regular', 'senior', 'disability'],
        required: true
    },
    periodDays: {
        type: Number,
        enum: [10, 15, 30],
        required: true
    },
    paidPrice: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
})

const UserSubscriptionCard = model('UserSubscriptionCard', userSubscriptionCardSchema)

export default UserSubscriptionCard;