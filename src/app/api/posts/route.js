import { NextResponse } from "next/server";
import db from "@/config/db";
import { getPlayerInfoByAccountId } from "@/lib/queries";

export async function GET(request) {
  const connection = await db.getConnection();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5; // Số bài viết mỗi trang
    const offset = (page - 1) * limit;

    // Truy vấn các bài viết ghim
    const [pinnedPosts] = await connection.query("SELECT * FROM posts WHERE ghimbai = 1 ORDER BY created_at DESC");

    // Tạo một mảng để lưu thông tin người chơi cho các bài viết ghim
    const playerDataPromisesPinned = pinnedPosts.map(async (pinnedPost) => {
      const [playerData] = await connection.query(getPlayerInfoByAccountId, [pinnedPost.account_id]);
      return { ...pinnedPost, player: playerData.length ? playerData[0] : null }; // Thêm thông tin player vào bài viết
    });

    // Chờ cho tất cả các truy vấn thông tin người chơi hoàn thành cho bài viết ghim
    const pinnedPostsWithPlayers = await Promise.all(playerDataPromisesPinned);

    // Truy vấn các bài viết còn lại với giới hạn và phân trang
    const sqlRows = "SELECT * FROM posts WHERE ghimbai != 1 ORDER BY created_at DESC  LIMIT ? OFFSET ?";
    const [rows] = await connection.query(sqlRows, [limit, offset]);

    // Tạo một mảng để lưu thông tin người chơi cho các bài viết còn lại
    const playerDataPromisesRows = rows.map(async (post) => {
      const [playerData] = await connection.query(getPlayerInfoByAccountId, [post.account_id]);
      return { ...post, player: playerData.length ? playerData[0] : null }; // Thêm thông tin player vào bài viết
    });

    // Chờ cho tất cả các truy vấn thông tin người chơi hoàn thành cho bài viết còn lại
    const postsWithPlayers = await Promise.all(playerDataPromisesRows);

    // Đếm tổng số bài viết còn lại để tính số trang
    const [[{ total }]] = await connection.query("SELECT COUNT(*) as total FROM posts WHERE ghimbai != 1");

    return NextResponse.json({ pinnedPosts: pinnedPostsWithPlayers, posts: postsWithPlayers, total, totalPages: Math.ceil(total / limit) }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
