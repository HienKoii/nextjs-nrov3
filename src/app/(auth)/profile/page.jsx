"use client";
import { CAU_HINH } from "@/config/setting";
import { useAuth } from "@/context/AuthContext";
import { PATH_NAME } from "@/lib/path";
import { formatCurrencyVND } from "@/lib/utils-cn";
import Link from "next/link";
import { Button, Card, Col, ListGroup, Placeholder, Row } from "react-bootstrap";

export default function ProfilePage() {
  const { account: user, player, handleLogout, loading } = useAuth();

  if (loading) {
    return (
      <Placeholder as={Card} animation="glow">
        <Placeholder xs={12} style={{ height: "475px" }} />
      </Placeholder>
    );
  }

  const handleActive = () => {
    console.log("handleActive");
  };
  return (
    <Row>
      {/* Cột hiển thị ảnh đại diện */}
      <Col md={3} className="mb-2">
        <Card className="d-flex justify-content-center align-items-center p-2">
          <Card.Img //
            variant="top"
            src={player ? `${CAU_HINH.urlImages}${player?.avatar_id}.png` : "/imgs/karin.png"}
            style={{ width: "55px" }}
          />
          <Card.Body style={{ padding: "unset" }}>
            <Card.Title className="text-center text-primary mt-2">{user?.username}</Card.Title>
          </Card.Body>
        </Card>
      </Col>

      {/* Cột hiển thị thông tin chi tiết */}
      <Col md={9}>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex align-items-center gap-2">
                <strong>ID tài khoản: </strong>
                {user?.id}
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-2">
                <strong>Tên tài khoản: </strong>
                <span className="text-primary  fw-bold">{user?.username}</span>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-2">
                <strong>Tên nhân vật: </strong>
                {player?.name ? (
                  <span className="text-success fw-bold">{player?.name}</span> //
                ) : (
                  <span className="text-danger fw-bold">Chưa tạo nhân vật</span>
                )}
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-2">
                <strong>Trạng thái: </strong>
                {
                  user?.active ? (
                    <span className="text-primary fw-bold"> Đã Kích hoạt</span> //
                  ) : (
                    <Button className="p-0 fst-italic text-danger fw-bold" variant="link" onClick={() => handleActive()}>
                      Chưa kích hoạt
                    </Button>
                  ) //
                }
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-2">
                <strong>VNĐ: </strong>
                {formatCurrencyVND(user?.vnd)}
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-2">
                <strong>Tổng nạp: </strong>
                {formatCurrencyVND(user?.tongnap)}
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-2">
                <strong>Mật khẩu: </strong>
                <Link href={PATH_NAME.doiMatKhau} className="fw-bold text-warning fst-italic">
                  Đổi mật khẩu
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="md-0 py-0 mt-1">
                <div className="d-flex justify-content-center align-items-center">
                  <Button variant="link" onClick={() => handleLogout()}>
                    Đăng xuất
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
