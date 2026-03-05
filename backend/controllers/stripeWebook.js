import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import bookingService from '../services/bookingsService.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(session);
    
    const bookingId = session.metadata.bookingId;

    try {
      await bookingService.handleCheckoutCompleted(bookingId);
      console.log(`Booking ${bookingId} and tickets activated.`);
    } catch (err) {
      console.error(err);
    }
  }

  res.json({ received: true });
});

export default router;