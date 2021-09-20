import client from '../database';
import { AuthStore } from '../middleware/auth';
import { Request, Response } from 'express';

const auth = new AuthStore();

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

  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`There was an error with ${id}. Erro: ${err}`);
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

  //   async update(order: Order): Promise <Order> {
  //       try {

  //       } catch (err) {
  //           throw new Error(`There was an error with updating the order: ${id}`)
  //       }
  //   }

  //   async delete
}
