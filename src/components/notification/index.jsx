"use client";
import { CAU_HINH } from "@/config/setting";
import { formatContent } from "@/lib/utils-cn";
import { Button, Modal } from "react-bootstrap";
import Logo from "../logo";

export default function Notification({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title className="hk-flex w-100">
          <Logo w={220} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: formatContent(CAU_HINH.thongBao.text) }} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
