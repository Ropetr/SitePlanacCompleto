# Configuração Cloudflare Pages - SitePlanacCompleto

## 📋 Configuração Atual

O projeto `siteplanaccompleto` está integrado com GitHub no repositório:
**https://github.com/Ropetr/SitePlanacCompleto.git**

## 🎯 Estratégia: Múltiplos Ambientes no Mesmo Projeto

Vamos configurar o `siteplanaccompleto` para fazer deploy de diferentes partes do projeto usando **branches** ou **environments**.

### Opção 1: Branch-based Deployments (Recomendado)

Usar branches do Git para deployar diferentes partes:

```
main branch           → Site público (raiz)
admin branch          → Painel admin (planac-admin/)
```

### Opção 2: Path-based Builds

Configurar múltiplas configurações de build no mesmo projeto.

## 🔧 Configuração no Cloudflare Dashboard

### Passo 1: Acessar o Projeto
1. Acesse: https://dash.cloudflare.com
2. Vá em **Workers & Pages**
3. Clique em **siteplanaccompleto**

### Passo 2: Configurar Build para o Site Principal (Branch Main)

**Settings → Builds & deployments → Production branch: main**

```yaml
Build command: (deixe vazio - site é HTML estático)
Build output directory: /
Root directory: /
```

### Passo 3: Criar Preview Environment para Admin

**Settings → Builds & deployments → Preview deployments**

Adicione uma configuração específica para a pasta `planac-admin`:

1. Clique em **Add custom branch**
2. Branch: `admin` ou `main` (se quiser tudo no main)
3. Configure:

```yaml
Framework preset: Create React App
Build command: cd planac-admin && npm install && npm run build
Build output directory: planac-admin/dist
Root directory: /
Environment variables:
  - VITE_API_URL = https://planac-backend-api.planacacabamentos.workers.dev
```

### Passo 4: Configurar Múltiplos Domínios (Opcional)

Em **Custom domains**, você pode adicionar:
- `siteplanaccompleto.pages.dev` → Site principal
- `admin--siteplanaccompleto.pages.dev` → Admin (preview)
- `www.planacdistribuidora.com.br` → Seu domínio personalizado
- `admin.planacdistribuidora.com.br` → Admin personalizado

## 🚀 Alternativa: Criar Novo Projeto Pages via Dashboard

Se preferir manter separado, crie um novo projeto:

### No Cloudflare Dashboard:

1. **Workers & Pages** → **Create application** → **Pages**
2. **Connect to Git** → Selecione **GitHub**
3. Selecione: **Ropetr/SitePlanacCompleto**
4. Configure:

```yaml
Project name: planac-admin-git
Production branch: main
Build command: cd planac-admin && npm install && npm run build
Build output directory: planac-admin/dist
Root directory: /

Environment variables:
  VITE_API_URL = https://planac-backend-api.planacacabamentos.workers.dev
```

5. Clique em **Save and Deploy**

## 📝 Estrutura Recomendada (Build Commands)

### Para o Site Público (raiz):
```bash
# Nenhum build necessário - HTML estático
# Output: / (raiz)
```

### Para o Admin (planac-admin/):
```bash
cd planac-admin && npm ci && npm run build
# Output: planac-admin/dist
```

### Para o Backend (planac-backend/):
```bash
# Backend já está deployado como Worker
# wrangler deploy (comando separado)
```

## 🎨 URLs Resultantes

Com a configuração acima, você terá:

### Automático pelo Git:
- **Site:** https://siteplanaccompleto.pages.dev
- **Admin:** https://admin--siteplanaccompleto.pages.dev (preview branch)
  OU
- **Admin:** https://planac-admin-git.pages.dev (novo projeto)

### Backend (Worker - já configurado):
- **API:** https://planac-backend-api.planacacabamentos.workers.dev

## ✅ Vantagens dessa Abordagem

1. ✅ **Um único repositório Git** - Tudo sincronizado
2. ✅ **Deploy automático** - Git push → Deploy automático
3. ✅ **Preview deployments** - Branches diferentes → URLs diferentes
4. ✅ **Rollback fácil** - Via Git ou Dashboard
5. ✅ **CI/CD integrado** - Cloudflare cuida de tudo

## 🔄 Workflow de Deploy

```bash
# 1. Fazer alterações localmente
git add .
git commit -m "feat: atualizar admin panel"

# 2. Push para GitHub
git push origin main

# 3. Cloudflare detecta e faz deploy automático! 🚀
```

## 📱 Próximos Passos

### Opção A: Usar siteplanaccompleto para tudo

1. Acesse https://dash.cloudflare.com
2. Configure build do admin em siteplanaccompleto
3. Commit e push - deploy automático!

### Opção B: Criar planac-admin-git separado

1. Acesse https://dash.cloudflare.com
2. Create Pages → Connect to Git
3. Configure como descrito acima
4. Deploy automático!

## 🆘 Comandos Úteis

```bash
# Ver status do repositório
git remote -v

# Ver branches
git branch -a

# Criar branch para admin (se quiser separar)
git checkout -b admin
git push origin admin

# Fazer deploy forçado (se necessário)
cd planac-admin
npm run build
npx wrangler pages deploy dist --project-name=planac-admin-git
```

## 🔗 Links Importantes

- **Dashboard Cloudflare:** https://dash.cloudflare.com
- **Repositório GitHub:** https://github.com/Ropetr/SitePlanacCompleto
- **Documentação Pages:** https://developers.cloudflare.com/pages/

---

**Qual opção você prefere?**
- [ ] Configurar admin no siteplanaccompleto (mesma URL base)
- [ ] Criar planac-admin-git separado (URL própria)
