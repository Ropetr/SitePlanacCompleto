# 🔄 Setup do Sistema de Auto-Rebuild

Este sistema permite que **toda vez que você editar uma página no Admin**, o site seja automaticamente atualizado com commit e deploy.

## 🎯 Como Funciona

1. **Você edita página no Admin** → Clica em Salvar
2. **Worker salva no banco** → Atualiza cache KV
3. **Worker dispara GitHub Action** → Via webhook
4. **GitHub Action roda script** → Gera HTML atualizado
5. **GitHub Action faz commit + push** → Automático
6. **Cloudflare Pages detecta push** → Deploy automático
7. **✅ Site atualizado** → Em 1-2 minutos

---

## ⚙️ Configuração (Fazer UMA VEZ)

### 1️⃣ Criar Personal Access Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configurações:
   - **Note**: `Planac Auto Rebuild`
   - **Expiration**: `No expiration` (ou escolha um prazo longo)
   - **Scopes** (permissões):
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
4. Clique em **"Generate token"**
5. **COPIE O TOKEN** (aparece uma vez só!)

Exemplo de token: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2️⃣ Adicionar Token ao Cloudflare Worker

Execute este comando no terminal (dentro da pasta `planac-backend`):

```bash
cd planac-backend
npx wrangler secret put GITHUB_TOKEN
```

Quando pedir, **cole o token** que você copiou acima e pressione Enter.

✅ **Pronto!** O Worker agora pode disparar GitHub Actions.

### 3️⃣ Testar o Sistema

1. Vá no **Admin Panel**: https://planac-admin.pages.dev
2. Edite qualquer página (ex: Rodapés)
3. Adicione ou modifique uma imagem
4. Clique em **Salvar**
5. Vá no GitHub: https://github.com/Ropetr/SitePlanacCompleto/actions
6. Você verá uma **nova Action rodando** 🚀
7. Aguarde 1-2 minutos
8. **Acesse o site** → Imagem atualizada! ✅

---

## 📋 Checklist de Configuração

- [ ] Personal Access Token criado no GitHub
- [ ] Token adicionado ao Worker via `wrangler secret put GITHUB_TOKEN`
- [ ] Testado editando uma página no Admin
- [ ] GitHub Action executada com sucesso
- [ ] Deploy automático do Cloudflare funcionando

---

## 🔍 Monitoramento

### Ver Actions rodando:
https://github.com/Ropetr/SitePlanacCompleto/actions

### Ver logs do Worker:
```bash
cd planac-backend
npx wrangler tail --format pretty
```

### Ver deploys do Cloudflare Pages:
https://dash.cloudflare.com/ → Workers & Pages → siteplanaccompleto

---

## ❓ Troubleshooting

### Problema: GitHub Action não está sendo disparada

**Solução**: Verifique se o GITHUB_TOKEN foi configurado:
```bash
cd planac-backend
npx wrangler secret list
```

Deve aparecer `GITHUB_TOKEN` na lista.

### Problema: GitHub Action falha

1. Acesse: https://github.com/Ropetr/SitePlanacCompleto/actions
2. Clique na Action que falhou
3. Veja os logs para identificar o erro
4. Geralmente é:
   - Token sem permissões suficientes (adicione `repo` e `workflow`)
   - Página não encontrada na API (verifique se salvou corretamente)

### Problema: Deploy não acontece

1. Verifique se o commit foi feito:
   ```bash
   git log -1
   ```
2. Verifique se o push foi feito:
   ```bash
   git status
   ```
3. Verifique Cloudflare Pages:
   https://dash.cloudflare.com/ → Workers & Pages → siteplanaccompleto → Deployments

---

## 🎉 Benefícios

✅ **Zero intervenção manual** - Tudo automático
✅ **Rastreável** - Cada mudança tem um commit
✅ **Reversível** - Git permite voltar versões anteriores
✅ **Auditável** - Histórico completo de mudanças
✅ **Rápido** - Deploy em 1-2 minutos

---

## 🚀 Próximos Passos

Após configurar, você pode:

1. **Testar com a página Rodapés** (que está com imagem desatualizada)
2. **Editar outras páginas** e ver a mágica acontecer
3. **Adicionar novos produtos** e eles aparecerem automaticamente no site

---

**Última atualização**: 21/11/2024
**Versão**: 1.0.0
