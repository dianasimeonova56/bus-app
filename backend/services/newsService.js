import News from '../models/News.js';

export default {
    async getAll(limit = 10) {
        return await News.find()
            .sort({ isImportant: -1, createdAt: -1 })
            .limit(limit)
            .populate('author', 'firstName lastName');
    },

    async getById(id) {
        return await News.findById(id).populate('author', 'firstName lastName');
    },

    async create(newsData, adminId) {
        return await News.create({ ...newsData, author: adminId });
    },

    async delete(id) {
        return await News.findByIdAndDelete(id);
    }
};