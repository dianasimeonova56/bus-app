import { Router } from "express";
import bookingsService from "../services/bookingsService.js";

const bookingController = Router();

bookingController.post('/create', async (req, res) => {
  try {
    const bookingData = req.body;

    const { booking, tickets } = await bookingsService.createBooking(bookingData);

    const session = await bookingsService.createCheckoutSession(booking, tickets);

    res.status(201).json({ booking, tickets, checkoutUrl: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default bookingController;