import express, { Request, Response } from 'express';
import { AuthStore } from '../middleware/auth';
import { DashboardQueries } from '../services/dashboard';

const service = new DashboardQueries();
const auth = new AuthStore();

const topFiveProducts = async (req: Request, res: Response) => {
  try {
    const products = await service.popularProducts();
    res.json(products);
  } catch (err) {
    res.status(400).send(err);
  }
};

const productsByCategory = async (req: Request, res: Response) => {
  try {
    const products = await service.productsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(400).send(err);
  }
};

const userOrderCompleted = async (req: Request, res: Response) => {
  try {
    const completeOrders = await service.userOrdersCompleted(req.params.id);
    res.json(completeOrders);
  } catch (err) {
    res.status(400).send(err);
  }
};

const dashboardRoutes = (app: express.Application): void => {
  app.get('/products/info/top-5-products', topFiveProducts);
  app.get('/products/category/:category', productsByCategory);
  app.get(
    '/users/:id/orders/complete/all',
    auth.verifyAuthToken,
    userOrderCompleted
  );
};
export default dashboardRoutes;
