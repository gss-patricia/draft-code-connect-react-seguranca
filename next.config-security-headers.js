// next.config.js - Security Headers Configuration
// Baseado em: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

/**
 * 🔒 SECURITY HEADERS - Configuração no Next.js
 *
 * Olha só, aqui vamos configurar os security headers de forma BEM simples!
 * No Next.js, a gente pode fazer isso direto no next.config.js usando a função headers().
 *
 * Por quê aqui e não no middleware?
 * - Headers ESTÁTICOS (que nunca mudam) vão aqui
 * - Melhor performance (aplicado em build time, não em cada request)
 * - Mais simples (declarativo, sem lógica complexa)
 *
 * Referências:
 * - OWASP Security Headers: https://owasp.org/www-project-secure-headers/
 * - Security Headers Checker: https://securityheaders.com
 * - Next.js Docs: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
 */

module.exports = {
  async headers() {
    // A função headers() retorna um array de objetos
    // Cada objeto tem um "source" (rota) e "headers" (array de headers)
    return [
      {
        // source: "/:path*" significa "TODAS as rotas"
        // O asterisco (*) é um wildcard que captura qualquer caminho
        source: "/:path*",

        // Aqui vem a lista de headers que queremos adicionar
        headers: [
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🔥 HEADER 1: Content-Security-Policy (CSP)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          //
          // Esse é o header MAIS IMPORTANTE para prevenir XSS!
          // Ele diz ao navegador de onde ele pode carregar scripts, estilos, imagens, etc.
          //
          // 🎯 O QUE É CSP?
          // Content Security Policy é uma "lista de permissões" para o navegador.
          // Você diz: "Só pode executar scripts que vêm de 'self' (mesmo domínio)".
          // Se alguém injetar <script src="http://hacker.com/roubar.js"></script>,
          // o navegador BLOQUEIA! 🛡️
          //
          // 📋 DIRETIVAS QUE USAMOS:
          //
          // 1. default-src 'self'
          //    → Por padrão, só carrega recursos do mesmo domínio
          //
          // 2. script-src 'self' 'unsafe-eval' 'unsafe-inline'
          //    → Scripts: permite do mesmo domínio + eval() + inline
          //    ⚠️ 'unsafe-inline' e 'unsafe-eval' são menos seguros,
          //    mas necessários para Next.js e bibliotecas modernas
          //    💡 Alternativa mais segura: usar NONCE (mais complexo)
          //
          // 3. style-src 'self' 'unsafe-inline'
          //    → Estilos: permite do mesmo domínio + inline (CSS-in-JS)
          //
          // 4. img-src 'self' data: https:
          //    → Imagens: permite do mesmo domínio + data URIs + qualquer HTTPS
          //
          // 5. font-src 'self'
          //    → Fontes: só do mesmo domínio
          //
          // 6. connect-src 'self' https://*.supabase.co
          //    → APIs: permite mesmo domínio + Supabase (para fetch/XHR)
          //
          // 7. frame-ancestors 'none'
          //    → NÃO permite iframe (igual X-Frame-Options: DENY)
          //
          // 8. base-uri 'self'
          //    → Tag <base> só pode apontar para mesmo domínio
          //
          // 9. form-action 'self'
          //    → Forms só podem submeter para mesmo domínio
          //
          // 10. object-src 'none'
          //     → Bloqueia <object>, <embed>, <applet> (obsoletos e perigosos)
          //
          // 🎓 POR QUE 'unsafe-inline' e 'unsafe-eval'?
          // - Next.js usa scripts inline para hydration
          // - Bibliotecas de CSS-in-JS precisam de estilos inline
          // - Algumas libs usam eval() para performance
          //
          // Idealmente, usaríamos NONCE (um token único por request):
          // script-src 'nonce-abc123'
          // Mas isso exige middleware e torna TODA a app dinâmica.
          //
          // Para este curso, CSP com unsafe-inline JÁ É MUITO BOM! ✅
          // Ainda bloqueia a maioria dos ataques XSS.
          //
          // 📊 IMPACTO:
          // Com CSP configurado, tentativas de XSS como:
          // <script>alert('xss')</script>
          // <img src=x onerror="alert('xss')">
          // Serão BLOQUEADAS pelo navegador! 🎉
          //
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🔥 HEADER 2: X-Frame-Options (Anti-Clickjacking)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          //
          // Esse header previne CLICKJACKING.
          // O que é clickjacking? É quando um atacante coloca seu site
          // dentro de um iframe invisível e engana o usuário para clicar
          // em algo que ele não quer.
          //
          // Exemplo de ataque:
          // 1. Atacante cria site malicioso
          // 2. Coloca seu site em iframe invisível
          // 3. Usuário acha que está clicando em "Ganhar prêmio"
          // 4. Na verdade está clicando em "Deletar conta" no seu site!
          //
          // Valores possíveis:
          // - DENY: Não permite iframe NUNCA (mais seguro)
          // - SAMEORIGIN: Permite iframe apenas no mesmo domínio
          //
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🔥 HEADER 3: X-Content-Type-Options (Anti-MIME Sniffing)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          //
          // Esse header previne MIME SNIFFING.
          // O que é MIME sniffing? É quando o navegador tenta "adivinhar"
          // o tipo de arquivo, ignorando o Content-Type que você declarou.
          //
          // Por que isso é perigoso?
          // 1. Você sobe uma imagem maliciosa (image.jpg)
          // 2. Na verdade, contém código JavaScript
          // 3. Navegador "adivinha" errado e executa como JS
          // 4. XSS! 💥
          //
          // Com nosniff, você força o navegador a RESPEITAR o Content-Type.
          // Se você disse que é imagem, é imagem. Não tenta executar como JS.
          //
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🔥 HEADER 4: Referrer-Policy (Controle de Vazamento de URL)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          //
          // Esse header controla QUANTO de informação é enviada no Referer.
          // O que é Referer? É o header que diz "de onde você veio".
          //
          // Por que é perigoso?
          // Imagine que você tem uma URL assim:
          // https://meuapp.com/reset-password?token=abc123secreto
          //
          // Se o usuário clicar em um link externo, o navegador envia:
          // Referer: https://meuapp.com/reset-password?token=abc123secreto
          // ❌ Vazou o token para site externo!
          //
          // Com "strict-origin-when-cross-origin":
          // - Mesma origem: envia URL completa ✅
          // - Origem diferente: envia SÓ o domínio (https://meuapp.com) ✅
          // - Downgrade HTTPS→HTTP: não envia nada ✅
          //
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🔥 HEADER 5: Permissions-Policy (Bloqueia APIs Sensíveis)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          //
          // Esse header desabilita APIs sensíveis do navegador.
          // Por padrão, qualquer site pode PEDIR acesso à câmera, microfone, etc.
          //
          // Problema:
          // - Script malicioso injetado pede acesso à câmera
          // - Usuário desavisado permite
          // - Atacante está vendo/ouvindo tudo 👀
          //
          // Com Permissions-Policy, você BLOQUEIA essas APIs:
          // - camera=() → Câmera desabilitada
          // - microphone=() → Microfone desabilitado
          // - geolocation=() → Geolocalização desabilitada
          // - interest-cohort=() → Bloqueia FLoC (tracking do Google)
          //
          // Se seu app não usa câmera/mic, não tem por que permitir!
          //
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🔥 HEADER 6: X-XSS-Protection (Legado, mas ainda útil)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          //
          // Esse header é LEGADO. Browsers modernos ignoram porque têm CSP.
          // Mas ainda mantemos para browsers ANTIGOS (IE, Edge antigo).
          //
          // O que faz?
          // - Detecta scripts maliciosos refletidos na URL
          // - Bloqueia a execução
          //
          // Exemplo:
          // URL: https://site.com?search=<script>alert('xss')</script>
          // Navegador: "Opa, script suspeito! Vou bloquear!"
          //
          // Valores:
          // - 1; mode=block → Detecta e BLOQUEIA a página inteira
          //
          // Nota: CSP (próximo vídeo) é MUITO melhor! Mas esse não faz mal.
          //
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🔥 HEADER 6: Strict-Transport-Security (HSTS - Force HTTPS)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          //
          // ⚠️ ATENÇÃO! Esse header é PERIGOSO se usado errado!
          //
          // O que faz?
          // Força o navegador a SEMPRE usar HTTPS por 1 ano (31536000 segundos).
          // Uma vez que o usuário visita seu site, o navegador LEMBRA:
          // "Ah, esse site só aceita HTTPS! Vou sempre usar HTTPS!"
          //
          // Por que é importante?
          // Previne DOWNGRADE ATTACKS:
          // 1. Atacante intercepta conexão
          // 2. Tenta forçar HTTP (não criptografado)
          // 3. HSTS: "Não! Só aceito HTTPS!" ✅
          //
          // ⚠️ CUIDADOS:
          // 1. SÓ ATIVE EM PRODUÇÃO! (localhost não tem HTTPS)
          // 2. Certifique-se que HTTPS está funcionando ANTES!
          // 3. Se ativar sem HTTPS, site fica INACESSÍVEL por 1 ano! 💀
          //
          // Valores:
          // - max-age=31536000 → 1 ano
          // - includeSubDomains → Aplica em subdomínios também
          // - preload → Inclui no preload list do Chrome (permanente!)
          //
          // Por isso usamos condicional (só em produção):
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]
            : []),
          // ⚠️ Em desenvolvimento, esse header NÃO é adicionado!
        ],
      },
    ];
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📝 NOTAS IMPORTANTES PARA O VÍDEO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 💡 POR QUE USAR next.config.js E NÃO MIDDLEWARE?
 *
 * Boa pergunta! Aqui no next.config.js, os headers são aplicados em BUILD TIME.
 * Isso significa que o Next.js já adiciona esses headers quando compila sua app.
 *
 * Vantagens:
 * ✅ Melhor performance (não executa código em cada request)
 * ✅ Mais simples (declarativo, sem lógica)
 * ✅ Funciona para assets estáticos também
 *
 * Quando NÃO usar next.config.js:
 * ❌ Se o header precisa ser DINÂMICO (ex: valor muda por request)
 * ❌ Se precisa de lógica condicional complexa
 * ❌ Se precisa ler dados do request (cookies, headers, etc)
 *
 * Exemplo: CSP com nonce
 * - Nonce precisa ser DIFERENTE em cada request
 * - Precisa gerar crypto.randomUUID() dinamicamente
 * - Logo, CSP vai no MIDDLEWARE, não aqui!
 */

/**
 * 🎯 TESTANDO OS HEADERS
 *
 * Depois de implementar, vamos testar!
 *
 * 1. Reiniciar o servidor:
 *    npm run dev
 *
 * 2. Abrir DevTools (F12) → Network
 *    Recarregar a página
 *    Clicar em qualquer request
 *    Ver "Response Headers"
 *    Você vai ver TODOS os headers que configuramos aqui! ✅
 *
 * 3. Testar no securityheaders.com:
 *    - Deploy em produção (Vercel, etc)
 *    - Abrir https://securityheaders.com
 *    - Digitar a URL do seu site
 *    - Score esperado: B (porque ainda falta o CSP)
 *
 * 4. No próximo vídeo:
 *    Vamos adicionar CSP com nonce no middleware
 *    Score esperado: A+ 🎉
 */

/**
 * ⚠️ HEADERS QUE NÃO INCLUÍMOS (e por quê)
 *
 * 1. Content-Security-Policy (CSP)
 *    Por quê não está aqui? Porque precisa de NONCE DINÂMICO.
 *    Vamos implementar no MIDDLEWARE (próximo vídeo).
 *
 * 2. CORS (Access-Control-Allow-Origin)
 *    Por quê não está aqui? Porque NESTE PROJETO não precisamos!
 *    Nosso frontend e backend estão na MESMA ORIGEM (Next.js full-stack).
 *    Se fosse necessário, implementaríamos no middleware (para validar origin).
 *
 * 3. X-DNS-Prefetch-Control
 *    Por quê não está aqui? Trade-off entre performance e privacidade.
 *    DNS prefetching MELHORA performance (pré-resolve domínios).
 *    Mas pode vazar informações (quais domínios você acessa).
 *    Para apps normais, não vale a pena desabilitar.
 *
 * 4. Expect-CT
 *    Por quê não está aqui? OBSOLETO! Deprecated.
 *    Certificados são validados automaticamente hoje em dia.
 */

/**
 * 📚 REFERÊNCIAS PARA APRENDER MAIS
 *
 * OWASP Security Headers:
 * https://owasp.org/www-project-secure-headers/
 *
 * Security Headers Checker:
 * https://securityheaders.com
 *
 * Next.js Headers Docs:
 * https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
 *
 * MDN - HTTP Headers:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 */
