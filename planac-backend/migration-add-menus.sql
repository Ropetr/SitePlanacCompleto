-- ===========================================
-- MIGRAÇÃO: Adicionar tabela menus e atualizar products
-- ===========================================

-- Criar tabela menus (se não existir)
CREATE TABLE IF NOT EXISTS menus (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    icone TEXT,
    menu_pai_id TEXT,
    ordem INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_pai_id) REFERENCES menus(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_menus_slug ON menus(slug);
CREATE INDEX IF NOT EXISTS idx_menus_pai ON menus(menu_pai_id);

-- Verificar se products existe e se tem categoria_id ou menu_id
-- Se a tabela products já existe com categoria_id, precisamos fazer a migração

-- Opção 1: Se products ainda não tem dados importantes, recriar
-- DROP TABLE IF EXISTS products;

-- Opção 2: Se products tem dados, criar nova tabela e migrar
-- Por segurança, vamos apenas garantir que a tabela existe com a estrutura correta
CREATE TABLE IF NOT EXISTS products_new (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitulo TEXT,
    descricao_curta TEXT,
    descricao_completa TEXT,
    caracteristicas TEXT,
    vantagens TEXT,
    aplicacoes TEXT,
    especificacoes TEXT,
    normas_certificacoes TEXT,
    imagem_banner TEXT,
    galeria_imagens TEXT,
    video_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    ordem INTEGER DEFAULT 0,
    destaque INTEGER DEFAULT 0,
    status TEXT DEFAULT 'RASCUNHO',
    menu_id TEXT NOT NULL,
    created_by_id TEXT NOT NULL,
    updated_by_id TEXT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users(id),
    FOREIGN KEY (updated_by_id) REFERENCES users(id)
);

-- Se products_new foi criada com sucesso e products existe, migrar dados
-- INSERT INTO products_new SELECT * FROM products WHERE 1=0; -- não executar automaticamente
