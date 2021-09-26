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

const show = async (req: Request, res: Response) => {
  try {
    const showAllProducts = await productStore.show(req.params.id);
    res.json(showAllProducts);
  } catch (err) {
    res.status(400).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const newProductDetails: Product = {
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category
  };
  try {
    const newProduct = await productStore.create(newProductDetails);
    res.json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products/create', create);
  //   app.delete('/products/:id/delete', destroy);
};

export default productRoutes;
