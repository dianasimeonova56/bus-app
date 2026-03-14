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

bookingController.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await bookingsService.getBookingsForUser(userId);


    res.status(200).json({ bookings });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

bookingController.get('/:bookingId/cancel', async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await bookingsService.cancelBooking(bookingId);

    res.status(200).json({message: "Booking cancelled successfully!", booking: booking});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default bookingController;