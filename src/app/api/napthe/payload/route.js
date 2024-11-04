import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MD5 } from "crypto-js";
import jwt from "jsonwebtoken";
import db from "@/config/db"; // Kết nối cơ sở dữ liệu

export async function POST(request) {
  const connection = await db.getConnection();
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded.account;

    const formData = await request.json(); // Nhận dữ liệu từ client

    const requestId = uuidv4();
    const signature = MD5(process.env.PARTNER_KEY + formData.code + formData.serial).toString();

    const payload = {
      ...formData,
      sign: signature,
      partner_id: process.env.PARTNER_ID,
      request_id: requestId,
      command: "charging",
    };

    // Gọi API bên thứ ba
    const response = await axios.post("https://doithe.vn/chargingws/v2", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { trans_id, amount, value, declared_value, telco, serial, code, status, message } = response.data;

    // Lưu dữ liệu vào bảng napthe
    const sqlInsertNapThe = `INSERT INTO napthe 
             (account_id,trans_id, request_id, amount, value, declared_value, telco, serial, code, status, message)
       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valuesNapThe = [id, trans_id, requestId, amount, value, declared_value, telco, serial, code, status, message];
    await connection.query(sqlInsertNapThe, valuesNapThe);

    return NextResponse.json(response.data); // Trả về dữ liệu từ API bên thứ ba
  } catch (error) {
    console.error("Lỗi khi xử lý giao dịch nạp thẻ:", error);
    return NextResponse.json({ error: error.message }, { status: error.response?.status || 500 });
  } finally {
    connection.release(); // Đảm bảo giải phóng kết nối
  }
}
