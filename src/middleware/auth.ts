import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import client from '../database'

//provides authentication functions, like: password encryption, JWT verification, etc.

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export class AuthStore {
async authenticate(username: string, password: string): Promise<String> {
    const conn = await client.connect();
    const sql = 'SELECT password_hash FROM users WHERE username = ($1)';
    const result = await conn.query(sql, [username]);
    // console.log('auth.ts: passwordhash', result);
    if(result.rows.length) {
        const userPassword = result.rows[0];
        // console.log('auth.ts: userPassword', userPassword);
        const passwordCheck = bcrypt.compareSync(password + pepper, userPassword.password_hash);
        // console.log('auth.ts: passwordCheck', passwordCheck);
        if (passwordCheck){
            console.log('auth.ts: bcrypt succeded');
            return ('Success-login accepted');
        } else {
            console.log('auth.ts: bcrypt failed');
            return ('Success-login refused, try again');
        }
    }
    return ('Unknown user, have you registered an account?');
}

async hashPassword(password: string): Promise<string> {
    const hash = bcrypt.hashSync(password + pepper, parseInt(saltRounds!));
    return hash;
}


}