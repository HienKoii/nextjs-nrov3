import { NextResponse } from "next/server";

// Middleware chạy trước khi đến bất kỳ trang nào
export function middleware(req) {
  const token = req.cookies.get("token"); // Kiểm tra token trong cookie

  const { pathname } = req.nextUrl; // Lấy đường dẫn từ req

  // Danh sách các trang yêu cầu  có token
  const protectedRoutes = ["/profile", "/post/create", "/change-password"];
  // Danh sách các trang không cần token
  const publicRoutes = ["/login", "/register", "/forgot-password"];

  // Nếu có token và người dùng đang cố vào trang đăng nhập/đăng ký
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url)); // Chuyển hướng về trang chủ
  }

  // Nếu không có token và người dùng cố vào các trang yêu cầu đăng nhập
  if (!token && (protectedRoutes.includes(pathname) || pathname.startsWith("/naptien"))) {
    return NextResponse.redirect(new URL("/login", req.url)); // Chuyển hướng về trang đăng nhập
  }

  return NextResponse.next(); // Cho phép tiếp tục xử lý request
}

// Áp dụng middleware cho các trang cụ thể
export const config = {
  matcher: ["/login", "/register", "/profile", "/forgot-password", "/naptien/:path*", "/post/create", "/change-password"],
};