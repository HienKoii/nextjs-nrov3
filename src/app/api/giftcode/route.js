import { NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(request) {
  const connection = await db.getConnection();
  try {
    const [giftCodes] = await connection.query("SELECT * FROM giftcode");

    // Chuyển đổi dữ liệu giftCodes với thông tin item và itemoption
    const giftCodesWithDetails = await Promise.all(
      giftCodes.map(async (giftCode) => {
        // Xử lý trường listItem
        const listItems = JSON.parse(giftCode.listItem || "[]");
        const itemIds = listItems.map((item) => item.id);

        // Truy vấn để lấy thông tin từ bảng item_template
        const [items] = await connection.query("SELECT id, name, icon_id FROM item_template WHERE id IN (?)", [itemIds]);

        // Kết hợp thông tin của listItems với dữ liệu từ item_template
        const itemsInfo = listItems.map((item) => {
          const matchedItem = items.find((i) => i.id === item.id);
          return {
            id: item.id,
            quantity: item.quantity,
            name: matchedItem ? matchedItem.name : null,
            icon_id: matchedItem ? matchedItem.icon_id : null,
          };
        });

        // Xử lý trường itemoption
        const itemOptions = JSON.parse(giftCode.itemoption || "[]");
        const optionIds = itemOptions.map((option) => option.id);

        // Truy vấn để lấy thông tin từ bảng item_option_template
        const [options] = await connection.query("SELECT id, name FROM item_option_template WHERE id IN (?)", [optionIds]);

        // Kết hợp thông tin của itemOptions với dữ liệu từ item_option_template
        const optionsInfo = itemOptions.map((option) => {
          const matchedOption = options.find((o) => o.id === option.id);
          return {
            id: option.id,
            param: option.param,
            name: matchedOption ? matchedOption.name : null,
          };
        });

        return {
          ...giftCode,
          listItem: itemsInfo, // Thêm thông tin items
          itemoption: optionsInfo, // Thêm thông tin itemOptions
        };
      })
    );

    return NextResponse.json({ giftCodes: giftCodesWithDetails }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy giftCode:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
