"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useState } from "react";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { PATH_NAME } from "@/lib/path";

export default function LoginPage() {
  const token = Cookies.get("token");
  const router = useRouter();
  const { setAccount, setPlayer } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  // Hàm xử lý chung khi người dùng thay đổi bất kỳ trường nào
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (token) {
      return alert("Đã đăng nhập rồi !!!");
    }
    const { username, password } = formValues;

    if (!username || !password) {
      return Swal.fire({
        title: "Thất bại",
        text: "Vui lòng nhập đủ dữ liệu  !!!",
        icon: "error",
      });
    }

    setLoading(true);
    try {
      // call api
      const response = await axios.post("/api/auth/login", { username, password });
      console.log("Xử lý đăng nhập:  ", response);

      if (response.status === 200) {
        Cookies.set("token", response.data.token, { expires: 1 });

        toast.success("Đăng nhập thành công!");
        setAccount(response.data.account);
        if (response.data.player) {
          setPlayer(response.data.player);
        } else {
          toast.error("Bạn chưa tạo nhận vật !!!");
        }
        // router.push(PATH_NAME.home);
        setTimeout(() => {
          window.location.href = PATH_NAME.home;
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form className="p-2">
        <FloatingLabel controlId="floatingInput" label="Tài khoản" className="mb-3">
          <Form.Control
            type="text" //
            placeholder="Tài khoản"
            autoComplete="username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel controlId="floatingPassword" label="Mật khẩu">
          <Form.Control
            type="password"
            placeholder="Mật khẩu" //
            autoComplete="current-password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
          />
        </FloatingLabel>

        <div className="d-flex justify-content-center align-items-center">
          <Button variant="primary" type="submit" className="mt-3" onClick={handleLogin} disabled={loading}>
            {loading && <Spinner animation="border" variant="light" size="sm" />} Đăng nhập
          </Button>
        </div>
        <Button as={Link} href={"/forgot-password"} variant="link" className="w-100">
          Quên mật khẩu ?
        </Button>
        <div className="hk-flex gap-1 mt-2">
          <span>Bạn chưa có tài khoản? </span>
          <Button variant="link" as={Link} href={PATH_NAME.register} className="p-0">
            Đăng ký ngay !
          </Button>
        </div>
      </Form>
    </>
  );
}
