# 🔄 FLUXOGRAMA DO SISTEMA ADMIN PLANAC

## 📋 FLUXOGRAMA COMPLETO - GESTÃO DE PÁGINAS

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN PANEL (REACT)                         │
│                   https://planac-admin.pages.dev                    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Login
                                   ↓
                    ┌──────────────────────────┐
                    │   Autenticação (JWT)     │
                    │  POST /api/auth/login    │
                    └──────────────────────────┘
                                   │
                                   │ Token válido
                                   ↓
        ┌──────────────────────────────────────────────────┐
        │              MENU PRINCIPAL                      │
        ├──────────────────────────────────────────────────┤
        │  • Dashboard                                     │
        │  • Páginas ← VOCÊ ESTÁ AQUI                     │
        │  • Menus                                         │
        │  • Orçamentos                                    │
        │  • Contatos                                      │
        └──────────────────────────────────────────────────┘
                                   │
                                   │ Clica em "Páginas"
                                   ↓
┌───────────────────────────────────────────────────────────────────────┐
│                    TELA: PÁGINAS (Products.jsx)                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  🔍 [Buscar páginas...]  📊 [Status: Todos ▾]  ☑ Mostrar inativos  │
│  ➕ [Nova Página]                                                     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ LISTA DE PÁGINAS                                                │ │
│  ├────────────────┬────────────┬─────────┬──────────┬──────────────┤ │
│  │ Página         │ Menu       │ Status  │ Publicar │ Ações        │ │
│  ├────────────────┼────────────┼─────────┼──────────┼──────────────┤ │
│  │ 🖼️ Divisória   │ Divisórias │ ✅ PUB  │ [🟢━━━━] │ ✏️ Editar 🗑️│ │
│  │    Naval       │            │         │          │              │ │
│  ├────────────────┼────────────┼─────────┼──────────┼──────────────┤ │
│  │ 🖼️ Forro Gesso │ Forros     │ ⚠️ RAS  │ [━━━━🔴] │ ✏️ Editar 🗑️│ │
│  │    Acartonado  │            │         │          │              │ │
│  └────────────────┴────────────┴─────────┴──────────┴──────────────┘ │
│                                                                       │
│  Estados possíveis:                                                  │
│  • 🟢 PUBLICADO (aparece no site)                                   │
│  • ⚠️ RASCUNHO (oculto do site)                                     │
│  • 📦 ARQUIVADO (oculto do site)                                    │
└───────────────────────────────────────────────────────────────────────┘
        │                     │                      │
        │ ➕ Nova Página      │ ✏️ Editar            │ Toggle Publicar
        ↓                     ↓                      ↓
┌────────────────┐  ┌──────────────────┐  ┌─────────────────────────┐
│  Modal Vazio   │  │  Modal Preenchido│  │  Alternar Status        │
│                │  │  com dados       │  │  PUBLICADO ↔ RASCUNHO   │
└────────────────┘  └──────────────────┘  └─────────────────────────┘
        │                     │                      │
        └─────────────────────┴──────────────────────┘
                              │
                              │ Submete formulário
                              ↓
        ┌──────────────────────────────────────────────┐
        │         BACKEND API (Hono Worker)            │
        │  planac-backend-api.planacacabamentos.       │
        │              workers.dev                     │
        └──────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
        ↓ POST                ↓ PUT                  ↓ DELETE
  ┌─────────────┐    ┌─────────────┐       ┌─────────────┐
  │   CRIAR     │    │  ATUALIZAR  │       │   EXCLUIR   │
  │  /products  │    │ /products/  │       │ /products/  │
  │             │    │     {id}    │       │     {id}    │
  └─────────────┘    └─────────────┘       └─────────────┘
        │                     │                      │
        │ Valida dados        │ Busca existente     │ Busca existente
        │ Gera slug único     │ Valida dados        │ Remove do D1
        │ Insere no D1        │ Atualiza no D1      │
        │                     │                      │
        └─────────────────────┴──────────────────────┘
                              │
                              │ Chama rebuildPage(pageId, env)
                              ↓
        ┌──────────────────────────────────────────────┐
        │       PAGE BUILDER (page-builder.js)         │
        ├──────────────────────────────────────────────┤
        │  1. Busca página no D1 Database              │
        │  2. Verifica STATUS da página                │
        │                                              │
        │  ┌────────────────────────────────────────┐ │
        │  │ if (status === 'PUBLICADO') {          │ │
        │  │   ✅ Gerar HTML completo               │ │
        │  │   ✅ Salvar no KV: page:{slug}        │ │
        │  │ } else {                                │ │
        │  │   ❌ Remover do KV: page:{slug}        │ │
        │  │ }                                       │ │
        │  └────────────────────────────────────────┘ │
        └──────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴──────────────────────┐
        │                                            │
        ↓ Status = PUBLICADO                        ↓ Status ≠ PUBLICADO
┌─────────────────────┐                  ┌─────────────────────┐
│  Gera HTML Completo │                  │   Remove do Cache   │
├─────────────────────┤                  ├─────────────────────┤
│ 1. Busca header do  │                  │  DELETE no KV:      │
│    KV (header.html) │                  │  page:{slug}        │
│ 2. Busca footer do  │                  │                     │
│    KV (footer.html) │                  │  Página sumirá:     │
│ 3. Monta template   │                  │  • Do site          │
│ 4. Insere dados     │                  │  • Dos menus        │
│ 5. Retorna HTML     │                  │  • Retorna 404      │
└─────────────────────┘                  └─────────────────────┘
         │
         │ PUT no KV Cache
         ↓
┌──────────────────────────────┐
│     CLOUDFLARE KV            │
│   Namespace: SITE_CACHE      │
├──────────────────────────────┤
│  Key: page:{slug}            │
│  Value: HTML completo        │
│  Metadata:                   │
│    - pageId                  │
│    - slug                    │
│    - status                  │
│    - updatedAt               │
└──────────────────────────────┘
                │
                │ Aciona Build/Deploy
                ↓
┌──────────────────────────────────────────┐
│    TRIGGER BUILD DEPLOY                  │
│  POST /api/internal/build-deploy         │
├──────────────────────────────────────────┤
│  1. Busca menus ativos (ativo = 1)       │
│  2. Busca produtos PUBLICADOS            │
│  3. Gera header.html dinâmico            │
│     • Desktop menu                       │
│     • Mobile menu                        │
│  4. Salva no KV: header.html             │
│  5. Invalida cache                       │
└──────────────────────────────────────────┘
                │
                │ Header atualizado no KV
                ↓
┌──────────────────────────────────────────┐
│         SITE PÚBLICO                     │
│  https://siteplanaccompleto.pages.dev    │
├──────────────────────────────────────────┤
│  1. Carrega header.html do KV            │
│  2. Menus atualizados automaticamente    │
│  3. Páginas inativas NÃO aparecem        │
│  4. Links funcionam 100%                 │
└──────────────────────────────────────────┘
```

---

## 🎯 FLUXO DE NAVEGAÇÃO DO USUÁRIO NO ADMIN

```
┌───────────────┐
│   LOGIN       │
│ admin/planac  │
└───────┬───────┘
        │
        ↓
┌───────────────┐      ┌─────────────┐
│  DASHBOARD    │─────→│  ESTATÍSTICAS│
│  (Home)       │      │  • Páginas   │
└───────┬───────┘      │  • Visitantes│
        │              └─────────────┘
        ↓
┌───────────────────────────────────────┐
│         MENU LATERAL                  │
├───────────────────────────────────────┤
│  📊 Dashboard                         │
│  📄 Páginas ← PRINCIPAL               │
│  📂 Menus                             │
│  💬 Orçamentos                        │
│  ✉️ Contatos                          │
│  🚪 Sair                              │
└───────────────────────────────────────┘
        │
        ↓ Clica em "Páginas"
┌────────────────────────────────────────┐
│      TELA: GESTÃO DE PÁGINAS          │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ AÇÕES DISPONÍVEIS:               │ │
│  ├──────────────────────────────────┤ │
│  │ 1. ➕ CRIAR NOVA PÁGINA          │ │
│  │ 2. ✏️  EDITAR PÁGINA EXISTENTE   │ │
│  │ 3. 🗑️  EXCLUIR PÁGINA            │ │
│  │ 4. 🔄 TOGGLE PUBLICAR/INATIVAR   │ │
│  │ 5. 🔍 BUSCAR PÁGINAS             │ │
│  │ 6. 📊 FILTRAR POR STATUS         │ │
│  │ 7. ☑️  MOSTRAR/OCULTAR INATIVOS  │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## 📝 MODAL DE EDIÇÃO DE PÁGINA

```
┌─────────────────────────────────────────────────────┐
│              EDITAR PÁGINA                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📋 INFORMAÇÕES BÁSICAS                            │
│  ┌────────────────────────────────────────────┐   │
│  │ Nome da Página: [_____________________]    │   │
│  │ Subtítulo:      [_____________________]    │   │
│  │ Menu:           [Selecionar menu ▾]        │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  🖼️  IMAGENS                                       │
│  ┌────────────────────────────────────────────┐   │
│  │ Banner:   [📤 Upload] ou [URL]            │   │
│  │ Galeria:  [📤 Upload múltiplo]            │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  📝 CONTEÚDO                                       │
│  ┌────────────────────────────────────────────┐   │
│  │ Descrição Curta:    [Textarea]             │   │
│  │ Descrição Completa: [Textarea]             │   │
│  │ Características:    [Textarea - lista]     │   │
│  │ Vantagens:          [Textarea - lista]     │   │
│  │ Aplicações:         [Textarea - lista]     │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  🔧 CONFIGURAÇÕES                                  │
│  ┌────────────────────────────────────────────┐   │
│  │ Status:   [● Publicado ○ Rascunho]        │   │
│  │ Destaque: [☐ Página em destaque]          │   │
│  │ Ordem:    [___] (para ordenação)          │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  🌐 SEO                                            │
│  ┌────────────────────────────────────────────┐   │
│  │ Meta Title:       [____________________]   │   │
│  │ Meta Description: [____________________]   │   │
│  │ Meta Keywords:    [____________________]   │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│              [❌ Cancelar]  [✅ Salvar]            │
└─────────────────────────────────────────────────────┘
                      │
                      │ Clica em "Salvar"
                      ↓
        ┌─────────────────────────────┐
        │  VALIDAÇÃO DO FORMULÁRIO    │
        ├─────────────────────────────┤
        │  • Nome obrigatório         │
        │  • Menu obrigatório         │
        │  • Slug único               │
        └─────────────────────────────┘
                      │
                      │ Dados válidos
                      ↓
            POST/PUT ao Backend
                      │
                      ↓
        ┌─────────────────────────────┐
        │  BACKEND PROCESSA           │
        │  • Salva no D1              │
        │  • Rebuild da página        │
        │  • Atualiza header          │
        └─────────────────────────────┘
                      │
                      │ Sucesso
                      ↓
        ┌─────────────────────────────┐
        │  FEEDBACK VISUAL            │
        │  ✅ Página salva com        │
        │     sucesso!                │
        │  🔄 Lista atualizada        │
        └─────────────────────────────┘
```

---

## 🔄 ESTADOS DO TOGGLE "PUBLICAR"

```
ESTADO INICIAL: PUBLICADO
┌─────────────────────┐
│  Status: PUBLICADO  │
│  Toggle: [🟢━━━━━] │
│  No site: ✅ VISÍVEL│
└─────────────────────┘
         │
         │ Usuário clica no toggle
         ↓
┌─────────────────────┐
│  PUT /products/{id} │
│  { status: "RASC" } │
└─────────────────────┘
         │
         │ Backend processa
         ↓
┌─────────────────────┐
│  rebuildPage()      │
│  Detecta: RASCUNHO  │
│  Ação: DELETE cache │
└─────────────────────┘
         │
         │ Trigger build
         ↓
┌─────────────────────┐
│  Header atualizado  │
│  Página removida    │
│  dos menus          │
└─────────────────────┘
         │
         ↓
ESTADO FINAL: RASCUNHO
┌─────────────────────┐
│  Status: RASCUNHO   │
│  Toggle: [━━━━━🔴] │
│  No site: ❌ OCULTA│
└─────────────────────┘
```

---

## 📊 DIAGRAMA DE ESTADOS DAS PÁGINAS

```
    ┌─────────────┐
    │   CRIAÇÃO   │
    └──────┬──────┘
           │ Página criada com status inicial
           ↓
    ┌─────────────┐
    │  RASCUNHO   │◄────────────────┐
    │   (Draft)   │                 │
    └──────┬──────┘                 │
           │                        │
           │ Toggle ON              │ Toggle OFF
           │                        │
           ↓                        │
    ┌─────────────┐                 │
    │ PUBLICADO   │─────────────────┘
    │ (Published) │
    └──────┬──────┘
           │
           │ Arquivar manualmente
           ↓
    ┌─────────────┐
    │ ARQUIVADO   │
    │ (Archived)  │
    └─────────────┘

VISIBILIDADE NO SITE:
• RASCUNHO:   ❌ Oculto
• PUBLICADO:  ✅ Visível
• ARQUIVADO:  ❌ Oculto

VISIBILIDADE NO ADMIN:
• RASCUNHO:   ✅ Sempre visível
• PUBLICADO:  ✅ Sempre visível
• ARQUIVADO:  ☑️ Visível se checkbox marcado
```

---

**FIM DO FLUXOGRAMA**
