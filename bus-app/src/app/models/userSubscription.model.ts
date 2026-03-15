export interface UserSubscription {
    _id: string;
    userId: string;
    planId: {
        _id: string;
        stop: {
            _id: string;
            name: string;
        };
        regularPrice: number;
        studentDiscountPrice: number;
        seniorDiscountPrice: number;
        disabilitesDiscountPrice: number;
    };
    selectedType: 'student' | 'regular' | 'senior' | 'disability';
    periodDays: 10 | 15 | 30;
    paidPrice: number;
    startDate: Date;
    expiryDate: Date;
    isActive?: boolean;
}