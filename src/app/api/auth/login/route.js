import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/config/db";
import { getPlayerInfoByAccountId } from "@/lib/queries";

export async function POST(request) {
  const { username, password } = await request.json();
  const connection = await db.getConnection();
  if (!username || !password) {
    return NextResponse.json({ message: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
  }

  try {
    // Truy vấn thông tin tài khoản
    const [accountRows] = await connection.query("SELECT * FROM account WHERE username = ? AND password = ?", [username, password]);

    if (accountRows.length === 0) {
      return NextResponse.json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" }, { status: 401 });
    }

    const account = {
      ...accountRows[0],
      password: "đã che",
    };

    // Lấy thông tin từ bảng player dựa vào account_id
    const [playerRows] = await connection.query(getPlayerInfoByAccountId, [account.id]);

    const player = playerRows.length > 0 ? playerRows[0] : null;

    // Tạo token JWT
    const token = jwt.sign({ account, player }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Thiết lập cookie
    const response = NextResponse.json({ message: "Đăng nhập thành công", token, account, player });

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
