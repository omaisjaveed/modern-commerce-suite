import { Request, Response } from 'express';
import { HomePageModel } from '../models/homePageModel';
import { AuthRequest } from '../middleware/auth';

export class HomePageController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const content = await HomePageModel.getAll();
      const contentMap: Record<string, any> = {};
      for (const item of content) {
        contentMap[item.section_key] = {
          value: item.content_value,
          type: item.content_type,
          updated_at: item.updated_at
        };
      }
      res.json({ content: contentMap });
    } catch (error) {
      console.error('Get home page content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { content } = req.body;

      if (!content || typeof content !== 'object') {
        res.status(400).json({ error: 'Content object is required' });
        return;
      }

      const items = Object.entries(content).map(([key, value]: [string, any]) => ({
        key,
        contentType: value.type || 'text',
        contentValue: typeof value.value === 'string' ? value.value : JSON.stringify(value.value)
      }));

      const success = await HomePageModel.updateMultiple(items);

      if (success) {
        const updated = await HomePageModel.getAll();
        const contentMap: Record<string, any> = {};
        for (const item of updated) {
          contentMap[item.section_key] = {
            value: item.content_value,
            type: item.content_type,
            updated_at: item.updated_at
          };
        }
        res.json({ message: 'Home page content updated successfully', content: contentMap });
      } else {
        res.status(500).json({ error: 'Failed to update home page content' });
      }
    } catch (error) {
      console.error('Update home page content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
