# 🚀 GUIA RÁPIDO - Imagens Planac

## ⚡ TL;DR - Passo a Passo Completo

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Baixar imagens
python download-images.py

# 3. Otimizar para WebP
python optimize-images.py

# 4. (Opcional) Upload para R2
npm install -g wrangler
wrangler login
python upload-to-r2.py

# 5. Atualizar links no site
python update-image-links.py

# 6. Testar localmente
python -m http.server 8000
# Abra: http://localhost:8000
```

**Pronto! 🎉**

---

## 📊 O que cada script faz

### 1️⃣ `download-images.py`
- ✅ Baixa 42 imagens do servidor antigo
- ⏱️ Tempo: ~1-2 minutos
- 💾 Destino: `assets/images/original/`

### 2️⃣ `optimize-images.py`
- ✅ Converte para WebP
- ✅ Reduz tamanho em 60-80%
- ⏱️ Tempo: ~30 segundos
- 💾 Destino: `assets/images/optimized/`

### 3️⃣ `upload-to-r2.py` (Opcional)
- ✅ Upload para Cloudflare R2
- 🌐 CDN global grátis
- ⏱️ Tempo: ~2-3 minutos

### 4️⃣ `update-image-links.py`
- ✅ Atualiza todos os HTMLs
- 🔄 Substitui URLs antigas
- ⏱️ Tempo: ~5 segundos

---

## 🎯 Duas Opções de Hospedagem

### Opção A: Cloudflare R2 (Recomendado)

**Vantagens:**
- ✅ CDN global (super rápido)
- ✅ Praticamente grátis (~$0.0001/mês)
- ✅ Melhor SEO (PageSpeed 90-100)
- ✅ HTTPS automático

**Setup:**
1. Criar conta Cloudflare (grátis)
2. Criar bucket R2
3. Executar `upload-to-r2.py`

**Custo:** ~$0 (10GB grátis/mês)

---

### Opção B: Local/GitHub Pages

**Vantagens:**
- ✅ Mais simples
- ✅ Zero custo
- ✅ Sem configuração externa

**Setup:**
1. Imagens ficam em `assets/images/optimized/`
2. Fazer deploy do site completo

**Custo:** $0

---

## 🔥 Comparação de Performance

| Métrica | Antes | Depois (R2) | Melhoria |
|---------|-------|-------------|----------|
| **Tamanho Total** | 15-20 MB | 3-5 MB | -75% |
| **LCP** | 3-5s | 0.5-1s | -80% |
| **PageSpeed** | 40-60 | 90-100 | +80% |
| **Core Web Vitals** | ❌ Falha | ✅ Passa | 100% |

---

## 📝 Checklist Completo

- [ ] Instalar Python 3.8+
- [ ] Instalar dependências: `pip install -r requirements.txt`
- [ ] Executar: `python download-images.py`
- [ ] Executar: `python optimize-images.py`
- [ ] Decidir: R2 ou Local?

**Se R2:**
- [ ] Criar conta Cloudflare
- [ ] Criar bucket R2: "planac-images"
- [ ] Configurar domínio público
- [ ] Instalar: `npm install -g wrangler`
- [ ] Login: `wrangler login`
- [ ] Upload: `python upload-to-r2.py`
- [ ] Atualizar links: `python update-image-links.py` (opção 1)

**Se Local:**
- [ ] Atualizar links: `python update-image-links.py` (opção 2)

**Testar:**
- [ ] Rodar servidor: `python -m http.server 8000`
- [ ] Abrir: `http://localhost:8000`
- [ ] Verificar se imagens carregam
- [ ] Testar em mobile
- [ ] Medir PageSpeed: https://pagespeed.web.dev/

**Deploy:**
- [ ] Fazer deploy (Vercel/Netlify/GitHub Pages)
- [ ] Testar site em produção
- [ ] Comemorar! 🎉

---

## 🆘 Problemas Comuns

### "Module requests not found"
```bash
pip install requests
```

### "Module PIL not found"
```bash
pip install Pillow
```

### "wrangler command not found"
```bash
npm install -g wrangler
```

### Imagens não aparecem
1. Verifique console do navegador (F12)
2. Veja se URLs estão corretas
3. Teste com imagens locais primeiro

---

## 💡 Dicas Pro

### Atualizar uma Imagem
```bash
# 1. Substitua em: assets/images/original/
# 2. Re-otimize:
python optimize-images.py

# 3. Re-upload:
python upload-to-r2.py
```

### Reverter para Imagens Antigas
```bash
# Simplesmente não execute update-image-links.py
# Ou restaure backup do Git
```

### Adicionar Novas Imagens
1. Adicione URL em `download-images.py`
2. Execute workflow completo

---

## 📞 Precisa de Ajuda?

Se algo não funcionar, me chame! 🙋‍♂️

**Boa sorte! 🚀**
