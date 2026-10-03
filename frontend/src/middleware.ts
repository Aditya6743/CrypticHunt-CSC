import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Auth pages
    const isAuthPage = path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/admin/login");

    if (isAuthPage && token) {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      // Let everyone through, middleware function itself will handle redirects
      authorized: () => true 
    }
  }
)

export const config = {
  matcher: ["/login", "/register", "/admin/login"]
}
