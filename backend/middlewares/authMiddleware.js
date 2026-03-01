import { AUTH_COOKIE_NAME, JWT_SECRET } from "../index.js";
import jsonwebtoken from "../lib/jsonwebtoken.js";

export async function auth(req, res, next) {
    const token = req.cookies[AUTH_COOKIE_NAME];
    

    if (!token) {
        req.user = null;
        req.isAuthenticated = false;
        return next();
    }

    try {
        const user = await jsonwebtoken.verify(token, JWT_SECRET);

        req.user = user;
        req.isAuthenticated = true;

        next();
    } catch(err) {
        res.clearCookie(AUTH_COOKIE_NAME);

        req.user = null;
        req.isAuthenticated = false;

        next();
    }
}

export function isAuth(req, res, next) {
    if (!req.isAuthenticated) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

export function isGuest(req, res, next) {
    if (req.isAuthenticated) {
        return res.status(403).json({ error: "Already logged in" });
    }
    next();
}