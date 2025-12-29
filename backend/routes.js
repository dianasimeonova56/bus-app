import { Router } from 'express'

import stopsController from './controllers/stopsController.js'

const routes = Router()

routes.use('/stops', stopsController)
routes.all('*url', (req, res) => {//in the end, bc if we have gone through the abpve controllers and have not rendered anything, we should display 404
    res.render('404');
})

export default routes;