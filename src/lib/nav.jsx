import { faDollarSign, faHistory, faUnlockAlt, faUserAlt, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PATH_NAME } from "./path";

export const NAV_DROP_DOWN = [
  {
    path: PATH_NAME.profile,
    icon: <FontAwesomeIcon icon={faUserAlt} />,
    name: "Thông tin cá nhân",
    isAdmin: false,
  },
  {
    path: PATH_NAME.doiMatKhau,
    icon: <FontAwesomeIcon icon={faUnlockAlt} />,
    name: "Đổi mật khẩu",
    isAdmin: false,
  },
  {
    path: PATH_NAME.napTien.root,
    icon: <FontAwesomeIcon icon={faDollarSign} />,
    name: "Nạp tiền",
    isAdmin: false,
  },
  {
    path: PATH_NAME.napTien.lichSu,
    icon: <FontAwesomeIcon icon={faHistory} />,
    name: "Lịch sử nạp thẻ",
    isAdmin: false,
  },
  {
    path: PATH_NAME.admin.root,
    icon: <FontAwesomeIcon icon={faUserCog} />,
    name: "Admin control",
    isAdmin: true,
  },
];
export const LIST_NAVIGATION = [
  {
    text: "Trang chủ",
    path: "/",
  },
  {
    text: "Tải game",
    path: PATH_NAME.download,
  },
  {
    text: "Cửa hàng",
    path: PATH_NAME.shop,
  },
  {
    text: "GiftCode",
    path: PATH_NAME.giftCode,
  },
  {
    text: "Nạp tiền",
    path: PATH_NAME.napTien.root,
  },
];
