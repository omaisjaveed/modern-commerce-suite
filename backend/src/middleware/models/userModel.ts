import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'admin' | 'customer';
  created_at?: Date;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.query<User[] & RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const createUser = async (userData: Partial<User>): Promise<number> => {
  const { first_name, last_name, email, phone, password, role } = userData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, last_name, email, phone, password, role || 'customer']
  );
  return result.insertId;
};

export const getAllUsers = async (filters: any = {}): Promise<{ users: User[], total: number }> => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;
  const search = filters.search || '';

  let query = 'SELECT id, first_name, last_name, email, phone, role, created_at FROM users WHERE 1=1';
  const params: any[] = [];

  if (search) {
    query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) as t`;
  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, params);
  const total = countRows[0].total;

  // Add pagination
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query<User[] & RowDataPacket[]>(query, params);
  return { users: rows as User[], total };
};

export const deleteUser = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
};
