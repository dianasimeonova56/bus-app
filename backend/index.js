import express from 'express'
import expressSession from 'express-session'
import User from './models/Passenger.js';

import { initDatabase } from './config/dbConfig.js'

const app = express();

initDatabase();

async function run() {
    await initDatabase();

    const doc = new User({ name: 'First document' });
    await doc.save();

    console.log('Document inserted!');
    process.exit(0);
}

run();

app.get('/', (req, res) => res.send('Server is running...'));

app.listen(3000, () => console.log('Server is listening on http://localhost:3000...'));