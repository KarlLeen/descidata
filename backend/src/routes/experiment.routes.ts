import { Router } from 'express';
import * as experimentController from '../controllers/experiment.controller';
import multer from 'multer';

// 配置multer进行内存存储
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { 
    fileSize: 100 * 1024 * 1024 // 限制100MB
  }
});

const router = Router();

// 实验相关路由
router.get('/', experimentController.getAllExperiments);
router.get('/:id', experimentController.getExperimentById);
router.post('/', experimentController.createExperiment);
router.post('/:id/fund', experimentController.fundExperiment);

// 数据集相关路由
router.post('/:id/datasets', upload.single('file'), experimentController.uploadDataset);
router.get('/:id/datasets', experimentController.getDatasets);
router.get('/:experimentId/datasets/:datasetId', experimentController.getDatasetContent);
router.post('/:experimentId/datasets/:datasetId/nft', experimentController.mintDatasetAsNFT);
router.post('/:experimentId/datasets/:datasetId/cite', experimentController.citeDataset);

export default router;
