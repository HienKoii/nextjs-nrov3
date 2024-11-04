"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { useAuth } from "@/context/AuthContext";
import { isValid } from "@/lib/utils-cn";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { handleLogout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) return router.push(PATH_NAME.login);
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      return Swal.fire({
        title: "Thất bại",
        text: "Vui lòng nhập đủ dữ liệu  !!!",
        icon: "error",
      });
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      return Swal.fire({
        title: "Thất bại",
        text: "Xác nhận mật khẩu không trùng nhau !",
        icon: "error",
      });
    }

    if (!isValid(formData.newPassword || !isValid(formData.confirmNewPassword) || !isValid(formData.currentPassword))) {
      return Swal.fire({
        title: "Thông báo",
        text: "Mật khẩu không hợp lệ. Chỉ được chứa ký tự chữ cái thường và số",
        icon: "error",
      });
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/change-password", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Xử lý đổi mật khẩu: ", response);
      toast.success(response?.data?.message);
      handleLogout();
    } catch (error) {
      //   console.log("Lỗi đổi mật khẩu", error?.response ? error?.response?.data : error?.message);
      return Swal.fire({
        title: "Thất bại",
        text: error?.response?.data?.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="p-3">
      {/* Trường username ẩn để đảm bảo tính khả dụng */}
      <Form.Control type="text" name="username" style={{ display: "none" }} autoComplete="username" aria-label="Username" />

      <FloatingLabel controlId="currentPassword" label="Mật khẩu hiện tại" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Mật khẩu hiện tại"
          autoComplete="current-password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
          aria-label="Current Password"
        />
      </FloatingLabel>

      <FloatingLabel controlId="newPassword" label="Mật khẩu mới" className="mb-3">
        <Form.Control
          type="password" //
          placeholder="Mật khẩu mới"
          autoComplete="new-password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          aria-label="New Password"
        />
      </FloatingLabel>

      <FloatingLabel controlId="confirmNewPassword" label="Xác nhận mật khẩu mới" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          autoComplete="new-password"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
          aria-label="Confirm New Password"
        />
      </FloatingLabel>

      <div className="d-flex justify-content-center align-items-center">
        <Button variant="primary" type="submit" onClick={handleSubmit} disabled={loading}>
          {loading && <Spinner animation="border" variant="light" size="sm" />} Đổi mật khẩu
        </Button>
      </div>
    </Form>
  );
}
