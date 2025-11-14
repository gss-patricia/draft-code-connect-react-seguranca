# 🚀 Guia Prático de Implementação - Curso de Segurança

## 📋 Setup Inicial

### 1. Preparar Repositório

```bash
# Criar branch projeto-base a partir da main atual
git checkout main
git branch projeto-base
git push origin projeto-base

# Criar primeira branch de módulo
git checkout -b modulo-01-fundamentos
```

### 2. Estrutura de Pastas a Criar

```
docs/
  ├── security/
  │   ├── SECURITY_AUDIT.md
  │   ├── XSS_ATTACK_DEMO.md
  │   ├── CSRF_ATTACK_DEMO.md
  │   └── REFRESH_TOKEN_FLOW.md
  └── csrf-attack-demo/
      └── malicious-site.html

src/
  ├── lib/
  │   ├── csrf.js
  │   ├── sanitize.js
  │   ├── logSanitizer.js
  │   ├── tokenSecurity.js
  │   ├── deviceFingerprint.js
  │   ├── abac.js
  │   ├── permissions.js
  │   ├── cors.js
  │   ├── csp.js
  │   └── securityAlerts.js
  ├── middleware/
  │   └── rbac.js
  ├── actions/
  │   ├── posts.js
  │   ├── comments.js
  │   ├── passwordReset.js
  │   ├── moderation.js
  │   └── admin/
  │       └── users.js
  ├── components/
  │   ├── ProfileEdit/
  │   ├── UserBio/
  │   ├── DeletePostButton/
  │   ├── EditCommentButton/
  │   ├── PinPostButton/
  │   ├── ModerationPanel/
  │   ├── AdminNav/
  │   ├── AdminLayout/
  │   ├── UserManagement/
  │   └── SecurityLogs/
  └── app/
      ├── profile/edit/
      ├── reset-password/
      ├── moderacao/
      └── admin/
          ├── users/
          └── security/

supabase/
  ├── migrations/
  │   ├── 002_add_user_bio.sql
  │   ├── 003_password_reset_tokens.sql
  │   ├── 004_token_binding.sql
  │   ├── 005_add_roles.sql
  │   └── 006_user_ban.sql
  └── seeds/
      └── 002_permissions.sql

scripts/
  ├── security-scan.sh
  └── pre-commit-security.sh

.github/
  └── workflows/
      └── security.yml
```

---

## 🎬 Workflow de Gravação

### Antes de Gravar

```bash
# 1. Verificar branch correta
git branch --show-current

# 2. Verificar estado limpo
git status

# 3. Pull latest (se necessário)
git pull origin modulo-XX

# 4. Verificar se servidor está rodando
npm run dev
```

### Durante a Gravação

1. **Explicar o conceito** (teoria)
2. **Mostrar o problema** (se aplicável)
3. **Implementar a solução** (código)
4. **Testar** (demonstração)
5. **Explicar o código** (revisão)

### Depois de Gravar

```bash
# 1. Verificar mudanças
git status
git diff

# 2. Adicionar arquivos
git add .

# 3. Commit com mensagem padronizada
git commit -m "feat(xss): adiciona sanitização com DOMPurify"

# 4. Criar tag do vídeo
git tag -a video-2.4 -m "Vídeo 2.4: Corrigindo com Sanitização"

# 5. Push branch e tags
git push origin modulo-02-xss
git push origin video-2.4

# 6. Atualizar checklist
# Marcar vídeo como concluído no PLANO_CURSO_SEGURANCA.md
```

---

## 📝 Templates de Mensagens de Commit

### Adicionando Nova Funcionalidade

```bash
git commit -m "feat(<módulo>): <descrição>

- Adiciona <funcionalidade>
- Implementa <feature>
- Cria <componente/arquivo>

Vídeo: X.Y - <Título do Vídeo>
Módulo: <Nome do Módulo>"
```

**Exemplo:**
```bash
git commit -m "feat(xss): adiciona campo de bio vulnerável

- Adiciona coluna bio na tabela User
- Cria formulário de edição de perfil
- Renderiza bio com dangerouslySetInnerHTML

Vídeo: 2.2 - Criando Campo de Bio (Vulnerável)
Módulo: Proteção contra XSS"
```

### Corrigindo Vulnerabilidade

```bash
git commit -m "fix(<módulo>): corrige <vulnerabilidade>

- Implementa <solução>
- Adiciona <proteção>
- Remove <código inseguro>

Vídeo: X.Y - <Título do Vídeo>
Módulo: <Nome do Módulo>"
```

**Exemplo:**
```bash
git commit -m "fix(csrf): implementa proteção com tokens

- Adiciona geração de CSRF tokens
- Implementa validação no servidor
- Configura SameSite cookies

Vídeo: 3.4 - Implementando Proteção CSRF
Módulo: Proteção contra CSRF"
```

### Adicionando Documentação

```bash
git commit -m "docs(<módulo>): adiciona documentação de <tópico>

- Documenta <conceito>
- Adiciona exemplos de <uso>
- Cria guia de <implementação>

Vídeo: X.Y - <Título do Vídeo>
Módulo: <Nome do Módulo>"
```

### Adicionando Testes

```bash
git commit -m "test(<módulo>): adiciona testes de <funcionalidade>

- Testa <cenário>
- Adiciona casos de teste para <feature>
- Implementa testes de segurança

Vídeo: X.Y - <Título do Vídeo>
Módulo: <Nome do Módulo>"
```

---

## 🔍 Comandos Úteis para Revisão

### Navegar pelos Commits

```bash
# Listar todos os vídeos (tags)
git tag -l "video-*"

# Ver commit de um vídeo específico
git show video-2.3

# Ver apenas arquivos modificados
git show video-2.3 --stat

# Ver diff completo
git show video-2.3 --patch

# Checkout em estado de um vídeo
git checkout video-2.3

# Voltar para última versão
git checkout modulo-02-xss
```

### Comparar Vídeos

```bash
# Diff entre dois vídeos
git diff video-2.2 video-2.3

# Ver apenas arquivos alterados
git diff video-2.2 video-2.3 --name-only

# Ver estatísticas
git diff video-2.2 video-2.3 --stat

# Diff de arquivo específico
git diff video-2.2 video-2.3 -- src/components/UserBio/index.jsx
```

### Logs e Histórico

```bash
# Log formatado por módulo
git log --oneline modulo-02-xss

# Log com tags
git log --oneline --decorate

# Log gráfico
git log --oneline --graph --all

# Log de um arquivo específico
git log --oneline -- src/lib/sanitize.js

# Ver quem modificou cada linha
git blame src/lib/sanitize.js
```

### Buscar no Histórico

```bash
# Buscar por mensagem de commit
git log --grep="XSS"

# Buscar por autor
git log --author="Patricia"

# Buscar por código
git log -S "DOMPurify" --source --all

# Buscar por data
git log --since="2025-01-01" --until="2025-02-01"
```

---

## 📊 Checklist de Qualidade por Vídeo

### ✅ Antes do Commit

- [ ] Código compila sem erros
- [ ] Linter passa sem warnings críticos
- [ ] Funcionalidade testada manualmente
- [ ] Logs de debug removidos
- [ ] Comentários desnecessários removidos
- [ ] Formatação consistente (Prettier)
- [ ] Imports organizados

### ✅ Mensagem de Commit

- [ ] Tipo correto (feat/fix/docs/test)
- [ ] Módulo especificado
- [ ] Descrição clara e concisa
- [ ] Corpo do commit com detalhes (se necessário)
- [ ] Referência ao vídeo incluída

### ✅ Documentação

- [ ] README atualizado (se necessário)
- [ ] Comentários no código (quando pertinente)
- [ ] Documentação técnica criada/atualizada
- [ ] Exemplos de uso incluídos

---

## 🎯 Estratégia de Branches

### Branch Principal

```
main (código final completo)
```

### Branches de Projeto

```
projeto-base (ponto de partida do curso)
```

### Branches de Módulo

```
modulo-01-fundamentos
modulo-02-oauth-tokens
modulo-03-rbac-abac
modulo-04-cors-headers
modulo-05-deploy
```

### Workflow de Merge

```bash
# Ao finalizar um módulo
git checkout main
git merge modulo-01-fundamentos --no-ff -m "Merge módulo 1: Fundamentos e Proteção"
git push origin main

# Criar próximo módulo
git checkout -b modulo-02-oauth-tokens
```

---

## 🔄 Sincronização entre Máquinas

### Configurar Remote

```bash
# Adicionar remote (se necessário)
git remote add origin https://github.com/user/repo.git

# Verificar remotes
git remote -v
```

### Pull com Tags

```bash
# Pull da branch atual
git pull origin modulo-01-fundamentos

# Pull de todas as tags
git fetch --tags

# Pull de tudo
git pull --all
```

### Push com Tags

```bash
# Push da branch
git push origin modulo-01-fundamentos

# Push de todas as tags
git push origin --tags

# Push de tag específica
git push origin video-1.2

# Push de tudo
git push origin --all
git push origin --tags
```

---

## 🐛 Troubleshooting

### Commit no Branch Errado

```bash
# Ver último commit
git log -1

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Mudar para branch correto
git checkout branch-correto

# Fazer commit novamente
git add .
git commit -m "mensagem"
```

### Tag Criada Errada

```bash
# Deletar tag local
git tag -d video-1.3

# Deletar tag remote
git push origin :refs/tags/video-1.3

# Criar tag correta
git tag -a video-1.3 -m "Mensagem correta"
git push origin video-1.3
```

### Merge Conflict

```bash
# Resolver conflitos nos arquivos
# Depois:
git add .
git commit -m "resolve: merge conflicts"
```

### Desfazer Push (CUIDADO!)

```bash
# Reverter commit local
git revert HEAD

# Push do revert
git push origin branch-name

# OU Force push (apenas se ninguém mais usa)
git reset --hard HEAD~1
git push origin branch-name --force
```

---

## 📈 Tracking de Progresso

### Script de Progresso

```bash
#!/bin/bash
# progress.sh

echo "📊 Progresso do Curso de Segurança"
echo ""

# Contar vídeos completados
TOTAL_VIDEOS=27
COMPLETED=$(git tag -l "video-*" | wc -l)
PERCENTAGE=$((COMPLETED * 100 / TOTAL_VIDEOS))

echo "Vídeos: $COMPLETED / $TOTAL_VIDEOS ($PERCENTAGE%)"
echo ""

# Listar módulos
echo "📚 Módulos:"
git branch -a | grep "modulo-" | while read branch; do
    echo "  - $branch"
done

echo ""
echo "🏷️  Últimas tags:"
git tag -l "video-*" | tail -5
```

### Executar

```bash
chmod +x progress.sh
./progress.sh
```

---

## 📝 Notas Importantes

### DOs ✅

- **SEMPRE** testar antes de commitar
- **SEMPRE** usar mensagens descritivas
- **SEMPRE** criar tags para vídeos
- **SEMPRE** documentar mudanças significativas
- **SEMPRE** manter branches organizadas

### DON'Ts ❌

- **NUNCA** commitar código que não compila
- **NUNCA** fazer force push sem certeza
- **NUNCA** deletar tags/branches sem backup
- **NUNCA** commitar secrets/tokens
- **NUNCA** misturar múltiplos vídeos em um commit

---

## 🎓 Dicas de Produtividade

### Aliases Úteis

```bash
# Adicionar ao ~/.gitconfig ou ~/.bashrc

alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push origin $(git branch --show-current)'
alias gl='git log --oneline --graph --all'
alias gt='git tag -l "video-*"'
alias gd='git diff'
```

### Template de Commit

```bash
# Criar arquivo .gitmessage
cat > ~/.gitmessage << 'EOF'
<tipo>(<módulo>): <descrição curta>

- 
- 

Vídeo: X.Y - 
Módulo: 
EOF

# Configurar template
git config --global commit.template ~/.gitmessage
```

---

## 🚀 Próximos Passos

1. ✅ Revisar PLANO_CURSO_SEGURANCA.md
2. ✅ Preparar ambiente de desenvolvimento
3. ✅ Criar branch projeto-base
4. ⏳ Iniciar Módulo 1
5. ⏳ Gravar primeiro vídeo
6. ⏳ Fazer primeiro commit

---

**Última Atualização**: 2025-01-12  
**Versão**: 1.0.0

