"use client";
import ShopItem from "@/components/shop/shopItem";
import { useShop } from "@/context/ShopContext";
import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";

export default function ShopWebPage() {
  const { fetchDataShop, shopData, loading } = useShop();
  useEffect(() => {
    try {
      fetchDataShop();
    } catch (error) {
      console.log("Lỗi ShopWebPage");
    }
  }, []);

  return (
    <div>
      {loading ? (
        <div className="hk-flex py-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>{" "}
        </div>
      ) : (
        <div className="hk-flex-col-y gap-3">
          {shopData &&
            shopData?.map((item, index) => {
              return <ShopItem key={index} item={item} />;
            })}
        </div>
      )}
    </div>
  );
}
