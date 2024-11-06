import { Router } from 'express';
import { handleGetQuestionSuggestions, handleGetXYAxis } from '../controllers/chatGptRoutes.js';

const chatGptRouter = Router();
chatGptRouter.get('/get/xy', handleGetXYAxis);
chatGptRouter.get('/get/question_suggestions', handleGetQuestionSuggestions);

export default chatGptRouter;