/**
 * 🔒 AUTHORIZATION - Lógica de Autorização Centralizada
 *
 * Olha só, ao invés de espalhar regras de autorização por todo o código,
 * vamos centralizar TUDO aqui. Por quê?
 *
 * - ✅ Código reutilizável (escreve uma vez, usa em vários lugares)
 * - ✅ Fácil de testar (unit tests diretos, sem mocks complexos)
 * - ✅ Regras em um único lugar (mudou algo? Só mexe aqui)
 * - ✅ Previne inconsistências (não tem risco de ter regras diferentes em lugares diferentes)
 *
 * OWASP: Broken Access Control
 * Pattern: RBAC + ABAC (Attribute-Based Access Control)
 */

/**
 * Verifica se um usuário pode deletar um post
 *
 * Aqui é onde a mágica acontece! Vamos implementar uma HIERARQUIA de permissões.
 * Pensa comigo: não é só "pode ou não pode", tem níveis diferentes de permissão:
 *
 * 1. Admin (RBAC) → Pode deletar qualquer post, sem exceção
 * 2. Owner (ABAC) → Pode deletar SEU PRÓPRIO post (faz sentido, né?)
 * 3. Moderator (ABAC Avançado) → Pode deletar posts que receberam 3+ denúncias
 * 4. Outros → Negado (sem permissão nenhuma)
 *
 * Repara que estamos combinando RBAC (role) com ABAC (atributos do post).
 * Isso deixa o sistema muito mais flexível!
 *
 * @param {Object} user - Usuário da nossa tabela User
 * @param {number} user.id - ID do usuário (importante pro ownership)
 * @param {string} user.role - Role do usuário: "admin", "moderator" ou "user"
 * @param {Object} post - Post da tabela Post
 * @param {number} post.id - ID do post
 * @param {number} post.authorId - ID do autor do post (pra comparar com user.id)
 * @param {number} post.reportCount - Quantidade de denúncias (importante pro moderator)
 * @returns {Object} { allowed: boolean, reason: string, accessType: string }
 */
export function canDeletePost(user, post) {
  // 1️⃣ PRIMEIRA REGRA: Admin pode tudo
  // Se o usuário é admin, nem precisa verificar mais nada.
  // Admin tem poder total no sistema (RBAC puro).
  if (user.role === "admin") {
    return {
      allowed: true,
      reason: "RBAC: Admin role",
      accessType: "RBAC",
    };
  }

  // 2️⃣ SEGUNDA REGRA: Autor pode deletar próprio post
  // Aqui entra o ABAC! Não importa o role, se você criou o post, você pode deletar.
  // Comparamos post.authorId com user.id (ownership).
  if (post.authorId === user.id) {
    return {
      allowed: true,
      reason: "ABAC: Ownership (author)",
      accessType: "ABAC_OWNERSHIP",
    };
  }

  // 3️⃣ TERCEIRA REGRA: Moderador pode deletar posts com muitas denúncias
  // Agora fica interessante! Combinamos DUAS condições:
  // - user.role === "moderator" (RBAC)
  // - post.reportCount >= 3 (ABAC - atributo do post)
  // Isso é ABAC avançado: decisão baseada em múltiplos atributos!
  if (user.role === "moderator" && post.reportCount >= 3) {
    return {
      allowed: true,
      reason: `ABAC: Moderator with ${post.reportCount} reports (threshold: 3)`,
      accessType: "ABAC_MODERATION",
    };
  }

  // 4️⃣ NENHUMA REGRA APLICOU: Negado
  // Se chegou aqui, o usuário não tem permissão nenhuma.
  // Pode ser um usuário comum tentando deletar post de outro,
  // ou um moderador tentando deletar post com poucas denúncias.
  return {
    allowed: false,
    reason: "Access denied: No matching authorization rule",
    accessType: "DENIED",
  };
}

/**
 * Verifica se um usuário pode editar um post
 *
 * Seguindo a mesma lógica do canDeletePost, mas adaptada para edição.
 * Aqui, apenas admin e owner podem editar.
 * (Moderador NÃO pode editar posts de outros, só deletar se tiver reports)
 */
export function canEditPost(user, post) {
  // Admin pode editar qualquer post
  if (user.role === "admin") {
    return { allowed: true, reason: "RBAC: Admin" };
  }

  // Owner pode editar próprio post
  if (post.authorId === user.id) {
    return { allowed: true, reason: "ABAC: Ownership" };
  }

  return { allowed: false, reason: "Access denied" };
}

/**
 * Verifica se um usuário pode moderar comentários
 *
 * Aqui é RBAC puro: apenas admin e moderator podem moderar comentários.
 * Não tem ownership nem atributos do recurso, só role.
 */
export function canModerateComments(user) {
  // Admin e moderator podem moderar
  if (user.role === "admin" || user.role === "moderator") {
    return { allowed: true, reason: `RBAC: ${user.role} role` };
  }

  return { allowed: false, reason: "Access denied" };
}
