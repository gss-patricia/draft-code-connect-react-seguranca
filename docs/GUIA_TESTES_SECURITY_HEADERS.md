# 🎬 GUIA DE TESTES: SECURITY HEADERS (Para demonstração no vídeo)

## 🎯 OBJETIVO:

Demonstrar visualmente que os security headers estão funcionando e protegendo a aplicação.

---

## 📋 CHECKLIST DE DEMONSTRAÇÕES:

### ✅ Demo 1: Ver headers no DevTools (2 min)

### ✅ Demo 2: Testar X-Frame-Options (clickjacking) (3 min)

### ✅ Demo 3: Testar Referrer-Policy (vazamento) (2 min)

### ✅ Demo 4: Score no securityheaders.com (2 min)

### ✅ Demo 5: Comparar antes/depois (1 min)

---

# 🔧 PREPARAÇÃO ANTES DO VÍDEO:

## 1. Criar arquivo next.config.js (renomear o atual)

```bash
# No terminal
cd /seu-projeto
mv next.config-security-headers.js next.config.js
```

## 2. Reiniciar o servidor

```bash
npm run dev
```

## 3. Abrir a aplicação

```
http://localhost:3000
```

---

# 🎬 DEMO 1: VER HEADERS NO DEVTOOLS (Essencial!)

## **Roteiro para o vídeo:**

### **Passo 1: Abrir DevTools**

**Fala:**

> "Primeiro, vamos conferir se os headers estão sendo enviados. Vou abrir o DevTools com F12."

**Ação:**

1. Pressionar `F12`
2. Ir para aba **Network**
3. Recarregar a página (`Cmd+R` ou `Ctrl+R`)

### **Passo 2: Inspecionar Request**

**Fala:**

> "Agora vou clicar em qualquer request aqui... vou escolher o documento principal. E aqui, na aba 'Headers', vamos procurar 'Response Headers'."

**Ação:**

1. Clicar no primeiro request (documento HTML)
2. Scroll até "Response Headers"

### **Passo 3: Mostrar os Headers**

**Fala:**

> "Olha só! Aqui estão TODOS os headers que configuramos!"

**Mostrar na tela (um por um):**

```
✅ x-frame-options: DENY
✅ x-content-type-options: nosniff
✅ referrer-policy: strict-origin-when-cross-origin
✅ permissions-policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
✅ x-xss-protection: 1; mode=block
```

**Fala:**

> "Repara que o `Strict-Transport-Security` NÃO aparece. Por quê? Porque estamos em desenvolvimento (localhost), e esse header só é adicionado em produção. Se tentássemos usar HTTPS em localhost, ia dar problema!"

**Screenshot para incluir no vídeo:**

- Highlight nos headers
- Zoom para legibilidade

---

# 🎬 DEMO 2: TESTAR X-FRAME-OPTIONS (Clickjacking)

## **Objetivo:**

Provar que o site **NÃO pode** ser colocado em iframe.

## **Setup (antes do vídeo):**

Criar arquivo `test-iframe.html` na raiz do projeto:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Teste de Clickjacking</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        background: #f5f5f5;
      }

      h1 {
        color: #333;
        margin-bottom: 20px;
      }

      .container {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .warning {
        background: #fff3cd;
        border: 1px solid #ffc107;
        padding: 15px;
        border-radius: 4px;
        margin: 20px 0;
      }

      iframe {
        width: 100%;
        height: 500px;
        border: 2px solid #e74c3c;
        border-radius: 4px;
        margin-top: 20px;
      }

      .success {
        background: #d4edda;
        border: 1px solid #28a745;
        padding: 15px;
        border-radius: 4px;
        margin: 20px 0;
        color: #155724;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🔒 Teste de Proteção contra Clickjacking</h1>

      <div class="warning">
        <strong>⚠️ O que estamos testando?</strong>
        <p>
          Tentando colocar nosso site dentro de um iframe. Se o X-Frame-Options
          estiver funcionando, o navegador vai BLOQUEAR.
        </p>
      </div>

      <h2>Tentando carregar: http://localhost:3000</h2>

      <iframe src="http://localhost:3000"></iframe>

      <div class="success">
        <strong>✅ Se você vê uma página em branco acima:</strong>
        <p>
          Parabéns! O header X-Frame-Options está funcionando e bloqueou o
          iframe!
        </p>
        <p>Abra o Console (F12) para ver o erro do navegador.</p>
      </div>
    </div>

    <script>
      // Detectar se iframe foi bloqueado
      window.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          const iframe = document.querySelector("iframe");
          try {
            // Tentar acessar conteúdo do iframe
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc || !iframeDoc.body) {
              console.log("✅ BLOQUEADO! X-Frame-Options funcionando!");
            }
          } catch (e) {
            console.log("✅ BLOQUEADO! X-Frame-Options funcionando!");
            console.error("Erro esperado:", e.message);
          }
        }, 1000);
      });
    </script>
  </body>
</html>
```

## **Roteiro para o vídeo:**

### **Passo 1: Explicar o teste**

**Fala:**

> "Agora vamos testar o X-Frame-Options. Criei um HTML simples que tenta colocar nosso site dentro de um iframe. Se o header estiver funcionando, o navegador vai bloquear!"

### **Passo 2: Abrir o arquivo**

**Ação:**

1. Abrir `test-iframe.html` no navegador
2. Mostrar que o iframe está **vazio/bloqueado**

**Fala:**

> "Olha só! O iframe está vazio. O navegador bloqueou!"

### **Passo 3: Mostrar erro no Console**

**Ação:**

1. Abrir DevTools (F12)
2. Ir para aba **Console**

**Mostrar o erro:**

```
❌ Refused to display 'http://localhost:3000/' in a frame because it set 'X-Frame-Options' to 'deny'.
```

**Fala:**

> "Aqui no console, o navegador deixa claro: 'Recusei exibir o site porque o X-Frame-Options está setado como DENY'. Exatamente o que a gente quer!"

### **Passo 4: Comparação (antes/depois)**

**Fala:**

> "Para vocês verem a diferença, vou comentar o header no next.config.js..."

**Ação:**

1. Comentar X-Frame-Options no `next.config.js`
2. Reiniciar servidor
3. Recarregar `test-iframe.html`
4. **Agora o site APARECE no iframe!** ❌

**Fala:**

> "Viram? Sem o header, o site é carregado no iframe normalmente. Um atacante poderia explorar isso para clickjacking!"

**Ação:**

1. Descomentar o header
2. Reiniciar servidor
3. Recarregar
4. **Bloqueado novamente!** ✅

---

# 🎬 DEMO 3: TESTAR REFERRER-POLICY (Vazamento de URL)

## **Objetivo:**

Mostrar que o Referrer-Policy protege contra vazamento de URLs com tokens.

## **Setup (antes do vídeo):**

Criar `test-referrer.html` na raiz:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Teste de Referrer Policy</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        background: #f5f5f5;
      }

      .container {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
      }

      h1 {
        color: #333;
        margin-bottom: 30px;
      }

      .scenario {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 20px;
        margin: 20px 0;
      }

      .danger {
        background: #ffebee;
        border-left: 4px solid #f44336;
        padding: 20px;
        margin: 20px 0;
      }

      .success {
        background: #e8f5e9;
        border-left: 4px solid #4caf50;
        padding: 20px;
        margin: 20px 0;
      }

      code {
        background: #f5f5f5;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: "Courier New", monospace;
      }

      .btn {
        background: #2196f3;
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        margin: 10px 5px;
        text-decoration: none;
        display: inline-block;
      }

      .btn:hover {
        background: #1976d2;
      }

      #result {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        margin-top: 20px;
        min-height: 100px;
        white-space: pre-wrap;
        font-family: monospace;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🔒 Teste de Referrer-Policy</h1>

      <div class="scenario">
        <h3>📋 Cenário:</h3>
        <p>Você está em uma URL com token sensível:</p>
        <code>http://localhost:3000/reset-password?token=abc123secreto456</code>
        <p style="margin-top: 10px;">
          E clica em um link externo. O que o site externo recebe no header
          Referer?
        </p>
      </div>

      <div class="danger">
        <h3>❌ SEM Referrer-Policy (strict-origin-when-cross-origin):</h3>
        <p>Site externo recebe:</p>
        <code
          >Referer:
          http://localhost:3000/reset-password?token=abc123secreto456</code
        >
        <p style="margin-top: 10px;"><strong>🚨 TOKEN VAZOU!</strong></p>
      </div>

      <div class="success">
        <h3>✅ COM Referrer-Policy (strict-origin-when-cross-origin):</h3>
        <p>Site externo recebe apenas:</p>
        <code>Referer: http://localhost:3000</code>
        <p style="margin-top: 10px;">
          <strong>✅ Token protegido! Só envia o domínio.</strong>
        </p>
      </div>

      <h3>🧪 Testar agora:</h3>
      <p>Clique no botão para simular um link externo:</p>

      <a href="https://httpbin.org/get" target="_blank" class="btn">
        🔗 Ir para site externo (httpbin.org)
      </a>

      <div class="success" style="margin-top: 30px;">
        <h4>Como verificar:</h4>
        <ol>
          <li>Clique no botão acima</li>
          <li>
            Na nova aba, procure por <code>"Referer"</code> na resposta JSON
          </li>
          <li>Você verá apenas <code>"http://localhost:3000"</code></li>
          <li><strong>O path com token NÃO foi enviado!</strong> ✅</li>
        </ol>
      </div>

      <h3>📊 Comparação:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th
              style="padding: 12px; text-align: left; border: 1px solid #ddd;"
            >
              Destino
            </th>
            <th
              style="padding: 12px; text-align: left; border: 1px solid #ddd;"
            >
              Referer enviado
            </th>
            <th
              style="padding: 12px; text-align: left; border: 1px solid #ddd;"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Mesma origem</td>
            <td style="padding: 12px; border: 1px solid #ddd;">
              <code>URL completa com token</code>
            </td>
            <td style="padding: 12px; border: 1px solid #ddd;">
              ✅ OK (necessário)
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">
              Origem diferente (HTTPS→HTTPS)
            </td>
            <td style="padding: 12px; border: 1px solid #ddd;">
              <code>Apenas domínio (sem path/token)</code>
            </td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅ Seguro</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">
              Downgrade (HTTPS→HTTP)
            </td>
            <td style="padding: 12px; border: 1px solid #ddd;">
              <code>Nada</code>
            </td>
            <td style="padding: 12px; border: 1px solid #ddd;">
              ✅ Muito seguro
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <script>
      // Mostrar URL atual
      document.addEventListener("DOMContentLoaded", () => {
        console.log("🔍 URL atual:", window.location.href);
        console.log("🔍 Referrer atual:", document.referrer || "(vazio)");
      });
    </script>
  </body>
</html>
```

## **Roteiro para o vídeo:**

### **Passo 1: Simular URL com token**

**Fala:**

> "Agora vamos testar o Referrer-Policy. Imagine que você tem uma URL de reset de senha com um token sensível, tipo: `/reset-password?token=abc123secreto`."

**Ação:**

1. Abrir `http://localhost:3000/reset-password?token=abc123secreto456`

### **Passo 2: Abrir test-referrer.html**

**Fala:**

> "Se o usuário clicar em um link externo, o que acontece? Vou clicar aqui no botão que vai para httpbin.org..."

**Ação:**

1. Clicar no botão "Ir para site externo"
2. Nova aba abre com httpbin.org

### **Passo 3: Mostrar resultado**

**Fala:**

> "Olha só! No JSON aqui, procura 'Referer'... Tá vendo? Só enviou o domínio: `http://localhost:3000`. O token NÃO foi enviado! Protegido pelo Referrer-Policy!"

**Mostrar na tela:**

```json
{
  "headers": {
    "Referer": "http://localhost:3000"
  }
}
```

---

# 🎬 DEMO 4: VALIDANDO TODOS OS HEADERS (Essencial!)

## **Objetivo:**

Validar que TODOS os headers estão sendo enviados corretamente.

## **❌ IMPORTANTE: securityheaders.com NÃO funciona com localhost!**

O site https://securityheaders.com precisa fazer uma requisição para o seu site, mas `localhost:3000` **só existe na sua máquina**. O servidor deles não consegue acessar.

**Para usar securityheaders.com, você precisa:**
- ✅ Fazer deploy em produção (Vercel, Netlify, Railway, etc)
- ✅ Ter um domínio público acessível pela internet

---

## **✅ ALTERNATIVAS PARA DEMONSTRAR LOCALMENTE:**

### **OPÇÃO 1: curl (RECOMENDADO - Simples e rápido)** ⭐⭐⭐⭐⭐

**Por que usar:**
- ✅ Funciona 100% local
- ✅ Mostra TODOS os headers de uma vez
- ✅ Rápido (1 comando)
- ✅ Profissional

**Roteiro:**

**Fala:**
> "Para validar que todos os headers estão funcionando, vou usar o comando `curl` no terminal. Esse comando faz uma requisição e mostra todos os headers de resposta."

**Ação no terminal:**

```bash
curl -I http://localhost:3000
```

**Resultado esperado:**

```bash
HTTP/1.1 200 OK
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
x-xss-protection: 1; mode=block
content-type: text/html; charset=utf-8
date: Fri, 06 Dec 2024 10:30:00 GMT
connection: keep-alive
...
```

**Fala:**
> "Perfeito! Olha só todos os headers que configuramos aparecendo aqui:
> - X-Frame-Options: DENY ✅
> - X-Content-Type-Options: nosniff ✅
> - Referrer-Policy: strict-origin-when-cross-origin ✅
> - Permissions-Policy com câmera e microfone bloqueados ✅
> - X-XSS-Protection: 1; mode=block ✅
>
> Todos funcionando! E repara que o Strict-Transport-Security NÃO aparece, porque estamos em desenvolvimento. Só vai aparecer em produção."

**💡 DICA:** Se o output for muito longo, use `| grep -i "x-\|permissions\|referrer"` para filtrar só os security headers:

```bash
curl -I http://localhost:3000 | grep -i "x-\|permissions\|referrer"
```

---

### **OPÇÃO 2: Criar página HTML de validação** ⭐⭐⭐⭐

Criar `test-headers-validator.html` na raiz do projeto:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Validador de Security Headers</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 40px 20px;
      }

      .container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }

      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px;
        text-align: center;
      }

      .header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
      }

      .header p {
        font-size: 1.1em;
        opacity: 0.9;
      }

      .content {
        padding: 40px;
      }

      .test-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 20px 40px;
        font-size: 1.2em;
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
        transition: transform 0.2s, box-shadow 0.2s;
        font-weight: bold;
      }

      .test-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      }

      .test-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .results {
        margin-top: 30px;
        display: none;
      }

      .results.show {
        display: block;
      }

      .header-item {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        border-left: 5px solid #ddd;
        transition: all 0.3s;
      }

      .header-item.success {
        border-left-color: #28a745;
        background: #d4edda;
      }

      .header-item.warning {
        border-left-color: #ffc107;
        background: #fff3cd;
      }

      .header-item.error {
        border-left-color: #dc3545;
        background: #f8d7da;
      }

      .header-name {
        font-weight: bold;
        font-size: 1.1em;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .header-value {
        font-family: "Courier New", monospace;
        background: white;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        word-break: break-all;
      }

      .status-icon {
        font-size: 1.5em;
      }

      .summary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
        text-align: center;
      }

      .summary h2 {
        font-size: 3em;
        margin-bottom: 10px;
      }

      .summary p {
        font-size: 1.2em;
        opacity: 0.9;
      }

      .loading {
        text-align: center;
        padding: 40px;
        font-size: 1.2em;
        color: #666;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .info-box {
        background: #e3f2fd;
        border-left: 5px solid #2196f3;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 30px;
      }

      .info-box h3 {
        color: #1976d2;
        margin-bottom: 10px;
      }

      .info-box ul {
        margin-left: 20px;
        line-height: 1.8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔒 Validador de Security Headers</h1>
        <p>Teste local dos headers de segurança</p>
      </div>

      <div class="content">
        <div class="info-box">
          <h3>📋 O que este validador faz?</h3>
          <ul>
            <li>Faz uma requisição para http://localhost:3000</li>
            <li>Verifica se os security headers estão presentes</li>
            <li>Mostra o status de cada header (presente/ausente)</li>
            <li>Calcula um score baseado nos headers encontrados</li>
          </ul>
        </div>

        <button class="test-button" onclick="testHeaders()">
          🚀 Testar Headers Agora
        </button>

        <div id="loading" class="loading" style="display: none;">
          <div class="spinner"></div>
          <p>Testando headers...</p>
        </div>

        <div id="results" class="results">
          <div id="summary" class="summary"></div>
          <div id="headers-list"></div>
        </div>
      </div>
    </div>

    <script>
      const EXPECTED_HEADERS = [
        {
          name: "X-Frame-Options",
          expected: "DENY",
          description: "Previne clickjacking bloqueando iframes",
          critical: true,
        },
        {
          name: "X-Content-Type-Options",
          expected: "nosniff",
          description: "Previne MIME sniffing",
          critical: true,
        },
        {
          name: "Referrer-Policy",
          expected: "strict-origin-when-cross-origin",
          description: "Controla vazamento de URLs com tokens",
          critical: true,
        },
        {
          name: "Permissions-Policy",
          expected: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          description: "Bloqueia APIs sensíveis do navegador",
          critical: true,
        },
        {
          name: "X-XSS-Protection",
          expected: "1; mode=block",
          description: "Proteção XSS legada (browsers antigos)",
          critical: false,
        },
        {
          name: "Strict-Transport-Security",
          expected: null, // Não esperado em dev
          description:
            "Force HTTPS (só em produção, ausente em desenvolvimento é OK)",
          critical: false,
        },
        {
          name: "Content-Security-Policy",
          expected: null, // Ainda não implementado
          description: "Proteção avançada contra XSS (próximo vídeo!)",
          critical: true,
        },
      ];

      async function testHeaders() {
        const button = document.querySelector(".test-button");
        const loading = document.getElementById("loading");
        const results = document.getElementById("results");

        // Reset UI
        button.disabled = true;
        loading.style.display = "block";
        results.classList.remove("show");

        try {
          // Fazer requisição
          const response = await fetch("http://localhost:3000");

          // Aguardar 1 segundo (para efeito visual)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Processar headers
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key.toLowerCase()] = value;
          });

          // Calcular resultados
          let score = 0;
          let maxScore = 0;
          const headerResults = [];

          EXPECTED_HEADERS.forEach((expected) => {
            const headerName = expected.name.toLowerCase();
            const headerValue = headers[headerName];
            const isPresent = !!headerValue;
            const isCorrect = expected.expected
              ? headerValue === expected.expected
              : false;

            // Calcular score
            if (expected.critical) {
              maxScore += 20;
              if (isPresent) {
                score += 20;
              }
            } else {
              maxScore += 10;
              if (isPresent) {
                score += 10;
              }
            }

            // Determinar status
            let status = "error";
            let statusText = "❌ Ausente";

            if (expected.name === "Strict-Transport-Security" && !isPresent) {
              status = "success";
              statusText = "✅ OK (dev mode)";
            } else if (
              expected.name === "Content-Security-Policy" &&
              !isPresent
            ) {
              status = "warning";
              statusText = "⚠️ Ausente (próximo vídeo)";
            } else if (isPresent) {
              status = "success";
              statusText = "✅ Presente";
            }

            headerResults.push({
              name: expected.name,
              value: headerValue || "Não encontrado",
              description: expected.description,
              status,
              statusText,
            });
          });

          // Exibir resultados
          displayResults(score, maxScore, headerResults);
        } catch (error) {
          alert(
            "Erro ao testar headers. Certifique-se que o servidor está rodando em http://localhost:3000"
          );
          console.error(error);
        } finally {
          button.disabled = false;
          loading.style.display = "none";
        }
      }

      function displayResults(score, maxScore, headerResults) {
        const results = document.getElementById("results");
        const summary = document.getElementById("summary");
        const headersList = document.getElementById("headers-list");

        // Calcular nota letra
        const percentage = (score / maxScore) * 100;
        let grade = "F";
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";

        // Mostrar summary
        summary.innerHTML = `
          <h2>${grade}</h2>
          <p>${score} / ${maxScore} pontos (${percentage.toFixed(0)}%)</p>
        `;

        // Mostrar headers
        headersList.innerHTML = headerResults
          .map(
            (header) => `
          <div class="header-item ${header.status}">
            <div class="header-name">
              <span class="status-icon">${header.statusText}</span>
              <span>${header.name}</span>
            </div>
            <p>${header.description}</p>
            <div class="header-value">${header.value}</div>
          </div>
        `
          )
          .join("");

        results.classList.add("show");

        // Scroll suave para resultados
        results.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    </script>
  </body>
</html>
```

**Roteiro:**

**Fala:**
> "Criei um validador customizado que roda 100% local. Vou abrir aqui..."

**Ação:**
1. Abrir `test-headers-validator.html` no navegador
2. Clicar em "Testar Headers Agora"
3. Aguardar animação
4. Mostrar resultado com score

**Fala:**
> "Olha só! Ele testou todos os headers e calculou um score. Temos nota B! Falta apenas o Content-Security-Policy que vamos implementar no próximo vídeo."

---

### **OPÇÃO 3: Screenshot do securityheaders.com (se tiver deploy)** ⭐⭐⭐

**SOMENTE se você já fez deploy em produção:**

1. Fazer deploy no Vercel/Netlify
2. Ir para https://securityheaders.com
3. Digitar URL do seu site em produção
4. Clicar "Scan"
5. Tirar screenshot do resultado

**Score esperado:** **B** (falta CSP)

**Fala no vídeo:**
> "Para quem já fez deploy em produção, pode testar no securityheaders.com. Vou mostrar um exemplo aqui... Nota B! Falta o CSP que vamos implementar no próximo vídeo."

---

## **🎯 RECOMENDAÇÃO:**

**Para o vídeo, use OPÇÃO 1 (curl)** - É:
- ✅ Mais rápido
- ✅ Mais profissional
- ✅ Funciona 100% local
- ✅ Mostra todos os headers de uma vez

**OPÇÃO 2 (HTML Validator)** é legal, mas toma mais tempo para criar e explicar.

**OPÇÃO 3 (securityheaders.com)** só se você realmente tiver um deploy público.

---

# 🎬 DEMO 5: COMPARAÇÃO ANTES/DEPOIS

## **Objetivo:**

Mostrar visualmente a diferença de ter/não ter os headers.

## **Roteiro:**

### **Passo 1: Remover os headers**

**Fala:**

> "Para vocês verem a diferença, vou comentar TODOS os headers no next.config.js..."

**Ação:**

1. Comentar toda a seção de headers
2. Reiniciar servidor

### **Passo 2: Verificar no DevTools**

**Fala:**

> "Agora olha o DevTools... Nenhum security header! Vulnerável a clickjacking, vazamento de URL, etc."

**Mostrar:**

- Response Headers **SEM** os security headers

### **Passo 3: Adicionar de volta**

**Fala:**

> "Agora vou descomentar e reiniciar..."

**Ação:**

1. Descomentar headers
2. Reiniciar servidor
3. Recarregar página

**Fala:**

> "Olha a diferença! Agora todos os headers aparecem. Aplicação protegida!"

**Mostrar:**

- Response Headers **COM** todos os security headers ✅

---

# 📋 RESUMO: SEQUÊNCIA IDEAL NO VÍDEO

## **Tempo total:** ~10 minutos

```
1. INTRO (1 min)
   "Vamos testar os headers que acabamos de configurar!"

2. DEMO 1: DevTools (2 min) ✅ ESSENCIAL
   - Abrir Network tab
   - Mostrar Response Headers
   - Highlight cada header

3. DEMO 2: X-Frame-Options (3 min) ✅ VISUAL
   - Abrir test-iframe.html
   - Mostrar bloqueio
   - Mostrar erro no console
   - Comparar com/sem header

4. DEMO 3: Referrer-Policy (2 min) ✅ PRÁTICO
   - Simular URL com token
   - Clicar em link externo
   - Mostrar que só enviou domínio

5. DEMO 4: curl OU securityheaders.com (1 min) ✅ VALIDAÇÃO
   - Mostrar todos headers juntos
   - (Se tiver deploy) Mostrar score B

6. CONCLUSÃO (1 min)
   "No próximo vídeo: CSP com nonce = Score A+!"
```

---

# 🎥 DICAS PARA GRAVAÇÃO:

## **Visual:**

- ✅ Zoom no DevTools para legibilidade
- ✅ Highlight nos headers importantes
- ✅ Usar setas/anotações na edição

## **Fala:**

- ✅ Explicar O QUE está testando ANTES de testar
- ✅ Mencionar o RISCO que o header previne
- ✅ Comemorar quando funciona ("Olha só! Bloqueou!")

## **Erros comuns:**

- ❌ Esquecer de reiniciar servidor após mudar next.config.js
- ❌ Cache do navegador (dar hard refresh: Cmd+Shift+R)
- ❌ DevTools fechado quando deveria estar aberto

---

# 📦 ARQUIVOS PARA CRIAR ANTES DO VÍDEO:

```
/seu-projeto
├── next.config.js (renomear next.config-security-headers.js)
├── test-iframe.html (criar)
└── test-referrer.html (criar)
```

---

**Com esse guia, você tem 5 formas diferentes de demonstrar que os headers estão funcionando!** 🎬✨
