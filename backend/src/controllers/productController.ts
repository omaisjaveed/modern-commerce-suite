import { Request, Response } from 'express';
import { ProductModel } from '../models/productModel';
import { AuthRequest } from '../middleware/auth';

export class ProductController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      const categoryId = req.query.category;

      let products;
      if (categoryId) {
        products = await ProductModel.findByCategory(parseInt(categoryId as string));
      } else {
        products = await ProductModel.findAll(limit, offset);
      }

      res.json({ products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(parseInt(id));

      if (product) {
        const images = await ProductModel.getProductImages(parseInt(id));
        res.json({ product, images });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await ProductModel.findBySlug(slug);

      if (product) {
        const images = await ProductModel.getProductImages(product.id);
        res.json({ product, images });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getFeatured(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductModel.findFeatured();
      res.json({ products });
    } catch (error) {
      console.error('Get featured products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const products = await ProductModel.search(q as string);
      res.json({ products });
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        name,
        slug,
        description,
        price,
        compareAtPrice,
        sku,
        stockQuantity,
        categoryId,
        featured,
        status
      } = req.body;

      if (!name || !slug || price === undefined) {
        res.status(400).json({ error: 'Name, slug, and price are required' });
        return;
      }

      const existingProduct = await ProductModel.findBySlug(slug);
      if (existingProduct) {
        res.status(400).json({ error: 'Slug already exists' });
        return;
      }

      const productId = await ProductModel.create(
        name,
        slug,
        description || null,
        parseFloat(price),
        compareAtPrice ? parseFloat(compareAtPrice) : null,
        sku || null,
        stockQuantity ? parseInt(stockQuantity) : 0,
        categoryId ? parseInt(categoryId) : null,
        featured || false,
        status || 'published'
      );

      const product = await ProductModel.findById(productId);
      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name,
        slug,
        description,
        price,
        compareAtPrice,
        sku,
        stockQuantity,
        categoryId,
        featured,
        status
      } = req.body;

      if (!name || !slug || price === undefined) {
        res.status(400).json({ error: 'Name, slug, and price are required' });
        return;
      }

      const existingProduct = await ProductModel.findById(parseInt(id));
      if (!existingProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const otherProductWithSlug = await ProductModel.findBySlug(slug);
      if (otherProductWithSlug && otherProductWithSlug.id !== parseInt(id)) {
        res.status(400).json({ error: 'Slug already exists' });
        return;
      }

      const success = await ProductModel.update(
        parseInt(id),
        name,
        slug,
        description || null,
        parseFloat(price),
        compareAtPrice ? parseFloat(compareAtPrice) : null,
        sku || null,
        stockQuantity ? parseInt(stockQuantity) : 0,
        categoryId ? parseInt(categoryId) : null,
        featured || false,
        status || 'published'
      );

      if (success) {
        const product = await ProductModel.findById(parseInt(id));
        res.json({
          message: 'Product updated successfully',
          product
        });
      } else {
        res.status(500).json({ error: 'Failed to update product' });
      }
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await ProductModel.delete(parseInt(id));

      if (success) {
        res.json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async addImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { imageUrl, isMain } = req.body;

      if (!imageUrl) {
        res.status(400).json({ error: 'Image URL is required' });
        return;
      }

      const product = await ProductModel.findById(parseInt(id));
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const imageId = await ProductModel.addProductImage(
        parseInt(id),
        imageUrl,
        isMain || false
      );

      res.status(201).json({
        message: 'Image added successfully',
        imageId
      });
    } catch (error) {
      console.error('Add image error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id, imageId } = req.params;
      const success = await ProductModel.deleteProductImage(parseInt(imageId));

      if (success) {
        res.json({ message: 'Image deleted successfully' });
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
