import { BoxPage, Divider } from "@/app/styles/stylesGlobals";
import React from "react";
import { Image } from "react-bootstrap";

import Logo from "../logo";
import Auth from "../auth";

export default function Header() {
  return (
    <BoxPage>
      <div className="m-0 ms-1 text-center">
        <Image src="/imgs/12.png" alt="12+" width={12} height={12} className="mb-1" />
        Dành cho người chơi trên 12 tuổi. Chơi quá 180 phút mỗi ngày sẽ có hại sức khỏe.
      </div>
      <Logo w={250} />
      <Divider />
      <Auth />
    </BoxPage>
  );
}
