import db from "@/config/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getPlayerInfoByAccountId } from "@/lib/queries";

export async function GET(request) {

  const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }
  
  const connection = await db.getConnection();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded.account;
    const [rows] = await connection.query("SELECT * FROM account WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: "Người dùng không tồn tại" }, { status: 404 });
    }

    const account = {
      ...rows[0],
      password: "đã che",
    };

    // Lấy thông tin từ bảng player dựa vào account_id
    const [playerRows] = await connection.query(getPlayerInfoByAccountId, [account.id]);
    const player = playerRows.length > 0 ? playerRows[0] : null;

    return NextResponse.json({ account, player }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Đã xảy ra lỗi khi xử lý yêu cầu" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
