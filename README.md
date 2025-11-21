# 🏗️ Planac Distribuidora - Site Completo

**Status**: 🟢 PRODUÇÃO - 100% FUNCIONAL
**Última atualização**: 21/11/2024
**Versão**: 1.0.0

## 🔗 Links do Sistema

- **Site Público**: https://siteplanaccompleto.pages.dev
- **Painel Admin**: https://planac-admin.pages.dev
- **API Backend**: https://planac-backend-api.planacacabamentos.workers.dev

## 🚀 Stack Tecnológica

### Frontend (Site Público)
- HTML5 + CSS3 + JavaScript
- Cloudflare Pages (CDN Global)
- Sistema Híbrido: Estático + Dinâmico

### Backend API
- Cloudflare Workers (Hono framework)
- Cloudflare D1 (SQLite Database)
- Cloudflare R2 (Image Storage)
- Cloudflare KV (Cache)

### Painel Admin
- React + Vite
- Axios + JWT Authentication
- Lucide React Icons

## 📁 Estrutura do Projeto

```
SitePlanacCompleto/
├── planac-backend/          # Backend API (Cloudflare Workers)
├── planac-admin/            # Painel Administrativo (React)
├── functions/               # Cloudflare Pages Middleware
├── arquivos-legados/        # Arquivos de referência
├── backups/                 # Backups importantes
├── *.html                   # Páginas do site (21 páginas)
├── *.svg                    # Logos e ícones
├── styles-components.css    # Estilos compartilhados
└── load-components.js       # Carrega header/footer
```

## ⚠️ IMPORTANTE - LEIA ANTES DE MEXER!

### ❌ NÃO FAÇA:
- ❌ Editar arquivos .html diretamente (use o Admin)
- ❌ Modificar header.html (é gerado automaticamente)
- ❌ Deletar styles-components.css
- ❌ Mexer em arquivos em arquivos-legados/

### ✅ FAÇA:
- ✅ Edite páginas via Admin Panel
- ✅ Use o sistema de rebuild automático
- ✅ Consulte esta documentação
- ✅ Faça commits descritivos

## ✨ Funcionalidades

### 🌐 Site Público
- ✅ Performance máxima (HTML estático + CDN)
- ✅ Sistema híbrido (fallback dinâmico)
- ✅ SEO otimizado
- ✅ Responsivo (mobile-first)
- ✅ Header/Footer sincronizados com admin

### 🎛️ Painel Administrativo
- ✅ CRUD completo de páginas
- ✅ Upload de imagens (WebP automático)
- ✅ Gerenciamento de menus hierárquicos
- ✅ Rebuild automático de header
- ✅ Dashboard com estatísticas
- ✅ Autenticação JWT

### 🔧 Backend API
- ✅ RESTful API
- ✅ Geração dinâmica de páginas
- ✅ Cache inteligente (KV)
- ✅ Upload para R2
- ✅ Auditoria completa

## 🎯 Sistema Híbrido de Páginas

### Como Funciona

**1. HTML Estático (99% do tempo)**
- Servido direto do CDN
- Latência: 10-50ms ⚡
- Performance máxima

**2. Geração Dinâmica (após renomear)**
- Worker busca do KV ou gera
- Latência: 100-200ms (1ª vez)
- Cache para próximas requisições

**3. Sincronização Automática**
- Salvar no admin → Rebuild automático
- Renomear → Cache invalidado
- Header → Menus atualizados

## 🔄 Fluxo de Trabalho

### Criar/Editar Página
1. Admin: Criar/editar página
2. Backend: Validar + Gerar slug
3. Page Builder: Gerar HTML
4. KV: Salvar cache
5. Build: Rebuild header
6. Site: Disponível imediatamente

### Renomear Página
1. Admin: Renomear página
2. Slug: Atualiza automaticamente
3. Cache: Invalida antigo
4. Header: Atualiza links
5. Site: Funciona na hora

## 🛠️ Desenvolvimento

### Backend
```bash
cd planac-backend
npm install
wrangler secret put JWT_SECRET
npm run dev
npm run deploy
```

### Admin
```bash
cd planac-admin
npm install
npm run dev
npm run build
npx wrangler pages deploy dist
```

### Site
```bash
npx wrangler pages deploy . --project-name=siteplanaccompleto
```

## 📈 Performance

- **HTML Estático**: ~10-50ms
- **Worker Dinâmico**: ~100-200ms (1ª vez)
- **Worker + Cache**: ~15-80ms
- **SEO Score**: 95+/100
- **Lighthouse**: 90+/100

## 🔐 Segurança

- JWT com refresh token
- CORS configurado
- Headers de segurança
- Rate limiting
- Validação de dados
- Auditoria de ações

## 📝 Documentação Adicional

Para documentação detalhada, consulte:
- `planac-backend/README.md` - API Backend
- `planac-admin/README.md` - Painel Admin

## 🆘 Suporte

**Email**: planacacabamentos@gmail.com
**WhatsApp**: (43) 98418-2582

---

© 2024 Planac Distribuidora. Todos os direitos reservados.
