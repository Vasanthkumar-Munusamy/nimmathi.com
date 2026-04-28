import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
        res.status(400);
        throw new Error('User already exists with this email');
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        },
    });
});

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    res.json({ success: true, data: req.user });
});