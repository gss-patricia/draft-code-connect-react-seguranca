import DOMPurify from "isomorphic-dompurify";

/**
 * ✅ ISOMORPHIC SANITIZER
 *
 * Usa isomorphic-dompurify que funciona tanto no servidor quanto no cliente.
 * Isso garante:
 * - Sem hydration mismatch (mesma sanitização em ambos os ambientes)
 * - Proteção em múltiplas camadas
 * - Compatibilidade com Server e Client Components
 */

/**
 * Configurações de sanitização para diferentes contextos
 */
const SANITIZE_CONFIGS = {
  // Para bios de usuário (mais restritivo)
  bio: {
    ALLOWED_TAGS: ["p", "strong", "em", "br", "a", "ul", "ol", "li", "i"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  },

  // Para markdown de posts (permite mais tags de formatação)
  markdown: {
    ALLOWED_TAGS: [
      "p",
      "strong",
      "em",
      "br",
      "a",
      "ul",
      "ol",
      "li",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "i",
      "blockquote",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ALLOW_DATA_ATTR: false,
  },
};

/**
 * Sanitiza HTML usando DOMPurify
 * @param {string} html - HTML a ser sanitizado
 * @param {'bio' | 'markdown'} type - Tipo de conteúdo (determina as regras)
 * @returns {string} HTML sanitizado
 */
export function sanitizeHTML(html, type = "bio") {
  if (!html) return "";

  const config = SANITIZE_CONFIGS[type] || SANITIZE_CONFIGS.bio;

  // ✅ isomorphic-dompurify funciona em ambos os ambientes
  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitiza bio de usuário
 * @param {string} bio - Bio a ser sanitizada
 * @returns {string} Bio sanitizada
 */
export function sanitizeBio(bio) {
  return sanitizeHTML(bio, "bio");
}

/**
 * Sanitiza markdown de post
 * @param {string} markdown - Markdown a ser sanitizado
 * @returns {string} Markdown sanitizado
 */
export function sanitizeMarkdown(markdown) {
  return sanitizeHTML(markdown, "markdown");
}
