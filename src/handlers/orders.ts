import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
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

const show = async (req: Request, res: Response) => {
  try {
    const orders = await orderStore.show(req.params.oid);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const showOrder = async (req: Request, res: Response) => {
  try {
    const orders = await orderStore.showOrder(req.params.id, req.params.oid);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const showUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderStore.showUserOrders(req.params.id);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    let status: string = req.body.status;
    if (status == undefined) {
      status = 'active';
    }
    const orders = await orderStore.create(req.params.id, status);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const oidToDelete = req.params.oid;
    const orderToDelete = await orderStore.delete(req.params.id, oidToDelete);
    res.json(orderToDelete);
  } catch (err) {
    res.status(400).send(err);
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const addProducts = await orderStore.addProduct(
      req.params.id,
      req.body.quantity,
      req.params.oid,
      req.body.id
    );
    res.json(addProducts);
  } catch (err) {
    res.status(400).json(err);
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/orders', auth.verifyAuthToken, index); //show all orders
  app.get('/orders/:oid', auth.verifyAuthToken, show); //show only order
  app.get('/users/:id/orders/', auth.verifyAuthToken, showUserOrders); //show current orders for user (id)
  app.get('/users/:id/orders/:oid', auth.verifyAuthToken, showOrder); //shows details of order for user (id) with order (oid)
  app.post('/users/:id/orders/create', create);
  app.post(
    '/users/:id/orders/:oid/add-product',
    auth.verifyAuthToken,
    addProduct
  );
  app.delete('/users/:id/orders/:oid', destroy);
  //   app.post('/users/:id/orders/create', create);
};

export default orderRoutes;
