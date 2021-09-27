import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import client from '../database';
import jwt from 'jsonwebtoken';
import express from 'express';
import { User } from '../models/user';

//This file provides authentication functions, like: password encryption, JWT verification, etc.

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = Number(process.env.SALT_ROUNDS);
const tokenSecret = String(process.env.TOKEN_SECRET);

export class AuthStore {
  async authenticate(username: string, password: string): Promise<string> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE username = ($1)';
    const result = await conn.query(sql, [username]);
    const user: User = result.rows[0];
    if (result.rows.length) {
      const userPassword = result.rows[0].password;
      const passwordCheck = bcrypt.compareSync(password + pepper, userPassword);
      if (passwordCheck) {
        user.password = '';
        user.lastname = '';
        const token = this.createToken(user);
        return token;
      } else {
        return 'Failure-login refused, try again';
      }
    }
    return 'Unknown user, have you registered an account?';
  }

  async hashPassword(password: string): Promise<string> {
    const hash = bcrypt.hashSync(password + pepper, saltRounds);
    return hash;
  }

  async createToken(jwtPayloadData: User): Promise<string> {
    const options = {
      expiresIn: '30d',
      subject: 'access'
    };
    try {
      // eslint-disable-next-line no-var
      var token: string = jwt.sign(
        jwtPayloadData,
        String(process.env.TOKEN_SECRET),
        options
      );
    } catch (err) {
      throw new Error(`Something went wrong. Err: ${err}`);
    }
    return token;
  }

  async authorise(token: string): Promise<string> {
    try {
      jwt.verify(token, tokenSecret);
    } catch (err) {
      throw new Error(`Invalid Token!!`);
    }
    return 'valid';
  }

  async verifyAuthToken(
    req: express.Request,
    res: express.Response,
    next: () => void
  ): Promise<void> {
    try {
      const authorisationHeader = String(req.headers.authorization);
      const jwtToken: string = authorisationHeader.split(' ')[1];
      const decoded = jwt.verify(jwtToken, tokenSecret);
      if (decoded) {
        console.log('jwt decoded');
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid Token!' });
    }
  }
}
