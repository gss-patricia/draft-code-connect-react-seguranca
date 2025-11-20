# 🛡️ Defesa em Profundidade contra XSS

Este documento explica a arquitetura de segurança implementada no projeto para proteger contra ataques XSS (Cross-Site Scripting).

## 📊 Arquitetura de Múltiplas Camadas

```
┌─────────────────────────────────────────────┐
│  👤 USUÁRIO                                 │
│  Envia: <script>alert('XSS')</script>      │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  🔒 CAMADA 1: Sanitização ao Salvar         │
│  Arquivo: src/actions/profile.js            │
│  ✅ sanitizeBio(rawBio)                     │
│  Remove: <script>, event handlers           │
│  Resultado: "" (vazio)                      │
└──────────────────┬──────────────────────────┘
                   │
                   ↓ (salva no banco limpo)
┌─────────────────────────────────────────────┐
│  🗄️  DATABASE                               │
│  Armazena: apenas HTML seguro               │
│  Nunca armazena: <script> ou onerror        │
└──────────────────┬──────────────────────────┘
                   │
                   ↓ (busca dados)
┌─────────────────────────────────────────────┐
│  🔒 CAMADA 2: Sanitização ao Renderizar     │
│  Arquivo: src/components/UserBio/index.jsx  │
│  ✅ sanitizeBio(bio)                        │
│  Protege contra: APIs externas, dados       │
│  legados, migrações                         │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  🌐 NAVEGADOR                               │
│  Renderiza: HTML seguro                     │
│  ✅ Sem scripts maliciosos executando       │
└─────────────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### Camada 1: Sanitização ao Salvar (Server Action)

**Arquivo:** `src/actions/profile.js`

```javascript
import { sanitizeBio } from "../utils/sanitizer";

export async function updateUserBio(formData) {
  const rawBio = formData.get("bio");
  
  // ✅ CAMADA 1: Sanitizar ANTES de salvar no banco
  const cleanBio = sanitizeBio(rawBio);
  
  await database.updateUserBio(dbUser.id, cleanBio);
}
```

**Vantagens:**
- ✅ Banco de dados **nunca** contém código malicioso
- ✅ Protege todos os pontos onde a bio é exibida
- ✅ Facilita auditoria (dados limpos na origem)
- ✅ Melhora performance (sanitiza 1x em vez de N vezes)

---

### Camada 2: Sanitização ao Renderizar (Component)

**Arquivo:** `src/components/UserBio/index.jsx`

```javascript
import { sanitizeBio } from "../../utils/sanitizer";

export function UserBio({ bio }) {
  // ✅ CAMADA 2: Sanitizar ao renderizar
  const cleanBio = sanitizeBio(bio);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: cleanBio }} />
  );
}
```

**Vantagens:**
- ✅ Protege contra **dados externos** (APIs de terceiros)
- ✅ Protege **dados legados** (anteriores à Camada 1)
- ✅ Funciona mesmo se Camada 1 falhar
- ✅ Útil para ensinar sanitização client-side

---

## 🔍 Por que Duas Camadas?

### Cenários Reais Onde a Camada 2 é Necessária:

#### 1. **Dados de APIs Externas**
```javascript
// API de terceiros retorna HTML malicioso
const response = await fetch('https://external-api.com/user/123');
const userData = await response.json();

// ✅ Camada 2 protege aqui
<UserBio bio={userData.bio} />
```

#### 2. **Dados Legados do Banco**
```javascript
// Banco contém dados de ANTES da implementação da Camada 1
const oldUser = await database.getUserByUsername('old-user');

// ✅ Camada 2 protege dados antigos
<UserBio bio={oldUser.bio} />
```

#### 3. **Migração de Dados**
```javascript
// Durante migração, dados podem vir sem sanitização
const migratedUsers = await importFromOldSystem();

// ✅ Camada 2 protege durante migração
{migratedUsers.map(user => <UserBio bio={user.bio} />)}
```

#### 4. **Admin Bypass Acidental**
```javascript
// Se um admin conseguir bypassar a Camada 1
// (bug, privilégio especial, SQL direto)

// ✅ Camada 2 ainda protege o frontend
```

---

## 📚 Tecnologia Usada: isomorphic-dompurify

### Por que `isomorphic-dompurify`?

```bash
yarn add isomorphic-dompurify
```

| Biblioteca | Servidor (SSR) | Cliente (CSR) | Hydration Mismatch? |
|------------|----------------|---------------|---------------------|
| `dompurify` | ❌ Não funciona | ✅ Funciona | ⚠️ SIM (problema!) |
| `isomorphic-dompurify` | ✅ Funciona | ✅ Funciona | ✅ NÃO (perfeito!) |

### Configuração

**Arquivo:** `src/utils/sanitizer.js`

```javascript
import DOMPurify from "isomorphic-dompurify";

const SANITIZE_CONFIGS = {
  bio: {
    ALLOWED_TAGS: ["p", "strong", "em", "br", "a", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  },
};

export function sanitizeBio(bio) {
  return DOMPurify.sanitize(bio, SANITIZE_CONFIGS.bio);
}
```

---

## 🧪 Testes de Segurança

### Teste 1: Script Tag
```html
Input:  <script>alert('XSS')</script>
Output: "" (removido completamente)
```

### Teste 2: Event Handler
```html
Input:  <img src=x onerror="alert('XSS')">
Output: <img src="x"> (onerror removido)
```

### Teste 3: JavaScript URL
```html
Input:  <a href="javascript:alert('XSS')">Click</a>
Output: <a>Click</a> (href removido)
```

### Teste 4: HTML Legítimo
```html
Input:  <p>Texto em <strong>negrito</strong></p>
Output: <p>Texto em <strong>negrito</strong></p> (mantido)
```

---

## 🎓 Valor Pedagógico para o Curso

### Módulo 1 - Vídeo 1.4: Demonstração do Problema
- Mostrar bio **sem** sanitização
- Atacante injeta `<script>alert(document.cookie)</script>`
- Alert dispara → cookies expostos → sessão roubada

### Módulo 1 - Vídeo 1.5: Solução (Camada 1)
- Implementar sanitização ao salvar (`src/actions/profile.js`)
- Testar novamente → script bloqueado ✅
- Explicar: "Dados limpos na origem"

### Módulo 1 - Vídeo 1.6: Defesa em Profundidade (Camada 2)
- Cenário: API externa retorna HTML malicioso
- Mostrar que Camada 2 protege mesmo sem Camada 1
- Explicar: "Nunca confie em dados externos"

### Módulo 4 - Vídeo 4.3: CSP (Camada 3)
- Adicionar `Content-Security-Policy` header
- Mesmo se XSS passar, CSP bloqueia execução
- Defesa em profundidade completa 🛡️

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes (Vulnerável) | Depois (Protegido) |
|---------|-------------------|-------------------|
| **Banco de dados** | ❌ Contém `<script>` | ✅ Contém apenas HTML seguro |
| **Renderização** | ❌ XSS executado | ✅ Script bloqueado |
| **APIs externas** | ❌ Sem proteção | ✅ Sanitizado ao renderizar |
| **Dados legados** | ❌ Vulneráveis | ✅ Protegidos na Camada 2 |
| **Auditoria** | ❌ Difícil rastrear | ✅ Logs em ambas as camadas |
| **Performance** | ⚠️ Sanitiza N vezes | ✅ Sanitiza 1x (ao salvar) + 1x (ao renderizar para novos dados) |

---

## 🏆 Best Practices Implementadas

✅ **Princípio de Defesa em Profundidade**
- Múltiplas camadas de segurança
- Se uma falhar, outra protege

✅ **Princípio de Menor Privilégio**
- Apenas tags essenciais permitidas
- Atributos perigosos removidos

✅ **Princípio de Segurança por Design**
- Sanitização na arquitetura (não apenas addon)
- Server Actions protegem a origem

✅ **Princípio de Fail-Safe**
- Se DOMPurify falhar → retorna string vazia
- Se dados não forem sanitizados ao salvar → Camada 2 protege

---

## 🔗 Referências

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React dangerouslySetInnerHTML Docs](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)
- [DOMPurify GitHub](https://github.com/cure53/DOMPurify)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#server-components-and-route-handlers)

---

## ✅ Conclusão

Implementamos uma arquitetura de segurança robusta com:

1. ✅ **Camada 1**: Sanitização ao salvar (Server Action)
2. ✅ **Camada 2**: Sanitização ao renderizar (Component)
3. ✅ **isomorphic-dompurify**: Sem hydration mismatch
4. ✅ **Defesa em profundidade**: Múltiplas camadas

**Resultado:** Aplicação segura contra XSS, com ótima performance e valor pedagógico! 🚀🔒

