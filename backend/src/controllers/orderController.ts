import { Request, Response } from 'express';
import { OrderModel } from '../models/orderModel';
import { AuthRequest } from '../middleware/auth';

export class OrderController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const orders = await OrderModel.findAll(limit, offset);
      res.json({ orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderModel.findById(parseInt(id));

      if (order) {
        res.json({ order });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        totalAmount,
        paymentMethod,
        firstName,
        lastName,
        email,
        phone,
        orderItems,
        shippingAddress,
        billingAddress,
        userId
      } = req.body;

      if (!totalAmount || !paymentMethod || !firstName || !lastName || !email || !phone) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const orderId = await OrderModel.create(
        totalAmount,
        paymentMethod,
        firstName,
        lastName,
        email,
        phone,
        orderItems,
        shippingAddress,
        billingAddress,
        userId
      );

      res.status(201).json({
        message: 'Order created successfully',
        orderId
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const success = await OrderModel.updateStatus(parseInt(id), status);
      if (success) {
        res.json({ message: 'Order status updated successfully' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updatePaymentStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      if (!paymentStatus) {
        res.status(400).json({ error: 'Payment status is required' });
        return;
      }

      const success = await OrderModel.updatePaymentStatus(parseInt(id), paymentStatus);
      if (success) {
        res.json({ message: 'Payment status updated successfully' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await OrderModel.delete(parseInt(id));

      if (success) {
        res.json({ message: 'Order deleted successfully' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
