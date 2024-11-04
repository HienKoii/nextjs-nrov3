import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  // params.file là một mảng, cần nối thành chuỗi
  const file = Array.isArray(params.file) ? params.file.join("/") : params.file;

  // Đường dẫn tới thư mục uploads
  const filePath = path.join(process.cwd(), "public", "uploads", file);

  try {
    // Kiểm tra xem tệp có tồn tại hay không
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Đọc tệp
    const fileData = fs.readFileSync(filePath);
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "Error serving file" }, { status: 500 });
  }
};
