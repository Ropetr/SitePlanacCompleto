# 📸 Gerenciamento de Imagens - Planac

## 📁 Estrutura

```
assets/images/
├── original/          # Imagens originais baixadas (backup)
├── optimized/         # Imagens otimizadas em WebP (para uso)
└── README.md          # Este arquivo
```

## 🚀 Fluxo de Trabalho

### 1️⃣ Download das Imagens

```bash
python download-images.py
```

**O que faz:**
- Baixa todas as 42 imagens do servidor antigo
- Salva em `assets/images/original/`
- Download paralelo (5 threads)
- Mostra progresso em tempo real

**Resultado:**
- ✅ 42 imagens JPG/PNG originais

---

### 2️⃣ Otimização

```bash
python optimize-images.py
```

**O que faz:**
- Converte todas para WebP
- Redimensiona conforme categoria:
  - **Banner**: max 1920px, quality 85%
  - **Card**: max 800px, quality 80%
  - **Icon**: max 200px, quality 90%
- Gera relatório de otimização

**Resultado:**
- ✅ 42 imagens .webp otimizadas
- ✅ Relatório: `optimization-report.json`
- 💾 Redução típica: 60-80% do tamanho

---

### 3️⃣ Upload para R2 (Opcional)

```bash
# Instalar Wrangler primeiro
npm install -g wrangler
wrangler login

# Upload
python upload-to-r2.py
```

**O que faz:**
- Faz upload de todas as imagens para Cloudflare R2
- Configura headers corretos (content-type, cache)
- Mostra progresso

**Resultado:**
- ✅ Imagens disponíveis via CDN global
- 🌐 URL: `https://planac-images.r2.dev/`

---

### 4️⃣ Atualizar Links no Site

```bash
python update-image-links.py
```

**O que faz:**
- Substitui URLs antigas em todos os HTMLs
- Opções:
  - Cloudflare R2 (recomendado)
  - Local (assets/images/optimized/)

**Resultado:**
- ✅ Todos os links atualizados
- ✅ Site usando imagens otimizadas

---

## 📊 Categorias de Imagens

### 🖼️ Banner Principal
- **Arquivo:** `133473966882981354.jpeg`
- **Tamanho otimizado:** 1920px width
- **Formato:** WebP, quality 85%

### 🎴 Cards de Produtos (37 imagens)
- **Arquivos:** `133471*.jpg`
- **Tamanho otimizado:** 800px width
- **Formato:** WebP, quality 80%

### 🎨 Ícones (5 imagens)
- **Arquivos:** `133465*.png`
- **Tamanho otimizado:** 200px width
- **Formato:** WebP, quality 90%

---

## 🎯 Benefícios da Otimização

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Formato** | JPG/PNG | WebP | 60-80% menor |
| **Tamanho Total** | ~15-20 MB | ~3-5 MB | -75% |
| **LCP** | 3-5s | 0.5-1s | -80% |
| **PageSpeed Score** | 40-60 | 90-100 | +80% |

---

## 🔧 Manutenção

### Adicionar Nova Imagem

```bash
# 1. Baixe a imagem para: assets/images/original/
# 2. Otimize:
python optimize-single-image.py caminho/da/imagem.jpg

# 3. Upload para R2:
wrangler r2 object put planac-images/nova-imagem.webp \
  --file=assets/images/optimized/nova-imagem.webp \
  --content-type=image/webp
```

### Re-otimizar Todas

```bash
# Se mudou as configurações de qualidade/tamanho
rm -rf assets/images/optimized/*
python optimize-images.py
```

---

## 📝 Arquivos Gerados

- `optimization-report.json` - Relatório detalhado de cada imagem
- `download-images.log` - Log de downloads
- `upload-r2.log` - Log de uploads para R2

---

## 🆘 Troubleshooting

### Erro: "Module PIL not found"
```bash
pip install -r requirements.txt
```

### Erro: "wrangler: command not found"
```bash
npm install -g wrangler
wrangler login
```

### Imagens não aparecem no site
1. Verifique se executou `update-image-links.py`
2. Verifique se o domínio R2 está correto
3. Teste com imagens locais primeiro

---

**Última atualização:** 2024-10-28
