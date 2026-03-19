import { Router } from "express";
import verificationService from "../services/verificationService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { upload } from '../middlewares/uploadMiddleware.js';

const verificationController = Router();

verificationController.post('/send', isAuth, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Моля, прикачете документ!" });
        }

        const requestData = {
            userId: req.user._id, 
            type: req.body.type,
            documentUrl: req.file.path
        };

        await verificationService.sendRequest(requestData);
        res.status(201).json({ message: "Успешно изпратено!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

verificationController.post('/verify', isAuth, async (req, res) => {
    try {
        const { verificationId } = req.body;
        await verificationService.verifyRequest(verificationId);

        res.status(200).json({ message: "Request verified!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

verificationController.post('/deny', isAuth, async (req, res) => {
    try {
        const { verificationId, comment } = req.body;
        await verificationService.denyRequest(verificationId, comment);

        res.status(201).json({ message: "Request denied!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default verificationController;