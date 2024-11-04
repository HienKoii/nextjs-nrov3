import { CommentArrow } from "@/app/styles/stylesGlobals";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import Loading from "../loading";
import axios from "axios"; // Import Axios
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useComments } from "@/context/CommentsContext";
import { CAU_HINH } from "@/config/setting";

export default function CommentsForm({ postId }) {
  const { account, player, loading } = useAuth();
  const { fetchComments } = useComments();

  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");
    if (!token) return toast.error("Vui lòng đăng nhập");
    if (!commentContent.trim()) return toast.error("Vui lòng không để trống bình luận");

    setIsLoading(true);
    try {
      const payload = {
        postId, // ID của bài viết
        content: commentContent, // Nội dung bình luận
      };
      console.log("payload", payload);

      const response = await axios.post("/api/comments", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra phản hồi
      console.log("Thêm bình lận:", response.data);
      if (response.status === 201) {
        fetchComments(1);
        toast.success(response.data.message);
        setCommentContent("");
      } else {
        toast.error(response.data.message);
        console.error("Có lỗi xảy ra:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Row className="m-1 p-0">
      <Col xs={2} sm={1} className="p-0">
        <div className="w-100 hk-flex border border-dark border-2 p-1 rounded bg-secondary">
          <Image src={player ? `${CAU_HINH.urlImages}${player?.avatar_id}.png` : "/imgs/karin.png"} alt="avatar" style={{ objectFit: "cover" }} width={50} height={50} />
        </div>
        <p className="text-center text-primary text-wrap">{account.username}</p>
      </Col>
      <Col xs={10} sm={11} className="pe-0">
        <Card>
          <CommentArrow />
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập bình luận..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)} // Cập nhật nội dung bình luận
              />
            </Form.Group>
            <div className="hk-flex mb-2">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Đang gửi..." : "Bình luận"}
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
