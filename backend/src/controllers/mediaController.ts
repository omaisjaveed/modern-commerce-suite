import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

// Use path.resolve to get absolute path to uploads directory
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
console.log('MediaController: UPLOADS_DIR =', UPLOADS_DIR);

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('MediaController: Created uploads directory');
}

export class MediaController {
  static async upload(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log('MediaController: upload called');
      
      if (!req.user || req.user.role !== 'admin') {
        console.log('MediaController: Not admin');
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const file = req.file;
      console.log('MediaController: file received', file);
      
      if (!file) {
        console.log('MediaController: No file in request');
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const url = `/uploads/${file.filename}`;
      console.log('MediaController: File saved, URL:', url);
      
      res.status(201).json({
        message: 'File uploaded successfully',
        filename: file.filename,
        url,
        mimetype: file.mimetype,
        size: file.size
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const files = fs.readdirSync(UPLOADS_DIR).map(filename => {
        const filepath = path.join(UPLOADS_DIR, filename);
        const stats = fs.statSync(filepath);
        return {
          filename,
          url: `/uploads/${filename}`,
          mimetype: filename.endsWith('.png') ? 'image/png' : 
                   filename.endsWith('.jpg') ? 'image/jpeg' :
                   filename.endsWith('.jpeg') ? 'image/jpeg' :
                   filename.endsWith('.gif') ? 'image/gif' :
                   filename.endsWith('.webp') ? 'image/webp' : 'application/octet-stream',
          size: stats.size,
          created_at: stats.birthtime
        };
      });

      res.json({ files });
    } catch (error) {
      console.error('Get files error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const { filename } = req.params;
      const filepath = path.join(UPLOADS_DIR, filename);

      if (!fs.existsSync(filepath)) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      fs.unlinkSync(filepath);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
