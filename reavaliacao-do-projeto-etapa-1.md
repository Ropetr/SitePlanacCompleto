# 📚 REAVALIAÇÃO DO PROJETO - ETAPA 1
## Sistema Planac Distribuidora - Análise Completa e Plano de Organização

**Data:** 13 de Novembro de 2025
**Versão:** 1.0.0
**Status:** Documentação Completa - Pronto para Implementação

---

## 📋 ÍNDICE

1. [Árvore Completa de Arquivos](#árvore-completa-de-arquivos)
2. [Resumo da Estrutura Atual](#resumo-da-estrutura-atual)
3. [Plano de Organização Detalhado](#plano-de-organização-detalhado)
   - [Etapa 1: Padronizar Header e Footer](#etapa-1-padronizar-header-e-footer)
   - [Etapa 2: Templates Reutilizáveis](#etapa-2-templates-reutilizáveis)
   - [Etapa 3: Painel Admin Completo](#etapa-3-painel-admin-completo)
   - [Etapa 4: Otimizações de Performance](#etapa-4-otimizações-de-performance)
   - [Etapa 5: Boas Práticas de SEO](#etapa-5-boas-práticas-de-seo)
4. [Cronograma de Execução](#cronograma-de-execução)
5. [Resultados Esperados](#resultados-esperados)

---

# 🌳 ÁRVORE COMPLETA DE ARQUIVOS E PASTAS

```
SitePlanacCompleto/
│
├── 📁 .claude/                          # Configurações do Claude Code
├── 📁 .git/                             # Controle de versão Git
├── 📁 .github/                          # Workflows e configurações GitHub
│
├── 📁 planac-admin/                     # Painel administrativo (React)
│   ├── 📁 dist/                         # Build de produção do admin
│   ├── 📁 node_modules/                 # Dependências npm
│   ├── 📁 src/
│   │   ├── 📁 components/               # Componentes React
│   │   ├── 📁 contexts/                 # Contexts API React
│   │   ├── 📁 pages/                    # Páginas do admin
│   │   └── 📁 utils/                    # Funções utilitárias
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 planac-backend/                   # API Backend (Cloudflare Workers)
│   ├── 📁 node_modules/                 # Dependências npm
│   ├── 📁 prisma/                       # Schema Prisma para D1
│   ├── 📁 src/
│   │   ├── 📁 config/                   # Configurações
│   │   ├── 📁 routes/                   # Rotas da API
│   │   ├── 📁 templates/                # Templates HTML
│   │   └── 📁 utils/                    # Utilitários
│   ├── package.json
│   ├── wrangler.toml
│   └── vitest.config.js
│
├── 📁 dist/                             # Build do site principal
├── 📁 backups/                          # Backups diversos
├── 📁 arquivos-legados/                 # Arquivos antigos preservados
│   ├── 📁 html-estaticos/               # HTMLs estáticos antigos
│   └── 📁 scripts-antigos/              # Scripts descontinuados
│
├── 📁 backend-referencia/               # Referência de backend antigo
│
├── 📄 *.html                            # Páginas de produtos (25+ arquivos)
│   ├── index.html                       # Página inicial
│   ├── divisoria-naval-page.html
│   ├── drywall-divisoria-page.html
│   ├── forro-de-gesso-modular.html
│   ├── forro-de-pvc-modular.html
│   ├── forrovid-page.html
│   ├── kit-porta.html
│   ├── la-pet-page.html
│   ├── planac-forro-gesso-completo.html
│   ├── pvc-modular-page.html
│   └── ... (outras páginas de produtos)
│
├── 📄 header.html                       # Componente de cabeçalho
├── 📄 footer.html                       # Componente de rodapé
├── 📄 whatsapp-float.html               # Botão flutuante WhatsApp
├── 📄 styles-components.css             # Estilos globais
├── 📄 load-components.js                # Script para carregar componentes
│
├── 📄 *.svg                             # Imagens vetoriais (logos, ícones)
│   ├── Logo.svg
│   ├── coracao.svg
│   ├── Instagram.svg
│   ├── Whats.svg
│   └── Telefone.svg
│
├── 📄 Scripts JavaScript
│   ├── sync-pages-from-db.js            # Sincroniza páginas do banco D1
│   ├── list-products.js                 # Lista produtos do backend
│   ├── add-css-version.js               # Adiciona versão ao CSS
│   └── load-components.js               # Carrega componentes
│
├── 📄 Configuração
│   ├── .cfpages.yml                     # Config Cloudflare Pages
│   ├── .gitignore                       # Ignorar arquivos Git
│   ├── wrangler.toml.backup             # Backup config Wrangler
│   └── produtos.json                    # Dados de produtos
│
└── 📄 Documentação (*.md)
    ├── README.md                        # Documentação principal
    ├── DOCUMENTACAO-COMPLETA.md         # Doc detalhada do projeto
    ├── BUILD-README.md                  # Instruções de build
    ├── COMO-ADICIONAR-MENUS.md          # Como adicionar menus
    ├── FLUXOGRAMA-ADMIN.md              # Fluxograma do admin
    ├── RELATORIO-SISTEMA-COMPLETO.md    # Relatório do sistema
    ├── CHANGELOG.md                     # Histórico de mudanças
    ├── PROJETO-STATUS.md                # Status do projeto
    └── ... (outras documentações)
```

---

# 📋 RESUMO DA ESTRUTURA - O QUE CADA PASTA FAZ

## **📁 Raiz do Projeto**
Contém as páginas HTML estáticas do site público (25+ páginas de produtos), componentes reutilizáveis (header, footer), estilos CSS, scripts JavaScript, imagens SVG e toda a documentação do projeto.

## **📁 planac-admin/**
**Painel administrativo** desenvolvido em **React + Vite + TailwindCSS**. Permite gerenciar produtos, menus, páginas e usuários através de uma interface moderna. Se conecta ao backend via API.

**Principais funcionalidades:**
- Login com autenticação JWT
- Dashboard com estatísticas
- Gestão de produtos/páginas
- Gestão de menus e submenus
- Upload de imagens (banner e galeria)
- Visualização de orçamentos
- Visualização de contatos
- Interface responsiva

## **📁 planac-backend/**
**API REST** construída com **Hono.js** e **Cloudflare Workers**. Gerencia banco de dados D1 (SQLite), autenticação, CRUD de produtos/menus/páginas, upload de imagens e geração de HTML.

**Principais recursos:**
- Autenticação JWT (access + refresh tokens)
- CRUD completo de produtos e menus
- Upload para Cloudflare R2
- Validação com Zod
- Auditoria de ações
- Dashboard com estatísticas
- CORS configurado

## **📁 dist/**
Pasta de **build de produção** do site principal. Contém os arquivos otimizados e prontos para deploy no Cloudflare Pages.

**Otimizações aplicadas:**
- Header/footer injetados inline (zero CLS)
- Preload de recursos críticos
- Scripts otimizados
- 21 páginas processadas

## **📁 arquivos-legados/**
Arquivos antigos preservados para referência histórica. Contém HTMLs estáticos e scripts descontinuados que não são mais utilizados no sistema atual.

## **📁 backend-referencia/**
Backup de referência de uma versão anterior do backend. Mantido para consulta caso seja necessário recuperar alguma lógica antiga.

## **📁 backups/**
Armazena backups diversos de arquivos importantes durante o desenvolvimento.

## **📁 .github/**
Contém **workflows de CI/CD** para automação de deploys e testes via GitHub Actions.

## **📁 .claude/**
Configurações do ambiente Claude Code para auxiliar no desenvolvimento.

---

# 🎯 TECNOLOGIAS PRINCIPAIS

## Frontend Site
- **Estrutura:** HTML5, CSS3, JavaScript Vanilla
- **Rendering:** Client-Side Rendering (CSR)
- **API Calls:** Fetch API
- **Responsividade:** Mobile-First Design

## Admin Panel
- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.21
- **Roteamento:** React Router DOM 6.x
- **HTTP Client:** Axios 1.7.x
- **UI:** Tailwind CSS + Lucide Icons
- **Linguagem:** JSX

## Backend
- **Runtime:** Cloudflare Workers (Edge Computing)
- **Framework:** Hono.js v4.x
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Cache:** Cloudflare KV
- **Linguagem:** JavaScript (ES Modules)

## Hospedagem

| Componente | Plataforma | URL |
|------------|-----------|-----|
| Backend API | Cloudflare Workers | `https://planac-backend-api.planacacabamentos.workers.dev` |
| Admin Panel | Cloudflare Pages | `https://planac-admin.pages.dev` |
| Site Público | Cloudflare Pages | `https://siteplanaccompleto.pages.dev` |

---

# 📊 PLANO DE ORGANIZAÇÃO DETALHADO

## 🎯 OBJETIVO GERAL
Transformar o site atual em um sistema totalmente dinâmico, editável pelo painel admin, com otimizações de performance (imagens WebP, lazy load, minificação) e boas práticas de SEO (title, description, sitemap, schema.org).

---

# **ETAPA 1: PADRONIZAR HEADER E FOOTER EM TODAS AS PÁGINAS**

## ✅ Situação Atual
- Header e footer já estão componentizados em arquivos separados (`header.html`, `footer.html`)
- Sistema de build (`build-static-pages.js`) injeta header/footer inline nas páginas
- Problema: Alterações manuais ainda necessárias quando há mudança de conteúdo

## 🎯 Objetivo
Tornar o header e footer **100% dinâmicos e editáveis pelo admin**, eliminando necessidade de edição manual de HTML.

## 📝 Passos Detalhados

### 1.1 - Criar Tabela no Banco para Configurações Globais

```sql
CREATE TABLE site_config (
  id TEXT PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT,
  tipo TEXT, -- TEXT, JSON, IMAGE, URL
  grupo TEXT, -- HEADER, FOOTER, GERAL, SEO
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Dados a armazenar:**
- Logo (URL da imagem)
- Telefones (fixo e WhatsApp)
- Endereço completo
- Links de redes sociais (Instagram, Facebook)
- Horário de funcionamento
- Texto do rodapé
- Links do menu superior

### 1.2 - Criar Endpoint no Backend para Buscar Configurações

```javascript
// planac-backend/src/routes/settings.js
GET /api/site-config          // Lista todas as configurações
GET /api/site-config/:chave   // Busca por chave específica
PUT /api/admin/site-config/:id // Atualiza configuração (protegido)
```

### 1.3 - Criar Página no Admin para Editar Configurações

```
planac-admin/src/pages/SiteConfig.jsx
```

**Campos editáveis:**
- 📸 Logo do site (upload de imagem)
- 📞 Telefone fixo
- 📱 WhatsApp
- 📍 Endereço completo (rua, número, bairro, cidade, CEP)
- 📧 E-mail de contato
- 🕒 Horário de funcionamento
- 🔗 Instagram URL
- 🔗 Facebook URL
- 📝 Texto do footer
- 🔗 Links úteis (footer)

### 1.4 - Criar Template Dinâmico de Header e Footer

```javascript
// planac-backend/src/templates/header-template.js
export function generateHeader(config) {
  return `
    <header>
      <div class="header-logo">
        <a href="/">
          <img src="${config.logo}" alt="${config.site_name}">
        </a>
      </div>
      <nav>
        ${generateMenus(config.menus)}
      </nav>
      <div class="header-buttons">
        <a href="tel:${config.telefone}">${config.telefone}</a>
        <a href="${config.whatsapp_url}">${config.whatsapp}</a>
      </div>
    </header>
  `;
}
```

### 1.5 - Criar Endpoint para Gerar Header/Footer Dinâmico

```javascript
// planac-backend/src/routes/pages.js
GET /api/pages/header   // Retorna HTML do header montado com dados do banco
GET /api/pages/footer   // Retorna HTML do footer montado com dados do banco
```

### 1.6 - Atualizar Script de Build

Modificar `build-static-pages.js` para:
1. Buscar header/footer da API (não dos arquivos estáticos)
2. Injetar inline com dados atualizados do banco
3. Gerar versões otimizadas em `/dist`

### 1.7 - Atualizar load-components.js

Para ambiente de desenvolvimento, manter carregamento dinâmico via API:
```javascript
loadComponent(`${API_URL}/api/pages/header`, 'header-container');
loadComponent(`${API_URL}/api/pages/footer`, 'footer-container');
```

---

# **ETAPA 2: ORGANIZAR ARQUIVOS HTML EM TEMPLATES REUTILIZÁVEIS**

## ✅ Situação Atual
- 21 páginas HTML estáticas com estrutura repetida
- Cada página tem seu próprio HTML completo
- Alterações de layout exigem edição manual de múltiplos arquivos

## 🎯 Objetivo
Criar **sistema de templates reutilizáveis** onde apenas o conteúdo específico da página é único.

## 📝 Passos Detalhados

### 2.1 - Criar Estrutura de Templates no Backend

```
planac-backend/src/templates/
├── layouts/
│   ├── base-layout.js          # Layout base (HTML, HEAD, BODY)
│   ├── product-layout.js       # Layout específico para produtos
│   └── home-layout.js          # Layout específico para home
├── sections/
│   ├── banner-section.js       # Seção de banner
│   ├── features-section.js     # Seção de características
│   ├── gallery-section.js      # Seção de galeria
│   ├── specs-section.js        # Seção de especificações
│   └── cta-section.js          # Seção de call-to-action
└── components/
    ├── card-component.js       # Card reutilizável
    ├── button-component.js     # Botão reutilizável
    └── form-component.js       # Formulário reutilizável
```

### 2.2 - Criar Template Base Universal

```javascript
// base-layout.js
export function baseLayout({
  title,
  description,
  keywords,
  canonical,
  og_image,
  content
}) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <meta name="description" content="${description}">
      <meta name="keywords" content="${keywords}">
      <link rel="canonical" href="${canonical}">

      <!-- Open Graph -->
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${og_image}">
      <meta property="og:url" content="${canonical}">

      <!-- Preload crítico -->
      <link rel="preload" href="/styles-components.css" as="style">
      <link rel="stylesheet" href="/styles-components.css">
    </head>
    <body>
      ${getHeader()}

      <main>
        ${content}
      </main>

      ${getFooter()}
      ${getWhatsAppFloat()}
    </body>
    </html>
  `;
}
```

### 2.3 - Criar Template de Página de Produto

```javascript
// product-layout.js
export function productPageLayout(product) {
  return baseLayout({
    title: product.meta_title || `${product.nome} - Planac Distribuidora`,
    description: product.meta_description || product.descricao_curta,
    keywords: product.meta_keywords,
    canonical: `https://siteplanaccompleto.pages.dev/${product.slug}.html`,
    og_image: product.imagem_banner,
    content: `
      ${renderBannerSection(product)}
      ${renderFeaturesSection(product.caracteristicas)}
      ${renderBenefitsSection(product.vantagens)}
      ${renderGallerySection(product.galeria_imagens)}
      ${renderSpecsSection(product.especificacoes)}
      ${renderCtaSection(product)}
    `
  });
}
```

### 2.4 - Criar Endpoint de Renderização de Páginas

```javascript
// planac-backend/src/routes/pages.js
GET /api/pages/render/:slug  // Renderiza página completa em HTML
```

**Fluxo:**
1. Busca produto do banco por slug
2. Busca configurações globais (header/footer)
3. Monta HTML usando templates
4. Retorna HTML completo pronto para uso

### 2.5 - Implementar Sistema de Cache

```javascript
// Usar Cloudflare KV para cache de páginas renderizadas
// TTL: 5 minutos (atualiza rapidamente após edição no admin)
const cachedPage = await KV.get(`page:${slug}`);
if (cachedPage) return cachedPage;

const renderedPage = renderProductPage(product);
await KV.put(`page:${slug}`, renderedPage, { expirationTtl: 300 });
return renderedPage;
```

### 2.6 - Criar Função de Invalidação de Cache no Admin

Quando admin editar uma página, invalidar cache automaticamente:
```javascript
// Ao salvar página no admin
await axios.delete(`${API_URL}/api/admin/cache/page/${slug}`);
```

### 2.7 - Atualizar Script de Build

Modificar `build-static-pages.js` para:
1. Buscar todas as páginas da API (`/api/products`)
2. Para cada página, buscar HTML renderizado (`/api/pages/render/:slug`)
3. Salvar em `/dist/:slug.html`
4. Resultado: 21+ páginas estáticas otimizadas geradas automaticamente

---

# **ETAPA 3: ESTRUTURAR PAINEL ADMIN PARA EDITAR CONTEÚDOS**

## ✅ Situação Atual
- Admin já permite editar produtos, menus, imagens
- Faltam: cores, banners, textos globais, seções da home

## 🎯 Objetivo
Admin deve poder editar **TUDO** visível no site, sem tocar no código.

## 📝 Passos Detalhados

### 3.1 - Criar Página "Aparência" no Admin

```
planac-admin/src/pages/Appearance.jsx
```

**Seções:**

#### 3.1.1 - Cores e Tema
- Cor primária (`#ec3237`)
- Cor secundária (`#96181c`)
- Cor de texto
- Cor de fundo
- Cor de destaque

#### 3.1.2 - Tipografia
- Fonte principal
- Fonte secundária
- Tamanhos de texto

#### 3.1.3 - Espaçamentos
- Padding padrão de seções
- Margens entre elementos

### 3.2 - Criar Página "Editar Home" no Admin

```
planac-admin/src/pages/EditHome.jsx
```

**Seções editáveis:**

#### 3.2.1 - Banner Principal
- Título (H1)
- Subtítulo
- Texto do botão
- Link do botão
- Imagem de fundo (upload)
- Overlay (transparência)

#### 3.2.2 - Cards de Features (os 4 cards)
Cada card com:
- Ícone (upload de imagem)
- Título
- Ordem de exibição
- Ativo/Inativo

#### 3.2.3 - Seções de Produtos
Para cada seção (Divisórias, Drywall, Forros, etc.):
- Título da seção
- Menu associado (dropdown)
- Produtos exibidos (automático, do menu selecionado)

#### 3.2.4 - Seção "Sobre"
- Título
- Subtítulo vermelho
- Textos (múltiplos parágrafos)
- Imagem (opcional)

#### 3.2.5 - Cards Missão/Visão/Valores
Cada card com:
- Título
- Descrição
- Ordem

### 3.3 - Criar Tabela para Dados da Home

```sql
CREATE TABLE home_sections (
  id TEXT PRIMARY KEY,
  secao TEXT NOT NULL, -- BANNER, FEATURES, DIVISORIAS, etc.
  titulo TEXT,
  subtitulo TEXT,
  conteudo TEXT, -- JSON com dados específicos da seção
  menu_id TEXT, -- Para seções que exibem produtos de um menu
  ordem INTEGER DEFAULT 0,
  ativo INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE home_feature_cards (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  icone_url TEXT,
  ordem INTEGER DEFAULT 0,
  ativo INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 - Criar Endpoints para Home

```javascript
// Buscar dados da home
GET /api/pages/home/sections        // Lista todas as seções
GET /api/pages/home/feature-cards   // Lista os 4 cards

// Editar (admin)
PUT /api/admin/pages/home/banner
PUT /api/admin/pages/home/features
PUT /api/admin/pages/home/section/:id
```

### 3.5 - Criar Interface de Upload de Banners Globais

Nova seção no admin:
```
planac-admin/src/pages/Banners.jsx
```

**Funcionalidades:**
- Lista de banners cadastrados
- Upload de múltiplos banners
- Associar banner a páginas específicas
- Definir banner padrão
- Ordenação por drag & drop

### 3.6 - Criar Sistema de Textos Reutilizáveis

Tabela para textos que aparecem em múltiplas páginas:
```sql
CREATE TABLE global_texts (
  id TEXT PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL, -- ex: FOOTER_COPYRIGHT, WHATSAPP_MESSAGE
  texto TEXT NOT NULL,
  descricao TEXT,
  grupo TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Exemplos:
- `FOOTER_COPYRIGHT` → "© 2025 Planac Distribuidora. Todos os direitos reservados."
- `WHATSAPP_CTA` → "Solicite um orçamento"
- `WHATSAPP_MESSAGE` → "Olá, Planac! Gostaria de solicitar um orçamento."

---

# **ETAPA 4: IMPLEMENTAR OTIMIZAÇÕES DE PERFORMANCE**

## 🎯 Objetivo
Garantir que o site carregue em **< 2 segundos** com **Core Web Vitals excelentes**.

## 📝 Passos Detalhados

### 4.1 - Otimizar Imagens para WebP

#### 4.1.1 - Backend: Converter Upload para WebP
```javascript
// planac-backend/src/routes/media.js
import sharp from 'sharp'; // ou usar Cloudflare Image Resizing

async function convertToWebP(imageBuffer) {
  return await sharp(imageBuffer)
    .webp({ quality: 85 })
    .toBuffer();
}
```

#### 4.1.2 - Gerar Múltiplos Tamanhos
Para cada imagem, gerar:
- `thumb` (300x300) - para listagens
- `medium` (800x600) - para cards
- `large` (1920x1080) - para banners
- `original` (WebP original)

#### 4.1.3 - Salvar URLs no Banco
```sql
ALTER TABLE media ADD COLUMN url_thumb TEXT;
ALTER TABLE media ADD COLUMN url_medium TEXT;
ALTER TABLE media ADD COLUMN url_large TEXT;
```

#### 4.1.4 - Usar `<picture>` com srcset
```html
<picture>
  <source srcset="image-thumb.webp" media="(max-width: 640px)">
  <source srcset="image-medium.webp" media="(max-width: 1024px)">
  <source srcset="image-large.webp" media="(min-width: 1025px)">
  <img src="image-medium.webp" alt="Descrição" loading="lazy">
</picture>
```

### 4.2 - Implementar Lazy Loading

#### 4.2.1 - Lazy Load Nativo
Adicionar em todas as imagens que não são críticas:
```html
<img src="imagem.webp" loading="lazy" alt="...">
```

#### 4.2.2 - Lazy Load de Iframes (YouTube)
```html
<iframe src="video.html" loading="lazy" title="..."></iframe>
```

#### 4.2.3 - Intersection Observer para Galeria
Implementar lazy load avançado para galerias de imagens:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
```

### 4.3 - Minificar CSS e JavaScript

#### 4.3.1 - Minificar CSS no Build
```javascript
// build-static-pages.js
import CleanCSS from 'clean-css';

const minifiedCSS = new CleanCSS().minify(cssContent).styles;
```

#### 4.3.2 - Minificar JavaScript
```javascript
import { minify } from 'terser';

const minifiedJS = await minify(jsContent);
```

#### 4.3.3 - Remover CSS e JS Não Utilizados
Usar ferramentas como:
- PurgeCSS (remove CSS não usado)
- Rollup (bundle e tree-shaking de JS)

### 4.4 - Implementar Compressão Gzip/Brotli

#### 4.4.1 - Configurar Headers no Cloudflare Workers
```javascript
// planac-backend/src/index.js
response.headers.set('Content-Encoding', 'br'); // Brotli
```

#### 4.4.2 - Ativar Compressão Automática no Cloudflare Pages
- Dashboard Cloudflare → Speed → Optimization
- Ativar "Auto Minify" (CSS, JS, HTML)
- Ativar "Brotli"

### 4.5 - Preload e Prefetch Estratégicos

#### 4.5.1 - Preload de Recursos Críticos
```html
<link rel="preload" href="/Logo.svg" as="image">
<link rel="preload" href="/styles-components.css" as="style">
<link rel="preload" href="banner.webp" as="image" fetchpriority="high">
```

#### 4.5.2 - DNS Prefetch para APIs
```html
<link rel="dns-prefetch" href="https://planac-backend-api.planacacabamentos.workers.dev">
<link rel="preconnect" href="https://pub-63c4447c03264f5397d9b5cf2daf1a44.r2.dev">
```

#### 4.5.3 - Prefetch de Páginas Relacionadas
```html
<link rel="prefetch" href="/divisoria-naval-page.html">
```

### 4.6 - Implementar Cache Agressivo

#### 4.6.1 - Cache de Assets Estáticos (1 ano)
```javascript
// Cloudflare Pages: _headers file
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000

/*.svg
  Cache-Control: public, max-age=31536000
```

#### 4.6.2 - Cache de HTML (5 minutos com revalidação)
```
/*.html
  Cache-Control: public, max-age=300, stale-while-revalidate=600
```

#### 4.6.3 - Cache de API no Cloudflare KV
```javascript
// Cache de produtos por 5 minutos
const products = await KV.get('products', { type: 'json' });
if (!products) {
  const freshProducts = await db.query('SELECT * FROM products');
  await KV.put('products', JSON.stringify(freshProducts), { expirationTtl: 300 });
}
```

### 4.7 - Otimizar Fontes do Google Fonts

#### 4.7.1 - Hospedar Fontes Localmente (Opcional)
Baixar fontes Barlow e Poppins e servir do próprio site.

#### 4.7.2 - Preload de Fontes
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;700&display=swap" as="style">
```

#### 4.7.3 - Usar font-display: swap
```css
@font-face {
  font-family: 'Barlow';
  font-display: swap; /* Evita FOIT (Flash of Invisible Text) */
}
```

### 4.8 - Monitorar Core Web Vitals

#### 4.8.1 - Implementar Web Vitals JS
```html
<script type="module">
  import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'https://unpkg.com/web-vitals@3/dist/web-vitals.js';

  function sendToAnalytics(metric) {
    // Enviar para backend
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body: JSON.stringify(metric)
    });
  }

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
</script>
```

#### 4.8.2 - Dashboard de Monitoramento no Admin
Criar página mostrando:
- CLS médio por página
- LCP médio por página
- FID médio
- Páginas com problemas
- Evolução ao longo do tempo

---

# **ETAPA 5: IMPLEMENTAR BOAS PRÁTICAS DE SEO**

## 🎯 Objetivo
Otimizar o site para **ranquear no Google** e melhorar **Índice de Qualidade do Google Ads**.

## 📝 Passos Detalhados

### 5.1 - Implementar Meta Tags Completas

#### 5.1.1 - Adicionar Campos de SEO no Banco
Já existem, mas garantir que estão sendo usados:
- `meta_title` (60 caracteres ideal)
- `meta_description` (160 caracteres ideal)
- `meta_keywords`

#### 5.1.2 - Adicionar Campos Adicionais
```sql
ALTER TABLE products ADD COLUMN canonical_url TEXT;
ALTER TABLE products ADD COLUMN og_image TEXT; -- Imagem para compartilhamento
ALTER TABLE products ADD COLUMN og_type TEXT DEFAULT 'product';
ALTER TABLE products ADD COLUMN robots TEXT DEFAULT 'index, follow';
```

#### 5.1.3 - Template de Meta Tags
```javascript
function generateMetaTags(page) {
  return `
    <!-- Basic Meta -->
    <title>${page.meta_title}</title>
    <meta name="description" content="${page.meta_description}">
    <meta name="keywords" content="${page.meta_keywords}">
    <meta name="robots" content="${page.robots}">
    <link rel="canonical" href="${page.canonical_url}">

    <!-- Open Graph (Facebook/WhatsApp) -->
    <meta property="og:type" content="${page.og_type}">
    <meta property="og:title" content="${page.meta_title}">
    <meta property="og:description" content="${page.meta_description}">
    <meta property="og:image" content="${page.og_image}">
    <meta property="og:url" content="${page.canonical_url}">
    <meta property="og:site_name" content="Planac Distribuidora">
    <meta property="og:locale" content="pt_BR">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.meta_title}">
    <meta name="twitter:description" content="${page.meta_description}">
    <meta name="twitter:image" content="${page.og_image}">

    <!-- Geo Tags (SEO Local) -->
    <meta name="geo.region" content="BR-PR">
    <meta name="geo.placename" content="Londrina">
    <meta name="geo.position" content="-23.3044524;-51.1695824">
    <meta name="ICBM" content="-23.3044524, -51.1695824">
  `;
}
```

### 5.2 - Implementar Schema.org (JSON-LD)

#### 5.2.1 - Schema LocalBusiness (Home Page)
```javascript
function generateLocalBusinessSchema(config) {
  return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Planac Distribuidora",
      "description": "Distribuidora de forros, divisórias e drywall em Londrina PR",
      "image": "${config.logo}",
      "url": "https://siteplanaccompleto.pages.dev",
      "telephone": "${config.telefone}",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Abélio Benatti, 4912",
        "addressLocality": "Londrina",
        "addressRegion": "PR",
        "postalCode": "86000-000",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-23.3044524",
        "longitude": "-51.1695824"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "08:00",
          "closes": "12:00"
        }
      ],
      "sameAs": [
        "${config.instagram_url}",
        "${config.facebook_url}"
      ]
    }
    </script>
  `;
}
```

#### 5.2.2 - Schema Product (Páginas de Produtos)
```javascript
function generateProductSchema(product) {
  return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "${product.nome}",
      "description": "${product.descricao_curta}",
      "image": "${product.imagem_banner}",
      "brand": {
        "@type": "Brand",
        "name": "Planac Distribuidora"
      },
      "offers": {
        "@type": "AggregateOffer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "BRL",
        "priceRange": "Consultar",
        "url": "${product.canonical_url}"
      }
    }
    </script>
  `;
}
```

#### 5.2.3 - Schema BreadcrumbList (Navegação)
```javascript
function generateBreadcrumbSchema(product, menu) {
  return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://siteplanaccompleto.pages.dev"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "${menu.nome}",
          "item": "https://siteplanaccompleto.pages.dev#${menu.slug}"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${product.nome}"
        }
      ]
    }
    </script>
  `;
}
```

### 5.3 - Criar sitemap.xml Dinâmico

#### 5.3.1 - Endpoint para Gerar Sitemap
```javascript
// planac-backend/src/routes/seo.js
GET /api/seo/sitemap.xml
```

**Conteúdo gerado:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home -->
  <url>
    <loc>https://siteplanaccompleto.pages.dev/</loc>
    <lastmod>2025-11-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Produtos (dinâmico, busca do banco) -->
  <url>
    <loc>https://siteplanaccompleto.pages.dev/divisoria-naval-page.html</loc>
    <lastmod>2025-11-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Repetir para cada produto publicado -->
</urlset>
```

#### 5.3.2 - Gerar sitemap.xml no Build
```javascript
// build-static-pages.js
const sitemap = await fetch(`${API_URL}/api/seo/sitemap.xml`);
const sitemapContent = await sitemap.text();
fs.writeFileSync('dist/sitemap.xml', sitemapContent);
```

#### 5.3.3 - Referenciar no robots.txt
```
Sitemap: https://siteplanaccompleto.pages.dev/sitemap.xml
```

### 5.4 - Criar robots.txt

#### 5.4.1 - Arquivo Estático na Raiz
```
# robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemaps
Sitemap: https://siteplanaccompleto.pages.dev/sitemap.xml
Sitemap: https://siteplanaccompleto.pages.dev/sitemap-images.xml

# Crawl delay (opcional)
Crawl-delay: 1
```

### 5.5 - Adicionar Alt Text em Todas as Imagens

#### 5.5.1 - Campo no Banco
```sql
ALTER TABLE media ADD COLUMN alt_text TEXT;
ALTER TABLE media ADD COLUMN titulo_seo TEXT;
```

#### 5.5.2 - Obrigatório no Upload
Adicionar campo no formulário de upload:
```jsx
<input
  type="text"
  placeholder="Descreva a imagem (alt text)"
  required
/>
```

#### 5.5.3 - Sugestão Automática de Alt Text
Usar IA para sugerir alt text baseado no contexto:
```javascript
function suggestAltText(fileName, pageContext) {
  // Exemplo: "Divisória Naval Eucatex - Banheiro Comercial - Planac Londrina"
  return `${pageContext.productName} - ${pageContext.category} - Planac Distribuidora`;
}
```

### 5.6 - Implementar Canonical URLs

#### 5.6.1 - Gerar Canonical Automaticamente
```javascript
// No template
const canonicalUrl = `https://siteplanaccompleto.pages.dev/${product.slug}.html`;
```

#### 5.6.2 - Adicionar em Todas as Páginas
```html
<link rel="canonical" href="URL_COMPLETA">
```

### 5.7 - Implementar Título e Descrição Otimizados

#### 5.7.1 - Validação no Admin
Mostrar contadores ao editar:
- ✅ Title: 50-60 caracteres (ótimo)
- ⚠️ Title: 61-70 caracteres (aceitável)
- ❌ Title: 71+ caracteres (muito longo)

#### 5.7.2 - Sugestões Automáticas
```javascript
function suggestMetaTitle(productName, category) {
  // Padrão SEO: "Produto | Categoria | Marca | Localização"
  return `${productName} | ${category} | Planac Londrina`;
}

function suggestMetaDescription(product) {
  return `${product.descricao_curta}. Qualidade, preço e entrega rápida em Londrina. Solicite orçamento: (43) 98418-2582`;
}
```

### 5.8 - Criar Google Search Console Integration

#### 5.8.1 - Verificar Propriedade
Adicionar meta tag de verificação:
```html
<meta name="google-site-verification" content="CODIGO_DO_GOOGLE">
```

#### 5.8.2 - Enviar Sitemap
Via Search Console → Sitemaps → Adicionar sitemap

#### 5.8.3 - Monitorar Erros
Criar webhook para alertar sobre erros:
```javascript
// Backend recebe notificações do Google Search Console
POST /api/seo/google-console-webhook
```

### 5.9 - Implementar Tracking de UTMs

#### 5.9.1 - Capturar UTMs no Frontend
```javascript
// Ao carregar página
const urlParams = new URLSearchParams(window.location.search);
const utmData = {
  utm_source: urlParams.get('utm_source'),
  utm_medium: urlParams.get('utm_medium'),
  utm_campaign: urlParams.get('utm_campaign'),
  utm_term: urlParams.get('utm_term'),
  utm_content: urlParams.get('utm_content')
};

// Salvar em localStorage
localStorage.setItem('utm_data', JSON.stringify(utmData));
```

#### 5.9.2 - Enviar com Formulário de Orçamento
```javascript
// Ao enviar formulário
const utmData = JSON.parse(localStorage.getItem('utm_data') || '{}');
formData.append('utm_source', utmData.utm_source);
formData.append('utm_campaign', utmData.utm_campaign);
```

#### 5.9.3 - Dashboard de Conversões por Campanha
Criar relatório no admin:
- Orçamentos por `utm_campaign`
- Taxa de conversão por `utm_source`
- ROI por campanha (se tiver custo)

### 5.10 - Criar Landing Pages Específicas para Google Ads

#### 5.10.1 - Template de Landing Page
```javascript
// Página focada em conversão, sem menu, direto ao ponto
function generateLandingPage(product, adGroup) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <title>${adGroup.adTitle} - Planac Londrina</title>
      <meta name="robots" content="noindex, nofollow"> <!-- Não indexar landing page -->
    </head>
    <body>
      <!-- Banner com título do anúncio -->
      <section class="hero">
        <h1>${adGroup.adTitle}</h1>
        <p>${adGroup.adDescription}</p>
        <a href="#formulario" class="cta-button">Solicitar Orçamento Grátis</a>
      </section>

      <!-- Benefícios -->
      <section class="benefits">
        ${renderBenefits(product.vantagens)}
      </section>

      <!-- Formulário GRANDE e VISÍVEL -->
      <section id="formulario" class="quote-form">
        <h2>Solicite seu Orçamento</h2>
        <form>
          <!-- Formulário simplificado -->
        </form>
      </section>

      <!-- Prova social -->
      <section class="social-proof">
        <p>✅ 14 anos no mercado</p>
        <p>✅ +10.000 clientes atendidos</p>
        <p>✅ Entrega rápida em Londrina</p>
      </section>
    </body>
    </html>
  `;
}
```

#### 5.10.2 - URLs de Landing Pages
```
/lp/divisoria-naval-londrina.html?utm_campaign=divisoria-naval
/lp/forro-pvc-londrina.html?utm_campaign=forro-pvc
```

---

# 📅 CRONOGRAMA DE EXECUÇÃO

## Ordem de Execução Sugerida

### ✅ Fase 1: Fundação (Semanas 1-2)
**Semana 1:**
- [ ] **ETAPA 1** → Padronizar header/footer dinâmicos
  - Criar tabela `site_config`
  - Criar endpoints backend
  - Criar página admin "Configurações do Site"
  - Atualizar templates dinâmicos

**Semana 2:**
- [ ] **ETAPA 5.1 até 5.7** → SEO básico
  - Implementar meta tags completas
  - Criar sitemap.xml
  - Criar robots.txt
  - Adicionar campos de alt text
  - Implementar canonical URLs

### 🟡 Fase 2: Estrutura (Semanas 3-6)
**Semanas 3-4:**
- [ ] **ETAPA 2** → Templates reutilizáveis
  - Criar estrutura de templates no backend
  - Implementar layouts base e de produto
  - Criar endpoint de renderização
  - Implementar sistema de cache (KV)

**Semanas 5-6:**
- [ ] **ETAPA 3** → Admin completo
  - Criar página "Aparência" (cores, tipografia)
  - Criar página "Editar Home"
  - Criar tabelas para dados da home
  - Implementar upload de banners globais
  - Sistema de textos reutilizáveis

### 🟢 Fase 3: Otimização (Semanas 7-8)
**Semana 7:**
- [ ] **ETAPA 4** → Performance
  - Conversão de imagens para WebP
  - Implementar lazy loading
  - Minificar CSS e JavaScript
  - Configurar cache agressivo
  - Otimizar fontes

**Semana 8:**
- [ ] **ETAPA 5.8 até 5.10** → SEO avançado
  - Implementar Schema.org (LocalBusiness, Product, Breadcrumb)
  - Configurar Google Search Console
  - Implementar tracking de UTMs
  - Criar landing pages para Google Ads
  - Dashboard de conversões

---

## ⏱️ Estimativa Total: **8 semanas (2 meses)**

### Distribuição de Esforço

| Etapa | Tempo Estimado | Complexidade | Prioridade |
|-------|---------------|--------------|------------|
| Etapa 1 | 1 semana | Média | 🔴 Alta |
| Etapa 2 | 2 semanas | Alta | 🔴 Alta |
| Etapa 3 | 2 semanas | Média | 🟡 Média |
| Etapa 4 | 1 semana | Média | 🔴 Alta |
| Etapa 5 | 2 semanas | Alta | 🔴 Alta |

---

# 🎯 RESULTADOS ESPERADOS

## 📊 Performance

### Core Web Vitals
- ✅ **CLS (Cumulative Layout Shift):** < 0.1 (já corrigido)
- ✅ **LCP (Largest Contentful Paint):** < 2.5s
- ✅ **FID (First Input Delay):** < 100ms
- ✅ **TTI (Time to Interactive):** < 3.5s
- ✅ **Velocidade de carregamento:** < 2s

### Otimizações Implementadas
- ✅ Imagens em WebP com múltiplos tamanhos
- ✅ Lazy loading em imagens e iframes
- ✅ CSS e JS minificados
- ✅ Compressão Brotli ativa
- ✅ Cache agressivo configurado
- ✅ Preload de recursos críticos

---

## 🔍 SEO

### SEO On-Page
- ✅ URLs amigáveis (slugs)
- ✅ Meta titles otimizados (50-60 caracteres)
- ✅ Meta descriptions otimizadas (150-160 caracteres)
- ✅ Alt text em todas as imagens
- ✅ Canonical URLs em todas as páginas
- ✅ Open Graph tags completas
- ✅ Schema.org markup (LocalBusiness, Product, Breadcrumb)
- ✅ Hierarquia de títulos correta (H1→H6)

### SEO Técnico
- ✅ HTTPS ativo
- ✅ Sitemap.xml dinâmico
- ✅ Robots.txt configurado
- ✅ Google Search Console integrado
- ✅ Velocidade < 3s
- ✅ Mobile-friendly
- ✅ CDN global (Cloudflare)

### SEO Local
- ✅ Google Business Profile configurado
- ✅ Endereço completo no site
- ✅ Telefone visível
- ✅ Geo tags implementadas
- ✅ Schema LocalBusiness
- ✅ Mapa integrado

### Resultados Projetados
- 📈 **Posição média no Google:** Top 10 para palavras-chave locais
- 📈 **Tráfego orgânico:** +150% em 6 meses
- 📈 **Taxa de cliques (CTR):** +30%
- 📈 **Indexação:** 100% das páginas indexadas

---

## 💰 Google Ads

### Índice de Qualidade
**Meta: 8-10/10**

#### Fatores de Melhoria
1. **CTR Esperado** (+50%)
   - Anúncios específicos por palavra-chave
   - Extensões ativas (telefone, localização, links)
   - Títulos otimizados

2. **Relevância do Anúncio** (+70%)
   - Grupos segmentados
   - Palavra-chave no título
   - Correspondência exata anúncio ↔ página

3. **Experiência na Landing Page** (+80%)
   - Velocidade < 2s
   - CLS < 0.1
   - Mobile-friendly
   - Conteúdo relevante
   - CTA claro

### Resultados Financeiros Projetados
- 💰 **CPC (Custo por Clique):** -30% a -50%
- 💰 **Taxa de conversão:** +50% a +100%
- 💰 **ROI (Retorno sobre Investimento):** +200%
- 💰 **Custo por aquisição (CPA):** -40%

### Tracking Implementado
- ✅ UTM tracking completo
- ✅ Dashboard de conversões por campanha
- ✅ Identificação de origem de orçamentos
- ✅ Relatórios de ROI por palavra-chave

---

## 🛠️ Manutenção

### Facilidade de Edição
- ✅ **Zero edição manual de HTML**
- ✅ **Alterações via admin em segundos**
- ✅ **Preview ao vivo antes de publicar**
- ✅ **Sistema de versionamento**
- ✅ **Rollback de alterações**

### Escalabilidade
- ✅ **Adicionar novo produto:** 2 minutos
- ✅ **Editar menu completo:** 5 minutos
- ✅ **Trocar banner da home:** 30 segundos
- ✅ **Atualizar cores do site:** 1 minuto
- ✅ **Criar nova landing page:** 10 minutos

### Autonomia do Cliente
- ✅ Pode editar 100% do conteúdo sem desenvolvedor
- ✅ Upload ilimitado de imagens
- ✅ Criação ilimitada de páginas
- ✅ Gestão completa de menus
- ✅ Visualização de orçamentos em tempo real

---

## 📈 KPIs (Indicadores de Sucesso)

### Mês 1
- ✅ Sistema completo implementado
- ✅ Core Web Vitals: "Bom" em todas as métricas
- ✅ 100% das páginas indexadas no Google
- ✅ Google Ads: Índice de Qualidade ≥ 7/10

### Mês 3
- 📈 Tráfego orgânico: +50%
- 📈 Posição média Google: Top 15
- 📈 Taxa de conversão: +30%
- 📈 Google Ads CPC: -20%

### Mês 6
- 📈 Tráfego orgânico: +150%
- 📈 Posição média Google: Top 10
- 📈 Taxa de conversão: +70%
- 📈 Google Ads CPC: -40%
- 📈 ROI Google Ads: +200%

---

## 💡 Benefícios Adicionais

### Para o Negócio
- 💼 Maior profissionalismo percebido
- 💼 Competitividade com grandes players
- 💼 Redução de custo de aquisição
- 💼 Aumento de ticket médio
- 💼 Fidelização de clientes

### Para a Equipe
- 👥 Autonomia total para editar conteúdo
- 👥 Redução de dependência de desenvolvedores
- 👥 Agilidade em campanhas e promoções
- 👥 Dados em tempo real para tomada de decisão
- 👥 Menos retrabalho

### Para os Usuários
- 👤 Site mais rápido
- 👤 Melhor experiência mobile
- 👤 Informações sempre atualizadas
- 👤 Formulários mais simples
- 👤 Carregamento instantâneo

---

# ✅ CONCLUSÃO

Este plano de reavaliação apresenta uma estratégia completa e detalhada para transformar o site da Planac Distribuidora em um sistema moderno, dinâmico e otimizado.

## Principais Destaques

### 🎯 Foco em Resultados
- Performance mensurada (Core Web Vitals)
- SEO baseado em dados (Google Search Console)
- ROI rastreável (UTM tracking)

### 🚀 Escalabilidade
- Sistema preparado para crescimento
- Fácil adição de novos produtos
- Estrutura modular e reutilizável

### 💰 Redução de Custos
- Menor CPC no Google Ads
- Redução de dependência de desenvolvedores
- Automação de processos

### 📈 Crescimento Sustentável
- SEO orgânico de longo prazo
- Base sólida para expansão
- Dados para decisões estratégicas

---

## Próximos Passos Imediatos

1. ✅ **Aprovação do plano** (este documento)
2. 🔧 **Iniciar Etapa 1** (Header/Footer dinâmicos)
3. 📊 **Configurar métricas de acompanhamento**
4. 🎨 **Levantar identidade visual atualizada**
5. 📝 **Definir prioridades de conteúdo**

---

**Documento criado em:** 13 de Novembro de 2025
**Última atualização:** 13 de Novembro de 2025
**Versão:** 1.0.0
**Status:** ✅ Pronto para Implementação

---

## 📞 Contatos do Projeto

**Site Atual:**
https://siteplanaccompleto.pages.dev

**Admin Panel:**
https://planac-admin.pages.dev

**Backend API:**
https://planac-backend-api.planacacabamentos.workers.dev

**Repositório GitHub:**
https://github.com/Ropetr/SitePlanacCompleto

---

**🚀 Pronto para começar a transformação digital da Planac Distribuidora!**

---
---
---

# 🔍 AUDITORIA COMPLETA DO PROJETO ATUAL

**Data da Auditoria:** 14 de Novembro de 2025
**Executada por:** Claude (Anthropic)
**Metodologia:** 6 Prompts de Auditoria Sequenciais

---

## 📋 PROMPT 1 – TABELA COMPLETA: O QUE JÁ FUNCIONA vs. O QUE NÃO EXISTE

| **ETAPA** | **FUNCIONALIDADE** | **STATUS** | **% IMPLEMENTADO** | **OBSERVAÇÕES** |
|-----------|-------------------|------------|-------------------|-----------------|
| **ETAPA 1: Header/Footer Dinâmicos** | | | **20%** | |
| 1.1 | Tabela `site_config` no banco | ✅ **EXISTE** | 100% | Tabela `settings` criada em `schema.sql:123-136` |
| 1.2 | Endpoint backend `/api/site-config` | ✅ **EXISTE** | 100% | Rota existe em `planac-backend/src/routes/settings.js` |
| 1.3 | Página admin "Configurações" | ❌ **NÃO EXISTE** | 0% | `App.jsx:13-15` mostra apenas placeholder |
| 1.4 | Template dinâmico header/footer | ❌ **NÃO EXISTE** | 0% | Ainda são arquivos estáticos |
| 1.5 | Endpoint `/api/pages/header` | ✅ **PARCIAL** | 50% | Existe mas retorna HTML estático |
| 1.6 | Script de build atualizado | ❌ **NÃO EXISTE** | 0% | `build-static-pages.js` não encontrado |
| 1.7 | `load-components.js` dinâmico | ✅ **FUNCIONA** | 100% | Carrega header da API em `load-components.js:133` |
| **PROBLEMA CRÍTICO** | Header/footer **COLADOS** nas páginas de produto | 🔴 **BUG** | - | 20+ páginas têm header/footer hardcoded |
| | | | | |
| **ETAPA 2: Templates Reutilizáveis** | | | **0%** | |
| 2.1 | Estrutura de templates no backend | ❌ **NÃO EXISTE** | 0% | Pasta `planac-backend/src/templates/` vazia |
| 2.2 | Template base universal | ❌ **NÃO EXISTE** | 0% | - |
| 2.3 | Template de página de produto | ❌ **NÃO EXISTE** | 0% | - |
| 2.4 | Endpoint `/api/pages/render/:slug` | ❌ **NÃO EXISTE** | 0% | - |
| 2.5 | Sistema de cache (KV) | ❌ **NÃO EXISTE** | 0% | KV configurado mas não usado para páginas |
| 2.6 | Invalidação de cache no admin | ❌ **NÃO EXISTE** | 0% | - |
| 2.7 | Script de build com renderização | ❌ **NÃO EXISTE** | 0% | - |
| | | | | |
| **ETAPA 3: Admin Completo** | | | **40%** | |
| 3.1 | Página "Aparência" (cores/tema) | ❌ **NÃO EXISTE** | 0% | - |
| 3.2 | Página "Editar Home" | ❌ **NÃO EXISTE** | 0% | - |
| 3.3 | Tabela `home_sections` | ❌ **NÃO EXISTE** | 0% | Não encontrada em `schema.sql` |
| 3.4 | Endpoints da home | ❌ **NÃO EXISTE** | 0% | - |
| 3.5 | Upload de banners globais | ✅ **EXISTE** | 100% | Sistema de upload de imagens funcional |
| 3.6 | Sistema de textos reutilizáveis | ✅ **EXISTE** | 100% | Tabela `settings` serve para isso |
| **O QUE JÁ FUNCIONA** | Gestão de produtos | ✅ **COMPLETO** | 100% | `Products.jsx` - CRUD completo |
| | Gestão de menus | ✅ **COMPLETO** | 100% | `Menus.jsx` - CRUD completo |
| | Upload de imagens (R2) | ✅ **COMPLETO** | 100% | Sistema de media funcional |
| | Visualizar orçamentos | ✅ **COMPLETO** | 100% | `Quotes.jsx` - lista orçamentos |
| | Visualizar contatos | ✅ **COMPLETO** | 100% | `Contacts.jsx` - lista contatos |
| | Dashboard com estatísticas | ✅ **COMPLETO** | 100% | `Dashboard.jsx` - mostra métricas |
| | | | | |
| **ETAPA 4: Performance** | | | **25%** | |
| 4.1 | Conversão para WebP | ❌ **BUG CRÍTICO** | 0% | Função existe mas retorna `converted: false` |
| 4.2 | Lazy loading | ✅ **PARCIAL** | 50% | Implementado em algumas páginas |
| 4.3 | Minificação CSS/JS | ❌ **NÃO EXISTE** | 0% | Código não minificado |
| 4.4 | Compressão Brotli | ✅ **ATIVO** | 100% | Cloudflare faz automaticamente |
| 4.5 | Preload de recursos críticos | ✅ **PARCIAL** | 60% | Algumas páginas têm, outras não |
| 4.6 | Cache agressivo | ❌ **NÃO EXISTE** | 0% | Sem configuração de headers de cache |
| 4.7 | Fontes otimizadas | ✅ **OK** | 100% | Google Fonts com preconnect |
| 4.8 | Monitoramento Web Vitals | ❌ **NÃO EXISTE** | 0% | - |
| | | | | |
| **ETAPA 5: SEO** | | | **20%** | |
| 5.1 | Meta tags completas | ✅ **PARCIAL** | 40% | Title e description inconsistentes |
| 5.2 | Schema.org (JSON-LD) | ❌ **NÃO EXISTE** | 0% | Sem structured data |
| 5.3 | Sitemap.xml dinâmico | ❌ **NÃO EXISTE** | 0% | Arquivo não existe |
| 5.4 | robots.txt | ❌ **NÃO EXISTE** | 0% | Arquivo não existe |
| 5.5 | Alt text em imagens | ✅ **PARCIAL** | 50% | Tabela tem campo mas não obrigatório |
| 5.6 | Canonical URLs | ❌ **NÃO EXISTE** | 0% | ZERO páginas têm canonical |
| 5.7 | Title/description otimizados | ✅ **PARCIAL** | 40% | Algumas páginas OK, outras não |
| 5.8 | Google Search Console | ❌ **NÃO INTEGRADO** | 0% | - |
| 5.9 | Tracking UTMs | ❌ **NÃO EXISTE** | 0% | - |
| 5.10 | Landing pages para Ads | ❌ **NÃO EXISTE** | 0% | - |

### 📊 **RESUMO EXECUTIVO**

| Etapa | Implementação | Observação |
|-------|--------------|------------|
| **ETAPA 1** | 🟡 20% | Backend pronto, admin incompleto, **BUG crítico**: header/footer colados |
| **ETAPA 2** | 🔴 0% | Nada implementado |
| **ETAPA 3** | 🟡 40% | Produtos/menus OK, falta home e aparência |
| **ETAPA 4** | 🟡 25% | **BUG crítico**: WebP não converte de verdade |
| **ETAPA 5** | 🔴 20% | SEO básico inconsistente, infraestrutura ausente |

### **🎯 MÉDIA GERAL: 21% IMPLEMENTADO**

---

## ✅ PROMPT 2 – HEADER/FOOTER FUNCIONANDO?

### 🔍 **DESCOBERTA CRÍTICA:**

#### ❌ **PROBLEMA: Header/Footer estão COLADOS nas páginas de produto**

**Evidências:**

1. **`divisoria-naval-page.html:20-89`** - 70 linhas de header hardcoded
2. **`forro-de-pvc-modular.html:20-89`** - 70 linhas de header hardcoded
3. **`drywall-divisoria-page.html:20-89`** - 70 linhas de header hardcoded

**Comparação:**

| Arquivo | Header | Footer | Usa componente? |
|---------|--------|--------|-----------------|
| `index.html` | ✅ `<div id="header-container"></div>` (linha 573) | ✅ `<div id="footer-container"></div>` (linha 861) | ✅ SIM |
| `divisoria-naval-page.html` | ❌ `<header>` completo colado (linhas 20-89) | ❌ `<footer>` completo colado (linhas 233-269) | ❌ NÃO |
| `forro-de-pvc-modular.html` | ❌ `<header>` completo colado (linhas 20-89) | ❌ `<footer>` completo colado (linhas 203-239) | ❌ NÃO |

### 🔴 **IMPACTO:**

- **Editar** `header.html` → ❌ NÃO atualiza as 20+ páginas de produto
- **Editar** `footer.html` → ❌ NÃO atualiza as 20+ páginas de produto
- **Editar menu no admin** → ❌ NÃO reflete nas páginas
- **Mudar telefone** → Precisa editar 20+ arquivos manualmente

### ✅ **O que FUNCIONA:**

- `load-components.js` carrega corretamente da API (linha 133)
- `index.html` usa o sistema de componentes CORRETAMENTE
- Endpoint `/api/pages/header` existe e responde

### ❌ **O que NÃO FUNCIONA:**

- Páginas de produto ignoram `load-components.js`
- Header/footer duplicados em 20+ arquivos HTML
- Sistema de build não injeta componentes inline

---

## ✅ PROMPT 3 – O QUE O ADMIN JÁ CONTROLA DE VERDADE

### 📊 **7 PÁGINAS DO ADMIN:**

| # | Página | Arquivo | Status | Endpoints usados |
|---|--------|---------|--------|-----------------|
| 1 | **Login** | `Login.jsx` | ✅ Funcional | `POST /api/auth/login`<br>`POST /api/auth/refresh` |
| 2 | **Dashboard** | `Dashboard.jsx` | ✅ Funcional | `GET /api/admin/dashboard/stats` |
| 3 | **Páginas (Produtos)** | `Products.jsx` | ✅ Funcional | `GET /api/products`<br>`DELETE /api/admin/products/:id`<br>`PUT /api/admin/products/:id` |
| 4 | **Menus** | `Menus.jsx` | ✅ Funcional | `GET /api/menus`<br>`POST /api/admin/menus`<br>`PUT /api/admin/menus/:id`<br>`DELETE /api/admin/menus/:id` |
| 5 | **Orçamentos** | `Quotes.jsx` | ✅ Funcional | `GET /api/admin/quotes` |
| 6 | **Contatos** | `Contacts.jsx` | ✅ Funcional | `GET /api/admin/contacts` |
| 7 | **Configurações** | `Settings` (placeholder) | ❌ NÃO FUNCIONA | Nenhum - só mostra texto "Em breve" |

### ✅ **O QUE O ADMIN JÁ CONTROLA (DE VERDADE):**

#### 1️⃣ **Produtos/Páginas** (`Products.jsx`)
- ✅ Criar nova página
- ✅ Editar título, subtítulo, descrição
- ✅ Upload de banner
- ✅ Upload de galeria (múltiplas imagens)
- ✅ Associar a menu
- ✅ Definir características, vantagens, aplicações
- ✅ Publicar/despublicar (toggle de status)
- ✅ Excluir página
- ✅ Busca e filtros

**Código relevante:**
```javascript
// Products.jsx:33 - Busca produtos
const response = await axios.get(`${API_URL}/api/products`, { params });

// Products.jsx:62 - Deleta produto
await axios.delete(`${API_URL}/api/admin/products/${productId}`);

// Products.jsx:74 - Alterna status
await axios.put(`${API_URL}/api/admin/products/${product.id}`, {
  status: novoStatus
});
```

#### 2️⃣ **Menus** (`Menus.jsx`)
- ✅ Criar menu principal
- ✅ Criar submenu (até 2 níveis)
- ✅ Definir ordem de exibição
- ✅ Ativar/inativar menu
- ✅ Excluir menu
- ✅ Definir URL ou âncora (#divisorias)

#### 3️⃣ **Upload de Imagens**
- ✅ Upload para Cloudflare R2
- ✅ URLs geradas automaticamente
- ✅ Associação a produtos

#### 4️⃣ **Visualização de Dados**
- ✅ Dashboard com total de produtos, menus, orçamentos, contatos
- ✅ Lista de orçamentos recebidos (leitura)
- ✅ Lista de contatos do formulário (leitura)

### ❌ **O QUE O ADMIN NÃO CONTROLA (MAS DEVERIA):**

#### 🔴 **Configurações Globais** (Settings não implementado)
Tabela `settings` EXISTE no banco, mas SEM interface admin:
- ❌ Logo do site
- ❌ Telefones (fixo e WhatsApp)
- ❌ Endereço completo
- ❌ Redes sociais (Instagram, Facebook)
- ❌ Horário de funcionamento
- ❌ Texto do rodapé

**Evidência:** `App.jsx:13-15`
```javascript
function Settings() {
  return <div className="text-2xl font-bold">Configurações - Em breve</div>;
}
```

#### ❌ **Outras funcionalidades ausentes:**
- Editar cores do site (tema)
- Editar seções da home
- Editar banner principal
- Editar cards de features
- Editar textos da seção "Sobre"
- Gerenciar banners globais

### 📊 **RESUMO:**

| Funcionalidade | Status | % Controle |
|----------------|--------|-----------|
| **Produtos e páginas** | ✅ Completo | 100% |
| **Menus e navegação** | ✅ Completo | 100% |
| **Upload de mídia** | ✅ Completo | 100% |
| **Orçamentos/Contatos** | ✅ Visualização | 100% (read-only) |
| **Configurações globais** | ❌ Placeholder | 0% |
| **Home page** | ❌ Não existe | 0% |
| **Tema/Aparência** | ❌ Não existe | 0% |

**Conclusão:** Admin controla MUITO BEM produtos e menus, mas NÃO controla configurações básicas do site (telefone, logo, etc).

---

## ✅ PROMPT 4 – IMAGENS WEBP: VERDADE OU PROMESSA?

### 🔍 **AUDITORIA COMPLETA:**

#### 1️⃣ **Sharp instalado?**

❌ **NÃO** - `planac-backend/package.json` NÃO tem Sharp

**Dependências atuais:**
```json
{
  "better-sqlite3": "^12.4.1",
  "hono": "^3.11.7",
  "jose": "^5.2.0",
  "jsdom": "^27.1.0",
  "zod": "^3.22.4"
}
```

#### 2️⃣ **Função de conversão WebP** (`planac-backend/src/routes/media.js:18-31`)

🔴 **BUG CRÍTICO ENCONTRADO:**

```javascript
async function convertToWebP(arrayBuffer, originalType) {
  try {
    // Para Workers, precisamos usar a API de imagens do Cloudflare
    // que faz conversão automática para WebP
    return {
      buffer: arrayBuffer,
      converted: false,  // ❌ SEMPRE RETORNA FALSE!
      note: 'Use Cloudflare Image Resizing service for WebP conversion'
    };
  } catch (error) {
    console.error('Erro na conversão:', error);
    return { buffer: arrayBuffer, converted: false };
  }
}
```

**Análise:**
- Função existe mas é **FAKE**
- Sempre retorna `converted: false`
- NÃO converte nada, apenas retorna o buffer original

#### 3️⃣ **Upload de imagem** (`media.js:183-194`)

🔴 **BUG SEVERO:**

```javascript
const fileName = `${timestamp}-${randomStr}.webp`;  // Nome .webp
await c.env.R2_IMAGES.put(fileName, arrayBuffer, {  // Mas conteúdo é JPG/PNG!
  httpMetadata: {
    contentType: 'image/webp',  // Headers mentem sobre o formato
  },
});
```

**Problema:**
- Arquivo é renomeado para `.webp`
- Conteúdo continua sendo JPG/PNG
- Headers dizem `image/webp` mas é MENTIRA
- **Resultado:** Imagens corrompidas ou navegador não carrega

#### 4️⃣ **Lazy Loading**

✅ **PARCIALMENTE implementado** nas páginas HTML

❌ **NÃO encontrado** `<picture>` com srcset em NENHUMA página

#### 5️⃣ **Preload de recursos**

✅ **IMPLEMENTADO** com `fetchpriority="high"`:

```html
<!-- divisoria-naval-page.html:10-11 -->
<link rel="preload" as="image" href="https://painel-planac.codiehost.com.br/uploads/133603401096191514.jpg" fetchpriority="high">
<link rel="preload" as="image" href="Logo.svg" fetchpriority="high">
```

⚠️ **BUG:** `forro-de-pvc-modular.html:10` tem preload com `href=""` (vazio)

### 📊 **RESUMO - WebP é PROMESSA, não VERDADE:**

| Feature | Prometido? | Funciona? | Status |
|---------|-----------|-----------|--------|
| **Conversão WebP** | ✅ Sim | ❌ **NÃO** | 🔴 Função fake, sempre retorna `converted: false` |
| **Sharp instalado** | ✅ Necessário | ❌ **NÃO** | Package não está no `package.json` |
| **Múltiplos tamanhos** | ✅ Sim (thumb/medium/large) | ❌ **NÃO** | Não implementado |
| **`<picture>` srcset** | ✅ Sim | ❌ **NÃO** | Não encontrado em nenhuma página |
| **Lazy loading** | ✅ Sim | ✅ **PARCIAL** | Implementado em algumas páginas |
| **Preload crítico** | ✅ Sim | ✅ **SIM** | Funciona com `fetchpriority="high"` |

### 🔥 **PERIGO IMINENTE:**

Arquivos estão sendo salvos como:
```
133603401096191514.webp  ← Nome diz WebP
```

Mas o conteúdo é:
```
FF D8 FF E0 ...  ← Assinatura de JPG
```

Isso pode causar:
- Imagens não carregam
- Erro 404 ou erro de formato
- Performance pior (JPG com extensão .webp)

---

## ✅ PROMPT 5 – SEO QUE ESTÁ VALENDO AGORA NO SITE

### 📄 **Análise de 3 Páginas**

| Elemento | `index.html` | `divisoria-naval-page.html` | `forro-de-pvc-modular.html` |
|----------|--------------|----------------------------|----------------------------|
| **`<title>`** | ✅ `Planac Distribuidora - Forros e Divisórias` | ✅ `Divisória Naval - Planac Distribuidora` | ⚠️ `Forro de Pvc Modular` |
| **`<meta description>`** | ❌ **AUSENTE** | ✅ `A Divisória Naval, também conhecida como divisória metálica, é uma solução robusta...` (completa) | ⚠️ `Sistema modular versátil e de fácil manutenção` (muito curta) |
| **`<link rel="canonical">`** | ❌ **AUSENTE** | ❌ **AUSENTE** | ❌ **AUSENTE** |

### 📁 **Verificação em /dist/ e raiz do projeto**

| Arquivo | Pasta /dist/ | Raiz do projeto |
|---------|--------------|-----------------|
| **sitemap.xml** | ❌ NÃO EXISTE | ❌ NÃO EXISTE |
| **robots.txt** | ❌ NÃO EXISTE | ❌ NÃO EXISTE |

### ✅ **SEO BÁSICO IMPLEMENTADO** (pontos que estão OK):

1. **✅ Title tags existem** em todas as 3 páginas verificadas
2. **✅ Meta description** existe em 2 de 3 páginas (`divisoria-naval` tem descrição completa e rica)
3. **✅ Meta keywords** existe em 2 de 3 páginas (embora esse campo não seja mais relevante para SEO em 2025)
4. **✅ Preload com `fetchpriority="high"`** implementado em páginas de produto

### ❌ **SEO BÁSICO FALTANDO** (pontos que ainda não existem):

1. **❌ URL Canônica (`<link rel="canonical">`)**: ZERO páginas têm canonical URL
   - **Impacto**: Risco de conteúdo duplicado, Google pode indexar múltiplas versões da mesma página

2. **❌ sitemap.xml**: Não existe em nenhum lugar do projeto
   - **Impacto crítico**: Google não conhece automaticamente todas as páginas do site
   - Indexação depende 100% de rastreamento manual (crawling)

3. **❌ robots.txt**: Não existe
   - **Impacto**: Sem controle sobre o que crawlers podem acessar
   - Sem referência ao sitemap.xml (que também não existe)

4. **❌ Meta description na home** (`index.html`): Ausente
   - **Impacto**: Google vai gerar snippet automático, pode não ser ideal

5. **❌ Title tag incompleta** em `forro-de-pvc-modular.html`:
   - Falta branding "- Planac Distribuidora"
   - Não tem contexto geográfico (Londrina)

6. **❌ Meta description genérica** em `forro-de-pvc-modular.html`:
   - Muito curta (apenas 39 caracteres)
   - Ideal seria 150-160 caracteres

7. **❌ Open Graph tags**: Ausentes em todas as páginas
8. **❌ Twitter Cards**: Ausentes em todas as páginas
9. **❌ Schema.org JSON-LD**: Ausente em todas as páginas

### 📊 **RESUMO OBJETIVO:**

#### ✅ **SEO básico implementado:**
- Title tags presentes (qualidade variável)
- Meta description em 66% das páginas
- Preload de recursos críticos

#### ❌ **SEO básico faltando:**
- Canonical URLs (0%)
- sitemap.xml (não existe)
- robots.txt (não existe)
- Open Graph / Twitter Cards (0%)
- Schema.org structured data (0%)
- Consistência nas meta tags

| Categoria | Status |
|-----------|--------|
| **SEO básico funcionando** | ~30% |
| **SEO básico faltando** | ~70% |

**Diagnóstico:** O site tem estrutura básica de SEO (títulos em algumas páginas), mas falta toda a infraestrutura técnica essencial (sitemap, canonical, robots.txt, structured data) e consistência nas meta descriptions.

---

## ✅ PROMPT 6 – REGRAS OBRIGATÓRIAS DE TRABALHO

### 🔒 **A partir de agora, sigo estas regras OBRIGATÓRIAS neste projeto:**

#### 📋 **ANTES de alterar qualquer arquivo, EU DEVO:**

1. **Explicar o problema que estou resolvendo**
2. **Listar os arquivos que pretendo mudar**
3. **Descrever, em 3–5 tópicos, o que vou fazer em cada arquivo**

#### ⏸️ **PARADA OBRIGATÓRIA:**

**Você SÓ pode escrever código depois que eu responder 'APROVADO'.**

#### 📦 **Mudanças pequenas e focadas:**

- As mudanças devem ser pequenas e focadas (poucos arquivos por vez)
- Nunca alterar mais de 3-5 arquivos em uma única ação

#### 📝 **AO FINAL de cada alteração, EU DEVO:**

1. **Mostrar um diff/resumo do que mudou**
2. **Te dizer como testar no navegador (URL ou passo a passo)**

#### 🚫 **PROIBIÇÕES:**

**É PROIBIDO remover funcionalidades existentes sem:**
- Avisar o impacto
- Sugerir outra solução alternativa

### ✅ **CONFIRMAÇÃO:**

**Entendi perfeitamente essas regras e vou segui-las daqui pra frente.**

A partir de agora:
- ❌ **NÃO vou** criar/alterar código sem sua aprovação explícita
- ✅ **VOU** sempre explicar O QUE vou fazer, EM QUAIS arquivos, e ESPERAR seu "APROVADO"
- ✅ **VOU** mostrar resumo do que mudou e como testar
- ❌ **NÃO vou** remover features sem avisar o impacto

---

## 🎯 **RESUMO FINAL DA AUDITORIA**

### 📊 **RESUMO DOS 6 PROMPTS:**

| Prompt | Título | Status | Descoberta Principal |
|--------|--------|--------|---------------------|
| **1** | Checklist implementação | ✅ | **21% implementado** no geral |
| **2** | Header/Footer funcionando? | ✅ | 🔴 **BUG**: Colados em 20+ páginas |
| **3** | O que admin controla? | ✅ | Admin controla produtos/menus, **NÃO** controla configurações |
| **4** | WebP real ou fake? | ✅ | 🔴 **BUG CRÍTICO**: Conversão é fake, sempre retorna `false` |
| **5** | SEO atual | ✅ | **30% implementado**, falta canonical, sitemap, robots.txt |
| **6** | Regras de trabalho | ✅ | Regras aceitas e implementadas |

### 🔥 **BUGS CRÍTICOS ENCONTRADOS:**

1. **Header/Footer colados** em 20+ páginas de produto → Editar header.html não atualiza nada
2. **WebP conversão FAKE** → Salva JPG com extensão .webp
3. **Configurações sem interface** → Admin não edita telefone, logo, endereço
4. **SEO básico ausente** → Sem sitemap.xml, robots.txt, canonical URLs

### 📈 **PRÓXIMOS PASSOS RECOMENDADOS:**

1. **Prioridade MÁXIMA:** Corrigir bug do header/footer colado (impacta manutenção)
2. **Prioridade ALTA:** Corrigir bug do WebP (impacta performance e pode quebrar imagens)
3. **Prioridade ALTA:** Implementar página de Configurações no admin
4. **Prioridade MÉDIA:** Criar sitemap.xml e robots.txt
5. **Prioridade MÉDIA:** Adicionar canonical URLs em todas as páginas

---

**Data da Auditoria:** 14 de Novembro de 2025
**Status:** ✅ Auditoria Completa
**Próxima Ação:** Aguardando aprovação para correções
