import moment from "moment";

export const isValid = (value) => /^[a-z0-9]{1,20}$/.test(value);

export const formatDateFull = (date) => {
  return moment.utc(date).format("DD/MM/YYYY-HH:mm:ss");
};
export const formatCurrencyVND = (amount) => {
  return amount?.toLocaleString("vi-VN") + "đ";
};
export const timeAgo = (createdAt) => {
  const now = new Date();
  const createdTime = new Date(createdAt);
  const diffInSeconds = Math.floor((now - createdTime) / 1000);

  // Các mốc thời gian cơ bản tính bằng giây
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diffInSeconds < minute) {
    return `${diffInSeconds} giây trước`;
  } else if (diffInSeconds < hour) {
    const diffInMinutes = Math.floor(diffInSeconds / minute);
    return `${diffInMinutes} phút trước`;
  } else if (diffInSeconds < day) {
    const diffInHours = Math.floor(diffInSeconds / hour);
    return `${diffInHours} giờ trước`;
  } else if (diffInSeconds < day * 2) {
    return `hôm qua`;
  } else if (diffInSeconds < month) {
    const diffInDays = Math.floor(diffInSeconds / day);
    return `${diffInDays} ngày trước`;
  } else if (diffInSeconds < year) {
    const diffInMonths = Math.floor(diffInSeconds / month);
    return `${diffInMonths} tháng trước`;
  } else {
    const diffInYears = Math.floor(diffInSeconds / year);
    return `${diffInYears} năm trước`;
  }
};

export const formatOptions = (name, param) => {
  return name.replace("#", param);
};

export const formatStatusCard = (statusCode) => {
  const responseMessages = {
    1: "Thẻ đúng",
    2: "Thẻ đúng sai giá",
    3: "Thẻ lỗi",
    4: "Hệ thống bảo trì",
    99: "Thẻ chờ xử lý",
    100: "Gửi thẻ thất bại - Có lý do đi kèm",
  };

  return responseMessages[statusCode] || "Mã trạng thái không hợp lệ";
};
export const convertItem = (data) => {
  if (data.item_temp_id === -1) return;
  const optionsStr = data.options.map((option) => `\\"[${option.id},${option.param}]\\"`).join(",");
  const item = `[${data.item_temp_id},${data.quantity ? data.quantity : 1},"[${optionsStr}]",1720969326362]`;
  return item;
};

export function formatContent(content) {
  // Thay thế ký tự xuống dòng bằng thẻ <br />
  let formattedContent = content.replace(/\r?\n/g, "<br />");

  // Nhận diện các liên kết và tự động bọc chúng trong thẻ <a>
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  formattedContent = formattedContent.replace(urlPattern, (url) => {
    return `<a href="${url}" class="text-primary" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  return formattedContent;
}
