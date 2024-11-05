import db from "@/config/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateMoneyAccountId } from "@/lib/queries";

export async function POST(request) {
  const { amount, identifier, isUsername } = await request.json();

  const numericAmount = Number(amount); // Chuyển đổi amount thành number
  console.log("isUsername", isUsername);
  console.log("identifier", identifier);
  console.log("amount", numericAmount);

  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  const connection = await db.getConnection();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.account?.is_admin) {
      return NextResponse.json({ message: "Không có quyền truy cập" }, { status: 403 });
    }

    const conditionField = isUsername ? "username" : "id";
    const [user] = await connection.query(`SELECT * FROM account WHERE ${conditionField} = ?`, [identifier]);

    if (user.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const totalMoney = numericAmount * process.env.PROMO_RATE;
    await connection.query(updateMoneyAccountId, [totalMoney, totalMoney, totalMoney, user[0].id]);

    // Lưu lịch sử giao dịch vào bảng history_gold
    const sqlTaoLichSuMua = "INSERT INTO history_gold (name, gold, lydo) VALUES (?, ?, ?)";
    const valuesTaoLichSuMua = [user[0].username, totalMoney, `${user[0].username} vừa được cộng tiền trên web thành công !`];
    await connection.query(sqlTaoLichSuMua, valuesTaoLichSuMua);

    await connection.commit();

    return NextResponse.json({ message: `Đã cộng ${numericAmount} VND vào tài khoản của ${identifier}` }, { status: 200 });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi cộng tiền:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  } finally {
    connection.release();
  }
}
