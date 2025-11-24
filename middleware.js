// middleware.js
/**
 * 🛡️ MIDDLEWARE CSRF
 *
 * Garante que TODA requisição tenha um token CSRF.
 * Se não tiver, gera um novo e seta no cookie.
 *
 * Roda ANTES de qualquer rota.
 */

import { NextResponse } from "next/server";
import { createCSRFToken } from "./src/lib/csrf.js";

export function middleware(request) {
  const response = NextResponse.next();

  // Verifica se já existe token CSRF
  const hasToken = request.cookies.get("csrf-token");

  if (!hasToken) {
    console.log("🆕 Gerando novo token CSRF");
    const newToken = createCSRFToken();

    response.cookies.set("csrf-token", newToken, {
      httpOnly: true, // ✅ JavaScript não consegue ler
      sameSite: "strict", // ✅ Só envia para mesma origem
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS em produção
      path: "/",
    });
  }

  return response;
}

// Roda em todas as rotas (exceto static files)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
