export interface SubscriptionCard {
    _id: string;
    stop: {
        _id: string;
        name: string;
    };
    regularPrice: number;
    studentDiscountPrice: number;
    seniorDiscountPrice: number;
    disabilitesDiscountPrice: number;
}