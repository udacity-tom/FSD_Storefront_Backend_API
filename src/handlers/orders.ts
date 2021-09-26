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

const show = async (req: Request, res: Response) => {
  try {
    const orders = await orderStore.show(req.params.id);
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

const create = async (req: Request, res: Response) => {
  try {
    let status: string = req.body.status;
    if (status == undefined) {
      status = 'open';
    }
    // console.log(
    //   'user id ',
    //   req.params.id,
    //   'typeof id',
    //   typeof req.params.id,
    //   'status',
    //   status
    // );
    const orders = await orderStore.create(req.params.id, status);
    // console.log('orders ', orders);
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const oidToDelte = req.params.oid;
    const orderToDelete = await orderStore.delete(req.params.id, oidToDelte);
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

const orderRoutes = (app: express.Application) => {
  app.get('/users/orders', auth.verifyAuthToken, index); //show all orders
  app.get('/users/:id/orders/', auth.verifyAuthToken, show); //show orders for user (id)
  app.get('/users/:id/orders/:oid', auth.verifyAuthToken, showOrder); //shows products for user (id) with order (oid)
  app.post(
    '/users/:id/orders/:oid/add-product',
    auth.verifyAuthToken,
    addProduct
  ); //shows only order (oid) for user (id)
  app.post('/users/:id/orders/create', create);
  app.post('/users/:id/orders/delete/:oid', destroy);
};

export default orderRoutes;
