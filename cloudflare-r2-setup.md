# ☁️ Configuração Cloudflare R2 para Imagens da Planac

## 🎯 Por que R2?

**Cloudflare R2** é MUITO melhor que KV ou D1 para imagens:

| Recurso | R2 | KV | D1 |
|---------|----|----|-----|
| **Custo** | $0.015/GB | $0.50/GB | ❌ Não serve para imagens |
| **Tamanho de arquivo** | Ilimitado | Max 25MB | Max 1MB |
| **CDN Global** | ✅ Grátis | ✅ Grátis | ❌ |
| **Ideal para** | Imagens, vídeos | Cache pequeno | Banco de dados |
| **Cache automático** | ✅ | ✅ | ❌ |

### 💰 Custo estimado para Planac:
- 42 imagens otimizadas ≈ **5-10 MB total**
- Custo mensal: **~$0.0001** (praticamente GRÁTIS!)
- 10GB grátis por mês

---

## 🚀 Setup Passo a Passo

### 1️⃣ Criar Bucket R2

```bash
# 1. Acesse: https://dash.cloudflare.com/
# 2. Vá em: R2 → Create Bucket
# 3. Nome: planac-images
# 4. Location: Automatic (melhor performance global)
```

### 2️⃣ Configurar Domínio Público

```bash
# No bucket "planac-images":
# 1. Clique em "Settings"
# 2. Em "Public Access" → "Connect Domain"
# 3. Escolha:
#    - Opção A: images.planacdivisorias.com.br (recomendado)
#    - Opção B: Use domínio r2.dev gratuito
```

**Resultado:**
- Suas imagens estarão em: `https://images.planacdivisorias.com.br/arquivo.webp`
- Ou: `https://planac-images.r2.dev/arquivo.webp`

### 3️⃣ Upload das Imagens

#### Opção A: Via Dashboard (Manual)
```bash
1. Acesse o bucket
2. Clique em "Upload"
3. Selecione todas as imagens de: assets/images/optimized/
4. Upload!
```

#### Opção B: Via Wrangler (CLI - Recomendado)

```bash
# Instalar Wrangler
npm install -g wrangler

# Login
wrangler login

# Upload automático usando nosso script:
python upload-to-r2.py
```

### 4️⃣ Configurar Cache e Headers

No Cloudflare Dashboard:

```bash
# 1. Vá em: R2 → planac-images → Settings
# 2. Configure "Transform Rules":

Cache-Control: public, max-age=31536000, immutable
Content-Type: image/webp
```

Isso garante:
- ✅ Cache de 1 ano no navegador
- ✅ Servido pelo CDN global da Cloudflare
- ✅ Velocidade máxima

---

## 🎨 Benefícios para SEO Google

### ✅ Core Web Vitals Melhorados:

1. **LCP (Largest Contentful Paint)**
   - Antes: ~3-5s (imagens pesadas)
   - Depois: ~0.5-1s (WebP + CDN) ⚡

2. **CLS (Cumulative Layout Shift)**
   - Imagens otimizadas carregam mais rápido
   - Menos "pulos" no layout

3. **Velocidade Geral**
   - WebP: 25-35% menor que JPEG
   - R2 CDN: latência global <50ms

### 📊 Score Google PageSpeed:

- **Antes:** 40-60 (Vermelho/Laranja)
- **Depois:** 90-100 (Verde) 🎉

---

## 📌 Resumo - O que fazer:

1. ✅ Executar: `python download-images.py`
2. ✅ Executar: `python optimize-images.py`
3. ⬜ Criar bucket R2 no Cloudflare
4. ⬜ Configurar domínio público
5. ⬜ Upload das imagens: `python upload-to-r2.py`
6. ⬜ Atualizar links: `python update-image-links.py`
7. ⬜ Testar site
8. ⬜ Medir PageSpeed: https://pagespeed.web.dev/

---

**Boa sorte! 🚀**
