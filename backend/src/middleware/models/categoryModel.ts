import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Category {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  image?: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  const [rows] = await pool.query<Category[] & RowDataPacket[]>('SELECT * FROM categories');
  return rows as Category[];
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const [rows] = await pool.query<Category[] & RowDataPacket[]>('SELECT * FROM categories WHERE slug = ?', [slug]);
  return rows.length > 0 ? (rows[0] as Category) : null;
};

export const createCategory = async (categoryData: Partial<Category>): Promise<number> => {
  const { name, slug, description, parent_id, image } = categoryData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO categories (name, slug, description, parent_id, image) VALUES (?, ?, ?, ?, ?)',
    [name, slug, description || null, parent_id || null, image || null]
  );
  return result.insertId;
};

export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<void> => {
  const { name, slug, description, parent_id, image } = categoryData;
  await pool.query(
    'UPDATE categories SET name = ?, slug = ?, description = ?, parent_id = ?, image = ? WHERE id = ?',
    [name, slug, description || null, parent_id || null, image || null, id]
  );
};

export const deleteCategory = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
};
