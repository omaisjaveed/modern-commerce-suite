import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface ProductReview {
  id?: number;
  product_id: number;
  user_id?: number;
  name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: Date;
}

export const getReviewsByProductId = async (productId: number, status?: string): Promise<ProductReview[]> => {
  let query = 'SELECT * FROM product_reviews WHERE product_id = ?';
  const params: any[] = [productId];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  const [rows] = await pool.query<ProductReview[] & RowDataPacket[]>(query, params);
  return rows as ProductReview[];
};

export const createProductReview = async (reviewData: Partial<ProductReview>): Promise<number> => {
  const { product_id, user_id, name, rating, comment } = reviewData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO product_reviews (product_id, user_id, name, rating, comment) VALUES (?, ?, ?, ?, ?)',
    [product_id, user_id, name, rating, comment]
  );
  return result.insertId;
};

export const getAllProductReviews = async (): Promise<ProductReview[]> => {
  const query = `
    SELECT pr.*, p.name as product_name 
    FROM product_reviews pr 
    JOIN products p ON pr.product_id = p.id 
    ORDER BY pr.created_at DESC
  `;
  const [rows] = await pool.query<ProductReview[] & RowDataPacket[]>(query);
  return rows as ProductReview[];
};

export const updateProductReviewStatus = async (id: number, status: string): Promise<void> => {
  await pool.query('UPDATE product_reviews SET status = ? WHERE id = ?', [status, id]);
};

export const deleteProductReview = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM product_reviews WHERE id = ?', [id]);
};
