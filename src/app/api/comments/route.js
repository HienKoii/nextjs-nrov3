import { NextResponse } from "next/server";
import db from "@/config/db";
import { getPlayerInfoByAccountId } from "@/lib/queries";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const connection = await db.getConnection();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5; // Số bình luận mỗi trang
    const postId = searchParams.get("postId"); // Lấy postId từ query params
    const offset = (page - 1) * limit;

    if (!postId) {
      return NextResponse.json({ message: "postId không được cung cấp" }, { status: 400 });
    }

    // Truy vấn danh sách bình luận với giới hạn, phân trang và lọc theo post_id
    const sql = "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const [comments] = await connection.query(sql, [postId, limit, offset]);

    // Tạo một mảng để lưu thông tin người chơi cho các bình luận
    const playerDataPromisesPinned = comments.map(async (comment) => {
      const [playerData] = await connection.query(getPlayerInfoByAccountId, [comment.account_id]);
      const [accountData] = await connection.query("SELECT username FROM account WHERE id = ?", [comment.account_id]);
      return {
        ...comment,
        username: accountData[0]?.username || null,
        player: playerData.length ? playerData[0] : null,
      }; // Thêm thông tin player vào bình luận
    });

    // Chờ cho tất cả các truy vấn thông tin người chơi hoàn thành
    const pinnedPostsWithPlayers = await Promise.all(playerDataPromisesPinned);

    // Đếm tổng số bình luận để tính số trang
    const [[{ total }]] = await connection.query("SELECT COUNT(*) as total FROM comments WHERE post_id = ?", [postId]);

    return NextResponse.json({ comments: pinnedPostsWithPlayers, total, totalPages: Math.ceil(total / limit) }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}

export async function POST(request) {
  const connection = await db.getConnection();

  const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return NextResponse.json({ message: "Vui lòng đăng nhập !" }, { status: 401 });
  }
  try {
    const { postId, content } = await request.json(); // Nhận dữ liệu từ client
    console.log("content", content);
    console.log("postId", postId);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded.account;

    // Truy vấn thêm bình luận vào bảng comments
    const sql = "INSERT INTO comments (post_id, account_id, content) VALUES (?, ?, ?)";
    const [result] = await connection.query(sql, [postId, id, content]);

    return NextResponse.json({ message: "Bình luận thành công!", commentId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
