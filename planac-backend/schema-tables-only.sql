-- Criar apenas as tabelas (sem dados iniciais)

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'EDITOR',
    avatar TEXT,
    ativo INTEGER DEFAULT 1,
    ultimo_acesso DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    icone TEXT,
    imagem_destaque TEXT,
    categoria_pai_id TEXT,
    ordem INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_pai_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_pai ON categories(categoria_pai_id);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitulo TEXT,
    descricao_curta TEXT,
    descricao_completa TEXT,
    caracteristicas TEXT,
    vantagens TEXT,
    aplicacoes TEXT,
    especificacoes_tecnicas TEXT,
    imagem_banner TEXT,
    galeria_imagens TEXT,
    video_url TEXT,
    palavra_chave TEXT,
    meta_descricao TEXT,
    categoria_id TEXT NOT NULL,
    ordem INTEGER DEFAULT 0,
    destaque INTEGER DEFAULT 0,
    status TEXT DEFAULT 'RASCUNHO',
    visualizacoes INTEGER DEFAULT 0,
    created_by_id TEXT,
    updated_by_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_destaque ON products(destaque);

CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    conteudo TEXT,
    banner_imagem TEXT,
    banner_titulo TEXT,
    banner_subtitulo TEXT,
    sections TEXT,
    metadata TEXT,
    ativo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pages_tipo ON pages(tipo);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    chave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    tipo TEXT DEFAULT 'string',
    descricao TEXT,
    grupo TEXT DEFAULT 'geral',
    ordem INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_settings_chave ON settings(chave);
CREATE INDEX IF NOT EXISTS idx_settings_grupo ON settings(grupo);

CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    empresa TEXT,
    cidade TEXT,
    estado TEXT,
    produto TEXT,
    mensagem TEXT,
    status TEXT DEFAULT 'NOVO',
    atribuido_para_id TEXT,
    origem TEXT,
    ip_address TEXT,
    user_agent TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    notas_internas TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atribuido_para_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);

CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    assunto TEXT,
    mensagem TEXT NOT NULL,
    lido INTEGER DEFAULT 0,
    respondido INTEGER DEFAULT 0,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contacts_lido ON contacts(lido);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    nome_original TEXT NOT NULL,
    nome_arquivo TEXT NOT NULL,
    tipo TEXT DEFAULT 'IMAGEM',
    mime_type TEXT,
    tamanho INTEGER,
    url TEXT NOT NULL,
    descricao TEXT,
    alt_text TEXT,
    uploaded_by_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_media_tipo ON media(tipo);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    acao TEXT NOT NULL,
    entidade TEXT NOT NULL,
    entidade_id TEXT,
    dados_anteriores TEXT,
    dados_novos TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entidade ON audit_logs(entidade);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
