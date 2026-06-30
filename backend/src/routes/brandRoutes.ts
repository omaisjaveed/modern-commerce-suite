import { Router } from 'express';
import { getBrands, getBrand, addBrand, editBrand, removeBrand } from '../controllers/brandController';

const router = Router();

router.get('/', getBrands);
router.get('/:id', getBrand);
router.post('/', addBrand);
router.put('/:id', editBrand);
router.delete('/:id', removeBrand);

export default router;
