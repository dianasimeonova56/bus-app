import express from 'express';
import operatorsService from '../services/operatorsService.js'

const operatorController = express.Router();

operatorController.post('/create-operator', async (req, res) => {
    try {
        const { operatorData } = req.body;

        if (!operatorData) {
            return res.status(400).json({ message: 'No operatorData provided' });
        }

        const newOperator = await operatorsService.newOperator(operatorData);

        res.status(201).json(newOperator);
    } catch (err) {
        console.error('Error while saving operator:', err.message);
        res.status(400).json({ message: err.message });
    }
});

operatorController.get('/', async (req, res) => {
    try {
        const operators = await operatorsService.getAll();

        res.status(200).json(operators);
    } catch (err) {
        console.error('Error while fetching operators:', err.message);
        res.status(400).json({ message: err.message });
    }
})

export default operatorController;
