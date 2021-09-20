import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { AuthStore } from '../middleware/auth';

const orderStore = new OrderStore();
const auth = new AuthStore();

const index = async (req: Request, res: Response) => {
  try {
    const orders = await orderStore.index();
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/users', index);
};

export default orderRoutes;
