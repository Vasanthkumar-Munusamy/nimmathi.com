import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — we upload to Cloudinary manually in the controller
const storage = multer.memoryStorage();

export const uploadAudio = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid audio format'));
    },
});

export const uploadImage = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid image format'));
    },
});

// ─── Helper: upload buffer to Cloudinary ───────────────────────────────────
export const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        stream.end(buffer);
    });
};

export { cloudinary };