import client from '../database';
// import { Product } from '../models/product';

export class DashboardQueries {
  async popularProducts(): Promise<string[]> {
    try {
      console.log('in dashboard.ts');
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
}
