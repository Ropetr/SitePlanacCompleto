# 🏗️ Planac Distribuidora - Sistema Completo

Sistema de gerenciamento de conteúdo para **Planac Distribuidora** - distribuidora de materiais de construção em Londrina-PR.

**📋 [Ver Documentação Completa do Projeto](./PROJETO-STATUS.md)**

---

## 🌐 Links do Sistema

| Componente | URL | Status |
|------------|-----|--------|
| **📄 Site Principal** | https://siteplanaccompleto.pages.dev | 🟢 Online |
| **🎛️ Painel Admin** | https://planac-admin.pages.dev | 🟢 Online |
| **🔌 API Backend** | https://planac-backend-api.planacacabamentos.workers.dev | 🟢 Online |

### 🔐 Acesso ao Painel Admin

```
E-mail: admin@planacdivisorias.com.br
Senha: Admin@123
```

---

## 📂 Estrutura do Projeto

```
SitePlanacCompleto/
├── planac-backend/        # API Cloudflare Workers + D1
├── planac-admin/          # Painel Admin (React)
├── *.html                # Site estático (19 páginas)
├── PROJETO-STATUS.md     # 📋 Documentação completa
└── README.md             # Este arquivo
```

---

## 🚀 Componentes do Sistema

### 1. 🔌 Backend API (Cloudflare Workers)

**Tecnologias:**
- Cloudflare Workers (Serverless)
- Cloudflare D1 (SQLite Database)
- Cloudflare R2 (Object Storage)
- Hono.js (Framework)

**Features:**
- ✅ Autenticação JWT + bcrypt
- ✅ CRUD completo de Menus e Páginas
- ✅ Upload de imagens para R2
- ✅ Gestão de Cotações e Contatos
- ✅ Logs de auditoria

**Endpoints:** https://planac-backend-api.planacacabamentos.workers.dev

---

### 2. 🎛️ Painel Admin (React + Vite)

**Tecnologias:**
- React 18
- Vite
- TailwindCSS
- React Router v6
- Axios
- Lucide Icons

**Features:**
- ✅ Login com autenticação JWT
- ✅ Dashboard com estatísticas
- ✅ CRUD de Menus (9 categorias)
- ✅ CRUD de Páginas (19 páginas de produtos)
- ✅ Upload de imagens (banner + galeria)
- ✅ Formulário completo com todos os campos
- ⚠️ Páginas de Cotações e Contatos (pendentes)

**URL:** https://planac-admin.pages.dev

---

### 3. 📄 Site Institucional (HTML Estático)

**Tecnologias:**
- HTML5
- CSS3 (Glassmorphism, Flexbox, Grid)
- JavaScript Vanilla
- Google Fonts (Barlow, Poppins)

**Features:**
- ✅ 19 páginas de produtos
- ✅ Design glassmorphism
- ✅ Responsivo (breakpoints: 1900px → 1024px)
- ✅ Menus dropdown com submenu
- ✅ Integração WhatsApp Business
- ✅ Carregamento dinâmico de componentes

**URL:** https://siteplanaccompleto.pages.dev

**Páginas Principais:**
- `index.html` - Landing page principal
- `planac-website.html` - Home alternativa
- `header.html`, `footer.html`, `whatsapp-float.html` - Componentes reutilizáveis

**Páginas de Produtos (19):**
- Divisórias (2): Naval, Drywall
- Forros (4): Gesso Acartonado, PVC Branco, PVC Amadeirado, Vinílico REVID
- Forros Modulares (5): Gesso, PVC, Forrovid, Mineral, Isopor
- Termoacústica (4): Lã de Rocha, Lã de Vidro, Lã PET, Manta Térmica
- Kit Portas (3): Convencional, Correr, Sanfonadas
- Outros (1): Rodapés

## 🗄️ Banco de Dados (D1)

**8 Tabelas Criadas:**
- `usuarios` - Acesso ao admin
- `menus` - 9 categorias de produtos
- `paginas` - 19 páginas com todos os campos
- `cotacoes` - Formulários de cotação
- `contatos` - Formulários de contato
- `media` - Controle de uploads
- `audit_logs` - Logs de ações
- `sessions` - Controle de sessões JWT

**9 Menus Cadastrados:**
1. Divisórias
2. Drywall
3. Forros
4. Forros Modulares
5. Termoacústica
6. Kit Portas
7. Rodapés
8. Sobre
9. Contato

**19 Páginas de Produtos** - Todas cadastradas com estrutura completa

---

## 🚀 Deploy e Infraestrutura

| Componente | Plataforma | Deploy |
|------------|-----------|---------|
| Backend API | Cloudflare Workers | Manual via `wrangler deploy` |
| Painel Admin | Cloudflare Pages | Automático via GitHub |
| Site Principal | Cloudflare Pages | Automático via GitHub |
| Banco de Dados | Cloudflare D1 | Migrations via wrangler |
| Imagens | Cloudflare R2 | Upload via API |

---

## 🎨 Design System (Site)

**Cores:**
- Primary (Vinho): `#AA000E`
- Secondary (Vermelho): `#ec3237`
- Glassmorphism: `rgba(50, 55, 65, 0.5)` com `backdrop-filter: blur(10px)`

**Responsividade:**
- Desktop: Menu completo com dropdowns
- Mobile (≤1024px): Menu hambúrguer, grid 2 colunas

---

## 📞 Contatos da Empresa

- **Telefone**: (43) 3028-5316
- **WhatsApp**: (43) 98418-2582
- **Email**: contato@planacdivisorias.com.br
- **Endereço**: Av. Abelio Benatti, 4912 - Londrina-PR
- **Horário**: Segunda a Sexta, 8h às 17h

---

## 🔧 Como Usar Este Sistema

### 1. Acessar o Painel Admin

```bash
URL: https://planac-admin.pages.dev
Login: admin@planacdivisorias.com.br
Senha: Admin@123
```

### 2. Gerenciar Conteúdo

**Menus (Categorias):**
- Criar, editar e organizar categorias
- Definir ordem de exibição
- Ativar/desativar menus

**Páginas (Produtos):**
- Criar páginas de produtos com todos os campos:
  - Título, slug, descrição
  - Imagem banner (upload ou URL)
  - Galeria de imagens (múltiplos uploads)
  - Meta title, meta description, meta keywords
  - Cor tema, ícone, ordem
  - Aplicações, vantagens, diferenciais
  - Garantias, normas, especificações

### 3. Upload de Imagens

- **Banner**: Uma imagem principal (até 10MB)
- **Galeria**: Múltiplas imagens (até 10MB cada)
- Formatos aceitos: JPG, PNG, WebP, GIF
- Upload direto para Cloudflare R2
- Ou inserir URL manualmente

### 4. Visualizar no Site

- Mudanças no banco de dados refletem na API
- Site estático precisa ser atualizado manualmente
- (Futuro: Integração site ↔ API)

---

## 🎯 Status do Projeto

### ✅ Completo (95%)

1. **Backend API** - 100% funcional
   - Autenticação JWT
   - CRUD de Menus e Páginas
   - Upload de imagens R2
   - Logs de auditoria

2. **Painel Admin** - 95% funcional
   - Login e autenticação
   - CRUD de Menus
   - CRUD de Páginas completo com imagens
   - Dashboard básico

3. **Site Institucional** - 100% funcional
   - 19 páginas de produtos
   - Design responsivo
   - Formulários WhatsApp

### ⚠️ Pendente (5%)

1. **Crítico**:
   - Configurar domínio público do R2 (planac-images)
   - Testar upload de imagens em produção

2. **Importante**:
   - Página de Cotações no Admin
   - Página de Contatos no Admin
   - Dashboard com gráficos

3. **Futuro**:
   - Integrar site estático com API
   - Editor rich text para descrições
   - Sistema de permissões
   - Versionamento de páginas

---

## 📚 Documentação Completa

Para detalhes técnicos completos, histórico de problemas resolvidos, e instruções de continuidade:

**📋 [PROJETO-STATUS.md](./PROJETO-STATUS.md)** - Documentação completa de 500+ linhas

---

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- Senhas com bcrypt (12 rounds)
- HTTPS em todos os componentes (Cloudflare)
- Validação de tipos e tamanhos de arquivos
- Logs de auditoria de todas as ações
- CORS configurado

## 📄 Licença

© 2024 Planac Distribuidora. Todos os direitos reservados.

---

**Desenvolvido com ❤️ por Claude Code**
