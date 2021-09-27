import express, { Request, Response } from 'express';

import { DashboardQueries } from '../services/dashboard';

const dashboardQueries = new DashboardQueries();

const topFiveProducts = async (req: Request, res: Response) => {
  //   console.log('in topFiveProducts');
  try {
    // console.log('in topFiveProducts');
    const products = await dashboardQueries.popularProducts();
    res.json(products);
  } catch (err) {
    res.status(400).send(err);
  }
};

const productsByCategory = async (req: Request, res: Response) => {
  try {
    const products = await dashboardQueries.productsByCategory(
      req.params.category
    );
    res.json(products);
  } catch (err) {
    res.status(400).send(err);
  }
};

const userOrderCompleted = async (req: Request, res: Response) => {
  try {
    const completeOrders = await dashboardQueries.userOrdersCompleted(
      req.params.id
    );
    res.json(completeOrders);
  } catch (err) {
    res.status(400).send(err);
  }
};

const dashboardRoutes = (app: express.Application): void => {
  app.get('/products/info/top-5-products', topFiveProducts);
  app.get('/products/category/:category', productsByCategory);
  app.get('/users/:id/orders/complete/all', userOrderCompleted);
};
export default dashboardRoutes;
