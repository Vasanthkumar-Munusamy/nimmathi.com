import asyncHandler from 'express-async-handler';
import Post from '../models/Post.model.js';

// @route   GET /api/posts
export const getPosts = asyncHandler(async (req, res) => {
    const { category, tag, page = 1, limit = 10 } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
        Post.find(filter).populate('author', 'name').sort('-createdAt').skip(skip).limit(+limit),
        Post.countDocuments(filter),
    ]);

    res.json({ success: true, data: posts, total, page: +page, pages: Math.ceil(total / limit) });
});

// @route   GET /api/posts/:slug
export const getPostBySlug = asyncHandler(async (req, res) => {
    const post = await Post.findOneAndUpdate(
        { slug: req.params.slug, published: true },
        { $inc: { views: 1 } },
        { new: true }
    ).populate('author', 'name');
    if (!post) { res.status(404); throw new Error('Post not found'); }
    res.json({ success: true, data: post });
});

// @route   POST /api/posts  (admin)
export const createPost = asyncHandler(async (req, res) => {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: post });
});

// @route   PUT /api/posts/:id  (admin)
export const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) { res.status(404); throw new Error('Post not found'); }
    res.json({ success: true, data: post });
});

// @route   DELETE /api/posts/:id  (admin)
export const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) { res.status(404); throw new Error('Post not found'); }
    res.json({ success: true, message: 'Post deleted' });
});