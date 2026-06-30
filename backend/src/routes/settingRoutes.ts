import { Router } from 'express';
import { getSmtpSettings, saveSmtpSettings, testSmtpConnection, getGeneralSettings, saveGeneralSettings, getPaymentSettings, savePaymentSettings, getSettingByKey, saveSettingByKey } from '../controllers/settingController';

const router = Router();

router.get('/smtp', getSmtpSettings);
router.post('/smtp', saveSmtpSettings);
router.post('/smtp/test', testSmtpConnection);
router.get('/general', getGeneralSettings);
router.post('/general', saveGeneralSettings);
router.get('/payment', getPaymentSettings);
router.post('/payment', savePaymentSettings);
router.get('/by-key/:key', getSettingByKey);
router.post('/by-key/:key', saveSettingByKey);

export default router;
