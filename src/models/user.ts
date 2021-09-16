import client from "../database";
import { AuthStore } from "../middleware/auth";

const auth = new AuthStore;

export type User = {
    id?: number;
    username: string;
    firstname: string;
    lastname: string;
    password_hash: string;
};

export class UserStore {
    async index(): Promise<User[]> {
        
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users;';

            const result = await conn.query(sql);
            conn.release();
            return result.rows;
            
        } catch (err) {
            throw new Error(`Could not find any users. Error: ${err}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            // console.log('user.ts: user ', user);
            user.password_hash = await auth.hashPassword(user.password_hash);
            // console.log('user.ts: user ', user);
            const conn = await client.connect();
            const sql = 'INSERT INTO users (username, firstname, lastname, password_hash) VALUES($1, $2, $3, $4) RETURNING *;';

            const result = await conn.query(sql, [user.username, user.firstname, user.lastname, user.password_hash]);
            // console.log('user.ts: result', result);
            conn.release();
            return result.rows[0];

            //take supplied user and store in database, on success return user in json form
        } catch (err) {
            throw new Error(`Something went wrong, try again. Error: ${err}`);
        } 
    }

    async show(id: string): Promise<User> {
        try {
            console.log('user.ts: id is ', id);
            const sql = 'SELECT * FROM users WHERE id=($1);';
            const conn = await client.connect();
            // const idNum = 
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`There is no user with ID ${id}. Error: ${err}`);
        } 
    }


    async delete(id: string): Promise<User> {
        try {
            console.log('user.ts/delete: id is ', id);
            const sql = 'DELETE FROM users WHERE id=($1);';
            const conn = await client.connect();

            const result = await conn.query(sql, [id]);
            conn.release();
            console.log('user.ts/delete: value of result.rows[0] ', result.rows[0]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot delete user with id = ${id}`);
        } 
    }

    // async authenticate(username: string, password: string): Promise<String> {
    //     try {
    //         const result = auth.authenticate(username, password)
    //         return result;
    //     } catch (err) {
    //         throw new Error('Unable to authenticate ${username}, error: ${err}');
    //     }
    // }

}