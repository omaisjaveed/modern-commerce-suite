import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface FAQ {
  id?: number;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  created_at?: Date;
}

export const getAllFAQs = async (status?: string): Promise<FAQ[]> => {
  let query = 'SELECT * FROM faqs WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  const [rows] = await pool.query<FAQ[] & RowDataPacket[]>(query, params);
  return rows as FAQ[];
};

export const createFAQ = async (data: Partial<FAQ>): Promise<number> => {
  const { question, answer, status } = data;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO faqs (question, answer, status) VALUES (?, ?, ?)',
    [question, answer, status || 'active']
  );
  return result.insertId;
};

export const updateFAQ = async (id: number, data: Partial<FAQ>): Promise<void> => {
  const { question, answer, status } = data;
  await pool.query(
    'UPDATE faqs SET question = ?, answer = ?, status = ? WHERE id = ?',
    [question, answer, status, id]
  );
};

export const deleteFAQ = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM faqs WHERE id = ?', [id]);
};
