import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export class SettingModel {
  static async get(key: string): Promise<string | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT value FROM settings WHERE `key` = ?',
      [key]
    );
    return rows.length > 0 ? (rows[0] as { value: string }).value : null;
  }

  static async set(key: string, value: string, type: 'text' | 'image' | 'json' = 'text'): Promise<void> {
    await pool.execute(
      'INSERT INTO settings (`key`, `value`, `type`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
      [key, value, type, value] as any
    );
  }

  static async getAll(): Promise<Record<string, string>> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT `key`, `value` FROM settings');
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[(row as any).key] = (row as any).value;
    }
    return settings;
  }
}

export class SettingsController {
  static async get(req: AuthRequest, res: Response): Promise<void> {
    try {
      const settings = await SettingModel.getAll();
      res.json({ settings });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const settings = req.body;
      
      for (const [key, value] of Object.entries(settings)) {
        await SettingModel.set(key, value as string);
      }

      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
