import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products ORDER BY id ASC;';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find any products. Error: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *;';
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category
      ]);
      conn.release();
      return result.rows[0];
      //take supplied user and store in database, on success return user in json form
    } catch (err) {
      throw new Error(
        `Something went wrong, try again. Duplicate product account? Error: ${err}`
      );
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`There is no product with ID ${id}. Error: ${err}`);
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const sql =
        'UPDATE products SET name= ($1), price= ($2), category=($3) WHERE products.id = ($4) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
        product.id
      ]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Something went wrong with updating product with ID=${product.id} and name ${product.name}`
      );
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const feedback = await this.show(id);
      const sql = 'DELETE FROM products WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return `${
        result.rows.length == 0 ? 'Success!' : 'oops'
      }  Product with id = ${id} was deleted, Product name: ${
        feedback.name
      }, (${feedback.price} ${feedback.category})`;
    } catch (err) {
      throw new Error(`Cannot delete user with id = ${id}`);
    }
  }
}
