import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Product {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  sku?: string;
  stock_quantity?: number;
  category_id?: number;
  brand_id?: number;
  featured?: boolean;
  status: 'draft' | 'published';
  sizes?: string;
  metals?: string;
  created_at?: Date;
  images?: string[];
}

export const getAllProducts = async (filters: any = {}): Promise<{ products: Product[], total: number }> => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;
  const search = filters.search || '';

  let query = `
    SELECT p.*, c.name as category_name, b.name as brand_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    LEFT JOIN brands b ON p.brand_id = b.id 
    WHERE 1=1
  `;
  const params: any[] = [];

  if (search) {
    query += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (filters.category_id) {
    query += ' AND p.category_id = ?';
    params.push(filters.category_id);
  }

  if (filters.brand_id) {
    query += ' AND p.brand_id = ?';
    params.push(filters.brand_id);
  }

  if (filters.featured !== undefined) {
    query += ' AND p.featured = ?';
    params.push(filters.featured);
  }

  if (filters.status) {
    query += ' AND p.status = ?';
    params.push(filters.status);
  }

  // Get total count for pagination
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) as t`;
  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, params);
  const total = countRows[0].total;

  // Add pagination
  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query<Product[] & RowDataPacket[]>(query, params);
  const products = rows as Product[];
  
  // Fetch images for each product
  for (const product of products) {
    const [images] = await pool.query<RowDataPacket[]>('SELECT image_url FROM product_images WHERE product_id = ?', [product.id]);
    product.images = images.map(img => img.image_url);
  }

  return { products, total };
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const [rows] = await pool.query<Product[] & RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
  if (rows.length === 0) return null;

  const product = rows[0] as Product;
  const [images] = await pool.query<RowDataPacket[]>('SELECT image_url FROM product_images WHERE product_id = ?', [product.id]);
  product.images = images.map(img => img.image_url);

  return product;
};

export const createProduct = async (productData: Partial<Product>): Promise<number> => {
  const { name, slug, description, price, compare_at_price, sku, stock_quantity, category_id, brand_id, featured, status, sizes, metals } = productData;
  
  // Sanitize numeric fields that might come as empty strings from frontend
  const sanitizedPrice = price || 0;
  const sanitizedComparePrice = (compare_at_price as any) === '' ? null : compare_at_price;
  const sanitizedStock = (stock_quantity as any) === '' ? 0 : stock_quantity;
  const sanitizedCategoryId = (category_id as any) === '' ? null : category_id;
  const sanitizedBrandId = (brand_id as any) === '' ? null : brand_id;

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO products (name, slug, description, price, compare_at_price, sku, stock_quantity, category_id, brand_id, featured, status, sizes, metals) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name, 
      slug, 
      description || null, 
      sanitizedPrice, 
      sanitizedComparePrice, 
      sku || null, 
      sanitizedStock, 
      sanitizedCategoryId, 
      sanitizedBrandId, 
      featured || false, 
      status || 'published', 
      sizes || 'S,M,L,XL', 
      metals || 'Gold,Rose Gold,Silver'
    ]
  );
  return result.insertId;
};

export const addProductImage = async (productId: number, imageUrl: string, isMain: boolean = false): Promise<void> => {
  await pool.query('INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)', [productId, imageUrl, isMain]);
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<void> => {
  const { name, slug, description, price, compare_at_price, sku, stock_quantity, category_id, brand_id, featured, status, sizes, metals } = productData;
  
  // Sanitize numeric fields that might come as empty strings from frontend
  const sanitizedPrice = price || 0;
  const sanitizedComparePrice = (compare_at_price as any) === '' ? null : compare_at_price;
  const sanitizedStock = (stock_quantity as any) === '' ? 0 : stock_quantity;
  const sanitizedCategoryId = (category_id as any) === '' ? null : category_id;
  const sanitizedBrandId = (brand_id as any) === '' ? null : brand_id;

  await pool.query(
    'UPDATE products SET name = ?, slug = ?, description = ?, price = ?, compare_at_price = ?, sku = ?, stock_quantity = ?, category_id = ?, brand_id = ?, featured = ?, status = ?, sizes = ?, metals = ? WHERE id = ?',
    [
      name, 
      slug, 
      description || null, 
      sanitizedPrice, 
      sanitizedComparePrice, 
      sku || null, 
      sanitizedStock, 
      sanitizedCategoryId, 
      sanitizedBrandId, 
      featured, 
      status, 
      sizes, 
      metals, 
      id
    ]
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
};

export const clearProductImages = async (productId: number): Promise<void> => {
  await pool.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
};
