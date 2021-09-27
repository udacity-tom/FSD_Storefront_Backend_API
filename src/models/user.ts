import client from '../database';
import { AuthStore } from '../middleware/auth';

const auth = new AuthStore();

export type User = {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const sql = 'SELECT * FROM users;';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find any users. Error: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      user.password = await auth.hashPassword(user.password);
      const sql =
        'INSERT INTO users (username, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
        user.password
      ]);
      conn.release();
      return result.rows[0];
      //take supplied user and store in database, on success return user in json form
    } catch (err) {
      throw new Error(
        `Something went wrong, try again. Duplicate user account? Error: ${err}`
      );
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`There is no user with ID ${id}. Error: ${err}`);
    }
  }

  async update(user: User): Promise<User> {
    try {
      const sql =
        'UPDATE users SET username= ($1), firstname= ($2), lastname=($3) WHERE users.id = ($4) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
        user.id
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Something went wrong with updating user with ID=${
          user.id
        } and name ${(user.firstname, ' ', user.lastname)}`
      );
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const feedback = await this.show(id);
      const sql = 'DELETE FROM users WHERE id=($1);';
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      return `${
        result.rows.length == 0 ? 'Success!' : 'oops'
      } User with id = ${id} was deleted, Username: ${feedback.username}, (${
        feedback.firstname
      } ${feedback.lastname})`;
    } catch (err) {
      throw new Error(`Cannot delete user with id = ${id}`);
    }
  }
}
