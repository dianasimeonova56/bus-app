import { Router } from "express";
import verificationService from "../services/verificationService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { upload } from '../middlewares/fileMiddleware.js';

const verificationController = Router();

verificationController.post('/send', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Моля, прикачете документ!" });
        }
        const { type, user } = req.body;

        if (!user) {
            return res.status(400).json({ error: "Липсва идентификатор на потребителя!" });
        }

        const requestData = {
            userId: user,
            type: type,
            documentUrl: req.file.path
        };

        await verificationService.sendRequest(requestData);
        res.status(201).json({ message: "Успешно изпратено!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

verificationController.post('/verify', async (req, res) => {
    try {
        const { verificationId } = req.body;
        await verificationService.verifyRequest(verificationId);

        res.status(200).json({ message: "Request verified!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

verificationController.post('/reject', async (req, res) => {
    try {
        const { verificationId, comment } = req.body;
        await verificationService.denyRequest(verificationId, comment);

        res.status(201).json({ message: "Request denied!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

verificationController.get('/pending', async (req, res) => {
    try {
        const requests = await verificationService.getPendingRequests();

        res.status(200).json({ requests: requests })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

export default verificationController;