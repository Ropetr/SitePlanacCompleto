# Proposta de Backend e CMS para Site Planac

## Visão Geral
Criar um sistema backend completo que permita a gestão dinâmica de todo o conteúdo do site através de um painel administrativo intuitivo.

---

## 1. ARQUITETURA SUGERIDA

### Stack Tecnológico Recomendado

#### Opção 1: Node.js + Express (Recomendada)
- **Backend**: Node.js + Express.js
- **Banco de Dados**: PostgreSQL (principal) + MongoDB (arquivos/logs)
- **ORM**: Sequelize (PostgreSQL) ou Prisma
- **Autenticação**: JWT + Bcrypt
- **Upload de Arquivos**: Multer + Sharp (otimização de imagens)
- **Storage**: AWS S3 / Cloudflare R2 / Local com CDN
- **API**: RESTful ou GraphQL
- **Painel Admin**: React + Vite ou Next.js

#### Opção 2: PHP + Laravel (Alternativa)
- **Backend**: PHP 8.2+ + Laravel 11
- **Banco de Dados**: MySQL/MariaDB
- **ORM**: Eloquent
- **Autenticação**: Laravel Sanctum/Passport
- **Painel Admin**: Laravel Nova ou Filament
- **Storage**: Laravel Storage + S3

#### Opção 3: Python + Django (Robusta)
- **Backend**: Python + Django
- **Banco de Dados**: PostgreSQL
- **ORM**: Django ORM
- **Painel Admin**: Django Admin (built-in) customizado
- **API**: Django REST Framework

---

## 2. FUNCIONALIDADES DO BACKEND

### A. Gestão de Produtos

#### Módulo: Categorias
- **CRUD Completo**
  - Criar, editar, excluir categorias
  - Hierarquia (categoria > subcategoria)
  - Ordenação customizada
  - Status (ativo/inativo)
  - Ícone/imagem da categoria
  - Slug para URL amigável

**Campos:**
```javascript
{
  id: UUID,
  nome: String,
  slug: String (auto-gerado),
  descricao: Text,
  icone: Image,
  categoria_pai_id: UUID (nullable),
  ordem: Integer,
  ativo: Boolean,
  metadata: JSON, // SEO
  created_at: Timestamp,
  updated_at: Timestamp
}
```

**Categorias Atuais:**
1. Divisórias
2. Drywall
3. Forros
4. Forros Modulares
5. Termoacústica
6. Kit Portas
7. Rodapés

#### Módulo: Produtos
- **CRUD Completo**
  - Criar, editar, excluir produtos
  - Associar a múltiplas categorias
  - Upload de múltiplas imagens (galeria)
  - Editor de texto rico (WYSIWYG)
  - Versões de conteúdo (histórico)
  - Status (publicado/rascunho/arquivado)

**Campos:**
```javascript
{
  id: UUID,
  nome: String,
  slug: String,
  subtitulo: String,
  descricao_curta: Text,
  descricao_completa: HTML/Markdown,

  // Conteúdo Estruturado
  caracteristicas: JSON[],
  vantagens: JSON[],
  aplicacoes: JSON[],
  especificacoes_tecnicas: JSON,
  normas_certificacoes: JSON[],

  // Mídia
  imagem_banner: Image,
  galeria_imagens: Image[],
  video_url: String,

  // Relacionamentos
  categorias: UUID[],
  produtos_relacionados: UUID[],

  // SEO
  meta_title: String,
  meta_description: String,
  meta_keywords: String[],

  // Organização
  ordem: Integer,
  destaque: Boolean,
  ativo: Boolean,

  // Controle
  created_by: UUID,
  updated_by: UUID,
  created_at: Timestamp,
  updated_at: Timestamp,
  published_at: Timestamp
}
```

---

### B. Gestão de Conteúdo Institucional

#### Módulo: Páginas
- **Home**
  - Título do banner
  - Subtítulo
  - Imagem de fundo
  - CTA (texto e link)
  - Cards de benefícios (gerenciáveis)

- **Sobre Nós**
  - História da empresa (editor rico)
  - Missão
  - Visão
  - Valores
  - Equipe (opcional - foto + nome + cargo)

**Campos:**
```javascript
{
  id: UUID,
  tipo: Enum('home', 'sobre', 'contato', 'custom'),
  titulo: String,
  conteudo: HTML,
  banner_imagem: Image,
  banner_titulo: String,
  banner_subtitulo: String,
  sections: JSON[], // Seções dinâmicas
  ativo: Boolean,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

#### Módulo: Configurações Globais
```javascript
{
  // Informações da Empresa
  nome_empresa: String,
  slogan: String,
  logo: Image,
  logo_secundaria: Image,
  favicon: Image,

  // Contatos
  telefone_principal: String,
  telefone_secundario: String,
  whatsapp: String,
  email: String,
  endereco_completo: String,
  maps_url: String,

  // Redes Sociais
  instagram_url: String,
  facebook_url: String,
  linkedin_url: String,
  youtube_url: String,

  // Horário de Atendimento
  horario_texto: String,
  horario_estruturado: JSON,

  // SEO Global
  site_title: String,
  site_description: String,
  site_keywords: String[],
  google_analytics_id: String,
  google_tag_manager_id: String,

  // Scripts
  header_scripts: Text,
  footer_scripts: Text,

  // Manutenção
  modo_manutencao: Boolean,
  mensagem_manutencao: Text
}
```

---

### C. Gestão de Formulários e Leads

#### Módulo: Orçamentos
- **Captura de Leads**
  - Salvar todos os orçamentos solicitados
  - Status (novo, em atendimento, atendido, perdido)
  - Atribuir a vendedor
  - Histórico de interações
  - Exportação (CSV, Excel)

**Campos:**
```javascript
{
  id: UUID,
  // Dados do Cliente
  nome: String,
  email: String,
  telefone: String,
  cidade: String,

  // Dados do Orçamento
  produto: String,
  tipo_projeto: Enum,
  mensagem: Text,
  origem: String, // Página de origem

  // Controle
  status: Enum('novo', 'em_atendimento', 'atendido', 'perdido'),
  vendedor_id: UUID,
  observacoes_internas: Text,

  // Rastreamento
  ip_address: String,
  user_agent: String,
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,

  created_at: Timestamp,
  updated_at: Timestamp
}
```

#### Módulo: Contatos (Formulário Genérico)
- Similar ao de orçamentos, mas para mensagens gerais
- Integração com e-mail (notificações automáticas)

---

### D. Gestão de Mídia

#### Módulo: Biblioteca de Arquivos
- **Upload de Imagens**
  - Múltiplos formatos (JPG, PNG, WebP, SVG)
  - Redimensionamento automático
  - Geração de thumbnails
  - Otimização automática
  - Alt text para acessibilidade
  - Organização por pastas

- **Upload de Documentos**
  - PDFs (catálogos, manuais)
  - Planilhas
  - Outros arquivos

**Campos:**
```javascript
{
  id: UUID,
  nome_original: String,
  nome_arquivo: String,
  tipo: Enum('imagem', 'documento', 'video'),
  mime_type: String,
  tamanho: Integer, // bytes
  url: String,
  url_thumbnail: String,
  largura: Integer,
  altura: Integer,
  alt_text: String,
  pasta_id: UUID,
  uploaded_by: UUID,
  created_at: Timestamp
}
```

---

### E. Sistema de Usuários e Permissões

#### Módulo: Usuários
**Tipos de Usuário:**
1. **Super Admin** - Acesso total
2. **Admin** - Gerenciamento de conteúdo
3. **Editor** - Edição de produtos e páginas
4. **Vendedor** - Visualização de leads e orçamentos

**Campos:**
```javascript
{
  id: UUID,
  nome: String,
  email: String,
  senha_hash: String,
  tipo: Enum('super_admin', 'admin', 'editor', 'vendedor'),
  avatar: Image,
  ativo: Boolean,
  ultimo_acesso: Timestamp,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

#### Módulo: Permissões (ACL)
- Controle granular de permissões
- Grupos de permissões
- Auditoria de ações (quem fez o quê e quando)

---

### F. SEO e Analytics

#### Módulo: SEO
- **Sitemap Automático** (XML)
- **Robots.txt** configurável
- **Meta Tags Dinâmicas**
- **URLs Amigáveis** (slugs)
- **Breadcrumbs** automáticos
- **Schema.org** (JSON-LD) para produtos

#### Módulo: Analytics
- **Dashboard**
  - Visitas por página
  - Produtos mais visualizados
  - Orçamentos por período
  - Taxa de conversão
  - Origem do tráfego

- **Integração**
  - Google Analytics
  - Google Tag Manager
  - Facebook Pixel
  - Hotjar / Clarity

---

### G. Integrações

#### WhatsApp Business API
- **Notificações Automáticas**
  - Novo orçamento recebido
  - Novo contato

- **Chatbot (opcional)**
  - Respostas automáticas
  - Horário de atendimento

#### E-mail Marketing (opcional)
- **Newsletter**
  - Captura de e-mails
  - Envio de campanhas
  - Integração com Mailchimp/SendGrid

#### CRM (opcional - futuro)
- Integração com RD Station, Pipedrive, etc.

---

### H. Outras Funcionalidades

#### Módulo: Blog (opcional)
- **Posts**
  - Título, conteúdo, imagem destaque
  - Categorias e tags
  - Comentários (Disqus ou nativo)
  - Compartilhamento social

#### Módulo: Depoimentos
- **Avaliações de Clientes**
  - Nome, empresa, depoimento
  - Foto
  - Nota (estrelas)
  - Aprovação moderada

#### Módulo: FAQ
- **Perguntas Frequentes**
  - Pergunta + resposta
  - Categorias
  - Busca
  - Ordenação

#### Módulo: Banners/Sliders
- **Carrossel da Home**
  - Múltiplos slides
  - Imagem, título, texto, CTA
  - Ordenação
  - Programação (data início/fim)

---

## 3. API REST

### Endpoints Principais

#### Produtos
```
GET    /api/products              - Listar produtos
GET    /api/products/:slug        - Detalhes do produto
GET    /api/categories            - Listar categorias
GET    /api/categories/:slug      - Produtos da categoria
```

#### Conteúdo
```
GET    /api/pages/:type           - Conteúdo da página
GET    /api/settings              - Configurações globais
```

#### Formulários
```
POST   /api/quotes                - Enviar orçamento
POST   /api/contacts              - Enviar contato
```

#### Mídia
```
GET    /api/media                 - Listar arquivos
POST   /api/media/upload          - Upload de arquivo
```

#### Admin (Autenticado)
```
POST   /api/auth/login            - Login
POST   /api/auth/logout           - Logout
GET    /api/auth/me               - Usuário atual

// CRUD de recursos
GET    /api/admin/products        - Listar
POST   /api/admin/products        - Criar
PUT    /api/admin/products/:id    - Editar
DELETE /api/admin/products/:id    - Excluir

// Leads
GET    /api/admin/quotes          - Listar orçamentos
PUT    /api/admin/quotes/:id      - Atualizar status

// Dashboard
GET    /api/admin/dashboard/stats - Estatísticas
```

---

## 4. PAINEL ADMINISTRATIVO

### Interface de Admin

#### Dashboard (Página Inicial)
- **Métricas em Tempo Real**
  - Novos orçamentos hoje
  - Visitas do site (último mês)
  - Produtos mais visualizados
  - Taxa de conversão

- **Ações Rápidas**
  - Novo produto
  - Novo post
  - Ver orçamentos pendentes

- **Gráficos**
  - Orçamentos por mês
  - Produtos mais solicitados
  - Origem dos leads

#### Gestão de Produtos
- **Lista de Produtos**
  - Tabela com: Nome, Categoria, Status, Última Edição
  - Filtros: Categoria, Status, Busca
  - Ações em massa: Ativar/Desativar, Excluir

- **Formulário de Produto**
  - Tabs organizadas:
    1. Informações Básicas
    2. Conteúdo Detalhado
    3. Características e Vantagens
    4. Galeria de Imagens
    5. SEO
  - Preview ao vivo
  - Salvar como rascunho
  - Agendar publicação

#### Gestão de Categorias
- **Árvore Hierárquica**
  - Drag & drop para reorganizar
  - Expansão/colapso de subcategorias

#### Gestão de Mídia
- **Visualização em Grid**
  - Thumbnails das imagens
  - Detalhes ao clicar
  - Upload por drag & drop
  - Busca e filtros

#### Gestão de Orçamentos
- **Kanban Board**
  - Colunas: Novo, Em Atendimento, Atendido, Perdido
  - Drag & drop entre colunas
  - Filtros por data, produto, vendedor

- **Detalhes do Orçamento**
  - Dados completos do lead
  - Histórico de interações
  - Notas internas
  - Enviar e-mail direto
  - Link para WhatsApp

#### Configurações
- **Abas Organizadas**
  - Geral (nome, logo, contatos)
  - Redes Sociais
  - SEO
  - Integrações
  - Scripts
  - Usuários
  - Permissões

---

## 5. BANCO DE DADOS

### Esquema de Tabelas (Resumo)

```sql
-- Categorias
categories (
  id, nome, slug, descricao, icone,
  categoria_pai_id, ordem, ativo, metadata,
  created_at, updated_at
)

-- Produtos
products (
  id, nome, slug, subtitulo,
  descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes,
  especificacoes_tecnicas, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, ativo,
  created_by, updated_by,
  created_at, updated_at, published_at
)

-- Relacionamento Produto-Categoria (N:N)
product_categories (
  product_id, category_id
)

-- Páginas
pages (
  id, tipo, titulo, conteudo,
  banner_imagem, banner_titulo, banner_subtitulo,
  sections, ativo,
  created_at, updated_at
)

-- Configurações
settings (
  chave, valor, tipo, descricao
)

-- Orçamentos
quotes (
  id, nome, email, telefone, cidade,
  produto, tipo_projeto, mensagem,
  origem, status, vendedor_id,
  observacoes_internas,
  ip_address, user_agent,
  utm_source, utm_medium, utm_campaign,
  created_at, updated_at
)

-- Contatos
contacts (
  id, nome, email, telefone, mensagem,
  status, lido, respondido_em,
  created_at, updated_at
)

-- Usuários
users (
  id, nome, email, senha_hash, tipo,
  avatar, ativo, ultimo_acesso,
  created_at, updated_at
)

-- Mídia
media (
  id, nome_original, nome_arquivo,
  tipo, mime_type, tamanho,
  url, url_thumbnail,
  largura, altura, alt_text,
  pasta_id, uploaded_by,
  created_at
)

-- Auditoria (opcional)
audit_logs (
  id, user_id, action, resource_type,
  resource_id, old_values, new_values,
  ip_address, created_at
)
```

---

## 6. SEGURANÇA

### Medidas de Segurança

1. **Autenticação**
   - JWT com refresh tokens
   - Bcrypt para hash de senhas (10+ rounds)
   - 2FA (opcional - futuro)

2. **Autorização**
   - ACL (Access Control List)
   - Middleware de permissões

3. **Proteção de API**
   - Rate limiting (ex: 100 req/min por IP)
   - CORS configurado
   - Helmet.js (headers de segurança)
   - Validação de inputs (express-validator)
   - Sanitização contra XSS

4. **Upload de Arquivos**
   - Validação de tipo MIME
   - Limite de tamanho
   - Scan de vírus (ClamAV - opcional)
   - Armazenamento fora do webroot

5. **Banco de Dados**
   - Prepared statements (proteção contra SQL injection)
   - Backup automático diário
   - Criptografia de dados sensíveis

6. **SSL/TLS**
   - HTTPS obrigatório
   - Certificado Let's Encrypt

7. **Logs**
   - Registro de todas as ações críticas
   - Monitoramento de erros (Sentry)

---

## 7. HOSPEDAGEM E DEPLOY

### Requisitos de Servidor

#### Mínimo
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **Tráfego**: 500GB/mês

#### Recomendado
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **Tráfego**: Ilimitado

### Opções de Hospedagem

1. **VPS/Cloud**
   - DigitalOcean Droplet ($12/mês)
   - AWS EC2 t3.medium
   - Google Cloud Compute Engine
   - Vultr

2. **Hospedagem Gerenciada**
   - Heroku (Node.js)
   - Railway
   - Render
   - Fly.io

3. **Hospedagem Nacional**
   - Umbler
   - Hostgator Cloud
   - Locaweb Cloud

### Deploy

#### CI/CD Pipeline
```yaml
# Exemplo: GitHub Actions
name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run tests
      - Build application
      - Deploy to server
      - Run migrations
      - Restart services
```

#### Ambientes
- **Development** (local)
- **Staging** (teste)
- **Production** (produção)

---

## 8. CRONOGRAMA DE DESENVOLVIMENTO

### Fase 1: Estrutura Base (2-3 semanas)
- Configuração do servidor
- Estrutura do projeto backend
- Banco de dados (tabelas principais)
- Autenticação JWT
- API básica (produtos, categorias)

### Fase 2: Painel Admin (3-4 semanas)
- Interface de login
- Dashboard
- CRUD de produtos
- CRUD de categorias
- Upload de imagens
- Configurações globais

### Fase 3: Formulários e Leads (1-2 semanas)
- Módulo de orçamentos
- Módulo de contatos
- Dashboard de leads
- Notificações por e-mail

### Fase 4: Integrações (1-2 semanas)
- API do site frontend
- WhatsApp Business API
- Google Analytics
- SEO automático

### Fase 5: Testes e Deploy (1 semana)
- Testes de integração
- Testes de segurança
- Deploy em produção
- Treinamento do cliente

**Total Estimado: 8-12 semanas**

---

## 9. CUSTOS ESTIMADOS

### Desenvolvimento
- **Freelancer Jr**: R$ 15.000 - R$ 25.000
- **Freelancer Pleno**: R$ 30.000 - R$ 50.000
- **Freelancer Sênior**: R$ 60.000 - R$ 100.000
- **Agência**: R$ 50.000 - R$ 150.000

### Infraestrutura (Mensal)
- **Servidor VPS**: R$ 60 - R$ 200/mês
- **Banco de Dados**: R$ 40 - R$ 100/mês
- **Storage (S3/R2)**: R$ 20 - R$ 50/mês
- **CDN**: R$ 30 - R$ 80/mês
- **Domínio**: R$ 40/ano
- **SSL**: Grátis (Let's Encrypt)
- **E-mail Transacional**: R$ 50 - R$ 150/mês

**Total Mensal Estimado: R$ 200 - R$ 600**

### Serviços Adicionais
- **Backup Externo**: R$ 30/mês
- **Monitoramento**: R$ 50/mês
- **E-mail Marketing**: R$ 100 - R$ 300/mês

---

## 10. PRÓXIMOS PASSOS

### Para Iniciar o Projeto:

1. **Definir Escopo Exato**
   - Quais funcionalidades são prioridade?
   - Qual stack tecnológica preferida?
   - Orçamento disponível?

2. **Escolher Fornecedor**
   - Desenvolver internamente?
   - Contratar freelancer?
   - Contratar agência?

3. **Preparar Ambiente**
   - Contratar servidor
   - Configurar domínio
   - Preparar conteúdo para migração

4. **Planejamento Detalhado**
   - Wireframes do painel admin
   - Modelagem completa do banco
   - Documentação da API

5. **Desenvolvimento Iterativo**
   - Sprints semanais
   - Testes contínuos
   - Feedback constante

---

## 11. BENEFÍCIOS DO BACKEND/CMS

### Para o Negócio
✅ **Autonomia** - Editar conteúdo sem depender de programador
✅ **Agilidade** - Atualizar produtos e preços em tempo real
✅ **Organização** - Todos os leads centralizados
✅ **Análise** - Dados para tomada de decisão
✅ **Profissionalismo** - Sistema robusto e escalável

### Para o Marketing
✅ **SEO Otimizado** - URLs amigáveis e meta tags dinâmicas
✅ **Rastreamento** - Analytics integrado
✅ **Conversão** - Formulários funcionais que salvam dados
✅ **Campanhas** - UTM tracking e relatórios

### Para Vendas
✅ **Gestão de Leads** - Controle total dos orçamentos
✅ **Histórico** - Registro de todas as interações
✅ **Métricas** - Produtos mais solicitados
✅ **Integração** - WhatsApp e e-mail direto do painel

---

## Conclusão

Este backend completo transformará o site Planac de um site estático em uma plataforma dinâmica e gerenciável, permitindo total controle sobre o conteúdo, leads e análise de resultados.

**Recomendação Final:**
Começar com um MVP (Produto Mínimo Viável) focado nas funcionalidades essenciais:
1. CRUD de produtos e categorias
2. Gestão de orçamentos
3. Configurações globais
4. Upload de imagens

Depois expandir gradualmente com funcionalidades avançadas conforme a necessidade do negócio.
