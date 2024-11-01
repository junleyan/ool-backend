import { Router } from 'express';
import { handleGetCSV, handleGetFilteredDataset, handleGetFilters } from '../controllers/hawaiiDataController.js';

const hawaiiDataRouter = Router();
hawaiiDataRouter.get('/get/dataset', handleGetFilteredDataset);
hawaiiDataRouter.get('/get/filters', handleGetFilters);
hawaiiDataRouter.get('/get/csv', handleGetCSV);

export default hawaiiDataRouter;