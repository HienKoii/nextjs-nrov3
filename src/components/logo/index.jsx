import Link from "next/link";
import React from "react";
import { Image } from "react-bootstrap";

const Logo = ({ w, h }) => {
  return (
    <Link href={"/"} className="w-100 hk-flex px-2 mt-4" style={{ height: "auto" }}>
      <Image src={"/imgs/logo.png"} alt="logo" width={w ? w : 50} height={h ? h : "auto"} style={{ objectFit: "cover" }} />
    </Link>
  );
};

export default Logo;
