import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

import { PATH_NAME } from "@/lib/path";
import { toast } from "react-toastify";
import { convertItem, formatCurrencyVND } from "@/lib/utils-cn";
import { useAuth } from "./AuthContext";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { fetchAccount } = useAuth();
  const [show, setShow] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const fetchDataShop = async () => {
    try {
      const response = await axios.get("/api/shop"); // Thay đổi đường dẫn nếu cần
      console.log("Lấy dữ liệu web shop:", response);
      setShopData(response.data.items);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu web shop!", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShow = async () => {
    fetchDataShop();
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const purchaseItem = async (item) => {
    const token = Cookies.get("token");
    if (!token) return toast.error("Vui lòng đăng nhập trước");
    setLoadingBtn(true);
    try {
      const payload = {
        itemTemp: convertItem(item),
        price: item.price,
        name: item.item_name,
      };
      const response = await axios.post("/api/shop/purchase", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        await fetchAccount();
        toast.success(`Mua ${item.item_name} thành công`);
        toast.warning(`Bạn bị trừ ${formatCurrencyVND(item.price)}`);
      }
      console.log("Xử lý mua item tại cửa hàng: ", response); // Hiển thị thông báo thành công
    } catch (error) {
      toast.warning("Đã xảy ra lỗi khi mua hàng!");
      console.error("Lỗi mua hàng:", error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const values = { show, fetchDataShop, handleShow, handleClose, shopData, loading, loadingBtn, purchaseItem };

  return <ShopContext.Provider value={values}>{children}</ShopContext.Provider>;
};

export const useShop = () => useContext(ShopContext);
