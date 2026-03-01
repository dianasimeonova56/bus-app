import mongoose from 'mongoose';
import dayjs from 'dayjs';
import Route from './models/Route.js'; 
import Trip from './models/Trip.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/test_db'; 

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Свързан с MongoDB...');

        const routes = await Route.find();
        console.log(`🔍 Намерени маршрути: ${routes.length}`);

        if (routes.length === 0) {
            console.log('❌ Няма маршрути в колекцията "routes". Провери името на базата!');
            process.exit();
        }

        let createdCount = 0;

        for (const route of routes) {
            for (let i = 0; i < 10; i++) {
                const targetDate = dayjs().add(i, 'day');
                const dayName = targetDate.format('dddd');

                if (route.days.includes(dayName)) {
                    const dateOnly = targetDate.startOf('day').toDate();
                    
                    await Trip.updateOne(
                        { route: route._id, date: dateOnly },
                        { 
                            $set: {
                                route: route._id,
                                date: dateOnly,
                                status: 'scheduled',
                                availableSeats: 40
                            }
                        },
                        { upsert: true }
                    );
                    createdCount++;
                }
            }
        }

        console.log(`🚀 Успешно създадени/обновени ${createdCount} пътувания (Trips)!`);
        console.log('Провери Compass сега.');
    } catch (err) {
        console.error('❌ ГРЕШКА:', err);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
}

seed();