"use client";
import { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Spinner, Card } from "react-bootstrap";
import { PRIMARY_COLOR } from "@/app/styles/stylesGlobals";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      console.log("Xử lý gửi liên kết đổi mật khẩu >", response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="p-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Nhập email của bạn</Form.Label>
          <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <div className="hk-flex">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && <Spinner animation="border" variant="light" size="sm" />} Gửi liên kết đặt lại mật khẩu
          </Button>
        </div>
      </Form>
      <Card className="text-danger mt-2 fw-bold p-2" style={{ backgroundColor: PRIMARY_COLOR }}>
        <p>- Yêu cầu là email thật và đã liên kết với tài khoản.</p>
        <p>- Sau khi gửi liên kết hãy vào hộp thư kiểm tra (có thể ở thư rác).</p>
        <p>- Sau khi thấy email hãy ấn vào link đó để đổi mật khẩu !</p>
        <p>- Chúc các bạn chơi game vui vẻ</p>
      </Card>
    </Container>
  );
}
