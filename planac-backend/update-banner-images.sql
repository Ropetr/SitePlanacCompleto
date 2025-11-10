-- ===========================================
-- ATUALIZAÇÃO: Imagens Banner das Páginas
-- ===========================================
-- Sincronizando com as imagens usadas na página Index/Home

-- Seção Forros
UPDATE products SET imagem_banner = 'https://painel-planac.codiehost.com.br/uploads/133737433241995141.jpg' WHERE slug = 'planac-forro-gesso-completo';
UPDATE products SET imagem_banner = 'https://painel-planac.codiehost.com.br/uploads/133471436835853780.jpg' WHERE slug = 'planac-gesso-modular';
UPDATE products SET imagem_banner = 'https://painel-planac.codiehost.com.br/uploads/133471437270525667.jpg' WHERE slug = 'pvc-branco-page';

-- Seção Divisórias
UPDATE products SET imagem_banner = 'https://painel-planac.codiehost.com.br/uploads/133608846438594959.png' WHERE slug = 'drywall-divisoria-page';
UPDATE products SET imagem_banner = 'https://painel-planac.codiehost.com.br/uploads/133603401096191514.jpg' WHERE slug = 'divisoria-naval-page';
