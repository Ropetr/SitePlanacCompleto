# 🚀 Planac Backend API - Cloudflare

Backend completo da Planac Distribuidora usando **Cloudflare Workers**, **D1**, **R2** e **KV**.

## 🎯 Tecnologias

- **Cloudflare Workers** - Serverless backend
- **Cloudflare D1** - Banco de dados SQL serverless
- **Cloudflare R2** - Storage de imagens (S3-compatible)
- **Cloudflare KV** - Cache e sessões
- **Hono** - Framework web ultra-rápido
- **Jose** - JWT para autenticação
- **Zod** - Validação de dados

## 📦 Estrutura do Projeto

```
planac-backend/
├── src/
│   ├── index.js           # Entry point do Worker
│   ├── routes/            # Rotas da API
│   │   ├── auth.js        # Autenticação
│   │   ├── products.js    # Produtos
│   │   ├── categories.js  # Categorias
│   │   ├── quotes.js      # Orçamentos
│   │   ├── contacts.js    # Contatos
│   │   ├── settings.js    # Configurações
│   │   ├── pages.js       # Páginas
│   │   ├── media.js       # Upload de mídia
│   │   └── dashboard.js   # Dashboard admin
│   └── utils/             # Utilit

ários
│       ├── crypto.js      # Hash e criptografia
│       ├── jwt.js         # JWT helpers
│       ├── validators.js  # Schemas Zod
│       └── slugify.js     # Geração de slugs
├── wrangler.toml          # Configuração Cloudflare
├── schema.sql             # Schema do banco D1
└── package.json           # Dependências

```

## 🛠️ Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar recursos no Cloudflare

```bash
# Criar banco D1
npm run db:create

# Criar KV namespace
npm run kv:create

# Criar bucket R2
npm run r2:create
```

### 3. Configurar secrets

```bash
# JWT Secret
npm run secret:jwt
# Digite uma chave forte (ex: gerada com: openssl rand -hex 32)

# JWT Refresh Secret
npm run secret:refresh

# Senha do admin padrão
npm run secret:admin
```

### 4. Criar banco de dados

```bash
# Execute o schema SQL no D1
npm run db:execute
```

### 5. Rodar localmente

```bash
npm run dev
```

Acesse: `http://localhost:8787`

## 🚀 Deploy

### Deploy em produção

```bash
npm run deploy
```

### Deploy em staging

```bash
npm run deploy:staging
```

## 📡 API Endpoints

### Públicos

- `GET /health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `GET /api/products` - Listar produtos
- `GET /api/products/:slug` - Detalhes do produto
- `GET /api/categories` - Listar categorias
- `GET /api/settings` - Configurações públicas
- `POST /api/quotes` - Enviar orçamento
- `POST /api/contacts` - Enviar contato

### Admin (Requer autenticação)

- `GET /api/admin/dashboard` - Dashboard
- `POST /api/admin/products` - Criar produto
- `PUT /api/admin/products/:id` - Editar produto
- `DELETE /api/admin/products/:id` - Excluir produto
- `GET /api/admin/quotes` - Listar orçamentos
- `POST /api/admin/media/upload` - Upload de imagem

## 🔐 Autenticação

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@planacdivisorias.com.br",
  "senha": "Planac@2024"
}
```

**Resposta:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "nome": "Administrador",
    "email": "admin@planacdivisorias.com.br",
    "role": "SUPER_ADMIN"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Usar o token

Adicione o header em todas as requisições admin:

```
Authorization: Bearer eyJhbGc...
```

## 💾 Banco de Dados (D1)

### Tabelas

- `users` - Usuários do sistema
- `categories` - Categorias de produtos
- `products` - Produtos
- `pages` - Páginas institucionais
- `settings` - Configurações globais
- `quotes` - Orçamentos/leads
- `contacts` - Contatos
- `media` - Biblioteca de mídia
- `audit_logs` - Log de auditoria

### Executar queries manualmente

```bash
wrangler d1 execute planac-database --command="SELECT * FROM users"
```

## 📦 Storage (R2)

Imagens são armazenadas no Cloudflare R2 (compatível com S3).

### Upload de imagem

```bash
POST /api/admin/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [arquivo]
```

## 🎨 Painel Admin (Próxima etapa)

O painel admin será criado separadamente usando:
- **React + Vite**
- **TailwindCSS**
- **Hospedado no Cloudflare Pages**

## 📊 Monitoramento

### Ver logs em tempo real

```bash
npm run tail
```

### Métricas no dashboard

Acesse: https://dash.cloudflare.com/

## 🔧 Configurações

Edite `wrangler.toml` para:
- Alterar nome do worker
- Configurar domínio customizado
- Ajustar limites de CPU
- Adicionar variáveis de ambiente

## 🌍 Domínio Customizado

Para usar um domínio próprio (ex: api.planacdivisorias.com.br):

1. Adicione o domínio no Cloudflare
2. Configure no `wrangler.toml`:

```toml
[[routes]]
pattern = "api.planacdivisorias.com.br/*"
zone_name = "planacdivisorias.com.br"
```

3. Deploy novamente

## 💰 Custos

**Cloudflare Workers (Free Tier):**
- 100.000 requisições/dia GRÁTIS
- 10ms CPU/requisição

**Cloudflare D1:**
- 5 milhões de leituras/mês GRÁTIS
- 100.000 escritas/mês GRÁTIS

**Cloudflare R2:**
- 10 GB de storage GRÁTIS/mês
- Sem custos de saída (egress)

**Cloudflare KV:**
- 100.000 leituras/dia GRÁTIS

**Total estimado: R$ 0 - R$ 20/mês** 🎉

## 📝 Próximos Passos

- [ ] Criar painel admin React
- [ ] Implementar envio de e-mails
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD
- [ ] Implementar rate limiting avançado
- [ ] Adicionar logs estruturados

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Planac Distribuidora

## 📞 Suporte

- **E-mail**: contato@planacdivisorias.com.br
- **WhatsApp**: (43) 98418-2582

---

**Desenvolvido com ❤️ usando Cloudflare**
