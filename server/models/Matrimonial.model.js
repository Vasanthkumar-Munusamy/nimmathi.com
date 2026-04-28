import mongoose from 'mongoose';

const matrimonialSchema = new mongoose.Schema(
    {
        // Personal Info
        name: { type: String, required: true, trim: true },
        gender: { type: String, enum: ['male', 'female'], required: true },
        dateOfBirth: { type: Date, required: true },
        height: { type: String },           // e.g., "5'7\""
        education: { type: String },
        occupation: { type: String },
        location: { type: String, required: true },  // City, District

        // Faith
        church: { type: String },
        baptized: { type: Boolean, default: true },

        // Contact (shown only to admin or verified users)
        contactPhone: { type: String },
        contactEmail: { type: String },

        // Profile
        about: { type: String },
        photo: { type: String, default: '' },

        // Status
        active: { type: Boolean, default: true },
        verified: { type: Boolean, default: false },

        // Linked user (optional)
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.model('Matrimonial', matrimonialSchema);