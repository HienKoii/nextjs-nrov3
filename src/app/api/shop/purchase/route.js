import db from "@/config/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { itemTemp, price, name } = await request.json(); // Nhận dữ liệu từ client

  const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  const connection = await db.getConnection();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const accountId = decoded.account.id;
    const playerId = decoded.player.id;

    await connection.beginTransaction();

    // Trừ VND từ tài khoản người dùng
    const [result] = await connection.query("UPDATE account SET vnd = vnd - ? WHERE id = ?", [price, accountId]);

    if (result.affectedRows === 0) {
      throw new Error("Không thể cập nhật tài khoản người dùng.");
    }

    // Lấy dữ liệu hiện tại của trường items_box_lucky_round
    const [boxLuckyRound] = await connection.query("SELECT items_box_lucky_round FROM player WHERE id = ?", [playerId]);
    if (boxLuckyRound.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy bản ghi" }, { status: 404 });
    }

    // Chuyển mảng thành chuỗi JSON và cập nhật lại vào cơ sở dữ liệu
    let itemsBoxLuckyRound = JSON.parse(boxLuckyRound[0].items_box_lucky_round); // Parse dữ liệu JSON
    itemsBoxLuckyRound.push(itemTemp);
    await connection.query("UPDATE player SET items_box_lucky_round = ? WHERE id = ?", [JSON.stringify(itemsBoxLuckyRound), playerId]);

    await connection.commit();
    console.log(`${decoded.account.username} vừa mua ${name} thành công !`);

    return NextResponse.json({ message: "Mua hàng thành công!" }, { status: 200 });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi xử lý giao dịch:", error);
    return NextResponse.json({ message: "Lỗi khi xử lý giao dịch." }, { status: 500 });
  } finally {
    connection.release();
  }
}
