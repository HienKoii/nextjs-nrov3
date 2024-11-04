"use client";
import React from "react";
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

export default function RootMain({ children }) {
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
            </PostsProvider>
          </ShopProvider>
        </AuthProvider>
      </ContainerMain>
    </>
  );
}
