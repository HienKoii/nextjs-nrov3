import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import ShopItem from "./shopItem";
import { formatCurrencyVND } from "@/lib/utils-cn";
import { useShop } from "@/context/ShopContext";

export default function ShopModal() {
  const { show, handleClose, shopData, loading, handleShow } = useShop();
  const { account } = useAuth();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="justify-content-center">
        <Modal.Title>
          <span> Cửa hàng vật phẩm</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="hk-scrollbar" style={{ maxHeight: "400px", overflowX: "hidden", padding: "12px 0" }} id="scrollbar4">
        {loading ? (
          <div className="hk-flex">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>{" "}
          </div>
        ) : (
          <div className="hk-flex-col-y gap-3">
            {shopData &&
              shopData?.map((item, index) => {
                return <ShopItem key={index} item={item} />;
              })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <span style={{ fontSize: "12px" }} className="text-danger text-center fs-6">
          *Lưu ý: thoát game trước khi mua nhé ! Sau khi mua thành công vật phẩm sẽ ở rương phụ
        </span>
        <div className={`d-flex w-100 ${account ? `justify-content-between` : `justify-content-end`}`}>
          {account ? <Button variant="outline-info">VNĐ: {formatCurrencyVND(account.vnd)}</Button> : null}
          <Button variant="primary" onClick={handleClose}>
            Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
