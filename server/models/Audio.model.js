import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        titleTamil: { type: String, trim: true },
        description: { type: String },
        audioUrl: { type: String, required: true },   // Cloudinary URL
        audioPublicId: { type: String },                   // Cloudinary public_id (for deletion)
        duration: { type: Number },                   // in seconds
        coverImage: { type: String, default: '' },
        category: { type: String, enum: ['sermon', 'worship', 'meditation', 'prayer'], default: 'sermon' },
        speaker: { type: String, default: 'Bro. Augustine (Agathiyan)' },
        album: { type: String },
        published: { type: Boolean, default: true },
        plays: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('Audio', audioSchema);