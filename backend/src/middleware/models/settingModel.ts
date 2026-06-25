import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export interface Setting {
  key: string;
  value: string;
  type: 'text' | 'image' | 'json';
}

export const getSetting = async (key: string): Promise<any> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM settings WHERE `key` = ?', [key]);
  if (rows.length === 0) return null;
  
  const setting = rows[0] as Setting;
  if (setting.type === 'json') {
    try {
      return JSON.parse(setting.value);
    } catch (e) {
      return setting.value;
    }
  }
  return setting.value;
};

export const updateSetting = async (key: string, value: any, type: 'text' | 'image' | 'json' = 'text'): Promise<void> => {
  const stringValue = type === 'json' ? JSON.stringify(value) : String(value);
  await pool.query(
    'INSERT INTO settings (`key`, `value`, `type`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `value` = ?, `type` = ?',
    [key, stringValue, type, stringValue, type]
  );
};
