import { Request, Response } from 'express';
import { TestimonialModel } from '../models/testimonialModel';
import { AuthRequest } from '../middleware/auth';

export class TestimonialController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const testimonials = await TestimonialModel.findAll('published');
      res.json({ testimonials });
    } catch (error) {
      console.error('Get testimonials error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAdminList(req: Request, res: Response): Promise<void> {
    try {
      const testimonials = await TestimonialModel.findAll();
      res.json({ testimonials });
    } catch (error) {
      console.error('Get testimonials error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, company, quote, avatarUrl, sortOrder, status } = req.body;
      if (!name || !quote) {
        res.status(400).json({ error: 'Name and quote are required' });
        return;
      }

      const testimonialId = await TestimonialModel.create(
        name,
        company || null,
        quote,
        avatarUrl || null,
        sortOrder || 0,
        status || 'published'
      );

      const testimonial = await TestimonialModel.findById(testimonialId);
      res.status(201).json({ message: 'Testimonial created successfully', testimonial });
    } catch (error) {
      console.error('Create testimonial error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, company, quote, avatarUrl, sortOrder, status } = req.body;
      if (!name || !quote) {
        res.status(400).json({ error: 'Name and quote are required' });
        return;
      }

      const existing = await TestimonialModel.findById(parseInt(id));
      if (!existing) {
        res.status(404).json({ error: 'Testimonial not found' });
        return;
      }

      const success = await TestimonialModel.update(
        parseInt(id),
        name,
        company || null,
        quote,
        avatarUrl || null,
        sortOrder || 0,
        status || 'published'
      );

      if (success) {
        const testimonial = await TestimonialModel.findById(parseInt(id));
        res.json({ message: 'Testimonial updated successfully', testimonial });
      } else {
        res.status(500).json({ error: 'Failed to update testimonial' });
      }
    } catch (error) {
      console.error('Update testimonial error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await TestimonialModel.delete(parseInt(id));

      if (success) {
        res.json({ message: 'Testimonial deleted successfully' });
      } else {
        res.status(404).json({ error: 'Testimonial not found' });
      }
    } catch (error) {
      console.error('Delete testimonial error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
