import { updateSession } from "./src/utils/supabase/middleware";

/**
 * 🔒 MIDDLEWARE - Atualiza sessão do Supabase
 *
 * Este middleware apenas atualiza a sessão do Supabase (auth).
 * 
 * ⚠️ NOTA: Security headers (CSP, HSTS, etc) estão configurados no next.config.js
 * Não é necessário adicionar aqui porque são headers ESTÁTICOS.
 */
export async function middleware(request) {
  // Atualizar sessão Supabase
  const response = await updateSession(request);
  
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
