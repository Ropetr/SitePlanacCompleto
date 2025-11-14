# 🚀 Documentação de Auditoria – Sistema Site Planac + Admin + Backend

Este documento resume TUDO o que já foi auditado no projeto (prompts 1 a 6) e define regras de trabalho para qualquer IA / desenvolvedor que atuar neste repositório via Claude Code.

Use este arquivo como **fonte oficial de contexto** antes de propor alterações.

---

## 1. Visão Geral do Projeto

Estrutura principal (resumida):

- **Raiz do projeto**
  - Páginas HTML estáticas (site público, mais de 20 páginas de produtos)
  - `header.html`, `footer.html`, `whatsapp-float.html`
  - `styles-components.css`, `load-components.js`
  - SVGs (logos, ícones)
- **`planac-admin/`**
  - Painel admin em React (Vite + Tailwind)
  - CRUD de produtos, menus, orçamentos, contatos
- **`planac-backend/`**
  - API em Cloudflare Workers (Hono.js)
  - Banco Cloudflare D1 (SQLite)
  - Upload de imagens para R2
  - Cache em KV

Tecnologias principais:

- Frontend site: HTML + CSS + JS vanilla
- Admin: React 18 + Vite + Tailwind
- Backend: Hono.js + Workers + D1 + R2 + KV
- Hospedagem: Cloudflare Pages + Workers

---

## 2. Resumo Executivo da Auditoria (Prompts 1 a 5)

### 2.1 Percentual geral por etapa

| Etapa                                   | Status geral | Aproximado |
|-----------------------------------------|-------------:|-----------:|
| ETAPA 1 – Header/Footer dinâmicos       | 🟡 Parcial   | ~20%       |
| ETAPA 2 – Templates reutilizáveis       | 🔴 Falta     | 0%         |
| ETAPA 3 – Admin completo (conteúdo)     | 🟡 Parcial   | ~40%       |
| ETAPA 4 – Performance (WebP, minify etc)| 🟡 Parcial   | ~25%       |
| ETAPA 5 – SEO (canonical, sitemap etc.) | 🔴 Falta     | ~20%       |

**Média geral aproximada:** **~21% do plano original implementado**, o resto é promessa ou código pela metade.

---

## 3. Pontos Críticos Encontrados

### 3.1 Header/Footer – PROBLEMA GRAVE

- `header.html` e `footer.html` existem e estão corretos.
- `load-components.js` carrega:
  - Header via API `/api/pages/header` em `<div id="header-container"></div>`
  - Footer via `footer.html` em `<div id="footer-container"></div>`

**Situação:**

- `index.html` → ✅ usa `<div id="header-container"></div>` e `<div id="footer-container"></div>`.
- **Páginas de produto** (`divisoria-naval-page.html`, `drywall-divisoria-page.html`, `forro-de-pvc-modular.html` etc.) → ❌ têm **header e footer colados** direto no HTML:
  - `<header> ... menu completo ... </header>`
  - `<footer> ... rodapé completo ... </footer>`
  - Ainda por cima carregam `load-components.js`, mas sem containers, então não se beneficiam do sistema.

**Impacto:**

- Editar `header.html` / `footer.html` **NÃO** atualiza as 20+ páginas de produto.
- Editar menus no admin **NÃO** reflete nos headers colados.
- Qualquer mudança global exige editar tudo à mão.

---

### 3.2 Admin – O que controla de verdade

Páginas existentes em `planac-admin/src/pages`:

1. `Login.jsx` – ✅ Login com JWT
2. `Dashboard.jsx` – ✅ Estatísticas e gráficos
3. `Products.jsx` – ✅ CRUD completo de produtos/páginas
4. `Menus.jsx` – ✅ CRUD completo de menus/submenus
5. `Quotes.jsx` – ✅ Lista de orçamentos (visualização)
6. `Contacts.jsx` – ✅ Lista de contatos (visualização)
7. `Settings` (rota) – ❌ Apenas placeholder: "Configurações – Em breve"

**Admin JÁ consegue:**

- Criar/editar/excluir produtos/páginas
- Publicar/despublicar
- Upload de banner e galeria
- Associar páginas a menus
- Gerenciar menus e submenus
- Ver orçamentos e contatos
- Ver dashboard com contagens

**Admin NÃO consegue (mas deveria):**

- Editar configurações globais (`settings`):
  - Logo, telefone, WhatsApp, endereço, redes sociais, horário de funcionamento, textos de rodapé etc.
- Editar home (banner principal, cards, seções)
- Editar tema (cores, fontes)
- Gerenciar banners globais
- Editar textos reutilizáveis (mensagem padrão do WhatsApp, copyright, etc.)

Obs.:
Tabela `settings` já existe no D1, endpoints de settings existem, **mas não há UI no admin**.

---

### 3.3 Imagens / WebP – "É WebP mesmo ou só conversa?"

**Pacotes:**

- `planac-backend/package.json` **NÃO** tem `sharp` nem nenhuma lib de imagem.
- Função `convertToWebP()` em `src/routes/media.js` é apenas um **placeholder** e SEMPRE retorna `converted: false`.

**Upload normal (`/api/admin/media/upload`):**

- Aceita `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- Salva no R2 com:
  - `fileName` = nome com a **extensão original**.
  - `httpMetadata.contentType` = `file.type` real.
- Ou seja: upload normal **não converte**, mas está coerente.

**BUG CRÍTICO – Endpoint `/api/admin/media/replace`:**

- Gera nome de arquivo com **`.webp`**:
  - `const fileName = \`${timestamp}-${randomStr}.webp\`;`
- Salva o **arrayBuffer original** (JPG/PNG) sem conversão.
- Seta `contentType: 'image/webp'`.

Resultado:

- Arquivo com extensão `.webp`, headers de `image/webp`, mas conteúdo **JPG/PNG**.
- Isso pode causar imagens corrompidas / comportamento estranho no navegador.

**Outros pontos de imagens:**

- **NÃO existem `<picture>` nem `srcset` em nenhum HTML.
- Lazy loading:
  - Presente em algumas páginas (`loading="lazy"`), mas **não consistente**.
- Preload:
  - Usado com `fetchpriority="high"` em alguns banners e logo (bom ponto).
- Banco:
  - Tabela `media` tem campos para thumbnail e dimensões, mas:
    - **Nunca preenchidos**
    - Nenhuma geração automática de múltiplos tamanhos implementada.

**Conclusão WebP:**

> Hoje **não existe conversão real para WebP**.
> É só promessa, com gambiarra perigosa no `/replace`.

---

### 3.4 SEO – O que vale hoje no site

Páginas analisadas: `index.html`, `divisoria-naval-page.html`, `forro-de-pvc-modular.html`.

**Encontrado:**

- `<title>`:
  - `index.html`: ✅ "Planac Distribuidora - Forros e Divisórias"
  - `divisoria-naval-page.html`: ✅ "Divisória Naval - Planac Distribuidora"
  - `forro-de-pvc-modular.html`: ⚠️ "Forro de Pvc Modular" (sem marca, sem cidade)
- `<meta name="description">`:
  - `index.html`: ❌ ausente.
  - `divisoria-naval-page.html`: ✅ descrição boa, completa.
  - `forro-de-pvc-modular.html`: ⚠️ muito curta.
- `<link rel="canonical">`:
  - ❌ ZERO ocorrências em TODO o projeto.
- `sitemap.xml`:
  - ❌ Não existe na raiz nem em `dist/`.
- `robots.txt`:
  - ❌ Não existe na raiz nem em `dist/`.
- Open Graph / Twitter Card:
  - ❌ Não encontrados em nenhuma das páginas analisadas.
- Schema.org (JSON-LD):
  - ❌ Não encontrado.

**Resumo SEO:**

- Tem:
  - Title em todas as páginas (qualidade variável).
  - Meta description em parte das páginas.
  - Preload de imagens importantes.

- Falta:
  - Canonical para todas as páginas.
  - `sitemap.xml`.
  - `robots.txt`.
  - Open Graph / Twitter Cards.
  - Schema.org (`LocalBusiness`, `Product`, `BreadcrumbList`).
  - Consistência nos titles/descriptions.

Aproximadamente: **30% SEO básico implementado / 70% faltando**.

---

## 4. Regras Obrigatórias de Trabalho para IA / Dev (PROMPT 6)

A partir deste documento, QUALQUER alteração feita com ajuda de IA (Claude, ChatGPT etc.) deve seguir estas regras:

### 4.1 Antes de alterar qualquer arquivo, é OBRIGATÓRIO:

1. **Explicar claramente o problema** que está sendo resolvido.
2. **Listar os arquivos** que pretende alterar (com caminhos).
3. **Descrever em 3–5 tópicos** o que será feito em cada arquivo.

👉 **NENHUM código deve ser escrito antes do dono do projeto responder "APROVADO".**

### 4.2 Escopo das mudanças

- As mudanças devem ser **pequenas e focadas**:
  - Idealmente **não mais que 3–5 arquivos** por rodada.
- Proibido refatorar "o mundo" de uma vez.

### 4.3 Depois de alterar código, é OBRIGATÓRIO:

1. Mostrar um **resumo/diff textual** do que mudou.
2. Explicar **como testar** no navegador / ambiente:
   - URL de teste (ex.: `https://site-planac.pages.dev/divisoria-naval-page.html`)
   - Passo a passo rápido: "abra tal página → clique em tal menu → veja tal comportamento".

### 4.4 Proibições

É **PROIBIDO**:

- Remover funcionalidades existentes sem:
  - Explicar o impacto.
  - Sugerir alternativa.
  - Deixar registrado no histórico desta documentação (ou em CHANGELOG).

---

## 5. Prioridades Sugeridas de Correção (Roadmap Técnico)

### PRIORIDADE 1 – Correção de BUGS CRÍTICOS

1. **Corrigir `/api/admin/media/replace`**
   - Parar de renomear tudo para `.webp` sem conversão real.
   - Usar a extensão real do arquivo e `contentType` correto.

2. **Padronizar Header/Footer nas páginas de produto**
   - Remover `header` e `footer` colados dos HTMLs de produto.
   - Substituir por:
     ```html
     <div id="header-container"></div>
     <!-- conteúdo da página -->
     <div id="footer-container"></div>
     <script src="load-components.js?v=2"></script>
     ```
   - Assim, `header.html` e `footer.html` passam a valer para TODO o site.

---

### PRIORIDADE 2 – Configurações Globais e Admin

- Criar UI real para `Settings` (configurações globais):
  - Logo
  - Telefones / WhatsApp
  - Endereço
  - Redes sociais
  - Horário de funcionamento
  - Texto de rodapé
- Conectar esses dados com `header.html` / `footer.html` (ou template dinâmico).

---

### PRIORIDADE 3 – SEO Essencial

- Adicionar **`<meta name="description">`** na home (`index.html`).
- Adicionar **`<link rel="canonical">`** em TODAS as páginas.
- Criar **`sitemap.xml`** (estático ou gerado em build).
- Criar **`robots.txt`** apontando para o sitemap.

---

### PRIORIDADE 4 – Imagens/Performance (Versão Simples)

- Remover qualquer menção enganosa a conversão WebP enquanto ela não existir de verdade.
- Garantir:
  - `loading="lazy"` nas imagens não críticas.
  - `fetchpriority="high"` apenas em imagens realmente acima da dobra.
- Planejar depois:
  - Uso de Cloudflare Image Resizing via URL (sem sharp).

---

## 6. Como Usar Esta Documentação no Claude Code

Sempre que for abrir este projeto no Claude Code:

1. **Leia este arquivo primeiro.**
2. Entenda em qual prioridade você está trabalhando (bug crítico, SEO, admin, etc.).
3. Antes de escrever código:
   - Releia a seção **"Regras Obrigatórias de Trabalho"**.
   - Explique o que vai fazer, onde e por quê.
   - ESPERE o "APROVADO" do dono do projeto.
4. Depois de cada alteração:
   - Documente brevemente aqui (ou em CHANGELOG) o que mudou.

---

✅ Este arquivo representa a **foto oficial** da situação até a auditoria dos prompts 1 a 6.
Atualizações futuras devem manter este documento coerente com a realidade do código.
