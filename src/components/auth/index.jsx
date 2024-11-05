import { useAuth } from "@/context/AuthContext";
import React from "react";
import AuthLogin from "./authLogin";
import AuthDefault from "./authDefault";
import { Button, Image, Placeholder, Spinner } from "react-bootstrap";
import { CAU_HINH } from "@/config/setting";

export default function Auth() {
  const { account, loading } = useAuth();
  if (loading) {
    return (
      <div className="text-center w-100">
        <Spinner animation="grow" style={{ width: "4rem", height: "4rem" }} />
      </div>
    );
  }
  return (
    <>
      {account ? <AuthLogin /> : <AuthDefault />}
      <div className="hk-flex my-3 gap-2">
        <Image src="/imgs/hot.gif" alt="new" width={23} height={12} />{" "}
        <Button variant="link" href={CAU_HINH.zaloLink} className="p-0 fw-bold">
          Tham gia nhóm zalo ngay !
        </Button>
        <Image src="/imgs/hot.gif" alt="new" width={23} height={12} />
      </div>
    </>
  );
}
