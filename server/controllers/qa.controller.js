import asyncHandler from 'express-async-handler';
import QA from '../models/QA.model.js';

// @route   GET /api/qa
export const getQuestions = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    const [questions, total] = await Promise.all([
        QA.find(filter).sort('-createdAt').skip(skip).limit(+limit),
        QA.countDocuments(filter),
    ]);
    res.json({ success: true, data: questions, total, pages: Math.ceil(total / limit) });
});

// @route   GET /api/qa/:id
export const getQuestionById = asyncHandler(async (req, res) => {
    const qa = await QA.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!qa) { res.status(404); throw new Error('Question not found'); }
    res.json({ success: true, data: qa });
});

// @route   POST /api/qa
export const createQuestion = asyncHandler(async (req, res) => {
    const qa = await QA.create(req.body);
    res.status(201).json({ success: true, data: qa });
});

// @route   POST /api/qa/:id/answer  (admin)
export const addAnswer = asyncHandler(async (req, res) => {
    const qa = await QA.findById(req.params.id);
    if (!qa) { res.status(404); throw new Error('Question not found'); }

    qa.answers.push({
        content: req.body.content,
        author: req.user._id,
        authorName: req.user.name,
        isOfficial: true,
    });
    await qa.save();
    res.json({ success: true, data: qa });
});