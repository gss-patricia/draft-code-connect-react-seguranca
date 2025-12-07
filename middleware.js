import { updateSession } from "./src/utils/supabase/middleware";
import { generateNonce, getCSPHeader } from "./src/lib/csp";

/**
 * 🔒 MIDDLEWARE - Adiciona CSP com nonce dinâmico
 *
 * Este middleware:
 * 1. Atualiza sessão do Supabase (auth)
 * 2. Gera nonce único para este request
 * 3. Adiciona header Content-Security-Policy com o nonce
 * 4. Passa o nonce via header x-nonce (para usar no layout)
 */
export async function middleware(request) {
  // 1. Atualizar sessão Supabase (importante!)
  let response = await updateSession(request);

  // 2. Gerar nonce único para ESTE request
  const nonce = generateNonce();

  // 3. Adicionar CSP com nonce
  const cspHeader = getCSPHeader(nonce);
  response.headers.set("Content-Security-Policy", cspHeader);

  // 4. Passar nonce para o frontend via header customizado
  response.headers.set("x-nonce", nonce);

  // Debug: log para verificar se middleware está executando
  console.log("🔒 CSP Middleware executado para:", request.nextUrl.pathname);

  return response;
}

/**
 * Matcher: Define em quais rotas o middleware executa
 *
 * Aqui excluímos:
 * - _next/static (arquivos estáticos do Next.js)
 * - _next/image (otimização de imagens)
 * - favicon.ico
 * - Arquivos de imagem (svg, png, jpg, etc)
 *
 * Middleware executa em TODAS as outras rotas!
 */
export const config = {
  matcher: [
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
