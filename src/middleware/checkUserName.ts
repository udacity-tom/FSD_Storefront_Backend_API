import { Request, Response } from 'express';
import client from '../database';

// async checkUserName(req: Request, res: Response, next: () => void) {
const checkUserName = async (
  req: Request,
  res: Response,
  next: () => void
): Promise<string> => {
  try {
    const sql = 'SELECT * FROM users WHERE username = ($1);';
    const conn = await client.connect();
    const result = await conn.query(sql, [req.body.username]);
    conn.release();
    console.log('checkUserName.ts: result.rows[0]', result.rows[0]);
    if (result.rows[0] == undefined) {
      next();
    } else {
      res.status(400).json({
        message: `Something went wrong checking the username. The username isn't unique!`
      });
    }
    return 'Name Checked & OK!';
  } catch (err) {
    throw new Error(
      `Something went wrong checking username: ${req.body.username}`
    );
  }
};

export default checkUserName;
