import { Schema, Types, model } from 'mongoose';

const verificationRequestSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['student', 'senior', 'disability'],
        required: true
    },
    documentUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminComment: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const VerificationRequest = model('VerificationRequest', verificationRequestSchema);

export default VerificationRequest;