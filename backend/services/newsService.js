import News from '../models/News.js';

export default {
    async getAll(skip, limit) {
        const [news, totalDocs] = await Promise.all([
            News.find()
                .sort({ isImportant: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'firstName lastName'),
            News.countDocuments()
        ]);

        return { news, totalDocs };
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