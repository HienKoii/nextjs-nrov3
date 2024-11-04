"use client";
import { CommentArrow, Divider, WrapperImgs } from "@/app/styles/stylesGlobals";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, Col, Image, Placeholder, Row } from "react-bootstrap";

import { PATH_NAME } from "@/lib/path";
import { formatDateFull, formatContent } from "@/lib/utils-cn";
import CommentsList from "@/components/comments/commentsList";
import CommentsForm from "@/components/comments/commentsForm";
import { useAuth } from "@/context/AuthContext";
import { CommentsProvider } from "@/context/CommentsContext";
import { CAU_HINH } from "@/config/setting";

export default function PostDetailPage() {
  const { postId } = useParams();
  const router = useRouter();

  const { account } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        console.log("Lấy bài viết theo ID: ", response);
        setPost(response.data);
      } catch (error) {
        router.push(PATH_NAME.home);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  if (loading) {
    return (
      <div className="text-center">
        <Placeholder animation="glow">
          <Placeholder xs={2} style={{ height: "200px" }} /> <Placeholder xs={9} style={{ height: "200px" }} />
        </Placeholder>
      </div>
    );
  }
  return (
    <>
      <Row className="m-1">
        <Col xs={2} sm={1} className="p-0">
          <div className="w-100 hk-flex border border-dark border-2 p-1 rounded bg-secondary">
            <Image
              src={post?.player ? `${CAU_HINH.urlImages}${post?.player?.avatar_id}.png` : "/imgs/karin.png"} //
              alt="avatar" //
              style={{ objectFit: "cover" }}
              width={50}
              height={50}
            />
          </div>
          <p className={`text-center text-wrap fw-bold text-${post?.ghimbai ? "danger" : "primary"}`}>{post?.username}</p>
        </Col>
        <Col xs={10} sm={11} className="pe-0">
          <Card>
            <CommentArrow />
            <Card.Header className="hk-flex-x gap-1">
              <p className={`fw-bold  ${post?.ghimbai ? "text-primary text-uppercase" : ""}`}>{post?.tieude}</p>
              {post?.new ? <Image src="/imgs/new.gif" alt="new" width={23} height={12} /> : null}
            </Card.Header>
            <Card.Body>
              <div dangerouslySetInnerHTML={{ __html: formatContent(post?.noidung) }} />
              {post?.images && (
                <WrapperImgs>
                  {JSON.parse(post?.images).map((item, index) => {
                    return <Image key={index} src={`/api/uploads/${item}`} alt="img" />;
                  })}
                </WrapperImgs>
              )}
            </Card.Body>
            <Card.Footer>
              <p style={{ fontSize: "0.8rem" }} className="fst-italic">
                {formatDateFull(post?.created_at)}
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <CommentsProvider postId={postId}>
        <CommentsList />
        {account && (
          <>
            <Divider />
            <CommentsForm postId={Number(postId)} />
          </>
        )}
      </CommentsProvider>
    </>
  );
}
