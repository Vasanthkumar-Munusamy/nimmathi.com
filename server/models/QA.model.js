import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        authorName: { type: String, default: 'Admin' },
        isOfficial: { type: Boolean, default: false },
        upvotes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const qaSchema = new mongoose.Schema(
    {
        question: { type: String, required: true, trim: true },
        questionTamil: { type: String },
        category: { type: String, enum: ['theology', 'caste', 'marriage', 'general'], default: 'general' },
        answers: [answerSchema],
        askedBy: { type: String, default: 'Anonymous' },
        published: { type: Boolean, default: true },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('QA', qaSchema);