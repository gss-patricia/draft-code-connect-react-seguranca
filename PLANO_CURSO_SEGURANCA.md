# 🔐 Curso: React e Next.js - Segurança em Aplicações Web

## 📋 Estrutura do Curso

### Informações Gerais

- **Duração Total**: ~4 horas
- **Nível**: Intermediário/Avançado
- **Pré-requisitos**: React, Next.js, Node.js
- **Projeto Base**: Code Connect (rede social para devs)
- **Módulos**: 5
- **Vídeos por módulo**: 4-7 vídeos de 8-15 min

---

## 🎯 Objetivos de Aprendizagem

Ao final do curso, o aluno será capaz de:

- ✅ Identificar e prevenir vulnerabilidades XSS, CSRF e vazamento de tokens
- ✅ Implementar OAuth com refresh token seguro
- ✅ Criar sistemas de autorização com RBAC e ABAC
- ✅ Configurar CORS e security headers adequadamente
- ✅ Fazer deploy seguro de aplicações React/Next.js

---

## 📚 Módulos e Vídeos

### **MÓDULO 1: Fundamentos e Proteção Contra Ataques (60 min)**

#### 🎥 Vídeo 1.1: Introdução e Auditoria de Segurança (12 min)

**Commit:** `video-1.1-introducao-auditoria`

- Apresentação do curso e OWASP Top 10
- Auditoria inicial do projeto
- Instalação de ferramentas (npm audit, eslint-plugin-security)

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `docs/SECURITY_AUDIT.md`

**Arquivos modificados:**

- `package.json` - eslint-plugin-security
- `.eslintrc.json` - plugin de segurança

---

#### 🎥 Vídeo 1.2: Security Headers no Next.js (10 min)

**Commit:** `video-1.2-security-headers`

- O que são Security Headers e por que usar
- Implementação no Next.js
- Testando com securityheaders.com

**Modificações de Código:** ✅ Sim

**Arquivos modificados:**

- `next.config.js` - security headers básicos
- `middleware.js` - headers adicionais

```javascript
// next.config.js
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }];
}
```

---

#### 🎥 Vídeo 1.3: Proteção contra XSS - Parte 1 (12 min)

**Commit:** `video-1.3-xss-parte-1`

- O que é XSS e tipos (Reflected, Stored, DOM-based)
- Criar campo de bio vulnerável
- Demonstrar ataque XSS

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/components/ProfileEdit/index.jsx`
- `src/app/profile/edit/page.js`
- `supabase/migrations/002_add_user_bio.sql`
- `docs/XSS_ATTACK_DEMO.md`

**Arquivos modificados:**

- `src/lib/database.js` - updateUserBio

---

#### 🎥 Vídeo 1.4: Proteção contra XSS - Parte 2 (15 min)

**Commit:** `video-1.4-xss-parte-2`

- Sanitização com DOMPurify
- Content Security Policy (CSP)
- Validação de inputs

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/sanitize.js`
- `src/components/UserBio/index.jsx`

**Arquivos modificados:**

- `package.json` - isomorphic-dompurify
- `src/components/ProfileEdit/index.jsx`
- `next.config.js` - CSP headers

```javascript
// src/lib/sanitize.js
import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href", "target"],
  });
}
```

---

#### 🎥 Vídeo 1.5: Proteção contra CSRF - Parte 1 (12 min)

**Commit:** `video-1.5-csrf-parte-1`

- O que é CSRF e como funciona
- Implementar funcionalidade vulnerável (delete post)
- Demonstrar ataque CSRF

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/actions/posts.js` - deletePost
- `src/components/DeletePostButton/index.jsx`
- `docs/CSRF_ATTACK_DEMO.md`

**Arquivos modificados:**

- `src/app/posts/[slug]/page.js`

---

#### 🎥 Vídeo 1.6: Proteção contra CSRF - Parte 2 (13 min)

**Commit:** `video-1.6-csrf-parte-2`

- Implementar CSRF tokens
- Validação no servidor
- SameSite cookies

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/csrf.js`

**Arquivos modificados:**

- `src/actions/posts.js` - validação CSRF
- `src/components/DeletePostButton/index.jsx`
- `src/middleware.js` - gerar token
- `next.config.js` - cookie settings

```javascript
// src/lib/csrf.js
import { randomBytes, createHash } from "crypto";

export function generateCSRFToken() {
  return randomBytes(32).toString("hex");
}

export function validateCSRFToken(token, storedToken) {
  if (!token || !storedToken) return false;
  return (
    createHash("sha256").update(token).digest("hex") ===
    createHash("sha256").update(storedToken).digest("hex")
  );
}
```

---

#### 🎥 Vídeo 1.7: Prevenindo Vazamento de Tokens (10 min)

**Commit:** `video-1.7-vazamento-tokens`

- Problemas: localStorage, logs, URLs, errors
- Sanitizar logs de segurança
- httpOnly cookies vs localStorage

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/logSanitizer.js`
- `docs/TOKEN_SECURITY.md`

**Arquivos modificados:**

- `src/eventLogger.js` - aplicar sanitização
- `src/actions/auth.js` - remover dados sensíveis

```javascript
// src/lib/logSanitizer.js
const SENSITIVE_KEYS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "secret",
  "creditCard",
  "ssn",
  "cpf",
];

export function sanitizeForLog(data) {
  if (typeof data !== "object" || data === null) return data;

  const sanitized = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeForLog(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
```

---

### **MÓDULO 2: OAuth e Gestão Segura de Tokens (50 min)**

#### 🎥 Vídeo 2.1: Entendendo OAuth 2.0 (12 min)

**Commit:** `video-2.1-oauth-flow`

- Authorization Code Flow
- PKCE (Proof Key for Code Exchange)
- State parameter (proteção CSRF em OAuth)
- Análise do fluxo Supabase Auth

**Modificações de Código:** ❌ Nenhuma

**Arquivos criados:**

- `docs/OAUTH_FLOW.md`

---

#### 🎥 Vídeo 2.2: Refresh Token Security (15 min)

**Commit:** `video-2.2-refresh-token`

- Como funcionam refresh tokens
- Token Rotation (novo token a cada refresh)
- Detecção de reuso de tokens
- Implementação no Supabase

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/tokenSecurity.js`
- `docs/REFRESH_TOKEN_FLOW.md`

**Arquivos modificados:**

- `src/utils/supabase/middleware.js` - detecção de reuso
- `src/eventLogger.js` - eventos de segurança

```javascript
// src/lib/tokenSecurity.js
export async function detectTokenReuse(userId, tokenId) {
  const usedToken = await database.checkUsedToken(tokenId);

  if (usedToken) {
    logSecurityEvent({
      type: "TOKEN_REUSE_DETECTED",
      userId,
      severity: "CRITICAL",
    });
    await revokeAllUserTokens(userId);
    return true;
  }

  await database.markTokenAsUsed(tokenId);
  return false;
}
```

---

#### 🎥 Vídeo 2.3: Token Binding (12 min)

**Commit:** `video-2.3-token-binding`

- Vincular token ao dispositivo
- Device fingerprinting
- Validação a cada request

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/deviceFingerprint.js`
- `supabase/migrations/003_token_binding.sql`

**Arquivos modificados:**

- `src/utils/supabase/server.js`
- `src/middleware.js`

---

#### 🎥 Vídeo 2.4: Reset Password Seguro (14 min)

**Commit:** `video-2.4-reset-password`

- Fluxo seguro de reset
- Token com hash no banco
- Expiração e one-time use

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/app/reset-password/page.js`
- `src/actions/passwordReset.js`
- `supabase/migrations/004_password_reset.sql`

**Arquivos modificados:**

- `src/app/forgot-password/page.js`
- `src/lib/database.js`

---

### **MÓDULO 3: Autorização - RBAC e ABAC (52 min)**

#### 🎥 Vídeo 3.1: Introdução à Autorização (10 min)

**Commit:** `video-3.1-intro-autorizacao`

- Autenticação vs Autorização
- RBAC (Role-Based Access Control)
- ABAC (Attribute-Based Access Control)
- **Por que usar RBAC + ABAC juntos?**
- Casos de uso práticos

**Modificações de Código:** ❌ Nenhuma

**O que será ensinado:**

- Conceitos fundamentais
- Quando usar cada abordagem
- Como combiná-las na prática

---

#### 🎥 Vídeo 3.2: RBAC Básico - Protegendo Delete Post (12 min)

**Commit:** `video-3.2-rbac-basico`

- Adicionar coluna `role` ao banco de dados
- Implementar verificação de role simples (apenas admin)
- Testar proteção

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `supabase/migrations/002_add_role.sql`

**Arquivos modificados:**

- `src/actions/posts.js` - adicionar verificação RBAC

```sql
-- 002_add_role.sql
ALTER TABLE "User" ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE "Post" ADD COLUMN reportCount INTEGER DEFAULT 0;

-- Criar alguns usuários admin para teste
UPDATE "User" SET role = 'admin' WHERE username IN ('seu_usuario');
```

```javascript
// src/actions/posts.js (MODIFICAR)
export async function deletePost(postId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const post = await database.getPostById(postId);
  const dbUser = await database.getUserByUsername(user.email.split("@")[0]);

  // ✅ RBAC: Apenas admin pode deletar
  if (dbUser.role !== "admin") {
    throw new Error("Apenas administradores podem deletar posts");
  }

  await db.from("Post").delete().eq("id", postId);
  revalidatePath("/");
  return { success: true };
}
```

**O que será ensinado:**

- Migration simples
- Verificação básica de role
- Conceito de RBAC puro

---

#### 🎥 Vídeo 3.3: ABAC - Adicionando Ownership (15 min)

**Commit:** `video-3.3-abac-ownership`

- Adicionar verificação de autoria (ownership)
- Combinar RBAC + ABAC
- Hierarquia de permissões

**Modificações de Código:** ✅ Sim

**Arquivos modificados:**

- `src/actions/posts.js` - adicionar ABAC

```javascript
// src/actions/posts.js (EVOLUIR)
export async function deletePost(postId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const post = await database.getPostById(postId);
  const dbUser = await database.getUserByUsername(user.email.split("@")[0]);

  // ✅ RBAC: Admin pode deletar tudo
  if (dbUser.role === "admin") {
    await db.from("Post").delete().eq("id", postId);
    revalidatePath("/");
    return { success: true };
  }

  // ✅ ABAC: Autor pode deletar próprio post (ownership)
  if (post.authorId === dbUser.id) {
    await db.from("Post").delete().eq("id", postId);
    revalidatePath("/");
    return { success: true };
  }

  throw new Error("Sem permissão para deletar este post");
}
```

**O que será ensinado:**

- Atributo de ownership (authorId)
- Como RBAC e ABAC trabalham juntos
- Hierarquia: Admin > Owner > Others

---

#### 🎥 Vídeo 3.4: ABAC Avançado - Múltiplos Atributos (15 min)

**Commit:** `video-3.4-abac-avancado`

- Adicionar role de moderador
- Regra: Moderador pode deletar posts com 3+ reports
- Refatorar para função de autorização reutilizável

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/authorization.js`

**Arquivos modificados:**

- `src/actions/posts.js` - refatorar com função

```javascript
// src/lib/authorization.js (CRIAR)
export async function canDeletePost(user, post) {
  // RBAC: Admin pode tudo
  if (user.role === "admin") {
    return true;
  }

  // ABAC: Ownership
  if (post.authorId === user.id) {
    return true;
  }

  // RBAC + ABAC: Moderador + Atributo (reports)
  if (user.role === "moderator" && post.reportCount >= 3) {
    return true;
  }

  return false;
}
```

```javascript
// src/actions/posts.js (REFATORAR)
import { canDeletePost } from "@/lib/authorization";

export async function deletePost(postId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const post = await database.getPostById(postId);
  const dbUser = await database.getUserByUsername(user.email.split("@")[0]);

  // ✅ Usar função de autorização
  const canDelete = await canDeletePost(dbUser, post);

  if (!canDelete) {
    logSecurityEvent({
      type: "AUTHORIZATION_FAILED",
      userId: dbUser.id,
      resource: "post",
      action: "delete",
      reason: "insufficient_permissions",
    });
    throw new Error("Sem permissão para deletar este post");
  }

  await db.from("Post").delete().eq("id", postId);
  revalidatePath("/");

  logEvent({
    step: "AUTHORIZATION",
    operation: "POST_DELETED",
    userId: dbUser.id,
    metadata: { postId, userRole: dbUser.role },
  });

  return { success: true };
}
```

**O que será ensinado:**

- ABAC com múltiplos atributos (role + reportCount)
- Função reutilizável de autorização
- Logs de segurança
- Padrão: extrair lógica de autorização

---

### **MÓDULO 4: CORS e Configurações Seguras (45 min)**

#### 🎥 Vídeo 4.1: Entendendo CORS (10 min)

**Commit:** `video-4.1-entendendo-cors`

- O que é CORS e por que existe
- Same-Origin Policy
- Preflight requests
- Credentials e cookies

**Modificações de Código:** ❌ Nenhuma

**Arquivos criados:**

- `docs/CORS_EXPLAINED.md`

---

#### 🎥 Vídeo 4.2: Configurando CORS no Next.js (12 min)

**Commit:** `video-4.2-cors-config`

- CORS por ambiente
- Whitelist de domínios
- Headers de CORS
- Tratamento de credenciais

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/cors.js`

**Arquivos modificados:**

- `next.config.js` - CORS headers
- `src/middleware.js` - CORS middleware
- `.env.example` - ALLOWED_ORIGINS

```javascript
// src/lib/cors.js
export function getCorsHeaders(origin) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

  if (process.env.NODE_ENV === "development") {
    allowedOrigins.push("http://localhost:3000");
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : "",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}
```

---

#### 🎥 Vídeo 4.3: Content Security Policy (CSP) (15 min)

**Commit:** `video-4.3-csp`

- O que é CSP
- Diretivas principais
- Nonce para scripts inline
- Testing e debugging

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/csp.js`
- `src/app/api/csp-report/route.js`

**Arquivos modificados:**

- `next.config.js` - CSP headers
- `src/app/layout.js` - nonce injection

```javascript
// src/lib/csp.js
import crypto from "crypto";

export function generateNonce() {
  return crypto.randomBytes(16).toString("base64");
}

export function getCSPHeader(nonce) {
  const csp = {
    "default-src": ["'self'"],
    "script-src": ["'self'", `'nonce-${nonce}'`],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": ["'self'", "https://*.supabase.co"],
    "frame-ancestors": ["'none'"],
    "report-uri": ["/api/csp-report"],
  };

  return Object.entries(csp)
    .map(([k, v]) => `${k} ${v.join(" ")}`)
    .join("; ");
}
```

---

#### 🎥 Vídeo 4.4: Security Headers Avançados (12 min)

**Commit:** `video-4.4-headers-avancados`

- HSTS (HTTP Strict Transport Security)
- Permissions Policy
- Subresource Integrity (SRI)
- Testing com securityheaders.com

**Modificações de Código:** ✅ Sim

**Arquivos modificados:**

- `next.config.js` - headers completos
- `middleware.js` - headers dinâmicos

---

### **MÓDULO 5: Deploy Seguro e Boas Práticas (50 min)**

#### 🎥 Vídeo 5.1: Preparando para Produção (12 min)

**Commit:** `video-5.1-preparacao-producao`

- Checklist de segurança
- Variáveis de ambiente
- Build otimizado
- Auditoria final

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `SECURITY_CHECKLIST.md`
- `.env.production.example`

**Arquivos modificados:**

- `.gitignore` - secrets
- `package.json` - scripts de prod

---

#### 🎥 Vídeo 5.2: Testes de Segurança (15 min)

**Commit:** `video-5.2-testes-seguranca`

- Unit tests para sanitização
- Integration tests para RBAC
- E2E security tests
- npm audit e dependency scanning

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/__tests__/security/sanitize.test.js`
- `src/__tests__/security/rbac.test.js`
- `playwright/security/auth.spec.js`

**Arquivos modificados:**

- `package.json` - test scripts

---

#### 🎥 Vídeo 5.3: CI/CD com Segurança (13 min)

**Commit:** `video-5.3-cicd-seguranca`

- GitHub Actions para security
- Dependabot
- Pre-commit hooks
- Security scanning automático

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `.github/workflows/security.yml`
- `.github/dependabot.yml`
- `.husky/pre-commit`

---

#### 🎥 Vídeo 5.4: Deploy na Vercel (13 min)

**Commit:** `video-5.4-deploy-vercel`

- Configurar projeto na Vercel
- Variáveis de ambiente seguras
- Preview deployments
- Monitoring e logs

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `vercel.json`
- `docs/DEPLOY_GUIDE.md`

**Arquivos modificados:**

- `README.md` - instruções de deploy

---

#### 🎥 Vídeo 5.5: Monitoramento e Alertas (10 min)

**Commit:** `video-5.5-monitoring`

- Logs de segurança em produção
- Alertas de eventos críticos
- Dashboard de segurança
- Análise de logs com Vercel

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/app/admin/security/page.js`
- `src/components/SecurityDashboard/index.jsx`

---

#### 🎥 Vídeo 5.6: Conclusão e Próximos Passos (8 min)

**Commit:** `video-5.6-conclusao`

- Review de todos os conceitos
- Recursos adicionais
- Comunidades e certificações
- Encerramento

**Modificações de Código:** ❌ Nenhuma

**Arquivos modificados:**

- `README.md` - badges de segurança
- `docs/RESOURCES.md`

---

## 📊 Estrutura Resumida

```
MÓDULO 1: Fundamentos e Proteção (60 min, 7 vídeos)
  ├─ Auditoria e headers (2 vídeos)
  ├─ XSS (2 vídeos)
  ├─ CSRF (2 vídeos)
  └─ Vazamento de tokens (1 vídeo)

MÓDULO 2: OAuth e Tokens (50 min, 4 vídeos)
  ├─ OAuth flow (1 vídeo)
  ├─ Refresh tokens (1 vídeo)
  ├─ Token binding (1 vídeo)
  └─ Reset password (1 vídeo)

MÓDULO 3: RBAC e ABAC (52 min, 4 vídeos) ⭐ SIMPLIFICADO
  ├─ Introdução (1 vídeo)
  ├─ RBAC básico (1 vídeo)
  ├─ ABAC ownership (1 vídeo)
  └─ ABAC avançado (1 vídeo)

  💡 Evolução progressiva na MESMA feature (delete post)

MÓDULO 4: CORS e Headers (45 min, 4 vídeos)
  ├─ CORS (2 vídeos)
  └─ CSP e headers (2 vídeos)

MÓDULO 5: Deploy e Produção (50 min, 6 vídeos)
  ├─ Preparação e testes (2 vídeos)
  ├─ CI/CD (1 vídeo)
  ├─ Deploy (1 vídeo)
  ├─ Monitoring (1 vídeo)
  └─ Conclusão (1 vídeo)
```

---

## 📈 Métricas do Curso

- **Total de Módulos**: 5
- **Total de Vídeos**: 25 ⭐ (era 27)
- **Duração Total**: ~4 horas
- **Commits Esperados**: ~20 (com código)
- **Arquivos Novos**: ~40+ ⭐ (era 60+)
- **Arquivos Modificados**: ~20+ ⭐ (era 25+)

---

## 🎯 Alinhamento com a Ementa

### ✅ Proteção contra XSS, CSRF e vazamento de tokens

- **Módulo 1**: 100% focado neste tópico
- 5 vídeos dedicados (1.3 a 1.7)
- Implementação prática de todas as proteções

### ✅ OAuth e fluxos com refresh token seguro

- **Módulo 2**: 100% focado neste tópico
- 4 vídeos dedicados (2.1 a 2.4)
- OAuth flow, token rotation, binding, reset password

### ✅ Autorização baseada em papéis (RBAC) e atributos (ABAC)

- **Módulo 3**: 100% focado neste tópico
- 4 vídeos dedicados (3.1 a 3.4) ⭐ SIMPLIFICADO
- **Evolução progressiva na mesma feature:**
  - Vídeo 3.2: RBAC puro (apenas admin)
  - Vídeo 3.3: RBAC + ABAC (admin + ownership)
  - Vídeo 3.4: RBAC + ABAC avançado (admin + owner + moderator com reports)
- Aprende os dois conceitos juntos, como na vida real

### ✅ CORS, headers e configurações seguras no frontend

- **Módulo 4**: 100% focado neste tópico
- 4 vídeos dedicados (4.1 a 4.4)
- CORS, CSP, headers avançados

### ✅ Deploy (requisito adicional)

- **Módulo 5**: Deploy seguro e monitoramento
- 6 vídeos dedicados (5.1 a 5.6)
- Testes, CI/CD, deploy Vercel, monitoring

---

## 🔄 Workflow de Commits

### Convenção de Commits

```bash
# Formato
<tipo>(<módulo>): <descrição curta>

# Exemplos
feat(proteção): adiciona sanitização XSS com DOMPurify
fix(csrf): implementa proteção com tokens
feat(rbac): cria middleware de autorização
feat(cors): configura CORS por ambiente
feat(deploy): adiciona CI/CD com GitHub Actions
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug/vulnerabilidade
- `refactor`: Refatoração sem mudar comportamento
- `docs`: Documentação
- `test`: Testes
- `chore`: Tarefas de manutenção

---

## 📋 Checklist de Implementação

### Antes de Cada Vídeo

- [ ] Criar branch do módulo (se primeira vez)
- [ ] Revisar código atual
- [ ] Preparar ambiente de demonstração
- [ ] Revisar roteiro do vídeo

### Durante o Vídeo

- [ ] Explicar o conceito (teoria)
- [ ] Demonstrar o problema (se aplicável)
- [ ] Implementar a solução
- [ ] Testar localmente
- [ ] Explicar o código

### Depois do Vídeo

- [ ] Commit com mensagem descritiva
- [ ] Tag do vídeo: `git tag video-X.Y`
- [ ] Push da branch e tags
- [ ] Atualizar documentação se necessário
- [ ] Marcar vídeo como concluído

---

## 🚀 Como Usar Este Plano

### Para Implementação

```bash
# 1. Criar branch do módulo
git checkout -b modulo-01-fundamentos

# 2. Durante cada vídeo, fazer alterações

# 3. Commit após cada vídeo
git add .
git commit -m "feat(proteção): adiciona security headers"
git tag video-1.2

# 4. Push
git push origin modulo-01-fundamentos --follow-tags

# 5. Ao final do módulo, merge na main
git checkout main
git merge modulo-01-fundamentos
git push origin main
```

### Para Revisão

```bash
# Ver commits de um módulo
git log --oneline modulo-01-fundamentos

# Voltar para estado de um vídeo específico
git checkout video-1.3

# Ver diferenças entre vídeos
git diff video-1.3 video-1.4

# Ver arquivos modificados
git show video-1.3 --stat
```

---

## 📚 Recursos Complementares

### Documentação Criada

- `SECURITY_AUDIT.md` - Auditoria inicial
- `XSS_ATTACK_DEMO.md` - Demonstração XSS
- `CSRF_ATTACK_DEMO.md` - Demonstração CSRF
- `TOKEN_SECURITY.md` - Segurança de tokens
- `OAUTH_FLOW.md` - Fluxo OAuth
- `REFRESH_TOKEN_FLOW.md` - Fluxo de refresh tokens
- `CORS_EXPLAINED.md` - CORS explicado
- `SECURITY_CHECKLIST.md` - Checklist final
- `DEPLOY_GUIDE.md` - Guia de deploy
- `RESOURCES.md` - Recursos adicionais

### Links Úteis

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers](https://securityheaders.com/)

---

**Data de Criação**: 2025-01-12  
**Última Atualização**: 2025-01-12  
**Status**: 📝 Plano Refatorado - Alinhado com Ementa
