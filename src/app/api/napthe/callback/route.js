import { NextResponse } from "next/server";
import db from "@/config/db";
import { updateMoneyAccountId } from "@/lib/queries";

export async function GET(request) {
  const connection = await db.getConnection();
  try {
    const { searchParams } = new URL(request.url);

    const status = parseInt(searchParams.get("status"));
    const message = searchParams.get("message");
    const request_id = searchParams.get("request_id");
    const declared_value = parseFloat(searchParams.get("declared_value")) || null;
    const value = parseFloat(searchParams.get("value")) || null;
    const amount = parseFloat(searchParams.get("amount")) || null;
    const code = searchParams.get("code");
    const serial = searchParams.get("serial");
    const telco = searchParams.get("telco");

    // Kiểm tra nếu `request_id` tồn tại
    if (!request_id) {
      return NextResponse.json({ error: "Missing request_id" }, { status: 400 });
    }

    // Tìm bản ghi `napthe` theo `request_id`
    const [naptheRecord] = await connection.query(`SELECT account_id FROM napthe WHERE request_id = ?`, [request_id]);

    if (!naptheRecord.length) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const accountId = naptheRecord[0].account_id;

    // Cập nhật bản ghi trong bảng `napthe`
    const [result] = await connection.query(
      `
      UPDATE napthe 
         SET status = ?, message = ?, declared_value = ?, value = ?, amount = ?, code = ?, serial = ?, telco = ?
              WHERE request_id = ?
      `,
      [status, message, declared_value, value, amount, code, serial, telco, request_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    // Nếu `status = 1`, cập nhật trường `vnd` trong bảng `account`
    const totalMoney = value * process.env.PROMO_RATE;
    if ((status === 1 || status === 2) && value) {
      await connection.query(updateMoneyAccountId, [totalMoney, totalMoney, totalMoney, accountId]);
      console.log(`Tài khoản ${accountId} vừa nạp ${totalMoney} vnđ thành công !`);
    }
    return NextResponse.json({ success: true, message: "Record updated successfully" });
  } catch (error) {
    console.error("Error updating napthe:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    connection.release(); // Giải phóng kết nối
  }
}
