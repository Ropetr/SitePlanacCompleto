# 📚 Documentação Atualizada - Sistema Planac

**Data:** 11/11/2025
**Status:** Produção ✅
**Última Atualização:** Sistema de dropdown aninhado implementado

---

## 🏗️ Arquitetura Atual

### 1. **Backend API** (Cloudflare Worker)
- **URL:** https://planac-backend-api.planacacabamentos.workers.dev
- **Tipo:** Cloudflare Worker (Hono.js)
- **Status:** ✅ Online e funcionando
- **Recursos:**
  - D1 Database: `planac-database` (ce7c52fc-7aa4-4539-ac80-081d8ee16cc2)
  - R2 Bucket: `planac-images`
  - KV Namespaces: `KV_CACHE`, `KV_SESSIONS`, `SITE_CACHE`

### 2. **Admin Panel** (Cloudflare Pages)
- **URL:** https://planac-admin.pages.dev
- **Tipo:** React + Vite (SPA)
- **Status:** ✅ Integrado ao Git
- **Repositório:** `SitePlanacCompleto` branch `main`
- **Deploy:** Automático via Git push
- **Pasta:** `planac-admin/`

### 3. **Site Público** (Cloudflare Pages)
- **URL:** https://siteplanaccompleto.pages.dev
- **Tipo:** HTML + JS (páginas estáticas geradas)
- **Status:** ✅ Funcionando

---

## 📊 Dados Atuais

### Menus (10 total)
1. **Home** - Página inicial
2. **Divisórias** - 2 páginas
3. **Drywall** - Divisórias de gesso
4. **Forros** - 8 páginas + 1 submenu
   - **Forro Modular** (submenu) - 4 páginas
5. **Isolamento Termoacústico** - 4 páginas
6. **Kits de Portas** - 3 páginas
7. **Rodapés** - 1 página
8. **Sobre** - Institucional
9. **Contato** - Formulário

### Páginas (19 total)

#### Home (1)
- Página Inicial (`index`)

#### Divisórias (2)
- Divisória Naval (`divisoria-naval-page`)
- Divisória de Gesso Acartonado (`drywall-divisoria-page`)

#### Forros (4 diretos + 4 no submenu)
**Diretos no menu Forros:**
- Forro de Gesso Acartonado (`forro-de-gesso-acartonado`)
- Forro Vinílico REVID (`forro-vinilico-revid`)
- PVC Branco (`pvc-branco-page`)
- PVC Amadeirado (`pvc-amadeirado-page`)

**No submenu "Forro Modular":**
- Forro de Gesso Modular (`forro-de-gesso-modular`)
- Forro de Isopor (`isopor-page`)
- Forro Mineral (`mineral-page`)
- Forro de PVC Modular (`forro-de-pvc-modular`)

#### Isolamento Termoacústico (4)
- Lã de Rocha (`la-rocha-page`)
- Lã de Vidro (`la-vidro-page`)
- Lã de Pet (`la-pet-page`)
- Manta Térmica Aluminizada (`manta-termica`)

#### Kits de Portas (3)
- Kit Porta (`kit-porta`)
- Kit Porta de Correr (`kit-porta-correr`)
- Portas Sanfonadas (`portas-sanfonadas`)

#### Rodapés (1)
- Rodapés (`rodapes`)

---

## 🔄 Sistema de Auto-Deploy ✨ NOVO

### Como Funciona (Atualizado em 11/11/2025)

**O sistema agora é 100% automático!** Toda operação CRUD aciona rebuild do header:

1. **Usuário realiza ação no Admin:**
   - Criar página/menu
   - Editar página/menu
   - Ativar/desativar menu ou página
   - Excluir página/menu

2. **Backend automaticamente:**
   - Salva alteração no D1
   - Aciona `triggerBuildDeploy()` via `POST /api/internal/build-deploy`

3. **Build-Deploy Worker:**
   - Busca menus ativos do D1
   - Busca produtos (páginas) publicados do D1
   - Gera `header.html` dinâmico com estrutura de menus **hierárquica**
   - Cria dropdowns aninhados para submenus
   - Salva no KV cache (`SITE_CACHE`)
   - Invalida cache (timestamp)

4. **Resultado:**
   - Header atualizado em tempo real
   - Mudanças visíveis imediatamente no site

### Endpoints Relacionados

- **POST** `/api/internal/build-deploy` - Aciona build/deploy (interno, sem JWT)
- **GET** `/api/admin/build-deploy/status` - Status do último build (requer JWT)
- **GET** `/api/pages/header` - Serve header do KV cache (público)

### Operações que Acionam Auto-Deploy

✅ **CREATE** - Criar produto ou menu
✅ **UPDATE** - Editar produto ou menu (incluindo ativar/desativar)
✅ **DELETE** - Excluir produto ou menu

---

## 🎨 Funcionalidades do Admin

### Menus
- ✅ Criar, editar, excluir menus
- ✅ **Hierarquia completa (menus e submenus com dropdown aninhado)**
- ✅ Visualização hierárquica com indentação
- ✅ Ícones visuais (📁 menu, 📄 submenu)
- ✅ Botão rápido para adicionar submenu
- ✅ Campo "ativo" para ativar/desativar
- ✅ Reordenação por campo "ordem"
- ✅ **Auto-deploy ao salvar/editar/excluir**

### Páginas (Products)
- ✅ Criar, editar, excluir páginas
- ✅ Campos completos (nome, descrição, características, etc.)
- ✅ Associação com menus/submenus
- ✅ Status: RASCUNHO, PUBLICADO, ARQUIVADO
- ✅ Campo "destaque"
- ✅ Upload de imagens (banner e galeria) para R2
- ✅ SEO (meta title, description, keywords)
- ✅ **Auto-deploy ao salvar/editar/excluir**

### Outros
- ✅ Dashboard com estatísticas
- ✅ Upload de imagens para R2
- ✅ Gerenciamento de orçamentos
- ✅ Gerenciamento de contatos
- ✅ Sistema de autenticação (JWT)

---

## 🎯 Sistema de Dropdown Aninhado ✨ NOVO

### Desktop
```
Forros (hover)
├── Forro Modular → (hover abre à direita)
│   ├── Forro de Gesso Modular
│   ├── Forro de Isopor
│   ├── Forro Mineral
│   └── Forro de PVC Modular
├── Forro de Gesso Acartonado
├── Forro Vinílico REVID
└── ...
```

### Classes CSS Usadas
- **Desktop:** `.dropdown-submenu` + `.dropdown-menu-sub`
- **Mobile:** `.mobile-menu-submenu`

### Comportamento
- **Automático:** Qualquer submenu com produtos gera dropdown aninhado
- **Sem produtos:** Submenu aparece como link direto
- **Responsivo:** Funciona em desktop e mobile

---

## 🗂️ Estrutura de Banco de Dados

### Tabela: `menus`
```sql
- id (TEXT, PK)
- nome (TEXT, NOT NULL)
- slug (TEXT, NOT NULL, UNIQUE)
- descricao (TEXT)
- icone (TEXT) -- emoji ou URL
- menu_pai_id (TEXT) -- FK para menus.id (NULL = menu principal)
- ordem (INTEGER, default 0)
- ativo (INTEGER, default 1) -- 1=ativo, 0=inativo
- metadata (TEXT) -- JSON
- created_at (DATETIME)
- updated_at (DATETIME)
```

### Tabela: `products` (páginas)
```sql
- id (TEXT, PK)
- nome (TEXT, NOT NULL)
- slug (TEXT, NOT NULL, UNIQUE)
- subtitulo (TEXT)
- descricao_curta (TEXT)
- descricao_completa (TEXT)
- caracteristicas (TEXT) -- JSON array
- vantagens (TEXT) -- JSON array
- aplicacoes (TEXT) -- JSON array
- especificacoes (TEXT) -- JSON
- normas_certificacoes (TEXT) -- JSON array
- imagem_banner (TEXT) -- URL
- galeria_imagens (TEXT) -- JSON array
- video_url (TEXT)
- meta_title (TEXT)
- meta_description (TEXT)
- meta_keywords (TEXT)
- ordem (INTEGER, default 0)
- destaque (INTEGER, default 0) -- 1=destaque, 0=normal
- status (TEXT, default 'RASCUNHO') -- RASCUNHO, PUBLICADO, ARQUIVADO
- menu_id (TEXT, NOT NULL) -- FK para menus.id (pode ser menu ou submenu)
- created_by_id (TEXT, NOT NULL) -- FK para users.id
- updated_by_id (TEXT)
- published_at (DATETIME)
- created_at (DATETIME)
- updated_at (DATETIME)
```

---

## 🚀 Fluxo de Trabalho

### Atualizar Admin
```bash
cd planac-admin
# Fazer alterações nos arquivos
git add .
git commit -m "Descrição da alteração"
git push
# Deploy automático acontece!
```

### Atualizar Backend
```bash
cd planac-backend
# Fazer alterações
npx wrangler deploy
```

### Atualizar Site Público (Manual - se necessário)
```bash
# 1. Gerar páginas estáticas (busca header do KV)
node build-static-pages.js

# 2. Deploy
npx wrangler pages deploy dist --project-name siteplanaccompleto
```

---

## 🔐 Variáveis de Ambiente

### Backend (Secrets)
Configure via `wrangler secret put`:
```bash
wrangler secret put JWT_SECRET
wrangler secret put JWT_REFRESH_SECRET
wrangler secret put ADMIN_EMAIL
wrangler secret put ADMIN_PASSWORD
```

### Admin (Build Variables)
Configurado no Cloudflare Pages:
```
VITE_API_URL=https://planac-backend-api.planacacabamentos.workers.dev
```

---

## 📝 Melhorias Implementadas (11/11/2025)

### ✅ Dropdown Aninhado para Submenus
- Submenus agora criam dropdown dentro de dropdown
- Desktop: hover abre submenu à direita
- Mobile: tap expande submenu com animação
- Geração automática via `build-deploy.js`

### ✅ Auto-Deploy Completo
- Todas operações CRUD acionam rebuild do header
- CREATE, UPDATE, DELETE em produtos e menus
- Header atualizado em tempo real

### ✅ Correção de Renderização de Submenus
- Submenus sem produtos aparecem como links
- Submenus com produtos criam dropdown aninhado
- Estrutura hierárquica respeitada

### ✅ Sistema de Submenus (implementado anteriormente)
- Visualização hierárquica com indentação
- Fundo azul claro para submenus
- Ícones diferenciados (📁 menu, 📄 submenu)
- Botão rápido "+" para adicionar submenu
- Modal com destaque visual para criação de submenu

### ✅ Validator Corrigido
- Removida validação `.uuid()` que impedia IDs customizados
- Suporte para `menu_pai_id` (snake_case)
- Validações flexíveis para `ordem` e `ativo`

### ✅ Integração Git
- Admin agora está no Git e faz deploy automático
- Build configurado corretamente via Cloudflare Pages

---

## 🐛 Pendências

### ⏳ Melhorias Futuras:
- [ ] Toggle visual para ativar/desativar menus (atualmente via campo de texto)
- [ ] Toggle visual para ativar/desativar páginas
- [ ] Drag-and-drop para reordenar menus
- [ ] Preview de páginas antes de publicar
- [ ] Versionamento de conteúdo
- [ ] Bulk actions (editar múltiplos itens)
- [ ] Editor rich text para descrições
- [ ] Sistema de busca no admin

---

## 📞 Suporte

### Logs do Backend
```bash
cd planac-backend
npx wrangler tail
```

### Verificar KV Cache
```bash
npx wrangler kv:key get "header.html" \
  --namespace-id="e8d8225292f9453db316a0a6566dec7d"
```

### Testar API
```bash
curl https://planac-backend-api.planacacabamentos.workers.dev/health
```

### Forçar Rebuild do Header (se necessário)
```bash
curl -X POST https://planac-backend-api.planacacabamentos.workers.dev/api/internal/build-deploy
```

---

## 📚 Documentação Adicional

- `README.md` - Visão geral do projeto
- `DOCUMENTACAO-COMPLETA.md` - Documentação técnica completa
- `SISTEMA-AUTO-DEPLOY.md` - Detalhes do sistema de deploy automático
- `MELHORIAS-SUBMENUS.md` - Melhorias na visualização de submenus
- `COMO-ADICIONAR-MENUS.md` - Guia para adicionar menus
- `BUILD-README.md` - Sistema de build estático

---

## 🎯 Commits Recentes

```
97ba4a8 - feat: Implementa dropdown aninhado para submenus
d51ed53 - fix: Adiciona triggerBuildDeploy ao DELETE de produtos e menus
440ace0 - fix: Corrige renderização de submenus sem produtos no header
```

---

**Última atualização:** 11/11/2025
**Versão do sistema:** 1.1.0
**Status:** ✅ Sistema em Produção com Dropdown Aninhado Funcional
