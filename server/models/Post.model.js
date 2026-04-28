import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        titleTamil: { type: String, trim: true },          // Tamil title
        content: { type: String, required: true },
        contentTamil: { type: String },                       // Tamil content
        slug: { type: String, required: true, unique: true, lowercase: true },
        coverImage: { type: String, default: '' },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: String, enum: ['article', 'sermon', 'testimony', 'announcement'], default: 'article' },
        tags: [{ type: String }],
        published: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Auto-generate slug from title
postSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

export default mongoose.model('Post', postSchema);