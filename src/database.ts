import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER_DEV,
  POSTGRES_USER_TEST,
  POSTGRES_PASSWORD_DEV,
  POSTGRES_PASSWORD_TEST,
  ENV
} = process.env;

let client: Pool = new Pool();
console.log('current env mode', ENV);
if (ENV === 'test') {
  console.log(
    `database.ts: Accessing ${POSTGRES_TEST_DB} database for client connection`
  );
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER_TEST,
    password: POSTGRES_PASSWORD_TEST
  });
}

if (ENV === 'dev') {
  console.log(
    `database.ts: Accessing ${POSTGRES_DB} database for client connection`
  );
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER_DEV,
    password: POSTGRES_PASSWORD_DEV
  });
}

export default client;
