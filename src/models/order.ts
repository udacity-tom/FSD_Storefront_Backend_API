import client from '../database';
// import { AuthStore } from '../middleware/auth';
// import { Request, Response } from 'express';
import { User, UserStore } from './user';

// const auth = new AuthStore();
const user = new UserStore();

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders;';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`There was an error finding products: ${err}`);
    }
  }

  async show(id: string): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `There was an error with finding orders for user ID=${id}. Erro: ${err}`
      );
    }
  }
  async showUserOrders(id: string): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `There was an error with finding orders for user ID=${id}. Erro: ${err}`
      );
    }
  }

  async showOrder(id: string, oid: string): Promise<Order[] | string> {
    //checks for orders for users-> then returns products in order
    try {
      const currentOpenOrders = await this.showUserOrders(id);
      const hasOpenOrder = currentOpenOrders.filter(order => {
        if (order.id == Number(oid)) {
          return true;
        }
      });
      if (hasOpenOrder.length == 0) {
        return `User with ID = ${id} doesn't have an order with Order Id = ${oid}`;
      }
      const sql = 'SELECT * FROM order_products WHERE order_id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [oid]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `There was an error with finding order ID=${id}. Erro: ${err}`
      );
    }
  }

  async create(id: string, status: string): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [id, status]);
      //   console.log('result', result);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`There was an error with order for ${id}. Error: ${err}`);
    }
  }

  async update(order: Order): Promise<Order> {
    try {
      const sql =
        'UPDATE orders SET user_id= ($1), status= ($2) WHERE users.id= ($3) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `There was an error with updating the order: ${order.id}`
      );
    }
  }

  async delete(id: string, oid: string): Promise<string> {
    try {
      //   console.log('id', id, 'oid', oid);
      const feedback: Order = (await this.show(oid))[0];
      //   console.log('feedback', feedback);
      const userDetails: User = await user.show(String(feedback.user_id));
      const adminDetails: User = await user.show(id);
      const sql = 'DELETE FROM orders WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [oid]);
      conn.release();
      console.log('result', result);
      //   if (result.rows.length == 0) {
      return `${
        result.rows.length == 0 ? 'Success!' : 'oops'
      } Your order with id = ${oid} was deleted by ${adminDetails.username} (${
        adminDetails.firstname
      }, ${adminDetails.lastname}). Order ${oid} was for ${
        userDetails.username
      } with name: ${userDetails.firstname} ${userDetails.lastname}`;
      // }
    } catch (err) {
      throw new Error(`There was a problem deleting order with id = ${id}`);
    }
  }

  async addProduct(
    id: string,
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order | string> {
    try {
      let orderIdTrue, orderOpen;
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *;';
      const currentOpenOrders = await this.show(id); //List of all orders for user_id
      currentOpenOrders.filter(order => {
        if (order.id == Number(orderId)) {
          orderIdTrue = true;
          if (order.status == 'active') {
            orderOpen = true;
          }
        }
      });
      if (!orderIdTrue) {
        return `Order id ${orderId} does not match to user Id ${id}`;
      }
      if (!orderOpen) {
        return `Order id ${orderId} has been closed! Order status is marked as closed`;
      }

      const conn = await client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }
}
