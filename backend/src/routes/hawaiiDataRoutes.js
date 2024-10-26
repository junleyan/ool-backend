import {Router} from 'express';
import { handleGetFilteredDataset, handleGetFilters } from '../controllers/hawaiiDataController.js';

const hawaiiDataRouter = Router();
hawaiiDataRouter.get('/get/dataset', handleGetFilteredDataset);
hawaiiDataRouter.get('/get/filters', handleGetFilters);

export default hawaiiDataRouter;