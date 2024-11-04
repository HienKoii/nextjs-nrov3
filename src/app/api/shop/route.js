import { NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(request) {
  const connection = await db.getConnection();
  try {
    // Truy vấn các mục từ web_shop với thông tin từ item_template
    const [items] = await connection.query(`
      SELECT 
        ws.*,
        it.TYPE,
        it.NAME as item_name,
        it.description,
        it.icon_id
      FROM web_shop ws
      JOIN item_template it ON ws.item_temp_id = it.id
      WHERE ws.status = 1
    `);

    // Định nghĩa một mảng promises để xử lý lấy NAME cho options
    const itemsWithOptions = await Promise.all(
      items.map(async (item) => {
        const options = JSON.parse(item.options); // Parse options từ chuỗi JSON
        const optionsWithNames = await Promise.all(
          options.map(async (option) => {
            const [optionNameResult] = await connection.query(`SELECT NAME FROM item_option_template WHERE id = ?`, [option.id]);
            return { ...option, name: optionNameResult.length ? optionNameResult[0].NAME : null };
          })
        );

        return { ...item, options: optionsWithNames };
      })
    );

    // Trả về danh sách các mục với thông tin từ item_template và options có NAME
    return NextResponse.json({ items: itemsWithOptions }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách web_shop:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
