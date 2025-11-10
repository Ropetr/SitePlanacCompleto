-- ================================================
-- CORREÇÃO: Menus do Header
-- ================================================
-- Remove menus específicos que não aparecem no header
-- Mantém apenas os menus principais + Home

-- 1. DELETAR menus que não são do header
DELETE FROM menus WHERE id IN (
  'menu-forros-gesso',
  'menu-forros-pvc',
  'menu-forros-vinilico',
  'menu-forros-modulares'
);

-- 2. CRIAR menu "Forros" (dropdown principal)
INSERT OR REPLACE INTO menus (
  id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, metadata, created_at, updated_at
) VALUES (
  'menu-forros',
  'Forros',
  'forros',
  'Menu principal de Forros',
  NULL,
  NULL,
  3,
  1,
  '{}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 3. CRIAR menu "Rodapés"
INSERT OR REPLACE INTO menus (
  id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, metadata, created_at, updated_at
) VALUES (
  'menu-rodapes',
  'Rodapés',
  'rodapes',
  'Rodapés e acabamentos',
  NULL,
  NULL,
  6,
  1,
  '{}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 4. CRIAR menu "Sobre"
INSERT OR REPLACE INTO menus (
  id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, metadata, created_at, updated_at
) VALUES (
  'menu-sobre',
  'Sobre',
  'sobre',
  'Sobre a Planac',
  NULL,
  NULL,
  7,
  1,
  '{}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 5. CRIAR menu "Contato"
INSERT OR REPLACE INTO menus (
  id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, metadata, created_at, updated_at
) VALUES (
  'menu-contato',
  'Contato',
  'contato',
  'Entre em contato',
  NULL,
  NULL,
  8,
  1,
  '{}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 6. ATUALIZAR ordem dos menus existentes
UPDATE menus SET ordem = -1 WHERE id = 'menu-home';           -- Home (primeiro)
UPDATE menus SET ordem = 1 WHERE id = 'menu-divisorias';      -- Divisórias
UPDATE menus SET ordem = 2 WHERE id = 'menu-drywall';         -- Drywall
UPDATE menus SET ordem = 3 WHERE id = 'menu-forros';          -- Forros (novo)
UPDATE menus SET ordem = 4 WHERE id = 'menu-termoacustica';   -- Termoacústica
UPDATE menus SET ordem = 5 WHERE id = 'menu-kit-portas';      -- Kit Portas
UPDATE menus SET ordem = 6 WHERE id = 'menu-rodapes';         -- Rodapés (novo)
UPDATE menus SET ordem = 7 WHERE id = 'menu-sobre';           -- Sobre (novo)
UPDATE menus SET ordem = 8 WHERE id = 'menu-contato';         -- Contato (novo)

-- 7. ATUALIZAR produtos que estavam nos menus deletados para o menu "Forros"
UPDATE products SET menu_id = 'menu-forros' WHERE menu_id IN (
  'menu-forros-gesso',
  'menu-forros-pvc',
  'menu-forros-vinilico',
  'menu-forros-modulares'
);

-- 8. RESULTADO ESPERADO:
-- Menus no Admin (9 menus):
-- - Home (ordem -1)
-- - Divisórias (ordem 1)
-- - Drywall (ordem 2)
-- - Forros (ordem 3)
-- - Termoacústica (ordem 4)
-- - Kit Portas (ordem 5)
-- - Rodapés (ordem 6)
-- - Sobre (ordem 7)
-- - Contato (ordem 8)
