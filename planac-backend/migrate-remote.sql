-- Migração para banco de dados remoto
-- Categorias principais e subcategorias

-- Divisórias
INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-divisorias-001', 'Divisórias', 'divisorias', 'Soluções completas em divisórias para construção civil', '🏗️', NULL, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-div-naval-001', 'Divisória Naval', 'divisoria-naval', 'Resistência extrema para ambientes agressivos', '⚓', 'cat-divisorias-001', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-div-gesso-001', 'Divisória de Gesso Acartonado', 'divisoria-de-gesso-acartonado', 'Drywall - Versatilidade e rapidez na construção', '🧱', 'cat-divisorias-001', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Forros
INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-forros-001', 'Forros', 'forros', 'Forros de alta qualidade para todo tipo de ambiente', '🏠', NULL, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-for-gesso-001', 'Forro de Gesso', 'forro-gesso', 'Acabamento superior e isolamento acústico', '⬜', 'cat-forros-001', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-for-pvc-b-001', 'Forro PVC Branco', 'forro-pvc-branco', 'Durabilidade e economia', '💠', 'cat-forros-001', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-for-pvc-a-001', 'Forro PVC Amadeirado', 'forro-pvc-amadeirado', 'Beleza natural com praticidade', '🌳', 'cat-forros-001', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-for-vinil-001', 'Forro Vinílico', 'forro-vinilico', 'Elegância e sofisticação', '✨', 'cat-forros-001', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Forros Modulares
INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-formod-001', 'Forros Modulares', 'forros-modulares', 'Sistemas modulares para acabamento profissional', '📐', NULL, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-fmod-gesso-001', 'Forro Modular de Gesso', 'forro-modular-gesso', 'Placas removíveis de gesso', '⚪', 'cat-formod-001', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-fmod-pvc-001', 'Forro Modular PVC', 'forro-modular-pvc', 'Praticidade e durabilidade', '🔲', 'cat-formod-001', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-forrovid-001', 'Forrovid', 'forrovid', 'Sistema inteligente e modular', '🎯', 'cat-formod-001', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-fmod-min-001', 'Forro Mineral', 'forro-mineral', 'Acústica e resistência ao fogo', '🔊', 'cat-formod-001', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-fmod-iso-001', 'Forro Modular Isopor', 'forro-modular-isopor', 'Leveza e isolamento térmico', '☁️', 'cat-formod-001', 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Isolamento Termoacústico
INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-termoac-001', 'Isolamento Termoacústico', 'termoacustica', 'Soluções completas em isolamento térmico e acústico', '🔇', NULL, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-la-rocha-001', 'Lã de Rocha', 'la-rocha', 'Máxima resistência ao fogo e isolamento superior', '🔥', 'cat-termoac-001', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-la-vidro-001', 'Lã de Vidro', 'la-vidro', 'Isolamento térmico e acústico de alta performance', '🌡️', 'cat-termoac-001', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-la-pet-001', 'Lã de PET', 'la-pet', 'Sustentável e eficiente', '♻️', 'cat-termoac-001', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-manta-001', 'Manta Térmica Aluminizada', 'manta-termica', 'Proteção contra calor radiante', '☀️', 'cat-termoac-001', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Kit Portas
INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-portas-001', 'Kit Portas', 'kit-portas', 'Kits completos de portas prontas para instalação', '🚪', NULL, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-porta-giro-001', 'Kit Porta de Giro', 'kit-porta-giro', 'Portas de abrir tradicionais', '🚪', 'cat-portas-001', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-porta-corr-001', 'Kit Porta de Correr', 'kit-porta-correr', 'Economia de espaço e praticidade', '↔️', 'cat-portas-001', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-porta-sanf-001', 'Portas Sanfonadas', 'portas-sanfonadas', 'Flexibilidade e design moderno', '🪗', 'cat-portas-001', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Rodapés
INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
VALUES ('cat-rodapes-001', 'Rodapés', 'rodapes', 'Acabamento perfeito para suas obras', '📏', NULL, 6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Produtos
INSERT INTO products (id, nome, slug, subtitulo, descricao_curta, descricao_completa, imagem_banner, categoria_id, status, destaque, ordem, caracteristicas, vantagens, aplicacoes, palavra_chave, meta_descricao, created_by_id, created_at, updated_at)
VALUES (
  'prod-div-naval-001',
  'Divisória Naval',
  'divisoria-naval',
  'Resistência extrema para ambientes agressivos',
  'Solução robusta e durável projetada para ambientes que exigem alta resistência à umidade, corrosão, impactos e condições extremas.',
  'A Divisória Naval, também conhecida como divisória metálica, é uma solução robusta e durável projetada especialmente para ambientes que exigem alta resistência à umidade, corrosão, impactos e condições extremas.

Fabricada em chapas de aço galvanizado ou alumínio com tratamento anticorrosivo e pintura eletrostática de alta durabilidade, a divisória naval oferece resistência incomparável, facilidade de limpeza e manutenção mínima.',
  'https://painel-planac.codiehost.com.br/uploads/133471455167197486.jpg',
  'cat-div-naval-001',
  'PUBLICADO',
  1,
  1,
  '100% Impermeável - Não apodrece, não embolora, não deforma
Alta Resistência Mecânica - Suporta impactos e uso intenso
Anticorrosiva - Tratamento especial contra ferrugem
Antivandalismo - Dificulta pichações e depredações
Higiênica - Superfície lisa facilita limpeza profunda
Durabilidade Extrema - Vida útil superior a 20 anos
Baixa Manutenção - Resistente a produtos de limpeza pesados',
  'Imunidade à Umidade - Não deforma com água ou vapor
Resistência Química - Suporta produtos de limpeza pesados
Facilidade de Limpeza - Superfície lisa não absorve sujeira
Higiene Superior - Não prolifera bactérias ou fungos
Resistência ao Fogo - Material não combustível
Longevidade - Décadas sem necessidade de troca',
  'Banheiros Públicos - Shoppings, aeroportos, rodoviárias
Industrial - Fábricas, plantas químicas
Vestiários - Academias, clubes, escolas
Hospitalar - Hospitais, clínicas, laboratórios
Áreas de Lavagem - Lava-rápidos, pet shops
Frigoríficos - Câmaras frias, açougues',
  'divisória naval, divisória metálica, divisória banheiro, divisória sanitária, aço galvanizado',
  'Divisória Naval em aço galvanizado e alumínio. 100% impermeável, antivandalismo, ideal para banheiros públicos e ambientes agressivos.',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO products (id, nome, slug, subtitulo, descricao_curta, descricao_completa, imagem_banner, categoria_id, status, destaque, ordem, caracteristicas, vantagens, aplicacoes, palavra_chave, meta_descricao, created_by_id, created_at, updated_at)
VALUES (
  'prod-div-gesso-001',
  'Divisória de Gesso Acartonado',
  'divisoria-gesso-acartonado',
  'Drywall - Versatilidade e rapidez na construção',
  'Sistema construtivo moderno com placas de gesso revestidas, oferecendo instalação até 5x mais rápida que alvenaria tradicional.',
  'A Divisória de Gesso Acartonado, popularmente conhecida como Drywall, revolucionou a construção civil moderna. Este sistema consiste em placas de gesso revestidas com cartão, fixadas em estrutura metálica de aço galvanizado.

Amplamente utilizado em obras residenciais, comerciais e corporativas, o drywall oferece vantagens significativas: instalação até 5x mais rápida, obra limpa com mínimo desperdício, flexibilidade para reformas futuras e excelente acabamento.',
  'https://painel-planac.codiehost.com.br/uploads/133471436401074071.jpg',
  'cat-div-gesso-001',
  'PUBLICADO',
  1,
  2,
  'Instalação Rápida - Até 5x mais rápido que alvenaria
Obra Limpa - Mínimo desperdício e sujeira
Leveza - Até 7x mais leve que alvenaria
Acabamento Perfeito - Superfície lisa pronta para pintura
Flexibilidade - Facilita alterações futuras
Isolamento Acústico - Com lã mineral no interior',
  'Velocidade - Instalação em dias, não semanas
Limpeza - Obra organizada com mínimo entulho
Precisão - Divisórias perfeitamente retas e niveladas
Isolamento - Possibilidade de lã mineral entre placas
Passagem de Instalações - Fios e canos embutidos facilmente
Reformas - Fácil abertura e fechamento',
  'Divisórias - Separação de ambientes
Forros - Rebaixos de teto
Revestimentos - Cobrindo paredes existentes
Residencial - Casas e apartamentos
Comercial - Lojas, escritórios, clínicas
Corporativo - Salas de reunião',
  'drywall, gesso acartonado, divisória gesso, parede drywall, forro drywall',
  'Drywall para divisórias e forros. Instalação 5x mais rápida, obra limpa e acabamento perfeito. Ideal para residencial e comercial.',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO products (id, nome, slug, subtitulo, descricao_curta, descricao_completa, imagem_banner, categoria_id, status, destaque, ordem, caracteristicas, vantagens, aplicacoes, especificacoes_tecnicas, palavra_chave, meta_descricao, created_by_id, created_at, updated_at)
VALUES (
  'prod-la-rocha-001',
  'Lã de Rocha',
  'la-rocha',
  'Máxima resistência ao fogo e isolamento superior',
  'Material isolante termoacústico premium incombustível, suportando até 750°C sem perder propriedades.',
  'A Lã de Rocha é um material isolante termoacústico premium fabricado a partir de rochas basálticas fundidas a temperaturas superiores a 1500°C. Reconhecida mundialmente como a solução mais segura para proteção passiva contra incêndio.

Utilizada em projetos que exigem os mais altos padrões de segurança: indústrias petroquímicas, siderúrgicas, edifícios corporativos de alto padrão, hospitais e shopping centers.',
  'https://painel-planac.codiehost.com.br/uploads/133471460691698903.jpg',
  'cat-la-rocha-001',
  'PUBLICADO',
  1,
  1,
  'Incombustível - Não propaga chamas, Classe A1
Resistência Térmica Extrema - Suporta até 750°C
Excelente Isolamento Térmico - Condutividade 0,035 a 0,040 W/mK
Absorção Acústica Superior - NRC até 1,00
Não Higroscópica - Repele água e umidade
Estabilidade Dimensional - Não deforma com temperatura',
  'Proteção Passiva Contra Incêndio - Ganha tempo para evacuação
Não Emite Gases Tóxicos - Segurança em caso de fogo
Economia de Energia - Reduz custos operacionais até 45%
Conforto Térmico Extremo - Eficaz em temperaturas extremas
Isolamento Acústico Premium - Excelente para ambientes críticos
Não Apodrece - Imune a fungos e roedores',
  'Proteção Passiva - Estruturas metálicas, rotas de fuga
Industrial - Fornos, caldeiras, tubulações
Petroquímica - Refinarias, plataformas offshore
Hospitalar - Centros cirúrgicos, áreas críticas
Comercial - Shopping centers, edifícios corporativos
Acústica - Estúdios profissionais, teatros',
  'NBR 11359 - Lã mineral para isolamento térmico
NBR 15220 - Desempenho térmico de edificações
ASTM C612 - Lã mineral
EN 13501-1 - Classificação ao fogo (Euroclasse A1)
ISO 9001 - Gestão da qualidade',
  'lã de rocha, isolamento térmico, isolamento acústico, proteção contra fogo, isolante incombustível',
  'Lã de Rocha incombustível para isolamento termoacústico. Suporta 750°C, classe A1, ideal para proteção passiva contra incêndio.',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
