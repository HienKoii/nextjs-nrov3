import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/config/db";

// Reset password API
export async function POST(req) {
  const connection = await db.getConnection();
  try {
    const { token, password } = await req.json();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Check if token exists and hasn't expired
    const sqlCheckToken = `SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()`;
    const [resetRecord] = await connection.query(sqlCheckToken, [email, token]);

    if (resetRecord.length === 0) {
      return NextResponse.json({ message: "Token không hợp lệ hoặc đã hết hạn." }, { status: 400 });
    }

    // Update the user's password
    await connection.query(`UPDATE account SET password = ? WHERE gmail = ?`, [password, email]);

    // Delete the reset token after successful password update
    await connection.query(`DELETE FROM password_resets WHERE email = ?`, [email]);

    return NextResponse.json({ message: "Đặt lại mật khẩu thành công." }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    return NextResponse.json({ message: "Lỗi khi đặt lại mật khẩu." }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
