import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_CLAVE! });

  const path = req.nextUrl.pathname;
  const isAuthPath = path.startsWith("/auth");
  const isRootPath = path === "/";
  const isRegistroExitoso = path === "/auth/registroExitoso";
  const isNoAutorizadoPath = path === "/auth/noAutorizado";

  if (!token && !isAuthPath && !isRootPath && !isNoAutorizadoPath) {
    return NextResponse.redirect(new URL("/auth/noAutorizado", req.url));
  }

  if (token && (isRootPath || isAuthPath) && !isRegistroExitoso && !isNoAutorizadoPath) {
    return NextResponse.redirect(new URL("/perfil", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/perfil/:path*", "/auth/:path*", "/api/equipos/:path*"],
};