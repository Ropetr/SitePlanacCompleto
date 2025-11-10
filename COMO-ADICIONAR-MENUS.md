# 📋 Como Adicionar Novos Menus

## ✅ Menus Atuais no Header

Estes são os menus que aparecem no header do site:

1. **Home** (ordem -1) → Link para página inicial
2. **Divisórias** (ordem 1) → Dropdown com produtos
3. **Drywall** (ordem 2) → Dropdown com produtos
4. **Forros** (ordem 3) → Dropdown com produtos
5. **Termoacústica** (ordem 4) → Dropdown com produtos
6. **Kit Portas** (ordem 5) → Dropdown com produtos
7. **Rodapés** (ordem 6) → Link direto para seção
8. **Sobre** (ordem 7) → Link direto para seção
9. **Contato** (ordem 8) → Link direto para seção

---

## 🚀 Como Adicionar um Novo Menu

### Opção 1: Via Admin Panel (Recomendado)

1. Acesse o **Admin Panel**: https://planac-admin.pages.dev
2. Faça login
3. Clique em **"Menus"** no menu lateral
4. Clique em **"Novo Menu"**
5. Preencha:
   - **Nome:** Nome que aparecerá no header (ex: "Serviços")
   - **Slug:** URL amigável (ex: "servicos")
   - **Descrição:** Breve descrição
   - **Ordem:** Número para ordenar (ex: 10)
   - **Ativo:** Sim
6. Clique em **"Salvar"**

✅ **Pronto!** O menu será adicionado automaticamente ao header.

---

### Opção 2: Via SQL (Avançado)

Se preferir adicionar via banco de dados:

```sql
-- Adicionar novo menu "Serviços"
INSERT INTO menus (
  id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, metadata, created_at, updated_at
) VALUES (
  'menu-servicos',           -- ID único
  'Serviços',                -- Nome no header
  'servicos',                -- Slug da URL
  'Nossos Serviços',         -- Descrição
  NULL,                      -- Ícone (opcional)
  NULL,                      -- Menu pai (NULL = menu principal)
  9,                         -- Ordem (depois de "Contato")
  1,                         -- Ativo (1 = sim)
  '{}',                      -- Metadata (JSON)
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

**Executar:**
```bash
cd planac-backend
npx wrangler d1 execute planac-database --remote --command "INSERT INTO menus..."
```

---

## 🎯 Integração Automática com o Header

### Como Funciona

O sistema **render-dynamic-menu.js** busca os menus da API e atualiza o header automaticamente:

```javascript
// 1. Busca menus ativos da API
const menus = await fetch('/api/menus?status=ativo');

// 2. Busca produtos publicados
const produtos = await fetch('/api/products?status=publicado');

// 3. Agrupa produtos por menu
const groupedProducts = groupProductsByMenu(produtos);

// 4. Renderiza header desktop e mobile
updateHeaderWithDynamicMenus();
```

### Regras de Renderização

1. **Menu SEM produtos:**
   - Renderiza como **link direto**
   - Exemplo: Rodapés, Sobre, Contato
   - HTML: `<a href="#slug">Nome</a>`

2. **Menu COM produtos:**
   - Renderiza como **dropdown**
   - Exemplo: Divisórias, Forros, Termoacústica
   - HTML:
     ```html
     <li class="dropdown">
       <a href="#slug" class="dropdown-toggle">Nome</a>
       <ul class="dropdown-menu">
         <li><a href="produto1.html">Produto 1</a></li>
         <li><a href="produto2.html">Produto 2</a></li>
       </ul>
     </li>
     ```

---

## 📝 Tipos de Menus

### 1. Menu Principal com Dropdown (COM produtos)

**Características:**
- Tem produtos associados
- Aparece como dropdown no header
- Exemplo: **Divisórias**, **Forros**, **Termoacústica**

**Como criar:**
```sql
INSERT INTO menus (id, nome, slug, ordem, ativo)
VALUES ('menu-novidades', 'Novidades', 'novidades', 10, 1);

-- Depois, criar produtos associados a este menu:
INSERT INTO products (id, nome, slug, menu_id, status)
VALUES ('prod-001', 'Produto Novo', 'produto-novo', 'menu-novidades', 'PUBLICADO');
```

### 2. Menu Simples (SEM produtos)

**Características:**
- Não tem produtos associados
- Aparece como link direto no header
- Exemplo: **Rodapés**, **Sobre**, **Contato**

**Como criar:**
```sql
INSERT INTO menus (id, nome, slug, ordem, ativo)
VALUES ('menu-orcamento', 'Orçamento', 'orcamento', 11, 1);
```

---

## 🔄 Atualizar Header Após Adicionar Menu

### Build + Deploy (Necessário!)

Após adicionar um menu, você precisa:

1. **Executar Build** (para injetar header atualizado):
   ```bash
   node build-static-pages.js
   ```

2. **Deploy**:
   ```bash
   npx wrangler pages deploy dist --project-name siteplanaccompleto
   ```

**OU** simplesmente fazer commit e push (se tiver CI/CD configurado):
```bash
git add .
git commit -m "Adiciona menu Novidades"
git push
```

---

## 📊 Ordem dos Menus

A ordem dos menus no header é definida pelo campo **`ordem`**:

| Menu | Ordem | Posição |
|------|-------|---------|
| Home | -1 | Primeiro |
| Divisórias | 1 | Segundo |
| Drywall | 2 | Terceiro |
| Forros | 3 | Quarto |
| Termoacústica | 4 | Quinto |
| Kit Portas | 5 | Sexto |
| Rodapés | 6 | Sétimo |
| Sobre | 7 | Oitavo |
| Contato | 8 | Nono |
| *Novo Menu* | 9+ | Próximos |

**Dica:** Use ordem em múltiplos de 10 (10, 20, 30...) para facilitar inserções futuras.

---

## 🎨 Personalizar Menus no Header

### Editar header.html

Se quiser personalizar o layout dos menus manualmente, edite:

```
header.html (linhas 8-62)
```

**Exemplo - Adicionar menu "Serviços":**

```html
<nav class="nav-links">
    <!-- Menus existentes... -->

    <!-- NOVO MENU -->
    <li class="dropdown">
        <a href="planac-website.html#servicos" class="dropdown-toggle">Serviços</a>
        <ul class="dropdown-menu">
            <li><a href="instalacao.html">Instalação</a></li>
            <li><a href="consultoria.html">Consultoria</a></li>
        </ul>
    </li>

    <!-- Continua... -->
</nav>
```

⚠️ **IMPORTANTE:** Após editar `header.html`, execute o build novamente:
```bash
node build-static-pages.js
```

---

## 🔍 Verificar se Menu Apareceu

### 1. Via Admin Panel
1. Acesse: https://planac-admin.pages.dev
2. Clique em **"Menus"**
3. Veja se o novo menu aparece na lista

### 2. Via API
```bash
curl https://planac-backend-api.planacacabamentos.workers.dev/api/menus?status=ativo
```

### 3. No Site
1. Acesse: https://siteplanaccompleto.pages.dev
2. Olhe o header
3. O novo menu deve aparecer na ordem correta

---

## ❌ Remover um Menu

### Via Admin Panel
1. Acesse **"Menus"**
2. Clique no menu que deseja remover
3. Clique em **"Deletar"**

### Via SQL
```sql
DELETE FROM menus WHERE id = 'menu-servicos';
```

⚠️ **Atenção:** Se o menu tiver produtos associados, você precisa:
1. Mover os produtos para outro menu, OU
2. Deletar os produtos primeiro

---

## 💡 Dicas

1. **Sempre use ordem crescente:** -1, 1, 2, 3... (Home sempre -1)
2. **Menus inativos não aparecem:** `ativo = 0`
3. **Slugs únicos:** Não repita slugs entre menus
4. **Build é obrigatório:** Após qualquer alteração no header.html

---

## ✅ Resumo - Checklist

Ao adicionar um novo menu:

- [ ] Criar menu via Admin ou SQL
- [ ] Definir ordem correta
- [ ] Marcar como ativo
- [ ] (Opcional) Criar produtos associados
- [ ] Executar build: `node build-static-pages.js`
- [ ] Deploy: `npx wrangler pages deploy dist`
- [ ] Verificar no site se apareceu

---

**Criado em:** 10 de Novembro de 2025
**Autor:** Claude Code Assistant
