// src/lib/csrf.js
/**
 * 🛡️ PROTEÇÃO CSRF - Versão Didática
 *
 * CSRF = Cross-Site Request Forgery
 * Ataque onde um site malicioso faz requests em nome do usuário autenticado.
 *
 * SOLUÇÃO:
 * 1. Gerar token único por sessão
 * 2. Guardar no cookie HttpOnly
 * 3. Cliente envia token no header X-CSRF
 * 4. Servidor valida: cookie === header
 *
 * Ataque falha porque site malicioso:
 * ✅ Tem acesso aos cookies (navegador envia automaticamente)
 * ❌ NÃO tem acesso ao valor do cookie (HttpOnly)
 * ❌ NÃO consegue ler nem enviar o header correto
 */

import { cookies } from "next/headers";

/**
 * Gera um token CSRF único
 */
export function createCSRFToken() {
  return crypto.randomUUID(); // Simples e seguro
}

/**
 * Define o cookie CSRF (chamado pelo middleware)
 */
export async function setCSRFCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set("csrf-token", token, {
    httpOnly: true, // ✅ JavaScript não consegue ler
    sameSite: "strict", // ✅ Só envia para mesma origem
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS em produção
    path: "/",
  });
}

/**
 * Lê o token CSRF do cookie
 */
export async function getCSRFCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("csrf-token")?.value || "";
}

/**
 * Valida se o token do cookie bate com o header
 *
 * @param {Request} request
 * @returns {boolean} true se válido
 */
export async function validateCSRF(request) {
  const csrfFromCookie = await getCSRFCookie();
  const csrfFromHeader = request.headers.get("x-csrf-token");

  console.log("🔒 Validando CSRF:");
  console.log("  Cookie:", csrfFromCookie ? "✅ Presente" : "❌ Ausente");
  console.log("  Header:", csrfFromHeader ? "✅ Presente" : "❌ Ausente");
  console.log(
    "  Match:",
    csrfFromCookie === csrfFromHeader ? "✅ SIM" : "❌ NÃO"
  );

  return csrfFromCookie && csrfFromHeader && csrfFromCookie === csrfFromHeader;
}

/**
 * Endpoint helper para obter o token (usado pelo frontend)
 */
export async function getCSRFToken() {
  return await getCSRFCookie();
}
