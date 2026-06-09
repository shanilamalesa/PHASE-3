// lib/db.js
// manage connection data base 
///it connects postgress to SQL
//pg-official postgress client for SQL


import { Pool } from "pg";//-> manages multiples database connetions

const globalForPool = globalThis;//-->global object available everywhere in node.js

export const pool =
//if a pool already exist(use it), if not create a new one
  globalForPool._pool ||
  new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10, //allow 10 active connection
  });

if (process.env.NODE_ENV !== "production") globalForPool._pool = pool;

//we export here so as it can be used in other compenents
export async function query(text, params) {
  return pool.query(text, params);
}