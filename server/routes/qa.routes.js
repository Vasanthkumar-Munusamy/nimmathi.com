import express from 'express';
import { getQuestions, getQuestionById, createQuestion, addAnswer } from '../controllers/qa.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', createQuestion);
router.post('/:id/answer', protect, adminOnly, addAnswer);
export default router;