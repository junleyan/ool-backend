import {Router} from 'express';
import { handleGetFilteredDataset, handleGetFilters, handleGetGroupList, handleGetOrganizationList, handleGetTagList } from '../controllers/hawaiiDataController.js';

const hawaiiDataRouter = Router();
hawaiiDataRouter.get('/get/dataset', handleGetFilteredDataset);
hawaiiDataRouter.get('/get/organizations', handleGetOrganizationList);
hawaiiDataRouter.get('/get/groups', handleGetGroupList);
hawaiiDataRouter.get('/get/tags', handleGetTagList);
hawaiiDataRouter.get('/get/filters', handleGetFilters);

export default hawaiiDataRouter;