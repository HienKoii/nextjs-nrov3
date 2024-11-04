import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

import { PATH_NAME } from "@/lib/path";

const NapTheContext = createContext();

export const NapTheProvider = ({ children }) => {
  const pathname = usePathname();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = Cookies.get("token");
      if (!token) return;
      setLoading(true);
      try {
        const response = await axios.get(`/api/napthe/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Lấy lịch sử nạp thẻ:", response.data);
        setHistory(response.data.history);
      } catch (err) {
        console.log("Lỗi lấy lịch sử nạp thẻ", err);
      } finally {
        setLoading(false);
      }
    };

    if (pathname === PATH_NAME.napTien.napThe || pathname === PATH_NAME.napTien.lichSu) {
      fetchHistory();
    }
  }, [pathname]);

  const values = { loading, history, setHistory };

  return <NapTheContext.Provider value={values}>{children}</NapTheContext.Provider>;
};

export const useNapThe = () => useContext(NapTheContext);
