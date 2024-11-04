"use client";
import { formatStatusCard } from "@/lib/utils-cn";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import NapTienHistory from "@/components/layouts/napTienHistory";
import { useNapThe } from "@/context/NapTheContext";

export default function NapThePage() {
  const { setHistory } = useNapThe();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "", // mã thẻ
    serial: "",
    telco: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) return alert("Vui lòng đăng nhập");
    console.log("formData", formData);

    if (!formData.code || !formData.serial || !formData.telco || !formData.amount) {
      Swal.fire({
        title: "Thất bại!",
        text: "Vui lòng nhập đủ thông tin",
        icon: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // thêm token để biết user nào nạp tiền
      const response = await axios.post("/api/napthe/payload", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Thông báo",
        text: formatStatusCard(response?.data?.status),
        icon: response?.data?.status === 1 || response?.data?.status === 2 ? "success" : "error",
      });
      setFormData({
        code: "", // mã thẻ
        serial: "",
        telco: "",
        amount: "",
      });
      setHistory((prev) => [response?.data, ...prev]);

      console.log("Xử lý nạp thẻ ?>>> ", response);
    } catch (error) {
      console.log("error postThe", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit} className="p-3">
        {/* Loại thẻ (selector) */}
        <FloatingLabel controlId="telco" label="Loại thẻ" className="mb-3">
          <Form.Select name="telco" value={formData.telco} onChange={handleChange}>
            <option value="">Chọn loại thẻ</option>
            <option value="VIETTEL">Viettel</option>
            <option value="VINAPHONE">Vinaphone</option>
            <option value="MOBIFONE">Mobifone</option>
          </Form.Select>
        </FloatingLabel>

        {/* Mệnh giá (selector) */}
        <FloatingLabel controlId="amount" label="Mệnh giá" className="mb-3">
          <Form.Select name="amount" value={formData.amount} onChange={handleChange}>
            <option value="">Chọn mệnh giá</option>
            <option value="10000">10.000 VND</option>
            <option value="20000">20.000 VND</option>
            <option value="50000">50.000 VND</option>
            <option value="100000">100.000 VND</option>
            <option value="200000">200.000 VND</option>
            <option value="500000">500.000 VND</option>
          </Form.Select>
        </FloatingLabel>

        {/* Mã thẻ */}
        <FloatingLabel controlId="code" label="Mã thẻ" className="mb-3">
          <Form.Control
            type="text" //
            name="code"
            placeholder="Nhập mã thẻ"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* Số seri */}
        <FloatingLabel controlId="serial" label="Số Seri" className="mb-3">
          <Form.Control
            type="text" //
            name="serial"
            placeholder="Nhập số seri"
            value={formData.serial}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* Nút nạp thẻ */}
        <div className="d-flex justify-content-center align-items-center">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && <Spinner animation="border" variant="light" size="sm" />} Nạp thẻ
          </Button>
        </div>
      </Form>
      <div className="mb-1">
        <NapTienHistory />
      </div>
    </>
  );
}
