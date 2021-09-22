import client from '../database';
import { AuthStore } from '../middleware/auth';
import { Request, Response } from 'express';
import { User, UserStore } from './user';

const auth = new AuthStore();
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

  async showOrder(id: string, oid: string): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND id=($2);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id, oid]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `There was an error with finding order ID=${id}. Erro: ${err}`
      );
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `There was an error with order for ${order.user_id}. Error: ${err}`
      );
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

  async delete(id: string): Promise<string> {
    try {
      const feedback: Order = await this.show(id)[0];
      const userDetails: User = await user.show(String(feedback.user_id));
      const sql = 'DELETE FROM orders WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return `Success! Your order with id=${id} was deleted. Order ${id} was for ${userDetails.username} with name: ${userDetails.firstname} ${userDetails.lastname}`;
    } catch (err) {
      throw new Error(`There was a problem deleting order with id=${id}`);
    }
  }

  async addProduct(
    id: string,
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order | string> {
    try {
      let orderIdTrue;
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *;';
      const currentOpenOrders = await this.show(id); //List of all orders for user_id
      //   console.log('current open orders', currentOpenOrders);
      //   if((await this.show(id)).filter(orderId));
      currentOpenOrders.filter(item => {
        if (item.id == Number(orderId)) {
          orderIdTrue = true;
        }
      });
      const conn = await client.connect();
      if (!orderIdTrue) {
        conn.release();
        return `Order id ${orderId} does not match to user Id ${id}`;
      }

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
