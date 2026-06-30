import { Router } from 'express';
import { getProducts, getProduct, addProduct, editProduct, removeProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', addProduct);
router.put('/:id', editProduct);
router.delete('/:id', removeProduct);

export default router;
