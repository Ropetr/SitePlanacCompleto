# 📂 ESTRUTURA DE ARQUIVOS - O QUE ESTÁ EM USO

**Data:** 2025-11-12
**Status:** ✅ DOCUMENTAÇÃO OFICIAL

---

## ⚠️ IMPORTANTE: SISTEMA BASEADO EM KV CACHE

**O site NÃO usa mais arquivos HTML estáticos!**

Todas as páginas de produtos são:
1. Geradas dinamicamente pelo backend
2. Salvas no Cloudflare KV Cache
3. Servidas via API `/api/paginas/{slug}`

**NÃO EDITE arquivos .html de produtos diretamente!**
Use o Admin Panel: https://planac-admin.pages.dev

---

## ✅ ARQUIVOS EM USO ATIVO

### 📄 **HTML - Componentes**
```
footer.html          - Componente do rodapé (estático)
header.html          - ❌ NÃO EDITAR! Gerado pelo backend
whatsapp-float.html  - Botão flutuante WhatsApp (estático)
```

### 🎨 **CSS**
```
styles-components.css - CSS PRINCIPAL (glassmorphism S23)
                       Versão atual: ?v=8
```

### 🔧 **JavaScript - Utilitários Ativos**
```
load-components.js      - Carrega header/footer/whatsapp
add-css-version.js      - Script de cache busting (uso manual)
list-products.js        - Lista produtos do banco (debug)
```

### 🗂️ **Pastas do Sistema**
```
planac-admin/     - Admin Panel (React + Vite)
planac-backend/   - Backend API (Hono Worker)
.github/          - GitHub Actions (auto-deploy)
```

---

## 🗃️ ARQUIVOS LEGADOS (NÃO MAIS USADOS)

Estes arquivos foram movidos para `arquivos-legados/`:

### 📄 **HTML Estáticos de Produtos (OBSOLETOS)**
```
divisoria-naval-page.html
drywall-divisoria-page.html
forrovid-page.html
forro-vinilico-revid.html
isopor-page.html
kit-porta.html
kit-porta-correr.html
la-pet-page.html
la-rocha-page.html
la-vidro-page.html
manta-termica.html
mineral-page.html
planac-forro-gesso-completo.html
planac-gesso-modular.html
portas-sanfonadas.html
pvc-amadeirado-page.html
pvc-branco-page.html
pvc-modular-page.html
rodapes.html
temp_header.html
```

**Por que foram descontinuados?**
- Sistema migrou para geração dinâmica via backend
- Páginas agora são salvas no KV Cache
- Manutenção via Admin Panel

### 🔧 **Scripts Obsoletos**
```
build-static-pages.js      - Gerava HTMLs estáticos (substituído por page-builder.js)
sync-from-database.js      - Sincronizava DB → HTML (não mais necessário)
render-dynamic-home.js     - Renderizava home (agora é KV)
render-dynamic-menu.js     - Renderizava menu (agora é build-deploy.js)
remove-duplicate-styles.js - Limpeza de CSS (já feita)
check-cloudflare.js        - Debug antigo
forms-integration.js       - Integração antiga de forms
```

### 🎨 **CSS Obsoleto**
```
glass-s23.css - Backup do glassmorphism (use styles-components.css)
```

---

## 🚨 REGRAS DE OURO

### ❌ NUNCA FAÇA ISSO:
1. **Editar arquivos .html de produtos** na raiz
2. **Modificar header.html** diretamente (é gerado pelo backend)
3. **Deletar styles-components.css** (é o CSS principal)
4. **Remover planac-admin/** ou **planac-backend/** (são o sistema)

### ✅ SEMPRE FAÇA ISSO:
1. **Editar páginas via Admin Panel** (https://planac-admin.pages.dev)
2. **Modificar CSS em styles-components.css** e incrementar versão
3. **Atualizar versão CSS** com `node add-css-version.js {versão}`
4. **Fazer backup antes de grandes mudanças**

---

## 📝 FLUXO DE TRABALHO CORRETO

### **Para editar uma página:**
```
1. Acessar: https://planac-admin.pages.dev
2. Login: admin / planac
3. Clicar em "Páginas"
4. Editar a página desejada
5. Salvar
6. ✅ Página atualizada automaticamente no site!
```

### **Para editar CSS/Estilo:**
```
1. Editar: styles-components.css
2. Incrementar versão: ?v=8 → ?v=9
3. Rodar: node add-css-version.js 9
4. Commit e push
5. ✅ Cloudflare Pages faz auto-deploy
```

### **Para editar menus:**
```
1. Acessar Admin Panel
2. Clicar em "Menus"
3. Editar estrutura
4. Salvar
5. ✅ Header rebuiltado automaticamente!
```

---

## 🗂️ ESTRUTURA RECOMENDADA

```
SitePlanacCompleto/
├── 📁 planac-admin/          ✅ ADMIN PANEL (EM USO)
├── 📁 planac-backend/        ✅ BACKEND API (EM USO)
├── 📁 arquivos-legados/      📦 ARQUIVOS ANTIGOS
│   ├── html-estaticos/       (páginas .html antigas)
│   └── scripts-antigos/      (scripts .js antigos)
├── 📁 .github/workflows/     ✅ AUTO-DEPLOY (EM USO)
│
├── 📄 footer.html            ✅ EM USO
├── 📄 header.html            ⚠️ GERADO AUTOMATICAMENTE
├── 📄 whatsapp-float.html    ✅ EM USO
├── 📄 index.html             ✅ EM USO (página inicial)
│
├── 🎨 styles-components.css  ✅ EM USO (CSS principal)
│
├── 🔧 load-components.js     ✅ EM USO
├── 🔧 add-css-version.js     ✅ EM USO
├── 🔧 list-products.js       ✅ EM USO (debug)
│
├── 📖 README.md              ✅ DOCUMENTAÇÃO
├── 📖 RELATORIO-SISTEMA-COMPLETO.md
├── 📖 FLUXOGRAMA-ADMIN.md
└── 📖 ARQUIVOS-EM-USO.md     ✅ ESTE ARQUIVO
```

---

## 🔄 QUANDO MOVER ARQUIVOS PARA LEGADO

Se você criar novos arquivos temporários ou de teste:
```bash
# Mover HTML estático
mv novo-produto.html arquivos-legados/html-estaticos/

# Mover script de teste
mv test-script.js arquivos-legados/scripts-antigos/
```

---

## 📞 DÚVIDAS?

**Antes de mexer em qualquer arquivo, pergunte:**
1. Este arquivo está listado em "ARQUIVOS EM USO ATIVO"?
2. Estou editando pelo Admin Panel ou diretamente no código?
3. Vou quebrar o sistema se deletar/mover isso?

**Se tiver dúvida, consulte:**
- RELATORIO-SISTEMA-COMPLETO.md
- FLUXOGRAMA-ADMIN.md

---

**ÚLTIMA ATUALIZAÇÃO:** 2025-11-12
**SISTEMA FUNCIONANDO:** ✅ 100%
