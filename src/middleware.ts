import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isAuth = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");
    const isProtected = req.nextUrl.pathname.startsWith("/creator") || req.nextUrl.pathname.startsWith("/admin");

    if (isAuthPage && isAuth) {
        return Response.redirect(new URL("/creator", req.nextUrl.origin));
    }

    if (isProtected && !isAuth) {
        return Response.redirect(new URL("/login", req.nextUrl.origin));
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
