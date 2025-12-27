import { Router } from "express";
import homeController from "./controllers/homeController";

const routes = Router();

routes.use(homeController);

routes.all('*url', (req, res) => {
    res.render('notFound');
})

export default routes;