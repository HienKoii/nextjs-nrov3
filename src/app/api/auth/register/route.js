// pages/api/register.js
import db from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, email, password } = await request.json();
  console.log('username', username)
  console.log('password', password)
  console.log('email', email)

  // Kiểm tra xem tất cả các trường có được cung cấp không
  if (!username || !email || !password) {
    return NextResponse.json({ message: "Vui lòng nhập đủ các trường" }, { status: 400 });
  }

  const connection = await db.getConnection();
  try {
    // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu hay chưa
    const [existingUserName] = await connection.query("SELECT * FROM account WHERE username = ?", [username]);
    if (existingUserName.length > 0) {
      return NextResponse.json({ message: "Tài khoản đã tồn tại. Vui lòng nhập Tài khoản khác  !" }, { status: 409 });
    }

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu hay chưa
    const [existingUserEmail] = await connection.query("SELECT * FROM account WHERE gmail = ?", [email]);
    console.log('existingUserEmail', existingUserEmail)
    if (existingUserEmail.length > 0) {
      return NextResponse.json({ message: "Email đã tồn tại. Vui lòng nhập email khác  !" }, { status: 409 });
    }

    // Thêm người dùng vào cơ sở dữ liệu
    await connection.query("INSERT INTO account (username, gmail, password) VALUES (?, ?, ?)", [
      username,
      email,
      password, // Nên mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    ]);

    console.log(`Tài khoản ${username} vừa được tạo thành công !`);

    return NextResponse.json({ message: `Đăng ký tài khoản ${username} thành công !` }, { status: 201 });
  } catch (error) {
    console.error("Lỗi registering user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
