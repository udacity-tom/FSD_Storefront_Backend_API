import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { AuthStore } from '../middleware/auth';

const productStore = new ProductStore();
const auth = new AuthStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await productStore.index();
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
};

export default productRoutes;
