import express, { Request, Response } from 'express';

import { DashboardQueries } from '../services/dashboard';

const dashboardQueries = new DashboardQueries();

const topFiveProducts = async (req: Request, res: Response) => {
  console.log('in topFiveProducts');
  try {
    console.log('in topFiveProducts');
    const products = await dashboardQueries.popularProducts();
    res.json(products);
  } catch (err) {
    res.status(400).send(err);
  }
};

const dashboardRoutes = (app: express.Application): void => {
  app.get('/products/info/top-5-products', topFiveProducts);
};
export default dashboardRoutes;
