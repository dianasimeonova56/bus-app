import { Router } from "express";
import userServices from "../services/usersService.js";
import { AUTH_COOKIE_NAME } from "../index.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";

const userController = Router();

userController.post('/register', isGuest, async (req, res) => {
    try {
        const token = await userServices.register(req.body);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });

        res.status(201).json({ user: token.user });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

userController.post('/login', isGuest, async (req, res) => {
    try {
        const { user, token } = await userServices.login(
            req.body.email,
            req.body.password
        );

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });

        res.json(user);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

userController.post('/logout', (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.json({ message: 'Logged out successfully' });
});

export default userController;