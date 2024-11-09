import { Router } from 'express';
import { handleGetChatResponse, handleGetQuestionSuggestions, handleGetXYAxis } from '../controllers/chatGptRoutes.js';

const chatGptRouter = Router();
chatGptRouter.get('/get/xy', handleGetXYAxis);
chatGptRouter.get('/get/question_suggestions', handleGetQuestionSuggestions);
chatGptRouter.get('/get/chat', handleGetChatResponse);

export default chatGptRouter;