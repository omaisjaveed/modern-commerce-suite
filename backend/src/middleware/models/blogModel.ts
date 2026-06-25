import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Blog {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author_id?: number;
  status: 'draft' | 'published';
  created_at?: Date;
}

export const getAllBlogs = async (status?: string): Promise<Blog[]> => {
  let query = 'SELECT b.*, u.first_name, u.last_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND b.status = ?';
    params.push(status);
  }

  query += ' ORDER BY b.created_at DESC';

  const [rows] = await pool.query<Blog[] & RowDataPacket[]>(query, params);
  return rows as Blog[];
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const [rows] = await pool.query<Blog[] & RowDataPacket[]>('SELECT b.*, u.first_name, u.last_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE b.slug = ?', [slug]);
  return rows.length > 0 ? (rows[0] as Blog) : null;
};

export const createBlog = async (blogData: Partial<Blog>): Promise<number> => {
  const { title, slug, content, excerpt, image, author_id, status } = blogData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO blogs (title, slug, content, excerpt, image, author_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, slug, content, excerpt, image, author_id || null, status || 'published']
  );
  return result.insertId;
};

export const updateBlog = async (id: number, blogData: Partial<Blog>): Promise<void> => {
  const { title, slug, content, excerpt, image, status } = blogData;
  await pool.query(
    'UPDATE blogs SET title = ?, slug = ?, content = ?, excerpt = ?, image = ?, status = ? WHERE id = ?',
    [title, slug, content, excerpt || null, image, status, id]
  );
};

export const deleteBlog = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
};
