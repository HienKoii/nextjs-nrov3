"use client";

import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Spinner } from "react-bootstrap";
import { isValid } from "@/lib/utils-cn";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra password
    if (!isValid(password)) {
      return Swal.fire({
        title: "Thông báo",
        text: "Tài khoản hoặc mật khẩu không hợp lệ. Chỉ được chứa ký tự chữ cái thường và số",
        icon: "error",
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        title: "Thông báo",
        text: "Hai mật khẩu không khớp",
        icon: "error",
      });
    }

    setLoading(true);
    try {
      // Gửi yêu cầu đến API để đặt lại mật khẩu
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      toast.success(response.data.message);
      toast.success("Vui lòng đăng nhập lại !");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="p-3" onSubmit={handleSubmit}>
      <Form.Group controlId="formNewPassword" className="mb-3">
        <Form.Label>Mật khẩu mới</Form.Label>
        <Form.Control
          type="password"
          placeholder="Nhập mật khẩu mới" //
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formConfirmPassword" className="mb-3">
        <Form.Label>Xác nhận mật khẩu</Form.Label>
        <Form.Control
          type="password"
          placeholder="Xác nhận mật khẩu" //
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100" disabled={loading}>
        {loading && <Spinner animation="border" variant="light" size="sm" />} Đặt lại mật khẩu
      </Button>
    </Form>
  );
}
