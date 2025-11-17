# 🛡️ OWASP e Auditoria de Segurança

**Para:** Vídeo 1.2 - OWASP e Auditoria Formal  
**Atualizado:** 2025-01-14

---

## 🌐 O que é OWASP?

**OWASP** = Open Web Application Security Project

### Definição:
- **Fundação sem fins lucrativos** dedicada à segurança de software
- **Padrão global** da indústria de segurança
- Criada em 2001, referência mundial
- Mantida por comunidade de especialistas

### Por que importa?
- ✅ **Padrão da indústria** - Empresas seguem OWASP
- ✅ **Base para auditorias** - Auditores usam OWASP
- ✅ **Compliance** - PCI-DSS, SOC2 requerem OWASP
- ✅ **Carreira** - Conhecer OWASP = diferencial profissional

### Website:
🌐 https://owasp.org

---

## 📊 OWASP Top 10

### O que é?
Lista das **10 vulnerabilidades mais críticas** em aplicações web, atualizada a cada 3-4 anos.

### Versão Atual: 2021

#### **A01:2021 – Broken Access Control** 🔴
**O que é:** Falta de controle adequado de acesso  
**Exemplo:** Qualquer usuário pode deletar posts de outros  
**No curso:** Módulo 3 (RBAC e ABAC)

---

#### **A02:2021 – Cryptographic Failures** 🔴
**O que é:** Falhas em criptografia e proteção de dados  
**Exemplo:** Senhas em plain text, tokens sem hash  
**No curso:** Módulo 2 (Tokens seguros)

---

#### **A03:2021 – Injection** 🔴
**O que é:** SQL Injection, XSS, Command Injection  
**Exemplo React:** XSS via `dangerouslySetInnerHTML`  
**No curso:** Módulo 1 (XSS)

---

#### **A04:2021 – Insecure Design**
**O que é:** Falhas arquiteturais de segurança  
**Exemplo:** Sistema sem rate limiting, sem MFA  
**No curso:** Mencionado, mas não aprofundado

---

#### **A05:2021 – Security Misconfiguration** 🔴
**O que é:** Configurações inseguras  
**Exemplo:** Headers de segurança ausentes, CORS mal configurado  
**No curso:** Módulo 1 (Headers) e Módulo 4 (CORS)

---

#### **A06:2021 – Vulnerable Components** 🔴
**O que é:** Usar bibliotecas com vulnerabilidades conhecidas  
**Exemplo:** js-yaml < 4.1.1 com Prototype Pollution  
**No curso:** Módulo 1 (npm audit) e Módulo 5 (Dependabot)

---

#### **A07:2021 – Authentication Failures** 🔴
**O que é:** Falhas em autenticação  
**Exemplo:** Password reset inseguro, sessões sem timeout  
**No curso:** Módulo 2 (OAuth, Password Reset)

---

#### **A08:2021 – Software and Data Integrity Failures**
**O que é:** Atualizações inseguras, CI/CD sem validação  
**Exemplo:** npm packages maliciosos (supply chain)  
**No curso:** Módulo 5 (CI/CD com segurança)

---

#### **A09:2021 – Security Logging and Monitoring Failures**
**O que é:** Falta de logs de segurança  
**Exemplo:** Não detectar tentativas de invasão  
**No curso:** Módulo 1 (Logs sanitizados) e Módulo 5 (Monitoring)

---

#### **A10:2021 – Server-Side Request Forgery (SSRF)**
**O que é:** Servidor faz requests para URLs maliciosas  
**Exemplo:** Backend faz fetch para URL controlada por atacante  
**No curso:** ❌ Não (é backend puro, não React)

---

## 🎯 OWASP Top 10 - Relevância para React/Next.js

### ✅ **Alta Relevância** (cobertos no curso):
- **A01** - Broken Access Control → RBAC/ABAC
- **A02** - Cryptographic Failures → Tokens seguros
- **A03** - Injection (XSS) → Sanitização
- **A05** - Security Misconfiguration → Headers, CORS
- **A06** - Vulnerable Components → npm audit
- **A07** - Authentication Failures → OAuth, Password Reset

### ⚠️ **Média Relevância** (mencionados):
- **A04** - Insecure Design
- **A08** - Data Integrity → Supply chain
- **A09** - Logging → Logs sanitizados

### ❌ **Baixa Relevância** (não aplicável):
- **A10** - SSRF (backend puro)

**Conclusão:** **7 de 10** são altamente relevantes para React/Next.js!

---

## 🏢 Auditoria Formal vs Auditoria Prática

### 🎓 **Auditoria Formal (Empresas Grandes)**

#### O que é?
Processo estruturado seguindo **metodologias reconhecidas** (OWASP, NIST, ISO 27001)

#### Quando acontece?
- Antes de lançar features críticas
- Anualmente (compliance)
- Após incidentes de segurança
- Requerido por regulações (PCI-DSS, HIPAA, LGPD)

#### Quem faz?
- **Security Team interno**
- **Consultoria externa** (PwC, Deloitte, etc)
- **Pentesters certificados** (OSCP, CEH)

#### Como funciona?

**Fase 1: Planejamento**
- Definir escopo
- Escolher metodologia (OWASP ASVS, WSTG)
- Agendar com equipes

**Fase 2: Análise Automática**
- SAST (Static): Checkmarx, Snyk Code
- DAST (Dynamic): Burp Suite, ZAP
- SCA (Dependencies): Snyk, Dependabot

**Fase 3: Análise Manual**
- Code review linha por linha
- Teste de penetração manual
- Verificação de lógica de negócio

**Fase 4: Relatório**
- Lista de vulnerabilidades (severidade: crítica, alta, média, baixa)
- CVSS Score (0-10)
- Recomendações de correção
- Prazo para remediation

**Fase 5: Remediation**
- Devs corrigem vulnerabilidades
- Prazo: críticas (7 dias), altas (30 dias), médias (90 dias)

**Fase 6: Re-teste**
- Auditor valida correções

#### Quanto custa?
- **Consultoria externa:** $10k - $100k+ por auditoria
- **Pentest:** $5k - $50k
- **Ferramentas (Checkmarx):** $50k - $200k/ano

#### Exemplo de Empresas:
- Bancos (Nubank, Itaú)
- Fintechs (PagSeguro, Stone)
- E-commerces grandes (Magazine Luiza, Americanas)
- Empresas reguladas (saúde, governo)

---

### 💻 **Auditoria Prática (Startups/Devs)**

#### O que é?
Processo **pragmático** focado em **prevenir vulnerabilidades comuns**

#### Quando acontece?
- Durante desenvolvimento (code review)
- A cada PR (CI/CD)
- Antes de deploys
- Contínuo (Dependabot, alerts)

#### Quem faz?
- **Própria equipe de devs**
- **Tech leads**
- **Engenheiros sêniors**

#### Como funciona?

**1. Ferramentas Automáticas (Diário)**
```bash
# Dependências
npm audit

# Linter de segurança (se aplicável)
eslint --plugin security

# Pre-commit hooks
husky + lint-staged
```

**2. Code Review (A cada PR)**
- Verificar inputs do usuário
- Validar autenticação/autorização
- Checar logs (não vazar tokens)
- Revisar Server Actions

**3. Checklist Manual (Mensal)**
- [ ] npm audit sem vulnerabilidades críticas
- [ ] Nenhum `dangerouslySetInnerHTML` sem sanitização
- [ ] Server Actions com validação adequada
- [ ] Tokens em httpOnly cookies (não localStorage)
- [ ] Security headers configurados
- [ ] CORS restritivo

**4. Dependabot (Automático)**
- PRs automáticos para dependências vulneráveis
- Ativar no GitHub (grátis)

#### Quanto custa?
- **$0** - Ferramentas gratuitas (npm audit, Dependabot)
- **Tempo** - 2-4h/semana da equipe

---

## 📋 OWASP ASVS (Application Security Verification Standard)

### O que é?
Checklist **completo** de requisitos de segurança para aplicações web.

### Níveis:
- **Level 1:** Mínimo (todas aplicações)
- **Level 2:** Padrão (maioria das aplicações)
- **Level 3:** Crítico (bancos, saúde)

### Exemplo de Requisitos (Level 1):

```
✅ V2.1.1: Senhas tem mínimo de 8 caracteres
✅ V2.2.1: CSRF tokens em formulários
✅ V3.4.1: Logs não contém dados sensíveis
✅ V4.1.1: Access control em todas rotas
✅ V5.1.1: Inputs validados no servidor
```

### Para este curso:
Vamos cobrir **~60% do OWASP ASVS Level 1** (o relevante para React/Next.js)

---

## 🎯 Por que Conhecer OWASP?

### 1. **Carreira** 💼
Empresas buscam devs que conhecem OWASP:

```
Requisito na vaga:
"Conhecimento em OWASP Top 10 e boas práticas de segurança"
```

### 2. **Entrevistas** 🎤
Perguntas comuns:

- "O que é XSS e como prevenir?"
- "Explique OWASP Top 10"
- "Como você faria auditoria de segurança?"

### 3. **Comunicação** 💬
Falar a mesma língua que security teams:

```
Dev: "Corrigi o A03 (XSS) e A01 (RBAC)"
Security: "Perfeito, pode fazer deploy"
```

### 4. **Compliance** 📜
Certificações requerem OWASP:
- PCI-DSS (pagamentos)
- SOC 2 (SaaS)
- ISO 27001 (corporativo)

---

## 💡 Resumo para o Vídeo

### Slide 1: OWASP
```
🛡️ OWASP = Padrão Global de Segurança Web

Fundação sem fins lucrativos
Referência da indústria desde 2001
Base para auditorias profissionais
```

### Slide 2: OWASP Top 10
```
📊 Top 10 Vulnerabilidades Mais Críticas

7 de 10 relevantes para React/Next.js:
✅ A01 - Access Control → RBAC/ABAC
✅ A03 - XSS → Sanitização
✅ A05 - Headers → CSP, CORS
✅ A06 - Dependências → npm audit
✅ A07 - Auth → OAuth, Tokens
```

### Slide 3: Auditoria Formal
```
🏢 Empresas Grandes

Consultoria externa ($10k-$100k)
Ferramentas caras (Checkmarx)
Processo estruturado (OWASP ASVS)
Relatório formal + Remediation
```

### Slide 4: Auditoria Prática
```
💻 Startups / Devs

npm audit (grátis)
Dependabot (grátis)
Code review manual
2-4h/semana da equipe
```

### Slide 5: Por que conhecer?
```
🎯 Carreira

✅ Requisito em vagas
✅ Perguntas em entrevistas
✅ Comunicação com security teams
✅ Diferencial profissional
```

---

## 🔗 Links Úteis

- **OWASP Top 10:** https://owasp.org/Top10/
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/
- **OWASP Cheat Sheets:** https://cheatsheetseries.owasp.org/
- **OWASP ZAP (ferramenta gratuita):** https://www.zaproxy.org/

---

**Use este documento para o Vídeo 1.2!** 🎬

