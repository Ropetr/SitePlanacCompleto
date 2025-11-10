-- ===========================================
-- MIGRAÇÃO: Página Index/Home para o banco de dados
-- ===========================================

-- Primeiro, criar um menu "Home" se não existir
INSERT OR IGNORE INTO menus (
  id,
  nome,
  slug,
  descricao,
  icone,
  menu_pai_id,
  ordem,
  ativo,
  metadata,
  created_at,
  updated_at
) VALUES (
  'menu-home',
  'Home',
  'home',
  'Página Inicial',
  NULL,
  NULL,
  -1,
  1,
  '{}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Agora inserir a página Home
INSERT INTO products (
  id,
  nome,
  slug,
  subtitulo,
  descricao_curta,
  descricao_completa,

  -- Banner principal
  imagem_banner,

  -- Cards de features (JSON array)
  caracteristicas,

  -- Seção Sobre
  vantagens,

  -- Missão, Visão, Valores (JSON)
  especificacoes,

  -- Meta tags
  meta_title,
  meta_description,
  meta_keywords,

  ordem,
  destaque,
  status,
  menu_id,
  created_by_id,
  published_at,
  created_at,
  updated_at
) VALUES (
  'page-home',
  'Página Inicial',
  'index',
  'Precisando de Materiais ou Serviços? Fale conosco Agora!',
  'Forros e Divisórias',

  -- Texto completo da seção Sobre
  'A PLANAC: Empresa com PROPÓSITO!

A PLANAC Acabamentos foi fundada em 04 de fevereiro de 2011 a partir de um SONHO meu Rodrigo e da minha esposa Deyse.

O nome PLANAC nos foi revelado neste sonho, e vem da junção das palavras PLANejamento & ACabamento. Dois conceitos importantíssimos para construções e reformas de QUALIDADE.

Atuar como DISTRIBUIDOR nos possibilitou a venda direta de produtos a clientes FÍSICOS e JURÍDICOS, com preços de ATACADO além de abrir acesso a bons PROFISSIONAIS para indicação na montagem.

Se você procura produtos de QUALIDADE, atendimento ÁGIL e pagamento FLEXÍVEL

A PLANAC DISTRIBUIDORA é o lugar CERTO!',

  -- Banner principal
  'https://painel-planac.codiehost.com.br/uploads/133473966882981354.jpeg',

  -- Cards de features (4 itens)
  '["NORMATIZAÇÃO ABNT DOS MATERIAIS|https://painel-planac.codiehost.com.br/uploads/133465396479346008.png", "PRODUTOS A PRONTA ENTREGA|https://painel-planac.codiehost.com.br/uploads/133465396723233554.png", "AGILIDADE DE ATENDIMENTO|https://painel-planac.codiehost.com.br/uploads/133465396865785915.png", "FLEXIBILIDADE DE PAGAMENTO|https://painel-planac.codiehost.com.br/uploads/133465396975722242.png"]',

  -- Informações adicionais da seção sobre (não usado atualmente)
  '[]',

  -- Missão, Visão, Valores (JSON)
  '{"missao": "Superar as expectativas de cada cliente através do atendimento e produtos certificados!", "visao": "Através do posicionamento legal e consistente no mercado, sermos a mais completa distribuidora de materiais do Brasil.", "valores": "Prezamos o respeito, ética e clareza nos relacionamentos pessoais e comerciais."}',

  -- Meta tags
  'Planac Distribuidora - Forros e Divisórias | Londrina-PR',
  'Distribuidora especializada em forros, divisórias, drywall e materiais termoacústicos. Produtos certificados ABNT, pronta entrega e pagamento flexível.',
  '["forros", "divisórias", "drywall", "lã de rocha", "lã de vidro", "PVC", "gesso acartonado", "Londrina", "Planac"]',

  -- Ordem e destaque
  -1,  -- Ordem: -1 para sempre aparecer primeiro
  1,   -- Destaque: sim
  'PUBLICADO',
  'menu-home', -- Menu Home
  '550e8400-e29b-41d4-a716-446655440000', -- Admin user ID
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
