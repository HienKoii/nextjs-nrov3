"use client";

import { faKey, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "react-bootstrap";
import { PATH_NAME } from "@/lib/path";

export default function AuthDefault() {
  const pathname = usePathname();
  return (
    <>
      <div className="mt-3 mb-3 hk-flex">
        <Button
          as={Link}
          href={PATH_NAME.login} //
          variant="danger"
          className={`btn-hk ${pathname === PATH_NAME.login ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Đăng nhập
        </Button>
        <Button
          as={Link} //
          variant="danger"
          href={PATH_NAME.register}
          className={`btn-hk mx-2 ${pathname === PATH_NAME.register ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Đăng ký
        </Button>
      </div>
      <div className="w-100 text-center mb-3">
        <Button
          as={Link} //
          variant="danger"
          href={PATH_NAME.quenMatKhau}
          className={`btn-hk ${pathname === PATH_NAME.quenMatKhau ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faKey} /> Quên mật khẩu?
        </Button>
      </div>
    </>
  );
}
