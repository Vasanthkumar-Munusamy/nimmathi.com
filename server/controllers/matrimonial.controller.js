import asyncHandler from 'express-async-handler';
import Matrimonial from '../models/Matrimonial.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @route   GET /api/matrimonial
export const getListings = asyncHandler(async (req, res) => {
    const { gender, page = 1, limit = 12 } = req.query;
    const filter = { active: true };
    if (gender) filter.gender = gender;

    const skip = (page - 1) * limit;
    const [listings, total] = await Promise.all([
        Matrimonial.find(filter)
            .select('-contactPhone -contactEmail') // hide contact from public
            .sort('-createdAt')
            .skip(skip)
            .limit(+limit),
        Matrimonial.countDocuments(filter),
    ]);
    res.json({ success: true, data: listings, total, page: +page, pages: Math.ceil(total / limit) });
});

// @route   GET /api/matrimonial/:id
export const getListingById = asyncHandler(async (req, res) => {
    const listing = await Matrimonial.findById(req.params.id).select('-contactPhone -contactEmail');
    if (!listing || !listing.active) { res.status(404); throw new Error('Listing not found'); }
    res.json({ success: true, data: listing });
});

// @route   POST /api/matrimonial
export const createListing = asyncHandler(async (req, res) => {
    let photoUrl = '';

    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: 'nimmathi/images',
            resource_type: 'image',
            transformation: [{ width: 800, crop: 'limit', quality: 'auto' }],
        });
        photoUrl = result.secure_url;
    }

    const listing = await Matrimonial.create({
        ...req.body,
        photo: photoUrl,
        postedBy: req.user?._id,
    });
    res.status(201).json({ success: true, data: listing });
});

// @route   PUT /api/matrimonial/:id  (admin)
export const updateListing = asyncHandler(async (req, res) => {
    const listing = await Matrimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!listing) { res.status(404); throw new Error('Listing not found'); }
    res.json({ success: true, data: listing });
});

// @route   DELETE /api/matrimonial/:id  (admin)
export const deleteListing = asyncHandler(async (req, res) => {
    await Matrimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Listing removed' });
});