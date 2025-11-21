# 📋 PLANO DE AÇÃO ATUAL - SITE PLANAC
**Data:** 21/11/2025
**Versão:** 1.0
**Base:** Análise completa da documentação + código real

---

## 🎯 CONTEXTO GERAL

O projeto passou por uma grande evolução em 14/11/2025:
- ✅ **18 páginas HTML padronizadas** com ServicePageTemplateV1
- ✅ **Headers e footers dinâmicos** implementados
- ✅ **Admin funcional** para produtos, menus e upload de imagens
- ✅ **Bug WebP** corrigido (não converte mais JPG para .webp fake)

**Situação atual:**
- **Média geral:** ~46% do plano original implementado
- **Etapa 1 (Header/Footer):** 95% concluído
- **Etapa 2 (Templates):** 50% concluído
- **Etapa 3 (Admin):** 40% concluído
- **Etapa 4 (Performance):** 25% concluído
- **Etapa 5 (SEO):** 20% concluído

---

## 📊 DIVISÃO DO PLANO

### 🔴 BLOCO 1: CORREÇÕES URGENTES (Bugs e Inconsistências)
Prioridade máxima para estabilizar o sistema.

### 🟡 BLOCO 2: PADRONIZAÇÃO VISUAL E TEMPLATES
Melhorias de estrutura e organização do código.

### 🟢 BLOCO 3: EVOLUÇÕES DO ADMIN
Novas funcionalidades e edição avançada de conteúdo.

---

# 🔴 BLOCO 1: CORREÇÕES URGENTES

## Tarefa 1.1 - Implementar Página de Configurações no Admin
**Status:** ❌ NÃO EXISTE
**Prioridade:** ALTA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
A tabela `settings` existe no banco D1, mas não há interface no admin para editar configurações globais como:
- Logo do site
- Telefones (fixo e WhatsApp)
- Endereço completo
- Redes sociais (Instagram, Facebook)
- Horário de funcionamento
- Texto do rodapé

### Arquivos a alterar
1. `planac-admin/src/pages/Settings.jsx` - Criar UI completa
2. `planac-admin/src/App.jsx` - Remover placeholder "Em breve"
3. `planac-backend/src/routes/settings.js` - Verificar/criar endpoints necessários

### O que fazer
- Criar formulário com campos para todas as configurações
- Conectar aos endpoints existentes do backend
- Permitir upload de logo
- Validação de campos obrigatórios (telefone, endereço)
- Mensagem de sucesso ao salvar

---

## Tarefa 1.2 - Adicionar Meta Tags Essenciais nas Páginas
**Status:** ❌ PARCIALMENTE IMPLEMENTADO
**Prioridade:** ALTA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
Análise de SEO mostra:
- `index.html` → ❌ Sem `<meta name="description">`
- Algumas páginas → ❌ Sem `<link rel="canonical">`
- Nenhuma página → ❌ Sem Open Graph tags
- Nenhuma página → ❌ Sem Schema.org JSON-LD

### Arquivos a alterar
1. `index.html` - Adicionar meta description
2. ServicePageTemplateV1 (se existir como arquivo separado)
3. Todas as páginas de produto (18 arquivos)

### O que fazer
- Adicionar `<meta name="description">` em todas as páginas
- Adicionar `<link rel="canonical">` com URL completa
- Adicionar Open Graph básico (og:title, og:description, og:image)
- Adicionar Schema.org LocalBusiness na home
- Adicionar Schema.org Product nas páginas de produto

---

## Tarefa 1.3 - Criar sitemap.xml e robots.txt
**Status:** ❌ NÃO EXISTE
**Prioridade:** ALTA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
- ❌ Não existe `sitemap.xml` (nem estático, nem dinâmico)
- ❌ Não existe `robots.txt`
- Google não consegue descobrir todas as páginas automaticamente
- Pode haver páginas não indexadas

### Arquivos a criar
1. `sitemap.xml` - Arquivo estático na raiz OU
2. `planac-backend/src/routes/seo.js` - Endpoint `/api/seo/sitemap.xml` dinâmico
3. `robots.txt` - Arquivo estático na raiz

### O que fazer
- Criar `sitemap.xml` listando:
  - Home (`/`)
  - Todas as 18 páginas de produto
  - `<lastmod>`, `<changefreq>`, `<priority>` adequados
- Criar `robots.txt`:
  - `User-agent: *`
  - `Allow: /`
  - `Disallow: /admin/`
  - `Sitemap: https://siteplanaccompleto.pages.dev/sitemap.xml`

---

## Tarefa 1.4 - Garantir lazy loading em todas as imagens não críticas
**Status:** ✅ PARCIALMENTE IMPLEMENTADO
**Prioridade:** MÉDIA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
- Lazy loading existe em ALGUMAS páginas
- Não há consistência entre as 18 páginas
- Imagens abaixo da dobra estão carregando imediatamente

### Arquivos a alterar
1. Todas as 18 páginas de produto
2. `index.html` (verificar imagens dos cards e seções)

### O que fazer
- Adicionar `loading="lazy"` em TODAS as imagens que não são:
  - Logo do header
  - Banner principal (hero)
  - Primeira imagem visível
- Manter `fetchpriority="high"` apenas no banner principal
- Verificar consistência em todas as páginas

---

## Tarefa 1.5 - Corrigir Title Tags inconsistentes
**Status:** ⚠️ INCONSISTENTE
**Prioridade:** MÉDIA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
Análise mostrou:
- ✅ `divisoria-naval-page.html`: "Divisória Naval - Planac Distribuidora"
- ❌ `forro-de-pvc-modular.html`: "Forro de Pvc Modular" (sem marca, sem cidade)

### Arquivos a alterar
1. Todas as 18 páginas de produto

### O que fazer
- Padronizar formato: `[Nome do Produto] - Planac Distribuidora`
- Opcional: Adicionar cidade para SEO local: `[Nome do Produto] | Planac Londrina`
- Limite: 50-60 caracteres
- Exemplo bom: `Forro de PVC Modular | Planac Londrina`

---

# 🟡 BLOCO 2: PADRONIZAÇÃO VISUAL E TEMPLATES

## Tarefa 2.1 - Criar Template Base Reutilizável no Backend
**Status:** ❌ NÃO EXISTE
**Prioridade:** MÉDIA
**Risco:** Médio
**Dependências:** Nenhuma

### Problema
- Pasta `planac-backend/src/templates/` existe mas está vazia
- Cada página HTML é um arquivo completo e separado
- Mudanças no layout exigem editar 18 arquivos

### Arquivos a criar
1. `planac-backend/src/templates/layouts/base-layout.js`
2. `planac-backend/src/templates/layouts/product-layout.js`
3. `planac-backend/src/templates/sections/banner-section.js`
4. `planac-backend/src/templates/sections/breadcrumb-section.js`

### O que fazer
- Criar função `baseLayout({ title, description, content })` que retorna HTML completo
- Criar função `productPageLayout(product)` que monta página de produto
- Separar seções reutilizáveis (banner, breadcrumb, CTA, formulário)
- Permitir composição de seções dinamicamente

---

## Tarefa 2.2 - Criar Endpoint para Renderizar Páginas Dinamicamente
**Status:** ❌ NÃO EXISTE
**Prioridade:** MÉDIA
**Risco:** Médio
**Dependências:** Tarefa 2.1

### Problema
- Páginas são geradas manualmente
- Não existe endpoint `/api/pages/render/:slug`
- Admin não consegue gerar HTML automaticamente

### Arquivos a criar/alterar
1. `planac-backend/src/routes/pages.js` - Adicionar rota `GET /render/:slug`
2. `planac-backend/src/utils/page-builder.js` - Usar templates criados

### O que fazer
- Criar endpoint que:
  1. Busca produto do banco por slug
  2. Carrega header/footer do KV
  3. Monta HTML usando templates
  4. Retorna HTML completo
- Usar cache KV (TTL 5 minutos)
- Permitir invalidação de cache via admin

---

## Tarefa 2.3 - Implementar Sistema de Cache com Invalidação
**Status:** ✅ EXISTE PARCIALMENTE
**Prioridade:** MÉDIA
**Risco:** Baixo
**Dependências:** Tarefa 2.2

### Problema
- KV está configurado mas não é usado de forma consistente
- Não há invalidação automática ao editar página no admin
- Não há controle de cache nos headers HTTP

### Arquivos a alterar
1. `planac-backend/src/routes/pages.js` - Adicionar cache KV
2. `planac-backend/src/routes/products.js` - Invalidar cache ao editar
3. `planac-backend/src/routes/media.js` - Invalidar cache ao trocar imagem

### O que fazer
- Salvar páginas renderizadas no KV: `page:{slug}`
- TTL de 5 minutos (300 segundos)
- Ao editar produto no admin: `KV.delete('page:{slug}')`
- Ao editar menu: `KV.delete('header.html')`
- Headers HTTP: `Cache-Control: public, max-age=300, stale-while-revalidate=600`

---

## Tarefa 2.4 - Padronizar CSS em Arquivo Único Minificado
**Status:** ⚠️ CSS INLINE EM CADA PÁGINA
**Prioridade:** BAIXA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
- ServicePageTemplateV1 tem 420+ linhas de CSS inline em cada página
- Duplicação massiva de código
- Dificulta manutenção de estilos globais

### Arquivos a criar/alterar
1. `styles-pages.css` - CSS das páginas de produto
2. Todas as 18 páginas de produto - Remover CSS inline, linkar arquivo externo

### O que fazer
- Extrair todo o CSS inline para arquivo externo
- Minificar CSS (remover espaços, comentários)
- Referenciar via `<link rel="stylesheet" href="styles-pages.css?v=1">`
- Manter versionamento `?v=X` para cache-busting
- Reduzir tamanho HTML em ~10-15KB por página

---

# 🟢 BLOCO 3: EVOLUÇÕES DO ADMIN

## Tarefa 3.1 - Criar Página "Editar Home" no Admin
**Status:** ❌ NÃO EXISTE
**Prioridade:** BAIXA
**Risco:** Médio
**Dependências:** Nenhuma

### Problema
- Home (`index.html`) é estática e hardcoded
- Admin não pode editar:
  - Banner principal (título, subtítulo, imagem)
  - Cards de features (os 4 cards)
  - Seções de produtos (quais categorias mostrar)
  - Seção "Sobre" (textos, missão, visão, valores)

### Arquivos a criar/alterar
1. `planac-admin/src/pages/EditHome.jsx` - UI para editar home
2. Banco D1: Criar tabela `home_sections`
3. `planac-backend/src/routes/home.js` - Endpoints CRUD para seções

### O que fazer
- Criar tabela `home_sections` (id, secao, titulo, subtitulo, conteudo_json, ordem, ativo)
- Criar interface para editar:
  - Banner (título H1, subtítulo, botão CTA, imagem de fundo)
  - Cards de features (4 cards: ícone, título)
  - Seções de produtos (escolher qual menu mostrar)
  - Seção Sobre (textos + cards missão/visão/valores)
- Salvar tudo no banco
- Gerar `index.html` dinamicamente via endpoint

---

## Tarefa 3.2 - Implementar Página "Aparência" (Cores e Tema)
**Status:** ❌ NÃO EXISTE
**Prioridade:** BAIXA
**Risco:** Alto
**Dependências:** Nenhuma

### Problema
- Cores do site estão hardcoded no CSS
- Mudanças de branding exigem editar CSS manualmente
- Não há controle visual de cores no admin

### Arquivos a criar/alterar
1. `planac-admin/src/pages/Appearance.jsx` - UI para editar cores
2. Banco D1: Adicionar campos em `settings` para cores
3. `planac-backend/src/routes/settings.js` - Endpoints para cores

### O que fazer
- Permitir editar:
  - Cor primária (atualmente `#AA000E`)
  - Cor secundária (atualmente `#96181c`)
  - Cor de destaque (atualmente `#ec3237`)
  - Cor de fundo
  - Cor de texto
- Gerar CSS dinâmico usando CSS Variables:
  ```css
  :root {
    --color-primary: #AA000E;
    --color-secondary: #96181c;
    --color-accent: #ec3237;
  }
  ```
- Aplicar em todos os componentes

---

## Tarefa 3.3 - Implementar Upload e Gestão de Banners Globais
**Status:** ✅ EXISTE PARCIALMENTE
**Prioridade:** BAIXA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
- Sistema de upload de imagens existe
- Mas não há gestão de "banners globais" que possam ser reutilizados
- Cada produto tem seu banner específico hardcoded

### Arquivos a criar/alterar
1. `planac-admin/src/pages/Banners.jsx` - UI para gestão de banners
2. Banco D1: Criar tabela `banners` (id, titulo, url, tipo, ativo, ordem)

### O que fazer
- Criar interface para:
  - Upload de múltiplos banners
  - Definir título e descrição
  - Ativar/desativar
  - Ordenar por drag & drop
  - Associar banner a página específica OU marcar como global
- Usar banners globais como fallback quando produto não tiver banner próprio

---

## Tarefa 3.4 - Adicionar Campos de SEO Avançados no Admin
**Status:** ⚠️ CAMPOS EXISTEM MAS SÃO BÁSICOS
**Prioridade:** BAIXA
**Risco:** Baixo
**Dependências:** Nenhuma

### Problema
- Admin permite editar `meta_title`, `meta_description`, `meta_keywords`
- Mas não permite editar:
  - Canonical URL
  - Open Graph image (og:image)
  - Robots directive (index/noindex)
  - Schema.org data

### Arquivos a alterar
1. `planac-admin/src/pages/Products.jsx` - Adicionar campos de SEO avançado
2. Banco D1: Adicionar colunas em `pages`:
   - `canonical_url TEXT`
   - `og_image TEXT`
   - `robots TEXT DEFAULT 'index, follow'`

### O que fazer
- Adicionar seção "SEO Avançado" no formulário de edição de produto
- Validar URLs (canonical deve ser URL completa)
- Sugerir valores padrão automaticamente
- Mostrar preview de como ficará no Google/Facebook

---

## Tarefa 3.5 - Criar Dashboard de Estatísticas de SEO
**Status:** ❌ NÃO EXISTE
**Prioridade:** BAIXA
**Risco:** Baixo
**Dependências:** Tarefas 1.2, 1.3

### Problema
- Admin não mostra métricas de SEO
- Não há visibilidade de quais páginas estão bem otimizadas

### Arquivos a criar
1. `planac-admin/src/pages/SeoStats.jsx`
2. `planac-backend/src/routes/seo.js` - Endpoint para estatísticas

### O que fazer
- Mostrar no dashboard:
  - Total de páginas publicadas
  - Páginas sem meta description
  - Páginas sem canonical
  - Páginas com title muito curto/longo
  - Páginas sem alt text nas imagens
  - Score de SEO por página (0-100)
- Permitir clicar e editar diretamente

---

# 📅 ORDEM DE EXECUÇÃO SUGERIDA

## 🔥 Fase 1: Estabilização (Semana 1-2)
**Objetivo:** Corrigir bugs críticos e implementar SEO básico

1. ✅ Tarefa 1.1 - Página de Configurações (Admin)
2. ✅ Tarefa 1.2 - Meta Tags Essenciais
3. ✅ Tarefa 1.3 - sitemap.xml e robots.txt
4. ✅ Tarefa 1.5 - Corrigir Title Tags
5. ✅ Tarefa 1.4 - Lazy loading consistente

**Resultado esperado:** SEO básico 100%, Admin funcional para configurações globais

---

## 🛠️ Fase 2: Otimização (Semana 3-4)
**Objetivo:** Melhorar performance e organização do código

1. ✅ Tarefa 2.4 - Padronizar CSS
2. ✅ Tarefa 2.1 - Template Base no Backend
3. ✅ Tarefa 2.2 - Endpoint de Renderização
4. ✅ Tarefa 2.3 - Sistema de Cache

**Resultado esperado:** Código mais organizado, manutenção simplificada, cache otimizado

---

## 🚀 Fase 3: Evoluções (Semana 5-8)
**Objetivo:** Adicionar funcionalidades avançadas no admin

1. ✅ Tarefa 3.4 - Campos de SEO Avançados
2. ✅ Tarefa 3.1 - Editar Home no Admin
3. ✅ Tarefa 3.3 - Gestão de Banners Globais
4. ✅ Tarefa 3.5 - Dashboard de Estatísticas SEO
5. ✅ Tarefa 3.2 - Página Aparência (Cores)

**Resultado esperado:** Admin 100% completo, autonomia total para o cliente

---

# 📊 RESUMO DE RISCOS

| Tarefa | Risco | Motivo |
|--------|-------|--------|
| 1.1 - Configurações | **BAIXO** | UI simples, endpoints existem |
| 1.2 - Meta Tags | **BAIXO** | Edição de HTML estático |
| 1.3 - Sitemap/Robots | **BAIXO** | Arquivos estáticos simples |
| 1.4 - Lazy Loading | **BAIXO** | Adicionar atributo HTML |
| 1.5 - Title Tags | **BAIXO** | Edição de HTML |
| 2.1 - Template Base | **MÉDIO** | Requer refatoração de estrutura |
| 2.2 - Endpoint Render | **MÉDIO** | Depende de templates bem feitos |
| 2.3 - Cache KV | **BAIXO** | KV já configurado |
| 2.4 - CSS Minificado | **BAIXO** | Extrair CSS inline |
| 3.1 - Editar Home | **MÉDIO** | Muitos campos e seções |
| 3.2 - Aparência | **ALTO** | Mexe em CSS global, pode quebrar layout |
| 3.3 - Banners | **BAIXO** | Sistema de upload já existe |
| 3.4 - SEO Avançado | **BAIXO** | Adicionar campos no formulário |
| 3.5 - Dashboard SEO | **BAIXO** | Apenas exibição de dados |

---

# ✅ IMPORTANTE: REGRAS DE TRABALHO

Antes de executar **QUALQUER** tarefa deste plano:

1. ✋ **EXPLICAR** o problema que será resolvido
2. 📝 **LISTAR** os arquivos que serão alterados
3. 🔍 **DESCREVER** em 3-5 tópicos o que será feito
4. ⏸️ **ESPERAR** a resposta **"APROVADO"** do dono do projeto
5. ✅ **SÓ ENTÃO** escrever código

**Proibições:**
- ❌ NÃO alterar mais de 3-5 arquivos por vez
- ❌ NÃO remover funcionalidades sem explicar impacto
- ❌ NÃO fazer "refatoração em massa"

**Após cada alteração:**
- 📊 Mostrar resumo/diff do que mudou
- 🧪 Explicar como testar no navegador

---

**FIM DO PLANO DE AÇÃO**
**Próximo passo:** Escolher uma tarefa e solicitar APROVAÇÃO antes de começar!
