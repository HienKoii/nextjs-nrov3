import { NextResponse } from "next/server";
import db from "@/config/db";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const connection = await db.getConnection();

  const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded.account;
   
    const [history] = await connection.query(`SELECT * FROM napthe WHERE account_id = ? ORDER BY created_at DESC`, [id]);

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error("Error fetching napthe history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    connection.release(); // Giải phóng kết nối
  }
}
