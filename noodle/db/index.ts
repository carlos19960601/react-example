import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// 创建数据库连接池
const poolConnection = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456789',
    database: 'noodle',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


export const db = drizzle(poolConnection)