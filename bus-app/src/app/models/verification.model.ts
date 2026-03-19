import { User } from "./user.model";

export interface VerificationRequest {
    _id: string;
    userId: User;
    type: 'student' | 'senior' | 'disability';
    documentUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    adminComment: string;
    createdAt: Date
}