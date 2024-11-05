import { toast } from "react-toastify";
import React from "react";
import Swal from "sweetalert2";
import { Button, Card, Image, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";

import TextDivider from "../divider/textDivider";
import { formatCurrencyVND, formatOptions } from "@/lib/utils-cn";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { CAU_HINH } from "@/config/setting";

export default function ShopItem({ item }) {
  const { player, account } = useAuth();
  const { purchaseItem, loadingBtn } = useShop();

  const handleByItem = async () => {
    const token = Cookies.get("token");
    if (!token) return toast.error("Vui lòng đăng nhập để mua vật phẩm!!");
    if (!player || !player.name) return toast.error("Tạo nhân vật trước khi mua !");

    if (account.vnd < item.price) return toast.error(`Bạn không đủ số dư ${formatCurrencyVND(item.price)}`);
    Swal.fire({
      title: `${item.item_name}`,
      html: `
        <img src="${CAU_HINH.urlImages}${item.icon_id}.png" class="my-custom-class" style="width: 50px; height: auto;" />
        <p> Bạn chắc muốn mua x${item.quantity} ${item.item_name} với giá ${formatCurrencyVND(item.price)}? </p>
        <p class="text-danger"> Hãy thoát game trước khi ấn đồng ý mua nhé !! </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await purchaseItem(item);
        } catch (error) {
          console.log("Lỗi mua vật phẩm....?");
        }
      }
    });
  };

  return (
    <>
      <Card className="h-100">
        <div className="hk-flex gap-1 px-2 pt-2">
          <Image
            src={`${CAU_HINH.urlImages}${item.icon_id}.png`} //
            width={50}
            height={50}
            alt="items"
            style={{ minWidth: "50px", minHeight: "50px" }}
          />
          <div className="hk-flex-col-y w-100">
            <div className="hk-flex-x gap-1">
              <span className="fw-bold">{item.item_name}</span>
              {item.is_new ? <Image src="/imgs/new.gif" alt="new" width={23} height={12} /> : null}
              {item.is_hot ? <Image src="/imgs/hot.gif" alt="new" width={23} height={12} /> : null}
            </div>

            <span className="text-muted ellipsis-2">{item.description}</span>
            <div>
              <span className="text-primary">Giá: {formatCurrencyVND(item.price)}</span>
              <span> - </span>
              <span className="text-warning">Số lượng: {item.quantity}</span>
            </div>
          </div>
        </div>
        <div>
          <TextDivider text={"0ptions"} />
          <div className="text-center fw-bold text-success">
            {item?.options.map((option, index) => {
              return <p key={index}> {formatOptions(option.name, option.param)} </p>;
            })}
          </div>
        </div>
        <div className="px-2 pb-2">
          <Button
            variant="info w-100 text-light" //
            disabled={loadingBtn}
            onClick={() => handleByItem()}
          >
            {loadingBtn && <Spinner animation="border" variant="light" size="sm" />}
            {loadingBtn ? "Đang mua vật phẩm..." : "Mua ngay"}
          </Button>
        </div>
      </Card>
    </>
  );
}
