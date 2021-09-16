import dotenv from 'dotenv';
import  { Pool } from 'pg';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_USER_DEV,
    POSTGRES_USER_TEST,
    POSTGRES_PASSWORD,
    POSTGRES_PASSWORD_DEV,
    POSTGRES_PASSWORD_TEST,
    ENV,
} = process.env;
// console.log(POSTGRES_DB, POSTGRES_HOST, POSTGRES_USER_TEST, POSTGRES_USER_DEV, POSTGRES_TEST_DB, POSTGRES_PASSWORD_DEV,POSTGRES_PASSWORD_TEST, "From database.ts");

let client:Pool = new Pool();
console.log("current env mode",ENV);
if(ENV === 'test'){
    console.log(`database.ts: Accessing ${POSTGRES_DB} database for client connection`);
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER_TEST,
        password: POSTGRES_PASSWORD_TEST,
    });
};

if(ENV === 'dev'){
    console.log(`database.ts: Accessing ${POSTGRES_DB} database for client connection`);
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER_DEV,
        password: POSTGRES_PASSWORD_DEV,
    });
};

// if(ENV === 'setup'){
//     console.log(`database.ts: Setting up the databases in Postgres`);
//     client = new Pool({
//         host: POSTGRES_HOST,
//         database: POSTGRES_DB,
//         user: POSTGRES_USER,
//         password: POSTGRES_PASSWORD
//     })
// }
export default client;