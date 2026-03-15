import cron from 'node-cron';
import dayjs from 'dayjs';
import Route from './models/Route.js';
import Trip from './models/Trip.js';

const generateTripsForPeriod = async () => {
    try {
        const routes = await Route.find({ isActive: true });

        for (const route of routes) {
            const tripsToInsert = [];

            for (let i = 0; i <= 30; i++) {
                const targetDate = dayjs().add(i, 'day').startOf('day');
                const dayName = targetDate.format('dddd');

                if (route.days.includes(dayName)) {
                    const dateAsDate = targetDate.toDate();

                    const exists = await Trip.findOne({
                        route: route._id,
                        date: dateAsDate
                    });

                    if (!exists) {
                        tripsToInsert.push({
                            route: route._id,
                            date: dateAsDate,
                            availableSeats: 40,
                            status: 'scheduled'
                        });
                    }
                }
            }

            if (tripsToInsert.length > 0) {
                await Trip.insertMany(tripsToInsert);
                console.log(`Generated ${tripsToInsert.length} trips for route ${route._id}`);
            }
        }
    } catch (err) {
        console.error('Cron Error:', err);
    }
};

const updateTripStatuses = async () => {
    console.log('--- Updating Trip Statuses ---');
    try {
        const now = dayjs();
        const activeTrips = await Trip.find({ status: { $ne: 'completed' } }).populate('route');

        for (const trip of activeTrips) {
            if (!trip.route) continue;

            const dateStr = dayjs(trip.date).format('YYYY-MM-DD');
            const arrivalTime = dayjs(`${dateStr} ${trip.route.arrivalHour}`);
            const departureTime = dayjs(`${dateStr} ${trip.route.startHour}`);

            if (now.isAfter(arrivalTime)) {
                trip.status = 'completed';
                await trip.save();
                console.log(`Trip ${trip._id} marked as completed`);
            } else if (now.isAfter(departureTime) && now.isBefore(arrivalTime)) {
                if (trip.status !== 'active') {
                    trip.status = 'active';
                    await trip.save();
                    console.log(`Trip ${trip._id} marked as active`);
                }
            }
        }
    } catch (err) {
        console.error('Error updating statuses:', err);
    }
};

export const initTripCron = () => {
    generateTripsForPeriod();
    updateTripStatuses();

    cron.schedule('0 0 * * *', () => {
        generateTripsForPeriod();
    });

    cron.schedule('*/15 * * * *', () => {
        updateTripStatuses();
    });
};