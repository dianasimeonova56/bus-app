import { Router } from "express";
import ticketService from '../services/ticketsService.js'

const ticketsController = Router();

ticketsController.get('/', (req, res) => {
    res.json({message: "Server is running"});
})

ticketsController.post('/generate/:bookingId', isAuth, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const tickets = await ticketService.generateTicketsForBooking(bookingId);
        res.status(201).json({ tickets });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default ticketsController;