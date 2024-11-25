import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/bookings/:path*",
    "/vehicles/:path*",
    "/offer/:path*",
  ],
};