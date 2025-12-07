# 🔒 AULA 5: SECURITY HEADERS (Estrutura Final)

## ⚠️ **DECISÃO DO PROJETO: SEM CORS**

**Contexto:**
- A aplicação **NÃO aceita requests cross-origin**
- Frontend e backend na mesma origem (Next.js full-stack)
- Server Actions (não API Routes externas)
- **CORS NÃO É NECESSÁRIO** para este projeto

**Impacto na Aula:**
- ✅ Simplifica drasticamente
- ✅ Remove complexidade de CORS/preflight
- ✅ Foco nos headers essenciais
- ✅ Menos tempo, mais valor
- ✅ CORS vira "Saber Mais" teórico (5 min)

---

## 🎯 **ESTRUTURA FINAL DA AULA 5:**

### **📺 VÍDEO 5.1 — Security Headers no `next.config.js` (12 min)** 🔥

**Objetivo:** Implementar headers essenciais de forma simples e estática.

**Implementação:**

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // 🔥🔥🔥🔥🔥 ESSENCIAL: Anti-Clickjacking
          // Impede que o site seja colocado em iframe malicioso
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // 🔥🔥🔥🔥🔥 ESSENCIAL: Anti-MIME Sniffing
          // Força o navegador a respeitar o Content-Type declarado
          // Previne que imagens sejam interpretadas como scripts
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // 🔥🔥🔥🔥 IMPORTANTE: Controle de Referer
          // Evita vazamento de URLs com tokens/parâmetros sensíveis
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // 🔥🔥🔥 ÚTIL: Bloqueia APIs sensíveis do navegador
          // Desabilita câmera, microfone, geolocalização
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // 🔥 LEGADO: XSS Protection (browsers antigos)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // 🔥🔥🔥🔥🔥 ESSENCIAL: HTTPS Only (PRODUÇÃO)
          // ⚠️ Só descomentar em PRODUÇÃO com HTTPS configurado!
          // ...(process.env.NODE_ENV === "production"
          //   ? [
          //       {
          //         key: "Strict-Transport-Security",
          //         value: "max-age=31536000; includeSubDomains; preload",
          //       },
          //     ]
          //   : []),
        ],
      },
    ];
  },
};
```

**Roteiro do Vídeo:**

1. **Intro (1 min):**
   - O que são security headers
   - Por que são importantes (defesa em profundidade)

2. **X-Frame-Options (2 min):**
   - O que é clickjacking
   - Demo: Site em iframe (sem header)
   - Adicionar header
   - Testar: iframe bloqueado

3. **X-Content-Type-Options (2 min):**
   - O que é MIME sniffing
   - Risco: navegador interpreta imagem como script
   - Adicionar header

4. **Referrer-Policy (2 min):**
   - Mostrar Referer vazando URL completa
   - Risco: token no query string vaza
   - Adicionar header
   - Testar: referer sanitizado

5. **Permissions-Policy (2 min):**
   - Mostrar site pedindo acesso à câmera
   - Adicionar header
   - Testar: acesso bloqueado

6. **HSTS (2 min):**
   - Por que forçar HTTPS
   - ⚠️ CUIDADO: só em produção!
   - Mostrar condicional NODE_ENV

7. **Testar (1 min):**
   - Abrir https://securityheaders.com
   - Inserir URL
   - Mostrar score: **B** (falta CSP)

**Resultado Esperado:**
```
securityheaders.com → Score: B
Missing: Content-Security-Policy
```

---

### **📺 VÍDEO 5.2 — CSP com Nonce (15 min)** 🔥🔥🔥🔥🔥 **ESSENCIAL!**

**Objetivo:** Implementar CSP com nonce dinâmico para prevenir XSS.

**Por que CSP é essencial?**
- Última linha de defesa contra XSS
- Mesmo com sanitização, pode haver bypasses
- CSP bloqueia scripts não autorizados no navegador

**Implementação:**

**1. Criar `src/lib/csp.js`:**

```javascript
/**
 * 🔒 CONTENT SECURITY POLICY (CSP)
 * Última linha de defesa contra XSS
 */

export function generateNonce() {
  return crypto.randomUUID();
}

export function getCSPHeader(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'", // CSS-in-JS precisa de unsafe-inline
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co", // API do Supabase
    "font-src 'self'",
    "frame-ancestors 'none'", // Reforça X-Frame-Options
    "form-action 'self'",
    "base-uri 'self'",
  ].join("; ");
}
```

**2. Atualizar `middleware.js`:**

```javascript
import { NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { generateNonce, getCSPHeader } from "./src/lib/csp";

export async function middleware(request) {
  // 1. Atualizar sessão Supabase
  let response = await updateSession(request);

  // 2. Gerar nonce único para este request
  const nonce = generateNonce();

  // 3. Adicionar CSP com nonce
  response.headers.set("Content-Security-Policy", getCSPHeader(nonce));
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**3. Usar nonce em scripts (exemplo):**

```javascript
// src/app/layout.js
import { headers } from "next/headers";

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce");

  return (
    <html>
      <head>
        {/* Script com nonce - PERMITIDO */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `
          console.log('Script autorizado com nonce!');
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Roteiro do Vídeo:**

1. **Intro (2 min):**
   - Por que CSP é a última linha de defesa
   - O que é nonce (number used once)

2. **Problema (2 min):**
   - Mostrar XSS executando (assumindo bypass de sanitização)
   - `<script>alert('XSS')</script>` → Executa ❌

3. **Implementar CSP (5 min):**
   - Criar `src/lib/csp.js`
   - Adicionar no middleware
   - Gerar nonce por request
   - Passar nonce via header `x-nonce`

4. **Testar (3 min):**
   - Script SEM nonce → **BLOQUEADO** ✅
   - Script COM nonce → **EXECUTA** ✅
   - Mostrar erro no console:
     ```
     Refused to execute inline script because it violates the following 
     Content Security Policy directive: "script-src 'self' 'nonce-abc123'".
     ```

5. **Explicar diretivas (2 min):**
   - `default-src 'self'` → Bloqueia tudo externo
   - `script-src 'nonce-...'` → Só scripts com nonce
   - `connect-src` → APIs permitidas (Supabase)
   - `frame-ancestors 'none'` → Reforça anti-clickjacking

6. **Testar Score (1 min):**
   - Abrir https://securityheaders.com
   - Mostrar score: **A+** ✅

**Resultado Esperado:**
```
securityheaders.com → Score: A+
✅ Content-Security-Policy
✅ X-Frame-Options
✅ X-Content-Type-Options
✅ Referrer-Policy
✅ Permissions-Policy
```

---

### **📺 VÍDEO 5.3 — CORS (SABER MAIS / OPCIONAL)** ⚠️ (5 min)

**Objetivo:** Explicar CORS teoricamente, mas deixar claro que não é necessário.

**Roteiro:**

1. **Contexto (1 min):**
   - Neste projeto, não usamos CORS
   - Frontend e backend na mesma origem
   - Server Actions (não API Routes externas)

2. **Teoria (3 min):**
   - O que é Same-Origin Policy
   - Quando CORS seria necessário:
     - Frontend separado (React app em outro domínio)
     - API pública
     - Microserviços
   - Como funciona preflight (OPTIONS)

3. **Quando implementar (1 min):**
   - Se criar API pública no futuro
   - Se separar frontend do backend
   - Referência: [Next.js CORS docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)

**⚠️ NÃO IMPLEMENTAR CORS NO PROJETO**

---

## 📊 **COMPARAÇÃO: Antes vs Depois**

| Aspecto                  | Proposta Original            | Estrutura Final (SEM CORS)  |
| ------------------------ | ---------------------------- | --------------------------- |
| **Vídeo 5.1**            | CORS Teoria (12 min)         | Security Headers (12 min)   |
| **Vídeo 5.2**            | CORS Implementação (12 min)  | CSP com Nonce (15 min) 🔥   |
| **Vídeo 5.3**            | CSP (15 min)                 | CORS Teoria (5 min) ⚠️      |
| **Vídeo 5.4**            | Outros Headers (10 min)      | ❌ Removido (tudo no 5.1)   |
| **Complexidade**         | Alta (middleware CORS)       | Baixa (só CSP no middleware)|
| **Tempo Total**          | 49 min                       | 32 min                      |
| **Foco**                 | CORS > CSP                   | CSP > Headers Essenciais 🔥 |
| **Score Final**          | A+                           | A+ ✅                       |
| **Valor Educacional**    | Médio (CORS complexo)        | Alto (foca no essencial)    |

---

## 🔥 **BENEFÍCIOS DA NOVA ESTRUTURA:**

### ✅ **Mais Simples:**
- Sem CORS = Sem middleware complexo
- Sem validação de origin
- Sem tratamento de preflight

### ✅ **Mais Rápido:**
- 32 min vs 49 min (35% mais rápido)
- Menos configuração
- Direto ao ponto

### ✅ **Mais Relevante:**
- CSP é CRÍTICO (previne XSS)
- CORS não é usado no projeto
- Foco no que importa

### ✅ **Melhor Fluxo:**
1. Headers estáticos (fácil) → Score B
2. CSP dinâmico (essencial) → Score A+
3. CORS teórico (opcional) → Conhecimento extra

---

## 📝 **CHECKLIST DE IMPLEMENTAÇÃO:**

### **Vídeo 5.1: Security Headers**
- [ ] Criar/atualizar `next.config.js`
- [ ] Adicionar X-Frame-Options
- [ ] Adicionar X-Content-Type-Options
- [ ] Adicionar Referrer-Policy
- [ ] Adicionar Permissions-Policy
- [ ] Adicionar X-XSS-Protection
- [ ] Comentar HSTS (produção only)
- [ ] Testar em securityheaders.com → Score B

### **Vídeo 5.2: CSP com Nonce**
- [ ] Criar `src/lib/csp.js`
- [ ] Implementar `generateNonce()`
- [ ] Implementar `getCSPHeader(nonce)`
- [ ] Atualizar `middleware.js`
- [ ] Gerar nonce por request
- [ ] Adicionar header `Content-Security-Policy`
- [ ] Adicionar header `x-nonce`
- [ ] Testar script sem nonce → Bloqueado
- [ ] Testar script com nonce → Executa
- [ ] Testar em securityheaders.com → Score A+

### **Vídeo 5.3: CORS Teoria (Opcional)**
- [ ] Explicar Same-Origin Policy
- [ ] Explicar quando CORS é necessário
- [ ] Mostrar exemplo de configuração (sem implementar)
- [ ] Referenciar docs oficiais

---

## 🎯 **MÉTRICAS DE SUCESSO:**

### **Após Vídeo 5.1:**
```bash
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: camera=(), microphone=()
❌ Content-Security-Policy: MISSING

Score: B
```

### **Após Vídeo 5.2:**
```bash
✅ Content-Security-Policy: Implemented with nonce
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: camera=(), microphone=()

Score: A+ 🎉
```

---

## 💡 **DICAS PARA O VÍDEO:**

### **Vídeo 5.1:**
- Mostrar cada header no DevTools (Network → Headers)
- Testar clickjacking ao vivo (iframe bloqueado)
- Mostrar score B no securityheaders.com (suspense para próximo vídeo)

### **Vídeo 5.2:**
- Demonstrar XSS sendo BLOQUEADO por CSP (impactante!)
- Mostrar erro no console (visual)
- Revelar score A+ no final (payoff!)

### **Vídeo 5.3:**
- Ser breve (5 min máximo)
- Deixar claro: "Não vamos usar, mas é bom saber"
- Referenciar docs para quem precisar

---

## 🎬 **SCRIPTS PRONTOS:**

### **Intro Vídeo 5.1:**
```
"Até agora protegemos nossa app contra XSS, CSRF, e broken access control.
Mas ainda falta uma camada: os SECURITY HEADERS.

São headers HTTP que o navegador respeita e que adicionam camadas extras 
de proteção. E o melhor: são super fáceis de implementar no Next.js!

Neste vídeo, vamos configurar 5 headers essenciais em menos de 10 linhas 
de código. Vamos lá!"
```

### **Intro Vídeo 5.2:**
```
"No vídeo anterior, configuramos vários security headers e chegamos no 
score B no securityheaders.com. Mas ainda falta o MAIS IMPORTANTE: 
o Content-Security-Policy.

O CSP é a ÚLTIMA LINHA DE DEFESA contra XSS. Mesmo que um atacante 
consiga injetar um script malicioso, o CSP vai BLOQUEAR a execução!

E neste vídeo, vamos implementar CSP com nonce dinâmico. Vamos ver isso 
funcionando ao vivo!"
```

### **Intro Vídeo 5.3:**
```
"Você provavelmente já ouviu falar de CORS. Neste projeto, NÃO vamos usar, 
porque nosso frontend e backend estão na mesma origem (Next.js full-stack).

Mas é importante entender O QUE é CORS e QUANDO você precisaria dele. 
Então vamos fazer um overview rápido de 5 minutos!"
```

---

## ✅ **ARQUIVOS PARA CRIAR/MODIFICAR:**

### **1. `next.config.js`** (Vídeo 5.1)
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};
```

### **2. `src/lib/csp.js`** (Vídeo 5.2)
```javascript
export function generateNonce() {
  return crypto.randomUUID();
}

export function getCSPHeader(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co",
    "font-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join("; ");
}
```

### **3. `middleware.js`** (Vídeo 5.2)
```javascript
import { generateNonce, getCSPHeader } from "./src/lib/csp";

export async function middleware(request) {
  let response = await updateSession(request);
  
  const nonce = generateNonce();
  response.headers.set("Content-Security-Policy", getCSPHeader(nonce));
  response.headers.set("x-nonce", nonce);
  
  return response;
}
```

---

## 🎓 **LEARNING OBJECTIVES:**

### **Após Aula 5, o aluno deve saber:**

1. ✅ O que são security headers e por que são importantes
2. ✅ Como configurar headers estáticos no `next.config.js`
3. ✅ O que cada header faz:
   - X-Frame-Options (anti-clickjacking)
   - X-Content-Type-Options (anti-MIME sniffing)
   - Referrer-Policy (previne vazamento de URL)
   - Permissions-Policy (bloqueia APIs sensíveis)
   - Strict-Transport-Security (force HTTPS)
4. ✅ O que é Content-Security-Policy (CSP)
5. ✅ Como implementar CSP com nonce dinâmico
6. ✅ Como gerar nonce por request no middleware
7. ✅ Como passar nonce para componentes React
8. ✅ Como testar security headers (securityheaders.com)
9. ✅ Atingir score A+ em security headers
10. ⚠️ (Opcional) O que é CORS e quando é necessário

---

## 🔗 **REFERÊNCIAS:**

- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Security Headers Checker](https://securityheaders.com)
- [MDN: Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

---

**RESUMO: Sem CORS, a aula fica 35% mais curta, mais focada e mais prática!** 🎯✨

