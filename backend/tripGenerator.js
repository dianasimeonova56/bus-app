import cron from 'node-cron';
import dayjs from 'dayjs';
import Route from './models/Route.js';
import Trip from './models/Trip.js';

// Изпълнява се всяка вечер в 00:00
export const initTripCron = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('--- Running Daily Trip Generator ---');
        
        try {
            const routes = await Route.find({ isActive: true }); // Ако имаш такова поле
            const targetDate = dayjs().add(30, 'day'); // Генерираме за след 30 дни
            const dayName = targetDate.format('Wednesday');

            for (const route of routes) {
                if (route.days.includes(dayName)) {
                    // Проверка дали вече съществува
                    const exists = await Trip.findOne({
                        route: route._id,
                        date: targetDate.startOf('day').toDate()
                    });

                    if (!exists) {
                        await Trip.create({
                            route: route._id,
                            date: targetDate.startOf('day').toDate(),
                            availableSeats: 40
                        });
                    }
                }
            }
        } catch (err) {
            console.error('Cron job error:', err);
        }
    });
};