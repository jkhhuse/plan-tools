import { createConnection } from 'mysql2/promise';
import fs from 'fs';

/**
 * 用于从文件中读取数据并自动向数据库中插入数据
 */

const connection = await createConnection({
  host: '100.76.7.167',
  user: 'root',
  password: '123456',
  database: 'plan',
});

const file = fs.readFileSync('file.txt', "utf8");

const lines = file.split("\r\n");

console.log(lines);

// simple query
// const [rows, fields] = await connection.query('SELECT * FROM density');

// console.log(fields);
