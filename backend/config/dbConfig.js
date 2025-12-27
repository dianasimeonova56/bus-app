import mongoose from 'mongoose';

export async function initDatabase() {
    const dbUrl = 'mongodb://localhost:27017';
    const dbName = 'test_db';

    try{
        await mongoose.connect(dbUrl, { dbName });
        console.log("Db connected successfully!");
    } catch (error) {
        console.log("Db connection failed!");
        console.log(error.message);
    }
}