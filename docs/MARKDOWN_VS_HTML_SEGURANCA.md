# 📝 Markdown vs HTML: Segurança em Plataformas de Código

Este documento explica por que plataformas de compartilhamento de código (como Code Connect) usam **Markdown** em vez de **HTML direto**, e como isso resolve o conflito entre segurança e funcionalidade.

---

## ⚠️ O Problema: Compartilhar Código com Segurança

### Cenário Real

**Code Connect** é uma rede social onde desenvolvedores compartilham:
- Tutoriais de React/Next.js
- Snippets de código
- Exemplos de HTML, CSS, JavaScript

**Desafio:**
> Como permitir que devs compartilhem código HTML/JavaScript **sem criar vulnerabilidades XSS**?

---

## ❌ Solução Incorreta: HTML + Sanitização

### Tentativa 1: Permitir HTML Direto

```javascript
// Dev quer compartilhar este código:
const example = `
  <button onClick={() => alert('Hello')}>
    Click me
  </button>
`;
```

### Problema: DOMPurify Remove o Código

```javascript
// Input (o que o dev escreveu)
<button onClick={() => alert('Hello')}>Click me</button>

// Depois de sanitizar com DOMPurify
<button>Click me</button>  // ❌ onClick foi removido!

// Problema: O exemplo de código foi DESTRUÍDO!
```

### Por que Isso Acontece?

DOMPurify **não diferencia** entre:
- Código malicioso (ataque XSS)
- Código de exemplo (tutorial)

Ambos parecem iguais e são removidos! 😱

---

## ✅ Solução Correta: Markdown + Blocos de Código

### Como Funciona

Usuário escreve em **Markdown**:

````markdown
# Tutorial: Eventos em React

Aqui está um exemplo de onClick:

```javascript
<button onClick={() => alert('Hello')}>
  Click me
</button>
```

O evento `onClick` dispara quando o botão é clicado.
````

### O que Acontece Internamente

```
┌─────────────────────────────────────────────┐
│ USUÁRIO ESCREVE MARKDOWN                    │
│ ```javascript                               │
│ <button onClick="...">                      │
│ ```                                         │
└──────────────────┬──────────────────────────┘
                   │
                   ↓ (salva no banco)
┌─────────────────────────────────────────────┐
│ BANCO DE DADOS                              │
│ markdown: "```javascript\n<button..."      │
└──────────────────┬──────────────────────────┘
                   │
                   ↓ (renderiza)
┌─────────────────────────────────────────────┐
│ NAVEGADOR (HTML Escapado)                   │
│ <pre><code class="language-javascript">    │
│   &lt;button onClick="..."&gt;              │
│ </code></pre>                               │
│                                             │
│ Usuário VÊ: <button onClick="...">         │
│ Navegador NÃO EXECUTA ✅                    │
└─────────────────────────────────────────────┘
```

---

## 🔍 Diferença Técnica: HTML Executável vs HTML Escapado

### HTML Executável (PERIGO!)

```html
<button onclick="alert('XSS')">Click</button>
```

**No DOM:**
- Tag `<button>` é criada
- Atributo `onclick` é anexado
- JavaScript **EXECUTA** quando clicado ❌

### HTML Escapado (SEGURO!)

```html
&lt;button onclick="alert('XSS')"&gt;Click&lt;/button&gt;
```

**No DOM:**
- **Nenhuma** tag é criada
- Apenas **texto** é renderizado
- JavaScript **NÃO EXECUTA** ✅

**Visual no navegador:**
```
<button onclick="alert('XSS')">Click</button>
```
(é texto, não um botão clicável)

---

## 📊 Como Grandes Plataformas Fazem

| Plataforma | Formato | Segurança |
|------------|---------|-----------|
| **GitHub** | Markdown + ` ```language ` | ✅ Escapa código automaticamente |
| **Stack Overflow** | Markdown + indentação (4 espaços) | ✅ Escapa código automaticamente |
| **Dev.to** | Markdown + Front Matter | ✅ Escapa código automaticamente |
| **Medium** | Rich text editor (limitado) | ⚠️ Remove tags perigosas |
| **Reddit** | Markdown | ✅ Escapa código automaticamente |

**Padrão da indústria:** Markdown + blocos de código

---

## 🛡️ Arquitetura de Segurança do Code Connect

### Estratégia: Separar Conteúdo por Tipo

```
┌─────────────────────────────────────────────┐
│ 👤 USER BIO (HTML Rico Limitado)           │
│ Formato: HTML                               │
│ Uso: Formatação pessoal (negrito, links)   │
│ Segurança: DOMPurify (Camada 1 + 2)       │
│ Tags permitidas: p, strong, em, a, ul, ol  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📝 POSTS (Tutoriais com Código)            │
│ Formato: Markdown                           │
│ Uso: Compartilhar tutoriais e código       │
│ Segurança: Markdown escapa automaticamente │
│ Blocos de código: ``` são escapados       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 💬 COMENTÁRIOS (Texto Simples)             │
│ Formato: Texto puro                         │
│ Uso: Discussões rápidas                    │
│ Segurança: React escapa por padrão         │
│ HTML: Não renderiza                         │
└─────────────────────────────────────────────┘
```

---

## 🧪 Demonstração de Segurança

### Teste 1: HTML Malicioso em Post (Markdown)

**Input do atacante:**
````markdown
```javascript
<script>alert('XSS Ataque!')</script>
```
````

**Salvo no banco:**
```
```javascript
<script>alert('XSS Ataque!')</script>
```
```

**Renderizado no navegador:**
```html
<pre><code class="language-javascript">
  &lt;script&gt;alert('XSS Ataque!')&lt;/script&gt;
</code></pre>
```

**Resultado:**
- ✅ Script **NÃO EXECUTA**
- ✅ Código é **exibido como texto**
- ✅ Seguro!

---

### Teste 2: HTML Malicioso na Bio (HTML Rico)

**Input do atacante:**
```html
<script>alert('XSS Ataque!')</script>
```

**Camada 1 (ao salvar):**
```javascript
const cleanBio = sanitizeBio(rawBio);
// DOMPurify remove <script>
// cleanBio = "" (vazio)
```

**Salvo no banco:**
```
null (ou string vazia)
```

**Renderizado:**
```
(nada - bio está vazia)
```

**Resultado:**
- ✅ Script **removido ao salvar**
- ✅ Banco **nunca contém código malicioso**
- ✅ Seguro!

---

## 🎓 Para o Curso: Estrutura Pedagógica

### Vídeo 1.4: Problema - XSS no UserBio

**Demonstrar:**
- Bio aceita HTML malicioso
- `<script>alert(document.cookie)</script>`
- Cookies expostos → sessão roubada

**Explicar:**
> "Este é um ataque XSS clássico. Vamos corrigir!"

---

### Vídeo 1.5: Solução - Sanitização com DOMPurify

**Implementar:**
- Camada 1: Sanitizar ao salvar (`src/actions/profile.js`)
- Camada 2: Sanitizar ao renderizar (`src/components/UserBio/index.jsx`)
- Usar `isomorphic-dompurify`

**Testar:**
- Tentar injetar `<script>` → bloqueado ✅
- HTML legítimo (`<strong>`) → funciona ✅

---

### Vídeo 1.6 (ou Slide): Conteúdo de Código

**Mostrar Problema (Slide):**
```
E se usuários precisam compartilhar CÓDIGO?

Exemplo: Dev quer ensinar React
<button onClick="...">Click</button>

DOMPurify remove:
<button>Click</button>  ← Código destruído! 😱
```

**Mostrar Solução (Slide):**
```
✅ GitHub/Stack Overflow: MARKDOWN

Usuário escreve:
```javascript
<button onClick="...">
```

Resultado:
- Código exibido (não executado) ✅
- Seguro ✅
- Funcional ✅
```

**Explicar Arquitetura do Code Connect:**
> "Nossos posts já usam Markdown com blocos de código.
> Isso significa que estão SEGUROS por padrão!
> Não precisamos sanitizar posts, apenas bios."

---

## 📝 Resumo: Quando Usar Cada Abordagem

| Caso de Uso | Solução | Segurança |
|-------------|---------|-----------|
| **Bio pessoal** | HTML + DOMPurify | Tags permitidas (p, strong, a) |
| **Posts/Tutoriais** | Markdown + blocos ` ``` ` | Código escapado automaticamente |
| **Comentários** | Texto puro (React) | HTML não renderiza |
| **Rich editor (futuro)** | React Markdown + Syntax Highlighter | Escapa + destaca código |

---

## 🔗 Referências

- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Stack Overflow Markdown](https://stackoverflow.com/editing-help)
- [ReactMarkdown](https://github.com/remarkjs/react-markdown)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## ✅ Conclusão

**Code Connect usa a estratégia ideal:**
1. ✅ **Bios**: HTML limitado + DOMPurify (Camada 1 + 2)
2. ✅ **Posts**: Markdown + blocos de código (seguro por padrão)
3. ✅ **Comentários**: Texto puro (React escapa)

**Resultado:** Segurança + Funcionalidade + Padrão da Indústria! 🚀🔒

