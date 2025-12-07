# 🎬 AULA 5: CORS E SECURITY HEADERS

## 📊 ESTRUTURA DA AULA:

| Vídeo | Formato | Título | Duração | Conteúdo |
|-------|---------|--------|---------|----------|
| **5.1** | 📊 **SLIDES** | CORS: Teoria e Same-Origin Policy | 12 min | Conceitos teóricos |
| **5.2** | 📊 **SLIDES** | CORS: Por que não usamos neste projeto | 8 min | Contexto e arquitetura |
| **5.3** | 💻 **CÓDIGO** | Security Headers no `next.config.js` | 12 min | Implementação prática |
| **5.4** | 💻 **CÓDIGO** | CSP com Nonce (Middleware) | 15 min | Implementação prática |
| **TOTAL** | | | **47 min** | |

---

# 📊 VÍDEO 5.1 — CORS: TEORIA E SAME-ORIGIN POLICY (12 min)

**Formato:** Slides + Demos visuais no navegador

---

## 🎯 OBJETIVO:
Explicar Same-Origin Policy e CORS de forma clara e conceitual, preparando o terreno para entender quando é necessário.

---

## 📝 ROTEIRO DO VÍDEO:

### **INTRO (1 min)**

**Fala:**
> "Antes de continuar com security headers, precisamos entender um conceito FUNDAMENTAL da segurança web: CORS e Same-Origin Policy. 
>
> Esse é um dos tópicos que mais confunde desenvolvedores, mas vou explicar de forma bem clara. E no próximo vídeo, você vai entender por que NESTE projeto específico não vamos usar CORS."

---

## 📊 SLIDE 1: SAME-ORIGIN POLICY (SOP)

### **Título:** "Same-Origin Policy: A Regra Fundamental"

### **Conteúdo:**

**O que é:**
- Regra de segurança implementada por TODOS os navegadores
- Impede que páginas de origens diferentes acessem dados umas das outras

**Origem = Protocolo + Domínio + Porta**

### **Exemplos:**

```
✅ MESMA ORIGEM:
https://meuapp.com/home
https://meuapp.com/api/posts
→ Protocolo: https ✓
→ Domínio: meuapp.com ✓
→ Porta: 443 (padrão) ✓

❌ ORIGENS DIFERENTES:
https://meuapp.com      ← HTTPS, porta 443
http://meuapp.com       ← HTTP, porta 80
→ Protocolo diferente!

https://meuapp.com      ← Domínio: meuapp.com
https://api.meuapp.com  ← Domínio: api.meuapp.com
→ Subdomínio diferente!

https://meuapp.com:443  ← Porta 443
https://meuapp.com:3000 ← Porta 3000
→ Porta diferente!
```

**Regra:**
> Se QUALQUER parte (protocolo, domínio ou porta) for diferente → **ORIGENS DIFERENTES**

---

## 📊 SLIDE 2: POR QUE SOP EXISTE?

### **Título:** "Same-Origin Policy: Proteção contra leitura de dados"

### **Cenário SEM Same-Origin Policy:**

```
1. Você está logado no seu banco: https://banco.com
2. Você abre uma aba maliciosa: https://site-malicioso.com
3. Site malicioso faz request para: https://banco.com/api/saldo
4. ❌ SEM SOP: Site malicioso LÊ seu saldo! 💸
```

### **Cenário COM Same-Origin Policy:**

```
1. Você está logado no seu banco: https://banco.com
2. Você abre uma aba maliciosa: https://site-malicioso.com
3. Site malicioso tenta request para: https://banco.com/api/saldo
4. ✅ COM SOP: Navegador BLOQUEIA a leitura da resposta! 🛡️
```

### **Importante:**

**SOP NÃO bloqueia o REQUEST, bloqueia a LEITURA da resposta!**

- O servidor recebe o request e processa normalmente
- Mas o JavaScript do site malicioso não consegue ler a resposta
- Navegador mostra erro no console

---

## 📊 SLIDE 3: O QUE É CORS?

### **Título:** "CORS: Relaxando a Same-Origin Policy"

### **Definição:**
**CORS** = Cross-Origin Resource Sharing
- Mecanismo que permite **relaxar** a Same-Origin Policy
- Servidor **explicitamente autoriza** quem pode acessá-lo

### **Como funciona:**

```
Navegador:
"Ei servidor, o site https://frontend.com quer acessar você.
 Pode deixar?"

Servidor:
"Sim, pode! Vou enviar o header:"
Access-Control-Allow-Origin: https://frontend.com

Navegador:
"Ok, então vou liberar a resposta para o frontend!"
```

### **Headers CORS principais:**

```http
Access-Control-Allow-Origin: https://meuapp.com
→ Quem pode acessar

Access-Control-Allow-Methods: GET, POST, DELETE
→ Quais métodos são permitidos

Access-Control-Allow-Headers: Content-Type, Authorization
→ Quais headers são permitidos

Access-Control-Allow-Credentials: true
→ Pode enviar cookies?
```

---

## 📊 SLIDE 4: SIMPLE REQUEST VS PREFLIGHT

### **Título:** "Dois tipos de requests CORS"

### **1. Simple Request (Simples)**

**Não precisa de preflight (OPTIONS)**

**Condições:**
```
✅ Método: GET, HEAD ou POST
✅ Headers: Apenas Accept, Accept-Language, Content-Language, Content-Type
✅ Content-Type: application/x-www-form-urlencoded, multipart/form-data, text/plain
```

**Fluxo:**
```
1. Navegador envia request direto
2. Servidor responde com headers CORS
3. Navegador valida e libera resposta
```

---

### **2. Preflight Request (Com verificação prévia)**

**Precisa de preflight (OPTIONS) antes do request real**

**Quando acontece:**
```
❌ Método: PUT, DELETE, PATCH
❌ Headers customizados: Authorization, X-Custom-Header
❌ Content-Type: application/json
```

**Fluxo:**
```
1. Navegador envia OPTIONS (preflight)
   ├── Origin: https://frontend.com
   ├── Access-Control-Request-Method: DELETE
   └── Access-Control-Request-Headers: Authorization

2. Servidor responde:
   ├── Access-Control-Allow-Origin: https://frontend.com
   ├── Access-Control-Allow-Methods: GET, POST, DELETE
   └── Access-Control-Allow-Headers: Authorization

3. Navegador valida
4. Se OK, envia o request REAL (DELETE)
5. Servidor responde com dados
```

---

## 📊 SLIDE 5: CREDENTIALS (COOKIES CROSS-ORIGIN)

### **Título:** "Enviando cookies entre origens diferentes"

### **Problema:**
Por padrão, cookies **NÃO são enviados** em requests cross-origin.

### **Solução: Credentials**

**3 requisitos OBRIGATÓRIOS:**

**1. Servidor:**
```http
Access-Control-Allow-Origin: https://frontend.com
→ ⚠️ NÃO pode ser "*" (wildcard)

Access-Control-Allow-Credentials: true
→ Autoriza envio de cookies
```

**2. Frontend:**
```javascript
fetch('https://api.backend.com/data', {
  credentials: 'include'  // ← Envia cookies
})
```

**3. Cookie:**
```http
Set-Cookie: session=abc123; SameSite=None; Secure
→ SameSite=None (permite cross-site)
→ Secure (HTTPS obrigatório)
```

### **⚠️ IMPORTANTE:**

```
❌ PROIBIDO PELO NAVEGADOR:
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

→ Navegador bloqueia automaticamente!
→ Origem precisa ser ESPECÍFICA
```

---

## 📊 SLIDE 6: FLUXO COMPLETO DE UM REQUEST CORS

### **Título:** "Preflight + Request Real: Passo a passo"

### **Cenário:**
```
Frontend: https://meuapp.com
Backend:  https://api.meuapp.com
```

### **Passo a Passo:**

```
1️⃣ Navegador detecta origem diferente
   └── meuapp.com ≠ api.meuapp.com

2️⃣ Navegador avalia se precisa de preflight
   └── Método DELETE? Sim! → Precisa de preflight

3️⃣ Navegador envia OPTIONS (preflight)
   OPTIONS https://api.meuapp.com/posts/123
   Origin: https://meuapp.com
   Access-Control-Request-Method: DELETE

4️⃣ Servidor responde ao preflight
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: https://meuapp.com
   Access-Control-Allow-Methods: DELETE
   Access-Control-Max-Age: 86400

5️⃣ Navegador valida resposta
   ✅ Origin permitida? Sim
   ✅ Método permitido? Sim
   ✅ OK para enviar request real!

6️⃣ Navegador envia request REAL
   DELETE https://api.meuapp.com/posts/123
   Origin: https://meuapp.com

7️⃣ Servidor responde com dados
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: https://meuapp.com
   { "success": true }

8️⃣ Navegador libera resposta para o JavaScript
```

---

## 📊 SLIDE 7: CONFIGURAÇÕES PERIGOSAS (EVITAR!)

### **Título:** "CORS: O que NÃO fazer"

### **❌ 1. Allow-Origin: * (Wildcard)**

```javascript
// ❌ PERIGOSO!
Access-Control-Allow-Origin: *
```

**Problema:**
- Qualquer site pode acessar sua API
- Broken Access Control
- Facilita ataques

**Quando usar:** Apenas em APIs **públicas** sem autenticação

---

### **❌ 2. Refletir origin sem validação**

```javascript
// ❌ PERIGOSO!
const origin = request.headers.get('origin');
response.headers.set('Access-Control-Allow-Origin', origin);
```

**Problema:**
- Aceita QUALQUER origem
- Equivalente a `*`
- Sem controle de acesso

**Solução:**
```javascript
// ✅ CORRETO!
const allowedOrigins = ['https://meuapp.com', 'https://admin.meuapp.com'];
if (allowedOrigins.includes(origin)) {
  response.headers.set('Access-Control-Allow-Origin', origin);
}
```

---

### **❌ 3. Não tratar OPTIONS (preflight)**

```javascript
// ❌ ERRADO!
export async function DELETE(request) {
  // Não trata OPTIONS
  // Navegador bloqueia request
}
```

**Solução:**
```javascript
// ✅ CORRETO!
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://meuapp.com',
      'Access-Control-Allow-Methods': 'DELETE',
    },
  });
}
```

---

## 📊 SLIDE 8: RESUMO - CHECKLIST CORS

### **Título:** "CORS: Checklist de implementação segura"

### **✅ Checklist:**

```
□ Origin é ESPECÍFICA (não usar *)
□ Validar origin contra whitelist
□ Tratar preflight (OPTIONS)
□ Se usa credentials:
  □ Allow-Credentials: true
  □ Origin não pode ser *
  □ Frontend usa credentials: 'include'
  □ Cookie tem SameSite=None; Secure
□ Especificar métodos permitidos
□ Especificar headers permitidos
□ Configurar Max-Age para cache do preflight
□ Testar no navegador (DevTools → Network)
```

---

## 🎯 CONCLUSÃO DO VÍDEO 5.1:

**Fala:**
> "Agora você entende o que é CORS e quando ele é necessário.
>
> Mas aqui vem a parte interessante: no NOSSO projeto, NÃO vamos usar CORS!
>
> Por quê? É exatamente isso que vou explicar no próximo vídeo. Spoiler: tem a ver com a arquitetura do Next.js full-stack."

---

---

# 📊 VÍDEO 5.2 — CORS: POR QUE NÃO USAMOS NESTE PROJETO (8 min)

**Formato:** Slides + Diagramas de arquitetura

---

## 🎯 OBJETIVO:
Explicar claramente por que este projeto específico **NÃO precisa** de CORS e quando seria necessário.

---

## 📝 ROTEIRO DO VÍDEO:

### **INTRO (1 min)**

**Fala:**
> "No vídeo anterior, você aprendeu o que é CORS e como funciona.
>
> Mas agora vem a questão: quando você REALMENTE precisa de CORS?
>
> Spoiler: neste projeto, NÃO precisamos! E isso não é uma limitação, é uma VANTAGEM da arquitetura que estamos usando."

---

## 📊 SLIDE 1: ARQUITETURA DO NOSSO PROJETO

### **Título:** "Next.js Full-Stack: Tudo na mesma origem"

### **Diagrama:**

```
┌─────────────────────────────────────────┐
│      https://meuapp.com                 │
│                                         │
│  ┌──────────────┐   ┌──────────────┐  │
│  │   FRONTEND   │   │   BACKEND    │  │
│  │              │   │              │  │
│  │  - Pages     │   │  - Server    │  │
│  │  - Components│   │    Actions   │  │
│  │  - Client    │   │  - API       │  │
│  │    Components│   │    Routes    │  │
│  └──────────────┘   └──────────────┘  │
│         ↓                   ↓          │
│    MESMA ORIGEM: https://meuapp.com    │
└─────────────────────────────────────────┘

✅ Protocolo: https
✅ Domínio: meuapp.com
✅ Porta: 443 (padrão HTTPS)

→ Same-Origin Policy: PERMITIDO! ✅
→ CORS: NÃO NECESSÁRIO! ✅
```

### **Explicação:**

**No Next.js full-stack:**
- Frontend e backend servidos pela **mesma aplicação**
- **Mesma URL** para tudo: `https://meuapp.com`
- Server Actions executam no servidor, mas sem trocar de origem
- API Routes (se usadas) também estão na mesma origem

**Resultado:**
> Não há requests **cross-origin**! Logo, CORS não é necessário.

---

## 📊 SLIDE 2: SERVER ACTIONS = MESMA ORIGEM

### **Título:** "Server Actions: Magia do Next.js"

### **Como funciona:**

```javascript
// src/actions/posts.js
"use server";

export async function deletePost(postId) {
  // Este código executa NO SERVIDOR
  // Mas o navegador não faz request HTTP tradicional!
  const result = await db.delete(postId);
  return result;
}
```

```javascript
// src/components/DeleteButton.jsx
"use client";

import { deletePost } from '@/actions/posts';

export function DeleteButton({ postId }) {
  const handleClick = async () => {
    // Next.js faz a "mágica" nos bastidores
    // Não é fetch(), não é XMLHttpRequest
    // É uma chamada direta via framework
    await deletePost(postId);
  };
  
  return <button onClick={handleClick}>Deletar</button>;
}
```

### **Por baixo dos panos:**

```
1. Usuário clica no botão
2. Next.js intercepta a chamada
3. Next.js faz request interno para:
   POST https://meuapp.com/__nextjs_action__
4. Mesma origem! ✅
5. Sem CORS necessário! ✅
```

---

## 📊 SLIDE 3: QUANDO CORS SERIA NECESSÁRIO?

### **Título:** "3 Cenários que exigem CORS"

---

### **❌ CENÁRIO 1: FRONTEND SEPARADO**

```
┌────────────────────┐       ┌────────────────────┐
│  FRONTEND          │       │  BACKEND           │
│                    │       │                    │
│  https://app.com   │──────▶│  https://api.com   │
│                    │       │                    │
│  - React SPA       │       │  - Node.js         │
│  - Vue.js          │       │  - Express         │
│  - Angular         │       │  - NestJS          │
└────────────────────┘       └────────────────────┘

❌ Origens diferentes: app.com ≠ api.com
⚠️ PRECISA DE CORS!
```

**Exemplo:**
```javascript
// Frontend em https://app.com
fetch('https://api.com/posts')
  .then(res => res.json())
  .then(data => console.log(data));

// ❌ Navegador: "Origens diferentes! Vou bloquear..."
// ⚠️ Servidor precisa enviar headers CORS
```

---

### **❌ CENÁRIO 2: API PÚBLICA**

```
┌────────────────────┐       ┌────────────────────┐
│  MEU APP           │       │  MINHA API PÚBLICA │
│                    │       │                    │
│  https://meuapp.com│       │  https://api.      │
│                    │       │  meuapp.com        │
└────────────────────┘       └────────────────────┘
                                      ▲
                                      │
                     ┌────────────────┴────────────────┐
                     │                                  │
          ┌──────────┴─────────┐         ┌─────────────┴───────┐
          │  APP EXTERNO 1     │         │  APP EXTERNO 2      │
          │  https://outro.com │         │  https://mais.com   │
          └────────────────────┘         └─────────────────────┘

⚠️ Outros apps consomem sua API
⚠️ PRECISA DE CORS!
```

**Exemplo:**
```javascript
// next.config.js (ou middleware)
{
  source: '/api/:path*',
  headers: [
    { 
      key: 'Access-Control-Allow-Origin', 
      value: '*'  // API pública = aceita qualquer origem
    }
  ]
}
```

---

### **❌ CENÁRIO 3: MICROSERVIÇOS**

```
┌──────────────────┐
│  FRONTEND        │
│  https://        │
│  frontend.com    │
└────────┬─────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌─────────────────┐  ┌─────────────────┐
│  AUTH SERVICE   │  │  DATA SERVICE   │
│  https://auth.  │  │  https://data.  │
│  backend.com    │  │  backend.com    │
└─────────────────┘  └─────────────────┘

❌ Três origens diferentes!
⚠️ TODOS precisam de CORS!
```

---

## 📊 SLIDE 4: NOSSO CASO VS CASOS QUE PRECISAM DE CORS

### **Título:** "Comparação lado a lado"

### **Tabela Comparativa:**

| Aspecto | Nosso Projeto | Projeto com CORS |
|---------|---------------|------------------|
| **Arquitetura** | Next.js Full-Stack | Frontend + Backend separados |
| **Frontend** | `https://meuapp.com` | `https://app.com` |
| **Backend** | `https://meuapp.com/api` | `https://api.backend.com` |
| **Origens** | ✅ Mesma origem | ❌ Origens diferentes |
| **Server Actions** | ✅ Usa | ❌ Não usa (fetch direto) |
| **CORS necessário?** | ❌ NÃO | ✅ SIM |
| **Complexidade** | 🟢 Baixa | 🔴 Alta (preflight, credentials, etc) |
| **Security Headers** | Foco em CSP, X-Frame-Options, etc | CORS + outros headers |

---

## 📊 SLIDE 5: VANTAGENS DE NÃO USAR CORS

### **Título:** "Por que menos CORS = mais segurança"

### **Vantagens:**

**1. Menos superfície de ataque**
```
Sem CORS:
- Sem headers de Allow-Origin
- Sem validação de origin
- Sem tratamento de preflight
- Menos pontos de falha
```

**2. Mais simples**
```
Sem CORS:
- Menos configuração
- Menos código
- Menos chances de erro
```

**3. Mais rápido**
```
Sem CORS:
- Sem preflight (OPTIONS)
- Requests diretos
- Menos latência
```

**4. Mais seguro por padrão**
```
Same-Origin Policy:
- Navegador bloqueia automaticamente
- Sem necessidade de configuração
- Proteção nativa do browser
```

---

## 📊 SLIDE 6: E SE EU PRECISAR DE CORS NO FUTURO?

### **Título:** "Migrando para arquitetura com CORS"

### **Quando migrar:**

```
✅ Quando separar frontend e backend:
   - Hospedar frontend em CDN (Vercel, Netlify)
   - Hospedar backend em servidor dedicado

✅ Quando criar API pública:
   - Permitir que outros apps consumam
   - Documentar endpoints
   - Implementar rate limiting

✅ Quando usar microserviços:
   - Dividir backend em serviços independentes
   - Cada serviço em domínio próprio
```

### **Como implementar:**

```javascript
// Opção 1: next.config.js (origem fixa)
module.exports = {
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://meuapp.com' },
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
      ],
    }];
  },
};

// Opção 2: middleware.js (validação dinâmica)
export function middleware(request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://app1.com', 'https://app2.com'];
  
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  return response;
}
```

**Referência:** https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

---

## 📊 SLIDE 7: RESUMO - DECISÃO ARQUITETURAL

### **Título:** "Por que não usamos CORS: Resumo"

### **Checklist:**

```
✅ Next.js full-stack app
✅ Frontend e backend na mesma origem
✅ Server Actions (não fetch externo)
✅ Same-Origin Policy: suficiente
✅ Menos complexidade
✅ Menos superfície de ataque
✅ Mais rápido (sem preflight)

→ DECISÃO: NÃO implementar CORS ✅
→ FOCO: Security Headers essenciais (próximos vídeos)
```

---

## 🎯 CONCLUSÃO DO VÍDEO 5.2:

**Fala:**
> "Agora você entende por que CORS não é necessário neste projeto.
>
> Não é uma limitação, é uma VANTAGEM! Menos complexidade, mais segurança, mais rapidez.
>
> E agora que já sabemos o que NÃO vamos fazer (CORS), vamos focar no que REALMENTE importa: os Security Headers essenciais.
>
> No próximo vídeo, vamos implementar 5 headers de segurança em menos de 15 linhas de código. Bora lá!"

---

---

# 💻 VÍDEO 5.3 — SECURITY HEADERS NO `next.config.js` (12 min)

**Formato:** CÓDIGO (implementação prática)

**Arquivo:** `next.config.js`

### **Implementação:**

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

**Resultado:** Score B no https://securityheaders.com

---

# 💻 VÍDEO 5.4 — CSP COM NONCE (MIDDLEWARE) (15 min)

**Formato:** CÓDIGO (implementação prática)

**Arquivos:**
- `src/lib/csp.js`
- `middleware.js`

### **Implementação:**

```javascript
// src/lib/csp.js
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
  ].join("; ");
}
```

```javascript
// middleware.js
import { generateNonce, getCSPHeader } from "./src/lib/csp";

export async function middleware(request) {
  let response = await updateSession(request);
  
  const nonce = generateNonce();
  response.headers.set("Content-Security-Policy", getCSPHeader(nonce));
  response.headers.set("x-nonce", nonce);
  
  return response;
}
```

**Resultado:** Score A+ no https://securityheaders.com ✅

---

## 📊 RESUMO FINAL DA AULA 5:

| Vídeo | Tipo | Conteúdo | Duração |
|-------|------|----------|---------|
| 5.1 | 📊 Slides | CORS Teoria | 12 min |
| 5.2 | 📊 Slides | Por que não usar CORS | 8 min |
| 5.3 | 💻 Código | Security Headers | 12 min |
| 5.4 | 💻 Código | CSP com Nonce | 15 min |
| **TOTAL** | | | **47 min** |

**Score Final:** A+ no securityheaders.com 🎉

