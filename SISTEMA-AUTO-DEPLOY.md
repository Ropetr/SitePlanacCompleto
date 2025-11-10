# 🚀 Sistema de Auto-Deploy

## Visão Geral

Este sistema permite que o site seja atualizado **automaticamente** quando você cria ou edita menus/produtos no Admin, **sem precisar rodar comandos Git** ou fazer deploy manual.

## Como Funciona

### 1️⃣ Você Salva no Admin
Quando você cria ou edita um produto ou menu no Painel Admin:
- ✅ Dados são salvos no banco D1
- ✅ Sistema aciona automaticamente o build/deploy

### 2️⃣ Backend Gera Header Dinâmico
O endpoint `/api/admin/build-deploy`:
- Busca menus ativos do banco D1
- Busca produtos publicados do banco D1
- Gera HTML do header com estrutura de menus atualizada
- Salva header no KV cache (SITE_CACHE)
- Invalida cache para forçar atualização

### 3️⃣ Build Usa Header do Cache
O script `build-static-pages.js`:
- Busca header do KV cache via API
- Injeta header dinâmico em todas as páginas HTML
- Gera versões otimizadas (dist/)

### 4️⃣ Site É Deployado
Execute deploy manual uma vez:
```bash
npx wrangler pages deploy dist --project-name siteplanaccompleto
```

**Próximas atualizações**: basta salvar no Admin!

---

## Arquivos Modificados

### Backend (planac-backend/)

#### ✅ `src/routes/build-deploy.js` (NOVO)
Endpoint que gera header dinâmico:
```javascript
POST /api/admin/build-deploy
GET  /api/admin/build-deploy/status
```

**Funções:**
- `fetchMenus(env)` - Busca menus ativos
- `fetchProducts(env)` - Busca produtos publicados
- `generateHeaderHTML(menus, products)` - Gera HTML com dropdowns
- `triggerDeploy(env, headerHTML)` - Salva no KV e invalida cache

#### ✅ `src/routes/pages.js`
Adicionado endpoint público para servir header:
```javascript
GET /api/pages/header
```
Retorna HTML do header do KV cache com CORS habilitado.

#### ✅ `src/routes/products.js`
Adicionada função `triggerBuildDeploy()` que é chamada após:
- `POST /api/admin/products` (criar produto)
- `PUT /api/admin/products/:id` (editar produto)

#### ✅ `src/routes/menus.js`
Adicionada mesma função `triggerBuildDeploy()` após:
- `POST /api/admin/menus` (criar menu)
- `PUT /api/admin/menus/:id` (editar menu)

#### ✅ `src/index.js`
Registrada rota:
```javascript
app.route('/api/admin/build-deploy', buildDeployRoutes);
```

#### ✅ `wrangler.toml`
Adicionado binding do KV:
```toml
[[kv_namespaces]]
binding = "SITE_CACHE"
id = "e8d8225292f9453db316a0a6566dec7d"
```

### Frontend (raiz do projeto)

#### ✅ `build-static-pages.js`
Modificado para buscar header da API:
```javascript
const HEADER_API_URL = 'https://planac-backend-api.planacacabamentos.workers.dev/api/pages/header';

async function fetchHeaderFromAPI() {
  // Busca header do KV cache
  // Fallback para header.html local se API falhar
}
```

---

## Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL                                 │
│  (planac-admin.pages.dev)                                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ 1. Criar/Editar Menu ou Produto
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND API (Workers)                              │
│  POST /api/admin/menus  ou  POST /api/admin/products           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ 2. Salvar no D1
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│           triggerBuildDeploy(env)                               │
│  (fire and forget - não bloqueia resposta)                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ 3. POST /api/admin/build-deploy
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BUILD & DEPLOY WORKER                           │
│  • Busca menus do D1                                            │
│  • Busca produtos do D1                                         │
│  • Gera header.html com menus dinâmicos                         │
│  • Salva no KV cache (SITE_CACHE)                               │
│  • Invalida cache (timestamp)                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ 4. Header salvo no KV
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│            build-static-pages.js                                │
│  node build-static-pages.js                                     │
│  • Busca header de GET /api/pages/header (KV cache)            │
│  • Injeta header em todas as páginas HTML                      │
│  • Gera dist/ com páginas otimizadas                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ 5. Deploy manual (uma vez)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              SITE PÚBLICO (Pages)                               │
│  siteplanaccompleto.pages.dev                                   │
│  • Header atualizado ✅                                         │
│  • Menus dinâmicos ✅                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Como Usar

### Para Adicionar/Editar Menu ou Produto:

1. **Acesse o Admin**: https://planac-admin.pages.dev
2. **Crie ou edite** um menu ou produto
3. **Clique em "Salvar"**
4. ✅ **Pronto!** O header é atualizado automaticamente no KV cache

### Para Deployar o Site:

#### Opção A: Deploy Manual (quando necessário)
```bash
# 1. Build páginas (busca header do KV)
node build-static-pages.js

# 2. Deploy para Cloudflare Pages
npx wrangler pages deploy dist --project-name siteplanaccompleto
```

#### Opção B: Automatizar com GitHub Actions (futuro)
Criar workflow que roda build + deploy quando detectar mudanças no cache.

---

## Testando o Sistema

### 1. Testar endpoint de build/deploy:
```bash
curl -X POST https://planac-backend-api.planacacabamentos.workers.dev/api/admin/build-deploy \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Build e deploy acionados com sucesso",
  "data": {
    "menus": 9,
    "products": 20,
    "timestamp": "2025-11-10T..."
  }
}
```

### 2. Testar endpoint público do header:
```bash
curl https://planac-backend-api.planacacabamentos.workers.dev/api/pages/header
```

**Resposta esperada:** HTML do header com menus

### 3. Testar build:
```bash
node build-static-pages.js
```

**Saída esperada:**
```
🚀 Iniciando build de páginas estáticas...

✅ Header carregado da API (KV cache)
📄 Processando: planac-website.html
✅ Salvo: planac-website.html
...

✅ Build completo! 25/25 páginas processadas.
📂 Saída: C:\...\dist
🎯 Resultado:
   ✅ CLS eliminado (header/footer inline)
   ✅ LCP otimizado (preload de imagens)
   ✅ Zero JavaScript bloqueante
   ✅ Header dinâmico do KV cache
```

### 4. Verificar KV cache:
```bash
npx wrangler kv:key get "header.html" \
  --namespace-id="e8d8225292f9453db316a0a6566dec7d"
```

---

## Vantagens

✅ **Sem Git no Admin**: Admin pode estar separado, não precisa commit
✅ **Auto-atualização**: Salvar no Admin → Header atualiza automaticamente
✅ **Fallback seguro**: Se API falhar, usa header.html local
✅ **Cache inteligente**: KV cache com invalidação por timestamp
✅ **Sem rebuild manual**: Basta rodar deploy quando quiser

---

## Próximos Passos

### ✅ Implementado
- [x] Endpoint de build/deploy no backend
- [x] Trigger automático ao salvar produtos/menus
- [x] Endpoint público para servir header
- [x] Build que busca header da API
- [x] KV cache configurado

### 🔜 Pendente
- [ ] Testar deploy completo end-to-end
- [ ] (Opcional) Webhook para acionar build automaticamente
- [ ] (Opcional) GitHub Actions para build+deploy automático

---

## Troubleshooting

### ❌ Erro: "Header não encontrado"
**Causa:** KV cache vazio
**Solução:**
```bash
curl -X POST https://planac-backend-api.planacacabamentos.workers.dev/api/admin/build-deploy \
  -H "Authorization: Bearer SEU_TOKEN"
```

### ❌ Build usa header desatualizado
**Causa:** Cache do KV não invalidado
**Solução:** Salvar qualquer menu/produto no Admin para forçar rebuild

### ❌ API retorna 404 no header
**Causa:** Backend não deployado ou KV vazio
**Solução:**
1. Deploy backend: `cd planac-backend && npx wrangler deploy`
2. Acionar build: salvar algo no Admin ou curl no endpoint

---

## Suporte

Para problemas ou dúvidas, verificar:
- Logs do backend: `npx wrangler tail` (no diretório planac-backend)
- Status do build: `GET /api/admin/build-deploy/status`
- KV cache: `npx wrangler kv:key get "header.html" --namespace-id=...`
