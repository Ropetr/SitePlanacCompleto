# 🚀 Instruções de Build - Cloudflare Pages

## Para o Dashboard Cloudflare

### Configuração do Site Principal (siteplanaccompleto)
**Branch:** main
**Build command:** (deixe vazio)
**Build output directory:** /
**Root directory:** /

### Configuração do Admin (adicionar como Environment/Branch)
Você pode configurar de duas formas:

#### Forma 1: Adicionar Custom Domain para Admin
1. No projeto `siteplanaccompleto`
2. Settings → Custom domains
3. Adicionar: `admin.siteplanaccompleto.pages.dev`
4. Apontar para: `/admin` (proxy reverso)

#### Forma 2: Criar Preview Deployment para Admin
1. Settings → Builds & deployments
2. Configure uma build adicional:
   - **Build command:** `cd planac-admin && npm ci && npm run build`
   - **Output:** `planac-admin/dist`
   - **Environment variables:**
     - `VITE_API_URL=https://planac-backend-api.planacacabamentos.workers.dev`

## URLs Finais

- Site: https://siteplanaccompleto.pages.dev
- Admin (atual manual): https://main.planac-admin.pages.dev
- Admin (novo com Git): https://admin--siteplanaccompleto.pages.dev

## Deploy Automático

Após este commit, o Cloudflare Pages irá:
1. ✅ Detectar mudanças no repositório
2. ✅ Fazer build automático do site
3. ✅ Fazer deploy em produção
4. ✅ Atualizar cache CDN

Para o admin funcionar automaticamente, você precisa configurar no Dashboard conforme instruções acima.
