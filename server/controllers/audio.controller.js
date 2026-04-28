import asyncHandler from 'express-async-handler';
import Audio from '../models/Audio.model.js';
import { cloudinary, uploadToCloudinary } from '../config/cloudinary.js';

// @route   GET /api/audio
export const getAudioList = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 12 } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Audio.find(filter).sort('-createdAt').skip(skip).limit(+limit),
        Audio.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, total, page: +page, pages: Math.ceil(total / limit) });
});

// @route   GET /api/audio/:id
export const getAudioById = asyncHandler(async (req, res) => {
    const audio = await Audio.findByIdAndUpdate(
        req.params.id, { $inc: { plays: 1 } }, { new: true }
    );
    if (!audio) { res.status(404); throw new Error('Audio not found'); }
    res.json({ success: true, data: audio });
});

// @route   POST /api/audio  (admin)
export const uploadAudio = asyncHandler(async (req, res) => {
    if (!req.file) { res.status(400); throw new Error('No audio file uploaded'); }

    // Upload buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'nimmathi/audio',
        resource_type: 'video',   // Cloudinary uses 'video' for audio
        public_id: `audio_${Date.now()}`,
    });

    const audio = await Audio.create({
        ...req.body,
        audioUrl: result.secure_url,
        audioPublicId: result.public_id,
        duration: result.duration,
    });
    res.status(201).json({ success: true, data: audio });
});

// @route   DELETE /api/audio/:id  (admin)
export const deleteAudio = asyncHandler(async (req, res) => {
    const audio = await Audio.findById(req.params.id);
    if (!audio) { res.status(404); throw new Error('Audio not found'); }
    if (audio.audioPublicId) {
        await cloudinary.uploader.destroy(audio.audioPublicId, { resource_type: 'video' });
    }
    await audio.deleteOne();
    res.json({ success: true, message: 'Audio deleted' });
});