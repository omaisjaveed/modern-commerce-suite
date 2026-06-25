import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Inquiry {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at?: Date;
}

export const createInquiry = async (data: Partial<Inquiry>): Promise<number> => {
  const { first_name, last_name, email, phone, message } = data;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO inquiries (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, email, phone, message]
  );
  return result.insertId;
};

export const getAllInquiries = async (): Promise<Inquiry[]> => {
  const [rows] = await pool.query<Inquiry[] & RowDataPacket[]>('SELECT * FROM inquiries ORDER BY created_at DESC');
  return rows as Inquiry[];
};
