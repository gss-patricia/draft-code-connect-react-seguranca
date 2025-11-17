# 🔐 Curso: React e Next.js - Segurança em Aplicações Web

## 📋 Estrutura do Curso

### Informações Gerais

- **Duração Total**: ~4 horas
- **Nível**: Intermediário/Avançado
- **Pré-requisitos**: React, Next.js, Node.js
- **Projeto Base**: Code Connect (rede social para devs)
- **Módulos**: 5
- **Vídeos por módulo**: 4-8 vídeos de 8-15 min

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

### **MÓDULO 1: Fundamentos e Proteção Contra Ataques (52 min)**

#### 🎥 Vídeo 1.1: Estrutura do Projeto (10 min)

**Commit:** `video-1.1-estrutura-projeto`

**Conteúdo:**

1. **Visão Geral (2 min)**

   - Apresentação do Code Connect (rede social para devs)
   - Tecnologias: Next.js 14 (App Router), React, Supabase
   - O que a aplicação faz

2. **Tour pela Estrutura (8 min)**
   - `/src/app/` - Páginas e rotas (App Router)
   - `/src/components/` - Componentes React
   - `/src/actions/` - Server Actions (onde vamos aplicar segurança)
   - `/src/lib/` - Utilitários (database, helpers)
   - `/src/utils/supabase/` - Cliente Supabase
   - `/docs/` - Documentação do curso
   - `next.config.js` - Configurações

**Modificações de Código:** ❌ Nenhuma (apenas exploração)

**Arquivos criados:**

- Nenhum

**Objetivo:** Familiarizar o aluno com o projeto antes de trabalhar com segurança.

---

#### 🎥 Vídeo 1.2: OWASP e Auditoria de Segurança (12 min)

**Commit:** `video-1.2-owasp-auditoria`

**Conteúdo:**

1. **O que é OWASP? (3 min)**

   - Padrão global da indústria
   - Fundação sem fins lucrativos desde 2001
   - Base para auditorias profissionais
   - Por que conhecer OWASP importa para sua carreira

2. **OWASP Top 10 (4 min)**

   - As 10 vulnerabilidades mais críticas
   - 7 de 10 relevantes para React/Next.js
   - A01 (Access Control), A03 (XSS), A05 (Headers), A06 (Dependências), A07 (Auth)
   - Mapeamento: OWASP → Módulos do Curso

3. **Auditoria Formal vs Prática (4 min)**

   - **Formal:** Empresas grandes, consultoria, $10k-$100k
   - **Prática:** Startups, ferramentas gratuitas, code review
   - Quando usar cada uma?
   - Ferramentas profissionais (Checkmarx, Snyk)

4. **OWASP ASVS (1 min)**
   - Checklist completo de segurança
   - Level 1, 2, 3
   - Este curso cobre ~60% do Level 1

**Modificações de Código:** ✅ Sim (documentação)

**Arquivos criados:**

- `docs/OWASP_AUDITORIA.md` - OWASP Top 10 e auditoria profissional

**Arquivos modificados:**

- Nenhum

---

#### 🎥 Vídeo 1.3: Os 3 Pilares de Segurança (10 min)

**Commit:** `video-1.3-pilares-seguranca`

**Conteúdo:**

1. **Introdução aos 3 Pilares (2 min)**

   - Visão geral da segurança de aplicações

2. **Pilar 1: Dependências (3 min)**

   - npm packages vulneráveis
   - Exemplo: js-yaml, lodash
   - Ferramentas: npm audit, Dependabot, Snyk
   - Demo: `npm audit` no projeto

3. **Pilar 2: Código (3 min)**

   - Vulnerabilidades que você escreve
   - Exemplos: XSS, CSRF, Broken Access Control
   - Ferramentas: Code review, Checkmarx, Snyk Code
   - **Foco principal deste curso**

4. **Pilar 3: Infraestrutura (2 min)**
   - Servidores, rede, cloud
   - AWS, Kubernetes, firewalls
   - ❌ Fora do escopo (responsabilidade de DevOps)
   - Por que não cobrimos: foco em desenvolvimento React/Next.js

**Modificações de Código:** ✅ Sim (documentação)

**Arquivos criados:**

- `docs/PILARES_SEGURANCA.md` - Os 3 pilares explicados
- `docs/ESCOPO_CURSO.md` - Escopo detalhado
- `docs/FERRAMENTAS_SEGURANCA.md` - Ferramentas profissionais

**Arquivos modificados:**

- Nenhum

---

#### 🎥 Vídeo 1.4: Proteção contra XSS - Parte 1 (12 min)

**Commit:** `video-1.4-xss-parte-1`

**Conteúdo:**

1. **O que é XSS (3 min)**

   - Cross-Site Scripting
   - Tipos: Reflected, Stored, DOM-based
   - Por que é perigoso (roubo de cookies, redirecionamento)

2. **Explorar código vulnerável existente (4 min)**

   - Mostrar `UserBio` existente com `dangerouslySetInnerHTML`
   - Explicar por que está vulnerável (sem sanitização)
   - Mostrar página `/profile/edit` que já existe

3. **Demonstrar o Ataque (5 min)**
   - Inserir `<script>alert('XSS Ataque!')</script>` na bio
   - Mostrar que o alert executa
   - Inserir `<img src=x onerror="alert('XSS')">`
   - Explicar o perigo real (roubo de tokens, cookies)

**Modificações de Código:** ❌ Nenhum

**Arquivos criados:**

- ❌ Nenhum (apenas demonstração)

**Arquivos modificados:**

- ❌ Nenhum (componentes vulneráveis já existem no projeto base)

**Código Vulnerável:**

```jsx
// src/components/UserBio/index.jsx (⚠️ VULNERÁVEL)
export function UserBio({ bio }) {
  return (
    <div className={styles.bioContainer}>
      <h3>Bio</h3>
      {/* ⚠️ PERIGO: Permite execução de scripts maliciosos */}
      <div dangerouslySetInnerHTML={{ __html: bio }} />
    </div>
  );
}
```

```javascript
// src/actions/profile.js (⚠️ VULNERÁVEL)
export async function updateUserBio(bio) {
  const user = await getCurrentUser();
  // ⚠️ PERIGO: Salva HTML malicioso direto no banco
  await database.updateUserBio(user.id, bio);
  revalidatePath("/profile");
  return { success: true };
}
```

**Payloads de Teste:**

```html
<!-- Teste 1: Alert simples -->
<script>
  alert("XSS Ataque!");
</script>

<!-- Teste 2: IMG onerror -->
<img src="x" onerror="alert('XSS via IMG')" />

<!-- Teste 3: Roubo de cookie (demonstração) -->
<img src="x" onerror="console.log('Cookie:', document.cookie)" />
```

---

#### 🎥 Vídeo 1.5: Proteção contra XSS - Parte 2 (15 min)

**Commit:** `video-1.5-xss-parte-2`

**Conteúdo:**

1. **Solução 1: DOMPurify (6 min)**

   - Instalar `isomorphic-dompurify`
   - Criar função de sanitização
   - Aplicar no Server Action
   - Testar: `<script>` é removido, `<b>` é permitido

2. **Solução 2: CSP (5 min)**

   - Content Security Policy
   - Bloquear inline scripts
   - Configurar no Next.js
   - Testar: scripts inline não executam mais

3. **Validação de Input (4 min)**
   - Limitar tamanho (max 500 caracteres)
   - Validar no frontend E backend
   - Feedback visual para o usuário

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/sanitize.js` - Função de sanitização

**Arquivos modificados:**

- `package.json` - isomorphic-dompurify
- `src/actions/profile.js` - Aplicar sanitização
- `src/app/profile/edit/page.js` - Validação no form
- `next.config.js` - CSP headers

**Código SEGURO:**

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

```javascript
// src/actions/profile.js (✅ SEGURO)
import { sanitizeHTML } from "@/lib/sanitize";

export async function updateUserBio(bio) {
  const user = await getCurrentUser();

  // ✅ PROTEÇÃO: Sanitizar antes de salvar
  const safeBio = sanitizeHTML(bio);

  await database.updateUserBio(user.id, safeBio);
  revalidatePath("/profile");
  return { success: true };
}
```

```javascript
// next.config.js - CSP
async headers() {
  return [{
    source: '/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "script-src 'self' 'unsafe-inline' https:; object-src 'none';"
      }
    ],
  }];
}
```

**Teste de Proteção:**

```html
<!-- Entrada do usuário -->
Olá! <b>Sou dev</b>
<script>
  alert("XSS");
</script>

<!-- Saída sanitizada (após DOMPurify) -->
Olá! <b>Sou dev</b>
<!-- script foi removido ✅ -->
```

---

#### 🎥 Vídeo 1.6: Proteção contra CSRF - Parte 1 (12 min)

**Commit:** `video-1.6-csrf-parte-1`

**Conteúdo:**

1. **O que é CSRF (4 min)**

   - Cross-Site Request Forgery
   - Ataque: site malicioso faz request autenticado
   - Exemplo real: deletar post sem querer
   - Diferença de XSS: não precisa de input do usuário

2. **Criar funcionalidade VULNERÁVEL (3 min)**

   - Botão de delete post (sem proteção)
   - Server Action sem validação de origem
   - Testar: funciona normalmente

3. **Demonstrar Ataque CSRF (5 min)**
   - Criar página HTML maliciosa (fora do app)
   - Form oculto que POST para /api/posts/delete
   - Usuário logado visita página → post deletado sem saber
   - **Demonstração ao vivo**

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/components/DeletePostButton/index.jsx` - Botão vulnerável

**Arquivos modificados:**

- `src/actions/posts.js` - deletePost SEM proteção
- `src/app/posts/[slug]/page.js` - Adicionar botão

**Código VULNERÁVEL:**

```javascript
// src/actions/posts.js (⚠️ VULNERÁVEL)
"use server";

export async function deletePost(postId) {
  const user = await getCurrentUser();

  // ⚠️ PERIGO: Não valida origem do request
  // ⚠️ PERIGO: Não tem CSRF token

  await database.deletePost(postId);
  revalidatePath("/");
  return { success: true };
}
```

```jsx
// src/components/DeletePostButton/index.jsx (⚠️ VULNERÁVEL)
export function DeletePostButton({ postId }) {
  return (
    <form
      action={async () => {
        "use server";
        await deletePost(postId);
      }}
    >
      <button type="submit">Deletar Post</button>
    </form>
  );
}
```

**Exemplo de Ataque CSRF (criar temporariamente para demonstração):**

```html
<!-- Criar arquivo csrf-attack.html temporário FORA do projeto -->
<!-- Apenas para demonstração ao vivo, deletar depois -->
<!DOCTYPE html>
<html>
  <head>
    <title>Você ganhou um prêmio! 🎉</title>
  </head>
  <body>
    <h1>Parabéns! Clique aqui para receber seu prêmio</h1>

    <!-- Form oculto que deleta um post -->
    <form
      id="attack"
      action="http://localhost:3000/api/posts/delete"
      method="POST"
    >
      <input type="hidden" name="postId" value="123" />
    </form>

    <script>
      // Submete automaticamente quando a página carrega
      document.getElementById("attack").submit();
    </script>

    <!-- ⚠️ Usuário nem vê isso acontecer -->
  </body>
</html>
```

---

#### 🎥 Vídeo 1.7: Proteção contra CSRF - Parte 2 (13 min)

**Commit:** `video-1.7-csrf-parte-2`

**Conteúdo:**

1. **Solução 1: CSRF Tokens (7 min)**

   - Gerar token único por sessão
   - Incluir token no form (hidden input)
   - Validar token no servidor
   - Testar: ataque CSRF agora FALHA ✅

2. **Solução 2: SameSite Cookies (3 min)**

   - Configurar `SameSite=Strict` ou `Lax`
   - Impede que cookies sejam enviados de outros sites
   - Configurar no Next.js

3. **Teste de Proteção (3 min)**
   - Tentar o ataque novamente
   - Token inválido → request rejeitado
   - Mostrar logs de segurança

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/csrf.js` - Geração e validação de tokens

**Arquivos modificados:**

- `src/actions/posts.js` - Validação CSRF
- `src/components/DeletePostButton/index.jsx` - Enviar token
- `src/middleware.js` - Gerar token
- `next.config.js` - SameSite cookies

**Código SEGURO:**

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

```javascript
// src/middleware.js
import { generateCSRFToken } from "@/lib/csrf";

export function middleware(request) {
  const response = NextResponse.next();

  // ✅ PROTEÇÃO: Gerar token CSRF para cada sessão
  if (!request.cookies.get("csrf-token")) {
    const token = generateCSRFToken();
    response.cookies.set("csrf-token", token, {
      httpOnly: true,
      sameSite: "strict", // ✅ Proteção adicional
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
```

```javascript
// src/actions/posts.js (✅ SEGURO)
"use server";
import { validateCSRFToken } from "@/lib/csrf";
import { cookies } from "next/headers";

export async function deletePost(postId, csrfToken) {
  const user = await getCurrentUser();
  const cookieStore = cookies();
  const storedToken = cookieStore.get("csrf-token")?.value;

  // ✅ PROTEÇÃO: Validar token CSRF
  if (!validateCSRFToken(csrfToken, storedToken)) {
    logSecurityEvent({
      type: "CSRF_ATTEMPT",
      userId: user.id,
      severity: "HIGH",
    });
    throw new Error("Token CSRF inválido");
  }

  await database.deletePost(postId);
  revalidatePath("/");
  return { success: true };
}
```

```jsx
// src/components/DeletePostButton/index.jsx (✅ SEGURO)
import { cookies } from "next/headers";

export async function DeletePostButton({ postId }) {
  const cookieStore = cookies();
  const csrfToken = cookieStore.get("csrf-token")?.value;

  return (
    <form
      action={async (formData) => {
        "use server";
        await deletePost(postId, csrfToken);
      }}
    >
      {/* ✅ Token incluído no form */}
      <input type="hidden" name="csrf" value={csrfToken} />
      <button type="submit">Deletar Post</button>
    </form>
  );
}
```

**Resultado:**

```javascript
// Ataque anterior (docs/csrf-attack.html)
// ❌ AGORA FALHA: Token CSRF não está presente
// ❌ Cookie com SameSite=Strict não é enviado

// Log de segurança:
// {
//   type: 'CSRF_ATTEMPT',
//   userId: '123',
//   severity: 'HIGH',
//   timestamp: '2025-01-17T...'
// }
```

---

### **MÓDULO 2: OAuth e Gestão Segura de Tokens (67 min, 5 vídeos)**

#### 🎥 Vídeo 2.1: Tokens Inseguros - Demonstração Real de Vazamentos (12 min)

**Commit:** `video-2.1-tokens-inseguros`

**[CONTEXTO]**

Nosso projeto já tem a funcionalidade de Reset Password implementada. Ela funciona... mas está completamente vulnerável — como acontece em 90% dos sistemas React/Next.js em produção. Este vídeo expõe todos os pontos onde tokens de reset podem vazar dentro do navegador, do servidor e da URL. O objetivo é chocar o aluno com os riscos reais, para depois corrigir tudo nos vídeos seguintes.

**[PROBLEMA]**

No fluxo atual:

- O token de reset aparece inteiro na URL
- Ele fica salvo no histórico do navegador
- Ele aparece em DevTools → Network
- Ele aparece em logs do servidor
- Ele não expira
- Ele pode ser usado infinitas vezes

**Ou seja:** se alguém vê esse token uma vez → controla a conta da vítima para sempre.

**Conteúdo:**

1. **Demonstração verbal + tela (9 min)**

   - Abrir `/forgot-password` e solicitar reset
   - Ver a URL: `/reset-password?token=abc123`
   - Mostrar que isso cai no histórico do navegador
   - Abrir DevTools → Network → ver token exposto
   - Mostrar logs do servidor: `token: "abc123"`
   - Reutilizar token várias vezes → continua funcionando
   - Abrir aba anônima, colar URL → funciona

2. **Análise dos problemas (3 min)**
   - Token na URL → entra em logs, analytics, Referer header
   - Token sem criptografia → qualquer um decodifica base64
   - Token sem expiração → válido para sempre
   - Token reutilizável → atacante usa infinitas vezes
   - Usa Service Role Key → não é o padrão Supabase Auth

**[SOLUÇÃO]**

Não implementamos aqui — apenas mostramos que está tudo quebrado. O objetivo é preparar terreno para os próximos vídeos, onde corrigimos tudo.

**[TEORIA]**

- Tokens expostos entram em: **OWASP Top 10: Sensitive Data Exposure** e **OWASP: Broken Authentication**
- Tokens são equivalentes a senhas. **Vazou → perdeu.**
- **Métrica:** "Nenhum token sensível pode aparecer na URL, nos logs ou no histórico."

**Modificações de Código:** ❌ Nenhuma (apenas demonstração)

**Arquivos explorados:**

- `src/actions/passwordReset.js` - Código vulnerável existente
- `src/app/forgot-password/page.js` - Form de solicitação
- `src/app/reset-password/page.js` - Página com vulnerabilidades visíveis
- `src/components/ForgotPassword/index.jsx` - Componente vulnerável

---

#### 🎥 Vídeo 2.2: Migrando para Supabase Auth Nativo - Parte 1 (ForgotPassword) (10 min)

**Commit:** `video-2.2-forgot-password-supabase`

**[CONTEXTO]**

No vídeo anterior, vimos que nosso fluxo customizado de Reset Password tinha vários problemas graves: token na URL, sem expiração, reutilizável infinitas vezes, código difícil de manter. Estávamos reinventando um processo crítico, quando já existe uma solução muito mais segura — o Supabase Auth.

Neste vídeo, vamos começar a migração para o fluxo nativo do Supabase, que já inclui segurança de nível profissional sem escrever praticamente nenhuma linha de código manual.

**[PROBLEMA]**

Criar um sistema de recuperação de senha manual significa:

- Gerenciar tokens
- Gerenciar expiração
- Armazenar hashes
- Invalidar token após uso
- Validar token na hora de redefinir
- Não expor tokens em logs ou URLs
- Evitar race conditions

Isso é difícil, demorado e arriscado. É por isso que a recomendação profissional é **não implementar reset password manualmente**, e sim usar um provedor confiável.

**[SOLUÇÃO]**

A solução é migrar totalmente para o Supabase Auth, que já implementa:

- Token JWT seguro
- Expiração automática (1h)
- Uso único integrado (one-time use)
- Token no hash da URL (#) → não aparece em histórico nem logs
- Validação automática dentro do Supabase
- Envio do email (com SMTP real, se configurado)

Nenhum código de geração/armazenamento/validação de token é necessário.

**Conteúdo:**

1. **Migrar o componente ForgotPassword (7 min)**

   - Modificar `src/components/ForgotPassword/index.jsx`
   - Trocar implementação customizada por `resetPasswordForEmail()`
   - Configurar `redirectTo` para sua app
   - Remover `debugToken` e `debugUrl`

2. **Explicação verbal (3 min)**

   - Não precisamos gerar token
   - Não precisamos salvar nada no banco
   - Não precisamos implementar expiração
   - Supabase envia o email com o token seguro no hash da URL

**[TEORIA]**

Esse fluxo funciona como OAuth:

- Gera token
- Valida token
- Consome token
- Invalida token

**Métrica:** Um token só pode ser usado 1 única vez.

**Modificações de Código:** ✅ Sim

**Arquivos modificados:**

- `src/components/ForgotPassword/index.jsx` - Usar `resetPasswordForEmail()`

**Código SEGURO (implementar):**

```javascript
// src/components/ForgotPassword/index.jsx (MODIFICAR)
"use client";
import { createClient } from "@/utils/supabase/client";

export const ForgotPassword = () => {
  const supabase = createClient();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ USAR SUPABASE AUTH NATIVO
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("✅ Email enviado! Verifique sua caixa de entrada.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Enviar Email</Button>
    </form>
  );
};
```

---

#### 🎥 Vídeo 2.3: Migrando para Supabase Auth Nativo - Parte 2 (ResetPassword + Limpeza) (12 min)

**Commit:** `video-2.3-reset-password-supabase`

**[CONTEXTO]**

No vídeo anterior, nós migramos a primeira parte do fluxo — o ForgotPassword — para o Supabase. Agora vamos concluir a migração:

- Implementar a página reset-password usando o fluxo automático
- Remover toda a lógica vulnerável antiga
- Validar que expiração e one-time use funcionam

**[PROBLEMA]**

Nosso fluxo manual anterior exigia:

- Pegar token da URL
- Validar token manualmente
- Verificar expiração
- Verificar se já foi usado
- Atualizar hash no banco
- Lidar com erros de reuso
- Evitar race conditions

Com o uso nativo das funcionalidades do Supabase, nada disso é necessário.

**[SOLUÇÃO]**

**Conteúdo:**

1. **Migrar ResetPassword (5 min)**

   - Modificar `src/app/reset-password/page.js`
   - Remover decodificação manual
   - Usar `supabase.auth.updateUser({ password })`
   - Supabase pega token do hash automaticamente

2. **Explicação verbal (2 min)**

   - Não pegamos token da URL
   - Não validamos token manualmente
   - Não lidamos com expiração
   - Não lidamos com one-time use
   - Tudo isso já é feito pelo Supabase automaticamente

3. **Deletar código vulnerável (2 min)**

   - Deletar `src/actions/passwordReset.js`
   - Deletar helpers antigos
   - Remover warnings de segurança

4. **Teste ao vivo (3 min)**

   - Testar fluxo completo
   - Tentar reusar link → falha ✅
   - Esperar expiração → falha ✅

**[TEORIA]**

O fluxo segue a mesma estrutura de um processo auditado OWASP:

- Gera token
- Valida assinatura
- Valida expiração
- Consome uma vez
- Invalida automaticamente

**Métrica de segurança:**

- Nenhum token pode ser usado duas vezes
- Nenhum token deve aparecer em logs ou histórico

**Modificações de Código:** ✅ Sim

**Arquivos modificados:**

- `src/app/reset-password/page.js` - Usar `updateUser()`

**Arquivos deletados:**

- `src/actions/passwordReset.js` - Não precisa mais

**Código SEGURO (implementar):**

```javascript
// src/app/reset-password/page.js (MODIFICAR)
"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    // ✅ Supabase pega token do hash (#) automaticamente
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMessage("Token inválido ou expirado");
    } else {
      setSuccessMessage("Senha alterada com sucesso!");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nova Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        label="Confirmar Senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="submit">Redefinir Senha</Button>
    </form>
  );
}
```

---

#### 🎥 Vídeo 2.4: OAuth 2.0 e PKCE - Entendendo o Fluxo (13 min)

**Commit:** `video-2.4-oauth-flow`

**[CONTEXTO]**

Antes de implementar refresh tokens ou token rotation, precisamos entender como funciona o processo de autenticação OAuth que o Supabase executa "por trás dos panos". Este vídeo serve como base para todo o restante do módulo: você aprende como o fluxo funciona, onde ele quebra, e por que Supabase usa PKCE e state corretamente.

**[PROBLEMA]**

A maioria dos problemas graves de OAuth acontece porque o fluxo é implementado pela metade:

- Ausência de PKCE → permite interceptação do authorization code
- Ausência de state → permite CSRF no login
- Redirect URI permissivo → session fixation
- Tokens aparecendo na URL (implicit flow)

E o pior: tudo isso funciona aparentemente bem, então muitos devs acham que está "seguro".

**[SOLUÇÃO]**

Apresentar o fluxo OAuth moderno em slides curtos, explicando APENAS o necessário para seguir o curso e entendendo como o Supabase implementa segurança automaticamente.

**Conteúdo (13 min de slides + demonstração):**

**SLIDE 1 — O que vamos revisar:**

- Authorization Code Flow
- PKCE
- State
- Como o Supabase garante segurança no fluxo
- Por que isso importa para o módulo de tokens

**SLIDE 2 — Onde OAuth falha na prática:**

- Falta de PKCE
- Falha em validar state
- Redirect URI genérico
- Troca de código insegura
- Fluxo implícito (tokens na URL)

**SLIDE 3 — Authorization Code Flow (resumo rápido):**

- App → redireciona usuário
- Usuário autentica no provedor
- Provedor retorna authorization code
- Código é trocado por tokens no servidor
- "Nenhum token sensível trafega pela URL. Esse já é um diferencial desse fluxo."

**SLIDE 4 — PKCE (segurança contra interceptação):**

- Client gera code_verifier
- Envia apenas o code_challenge
- Servidor compara challenge + verifier
- Impede uso de um code roubado por interceptação
- "PKCE é o que impede que alguém capture o authorization code e logue como você."

**SLIDE 5 — State (proteção contra CSRF):**

- Valor aleatório enviado no início do login
- Deve voltar igual no callback
- Se não bater → rejeitar
- Previne CSRF em OAuth
- "Sem state, qualquer página pode iniciar um login OAuth em seu nome."

**SLIDE 6 — O que o Supabase já faz por você:**

- Usa Authorization Code Flow por padrão
- PKCE ativado automaticamente
- State ativado automaticamente
- Validação rígida de redirect URI
- Troca de código feita no backend do Supabase
- Cookies HttpOnly + Secure em produção
- "Essa é a razão pela qual a autenticação do Supabase é segura mesmo sem escrever uma linha de código."

**SLIDE 7 — O que ainda é sua responsabilidade:**

- Armazenamento seguro dos tokens
- Ciclo de vida do refresh token
- Token rotation
- Detecção e revogação de reuso
- Security logs
- Fingerprinting de dispositivos (opcional)
- "É isso que vamos construir no próximo vídeo e ao longo do módulo."

**[TEORIA]**

PKCE impede interceptação de authorization code. State previne CSRF. Trade-offs: complexidade maior, mas segurança significativamente superior. **Métrica:** validar que o servidor troca código apenas com challenge válido.

**Modificações de Código:** ❌ Nenhuma (apenas teoria com slides)

**Arquivos explorados:**

- `src/utils/supabase/middleware.js` - Ver como Supabase gerencia tokens
- `src/utils/supabase/client.js` - Ver configuração PKCE

---

#### 🎥 Vídeo 2.5: Refresh Token Security (20 min)

**Commit:** `video-2.5-refresh-token-security`

**[CONTEXTO]**

Agora que entendemos o fluxo OAuth inicial, precisamos proteger a parte mais sensível da sessão: refresh tokens. O Supabase usa refresh tokens para manter o usuário logado, mas para ficar seguro precisamos entender como eles funcionam e habilitar mecanismos adicionais como token rotation e detecção de reuso.

**[PROBLEMA]**

Se um refresh token vazar, o invasor gera tokens ilimitados. Sem token rotation, o servidor não detecta reuso.

**[SOLUÇÃO]**

A solução profissional é usar duas proteções combinadas:

1. **Token Rotation:** A cada uso do refresh token, o servidor gera um novo e invalida o anterior

   - Refresh token vira single-use
   - Se alguém tentar usar o antigo, é sinal de vazamento

2. **Detecção de Reuso:** Se um refresh token inválido aparecer:
   - Isso significa que alguém copiou o token
   - Precisamos revogar todas as sessões do usuário
   - Deixar logs explícitos do incidente
   - Impedir qualquer renovação até um login real

**Conteúdo:**

1. **Demonstração no Código (10 min)**

   - Criar `src/lib/tokenSecurity.js`
   - Implementar `detectTokenReuse()`
   - Modificar `src/utils/supabase/middleware.js`
   - Modificar `src/eventLogger.js`

2. **Testar ao vivo (5 min)**

   - Fazer login normal
   - Renovar token → funciona
   - Reutilizar o mesmo refresh token manualmente
   - Middleware detecta → bloqueia sessão
   - Log aparece: "TOKEN_REUSE_DETECTED"
   - Requer novo login

3. **Explicação teórica (5 min)**

   - Por que essa abordagem é a recomendada
   - Refresh tokens são a "chave-mestra" da sessão
   - Rotation reduz a janela de ataque
   - Reuso é prova matemática de que o token foi copiado
   - É o mecanismo usado por Google, Auth0, Supabase e Microsoft

**[TEORIA]**

**Defesa em profundidade:**

- Cada refresh token = descartável
- Tentar reaproveitar = evidência de ataque
- Resposta automática = segurança real

**Métrica de sucesso:** Nenhum refresh token no sistema pode ser usado duas vezes.

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/tokenSecurity.js` - Detecção de reuso

**Arquivos modificados:**

- `src/utils/supabase/middleware.js` - Interceptar refresh e detectar reuso
- `src/eventLogger.js` - Adicionar eventos de segurança

**Código a implementar:**

```javascript
// src/lib/tokenSecurity.js (CRIAR)
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

```javascript
// src/utils/supabase/middleware.js (MODIFICAR)
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(/*...*/);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // ✅ Adicionar log quando refresh token expira
  if (error?.code === "refresh_token_not_found") {
    logSecurityEvent({
      type: "REFRESH_TOKEN_EXPIRED",
      userId: user?.id,
      severity: "WARNING",
    });
  }

  // ✅ Log de token rotation (quando tokens são atualizados)
  if (user) {
    logEvent({
      step: "AUTH",
      operation: "TOKEN_REFRESH",
      userId: user.id,
    });
  }

  return supabaseResponse;
}
```

---

### **MÓDULO 3: Autorização - RBAC e ABAC (52 min, 4 vídeos)**

#### 🎥 Vídeo 3.1: Introdução à Autorização (10 min)

**Commit:** `video-3.1-intro-autorizacao`

**[CONTEXTO]**

Até agora, protegemos nossa aplicação contra XSS, CSRF e vazamento de tokens. Mas existe um problema grave ainda não resolvido: **qualquer usuário logado pode deletar qualquer post**. Não há verificação de permissões, apenas autenticação. Este módulo ensina como implementar controle de acesso adequado usando RBAC e ABAC.

**[PROBLEMA]**

A maioria das aplicações falha em autorização porque:

- Confunde **autenticação** (quem você é) com **autorização** (o que você pode fazer)
- Implementa apenas RBAC simples (roles fixas)
- Não considera atributos contextuais (ownership, tempo, localização)
- Mistura lógica de autorização com lógica de negócio
- Não tem hierarquia clara de permissões

**Exemplo real:** Um usuário comum consegue deletar posts de outros usuários porque só checamos se ele está logado, não se ele tem permissão.

**[SOLUÇÃO]**

Implementar uma estratégia híbrida: **RBAC + ABAC**

- **RBAC:** Para permissões baseadas em papéis (admin, moderador, usuário)
- **ABAC:** Para permissões baseadas em atributos (ownership, reportCount)
- **Hierarquia:** Admin > Moderador > Owner > Outros

**Conteúdo (10 min de slides + exemplos):**

**SLIDE 1 — Autenticação vs Autorização:**

- **Autenticação:** "Quem você é?" (login/senha, OAuth, biometria)
- **Autorização:** "O que você pode fazer?" (permissões, roles, policies)
- **Erro comum:** Checar apenas `if (user)` → Isso é autenticação, não autorização!

**SLIDE 2 — RBAC (Role-Based Access Control):**

- Baseado em **papéis/roles** (admin, moderador, usuário)
- Simples de implementar
- **Exemplo:** "Apenas admin pode deletar qualquer post"
- **Limitação:** Não considera contexto (ownership, atributos)

**SLIDE 3 — ABAC (Attribute-Based Access Control):**

- Baseado em **atributos** (authorId, reportCount, createdAt)
- Mais flexível e granular
- **Exemplo:** "Autor pode deletar seu próprio post"
- **Exemplo 2:** "Moderador pode deletar posts com 3+ reports"

**SLIDE 4 — Por que usar RBAC + ABAC juntos?**

- RBAC sozinho: Rígido demais, cria muitos roles
- ABAC sozinho: Complexo demais para casos simples
- **Híbrido:** Simplicidade + Flexibilidade

**SLIDE 5 — Hierarquia de Permissões (exemplo prático):**

```
Deletar Post:
├─ Admin: Pode deletar TUDO (RBAC)
├─ Moderador: Pode deletar se reportCount >= 3 (RBAC + ABAC)
├─ Autor: Pode deletar próprio post (ABAC - ownership)
└─ Outros: Não pode deletar (DENY)
```

**SLIDE 6 — O que vamos implementar:**

- Vídeo 3.2: RBAC básico (apenas admin)
- Vídeo 3.3: ABAC ownership (autor pode deletar próprio post)
- Vídeo 3.4: ABAC avançado (moderador + reportCount)

**[TEORIA]**

**OWASP Top 10: Broken Access Control** (#1 em 2021)

- 94% das aplicações testadas tinham alguma forma de broken access control
- **Métrica:** "Nenhuma ação sensível pode ser executada sem verificação de permissão"

**Defesa em profundidade:**

- Verificar permissões no backend (NUNCA confiar no frontend)
- Logar tentativas de acesso negado
- Separar lógica de autorização da lógica de negócio

**Modificações de Código:** ❌ Nenhuma (apenas teoria com slides)

---

#### 🎥 Vídeo 3.2: RBAC Básico - Protegendo Delete Post (12 min)

**Commit:** `video-3.2-rbac-basico`

**[CONTEXTO]**

No vídeo anterior, aprendemos a teoria de RBAC e ABAC. Agora vamos implementar a proteção mais básica: **RBAC puro**. Vamos adicionar uma coluna `role` no banco de dados e verificar se o usuário é admin antes de permitir a deleção de posts. Este é o primeiro passo para construir um sistema de autorização robusto.

**[PROBLEMA]**

Atualmente, o código em `src/actions/posts.js` tem a seguinte vulnerabilidade:

```javascript
// ⚠️ VULNERÁVEL: Qualquer usuário logado pode deletar qualquer post
export async function deletePost(postId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  // ❌ Não verifica se o usuário tem permissão!
  await db.from("Post").delete().eq("id", postId);
  revalidatePath("/");
  return { success: true };
}
```

**O que está errado:**

- Apenas verifica **autenticação** (se está logado)
- Não verifica **autorização** (se tem permissão)
- Qualquer usuário pode deletar posts de outros usuários

**[SOLUÇÃO]**

Implementar RBAC básico em 3 etapas:

1. **Adicionar coluna `role` no banco** (migration)
2. **Verificar role antes de deletar** (autorização)
3. **Testar com usuários admin e não-admin**

**Conteúdo:**

1. **Criar migration (3 min)**

   - Criar `supabase/migrations/002_add_role.sql`
   - Adicionar coluna `role` com default 'user'
   - Adicionar coluna `reportCount` (preparar para ABAC)
   - Promover usuário de teste para admin

2. **Implementar verificação RBAC (5 min)**

   - Modificar `src/actions/posts.js`
   - Buscar role do usuário no banco
   - Verificar se `role === 'admin'`
   - Lançar erro se não for admin

3. **Testar ao vivo (4 min)**

   - Login como usuário comum → tentar deletar → NEGADO ✅
   - Login como admin → deletar post → SUCESSO ✅
   - Verificar logs de erro

**[TEORIA]**

**RBAC (Role-Based Access Control):**

- Cada usuário tem um **papel** (role)
- Cada ação verifica o papel necessário
- Simples, mas inflexível (não considera ownership)

**Trade-offs:**

- ✅ **Vantagem:** Simples de implementar e entender
- ❌ **Limitação:** Não permite que autor delete próprio post (vamos resolver no próximo vídeo)

**Métrica de segurança:**

- "Apenas usuários com role 'admin' podem executar ações privilegiadas"

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `supabase/migrations/002_add_role.sql` - Adicionar roles

**Arquivos modificados:**

- `src/actions/posts.js` - Adicionar verificação RBAC

**Código a implementar:**

```sql
-- supabase/migrations/002_add_role.sql (CRIAR)
-- Adicionar coluna role com default 'user'
ALTER TABLE "User" ADD COLUMN role TEXT DEFAULT 'user';

-- Adicionar coluna reportCount (preparar para ABAC no vídeo 3.4)
ALTER TABLE "Post" ADD COLUMN reportCount INTEGER DEFAULT 0;

-- Promover usuário de teste para admin (ajustar o username)
UPDATE "User" SET role = 'admin' WHERE username = 'seu_usuario_aqui';

-- Criar índice para performance
CREATE INDEX idx_user_role ON "User"(role);
```

```javascript
// src/actions/posts.js (MODIFICAR)
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as database from "@/lib/database";

export async function deletePost(postId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  // Buscar dados do post
  const post = await database.getPostById(postId);
  if (!post) {
    throw new Error("Post não encontrado");
  }

  // Buscar dados do usuário (incluindo role)
  const dbUser = await database.getUserByUsername(user.email.split("@")[0]);

  // ✅ RBAC: Apenas admin pode deletar
  if (dbUser.role !== "admin") {
    throw new Error("Apenas administradores podem deletar posts");
  }

  // Deletar post
  const db = await createClient();
  await db.from("Post").delete().eq("id", postId);

  revalidatePath("/");
  return { success: true };
}
```

**Teste manual (demonstração ao vivo):**

```javascript
// 1. Login como usuário comum (role: 'user')
// 2. Tentar deletar post → Erro: "Apenas administradores podem deletar posts" ✅

// 3. Login como admin (role: 'admin')
// 4. Deletar post → Sucesso ✅
```

---

#### 🎥 Vídeo 3.3: ABAC - Adicionando Ownership (15 min)

**Commit:** `video-3.3-abac-ownership`

**[CONTEXTO]**

No vídeo anterior, implementamos RBAC básico: apenas admins podem deletar posts. Mas existe um problema: **autores não podem deletar seus próprios posts!** Isso não faz sentido do ponto de vista de UX. Neste vídeo, vamos adicionar **ABAC (Attribute-Based Access Control)** para permitir que autores deletem posts que criaram, introduzindo o conceito de **ownership**.

**[PROBLEMA]**

O código atual tem uma limitação crítica:

```javascript
// ❌ PROBLEMA: Autor não pode deletar próprio post
if (dbUser.role !== "admin") {
  throw new Error("Apenas administradores podem deletar posts");
}
```

**Cenário real:**

- Usuário comum cria um post
- Percebe que tem um erro de digitação
- Tenta deletar para corrigir
- **❌ NEGADO:** "Apenas administradores podem deletar posts"

Isso viola o princípio de UX: **"Usuários devem ter controle sobre conteúdo que criaram"**

**[SOLUÇÃO]**

Implementar **ABAC com ownership** e criar **hierarquia de permissões**:

1. **Admin pode deletar TUDO** (RBAC)
2. **Autor pode deletar PRÓPRIO post** (ABAC - ownership)
3. **Outros não podem deletar** (DENY)

**Conteúdo:**

1. **Explicar ownership (3 min)**

   - O que é ownership: `post.authorId === user.id`
   - Por que ownership é ABAC (baseado em atributo)
   - Diferença entre role (RBAC) e ownership (ABAC)

2. **Implementar hierarquia (7 min)**

   - Modificar `src/actions/posts.js`
   - Adicionar verificação de ownership
   - Criar hierarquia: Admin → Owner → Outros
   - Evitar duplicação de código (early return para admin)

3. **Testar 3 cenários (5 min)**

   - **Cenário 1:** Admin deleta post de outro usuário → SUCESSO ✅
   - **Cenário 2:** Autor deleta próprio post → SUCESSO ✅
   - **Cenário 3:** Usuário comum tenta deletar post de outro → NEGADO ✅

**[TEORIA]**

**ABAC (Attribute-Based Access Control):**

- Baseado em **atributos** do recurso (post.authorId)
- Comparado com **atributos** do usuário (user.id)
- Permite controle granular baseado em contexto

**Hierarquia de Permissões:**

```
deletar_post:
  IF role == 'admin' → ALLOW (RBAC)
  ELSE IF authorId == userId → ALLOW (ABAC ownership)
  ELSE → DENY
```

**Trade-offs:**

- ✅ **Vantagem:** Flexível, respeita ownership
- ✅ **Vantagem:** Melhor UX (autor controla próprio conteúdo)
- ⚠️ **Atenção:** Verificar ownership para TODAS as ações sensíveis

**Métrica de segurança:**

- "Apenas o autor ou admin podem modificar/deletar um recurso"

**Modificações de Código:** ✅ Sim

**Arquivos modificados:**

- `src/actions/posts.js` - Adicionar ABAC ownership

**Código a implementar:**

```javascript
// src/actions/posts.js (EVOLUIR)
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as database from "@/lib/database";

export async function deletePost(postId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  // Buscar dados do post
  const post = await database.getPostById(postId);
  if (!post) {
    throw new Error("Post não encontrado");
  }

  // Buscar dados do usuário (incluindo role)
  const dbUser = await database.getUserByUsername(user.email.split("@")[0]);

  // ✅ RBAC: Admin pode deletar TUDO (early return)
  if (dbUser.role === "admin") {
    const db = await createClient();
    await db.from("Post").delete().eq("id", postId);
    revalidatePath("/");
    return { success: true };
  }

  // ✅ ABAC: Autor pode deletar PRÓPRIO post (ownership)
  if (post.authorId === dbUser.id) {
    const db = await createClient();
    await db.from("Post").delete().eq("id", postId);
    revalidatePath("/");
    return { success: true };
  }

  // ❌ DENY: Nenhuma condição foi atendida
  throw new Error("Sem permissão para deletar este post");
}
```

**Teste manual (demonstração ao vivo):**

```javascript
// CENÁRIO 1: Admin deleta post de outro usuário
// 1. Login como admin
// 2. Tentar deletar post de outro usuário → SUCESSO ✅

// CENÁRIO 2: Autor deleta próprio post
// 1. Login como usuário comum (autor do post)
// 2. Tentar deletar próprio post → SUCESSO ✅

// CENÁRIO 3: Usuário tenta deletar post de outro
// 1. Login como usuário comum
// 2. Tentar deletar post de outro usuário → NEGADO ✅
// Erro: "Sem permissão para deletar este post"
```

**Explicação verbal (importante):**

```
Hierarquia de Permissões:
┌─────────────────────────────────────────┐
│ 1. ADMIN (role === 'admin')             │ → RBAC
│    └─ Pode deletar TUDO                 │
├─────────────────────────────────────────┤
│ 2. OWNER (authorId === userId)          │ → ABAC
│    └─ Pode deletar PRÓPRIO post         │
├─────────────────────────────────────────┤
│ 3. OUTROS                                │ → DENY
│    └─ Não pode deletar                  │
└─────────────────────────────────────────┘
```

---

#### 🎥 Vídeo 3.4: ABAC Avançado - Múltiplos Atributos (15 min)

**Commit:** `video-3.4-abac-avancado`

**[CONTEXTO]**

Até agora temos RBAC (admin) + ABAC simples (ownership). Mas e se quisermos criar um papel intermediário, como **moderador**, que pode deletar apenas posts problemáticos (com 3+ denúncias)? Isso requer **ABAC avançado com múltiplos atributos**: combinar `role` + `reportCount`. Além disso, vamos refatorar o código para criar uma **função reutilizável de autorização**, seguindo o padrão de separação de responsabilidades.

**[PROBLEMA]**

O código atual está crescendo e misturando lógicas:

```javascript
// ❌ PROBLEMA: Lógica de autorização misturada com lógica de negócio
export async function deletePost(postId) {
  // ... buscar dados ...
  
  // Múltiplas verificações inline
  if (dbUser.role === "admin") { /* deletar */ }
  if (post.authorId === dbUser.id) { /* deletar */ }
  
  // Como adicionar moderador aqui?
  // Como reutilizar essa lógica em outras ações (edit, publish, etc)?
}
```

**Problemas:**
- Difícil adicionar novos roles ou regras
- Impossível reutilizar lógica em outras funções
- Sem logs de autorização falha
- Difícil testar permissões isoladamente

**[SOLUÇÃO]**

1. **Criar função `canDeletePost()`** em `src/lib/authorization.js`
2. **Adicionar role "moderator"** com regra ABAC: `reportCount >= 3`
3. **Refatorar `deletePost()`** para usar a função
4. **Adicionar logs de segurança** (tentativas negadas)

**Conteúdo:**

1. **Criar função de autorização (5 min)**

   - Criar `src/lib/authorization.js`
   - Implementar `canDeletePost(user, post)`
   - Incluir todas as regras: Admin, Owner, Moderador
   - Retornar `true/false` (sem lançar erro)

2. **Adicionar role moderador (3 min)**

   - Atualizar migration para criar moderadores
   - Explicar regra: `role === 'moderator' AND reportCount >= 3`
   - Isso é RBAC + ABAC combinado

3. **Refatorar deletePost (4 min)**

   - Usar `canDeletePost()` em `src/actions/posts.js`
   - Adicionar log de falha de autorização
   - Adicionar log de sucesso

4. **Testar 4 cenários (3 min)**

   - Admin deleta qualquer post → SUCESSO ✅
   - Autor deleta próprio post → SUCESSO ✅
   - Moderador deleta post com 3+ reports → SUCESSO ✅
   - Moderador tenta deletar post com 2 reports → NEGADO ✅

**[TEORIA]**

**ABAC com múltiplos atributos:**
```
IF role == 'moderator' AND reportCount >= 3 → ALLOW
```

Aqui usamos **dois atributos**:
- `role` (do usuário)
- `reportCount` (do post)

Isso é mais poderoso que RBAC puro porque considera **contexto do recurso**.

**Separação de responsabilidades:**
- `authorization.js` → Decide "PODE ou NÃO PODE"
- `posts.js` → Executa ação SE autorizado
- Benefícios: Testável, reutilizável, manutenível

**Hierarquia final:**
```
deletar_post:
  IF role == 'admin' → ALLOW (RBAC)
  ELSE IF authorId == userId → ALLOW (ABAC ownership)
  ELSE IF role == 'moderator' AND reportCount >= 3 → ALLOW (RBAC + ABAC)
  ELSE → DENY
```

**Métrica de segurança:**
- "Toda tentativa de autorização negada deve ser logada"
- "Lógica de autorização deve ser isolada e testável"

**Modificações de Código:** ✅ Sim

**Arquivos criados:**

- `src/lib/authorization.js` - Funções de autorização reutilizáveis

**Arquivos modificados:**

- `src/actions/posts.js` - Refatorar com função + logs
- `supabase/migrations/002_add_role.sql` - Adicionar moderadores (UPDATE)

**Código a implementar:**

```javascript
// src/lib/authorization.js (CRIAR)
/**
 * Verifica se um usuário pode deletar um post
 * @param {Object} user - Usuário com role e id
 * @param {Object} post - Post com authorId e reportCount
 * @returns {boolean} - true se autorizado, false caso contrário
 */
export function canDeletePost(user, post) {
  // RBAC: Admin pode deletar TUDO
  if (user.role === "admin") {
    return true;
  }

  // ABAC: Ownership - Autor pode deletar próprio post
  if (post.authorId === user.id) {
    return true;
  }

  // RBAC + ABAC: Moderador pode deletar posts com 3+ denúncias
  if (user.role === "moderator" && post.reportCount >= 3) {
    return true;
  }

  // DENY: Nenhuma condição foi atendida
  return false;
}

/**
 * Retorna uma mensagem de erro específica baseada no contexto
 */
export function getAuthorizationError(user, post, action) {
  if (action === "delete") {
    if (user.role === "moderator") {
      return `Moderadores só podem deletar posts com 3+ denúncias (este tem ${post.reportCount})`;
    }
    return "Você não tem permissão para deletar este post";
  }
  return "Ação não autorizada";
}
```

```javascript
// src/actions/posts.js (REFATORAR)
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as database from "@/lib/database";
import { canDeletePost, getAuthorizationError } from "@/lib/authorization";
import { logEvent, logSecurityEvent } from "@/eventLogger";

export async function deletePost(postId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  // Buscar dados do post
  const post = await database.getPostById(postId);
  if (!post) {
    throw new Error("Post não encontrado");
  }

  // Buscar dados do usuário (incluindo role)
  const dbUser = await database.getUserByUsername(user.email.split("@")[0]);

  // ✅ Usar função de autorização isolada
  const canDelete = canDeletePost(dbUser, post);

  if (!canDelete) {
    // ✅ Logar falha de autorização
    logSecurityEvent({
      type: "AUTHORIZATION_FAILED",
      userId: dbUser.id,
      resource: "post",
      resourceId: postId,
      action: "delete",
      reason: "insufficient_permissions",
      metadata: {
        userRole: dbUser.role,
        postAuthorId: post.authorId,
        reportCount: post.reportCount,
      },
    });

    // Retornar mensagem de erro específica
    throw new Error(getAuthorizationError(dbUser, post, "delete"));
  }

  // Deletar post
  const db = await createClient();
  await db.from("Post").delete().eq("id", postId);
  revalidatePath("/");

  // ✅ Logar sucesso da operação
  logEvent({
    step: "AUTHORIZATION",
    operation: "POST_DELETED",
    userId: dbUser.id,
    metadata: {
      postId,
      userRole: dbUser.role,
      reason: dbUser.role === "admin"
        ? "admin_privileges"
        : post.authorId === dbUser.id
        ? "ownership"
        : "moderator_report_threshold",
    },
  });

  return { success: true };
}
```

```sql
-- supabase/migrations/002_add_role.sql (ATUALIZAR)
-- Adicionar alguns moderadores para teste
UPDATE "User" SET role = 'moderator' 
WHERE username IN ('moderador1', 'moderador2');

-- Adicionar alguns posts com reports para teste
UPDATE "Post" SET reportCount = 5 
WHERE id IN (1, 2);

UPDATE "Post" SET reportCount = 2 
WHERE id IN (3, 4);
```

**Teste manual (demonstração ao vivo):**

```javascript
// CENÁRIO 1: Admin deleta qualquer post
// → SUCESSO ✅

// CENÁRIO 2: Autor deleta próprio post
// → SUCESSO ✅

// CENÁRIO 3: Moderador deleta post com 5 reports
// → SUCESSO ✅
// Log: reason = "moderator_report_threshold"

// CENÁRIO 4: Moderador tenta deletar post com 2 reports
// → NEGADO ✅
// Erro: "Moderadores só podem deletar posts com 3+ denúncias (este tem 2)"
// Log: type = "AUTHORIZATION_FAILED"

// CENÁRIO 5: Usuário comum tenta deletar post de outro
// → NEGADO ✅
// Erro: "Você não tem permissão para deletar este post"
```

**Explicação verbal (importante):**

```
Hierarquia Final:
┌──────────────────────────────────────────────┐
│ 1. ADMIN (role === 'admin')                  │ → RBAC puro
│    └─ Pode deletar TUDO                      │
├──────────────────────────────────────────────┤
│ 2. OWNER (authorId === userId)               │ → ABAC ownership
│    └─ Pode deletar PRÓPRIO post              │
├──────────────────────────────────────────────┤
│ 3. MODERATOR (role + reportCount >= 3)       │ → RBAC + ABAC
│    └─ Pode deletar posts denunciados         │
├──────────────────────────────────────────────┤
│ 4. OUTROS                                     │ → DENY
│    └─ Não pode deletar                       │
└──────────────────────────────────────────────┘

Benefícios da refatoração:
✅ Lógica isolada em authorization.js
✅ Reutilizável em outras actions
✅ Testável isoladamente
✅ Logs completos de segurança
✅ Mensagens de erro específicas
```

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
MÓDULO 1: Fundamentos e Proteção (52 min, 7 vídeos)
  ├─ Fundamentos (3 vídeos)
  │  ├─ 1.1: Estrutura do Projeto (10 min)
  │  ├─ 1.2: OWASP e Auditoria (12 min)
  │  └─ 1.3: Os 3 Pilares (10 min)
  ├─ XSS (2 vídeos)
  │  ├─ 1.4: XSS Parte 1 - Ataque (12 min)
  │  └─ 1.5: XSS Parte 2 - Proteção (15 min)
  └─ CSRF (2 vídeos)
      ├─ 1.6: CSRF Parte 1 - Ataque (12 min)
      └─ 1.7: CSRF Parte 2 - Proteção (13 min)

MÓDULO 2: OAuth e Tokens (67 min, 5 vídeos)
  ├─ Token Leaks (1 vídeo)
  │  └─ 2.1: Tokens Inseguros - Demonstração (12 min)
  ├─ Reset Password Seguro (2 vídeos)
  │  ├─ 2.2: Migrar ForgotPassword (10 min)
  │  └─ 2.3: Migrar ResetPassword + Limpeza (12 min)
  ├─ OAuth (1 vídeo)
  │  └─ 2.4: OAuth 2.0 e PKCE (13 min)
  └─ Refresh Token (1 vídeo)
      └─ 2.5: Refresh Token Security (20 min)

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
- **Total de Vídeos**: 26
- **Duração Total**: ~4h 11min
- **Commits Esperados**: ~20 (com código)
- **Arquivos Novos**: ~36+
- **Arquivos Modificados**: ~21+
- **Arquivos Deletados**: 1 (passwordReset.js)

---

## 🎯 Alinhamento com a Ementa

### ✅ Proteção contra XSS, CSRF e vazamento de tokens

- **Módulo 1**: XSS e CSRF (4 vídeos: 1.4 a 1.7)
- **Módulo 2**: Vazamento de tokens (3 vídeos: 2.1, 2.2 e 2.3)
  - 2.1: Demonstração de tokens inseguros
  - 2.2 e 2.3: Migração para Supabase Auth nativo
- Implementação prática de todas as proteções

### ✅ OAuth e fluxos com refresh token seguro

- **Módulo 2**: 100% focado neste tópico
- 5 vídeos dedicados (2.1 a 2.5)
- Tokens inseguros: demonstração real (2.1)
- Reset password seguro com Supabase Auth (2.2 e 2.3)
- OAuth 2.0 e PKCE (2.4)
- Refresh token rotation e detecção de reuso (2.5)

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

## 📖 Conteúdo Complementar (Para Saber Mais)

### 🔐 Token Binding (Avançado)

**Por que não está no curso:**

- Muito específico e complexo para um curso introdutório
- Requer infraestrutura adicional (device fingerprinting, tabelas de binding)
- Maioria das aplicações não precisa desse nível de segurança
- Supabase já implementa proteções suficientes

**O que é:**
Token Binding vincula um token de autenticação a um dispositivo específico usando fingerprinting (user agent, IP, canvas fingerprint, etc). Se o token for roubado e usado de outro dispositivo, é detectado e bloqueado.

**Quando usar:**

- Aplicações de alta segurança (bancos, governo)
- Compliance rigoroso (PCI-DSS Level 1)
- Ambientes onde device hijacking é preocupação real

**Recursos para aprender mais:**

- [RFC 8473 - Token Binding over HTTP](https://datatracker.ietf.org/doc/html/rfc8473)
- [OWASP - Token Binding](https://cheatsheetseries.owasp.org/cheatsheets/Token_Binding_Cheat_Sheet.html)
- [FingerprintJS](https://fingerprintjs.com/) - Library de device fingerprinting

**Tradeoffs:**

- ✅ Segurança adicional contra roubo de tokens
- ❌ Complexidade de implementação
- ❌ Falsos positivos (VPN, viagens, dispositivos compartilhados)
- ❌ Privacidade (fingerprinting pode ser invasivo)

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
