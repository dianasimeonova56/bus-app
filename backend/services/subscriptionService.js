import SubscriptionCard from '../models/SubscriptionCard.js';
import UserSubscriptionCard from '../models/userSubscriptionCard.js';
import Stripe from 'stripe';

const DISCOUNT_RATES = {
    30: 1.0,
    15: 0.5,
    10: 0.65
};

export default {
    async createSubscription(subscriptionData) {
        return await SubscriptionCard.create(subscriptionData);
    },
    async createCheckoutSession(userId, subscriptionData) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const { planId, selectedType, periodDays } = subscriptionData;

        const plan = await SubscriptionCard.findById(planId).populate('stop');
        if (!plan) throw new Error("Subscription plan not found!");

        const calculatedPrice = this.calculateSubscriptionPrice(plan, selectedType, periodDays);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Абонамент: ${plan.stop.name}`,
                        description: `${periodDays} дни - тип ${selectedType}`
                    },
                    unit_amount: Math.round(calculatedPrice * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            metadata: {
                userId: userId.toString(),
                planId: planId.toString(),
                selectedType,
                periodDays: periodDays.toString(),
                paidPrice: calculatedPrice.toString(),
                type: 'subscription_purchase'
            },
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        return session;
    },
    async handleSubscriptionPayment(metadata) {
        const { userId, planId, selectedType, periodDays, paidPrice } = metadata;

        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(startDate.getDate() + Number(periodDays));

        return await UserSubscriptionCard.create({
            userId,
            planId,
            selectedType,
            periodDays: Number(periodDays),
            paidPrice: Number(paidPrice),
            startDate,
            expiryDate
        });
    },

    calculateSubscriptionPrice(plan, selectedType, periodDays) {
        const priceMap = {
            student: plan.studentDiscountPrice,
            senior: plan.seniorDiscountPrice,
            disability: plan.disabilitesDiscountPrice,
            regular: plan.regularPrice
        };

        const basePrice = priceMap[selectedType];
        if (!basePrice) throw new Error("Invalid discount type");

        const multiplier = DISCOUNT_RATES[periodDays];
        if (!multiplier) throw new Error("Invalid period");

        return parseFloat((basePrice * multiplier).toFixed(2));
    }
}