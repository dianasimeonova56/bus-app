import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { generateAuthToken } from '../utils/userUtils.js';

export default {
    async register(userData) {
    if (userData.password !== userData.rePassword) {
        throw new Error("Password mismatch!");
    }

    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
        throw new Error("User already exists!");
    }

    const newUser = await User.create(userData);
    const token = await generateAuthToken(newUser);

    return { user: newUser, token };
},

async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User does not exist!");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error("Invalid credentials!");
    }

    const token = await generateAuthToken(user);

    return { user, token };
}
}

