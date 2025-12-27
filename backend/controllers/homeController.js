import { Router } from "express";

const homeController = Router();

homeController.get('/', (req, res) => {
    res.json({message: "Server is running"});
})

export default homeController;