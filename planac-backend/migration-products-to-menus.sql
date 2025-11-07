-- ===========================================
-- MIGRAÇÃO COMPLETA: products (categoria_id) → products (menu_id)
-- ===========================================

-- PASSO 1: Renomear tabela antiga
ALTER TABLE products RENAME TO products_old;

-- PASSO 2: Criar nova tabela products com estrutura atualizada
CREATE TABLE products (
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

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_menu ON products(menu_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_destaque ON products(destaque);

-- PASSO 3: Se houver dados na tabela antiga, podemos migrar depois manualmente
-- (por enquanto vamos popular com os novos dados)
