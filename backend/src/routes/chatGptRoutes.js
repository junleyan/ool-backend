import { Router } from 'express';
import { handleGetXYAxis } from '../controllers/chatGptRoutes.js';

const chatGptRouter = Router();
chatGptRouter.get('/get/xy', handleGetXYAxis);

export default chatGptRouter;