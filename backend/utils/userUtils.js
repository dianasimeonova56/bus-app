import { JWT_SECRET } from '../index.js';
import util from 'util';
import jsonwebtoken from '../lib/jsonwebtoken.js';

export async function generateAuthToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
    }

    const token = await jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    return token;
}