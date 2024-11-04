import { FloatingItemStyled } from "@/app/styles/stylesGlobals";
import React from "react";
import { Image } from "react-bootstrap";

const FloatingZalo = () => {
  return (
    <FloatingItemStyled className="bg-primary border border-danger">
      <a href={"/"}>
        <Image
          src="/imgs/zalo.png" //
          alt="zalo"
          width={50}
          height={50}
        />
      </a>
    </FloatingItemStyled>
  );
};

export default FloatingZalo;
