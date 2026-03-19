import VerificationRequest from '../models/VerificationRequest.js';
import User from '../models/User.js'; // ЗАДЪЛЖИТЕЛНО импортни User

export default {
    async sendRequest(body) {
        return await VerificationRequest.create(body);
    },

    async verifyRequest(id) {
        const request = await VerificationRequest.findById(id);
        if (!request) throw new Error("Request not found");

        request.status = 'approved';
        await request.save();

        await User.findByIdAndUpdate(request.userId, {
            isVerifiedAs: request.type
        });
        
        return request;
    },

    async denyRequest(id, comment) {
        const request = await VerificationRequest.findById(id);
        if (!request) throw new Error("Request not found");

        request.status = 'rejected';
        request.adminComment = comment;
        await request.save();

        await User.findByIdAndUpdate(request.userId, {
            isVerifiedAs: 'none'
        });

        return request;
    }
}