import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Заглавието е задължително!'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Съдържанието е задължително!']
    },
    category: {
        type: String,
        enum: ['Новини', 'Промени', 'Аварии', 'Промоции'],
        default: 'Новини'
    },
    imageUrl: {
        type: String,
        default: 'https://placehold.co/600x400?text=News'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isImportant: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

newsSchema.index({ createdAt: -1 });

const News = mongoose.model('News', newsSchema);

export default News;