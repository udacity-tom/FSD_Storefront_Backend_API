import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import client from '../database';
import jwt from 'jsonwebtoken';
import express from 'express';
import { User } from '../models/user';

//This file provides authentication functions, like: password encryption, JWT verification, etc.

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export class AuthStore {
async authenticate(username: string, password: string): Promise<String> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE username = ($1)';
    const result = await conn.query(sql, [username]);
    const user: User = result.rows[0];
    // console.log('auth.ts: passwordhash', result);
    if(result.rows.length) {
        const userPassword = result.rows[0].password_hash;
        // console.log('auth.ts: userPassword', userPassword);
        // console.log('auth.ts: result.rows[0]', result.rows[0]);
        const passwordCheck = bcrypt.compareSync(password + pepper, userPassword);
        // console.log('auth.ts: passwordCheck', passwordCheck);
        if (passwordCheck){
            // console.log('auth.ts: bcrypt succeded');
            user.password_hash = '';
            user.lastname = '';
            const token = this.createToken(user);
            return (token);
        } else {
            // console.log('auth.ts: bcrypt failed');
            return ('Failure-login refused, try again');
        }
    }
    return ('Unknown user, have you registered an account?');
}

async hashPassword(password: string): Promise<string> {
    const hash = bcrypt.hashSync(password + pepper, parseInt(saltRounds!));
    return hash;
}

// async authorise(req: Requsername: string): Promise<string> {
async createToken(jwtPayloadData: User): Promise<string> {
    // const username: string = req.body.username;
    // console.log('auth.ts: jwtPayloadData', jwtPayloadData);
    const options = {
        expiresIn: '30d',
        subject: 'access'
    }
    try {
    var token: string = jwt.sign(jwtPayloadData, process.env.TOKEN_SECRET!, options);
    } catch (err) {
        throw new Error(`Something went wrong. Err: ${err}`);
    }
    return token;
}

// async authorise(token: string): Promise<string> {
async authorise(token: string): Promise<string> {
    // console.log('auth.ts: token', token);
    try {
        jwt.verify(token, process.env.TOKEN_SECRET!);
    } catch(err) {
        throw new Error(`Invalid Token!!`);
    }
    return 'valid';
}

async verifyAuthToken(req: express.Request, res: express.Response,next: () => void) {
    try {
      const authorisationHeader = String(req.headers.authorization);
    //   console.log('auth.ts: authorisationsHeader value: ', authorisationHeader);
      const jwtToken: string = authorisationHeader?.split(' ')[1];
      const decoded = jwt.verify(jwtToken, String(process.env.TOKEN_SECRET));
    //   console.log('verifyJwt.ts: decoded value', decoded);
      next();
    } catch (err) {
      res.status(401).json({message: 'Invalid Token!'});
    }
  }
}