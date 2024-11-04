import { NextResponse } from "next/server";
import db from "@/config/db";
import { getPlayerInfoByAccountId } from "@/lib/queries";

export async function GET(request, context) {
  const connection = await db.getConnection();
  try {
    const { id } = await context.params; // await để lấy params

    // Truy vấn bài viết dựa trên ID
    const [rows] = await connection.query("SELECT * FROM posts WHERE id = ?", [id]);

    // Kiểm tra xem bài viết có tồn tại không
    if (rows.length === 0) {
      return NextResponse.json({ message: "Bài viết không tồn tại." }, { status: 404 });
    }

    // Lấy thông tin người chơi bằng account_id
    const [playerData] = await connection.query(getPlayerInfoByAccountId, [rows[0].account_id]);

    // Kết hợp thông tin bài viết với thông tin người chơi
    const postWithPlayer = { ...rows[0], player: playerData.length ? playerData[0] : null };

    return NextResponse.json(postWithPlayer, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
