import { NextResponse } from "next/server";
import db from "@/config/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  const connection = await db.getConnection();
  try {
    const { amount, operation } = await request.json(); // Nhận dữ liệu từ client
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: accountId } = decoded.account;
    // Kiểm tra loại thao tác (cộng hoặc trừ)
    const adjustment = operation === "add" ? "+" : "-";
    console.log('adjustment', adjustment)

    // Cập nhật giá trị VND trong bảng account
    await connection.query(`UPDATE account SET vnd = vnd ${adjustment} ? WHERE id = ?`, [amount, accountId]);

    return NextResponse.json({ message: "Cập nhật thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật VND:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
