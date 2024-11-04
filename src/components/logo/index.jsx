import { PATH_NAME } from "@/lib/path";
import Link from "next/link";
import React from "react";
import { Image } from "react-bootstrap";

const Logo = ({ w, h, className }) => {
  return (
    <Link href={PATH_NAME.home} className={className ? className : ""} style={{ height: "auto" }}>
      <Image src={"/imgs/logo.png"} alt="logo" width={w ? w : 50} height={h ? h : "auto"} style={{ objectFit: "cover" }} />
    </Link>
  );
};

export default Logo;
