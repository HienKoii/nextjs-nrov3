"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { PATH_NAME } from "@/lib/path";
import { Alert, Button, Container, Form, Nav, Tab, Tabs } from "react-bootstrap";
import axios from "axios";

export default function AdminPage() {
  const token = Cookies.get("token");

  const [amount, setAmount] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isUsername, setIsUsername] = useState(true); // Mặc định sử dụng `username`
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.account.is_admin) return (window.location.href = PATH_NAME.home);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("Lỗi khi decode token:", error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const payload = { amount, identifier, isUsername };
      const response = await axios.post("/api/admin/vnd", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("xử lý cộng vnd", response);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <div>
      <Tabs defaultActiveKey="vnd" id="justify-tab-example" className="mb-3" justify>
        <Tab eventKey="vnd" title="Home">
          <Container>
            <h3 className="mt-4">Cộng tiền vào tài khoản</h3>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="amount" className="mb-3">
                <Form.Label>Số tiền (VND)</Form.Label>
                <Form.Control
                  type="number" //
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="Nhập số tiền"
                />
              </Form.Group>

              <Form.Group controlId="identifier" className="mb-3">
                <Form.Label>Tên đăng nhập hoặc ID</Form.Label>
                <Form.Control
                  type="text"
                  value={identifier} //
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Nhập tên đăng nhập hoặc ID"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label="Username" //
                  name="identifierType"
                  checked={isUsername}
                  onChange={() => setIsUsername(true)}
                />
                <Form.Check type="radio" label="ID" name="identifierType" checked={!isUsername} onChange={() => setIsUsername(false)} />
              </Form.Group>

              <Button variant="primary" type="submit">
                Cộng tiền
              </Button>
            </Form>
          </Container>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          Tab content for Profile
        </Tab>
        <Tab eventKey="longer-tab" title="Loooonger Tab">
          Tab content for Loooonger Tab
        </Tab>
      </Tabs>
    </div>
  );
}
