import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DTB_HOST,
  user: process.env.DTB_USER,
  password: process.env.DTB_PASSWORD,
  database: process.env.DTB_NAME,
  waitForConnections: true,
  connectionLimit: 10000, // Giới hạn kết nối
  queueLimit: 0,
  timezone: "Z", // 'Z' biểu thị múi giờ UTC
});

export default db;
