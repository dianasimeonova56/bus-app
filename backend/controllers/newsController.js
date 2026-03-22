import express from 'express';
import newsService from '../services/newsService.js'
import { auth, isAuth } from '../middlewares/authMiddleware.js';
import { getPagination, formatResponse } from '../utils/paginationUtil.js';

const newsController = express.Router();

newsController.post('/create', auth, isAuth, async (req, res) => {
    try {
        const { newsData } = req.body;

        if (!newsData) {
            return res.status(400).json({ message: 'No newsData provided' });
        }
        const adminId = req.user.id;

        if (!adminId) {
            return res.status(401).json({ message: 'You must be logged in to create news' });
        }

        const news = await newsService.create(newsData, adminId);

        res.status(201).json(news);
    } catch (err) {
        console.error('Error while saving news:', err.message);
        res.status(400).json({ message: err.message });
    }
});

newsController.get('/', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req.query);

        const { news, totalDocs } = await newsService.getAll(skip, limit);

        const response = formatResponse(news, totalDocs, page, limit);

        res.status(200).json(response);
    } catch (err) {
        console.error('Error while fetching news:', err.message);
        res.status(400).json({ message: err.message });
    }
});

newsController.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const news = await newsService.getById(id);

        res.status(200).json(news);
    } catch (err) {
        console.error('Error while fetching news:', err.message);
        res.status(400).json({ message: err.message });
    }
})

newsController.post('/:id/delete', auth, isAuth, async (req, res) => {
    try {
        const id = req.params.id;
        await newsService.delete(id);

        res.status(201).json({ messgae: "Deleted news!" });
    } catch (err) {
        console.error('Error while deleting news:', err.message);
        res.status(400).json({ message: err.message });
    }
});

export default newsController;
