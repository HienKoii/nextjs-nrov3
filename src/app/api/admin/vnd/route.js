import db from "@/config/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateMoneyAccountId } from "@/lib/queries";

export async function POST(request) {
  const { amount, identifier, isUsername } = await request.json(); // Nhận số tiền cần cộng và identifier (username hoặc id) từ client
  console.log("isUsername", isUsername);
  console.log("identifier", identifier);
  console.log("amount", amount);

  const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  const connection = await db.getConnection();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem người dùng có phải là admin không
    if (!decoded.account?.is_admin) {
      return NextResponse.json({ message: "Không có quyền truy cập" }, { status: 403 });
    }

    // Xác định query dựa trên loại identifier
    const conditionField = isUsername ? "username" : "id";
    const [user] = await connection.query(`SELECT * FROM account WHERE ${conditionField} = ?`, [identifier]);

    // Kiểm tra xem tài khoản có tồn tại không
    if (user.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
    }

    // Cộng số tiền vào tài khoản
    const totalMoney = amount * process.env.PROMO_RATE;
    await connection.query(updateMoneyAccountId, [totalMoney, totalMoney, totalMoney, user[0].id]);

    await connection.commit();

    return NextResponse.json({ message: `Đã cộng ${amount} VND vào tài khoản của ${identifier}` }, { status: 200 });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi cộng tiền:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release();
  }
}
