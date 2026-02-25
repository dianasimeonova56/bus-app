import mongoose from 'mongoose';
import dayjs from 'dayjs';
// ПРОВЕРИ ТЕЗИ ПЪТИЩА! Трябва да са същите като в контролерите ти
import Route from './models/Route.js'; 
import Trip from './models/Trip.js';

// 1. Смени 'transport_db' с името на твоята база, която виждаш в Compass
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
            // Генерираме пътувания за следващите 10 дни, за да сме сигурни
            for (let i = 0; i < 10; i++) {
                const targetDate = dayjs().add(i, 'day');
                const dayName = targetDate.format('dddd'); // Ще върне "Monday", "Tuesday" и т.н.

                if (route.days.includes(dayName)) {
                    const dateOnly = targetDate.startOf('day').toDate();
                    
                    // Използваме updateOne с upsert, за да не пълним дубликати при повторно пускане
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