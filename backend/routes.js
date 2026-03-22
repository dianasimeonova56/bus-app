import { Router } from 'express'

import stopsController from './controllers/stopsController.js'
import routesController from './controllers/routesController.js'
import operatorController from './controllers/operatorsController.js'
import tripsController from './controllers/tripsController.js'
import usersController from './controllers/usersController.js'
import bookingController from './controllers/bookingController.js'
import subscriptionController from './controllers/subscriptionController.js'
import verificationController from './controllers/verificationController.js'
import newsController from './controllers/newsController.js'
import webhook from './controllers/stripeWebook.js'

const routes = Router()

routes.use('/webhook', webhook)
routes.use('/stops', stopsController)
routes.use('/routes', routesController)
routes.use('/operators', operatorController)
routes.use('/trips', tripsController)
routes.use('/users', usersController)
routes.use('/booking', bookingController)
routes.use('/subscription', subscriptionController)
routes.use('/verification', verificationController)
routes.use('/news', newsController)
routes.all('*url', (req, res) => {
    res.status(400).json({ error: "no route specified" });
})

export default routes;