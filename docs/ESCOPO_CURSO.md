# 🎯 Escopo do Curso - Segurança em React e Next.js

**Data**: 2025-01-14  
**Curso**: Segurança em Aplicações React e Next.js

---

## 📋 Objetivo do Curso

Ensinar **desenvolvedores React/Next.js** a identificar, prevenir e corrigir vulnerabilidades de segurança em **aplicações frontend e fullstack**.

**Foco:** Segurança do código que VOCÊ escreve, não apenas ferramentas.

---

## ✅ O QUE ESTÁ NO CURSO

### 1. **Proteção contra Ataques (Módulo 1)**
- ✅ XSS (Cross-Site Scripting) em React
  - `dangerouslySetInnerHTML`
  - Sanitização com DOMPurify
  - Content Security Policy (CSP)
- ✅ CSRF (Cross-Site Request Forgery) em Server Actions
  - Next.js Server Actions
  - CSRF tokens
  - SameSite cookies
- ✅ Vazamento de tokens em logs
  - Sanitização de logs
  - httpOnly cookies vs localStorage

### 2. **Autenticação e Tokens (Módulo 2)**
- ✅ OAuth 2.0 flow
  - Authorization Code + PKCE
  - State parameter
- ✅ Refresh tokens seguros
  - Token rotation
  - Detecção de reuso
- ✅ Token binding
  - Device fingerprinting
- ✅ Password reset seguro
  - Tokens com hash
  - One-time use
  - Expiração

### 3. **Autorização (Módulo 3)**
- ✅ RBAC (Role-Based Access Control)
  - Verificação de roles (admin, moderator, user)
- ✅ ABAC (Attribute-Based Access Control)
  - Ownership (autor do post)
  - Atributos dinâmicos (reportCount, createdAt)
- ✅ Combinação RBAC + ABAC

### 4. **Configuração Segura (Módulo 4)**
- ✅ Security Headers
  - X-Frame-Options, X-Content-Type-Options
  - Referrer-Policy, Permissions-Policy
- ✅ CORS (Cross-Origin Resource Sharing)
  - Whitelist de origens
  - Credentials handling
- ✅ Content Security Policy (CSP)
  - Nonce para scripts inline
  - Diretivas restritivas

### 5. **Deploy Seguro (Módulo 5)**
- ✅ Preparação para produção
  - Variáveis de ambiente
  - Build otimizado
- ✅ CI/CD com segurança
  - GitHub Actions
  - Dependabot
  - Pre-commit hooks
- ✅ Deploy na Vercel
  - Configuração segura
  - Monitoring de logs

---

## ❌ O QUE NÃO ESTÁ NO CURSO

### 🚫 **Infraestrutura e DevOps**
- ❌ Configuração de servidores (AWS, Azure, GCP)
- ❌ Kubernetes security
- ❌ Docker security
- ❌ Network security (VPNs, firewalls)
- ❌ DDoS protection

**Por quê?** São tópicos de infraestrutura, não desenvolvimento React.

---

### 🚫 **Penetration Testing Avançado**
- ❌ Exploração de vulnerabilidades
- ❌ Reverse engineering
- ❌ Buffer overflows
- ❌ Man-in-the-middle attacks
- ❌ Tools como Burp Suite, Metasploit

**Por quê?** Foco é **prevenção**, não exploração. Pentest é uma especialização separada.

---

### 🚫 **Backend/Database Security**
- ❌ SQL Injection
- ❌ NoSQL Injection
- ❌ Server-Side Request Forgery (SSRF)
- ❌ Remote Code Execution (RCE)

**Por quê?** 
- SQL/NoSQL Injection: ORMs e Supabase já protegem
- SSRF/RCE: São ataques backend, fora do escopo React
- **Nota:** Server Actions (Next.js) são cobertos!

---

### 🚫 **Compliance Detalhado**
- ❌ LGPD/GDPR completo
- ❌ PCI-DSS (Payment Card Industry)
- ❌ HIPAA (Healthcare)
- ❌ SOC 2 compliance
- ❌ ISO 27001

**Por quê?** São tópicos jurídicos e organizacionais, não técnicos. Mencionamos conceitos básicos apenas.

---

### 🚫 **Hardware/Physical Security**
- ❌ Secure boot
- ❌ TPM (Trusted Platform Module)
- ❌ Physical access controls
- ❌ USB security

**Por quê?** Não relacionado a desenvolvimento React.

---

### 🚫 **Blockchain/Crypto**
- ❌ Smart contract security
- ❌ Wallet security
- ❌ Cryptocurrency attacks

**Por quê?** Nicho muito específico, merece curso próprio.

---

## 🏛️ Os 3 Pilares da Segurança Web

### 🔐 **Pilar 1: Segurança de Dependências**
Vulnerabilidades em **npm packages** que você instalou

**Exemplos:**
- js-yaml com Prototype Pollution
- lodash antigas com RCE
- Pacotes maliciosos (supply chain attacks)

**Ferramentas:** npm audit, Dependabot, Snyk

---

### 💻 **Pilar 2: Segurança do Código**
Vulnerabilidades no **código que VOCÊ escreveu**

**Exemplos:**
- XSS: `<div dangerouslySetInnerHTML={{ __html: userInput }} />`
- CSRF: Server Actions sem validação
- Broken Access Control: Falta de RBAC/ABAC
- Token Leaks: Logs com dados sensíveis

**Ferramentas:** Code review, Checkmarx, Snyk Code

---

### ☁️ **Pilar 3: Segurança de Infraestrutura**
Vulnerabilidades na **infraestrutura** (servidores, rede, cloud)

**Exemplos:**
- Servidores mal configurados
- Firewalls fracos
- Cloud (AWS/Azure) com permissões erradas
- DDoS protection ausente

**Ferramentas:** AWS Security Hub, Cloudflare, Pentest

---

## 🎯 Foco deste Curso: Pilares 1 e 2

### ✅ **Pilar 1: Dependências** (npm packages)
- npm audit
- Dependabot
- Snyk

### ✅ **Pilar 2: Código React/Next.js**
Este é dividido em **4 temas**:

#### 1️⃣ **Proteção contra Ataques**
XSS, CSRF, token leaks

#### 2️⃣ **Autenticação Segura**
OAuth, refresh tokens, password reset

#### 3️⃣ **Autorização Adequada**
RBAC, ABAC, controle de acesso

#### 4️⃣ **Configuração Segura**
Headers, CORS, CSP, deploy

### ❌ **Pilar 3: Infraestrutura** (fora do escopo)
- Configuração de servidores
- Network security (VPNs, firewalls)
- Cloud security avançada
- Kubernetes hardening

**Por quê?** Foco é **desenvolvimento React/Next.js**, não DevOps.

---

## 🧑‍💻 Para Quem é Este Curso?

### ✅ **Ideal para:**
- Desenvolvedores React (intermediário)
- Desenvolvedores Next.js (App Router)
- Fullstack devs focados em frontend
- Engenheiros de software preocupados com segurança

### ⚠️ **Não é ideal para:**
- Iniciantes em React (pré-requisito: React básico)
- Pentesters buscando hacking avançado
- Engenheiros de infraestrutura/DevOps
- Compliance officers (foco é técnico, não jurídico)

---

## 📚 Pré-requisitos

### **Obrigatório:**
- ✅ React básico (hooks, components, state)
- ✅ JavaScript ES6+
- ✅ Node.js básico
- ✅ Git básico

### **Recomendado:**
- 🔹 Next.js 14+ (App Router)
- 🔹 TypeScript (ajuda mas não é obrigatório)
- 🔹 Supabase ou similar (BaaS)

---

## 🎓 O Que Você Vai Aprender

**Skill principal:** Pensar em segurança **durante** o desenvolvimento, não depois.

**Ao final do curso:**
- ✅ Identificar vulnerabilidades em code review
- ✅ Implementar proteções XSS, CSRF
- ✅ Configurar OAuth e tokens seguros
- ✅ Criar sistemas de autorização robustos
- ✅ Fazer deploy seguro de apps React/Next.js

---

## 💡 Filosofia do Curso

### **"Security by Design, not by Compliance"**

1. **Código Seguro > Ferramentas**
   - Ferramentas ajudam, mas conhecimento é essencial

2. **Análise Manual > Automação**
   - npm audit é ótimo, mas não detecta XSS no seu código

3. **Prático > Teórico**
   - Cada vulnerabilidade é demonstrada e corrigida

4. **Frontend-First**
   - Focado em React/Next.js, não backend genérico

---

## 📞 Dúvidas sobre Escopo?

**"Vai cobrir [tópico X]?"**
→ Veja as seções "O QUE ESTÁ" e "O QUE NÃO ESTÁ"

**"Por que não tem [tópico Y]?"**
→ Foco é segurança em **código React/Next.js que você escreve**

**"É um curso de hacking?"**
→ Não. É um curso de **desenvolvimento seguro** para devs React.

---

**Definido por**: Curso de Segurança React/Next.js  
**Última atualização**: 2025-01-14

