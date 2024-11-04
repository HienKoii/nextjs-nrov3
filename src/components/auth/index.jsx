import { useAuth } from "@/context/AuthContext";
import React from "react";
import AuthLogin from "./authLogin";
import AuthDefault from "./authDefault";
import { Placeholder, Spinner } from "react-bootstrap";

export default function Auth() {
  const { account, loading } = useAuth();
  if (loading) {
    return (
      <div className="text-center w-100">
        <Spinner animation="grow" style={{ width: "4rem", height: "4rem" }} />
      </div>
    );
  }
  return <>{account ? <AuthLogin /> : <AuthDefault />}</>;
}
