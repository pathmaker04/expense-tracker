import dotenv from 'dotenv'
dotenv.config();
import mysql from 'mysql2/promise';
console.log("ENV:", process.env.DATABASE_URL!)
//  const db = await mysql.createConnection({
//    host: 'localhost',
//    user  : 'root',
//    password: '',
//    database: 'expense_tracker',
//  });

const db = await mysql.createConnection(process.env.DATABASE_URL!)

// const db = await mysql.createConnection({
//   host: 'hopper.proxy.rlwy.net',
//   user: 'root',
//   password: '',
//   database: 'railway',
//   port: 51627
// })


export { db };
