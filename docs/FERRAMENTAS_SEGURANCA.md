# 🛠️ Ferramentas de Segurança - Panorama do Mercado

**Para:** Slides do Vídeo 1.1  
**Atualizado:** 2025-01-14

---

## 📦 Segurança de Dependências

### 🥇 Snyk
- **Melhor ferramenta** do mercado
- Monitoramento contínuo
- PRs automáticos
- Base de dados proprietária (maior)
- 💰 Gratuito para OSS, pago para empresas
- 🌐 snyk.io

---

### 🥈 Dependabot
- **Integrado ao GitHub** (zero setup)
- PRs automáticos
- **Totalmente gratuito**
- Resolve 80% dos problemas
- 🌐 github.com/dependabot

---

### 🥉 npm audit
- **Nativo do npm**
- Rápido e simples
- Funciona offline
- Gratuito
- Base de dados menor

---

## 💻 Segurança do Código (SAST)

### 🥇 Checkmarx
- **Líder enterprise**
- Analisa código-fonte
- Detecta XSS, CSRF, SQL Injection
- 25+ linguagens
- 💰 **Pago** (enterprise)
- Para: Bancos, fintechs, regulados

---

### 🥈 Snyk Code
- Analisa JavaScript/TypeScript
- Detecta vulnerabilidades no código
- Mais acessível que Checkmarx
- 💰 Freemium
- Para: Startups, empresas médias

---

## 💡 Recomendações

### Empresa Grande
```
Checkmarx + Snyk
(use ambos se for empresa grande)
```

### Empresa Média
```
Snyk (dependências + código)
```

### Startup / Indie / Freelancer
```
Dependabot + Análise Manual
```

---

## 🏆 Melhor Custo-Benefício

### Dependabot

- ✅ **Gratuito**
- ✅ Resolve **80% dos problemas práticos**
- ✅ Zero configuração
- ✅ Já vem com GitHub
- ✅ Ativa e esquece

**Configuração:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## 🎯 Para Este Curso

### Vamos usar:

1. **npm audit** (Vídeo 1.1)
   - Demonstração prática
   - Ferramenta que todos têm

2. **Análise Manual** (Todos os módulos)
   - Skill mais importante
   - O que realmente diferencia devs

3. **Dependabot** (Módulo 5 - CI/CD)
   - Configuração no GitHub Actions
   - Automação de segurança

---

## 📊 Resumo Visual

```
Segurança = Ferramentas + Conhecimento

Ferramentas detectam 30-40% das vulnerabilidades
Conhecimento detecta os outros 60-70%

Este curso foca no CONHECIMENTO!
```

---

## 🔗 Links Úteis

- Snyk: https://snyk.io
- Dependabot: https://github.com/dependabot
- Checkmarx: https://checkmarx.com
- npm audit docs: https://docs.npmjs.com/cli/v8/commands/npm-audit

---

**Use este documento para criar os slides do Vídeo 1.1!** 🎬

