import React, { useState } from "react";
import { Image } from "react-bootstrap";

import { FloatingItemStyled } from "@/app/styles/stylesGlobals";
import ShopModal from "../shop/shopModal";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";

export default function FloatingShop() {
  const { handleShow } = useShop();
  return (
    <>
      <FloatingItemStyled className="bg-primary border border-danger">
        <Image
          src="/imgs/cuahang.png" //
          alt="cuahang"
          width={50}
          height={50}
          onClick={handleShow}
        />
      </FloatingItemStyled>
      <ShopModal />
    </>
  );
}
