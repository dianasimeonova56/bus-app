import express from 'express';
import newsService from '../services/newsService.js'

const newsController = express.Router();

newsController.post('/create', async (req, res) => {
    try {
        const { newsData } = req.body;

        if (!newsData) {
            return res.status(400).json({ message: 'No newsData provided' });
        }

        const news = await newsService.create(newsData);

        res.status(201).json(news);
    } catch (err) {
        console.error('Error while saving news:', err.message);
        res.status(400).json({ message: err.message });
    }
});

newsController.get('/', async (req, res) => {
    try {
        const news = await newsService.getAll();

        res.status(200).json(news);
    } catch (err) {
        console.error('Error while fetching news:', err.message);
        res.status(400).json({ message: err.message });
    }
})

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

newsController.post('/:id/delete', async (req, res) => {
    try {
        const id = req.params.id;
        await newsService.delete(id);

        res.status(201).json({messgae: "Deleted news!"});
    } catch (err) {
        console.error('Error while deleting news:', err.message);
        res.status(400).json({ message: err.message });
    }
});

export default newsController;
