import React from "react";
import FloatingZalo from "./floatingZalo";

import { FloatingContainerStyled } from "@/app/styles/stylesGlobals";
import FloatingShop from "./floatingShop";

export default function Floating() {
  return (
    <FloatingContainerStyled className="gap-1">
      <FloatingZalo />
      <FloatingShop />
    </FloatingContainerStyled>
  );
}
