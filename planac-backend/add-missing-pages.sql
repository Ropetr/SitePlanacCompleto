-- =====================================================
-- ADICIONAR PÁGINAS FALTANTES AO BANCO D1
-- =====================================================
-- Este script adiciona as 10 páginas que existem como .html
-- mas foram removidas quando deletamos menus específicos

-- Menus disponíveis:
-- menu-forros (Forros)
-- menu-rodapes (Rodapés)
-- menu-termoacustica (Isolamento Termoacústico)

-- USER ID para created_by_id
-- 550e8400-e29b-41d4-a716-446655440000

-- ============ FORROS ============

-- 1. Forro de Gesso Completo
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-forro-gesso-completo',
  'Forro de Gesso Acartonado Completo',
  'planac-forro-gesso-completo',
  'Sistema completo para acabamento interno',
  'Forro de gesso acartonado com acabamento perfeito',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 1,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 2. Gesso Modular
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-gesso-modular',
  'Gesso Modular',
  'planac-gesso-modular',
  'Forro modular em placas de gesso',
  'Sistema modular de fácil instalação',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 2,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 3. Forro Vinílico
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-forro-vinilico',
  'Forro Vinílico',
  'forro-vinilico-revid',
  'Forro em PVC vinílico',
  'Forro resistente à umidade',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 3,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 4. Forros (página geral - forrovid-page)
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-forrovid',
  'Forros',
  'forrovid-page',
  'Soluções em forros',
  'Diversos tipos de forros para seu projeto',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 4,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 5. Forro de Isopor
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-forro-isopor',
  'Forro de Isopor',
  'isopor-page',
  'Forro térmico em isopor',
  'Isolamento térmico eficiente',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 5,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 6. Forro Mineral
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-forro-mineral',
  'Forro Mineral',
  'mineral-page',
  'Forro em fibra mineral',
  'Acústica e estética para ambientes corporativos',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 6,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 7. PVC Modular
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-pvc-modular',
  'PVC Modular',
  'pvc-modular-page',
  'Forro modular em PVC',
  'Sistema modular versátil e de fácil manutenção',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 7,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 8. PVC Branco
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-pvc-branco',
  'PVC Branco',
  'pvc-branco-page',
  'Forro em PVC cor branca',
  'Acabamento clean e moderno',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 8,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 9. PVC Amadeirado
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-pvc-amadeirado',
  'PVC Amadeirado',
  'pvc-amadeirado-page',
  'Forro em PVC imitação madeira',
  'Estética de madeira com praticidade do PVC',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 9,
  'menu-forros', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- ============ RODAPÉS ============

-- 10. Rodapés
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta,
  caracteristicas, vantagens, aplicacoes,
  imagem_banner, status, destaque, ordem,
  menu_id, created_by_id,
  created_at, updated_at
) VALUES (
  'prod-rodapes',
  'Rodapés',
  'rodapes',
  'Rodapés para acabamento',
  'Diversos modelos de rodapés para finalização perfeita',
  '[]', '[]', '[]',
  NULL, 'PUBLICADO', 0, 1,
  'menu-rodapes', '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Verificar total de produtos
SELECT COUNT(*) as total_produtos FROM products;
