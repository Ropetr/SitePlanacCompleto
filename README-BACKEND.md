# 🚀 Planac Distribuidora - Sistema Backend Completo

## ✅ O que foi implementado

### 1. **Backend API (Cloudflare Workers + Hono)**
- ✅ Autenticação JWT com refresh tokens
- ✅ CRUD completo de Produtos
- ✅ CRUD completo de Categorias (hierárquicas)
- ✅ Sistema de Orçamentos (Quotes)
- ✅ Sistema de Contatos
- ✅ Geração dinâmica de páginas HTML de produtos
- ✅ Logs de auditoria
- ✅ CORS configurado para admin e site

**URL da API:** https://planac-backend-api.planacacabamentos.workers.dev

### 2. **Painel Administrativo (React + Vite + TailwindCSS)**
- ✅ Login e autenticação
- ✅ Dashboard com estatísticas
- ✅ Gestão de Produtos (criar, editar, listar, deletar)
- ✅ Gestão de Categorias (hierárquicas com subcategorias)
- ✅ Gestão de Orçamentos (visualizar, filtrar, atualizar status)
- ✅ Gestão de Contatos (visualizar, filtrar, marcar como lido)
- ✅ Interface moderna e responsiva

**URL do Admin:** https://main.planac-admin.pages.dev

**Credenciais:**
- Email: admin@planacdivisorias.com.br
- Senha: Admin@123

### 3. **Banco de Dados (Cloudflare D1)**
- ✅ Schema completo com todas as tabelas
- ✅ Banco local e remoto populados
- ✅ 6 categorias principais
- ✅ 18 subcategorias
- ✅ 3 produtos de exemplo (Divisória Naval, Divisória de Gesso, Lã de Rocha)

### 4. **Geração Dinâmica de Páginas**
- ✅ Endpoint `/api/pages/product/:slug` que gera HTML dinâmico
- ✅ Template HTML baseado nas páginas existentes
- ✅ SEO otimizado (meta tags, structured data)
- ✅ Cache configurado (1 hora)

**Exemplo:** https://planac-backend-api.planacacabamentos.workers.dev/api/pages/product/divisoria-naval

### 5. **Integração de Formulários**
- ✅ Script `forms-integration.js` criado
- ✅ Integração com API de orçamentos
- ✅ Integração com API de contatos
- ✅ Validações client-side
- ✅ Máscaras de telefone
- ✅ Feedback visual para usuário

## 📁 Estrutura do Projeto

```
SitePlanacCompleto/
├── planac-backend/              # Backend Cloudflare Workers
│   ├── src/
│   │   ├── routes/              # Rotas da API
│   │   │   ├── auth.js          # Autenticação
│   │   │   ├── products.js      # Produtos
│   │   │   ├── categories.js    # Categorias
│   │   │   ├── quotes.js        # Orçamentos
│   │   │   ├── contacts.js      # Contatos
│   │   │   ├── pages.js         # Geração de páginas
│   │   │   └── ...
│   │   ├── utils/               # Utilitários
│   │   └── index.js             # Entry point
│   ├── migrate-data.js          # Script de migração local
│   ├── run-migration.js         # Executor de migração
│   ├── migrate-remote.sql       # SQL para banco remoto
│   └── wrangler.toml            # Config Cloudflare
│
├── planac-admin/                # Painel Admin React
│   ├── src/
│   │   ├── pages/               # Páginas do admin
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Quotes.jsx
│   │   │   └── Contacts.jsx
│   │   ├── components/          # Componentes
│   │   ├── contexts/            # Context API
│   │   └── App.jsx
│   └── package.json
│
├── *.html                       # Páginas HTML do site
├── forms-integration.js         # Integração de formulários
├── _redirects                   # Redirecionamentos Cloudflare Pages
└── README-BACKEND.md            # Este arquivo
```

## 🎯 Como Funciona

### Fluxo de Dados

```
┌─────────────────┐
│  SITE PÚBLICO   │
│   (HTML/CSS)    │
└────────┬────────┘
         │
         │ 1. Usuário acessa divisoria-naval-page.html
         │
         ↓
┌─────────────────┐
│   _redirects    │  ← Redireciona para API
└────────┬────────┘
         │
         │ 2. Redirect 200 (proxy)
         │
         ↓
┌─────────────────┐
│  BACKEND API    │  ← Busca produto no D1
│ (Workers+Hono)  │  ← Gera HTML dinamicamente
└────────┬────────┘
         │
         │ 3. Retorna HTML renderizado
         │
         ↓
┌─────────────────┐
│   NAVEGADOR     │  ← Exibe página
└─────────────────┘
```

### Formulários

```
┌─────────────────┐
│   FORMULÁRIO    │
│   (Orçamento)   │
└────────┬────────┘
         │
         │ 1. Usuário preenche e envia
         │
         ↓
┌─────────────────┐
│ forms-integration.js │ ← Valida dados
└────────┬────────┘
         │
         │ 2. POST /api/quotes
         │
         ↓
┌─────────────────┐
│  BACKEND API    │  ← Salva no D1
└────────┬────────┘
         │
         │ 3. Retorna sucesso
         │
         ↓
┌─────────────────┐
│  PAINEL ADMIN   │  ← Recebe notificação
└─────────────────┘    ← Gerencia orçamento
```

## 🔧 Configuração e Deploy

### Backend
```bash
cd planac-backend
npm install
npm run dev          # Dev local
npm run deploy       # Deploy produção
```

### Admin
```bash
cd planac-admin
npm install
npm run dev          # Dev local
npm run build        # Build produção
npm run deploy       # Deploy Cloudflare Pages
```

### Banco de Dados

**Popular banco local:**
```bash
cd planac-backend
node run-migration.js
```

**Popular banco remoto:**
```bash
cd planac-backend
wrangler d1 execute planac-database --remote --file=migrate-remote.sql
```

## 📝 Uso do Painel Admin

### Gerenciar Produtos

1. Acesse https://main.planac-admin.pages.dev/products
2. Clique em "Novo Produto"
3. Preencha os campos:
   - Nome do produto
   - Slug (URL amigável)
   - Subtítulo
   - Descrição curta e completa
   - Categoria
   - Características (uma por linha)
   - Vantagens (uma por linha)
   - Aplicações (uma por linha)
   - Especificações técnicas (uma por linha)
   - Meta tags (SEO)
4. Salve

**A página será automaticamente gerada em:**
`https://planac-backend-api.planacacabamentos.workers.dev/api/pages/product/[slug]`

### Gerenciar Categorias

1. Acesse https://main.planac-admin.pages.dev/categories
2. Crie categorias principais (sem pai)
3. Crie subcategorias selecionando a categoria pai
4. As categorias são usadas nos produtos

### Gerenciar Orçamentos

1. Acesse https://main.planac-admin.pages.dev/quotes
2. Veja todos os orçamentos recebidos
3. Filtre por status (NOVO, EM_ATENDIMENTO, ATENDIDO, PERDIDO)
4. Clique para ver detalhes e atualizar status
5. Adicione observações internas

### Gerenciar Contatos

1. Acesse https://main.planac-admin.pages.dev/contacts
2. Veja todas as mensagens recebidas
3. Filtre por status ou tipo
4. Marque como lido/respondido

## 🌐 Integrar Formulários no Site

### Para páginas HTML existentes:

1. Adicione o script antes de `</body>`:
```html
<script src="/forms-integration.js"></script>
```

2. O script detecta automaticamente formulários com:
   - `onsubmit="handleQuote(event)"` → Orçamentos
   - `onsubmit="handleContact(event)"` → Contatos

### Para novos formulários:

**Orçamento:**
```html
<form id="quote-form">
  <input type="text" name="nome" required>
  <input type="email" name="email" required>
  <input type="tel" name="telefone" required>
  <input type="text" name="cidade" required>
  <textarea name="mensagem" required></textarea>
  <button type="submit">Enviar</button>
</form>

<script src="/forms-integration.js"></script>
```

**Contato:**
```html
<form id="contact-form">
  <input type="text" name="nome" required>
  <input type="email" name="email" required>
  <input type="tel" name="telefone">
  <input type="text" name="assunto">
  <textarea name="mensagem" required></textarea>
  <button type="submit">Enviar</button>
</form>

<script src="/forms-integration.js"></script>
```

## 🎨 Personalização

### Adicionar novos produtos via Admin

1. Acesse o painel admin
2. Crie o produto preenchendo todos os campos
3. A página será gerada automaticamente
4. Acesse: `https://[seu-dominio]/[slug-do-produto].html`

### Editar produtos existentes

1. Todas as páginas HTML antigas estão mapeadas em `_redirects`
2. Ao editar um produto no admin, a página dinâmica é atualizada automaticamente
3. Não precisa editar HTML manualmente!

## 🔐 Segurança

- ✅ JWT com refresh tokens
- ✅ Rotas admin protegidas
- ✅ CORS configurado
- ✅ Secure headers (Hono middleware)
- ✅ Validação de dados (Zod)
- ✅ SQL injection prevention (prepared statements)
- ✅ Rate limiting (Cloudflare)

## 📊 Monitoramento

**Logs em tempo real:**
```bash
cd planac-backend
wrangler tail --format pretty
```

**Analytics:**
- Cloudflare Analytics: https://dash.cloudflare.com
- Workers Analytics: Requests, erros, latência

## 🚧 Próximos Passos Sugeridos

1. **Upload de Imagens**
   - Implementar upload para R2
   - Galeria de imagens por produto
   - Redimensionamento automático

2. **Notificações**
   - Email ao receber orçamento
   - WhatsApp Business API
   - Push notifications no admin

3. **SEO Avançado**
   - Sitemap XML dinâmico
   - Schema.org structured data
   - Open Graph tags

4. **Analytics**
   - Google Analytics 4
   - Tracking de conversões
   - Funis de vendas

5. **Busca**
   - Sistema de busca de produtos
   - Filtros avançados
   - Autocomplete

6. **Blog/Conteúdo**
   - Sistema de posts
   - Categorização
   - SEO otimizado

## 🆘 Troubleshooting

### Backend não responde
```bash
# Verificar logs
wrangler tail --format pretty

# Verificar status
curl https://planac-backend-api.planacacabamentos.workers.dev/health
```

### Admin não carrega
```bash
# Rebuild
cd planac-admin
npm run build
npm run deploy
```

### Formulários não enviam
1. Abra DevTools (F12)
2. Veja Console para erros
3. Verifique Network tab
4. Confirme que `forms-integration.js` está carregado

### Banco de dados vazio
```bash
# Popular banco remoto novamente
cd planac-backend
wrangler d1 execute planac-database --remote --file=migrate-remote.sql
```

## 📞 Contato

Para dúvidas ou suporte:
- Email: admin@planacdivisorias.com.br
- WhatsApp: (43) 98418-2582

---

**Desenvolvido com ❤️ usando Cloudflare Workers, React e TailwindCSS**
