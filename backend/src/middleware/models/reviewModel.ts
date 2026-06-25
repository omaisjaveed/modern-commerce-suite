import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Review {
  id?: number;
  name: string;
  designation: string;
  content: string;
  avatar?: string;
  status: 'active' | 'inactive';
  created_at?: Date;
}

export const getAllReviews = async (status?: string): Promise<Review[]> => {
  let query = 'SELECT * FROM reviews WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await pool.query<Review[] & RowDataPacket[]>(query, params);
  return rows as Review[];
};

export const getReviewById = async (id: number): Promise<Review | null> => {
  const [rows] = await pool.query<Review[] & RowDataPacket[]>('SELECT * FROM reviews WHERE id = ?', [id]);
  return rows.length > 0 ? (rows[0] as Review) : null;
};

export const createReview = async (reviewData: Partial<Review>): Promise<number> => {
  const { name, designation, content, avatar, status } = reviewData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO reviews (name, designation, content, avatar, status) VALUES (?, ?, ?, ?, ?)',
    [name, designation, content, avatar, status || 'active']
  );
  return result.insertId;
};

export const updateReview = async (id: number, reviewData: Partial<Review>): Promise<void> => {
  const { name, designation, content, avatar, status } = reviewData;
  await pool.query(
    'UPDATE reviews SET name = ?, designation = ?, content = ?, avatar = ?, status = ? WHERE id = ?',
    [name, designation, content, avatar, status, id]
  );
};

export const deleteReview = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
};
