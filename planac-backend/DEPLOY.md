# 🚀 GUIA DE DEPLOY - Planac Backend

## Método 1: Setup Automático (Recomendado)

### Linux/Mac:

```bash
chmod +x setup.sh
./setup.sh
```

### Windows PowerShell:

```powershell
# Instalar Wrangler
npm install -g wrangler

# Login
wrangler login

# Instalar dependências
npm install

# Criar banco D1
wrangler d1 create planac-database
# Copie o database_id e cole no wrangler.toml

# Criar KV
wrangler kv:namespace create "KV_CACHE"
wrangler kv:namespace create "KV_SESSIONS"
# Copie os IDs e cole no wrangler.toml

# Criar R2
wrangler r2 bucket create planac-images

# Configurar secrets
wrangler secret put JWT_SECRET
wrangler secret put JWT_REFRESH_SECRET

# Criar banco
wrangler d1 execute planac-database --file=schema.sql

# Deploy!
npm run deploy
```

---

## Método 2: Via Dashboard do Cloudflare

### 1. Criar Worker

1. Acesse: https://dash.cloudflare.com/
2. Vá em **Workers & Pages**
3. Clique em **Create Application** > **Create Worker**
4. Dê o nome: `planac-backend-api`
5. Clique em **Deploy**

### 2. Criar Banco D1

1. No menu lateral, clique em **D1**
2. Clique em **Create Database**
3. Nome: `planac-database`
4. Clique em **Create**
5. Vá em **Console** e execute o SQL do arquivo `schema.sql`

### 3. Criar KV Namespaces

1. No menu lateral, clique em **KV**
2. Clique em **Create a namespace**
3. Nome: `KV_CACHE` (criar)
4. Nome: `KV_SESSIONS` (criar)

### 4. Criar Bucket R2

1. No menu lateral, clique em **R2**
2. Clique em **Create bucket**
3. Nome: `planac-images`
4. Clique em **Create bucket**

### 5. Vincular ao Worker

1. Volte em **Workers & Pages**
2. Clique no worker `planac-backend-api`
3. Vá em **Settings** > **Bindings**
4. Adicione:
   - **D1**: binding `DB` → database `planac-database`
   - **KV**: binding `KV_CACHE` → namespace `KV_CACHE`
   - **KV**: binding `KV_SESSIONS` → namespace `KV_SESSIONS`
   - **R2**: binding `R2_IMAGES` → bucket `planac-images`

### 6. Configurar Secrets

1. Ainda em **Settings** > **Variables and Secrets**
2. Adicione as secrets:
   - `JWT_SECRET`: (gere uma chave forte de 64 caracteres)
   - `JWT_REFRESH_SECRET`: (outra chave forte)

### 7. Deploy do Código

```bash
npm run deploy
```

---

## Verificar Deploy

Acesse: `https://planac-backend-api.SEU-USUARIO.workers.dev/health`

Deve retornar:
```json
{
  "status": "OK",
  "message": "Planac API rodando no Cloudflare Workers 🚀"
}
```

---

## Configurar Domínio Customizado

### Via Dashboard:

1. Vá no worker > **Settings** > **Domains & Routes**
2. Clique em **Add Custom Domain**
3. Digite: `api.planacdivisorias.com.br`
4. Clique em **Add Domain**

O Cloudflare configura automaticamente o DNS!

### Via wrangler.toml:

Já está configurado no arquivo! Basta fazer deploy:

```bash
npm run deploy
```

---

## Ambientes

### Development (local):

```bash
npm run dev
# Acesse: http://localhost:8787
```

### Staging:

```bash
npm run deploy:staging
# URL: https://planac-backend-api-staging.SEU-USUARIO.workers.dev
```

### Production:

```bash
npm run deploy
# URL: https://api.planacdivisorias.com.br
```

---

## Monitoramento

### Ver logs em tempo real:

```bash
wrangler tail
```

### Dashboard:

Acesse: https://dash.cloudflare.com/
- **Workers & Pages** > `planac-backend-api`
- Veja métricas de:
  - Requisições/segundo
  - Erros
  - Tempo de resposta
  - Uso de CPU

---

## Troubleshooting

### Erro: "No such binding: DB"

✅ Verifique se o D1 está vinculado corretamente no wrangler.toml

### Erro: "JWT_SECRET not found"

✅ Configure a secret:
```bash
wrangler secret put JWT_SECRET
```

### Erro 500 ao criar produto

✅ Verifique se as tabelas foram criadas:
```bash
wrangler d1 execute planac-database --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### R2 não funcionando

✅ Verifique se o bucket existe:
```bash
wrangler r2 bucket list
```

---

## Backup do Banco

### Exportar dados:

```bash
wrangler d1 export planac-database --output=backup.sql
```

### Importar dados:

```bash
wrangler d1 execute planac-database --file=backup.sql
```

---

## CI/CD com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Deploy
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## Custos

**Cloudflare Free Tier:**

- ✅ 100.000 req/dia (Workers)
- ✅ 5M leituras/mês (D1)
- ✅ 10GB storage (R2)
- ✅ 100.000 ops/dia (KV)

**Custo total: R$ 0!** 🎉

Após o free tier:
- Workers: $5/10M req
- D1: $5/5M write
- R2: $0.015/GB
- KV: $0.50/1M read

**Estimativa com tráfego médio: R$ 10-20/mês**

---

## Suporte

- **Documentação Cloudflare**: https://developers.cloudflare.com/workers/
- **Discord Cloudflare**: https://discord.gg/cloudflaredev
- **E-mail**: contato@planacdivisorias.com.br

---

✅ **Seu backend está pronto para produção!** 🚀
