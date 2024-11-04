import db from "@/config/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

export async function POST(request) {
  const connection = await db.getConnection();
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
    if (!token) {
      return NextResponse.json({ message: "Vui lòng đăng nhập" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded.account;

    // Lấy dữ liệu từ formData
    const formData = await request.formData();

    const tieude = formData.get("tieude");
    const noidung = formData.get("noidung");
    const ghimbai = formData.get("ghimbai");
    const isNew = formData.get("new");
    const files = formData.getAll("images");

    // Kiểm tra các trường hợp thiếu dữ liệu
    if (!tieude || !noidung) {
      return NextResponse.json({ message: "Vui lòng điền đầy đủ thông tin tiêu đề và nội dung" }, { status: 400 });
    }

    const imagePaths = [];
    const userUploadsDir = path.join(process.cwd(), `public/uploads`);
    for (const file of files) {
      const nameFile = `${username}-${file.name}`;
      // Kiểm tra xem thư mục đã tồn tại chưa
      if (!fs.existsSync(userUploadsDir)) {
        fs.mkdirSync(userUploadsDir, { recursive: true }); // Tạo thư mục nếu chưa có
      }
      // Lưu trữ và lấy đường dẫn file
      const uploadPath = path.join(userUploadsDir, nameFile);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(uploadPath, buffer);
      imagePaths.push(`${nameFile}`);
    }

    // Thêm bài viết mới vào cơ sở dữ liệu
    const sql = "INSERT INTO posts (tieude, noidung, ghimbai, new, images , account_id, username) VALUES (?, ?, ? , ?, ?, ?, ?)";
    await connection.query(sql, [tieude, noidung, ghimbai, isNew, JSON.stringify(imagePaths), id, username]);

    // Trả về kết quả sau khi thêm bài viết thành công
    return NextResponse.json({ message: "Đăng bài thành công" }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
