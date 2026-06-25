import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Brand {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive';
  created_at?: Date;
}

export const getAllBrands = async (): Promise<Brand[]> => {
  const [rows] = await pool.query<Brand[] & RowDataPacket[]>('SELECT * FROM brands');
  return rows as Brand[];
};

export const getBrandById = async (id: number): Promise<Brand | null> => {
  const [rows] = await pool.query<Brand[] & RowDataPacket[]>('SELECT * FROM brands WHERE id = ?', [id]);
  return rows.length > 0 ? (rows[0] as Brand) : null;
};

export const createBrand = async (brandData: Partial<Brand>): Promise<number> => {
  const { name, slug, description, logo, status } = brandData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO brands (name, slug, description, logo, status) VALUES (?, ?, ?, ?, ?)',
    [name, slug, description || null, logo || null, status || 'active']
  );
  return result.insertId;
};

export const updateBrand = async (id: number, brandData: Partial<Brand>): Promise<void> => {
  const { name, slug, description, logo, status } = brandData;
  await pool.query(
    'UPDATE brands SET name = ?, slug = ?, description = ?, logo = ?, status = ? WHERE id = ?',
    [name, slug, description || null, logo || null, status, id]
  );
};

export const deleteBrand = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM brands WHERE id = ?', [id]);
};
