# 📋 CHANGELOG - Sistema Planac

Todas as mudanças notáveis do projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.1.0] - 11/11/2025

### ✨ Adicionado
- **Dropdown Aninhado para Submenus**
  - Submenus agora criam dropdown dentro de dropdown no site
  - Desktop: hover no submenu abre lista de produtos à direita
  - Mobile: tap no submenu expande lista com animação
  - Funciona automaticamente para qualquer submenu com produtos
  - Classes CSS: `.dropdown-submenu`, `.dropdown-menu-sub`, `.mobile-menu-submenu`

- **Auto-Deploy Completo em Todas Operações CRUD**
  - DELETE de produtos agora aciona `triggerBuildDeploy()`
  - DELETE de menus agora aciona `triggerBuildDeploy()`
  - Header atualizado automaticamente em CREATE, UPDATE e DELETE

### 🔧 Corrigido
- **Renderização de Submenus sem Produtos**
  - Submenus vazios agora aparecem como links diretos
  - Submenus com produtos criam dropdown aninhado automaticamente
  - Estrutura hierárquica correta: Menu → Submenu → Produtos

- **Visibilidade do Submenu "Forro Modular"**
  - Submenu agora aparece corretamente no dropdown de "Forros"
  - 4 produtos associados renderizam em dropdown aninhado

### 📝 Documentação
- Atualizado `DOCUMENTACAO-STATUS-ATUAL.md` com informações de dropdown aninhado
- Criado `CHANGELOG.md` para rastrear mudanças

### 🛠️ Arquivos Modificados
- `planac-backend/src/routes/build-deploy.js` - Lógica de dropdown aninhado
- `planac-backend/src/routes/products.js` - Auto-deploy no DELETE
- `planac-backend/src/routes/menus.js` - Auto-deploy no DELETE

---

## [1.0.0] - 10/11/2025

### ✨ Adicionado
- **Sistema Completo de CMS**
  - Backend API (Cloudflare Workers + Hono.js)
  - Admin Panel (React + Vite + TailwindCSS)
  - Site Público (HTML estático otimizado)

- **Banco de Dados D1**
  - 8 tabelas: users, menus, products, media, quotes, contacts, audit_logs, sessions
  - 10 menus principais
  - 20 páginas de produtos

- **Sistema de Menus Hierárquicos**
  - Menus principais e submenus
  - Visualização hierárquica com indentação
  - Ícones visuais (📁 menu, 📄 submenu)
  - Botão rápido para adicionar submenu

- **Sistema de Auto-Deploy**
  - `triggerBuildDeploy()` em CREATE e UPDATE
  - Header dinâmico gerado e salvo em KV cache
  - Endpoint `/api/internal/build-deploy` para rebuild manual

- **Upload de Imagens**
  - Upload para Cloudflare R2
  - Suporte para banner e galeria
  - Conversão automática para WebP

- **Autenticação JWT**
  - Login com email e senha
  - Access token e refresh token
  - Proteção de rotas admin

### 🎨 Melhorias
- **Sistema de Build Estático**
  - `build-static-pages.js` injeta header/footer inline
  - Eliminação de CLS (Cumulative Layout Shift)
  - Preload automático de imagens críticas
  - 21 páginas otimizadas geradas em `/dist`

- **Dashboard Admin**
  - Estatísticas de produtos, menus, orçamentos
  - Visualização de orçamentos e contatos
  - Interface responsiva

### 🔐 Segurança
- Senhas com bcrypt (12 rounds)
- JWT com expiração configurável
- CORS configurado
- Logs de auditoria

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas funcionalidades
- `🔧 Corrigido` - Correções de bugs
- `🛠️ Modificado` - Mudanças em funcionalidades existentes
- `🗑️ Removido` - Funcionalidades removidas
- `🔐 Segurança` - Correções de vulnerabilidades
- `📝 Documentação` - Mudanças apenas em documentação
- `🎨 Melhorias` - Melhorias de código/performance

---

## Links

- [Documentação Completa](./DOCUMENTACAO-COMPLETA.md)
- [Status Atual](./DOCUMENTACAO-STATUS-ATUAL.md)
- [Sistema Auto-Deploy](./SISTEMA-AUTO-DEPLOY.md)
- [Repositório GitHub](https://github.com/Ropetr/SitePlanacCompleto)

---

**Mantido por:** Claude Code Assistant
**Projeto:** Planac Distribuidora - Sistema CMS
