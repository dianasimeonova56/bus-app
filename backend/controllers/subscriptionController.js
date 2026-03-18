import { Router } from "express";
import subscriptionService from '../services/subscriptionService.js';

const subscriptionController = Router();

subscriptionController.post('/buy-subscription', async (req, res) => {
    try {
        const subscriptionData = req.body; 
        const userId = req.user?._id || subscriptionData.userId;

        const session = await subscriptionService.createCheckoutSession(userId, subscriptionData);

        res.status(200).json({ checkoutUrl: session.url });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

subscriptionController.post('/create', async (req, res) => {
    try {
        const subscriptionData = req.body.data;

        const subscription = await subscriptionService.createSubscription(subscriptionData);

        res.status(200).json({ subscription: subscription });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

subscriptionController.get('/search', async (req, res) => {
    try {
        const searchParams = req.query.stop;

        const subscriptions = await subscriptionService.searchSubscriptions(searchParams);

        res.status(200).json({ subscriptions: subscriptions });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

export default subscriptionController;