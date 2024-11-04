"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Col, Form, Image, Row, Spinner } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa"; // Import icon
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import Loading from "@/components/loading";
import { useAuth } from "@/context/AuthContext";
import { PATH_NAME } from "@/lib/path";
import { usePosts } from "@/context/PostsContext";

export default function CreatePostsPage() {
  const router = useRouter();
  const { account, loading: accountLoading } = useAuth();
  const { fetchPosts } = usePosts();

  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [formData, setFormData] = useState({
    tieude: "",
    noidung: "",
    ghimbai: false,
    new: false,
    images: [], // Thêm field để lưu trữ ảnh đã chọn
  });

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const imageUrls = [...e.target.files];
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: imageUrls, // Cập nhật danh sách ảnh đã chọn
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    console.log("formData", formData);

    if (!token) return router.push(PATH_NAME.login);

    if (!formData.tieude || !formData.noidung) {
      return Swal.fire({
        title: "Thất bại",
        text: "Tiêu đề và nội dung không được để trống !",
        icon: "error",
      });
    }
    if (formData.tieude.length > 60) {
      return Swal.fire({
        title: "Thất bại",
        text: "Tiêu đề không được dài quá 60 ký tự",
        icon: "error",
      });
    }
    // if (formData.noidung.length > 255) {
    //   return Swal.fire({
    //     title: "Thất bại",
    //     text: "Nội dung không được dài quá 255 ký tự",
    //     icon: "error",
    //   });
    // }

    const newFormData = new FormData();
    newFormData.append("tieude", formData.tieude);
    newFormData.append("noidung", formData.noidung);
    newFormData.append("ghimbai", formData.ghimbai ? 1 : 0);
    newFormData.append("new", formData.new ? 1 : 0);
    formData.images.forEach((image) => {
      newFormData.append("images", image); // Đảm bảo rằng tên trường là "images"
    });

    setLoading(true);
    try {
      const response = await axios.post("/api/posts/create", newFormData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo rằng Content-Type được thiết lập đúng
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      setFormData({
        tieude: "",
        noidung: "",
        ghimbai: false,
        new: false,
        images: [],
      });
      toast.success(response?.data?.message);
      fetchPosts(1);
      console.log("Kết quả xử lý đăng bài viết: ", response);
    } catch (error) {
      toast.error("lỗi đăng bài viết");
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  if (accountLoading) {
    return <Loading />;
  }
  return (
    <>
      <Form onSubmit={handleSubmit} className="p-3">
        <Form.Group controlId="tieude">
          <Form.Label>Tiêu Đề</Form.Label>
          <Form.Control
            type="text"
            name="tieude" //
            value={formData.tieude}
            onChange={handleChange}
            placeholder="Nhập tiêu đề"
            required
          />
        </Form.Group>

        <Form.Group controlId="noidung" className="mt-3">
          <Form.Label>Nội Dung</Form.Label>
          <Form.Control
            as="textarea"
            rows={3} //
            name="noidung"
            value={formData.noidung}
            onChange={handleChange}
            placeholder="Nhập nội dung bài viết"
            required
          />
        </Form.Group>

        {account?.is_admin ? (
          <>
            <Form.Group controlId="ghimbai" className="mt-3">
              <Form.Check
                type="checkbox"
                name="ghimbai"
                label="Ghim Bài Viết" //
                checked={formData.ghimbai}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="new" className="mt-3 d-flex align-items-center">
              <Form.Check type="checkbox" name="new" checked={formData.new} onChange={handleChange} label=" " />
              <Image src="/imgs/new.gif" alt="new" width={23} height={12} />
            </Form.Group>
            <Form.Group controlId="images" className="mt-3">
              <Form.Label>Chọn Ảnh</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} accept="images/*" />
            </Form.Group>
            {/* Hiển thị ảnh đã chọn */}
            <Row className="mt-3">
              {formData.images.map((image, index) => (
                <Col key={index} lg={6}>
                  <Image
                    src={URL.createObjectURL(image)} //
                    alt={`selected-${index}`}
                    thumbnail
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </Col>
              ))}
            </Row>
          </>
        ) : null}

        <div className="w-100 hk-flex">
          <Button
            variant="primary"
            type="submit" //
            disabled={loading}
            className="mt-3 d-flex align-items-center"
          >
            {loading ? (
              <>
                <Spinner animation="border" variant="light" size="sm" /> Đang đăng...
              </>
            ) : (
              <>
                <FaPaperPlane className="me-2" /> Đăng bài
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  );
}
