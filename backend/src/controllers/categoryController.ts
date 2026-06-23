import { Request, Response } from 'express';
import { CategoryModel } from '../models/categoryModel';
import { AuthRequest } from '../middleware/auth';

export class CategoryController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryModel.findAll();
      res.json({ categories });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await CategoryModel.findById(parseInt(id));

      if (category) {
        res.json({ category });
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await CategoryModel.findBySlug(slug);

      if (category) {
        res.json({ category });
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, slug, description, parentId, image } = req.body;

      if (!name || !slug) {
        res.status(400).json({ error: 'Name and slug are required' });
        return;
      }

      const existingCategory = await CategoryModel.findBySlug(slug);
      if (existingCategory) {
        res.status(400).json({ error: 'Slug already exists' });
        return;
      }

      const categoryId = await CategoryModel.create(
        name,
        slug,
        description || null,
        parentId || null,
        image || null
      );

      const category = await CategoryModel.findById(categoryId);
      res.status(201).json({
        message: 'Category created successfully',
        category
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, slug, description, parentId, image } = req.body;

      if (!name || !slug) {
        res.status(400).json({ error: 'Name and slug are required' });
        return;
      }

      const existingCategory = await CategoryModel.findById(parseInt(id));
      if (!existingCategory) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      const otherCategoryWithSlug = await CategoryModel.findBySlug(slug);
      if (otherCategoryWithSlug && otherCategoryWithSlug.id !== parseInt(id)) {
        res.status(400).json({ error: 'Slug already exists' });
        return;
      }

      const success = await CategoryModel.update(
        parseInt(id),
        name,
        slug,
        description || null,
        parentId || null,
        image || null
      );

      if (success) {
        const category = await CategoryModel.findById(parseInt(id));
        res.json({
          message: 'Category updated successfully',
          category
        });
      } else {
        res.status(500).json({ error: 'Failed to update category' });
      }
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await CategoryModel.delete(parseInt(id));

      if (success) {
        res.json({ message: 'Category deleted successfully' });
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
