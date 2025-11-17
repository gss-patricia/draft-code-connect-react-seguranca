# 🏛️ Os 3 Pilares da Segurança em Aplicações Web

**Para:** Slides do Vídeo 1.2  
**Atualizado:** 2025-01-14

---

## 🔐 Pilar 1: Segurança de Dependências

### O que é?
Vulnerabilidades em **pacotes npm** que você instalou no projeto.

### Exemplos:
```bash
# Seu package.json
{
  "dependencies": {
    "react": "18.2.0",
    "js-yaml": "3.14.1"  # ⚠️ Versão vulnerável!
  }
}
```

### Riscos:
- **Prototype Pollution** (js-yaml)
- **Remote Code Execution** (lodash antigas)
- **XSS** (pacotes de sanitização com bugs)
- **Supply Chain Attacks** (pacotes maliciosos)

### Como detectar:
```bash
npm audit
```

### Ferramentas Profissionais:
- 🥇 **Snyk** - Mais completo
- 🥈 **Dependabot** - Gratuito no GitHub
- 🥉 **npm audit** - Nativo do npm

---

## 💻 Pilar 2: Segurança do Código

### O que é?
Vulnerabilidades no **código que VOCÊ escreveu**.

### Exemplos:
```jsx
// ⚠️ XSS - Seu código vulnerável
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ⚠️ CSRF - Sua Server Action vulnerável
export async function deletePost(postId) {
  // Sem validação de origem
  await db.delete(postId)
}

// ⚠️ Broken Access Control - Sua lógica vulnerável
if (user.isLoggedIn) {
  // Qualquer um logado pode deletar
  await deletePost(postId)
}
```

### Riscos:
- **XSS** (Cross-Site Scripting)
- **CSRF** (Cross-Site Request Forgery)
- **Broken Access Control** (falta de RBAC/ABAC)
- **Token Leaks** (logs, URLs)
- **Insecure Authentication**

### Como detectar:
- ✅ **Análise Manual** (code review)
- ✅ **SAST Tools** (Checkmarx, Snyk Code)
- ✅ **Security Testing**

### Ferramentas Profissionais:
- 🥇 **Checkmarx** - Enterprise (pago)
- 🥈 **Snyk Code** - Freemium
- 🥉 **Análise Manual** - Gratuito (conhecimento!)

---

## ☁️ Pilar 3: Segurança de Infraestrutura

### O que é?
Vulnerabilidades na **infraestrutura** onde a aplicação roda.

### Exemplos:
- **Servidores** mal configurados
- **Network** sem firewall
- **Cloud** (AWS, Azure) com permissões erradas
- **Docker** images vulneráveis
- **Kubernetes** clusters expostos
- **DDoS** protection ausente

### Riscos:
- **Server Compromise** (acesso root)
- **Data Breaches** (banco exposto)
- **Man-in-the-Middle** (SSL/TLS fraco)
- **DDoS Attacks**
- **Lateral Movement** (escalar de um servidor para outros)

### Como detectar:
- **Infrastructure Scanning** (Nessus, Qualys)
- **Cloud Security Posture Management** (AWS Security Hub)
- **Penetration Testing**

### Ferramentas Profissionais:
- AWS Security Hub
- Azure Security Center
- Cloudflare (WAF + DDoS)
- Nessus, Qualys

---

## 🎯 Foco deste Curso

### ✅ **DENTRO DO ESCOPO**

#### Pilar 1: Dependências ✅
- npm audit
- Dependabot
- Como usar Snyk

#### Pilar 2: Código ✅
- XSS em React
- CSRF em Server Actions
- RBAC e ABAC
- OAuth e tokens seguros
- Security Headers (CSP, CORS)

---

### ❌ **FORA DO ESCOPO**

#### Pilar 3: Infraestrutura ❌
- Configuração de servidores
- Network security (VPNs, firewalls)
- AWS/Azure security avançada
- Kubernetes hardening
- DDoS protection

**Por quê?**
- Foco é **desenvolvimento React/Next.js**
- Infra é responsabilidade de DevOps/SRE
- Vercel/Netlify já cuidam de muita coisa

---

## 📊 Estatísticas Importantes

### Onde estão as vulnerabilidades?

```
🔐 Dependências:     20-30% das vulnerabilidades
💻 Código:           60-70% das vulnerabilidades
☁️ Infraestrutura:   10-20% das vulnerabilidades
```

### O que desenvolvedores controlam?

```
✅ Dependências:      100% (você escolhe o que instalar)
✅ Código:            100% (você escreve)
⚠️ Infraestrutura:    ~20% (maioria é ops/cloud)
```

**Conclusão:** Desenvolvedores têm **maior impacto** nos Pilares 1 e 2!

---

## 💡 Lição Principal

### "Segurança é responsabilidade de TODOS"

Mas cada papel tem seu foco:

- **Frontend Devs** → Pilares 1 e 2
- **Backend Devs** → Pilares 1, 2 e parte de 3
- **DevOps/SRE** → Pilar 3
- **Security Team** → Supervisão de todos

**Este curso:** Foco em **frontend/fullstack devs** → **Pilares 1 e 2**

---

## 🎬 Para os Slides

### Slide 1: Título
```
🏛️ Os 3 Pilares da Segurança Web
```

### Slide 2: Visão Geral
```
🔐 Pilar 1: Dependências (npm packages)
💻 Pilar 2: Código (seu código)
☁️ Pilar 3: Infraestrutura (servidores)
```

### Slide 3: Pilar 1
```
🔐 Dependências

⚠️ Problema: Packages vulneráveis
📦 Exemplo: js-yaml, lodash
🛠️ Solução: npm audit, Dependabot
```

### Slide 4: Pilar 2
```
💻 Código

⚠️ Problema: Vulnerabilidades que você escreve
🐛 Exemplo: XSS, CSRF, Broken Access Control
🛠️ Solução: Code review, SAST, conhecimento
```

### Slide 5: Pilar 3
```
☁️ Infraestrutura

⚠️ Problema: Servidores/cloud mal configurados
🌐 Exemplo: Firewall, SSL, DDoS
❌ Fora do escopo deste curso
```

### Slide 6: Foco do Curso
```
Este curso:
✅ Pilar 1: Dependências
✅ Pilar 2: Código React/Next.js
❌ Pilar 3: Infra (DevOps)

Por quê? Maior impacto para devs frontend!
```

---

**Use este documento para criar os slides do Vídeo 1.2!** 🎬

