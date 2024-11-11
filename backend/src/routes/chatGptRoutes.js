import { Router } from 'express';
import { handleGetChatResponse, handleGetDatasetSuggestions, handleGetPersona, handleGetQuestionSuggestions, handleGetXYAxis } from '../controllers/chatGptRoutes.js';

const chatGptRouter = Router();
chatGptRouter.get('/get/xy', handleGetXYAxis);
chatGptRouter.get('/get/question_suggestions', handleGetQuestionSuggestions);
chatGptRouter.get('/get/chat', handleGetChatResponse);
chatGptRouter.get('/get/dataset_suggestions', handleGetDatasetSuggestions);
chatGptRouter.get('/get/persona', handleGetPersona);

export default chatGptRouter;