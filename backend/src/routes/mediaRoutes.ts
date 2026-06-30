import { Router } from 'express';
import { uploadFile, uploadMiddleware, getMediaFiles, deleteMediaFile } from '../controllers/mediaController';

const router = Router();

router.post('/upload', uploadMiddleware, uploadFile);
router.get('/', getMediaFiles);
router.delete('/:filename', deleteMediaFile);

export default router;
