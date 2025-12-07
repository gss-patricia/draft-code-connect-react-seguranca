/**
 * 🔒 CSP (Content Security Policy) - IMPLEMENTAÇÃO SIMPLES
 *
 * Este arquivo contém funções para gerar CSP com nonce dinâmico.
 * CSP é a ÚLTIMA LINHA DE DEFESA contra XSS!
 */

/**
 * Gera um nonce único para cada request
 * Nonce = "Number Used Once" (número usado uma vez)
 */
export function generateNonce() {
  // crypto.randomUUID() é nativo do Node.js (não precisa importar)
  // Retorna algo como: "550e8400-e29b-41d4-a716-446655440000"
  return crypto.randomUUID();
}

/**
 * Gera o header Content-Security-Policy com nonce
 *
 * @param {string} nonce - Nonce único gerado para este request
 * @returns {string} - Header CSP completo
 */
export function getCSPHeader(nonce) {
  // Array de diretivas CSP
  // Cada diretiva controla um tipo de recurso
  const directives = [
    // default-src: Fallback para recursos não especificados
    "default-src 'self'",

    // script-src: Controla quais scripts podem executar
    // 'self' = scripts do próprio domínio
    // 'nonce-...' = scripts inline com nonce específico
    `script-src 'self' 'nonce-${nonce}'`,

    // style-src: Controla quais estilos podem ser aplicados
    // 'unsafe-inline' é necessário para CSS-in-JS (React, styled-components, etc)
    // Não é ideal, mas é trade-off necessário para frameworks modernos
    "style-src 'self' 'unsafe-inline'",

    // img-src: Controla quais imagens podem ser carregadas
    // 'self' = imagens do próprio domínio
    // data: = imagens inline base64
    // https: = qualquer imagem HTTPS (para GitHub, etc)
    "img-src 'self' data: https:",

    // connect-src: Controla APIs/fetch que podem ser chamados
    // 'self' = APIs do próprio domínio
    // https://*.supabase.co = API do Supabase
    "connect-src 'self' https://*.supabase.co",

    // font-src: Controla quais fontes podem ser carregadas
    "font-src 'self'",

    // frame-ancestors: Controla quem pode colocar site em iframe
    // 'none' = ninguém (reforça X-Frame-Options)
    "frame-ancestors 'none'",

    // form-action: Controla para onde forms podem enviar dados
    // 'self' = apenas para o próprio domínio
    "form-action 'self'",

    // base-uri: Controla a tag <base> (previne ataques de base tag injection)
    "base-uri 'self'",
  ];

  // Juntar todas as diretivas com "; "
  return directives.join("; ");
}
