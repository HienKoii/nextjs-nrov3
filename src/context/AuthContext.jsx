import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { PATH_NAME } from "@/lib/path";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = Cookies.get("token");
  const router = useRouter();

  const [account, setAccount] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Cookies.remove("token");
    setAccount(null);
    setPlayer(null);
    // router.push(PATH_NAME.login);
    window.location.href = PATH_NAME.login;
  };

  const fetchAccount = async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await axios.get("/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccount(response.data.account);
        setPlayer(response.data.player);
        console.log("Lấy thông tin người dùng: ", response.data);
      } catch (error) {
        console.log("Lỗi lấy thông tin người dùng?");
        handleLogout();
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [token]);

  const values = { loading, account, setAccount, player, fetchAccount, setPlayer, handleLogout };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
