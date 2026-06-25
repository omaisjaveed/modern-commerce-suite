import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Order {
  id?: number;
  user_id?: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: 'stripe' | 'paypal' | 'cod';
  shipping_address: string;
  billing_address: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at?: Date;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  price: number;
}

export const createOrder = async (orderData: Partial<Order>): Promise<number> => {
  const { 
    user_id, total_amount, payment_method, shipping_address, billing_address, 
    first_name, last_name, email, phone 
  } = orderData;
  
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO orders (
      user_id, total_amount, payment_method, shipping_address, billing_address, 
      first_name, last_name, email, phone, status, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid')`,
    [user_id, total_amount, payment_method, shipping_address, billing_address, first_name, last_name, email, phone]
  );
  return result.insertId;
};

export const createOrderItem = async (itemData: OrderItem): Promise<void> => {
  const { order_id, product_id, variant_id, quantity, price } = itemData;
  await pool.query(
    'INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
    [order_id, product_id, variant_id, quantity, price]
  );
};

export const getAllOrders = async (filters: any = {}): Promise<{ orders: Order[], total: number }> => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;
  const search = filters.search || '';

  let query = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];

  if (search) {
    query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR id LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) as t`;
  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, params);
  const total = countRows[0].total;

  // Add pagination
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query<Order[] & RowDataPacket[]>(query, params);
  return { orders: rows as Order[], total };
};

export const getOrderById = async (id: number): Promise<any> => {
  const [orders] = await pool.query<Order[] & RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [id]);
  if (orders.length === 0) return null;

  const order = orders[0];
  const [items] = await pool.query<RowDataPacket[]>(
    `SELECT oi.*, p.name as product_name 
     FROM order_items oi 
     LEFT JOIN products p ON oi.product_id = p.id 
     WHERE oi.order_id = ?`, 
    [id]
  );
  
  return { ...order, items };
};

export const updateOrderStatus = async (id: number, status: string, paymentStatus: string): Promise<void> => {
  await pool.query('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?', [status, paymentStatus, id]);
};
