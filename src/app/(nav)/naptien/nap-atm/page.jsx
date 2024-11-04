"use client";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, ListGroup, OverlayTrigger, Tooltip, Image, Placeholder } from "react-bootstrap";

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { BANK_KING } from "@/config/setting";

export default function NapAtmPage() {
  const { account, loading } = useAuth();

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      copy
    </Tooltip>
  );

  const handleCopy = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Sao chép thành công!");
      })
      .catch(() => {
        toast.success("Sao chép thất bại!");
      });
  };

  if (loading) {
    return (
      <Placeholder animation="glow">
        <Placeholder xs={12} style={{ height: "472px" }} />
      </Placeholder>
    );
  }
  return (
    <div>
      <>
        <Row>
          <Col xs={12}>
            <div className="hk-flex mt-3">
              <Image
                src={`https://img.vietqr.io/image/${BANK_KING.key}-${BANK_KING.stk}-compact.png?addInfo=${account?.id}%20${account?.username}`} //
                alt="atm"
                width={220}
              />
            </div>
          </Col>
          <Col xs={12} className="mt-3">
            <ListGroup as="ul">
              <ListGroup.Item as="li" className="d-flex align-items-center gap-2">
                <strong className="text-danger">Tên ngân hàng:</strong>
                <strong className="text-primary">{BANK_KING.key}</strong>
              </ListGroup.Item>

              <ListGroup.Item as="li" className="d-flex align-items-center gap-2">
                <strong className="text-danger">STK :</strong>
                <strong className="text-primary">{BANK_KING.stk}</strong>
                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                  <FontAwesomeIcon
                    icon={faCopy}
                    style={{ padding: "0 12px", cursor: "pointer" }} ///
                    onClick={() => handleCopy(BANK_KING.stk)}
                  />
                </OverlayTrigger>
              </ListGroup.Item>

              <ListGroup.Item as="li" className="d-flex align-items-center gap-2">
                <strong className="text-danger">Tên bank:</strong>
                <strong className="text-primary">{BANK_KING.name}</strong>
              </ListGroup.Item>

              <ListGroup.Item as="li" className="d-flex align-items-center gap-2">
                <strong className="text-danger">Nội Dung Chuyển:</strong>
                <strong className="text-primary">
                  {account?.id} {account?.username}
                </strong>
                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                  <FontAwesomeIcon
                    icon={faCopy}
                    style={{ padding: "0 12px", cursor: "pointer" }} ///
                    onClick={() => handleCopy(`${account?.id} ${account?.username}`)}
                  />
                </OverlayTrigger>
              </ListGroup.Item>
            </ListGroup>
            <div className="mt-2 text-center text-danger fw-bold">*Lưu ý: Nhớ chụp lại bill để tránh trường hợp lỗi nạp. Nếu lỗi vui lòng ib gửi bill cho key vàng để xử lý !</div>
          </Col>
        </Row>
      </>
    </div>
  );
}
