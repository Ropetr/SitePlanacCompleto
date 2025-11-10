# 📚 Documentação Atualizada - Sistema Planac

**Data:** 10/11/2025
**Status:** Produção ✅

---

## 🏗️ Arquitetura Atual

### 1. **Backend API** (Cloudflare Worker)
- **URL:** https://planac-backend-api.planacacabamentos.workers.dev
- **Tipo:** Cloudflare Worker (Hono.js)
- **Status:** ✅ Online e funcionando
- **Recursos:**
  - D1 Database: `planac-database`
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
4. **Forros** - 9 páginas (maior categoria)
5. **Isolamento Termoacústico** - 4 páginas
6. **Kits de Portas** - 3 páginas
7. **Rodapés** - 1 página
8. **Sobre** - Institucional
9. **Contato** - Formulário
10. *(Submenus podem existir)*

### Páginas (20 total)

#### Home (1)
- Página Inicial (`index`)

#### Divisórias (2)
- Divisória Naval (`divisoria-naval-page`)
- Divisória de Gesso Acartonado (`drywall-divisoria-page`)

#### Forros (9)
- Forro de Gesso Acartonado Completo (`planac-forro-gesso-completo`)
- Gesso Modular (`planac-gesso-modular`)
- Forro Vinílico (`forro-vinilico-revid`)
- Forros (página geral) (`forrovid-page`)
- Forro de Isopor (`isopor-page`)
- Forro Mineral (`mineral-page`)
- PVC Modular (`pvc-modular-page`)
- PVC Branco (`pvc-branco-page`)
- PVC Amadeirado (`pvc-amadeirado-page`)

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

## 🔄 Sistema de Auto-Deploy

### Como Funciona

1. **Usuário salva no Admin** (cria/edita menu ou página)
2. **Backend salva no D1** e aciona `triggerBuildDeploy()`
3. **Build-Deploy Worker:**
   - Busca menus ativos do D1
   - Busca produtos (páginas) publicados do D1
   - Gera `header.html` dinâmico com estrutura de menus
   - Salva no KV cache (`SITE_CACHE`)
   - Invalida cache (timestamp)
4. **Build estático:**
   - Script `build-static-pages.js` busca header do KV
   - Gera páginas HTML otimizadas (dist/)
5. **Deploy manual** (quando necessário):
   ```bash
   node build-static-pages.js
   npx wrangler pages deploy dist --project-name siteplanaccompleto
   ```

### Endpoints Relacionados

- **POST** `/api/admin/build-deploy` - Aciona build/deploy
- **GET** `/api/admin/build-deploy/status` - Status do último build
- **GET** `/api/pages/header` - Serve header do KV cache (público)

---

## 🎨 Funcionalidades do Admin

### Menus
- ✅ Criar, editar, excluir menus
- ✅ Hierarquia (menus e submenus)
- ✅ Visualização hierárquica com indentação
- ✅ Ícones visuais (📁 menu, 📄 submenu)
- ✅ Botão rápido para adicionar submenu
- ✅ Campo "ativo" (mas sem toggle visual ainda)
- ✅ Reordenação por campo "ordem"

### Páginas (Products)
- ✅ Criar, editar, excluir páginas
- ✅ Campos completos (nome, descrição, características, etc.)
- ✅ Associação com menus
- ✅ Status: RASCUNHO, PUBLICADO, ARQUIVADO
- ✅ Campo "destaque"
- ✅ Upload de imagens (banner e galeria)
- ✅ SEO (meta title, description, keywords)

### Outros
- ✅ Dashboard com estatísticas
- ✅ Upload de imagens para R2
- ✅ Gerenciamento de orçamentos
- ✅ Gerenciamento de contatos
- ✅ Sistema de autenticação (JWT)

---

## 🗂️ Estrutura de Banco de Dados

### Tabela: `menus`
```sql
- id (TEXT, PK)
- nome (TEXT, NOT NULL)
- slug (TEXT, NOT NULL, UNIQUE)
- descricao (TEXT)
- icone (TEXT) -- emoji ou URL
- menu_pai_id (TEXT) -- FK para menus.id
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
- menu_id (TEXT, NOT NULL) -- FK para menus.id
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

### Atualizar Site Público
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

## 📝 Melhorias Implementadas Recentemente

### ✅ Sistema de Submenus
- Visualização hierárquica com indentação
- Fundo azul claro para submenus
- Ícones diferenciados (pasta vs arquivo)
- Botão rápido "+" para adicionar submenu
- Modal com destaque visual para criação de submenu

### ✅ Validator Corrigido
- Removida validação `.uuid()` que impedia IDs customizados
- Suporte para `menu_pai_id` (snake_case)
- Validações flexíveis para `ordem` e `ativo`

### ✅ Integração Git
- Admin agora está no Git e faz deploy automático
- Removido `wrangler.toml` da raiz que causava conflito
- Build configurado corretamente via Cloudflare Pages

### ✅ Restauração de Páginas
- 10 páginas que foram removidas acidentalmente foram restauradas
- Total: 20 páginas completas no sistema

---

## 🐛 Problemas Conhecidos

### ❌ Não implementado ainda:
- [ ] Toggle visual para ativar/desativar menus
- [ ] Toggle visual para ativar/desativar páginas
- [ ] Drag-and-drop para reordenar menus
- [ ] Preview de páginas antes de publicar
- [ ] Versionamento de conteúdo
- [ ] Bulk actions (editar múltiplos itens)

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

---

## 📚 Documentação Adicional

- `SISTEMA-AUTO-DEPLOY.md` - Detalhes do sistema de deploy automático
- `MELHORIAS-SUBMENUS.md` - Melhorias na visualização de submenus
- `COMO-ADICIONAR-MENUS.md` - Guia para adicionar menus
- `BUILD-README.md` - Sistema de build estático

---

**Última atualização:** 10/11/2025
**Versão do sistema:** 1.0.0
