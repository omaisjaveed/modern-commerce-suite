import { Router } from 'express';
import { submitInquiry, getInquiries } from '../controllers/inquiryController';

const router = Router();

router.post('/', submitInquiry);
router.get('/', getInquiries);

export default router;
