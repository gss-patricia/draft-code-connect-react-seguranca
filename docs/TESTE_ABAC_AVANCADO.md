# 🧪 TESTE ABAC AVANÇADO - Vídeo 4.4

## 📋 **CENÁRIOS DE TESTE**

### ✅ **CENÁRIO 1: Admin deleta qualquer post**
```
Usuário: admin@example.com
- role: "admin"
- id: 1

Post:
- id: 10
- authorId: 5 (não é o admin)
- reportCount: 0

Resultado esperado: ✅ PERMITIDO
Reason: "RBAC: Admin role"
AccessType: "RBAC"
```

---

### ✅ **CENÁRIO 2: Autor deleta próprio post**
```
Usuário: autor@example.com
- role: "user"
- id: 3

Post:
- id: 10
- authorId: 3 (é o autor!)
- reportCount: 0

Resultado esperado: ✅ PERMITIDO
Reason: "ABAC: Ownership (author)"
AccessType: "ABAC_OWNERSHIP"
```

---

### ✅ **CENÁRIO 3: Moderador deleta post com 3+ reports**
```
Usuário: moderador@example.com
- role: "moderator"
- id: 2

Post:
- id: 10
- authorId: 5 (não é o moderador)
- reportCount: 5 (≥ 3 reports!)

Resultado esperado: ✅ PERMITIDO
Reason: "ABAC: Moderator with 5 reports (threshold: 3)"
AccessType: "ABAC_MODERATION"
```

---

### ❌ **CENÁRIO 4: Moderador tenta deletar post com poucos reports**
```
Usuário: moderador@example.com
- role: "moderator"
- id: 2

Post:
- id: 10
- authorId: 5 (não é o moderador)
- reportCount: 2 (< 3 reports)

Resultado esperado: ❌ NEGADO
Reason: "Access denied: No matching authorization rule"
AccessType: "DENIED"

Log esperado:
{
  "operation": "DELETE_POST_DENIED",
  "userRole": "moderator",
  "postReportCount": 2,
  "reason": "Access denied: No matching authorization rule"
}
```

---

### ❌ **CENÁRIO 5: Usuário comum tenta deletar post de outro**
```
Usuário: outro@example.com
- role: "user"
- id: 7

Post:
- id: 10
- authorId: 3 (não é dele)
- reportCount: 10 (não importa, ele não é moderador)

Resultado esperado: ❌ NEGADO
Reason: "Access denied: No matching authorization rule"
AccessType: "DENIED"
```

---

## 🎬 **ROTEIRO DO VÍDEO (15 min)**

### **0-2 min: Introdução ao problema**
- Mostrar código atual com lógica inline
- Explicar problemas:
  - Repetição
  - Difícil de testar
  - Difícil adicionar novas regras

### **2-7 min: Criar função centralizada**
- Criar `src/lib/authorization.js`
- Explicar estrutura:
  - Admin (RBAC)
  - Owner (ABAC)
  - Moderador + reports (ABAC avançado)
- Mostrar retorno estruturado `{ allowed, reason, accessType }`

### **7-12 min: Refatorar deletePost**
- Substituir lógica inline por `canDeletePost()`
- Mostrar código antes/depois
- Destacar simplificação

### **12-15 min: Testar 5 cenários**
1. Admin → OK
2. Autor → OK
3. Moderador + 3 reports → OK
4. Moderador + 2 reports → NEGADO
5. Usuário comum → NEGADO

Mostrar logs em cada caso!

---

## 🔧 **COMO TESTAR**

### **Preparar dados no Supabase:**

```sql
-- 1. Criar usuários com roles diferentes
UPDATE "User" SET "role" = 'admin' WHERE "username" = 'admin';
UPDATE "User" SET "role" = 'moderator' WHERE "username" = 'moderador';
UPDATE "User" SET "role" = 'user' WHERE "username" = 'usuario';

-- 2. Criar post com poucos reports
UPDATE "Post" SET "reportCount" = 2 WHERE "id" = 10;

-- 3. Criar post com muitos reports
UPDATE "Post" SET "reportCount" = 5 WHERE "id" = 11;
```

### **Testar manualmente:**

1. Login como **admin** → Deletar qualquer post → ✅
2. Login como **autor** → Deletar próprio post → ✅
3. Login como **moderador** → Deletar post com `reportCount = 5` → ✅
4. Login como **moderador** → Deletar post com `reportCount = 2` → ❌
5. Login como **usuário comum** → Deletar post de outro → ❌

---

## 📊 **LOGS ESPERADOS**

### **✅ Admin (RBAC):**
```json
{
  "username": "admin",
  "role": "admin",
  "reason": "RBAC: Admin role",
  "accessType": "RBAC"
}
```

### **✅ Owner (ABAC Ownership):**
```json
{
  "username": "autor",
  "role": "user",
  "postId": 10,
  "authorId": 3,
  "reason": "ABAC: Ownership (author)",
  "accessType": "ABAC_OWNERSHIP"
}
```

### **✅ Moderador (ABAC Moderation):**
```json
{
  "username": "moderador",
  "role": "moderator",
  "reportCount": 5,
  "reason": "ABAC: Moderator with 5 reports (threshold: 3)",
  "accessType": "ABAC_MODERATION"
}
```

### **❌ Negado:**
```json
{
  "level": "error",
  "operation": "DELETE_POST_DENIED",
  "userRole": "moderator",
  "postReportCount": 2,
  "reason": "Access denied: No matching authorization rule",
  "accessType": "DENIED"
}
```

---

## 🎓 **TEORIA (Para destacar no vídeo)**

### **Benefícios da função centralizada:**

1. ✅ **Testabilidade:** Fácil criar unit tests
2. ✅ **Reutilização:** Pode usar em outros lugares
3. ✅ **Manutenção:** Regras em um único lugar
4. ✅ **Consistência:** Sem divergência entre endpoints
5. ✅ **Legibilidade:** Código autodocumentado

### **ABAC Avançado permite:**
- Combinar múltiplos atributos (`role` + `reportCount`)
- Thresholds dinâmicos
- Regras de negócio complexas
- Fácil adicionar novas condições

### **Usado em:**
- Reddit (moderação por reports)
- Discord (permissions por roles + canais)
- GitHub (maintainer + contributor)
- Stack Overflow (reputação + moderação)

---

## 📝 **MÉTRICAS DE SEGURANÇA**

| Métrica | Antes | Depois |
|---------|-------|--------|
| Linhas de código no action | ~50 | ~35 |
| Regras de autorização | Espalhadas | Centralizadas |
| Testabilidade | Difícil | Fácil |
| Reutilização | 0% | 100% |
| Clareza | Média | Alta |

