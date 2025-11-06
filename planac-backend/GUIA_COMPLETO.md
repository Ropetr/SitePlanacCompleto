# 🎯 GUIA COMPLETO - Planac Backend no Cloudflare

Este guia vai te levar do zero até o backend completo rodando no Cloudflare!

## 📋 Pré-requisitos

- [x] Node.js 18+ instalado
- [x] Conta no Cloudflare (gratuita)
- [x] Git instalado
- [x] Editor de código (VS Code recomendado)

## 🚀 Passo 1: Instalar Wrangler (CLI do Cloudflare)

```bash
npm install -g wrangler
```

Faça login no Cloudflare:

```bash
wrangler login
```

Isso vai abrir o navegador para você autorizar.

## 📦 Passo 2: Instalar Dependências do Projeto

No terminal, dentro da pasta `planac-backend`:

```bash
npm install
```

## 🗄️ Passo 3: Criar Banco de Dados D1

```bash
npx wrangler d1 create planac-database
```

**IMPORTANTE:** Copie o `database_id` que apareceu e cole no `wrangler.toml` no lugar de `SEU_DATABASE_ID_AQUI`.

Exemplo:
```toml
[[d1_databases]]
binding = "DB"
database_name = "planac-database"
database_id = "abc123-def456-ghi789"  # <- Cole aqui
```

## 📊 Passo 4: Criar Schema do Banco

Agora vamos criar todas as tabelas:

```bash
npx wrangler d1 execute planac-database --file=./schema.sql
```

Você vai ver: `✅ Executed successfully!`

## 🗂️ Passo 5: Criar Bucket R2 (Imagens)

```bash
npx wrangler r2 bucket create planac-images
```

O bucket será criado automaticamente!

## 🔑 Passo 6: Criar KV Namespaces (Cache e Sessões)

```bash
# Para cache
npx wrangler kv:namespace create "KV_CACHE"

# Para sessões
npx wrangler kv:namespace create "KV_SESSIONS"
```

**IMPORTANTE:** Copie os IDs gerados e cole no `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "KV_CACHE"
id = "cole_aqui_o_id_do_kv_cache"

[[kv_namespaces]]
binding = "KV_SESSIONS"
id = "cole_aqui_o_id_do_kv_sessions"
```

## 🔐 Passo 7: Configurar Secrets (Senhas)

Agora vamos configurar as variáveis secretas:

### 7.1 - JWT Secret

```bash
npx wrangler secret put JWT_SECRET
```

Digite uma chave forte (recomendo usar este gerador):

```bash
# No terminal Linux/Mac:
openssl rand -hex 32

# No Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Max 256}))

# Ou use qualquer string longa e aleatória
```

Cole a chave gerada quando pedir.

### 7.2 - JWT Refresh Secret

```bash
npx wrangler secret put JWT_REFRESH_SECRET
```

Gere outra chave diferente e cole.

### 7.3 - Senha do Admin

```bash
npx wrangler secret put ADMIN_PASSWORD
```

Digite a senha que você quer usar para login (recomendo: `Planac@2024`).

## ✅ Passo 8: Criar Usuário Admin

Agora vamos criar o primeiro usuário admin no banco:

```bash
npx wrangler d1 execute planac-database --command="INSERT INTO users (id, nome, email, senha, role, ativo) VALUES ('admin-001', 'Administrador', 'admin@planacdivisorias.com.br', '\$2a\$10\$PlaceholderHashAqui', 'SUPER_ADMIN', 1)"
```

**Nota:** A senha será hasheada automaticamente no primeiro login.

## 🏃 Passo 9: Rodar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:8787/health`

Você deve ver:

```json
{
  "status": "OK",
  "message": "Planac API rodando no Cloudflare Workers 🚀"
}
```

## 🧪 Passo 10: Testar o Login

Use o Postman, Insomnia ou cURL:

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@planacdivisorias.com.br",
    "senha": "Planac@2024"
  }'
```

Você deve receber um token JWT! 🎉

## 🚀 Passo 11: Deploy em Produção

Quando tudo estiver funcionando localmente:

```bash
npm run deploy
```

Seu backend estará online em:
```
https://planac-backend-api.seu-usuario.workers.dev
```

## 🌍 Passo 12: Domínio Customizado (Opcional)

Se você tem um domínio no Cloudflare (ex: planacdivisorias.com.br):

1. Edite `wrangler.toml`:

```toml
[[routes]]
pattern = "api.planacdivisorias.com.br/*"
zone_name = "planacdivisorias.com.br"
```

2. Deploy novamente:

```bash
npm run deploy
```

3. Acesse: `https://api.planacdivisorias.com.br/health`

## 📝 Passo 13: Configurações Iniciais

Agora vamos cadastrar as configurações do site. Execute no terminal:

```bash
npx wrangler d1 execute planac-database --command="
INSERT INTO settings (id, chave, valor, tipo, grupo) VALUES
('s1', 'site_name', 'Planac Distribuidora', 'string', 'geral'),
('s2', 'telefone_principal', '(43) 98418-2582', 'string', 'contato'),
('s3', 'email_contato', 'contato@planacdivisorias.com.br', 'string', 'contato');
"
```

## 🎨 Passo 14: Próximos Passos

Agora você precisa:

1. **Criar o Painel Admin** (React) - Vou criar isso para você!
2. **Cadastrar todos os produtos** do site atual
3. **Conectar o frontend** às APIs

## 🐛 Troubleshooting

### Erro: "No such binding"

Verifique se os IDs dos bindings (D1, KV, R2) estão corretos no `wrangler.toml`.

### Erro: "JWT_SECRET not found"

Execute novamente:
```bash
npx wrangler secret put JWT_SECRET
```

### Erro ao conectar ao D1 local

Use o flag `--local`:
```bash
npm run dev -- --local
```

### Ver logs em tempo real

```bash
npx wrangler tail
```

## 📊 Monitoramento

Acesse o dashboard do Cloudflare:
https://dash.cloudflare.com/

Em **Workers & Pages** você verá:
- Total de requisições
- Erros
- Tempo de resposta
- Uso de CPU

## 💰 Custos

Com o plano gratuito:
- ✅ 100.000 requisições/dia
- ✅ 5M leituras D1/mês
- ✅ 10GB storage R2
- ✅ 100.000 operações KV/dia

**Custo total: R$ 0!** 🎉

Só paga se ultrapassar esses limites (o que é improvável no início).

## 🎯 Endpoints Disponíveis

### Públicos
- `POST /api/auth/login` - Login
- `GET /api/products` - Listar produtos
- `GET /api/categories` - Listar categorias
- `POST /api/quotes` - Enviar orçamento
- `POST /api/contacts` - Enviar contato
- `GET /api/settings` - Configurações

### Admin (requer token)
- `GET /api/admin/dashboard` - Dashboard
- `POST /api/admin/products` - Criar produto
- `PUT /api/admin/products/:id` - Editar produto
- `DELETE /api/admin/products/:id` - Excluir produto

## 📞 Suporte

Se tiver alguma dúvida:
- **WhatsApp**: (43) 98418-2582
- **E-mail**: contato@planacdivisorias.com.br

---

## ✅ Checklist Final

- [ ] Wrangler instalado e logado
- [ ] Dependências instaladas (`npm install`)
- [ ] Banco D1 criado e configurado
- [ ] Schema do banco executado
- [ ] Bucket R2 criado
- [ ] KV namespaces criados
- [ ] Secrets configurados (JWT_SECRET, etc)
- [ ] Teste local funcionando
- [ ] Deploy em produção realizado
- [ ] API respondendo no domínio

**Parabéns! Seu backend está no ar! 🚀**
