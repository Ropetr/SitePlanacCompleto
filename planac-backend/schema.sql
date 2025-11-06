-- ============================================
-- SCHEMA DO BANCO DE DADOS - Cloudflare D1
-- ============================================
-- Execute: wrangler d1 execute planac-database --file=./schema.sql

-- ============================================
-- TABELA: users (Usuários)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'EDITOR', -- SUPER_ADMIN, ADMIN, EDITOR, VENDEDOR
    avatar TEXT,
    ativo INTEGER DEFAULT 1,
    ultimo_acesso DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- TABELA: categories (Categorias)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    icone TEXT,
    categoria_pai_id TEXT,
    ordem INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    metadata TEXT, -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_pai_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_pai ON categories(categoria_pai_id);

-- ============================================
-- TABELA: products (Produtos)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitulo TEXT,
    descricao_curta TEXT,
    descricao_completa TEXT,

    -- Conteúdo estruturado (JSON)
    caracteristicas TEXT, -- JSON array
    vantagens TEXT, -- JSON array
    aplicacoes TEXT, -- JSON array
    especificacoes TEXT, -- JSON object
    normas_certificacoes TEXT, -- JSON array

    -- Mídia
    imagem_banner TEXT,
    galeria_imagens TEXT, -- JSON array de URLs
    video_url TEXT,

    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT, -- JSON array

    -- Organização
    ordem INTEGER DEFAULT 0,
    destaque INTEGER DEFAULT 0,
    status TEXT DEFAULT 'RASCUNHO', -- RASCUNHO, PUBLICADO, ARQUIVADO

    -- Relacionamentos
    category_id TEXT NOT NULL,
    created_by_id TEXT NOT NULL,
    updated_by_id TEXT,

    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users(id),
    FOREIGN KEY (updated_by_id) REFERENCES users(id)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_destaque ON products(destaque);

-- ============================================
-- TABELA: pages (Páginas Institucionais)
-- ============================================
CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL, -- HOME, SOBRE, CONTATO, CUSTOM
    titulo TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    conteudo TEXT,
    banner_imagem TEXT,
    banner_titulo TEXT,
    banner_subtitulo TEXT,
    sections TEXT, -- JSON
    metadata TEXT, -- JSON (SEO)
    ativo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_tipo ON pages(tipo);

-- ============================================
-- TABELA: settings (Configurações Globais)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    chave TEXT UNIQUE NOT NULL,
    valor TEXT,
    tipo TEXT NOT NULL, -- string, number, boolean, json, image
    descricao TEXT,
    grupo TEXT, -- geral, contato, seo, integracao
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_chave ON settings(chave);
CREATE INDEX idx_settings_grupo ON settings(grupo);

-- ============================================
-- TABELA: quotes (Orçamentos/Leads)
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,

    -- Dados do cliente
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cidade TEXT,

    -- Dados do orçamento
    produto TEXT,
    tipo_projeto TEXT, -- RESIDENCIAL, COMERCIAL, INDUSTRIAL, OUTRO
    mensagem TEXT NOT NULL,
    origem TEXT, -- URL da página

    -- Controle
    status TEXT DEFAULT 'NOVO', -- NOVO, EM_ATENDIMENTO, ATENDIDO, PERDIDO
    vendedor_id TEXT,
    observacoes TEXT,

    -- Rastreamento
    ip_address TEXT,
    user_agent TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (vendedor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_vendedor ON quotes(vendedor_id);
CREATE INDEX idx_quotes_created ON quotes(created_at);

-- ============================================
-- TABELA: contacts (Contatos Gerais)
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    mensagem TEXT NOT NULL,
    lido INTEGER DEFAULT 0,
    respondido INTEGER DEFAULT 0,
    respondido_em DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_lido ON contacts(lido);
CREATE INDEX idx_contacts_created ON contacts(created_at);

-- ============================================
-- TABELA: media (Biblioteca de Arquivos)
-- ============================================
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    nome_original TEXT NOT NULL,
    nome_arquivo TEXT UNIQUE NOT NULL,
    tipo TEXT NOT NULL, -- IMAGEM, DOCUMENTO, VIDEO
    mime_type TEXT NOT NULL,
    tamanho INTEGER NOT NULL, -- bytes
    url TEXT NOT NULL,
    url_thumbnail TEXT,
    largura INTEGER,
    altura INTEGER,
    alt_text TEXT,
    pasta_id TEXT,
    uploaded_by_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uploaded_by_id) REFERENCES users(id)
);

CREATE INDEX idx_media_tipo ON media(tipo);
CREATE INDEX idx_media_arquivo ON media(nome_arquivo);

-- ============================================
-- TABELA: audit_logs (Auditoria)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN
    resource_type TEXT NOT NULL, -- Product, Category, User, etc
    resource_id TEXT,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Usuário admin padrão (senha: Planac@2024)
-- A senha será hasheada na aplicação
INSERT OR IGNORE INTO users (id, nome, email, senha, role, ativo)
VALUES (
    'admin-001',
    'Administrador',
    'admin@planacdivisorias.com.br',
    '$2a$10$XYZ...', -- Será gerado na aplicação
    'SUPER_ADMIN',
    1
);

-- Configurações iniciais
INSERT OR IGNORE INTO settings (id, chave, valor, tipo, descricao, grupo) VALUES
('set-001', 'site_name', 'Planac Distribuidora', 'string', 'Nome do site', 'geral'),
('set-002', 'site_slogan', 'Forros e Divisórias', 'string', 'Slogan do site', 'geral'),
('set-003', 'telefone_principal', '(43) 98418-2582', 'string', 'WhatsApp principal', 'contato'),
('set-004', 'telefone_fixo', '(43) 3028-5316', 'string', 'Telefone fixo', 'contato'),
('set-005', 'email_contato', 'contato@planacdivisorias.com.br', 'string', 'E-mail de contato', 'contato'),
('set-006', 'endereco', 'Av. Abelio Benatti, 4912 - Jardim do Sol - Londrina-PR', 'string', 'Endereço completo', 'contato'),
('set-007', 'instagram_url', 'https://www.instagram.com/planacdistribuidora/', 'string', 'Link do Instagram', 'contato'),
('set-008', 'maps_url', 'https://maps.app.goo.gl/w3o1SpMrhzDG3CPaA', 'string', 'Link Google Maps', 'contato');
