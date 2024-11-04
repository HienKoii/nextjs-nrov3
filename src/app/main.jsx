"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import { BoxPage, ContainerMain } from "./styles/stylesGlobals";

import Header from "@/components/layouts/header";
import Navigation from "@/components/navigation";
import Footer from "@/components/layouts/footer";

import { AuthProvider } from "@/context/AuthContext";
import { PostsProvider } from "@/context/PostsContext";

import Slider from "@/components/layouts/slider";
import ParticleBackground from "@/components/effect/ParticleBackground";
import { NapTheProvider } from "@/context/NapTheContext";
import Floating from "@/components/floating";
import { ShopProvider } from "@/context/ShopContext";
import { CAU_HINH } from "@/config/setting";
import Notification from "@/components/notification";

export default function RootMain({ children }) {
  const [showModal, setShowModal] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const handleClose = () => setShowModal(false);
  useEffect(() => {
    setIsMounted(true);
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowModal(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <>
      <ParticleBackground />
      <ContainerMain className="container-md p-1 col-sm-12 col-lg-6">
        <AuthProvider>
          <ShopProvider>
            <PostsProvider>
              <ToastContainer />
              <Header />
              <Navigation />
              <NapTheProvider>
                <BoxPage>{children}</BoxPage>
              </NapTheProvider>
              <BoxPage className="mt-3" style={{ overflow: "hidden" }}>
                <Slider />
              </BoxPage>
              <Footer />
              <Floating />
              {isMounted && CAU_HINH.thongBao.isThongBao && <Notification show={showModal} handleClose={handleClose} />}
            </PostsProvider>
          </ShopProvider>
        </AuthProvider>
      </ContainerMain>
    </>
  );
}
