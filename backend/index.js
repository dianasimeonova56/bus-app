import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/dbConfig.js';
import { initTripCron } from './tripGenerator.js'
import routes from "./routes.js";
import { auth } from './middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import Stripe from 'stripe';

const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME;
export const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.includes('/webhook')) {
      req.rawBody = buf;
    }
  }
}));
app.use(cookieParser());
app.use(express.urlencoded());
app.use(auth);
app.use(routes);
app.use('/uploads', express.static('uploads'));

initDatabase().then(() => {
  console.log('Database connected successfully');
  
  initTripCron();

  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
});