import mongoose from 'mongoose';
import 'dotenv/config';

export async function initDatabase() {
    const dbUrl = process.env.DB_URL;
    const dbName = process.env.DB_NAME;

    try{
        await mongoose.connect(dbUrl, { dbName });
        console.log("Db connected successfully!");
    } catch (error) {
        console.log("Db connection failed!");
        console.log(error.message);
    }
}