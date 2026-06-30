import { Router } from 'express';
import { getBlogs, getBlog, addBlog, editBlog, removeBlog } from '../controllers/blogController';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', addBlog);
router.put('/:id', editBlog);
router.delete('/:id', removeBlog);

export default router;
