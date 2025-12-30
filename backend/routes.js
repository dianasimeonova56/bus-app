import { Router } from 'express'

import stopsController from './controllers/stopsController.js'
import routesController from './controllers/routesController.js'
import operatorController from './controllers/operatorsController.js'

const routes = Router()

routes.use('/stops', stopsController)
routes.use('/routes', routesController)
routes.use('/operators', operatorController)
routes.all('*url', (req, res) => {//in the end, bc if we have gone through the abpve controllers and have not rendered anything, we should display 404
    res.render('404');
})

export default routes;