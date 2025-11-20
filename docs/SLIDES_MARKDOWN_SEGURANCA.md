# 🎬 Slides: Markdown vs HTML (Para Vídeo 1.6 ou 1.7)

Use esses slides para explicar **teoricamente** (sem implementar) como plataformas de código lidam com segurança.

---

## 📊 SLIDE 1: O Desafio

```
🚨 DESAFIO: Code Connect é uma rede de DEVS

Devs compartilham:
- Tutoriais React/Next.js
- Código HTML, CSS, JavaScript
- Exemplos com event handlers

PROBLEMA:
Como permitir compartilhar código SEM criar XSS?
```

---

## 📊 SLIDE 2: Solução ERRADA

```
❌ TENTATIVA: HTML Direto + Sanitização

Dev escreve:
<button onClick="alert('Hello')">Click</button>

DOMPurify processa:
<button>Click</button>  ← onClick REMOVIDO! 😱

PROBLEMA:
→ Código de exemplo foi DESTRUÍDO
→ Não serve para ensinar
→ Inútil para rede de devs
```

---

## 📊 SLIDE 3: Solução CORRETA

````
✅ SOLUÇÃO: Markdown + Blocos de Código

Dev escreve:
```javascript
<button onClick="alert('Hello')">Click</button>
````

Resultado no navegador:
<code>&lt;button onClick="alert('Hello')"&gt;</code>

VANTAGENS:
→ Código é EXIBIDO (não executado) ✅
→ 100% seguro ✅
→ Usuário pode copiar o código ✅

```

---

## 📊 SLIDE 4: Como a Indústria Faz

```

🏢 GRANDES PLATAFORMAS:

GitHub → Markdown + ```language
Stack Overflow → Markdown + indentação
Dev.to → Markdown + Front Matter
Reddit → Markdown

TODOS: Código em blocos é ESCAPADO automaticamente

```

---

## 📊 SLIDE 5: Arquitetura Code Connect

```

📝 ESTRATÉGIA: Separar por Tipo de Conteúdo

┌─────────────────────────────────────┐
│ 👤 BIO (Pessoal) │
│ Formato: HTML │
│ Segurança: DOMPurify (Camada 1+2) │
│ Tags: <p>, <strong>, <a> │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📝 POSTS (Tutoriais) │
│ Formato: Markdown │
│ Segurança: Blocos ``` escapados │
│ Código: Exibido, não executado │
└─────────────────────────────────────┘

```

---

## 📊 SLIDE 6: Demonstração de Segurança

```

🧪 TESTE: Atacante tenta injetar XSS em Post

Input:

```javascript
<script>alert('XSS!')</script>
```

Renderizado:
&lt;script&gt;alert('XSS!')&lt;/script&gt;

Resultado:
✅ Script NÃO executa
✅ Exibido como TEXTO
✅ SEGURO!

```

---

## 📊 SLIDE 7: Por que Não Sanitizamos Posts?

```

❓ PERGUNTA: Por que posts não usam DOMPurify?

RESPOSTA:
→ Posts estão em Markdown
→ Blocos ``` escapam HTML automaticamente
→ Código é TEXTO (não HTML executável)
→ Navegador não executa texto escapado

CONCLUSÃO:
✅ DOMPurify → Apenas em BIOS (HTML rico)
❌ DOMPurify → NÃO em POSTS (Markdown)

```

---

## 📊 SLIDE 8: Resumo Final

```

✅ ESTRATÉGIA CODE CONNECT:

1. Bio → HTML + DOMPurify

   - Permite formatação pessoal
   - Remove código malicioso

2. Posts → Markdown + Blocos ```

   - Permite compartilhar código
   - Escapa automaticamente

3. Comentários → Texto puro
   - React escapa por padrão
   - Sem HTML

RESULTADO: Seguro + Funcional! 🚀

````

---

## 🎤 Roteiro de Fala Sugerido

### Introdução (30 segundos)

> "Até agora, vimos como proteger a **bio do usuário** com DOMPurify. Mas surge uma pergunta: **e os posts?** Code Connect é uma rede social de devs. Como permitir que eles compartilhem **código HTML e JavaScript** sem criar vulnerabilidades?"

### O Problema (1 minuto)

> "Se usarmos a mesma estratégia — permitir HTML e sanitizar com DOMPurify — temos um problema. Olhem: um dev quer ensinar sobre `onClick` em React. Ele escreve `<button onClick="alert('Hello')">`. O DOMPurify **remove o onClick** porque parece um ataque XSS! O código de exemplo foi **destruído**. Isso não funciona para uma plataforma de devs."

### A Solução (1 minuto 30 segundos)

> "A solução que **GitHub, Stack Overflow e Dev.to** usam é simples: **Markdown com blocos de código**. Quando você escreve código entre três crases — ` ```javascript ` — o sistema **escapa o HTML automaticamente**. Isso significa que `<script>` vira `&lt;script&gt;`. É **texto**, não HTML executável. O navegador **não executa**, mas o usuário **vê o código** e pode copiá-lo."

### Arquitetura do Projeto (1 minuto)

> "No nosso Code Connect, usamos uma estratégia mista:
> - **Bios** → HTML rico limitado + DOMPurify (duas camadas)
> - **Posts** → Markdown com blocos de código (seguro por padrão)
> - **Comentários** → Texto puro (React escapa)
>
> Isso significa que **não precisamos** sanitizar posts com DOMPurify! Eles já são seguros porque estão em Markdown."

### Demonstração (30 segundos)

> "Olhem um exemplo real. Se um atacante tenta injetar `<script>alert('XSS')</script>` dentro de um bloco de código, o Markdown **escapa automaticamente**. O script é exibido como **texto**, nunca executa. É **100% seguro**."

### Conclusão (30 segundos)

> "Resumindo: quando você precisa permitir **formatação pessoal** (negrito, links), use **HTML + DOMPurify**. Quando você precisa permitir **compartilhar código**, use **Markdown com blocos de código**. Essa é a estratégia da indústria, e é o que usamos no Code Connect."

---

## 💡 Dicas de Apresentação

1. ✅ **Use exemplos visuais** → Mostre código antes/depois
2. ✅ **Compare com GitHub** → "Vocês já usaram GitHub Issues? É exatamente isso!"
3. ✅ **Enfatize o trade-off** → Segurança vs Funcionalidade resolvido
4. ✅ **Não implemente** → Apenas explique teoricamente (slides)
5. ✅ **Tempo total**: 4-5 minutos

---

## ✅ Checklist Final

- [ ] Slides preparados (use esses textos)
- [ ] Exemplos visuais (screenshots do GitHub/Stack Overflow)
- [ ] Tempo: ~5 minutos
- [ ] Não precisa implementar nada
- [ ] Foco: ensinar o conceito, não o código

**Pronto para usar no curso!** 🎓🚀

````
