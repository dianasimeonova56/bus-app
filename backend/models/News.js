import { Schema, model, Types } from 'mongoose';

const newsSchema = new Schema({
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
        type: Types.ObjectId,
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

const News = model('News', newsSchema);

export default News;