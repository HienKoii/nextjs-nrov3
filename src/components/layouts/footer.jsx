import { BoxPage } from "@/app/styles/stylesGlobals";
import React from "react";

export default function Footer() {
  return (
    <BoxPage className="text-center mt-3 py-2">
      <h5 className="text-primary">Ngọc rồng online</h5>
      <p>Trò chơi không bản quyền</p>
      <p>Vui lòng cân nhắc trước khi chơi</p>
      <h6>
        2024 © Web được code bởi{" "}
        <span className="text-primary" style={{ textDecoration: "underline" }}>
          HK
        </span>
      </h6>
      <p>zalo: 0979514602</p>
    </BoxPage>
  );
}
