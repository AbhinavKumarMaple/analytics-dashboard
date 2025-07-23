import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is trying to access a protected route
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/acquisition") ||
    request.nextUrl.pathname.startsWith("/market") ||
    request.nextUrl.pathname.startsWith("/urls");

  // if (isProtectedRoute) {
  //   // Get the token from cookies
  //   const token = request.cookies.get("token")?.value;

  //   // If no token exists, redirect to login
  //   // if (!token) {
  //   //   return NextResponse.redirect(new URL("/login", request.url));
  //   // }

  //   try {
  //     // Verify the token
  //     verify(
  //       token,
  //       process.env.JWT_SECRET || "your-secret-key-change-in-production"
  //     );

  //     // Token is valid, allow access
  //     return NextResponse.next();
  //   } catch (error) {
  //     // Token is invalid, redirect to login
  //     console.error("Token validation error:", error);
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/acquisition/:path*", "/market/:path*", "/urls/:path*"],
};
