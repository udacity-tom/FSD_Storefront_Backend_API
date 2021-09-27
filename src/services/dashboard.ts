import client from '../database';
import { Order } from '../models/order';
import { Product } from '../models/product';

export class DashboardQueries {
  async popularProducts(): Promise<string[]> {
    try {
      //   console.log('in dashboard.ts');
      const sql =
        'SELECT product_id, sum(quantity) FROM order_products GROUP BY ROLLUP(product_id) ORDER BY sum(quantity) DESC LIMIT 6;';
      const conn = await client.connect();
      const filtered = (await conn.query(sql)).rows.filter(item => {
        if (item.product_id != null) {
          return item;
        }
      });

      return filtered;
    } catch (err) {
      throw new Error(`Something went wrong!`);
    }
  }

  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products WHERE products.category = ($1);';
      const conn = await client.connect();
      const results = await conn.query(sql, [category]);
      return results.rows;
    } catch (err) {
      throw new Error(`Something went wrong! There is no category ${category}`);
    }
  }
  async userOrdersCompleted(uid: string): Promise<Order[]> {
    try {
      const sql =
        "SELECT * FROM orders WHERE user_id= ($1) AND orders.status='complete';";
      const conn = await client.connect();
      const results = await conn.query(sql, [uid]);
      return results.rows;
    } catch (err) {
      throw new Error(
        `Something went wront! No complete orders for user id = ${uid}`
      );
    }
  }
}
