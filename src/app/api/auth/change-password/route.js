import { NextResponse } from "next/server";
import db from "@/config/db"; // Đảm bảo đường dẫn đến config chính xác
import jwt from "jsonwebtoken";

export async function POST(request) {
  const connection = await db.getConnection();
  try {
    const { currentPassword, newPassword, confirmNewPassword } = await request.json();
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Thiếu token xác thực" }, { status: 401 });
    }

    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded.account;
    // Kiểm tra mật khẩu mới
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ message: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ message: "Mật khẩu mới và xác nhận không khớp" }, { status: 400 });
    }

    // Kiểm tra mật khẩu hiện tại
    const [rows] = await connection.query("SELECT password FROM account WHERE id = ?", [id]);

    if (rows.length === 0 || rows[0].password !== currentPassword) {
      return NextResponse.json({ message: "Mật khẩu hiện tại không đúng" }, { status: 401 });
    }

    if (newPassword === currentPassword) {
      return NextResponse.json({ message: "Mật khẩu mới phải khác mật khẩu hiện tại" }, { status: 400 });
    }

    // Cập nhật mật khẩu mới
    await connection.query("UPDATE account SET password = ? WHERE id = ?", [newPassword, id]);

    return NextResponse.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
