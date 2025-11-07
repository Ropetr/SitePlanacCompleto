-- ===========================================
-- SCRIPT DE POPULAÇÃO COMPLETA DO BANCO DE DADOS
-- ===========================================
-- Gerado automaticamente em 2025-11-07T17:06:47.779Z
-- Total de menus: 9
-- Total de páginas: 19
-- ===========================================

-- ===========================================
-- 1. CRIAR MENUS
-- ===========================================

-- Menu: Divisórias
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-divisorias',
  'Divisórias',
  'divisorias',
  'Produtos de Divisórias',
  '',
  NULL,
  1,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Drywall
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-drywall',
  'Drywall',
  'drywall',
  'Produtos de Drywall',
  '',
  NULL,
  2,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Forros de Gesso
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-forros-gesso',
  'Forros de Gesso',
  'forros-gesso',
  'Produtos de Forros de Gesso',
  '',
  NULL,
  3,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Forros de PVC
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-forros-pvc',
  'Forros de PVC',
  'forros-pvc',
  'Produtos de Forros de PVC',
  '',
  NULL,
  4,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Forros Vinílicos
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-forros-vinilico',
  'Forros Vinílicos',
  'forros-vinilico',
  'Produtos de Forros Vinílicos',
  '',
  NULL,
  5,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Forros Modulares
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-forros-modulares',
  'Forros Modulares',
  'forros-modulares',
  'Produtos de Forros Modulares',
  '',
  NULL,
  6,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Isolamento Termoacústico
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-termoacustica',
  'Isolamento Termoacústico',
  'termoacustica',
  'Produtos de Isolamento Termoacústico',
  '',
  NULL,
  7,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Kits de Portas
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-kit-portas',
  'Kits de Portas',
  'kit-portas',
  'Produtos de Kits de Portas',
  '',
  NULL,
  8,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Menu: Rodapés
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  'menu-rodapes',
  'Rodapés',
  'rodapes',
  'Produtos de Rodapés',
  '',
  NULL,
  9,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ===========================================
-- 2. CRIAR PÁGINAS
-- ===========================================

-- Divisória Naval
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-001',
  'Divisória Naval',
  'divisoria-naval-page',
  '',
  'A Divisória Naval, também conhecida como divisória metálica, é uma solução robusta e durável projetada especialmente para ambientes que exigem alta resistência à umidade, corrosão, impactos e condições extremas. Originalmente desenvolvida para uso em embarcações, esta tecnologia se expandiu para aplicações industriais, banheiros públicos, vestiários, áreas de lavagem e outros locais hostis.',
  'A Divisória Naval, também conhecida como divisória metálica, é uma solução robusta e durável projetada especialmente para ambientes que exigem alta resistência à umidade, corrosão, impactos e condições extremas. Originalmente desenvolvida para uso em embarcações, esta tecnologia se expandiu para aplicações industriais, banheiros públicos, vestiários, áreas de lavagem e outros locais hostis.

Fabricada em chapas de aço galvanizado ou alumínio com tratamento anticorrosivo e pintura eletrostática de alta durabilidade, a divisória naval oferece resistência incomparável, facilidade de limpeza e manutenção mínima. É a escolha ideal para projetos que não podem aceitar deterioração, desgaste ou necessidade frequente de substituição.

A divisória naval é praticamente indestrutível! Resiste a umidade extrema, impactos, produtos químicos e vandalismo. Higiênica, não absorve odores, não prolifera fungos ou bactérias. Perfeita para ambientes com grande circulação e áreas úmidas!',
  '["Início","›","Divisórias","›","Divisória Naval"]',
  '[]',
  '["Banheiros Públicos: Shoppings, aeroportos, rodoviárias, terminais","Industrial: Fábricas, plantas químicas, indústrias alimentícias","Vestiários: Academias, clubes, escolas, empresas","Hospitalar: Hospitais, clínicas, laboratórios","Áreas de Lavagem: Lava-rápidos, pet shops, lavanderias","Frigoríficos: Câmaras frias, açougues, peixarias","Portuário: Portos, terminais marítimos","Penitenciário: Presídios e centros de detenção","Marítimo: Embarcações, plataformas offshore"]',
  'Medidas padrão e customizáveis:
Altura dos Painéis: 1,80m a 2,50m (padrão 2,00m)
                        Largura de Box: 0,90m a 1,20m (padrão 1,00m)
                        Espessura das Chapas: 0,60mm a 1,00mm
                        Suspensão: 15cm a 20cm do piso
                        Vão Inferior: 20cm a 30cm (facilita limpeza)',
  '["NBR 15930 - Divisórias sanitárias moduladas","NBR 9050 - Acessibilidade","ABNT - Especificações técnicas","Certificação ISO 9001 dos fabricantes"]',
  '',
  '[]',
  NULL,
  'Divisória Naval - Planac Distribuidora',
  'A Divisória Naval, também conhecida como divisória metálica, é uma solução robusta e durável projetada especialmente para ambientes que exigem alta resistência à umidade, corrosão, impactos e condições extremas. Originalmente desenvolvida para uso em embarcações, esta tecnologia se expandiu para aplicações industriais, banheiros públicos, vestiários, áreas de lavagem e outros locais hostis.',
  'Divisória Naval, Divisória Naval, Divisórias',
  1,
  0,
  'PUBLICADO',
  'menu-divisorias',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Divisória de Gesso Acartonado
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-002',
  'Divisória de Gesso Acartonado',
  'drywall-divisoria-page',
  '',
  'A Divisória de Gesso Acartonado, popularmente conhecida como Drywall, revolucionou a construção civil moderna. Este sistema construtivo consiste em placas de gesso revestidas com cartão, fixadas em uma estrutura metálica de aço galvanizado, formando paredes, divisórias e revestimentos com qualidade, rapidez e versatilidade incomparáveis.',
  'A Divisória de Gesso Acartonado, popularmente conhecida como Drywall, revolucionou a construção civil moderna. Este sistema construtivo consiste em placas de gesso revestidas com cartão, fixadas em uma estrutura metálica de aço galvanizado, formando paredes, divisórias e revestimentos com qualidade, rapidez e versatilidade incomparáveis.

Amplamente utilizado em obras residenciais, comerciais e corporativas, o drywall oferece vantagens significativas sobre a alvenaria tradicional: instalação até 5x mais rápida, obra limpa com mínimo desperdício, flexibilidade para reformas futuras, excelente acabamento e possibilidade de passar instalações elétricas e hidráulicas internamente. É a tecnologia preferida por arquitetos e engenheiros modernos.

O drywall revoluciona prazos de obra! Enquanto uma parede de alvenaria leva semanas (quebra, tijolo, reboco, massa, pintura), o drywall fica pronto em dias. Obra limpa, sem entulho, sem sujeira e pronta para pintar imediatamente!',
  '["Início","›","Divisórias","›","Divisória de Gesso Acartonado"]',
  '[]',
  '["Divisórias: Separação de ambientes","Forros: Rebaixos de teto","Revestimentos: Cobrindo paredes existentes","Sancas: Iluminação indireta","Nichos: Decorativos ou funcionais","Móveis: Estantes, cabeceiras, painéis de TV","Residencial: Casas e apartamentos","Comercial: Lojas, escritórios, clínicas","Corporativo: Salas de reunião, open spaces"]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Divisória de Gesso Acartonado - Planac Distribuidora',
  'A Divisória de Gesso Acartonado, popularmente conhecida como Drywall, revolucionou a construção civil moderna. Este sistema construtivo consiste em placas de gesso revestidas com cartão, fixadas em uma estrutura metálica de aço galvanizado, formando paredes, divisórias e revestimentos com qualidade, rapidez e versatilidade incomparáveis.',
  'Divisória de Gesso Acartonado, Drywall - Divisória, Drywall',
  1,
  0,
  'PUBLICADO',
  'menu-drywall',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Forro Vinílico REVID
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-003',
  'Forro Vinílico REVID',
  'forro-vinilico-revid',
  '',
  '',
  '',
  '["Residências - Salas de estar e jantar","Dormitórios e suítes","Cozinhas e áreas gourmet","Banheiros e lavabos","Varandas e áreas externas cobertas","Comércio - Lojas e showrooms","Escritórios e consultórios","Restaurantes e bares","Hotéis e pousadas","Indústrias e galpões","Escolas e instituições","Áreas com infiltração"]',
  '[]',
  '[]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Forro Vinílico REVID - Planac Distribuidora',
  'Forro Vinílico REVID de alta qualidade. Entre em contato para orçamento.',
  'Forro Vinílico REVID, Forro Vinílico REVID, Forros Vinílicos',
  1,
  0,
  'PUBLICADO',
  'menu-forros-vinilico',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Forrovid
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-004',
  'Forrovid',
  'forrovid-page',
  '',
  'O Forrovid é uma solução inovadora e sustentável que combina isolamento térmico, acústico e acabamento estético em um único sistema. Composto por painéis sanduíche com núcleo de lã de vidro ou poliestireno expandido (EPS), revestido por placas de PVC ou similar, este forro oferece performance superior em conforto ambiental com instalação rápida e limpa.',
  'O Forrovid é uma solução inovadora e sustentável que combina isolamento térmico, acústico e acabamento estético em um único sistema. Composto por painéis sanduíche com núcleo de lã de vidro ou poliestireno expandido (EPS), revestido por placas de PVC ou similar, este forro oferece performance superior em conforto ambiental com instalação rápida e limpa.

Ideal para galpões industriais, lojas, supermercados, ginásios esportivos e áreas comerciais de grande porte, o Forrovid se destaca por sua eficiência térmica e acústica, durabilidade, facilidade de manutenção e excelente relação custo-benefício. É a escolha inteligente para quem busca conforto térmico sem abrir mão da qualidade e da economia.

O sistema sanduíche do Forrovid proporciona isolamento térmico até 40% superior aos forros convencionais! Reduza drasticamente o calor interno e economize até 35% em custos com climatização. Conforto + Economia = Forrovid!',
  '["Início","›","Forros","›","Forrovid"]',
  '[]',
  '["Industrial: Galpões, fábricas, armazéns, centros de distribuição","Comercial: Supermercados, lojas, shopping centers","Varejo: Grandes superfícies comerciais","Esportivo: Ginásios, quadras, academias","Eventos: Pavilhões, centros de convenções","Agroindustrial: Frigoríficos, agroindústrias","Logística: Centros de distribuição, cross-docking","Automotivo: Concessionárias, oficinas"]',
  'Características técnicas do Forrovid:
Largura dos Painéis: 60cm a 120cm
                        Comprimento: Sob medida (até 12 metros)
                        Espessura: 30mm, 50mm, 75mm, 100mm
                        Peso: 3 a 8 kg/m² (conforme composição)
                        Condutividade Térmica: 0,030 a 0,045 W/mK
                        Absorção Acústica: NRC 0,60 a 0,85
                        Resistência ao Fogo: Classe B ou superior
                        Refletância Solar: Até 80% (faces claras)',
  '[]',
  '',
  '[]',
  NULL,
  'Forrovid - Planac Distribuidora',
  'O Forrovid é uma solução inovadora e sustentável que combina isolamento térmico, acústico e acabamento estético em um único sistema. Composto por painéis sanduíche com núcleo de lã de vidro ou poliestireno expandido (EPS), revestido por placas de PVC ou similar, este forro oferece performance superior em conforto ambiental com instalação rápida e limpa.',
  'Forrovid, Forrovid, Forros Modulares',
  3,
  0,
  'PUBLICADO',
  'menu-forros-modulares',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Forro de Isopor
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-005',
  'Forro de Isopor',
  'isopor-page',
  '',
  'O Forro de Isopor (EPS - Poliestireno Expandido) é uma das opções mais econômicas e eficientes para acabamento de tetos. Conhecido por sua leveza extrema e excelente capacidade de isolamento térmico, este tipo de forro tem se tornado cada vez mais popular em construções residenciais e comerciais que buscam conforto térmico com preço acessível.',
  'O Forro de Isopor (EPS - Poliestireno Expandido) é uma das opções mais econômicas e eficientes para acabamento de tetos. Conhecido por sua leveza extrema e excelente capacidade de isolamento térmico, este tipo de forro tem se tornado cada vez mais popular em construções residenciais e comerciais que buscam conforto térmico com preço acessível.

Fabricado em placas de poliestireno expandido, o forro de isopor oferece uma solução prática e rápida para instalação. Além de reduzir significativamente a temperatura interna dos ambientes, também proporciona isolamento acústico moderado e não sobrecarrega a estrutura devido ao seu peso extremamente baixo.

O isopor pode reduzir até 30% a temperatura interna dos ambientes! Perfeito para regiões quentes e para economizar energia com ar-condicionado. Invista pouco, ganhe muito conforto!',
  '["Início","›","Forros","›","Forro de Isopor"]',
  '[]',
  '["Residencial: Casas populares, sobrados, apartamentos","Comercial: Lojas, escritórios, consultórios","Industrial: Galpões, fábricas, depósitos","Rural: Casas de campo, estufas, aviários","Institucional: Escolas, igrejas, creches","Áreas Secas: Quartos, salas, corredores"]',
  'Nosso forro de isopor possui qualidade garantida:
Material: EPS (Poliestireno Expandido)
                        Densidade: 10 a 20 kg/m³
                        Condutividade Térmica: Baixíssima (0,035 W/mK)
                        Absorção de Água: Inferior a 3%
                        Resistência à Compressão: Adequada para forros
                        Classificação de Fogo: Auto-extinguível
                        Vida Útil: Superior a 50 anos',
  '[]',
  '',
  '[]',
  NULL,
  'Forro de Isopor - Planac Distribuidora',
  'O Forro de Isopor (EPS - Poliestireno Expandido) é uma das opções mais econômicas e eficientes para acabamento de tetos. Conhecido por sua leveza extrema e excelente capacidade de isolamento térmico, este tipo de forro tem se tornado cada vez mais popular em construções residenciais e comerciais que buscam conforto térmico com preço acessível.',
  'Forro de Isopor, Isopor, Forros Modulares',
  5,
  0,
  'PUBLICADO',
  'menu-forros-modulares',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Kit Porta de Correr
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-006',
  'Kit Porta de Correr',
  'kit-porta-correr',
  '',
  'O Kit Porta de Correr é a solução ideal para ambientes que necessitam otimização de espaço, combinando funcionalidade, design moderno e praticidade. Este sistema de abertura deslizante não requer espaço para abertura da porta, sendo perfeito para ambientes compactos ou layouts que exigem melhor aproveitamento de área.',
  'O Kit Porta de Correr é a solução ideal para ambientes que necessitam otimização de espaço, combinando funcionalidade, design moderno e praticidade. Este sistema de abertura deslizante não requer espaço para abertura da porta, sendo perfeito para ambientes compactos ou layouts que exigem melhor aproveitamento de área.

Composto por trilho, folha de porta, roldanas de alta qualidade e todos os acessórios necessários, o kit porta de correr oferece instalação simplificada e movimentação suave e silenciosa. É uma opção versátil que une economia de espaço com estética contemporânea.

Sistema deslizante que não ocupa espaço de abertura! Ideal para ambientes compactos e layouts modernos - ganhe até 2m² por cômodo!',
  '["Início","›","Portas","›","Kit Porta de Correr"]',
  '[]',
  '[]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Kit Porta de Correr - Planac Distribuidora',
  'O Kit Porta de Correr é a solução ideal para ambientes que necessitam otimização de espaço, combinando funcionalidade, design moderno e praticidade. Este sistema de abertura deslizante não requer espaço para abertura da porta, sendo perfeito para ambientes compactos ou layouts que exigem melhor aproveitamento de área.',
  'Kit Porta de Correr, Kit Porta de Correr, Kits de Portas',
  2,
  0,
  'PUBLICADO',
  'menu-kit-portas',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Kit Porta
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-007',
  'Kit Porta',
  'kit-porta',
  '',
  'O Kit Porta é uma solução completa e prática para instalação de portas internas, reunindo todos os componentes necessários em um único produto. Este sistema otimiza o processo de instalação, economiza tempo e garante acabamento profissional, sendo ideal tanto para construções novas quanto para reformas.',
  'O Kit Porta é uma solução completa e prática para instalação de portas internas, reunindo todos os componentes necessários em um único produto. Este sistema otimiza o processo de instalação, economiza tempo e garante acabamento profissional, sendo ideal tanto para construções novas quanto para reformas.

Composto por folha de porta, marco (batente), guarnições, dobradiças e fechadura, o kit porta oferece a praticidade de ter todos os elementos perfeitamente compatíveis e dimensionados, eliminando a necessidade de comprar cada item separadamente e garantindo que tudo se encaixe perfeitamente.

Tudo que você precisa em um único kit! Porta, marco, guarnições, dobradiças e fechadura - instalação rápida e acabamento perfeito garantido.',
  '["Início","›","Portas","›","Kit Porta"]',
  '[]',
  '[]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Kit Porta - Planac Distribuidora',
  'O Kit Porta é uma solução completa e prática para instalação de portas internas, reunindo todos os componentes necessários em um único produto. Este sistema otimiza o processo de instalação, economiza tempo e garante acabamento profissional, sendo ideal tanto para construções novas quanto para reformas.',
  'Kit Porta, Kit Porta Pronta, Kits de Portas',
  1,
  0,
  'PUBLICADO',
  'menu-kit-portas',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Lã de Pet
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-008',
  'Lã de Pet',
  'la-pet-page',
  '',
  'A Lã de Pet, também conhecida como lã de poliéster ou fibra PET reciclada, é um material isolante termoacústico inovador e 100% sustentável, fabricado a partir da reciclagem de garrafas PET pós-consumo. Cada metro quadrado de lã de PET remove aproximadamente 50 garrafas plásticas do meio ambiente, transformando resíduo em solução de alto desempenho para isolamento.',
  'A Lã de Pet, também conhecida como lã de poliéster ou fibra PET reciclada, é um material isolante termoacústico inovador e 100% sustentável, fabricado a partir da reciclagem de garrafas PET pós-consumo. Cada metro quadrado de lã de PET remove aproximadamente 50 garrafas plásticas do meio ambiente, transformando resíduo em solução de alto desempenho para isolamento.

Indicada para projetos que buscam certificações ambientais (LEED, AQUA, Procel Edifica), a lã de PET oferece desempenho termoacústico comparável às lãs minerais, com vantagens adicionais: não causa irritação na pele durante manuseio, não libera partículas no ar, é atóxica, hipoalergênica e possui excelente durabilidade. É a escolha consciente para construções sustentáveis sem comprometer performance.

Cada m² de lã de PET retira 50 garrafas do meio ambiente! Material ecológico que oferece o mesmo desempenho termoacústico das lãs tradicionais, mas sem irritar a pele, sem liberar partículas e totalmente reciclável. Sustentabilidade com performance!',
  '["Início","›","Termoacústica","›","Lã de Pet"]',
  '[]',
  '["Residencial: Forros, paredes, coberturas, entre-lajes","Comercial: Escritórios, lojas, hotéis","Educacional: Escolas, creches, universidades","Hospitalar: Clínicas, consultórios (hipoalergênico)","Acústica: Estúdios, home theaters, salas de música","Industrial: Áreas administrativas, refeitórios","Construção Sustentável: Projetos com certificação ambiental"]',
  '',
  '["NBR 15220 - Desempenho térmico","NBR 15575 - Desempenho de edificações","LEED - Créditos em materiais reciclados","AQUA - Alta qualidade ambiental","Procel Edifica - Eficiência energética","FSC/Cradle to Cradle - Sustentabilidade"]',
  '',
  '[]',
  NULL,
  'Lã de Pet - Planac Distribuidora',
  'A Lã de Pet, também conhecida como lã de poliéster ou fibra PET reciclada, é um material isolante termoacústico inovador e 100% sustentável, fabricado a partir da reciclagem de garrafas PET pós-consumo. Cada metro quadrado de lã de PET remove aproximadamente 50 garrafas plásticas do meio ambiente, transformando resíduo em solução de alto desempenho para isolamento.',
  'Lã de Pet, Lã PET, Isolamento Termoacústico',
  3,
  0,
  'PUBLICADO',
  'menu-termoacustica',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Lã de Rocha
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-009',
  'Lã de Rocha',
  'la-rocha-page',
  '',
  'A Lã de Rocha é um material isolante termoacústico premium fabricado a partir de rochas basálticas fundidas a temperaturas superiores a 1500°C e transformadas em fibras através de processos de alta tecnologia. Reconhecida mundialmente como a solução mais segura e eficiente para proteção passiva contra incêndio, a lã de rocha oferece isolamento térmico excepcional, absorção acústica superior e resistência ao fogo incomparável.',
  'A Lã de Rocha é um material isolante termoacústico premium fabricado a partir de rochas basálticas fundidas a temperaturas superiores a 1500°C e transformadas em fibras através de processos de alta tecnologia. Reconhecida mundialmente como a solução mais segura e eficiente para proteção passiva contra incêndio, a lã de rocha oferece isolamento térmico excepcional, absorção acústica superior e resistência ao fogo incomparável.

Utilizada em projetos que exigem os mais altos padrões de segurança e desempenho, a lã de rocha é especificada em indústrias petroquímicas, siderúrgicas, edifícios corporativos de alto padrão, hospitais, shopping centers e aplicações críticas onde a proteção contra incêndio é fundamental. Sua composição inorgânica garante que o material não propague chamas e suporte temperaturas de até 750°C sem perder suas propriedades.

A lã de rocha suporta até 750°C sem derreter ou propagar chamas! Em caso de incêndio, ela protege estruturas por horas, permitindo evacuação segura e reduzindo danos. Classificação Euroclasse A1 - totalmente incombustível. Segurança sem concessões!',
  '["Início","›","Termoacústica","›","Lã de Rocha"]',
  '[]',
  '["32 a 48 kg/m³: Forros acústicos e isolamento residencial","60 a 80 kg/m³: Paredes e divisórias","96 a 128 kg/m³: Proteção passiva e industrial","150 a 200 kg/m³: Alta performance e ambientes extremos","Proteção Passiva: Estruturas metálicas, rotas de fuga, compartimentação","Industrial: Fornos, caldeiras, fornalhas, tubulações de alta temperatura","Petroquímica: Refinarias, plataformas offshore","Siderúrgica: Altos-fornos, fornos elétricos","Naval: Embarcações, compartimentos de máquinas","Hospitalar: Centros cirúrgicos, áreas críticas","Comercial: Shopping centers, edifícios corporativos","Acústica: Estúdios profissionais, salas de cinema, teatros","HVAC: Dutos, equipamentos de climatização"]',
  '',
  '["NBR 11359 - Lã mineral para isolamento térmico","NBR 15220 - Desempenho térmico de edificações","NBR 15575 - Edificações habitacionais - Desempenho","ASTM C612 - Lã mineral","EN 13501-1 - Classificação ao fogo (Euroclasse A1)","ISO 9001 - Gestão da qualidade","ISO 14001 - Gestão ambiental"]',
  '',
  '[]',
  NULL,
  'Lã de Rocha - Planac Distribuidora',
  'A Lã de Rocha é um material isolante termoacústico premium fabricado a partir de rochas basálticas fundidas a temperaturas superiores a 1500°C e transformadas em fibras através de processos de alta tecnologia. Reconhecida mundialmente como a solução mais segura e eficiente para proteção passiva contra incêndio, a lã de rocha oferece isolamento térmico excepcional, absorção acústica superior e resistência ao fogo incomparável.',
  'Lã de Rocha, Lã de Rocha, Isolamento Termoacústico',
  1,
  0,
  'PUBLICADO',
  'menu-termoacustica',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Lã de Vidro
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-010',
  'Lã de Vidro',
  'la-vidro-page',
  '',
  'A Lã de Vidro é um material isolante termoacústico de altíssimo desempenho, fabricado a partir de fibras de vidro aglomeradas com resinas especiais. Considerada uma das soluções mais eficientes para isolamento térmico e acústico, a lã de vidro é amplamente utilizada na construção civil, indústria e refrigeração devido às suas excepcionais propriedades isolantes e versatilidade de aplicação.',
  'A Lã de Vidro é um material isolante termoacústico de altíssimo desempenho, fabricado a partir de fibras de vidro aglomeradas com resinas especiais. Considerada uma das soluções mais eficientes para isolamento térmico e acústico, a lã de vidro é amplamente utilizada na construção civil, indústria e refrigeração devido às suas excepcionais propriedades isolantes e versatilidade de aplicação.

Composta por milhões de filamentos de vidro entrelaçados que formam uma estrutura fibrosa e porosa, a lã de vidro cria inúmeras células de ar que dificultam a passagem de calor e som. Este material oferece excelente relação custo-benefício, é incombustível, não absorve umidade, não apodrece e possui vida útil superior a 50 anos.

A lã de vidro reduz até 95% da transmissão de ruídos e pode diminuir em até 70% a transferência de calor! Economize até 40% em energia com ar-condicionado e aquecimento. Conforto térmico e silêncio total em um único material!',
  '["Início","›","Termoacústica","›","Lã de Vidro"]',
  '[]',
  '["Residencial: Forros, paredes, coberturas, entre-lajes","Comercial: Escritórios, lojas, shoppings, hotéis","Industrial: Galpões, fábricas, câmaras frias","Acústica: Estúdios, cinemas, teatros, auditórios","HVAC: Dutos de ar-condicionado, tubulações","Automotiva: Isolamento de veículos","Naval: Embarcações e plataformas","Frigorífica: Câmaras frias e refrigeração"]',
  '',
  '["NBR 11356 - Lã de vidro para isolamento térmico","NBR 15220 - Desempenho térmico de edificações","NBR 15575 - Desempenho de edificações habitacionais","ASTM C665 - Lã mineral (fibra de vidro)","Euroclasse A1 - Incombustibilidade"]',
  '',
  '[]',
  NULL,
  'Lã de Vidro - Planac Distribuidora',
  'A Lã de Vidro é um material isolante termoacústico de altíssimo desempenho, fabricado a partir de fibras de vidro aglomeradas com resinas especiais. Considerada uma das soluções mais eficientes para isolamento térmico e acústico, a lã de vidro é amplamente utilizada na construção civil, indústria e refrigeração devido às suas excepcionais propriedades isolantes e versatilidade de aplicação.',
  'Lã de Vidro, Lã de Vidro, Isolamento Termoacústico',
  2,
  0,
  'PUBLICADO',
  'menu-termoacustica',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Manta Térmica Aluminizada
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-011',
  'Manta Térmica Aluminizada',
  'manta-termica',
  '',
  'A Manta Térmica Aluminizada é uma solução de alta eficiência para isolamento térmico, composta por múltiplas camadas que incluem alumínio reflexivo e material isolante. Esta tecnologia avançada reflete até 97% do calor radiante, sendo ideal para ambientes que necessitam de proteção contra altas temperaturas.',
  'A Manta Térmica Aluminizada é uma solução de alta eficiência para isolamento térmico, composta por múltiplas camadas que incluem alumínio reflexivo e material isolante. Esta tecnologia avançada reflete até 97% do calor radiante, sendo ideal para ambientes que necessitam de proteção contra altas temperaturas.

Utilizada principalmente em coberturas, a manta térmica aluminizada reduz significativamente a temperatura interna dos ambientes, proporcionando conforto térmico e economia de energia com ar-condicionado. É uma solução inteligente e sustentável para o controle climático de edificações.

Reflete até 97% do calor radiante! A manta térmica aluminizada é uma das soluções mais eficientes do mercado para proteção térmica.',
  '["Início","›","Termoacústica","›","Manta Térmica Aluminizada"]',
  '[]',
  '["Coberturas: Telhados metálicos, fibrocimento, telha cerâmica","Residencial: Casas, sobrados, edifícios","Comercial: Lojas, escritórios, shoppings","Industrial: Galpões, armazéns, fábricas","Rural: Aviários, granjas, estufas","Veículos: Containers, trailers, food trucks","Paredes: Isolamento térmico de fachadas"]',
  'Oferecemos diferentes tipos de manta térmica para atender diversas necessidades:
Manta Simples Face: Alumínio em uma face, para aplicações básicas
                        Manta Dupla Face: Alumínio nas duas faces, máxima eficiência
                        Manta com Bolhas: Camada adicional de ar para maior isolamento
                        Manta Reforçada: Com trama para maior resistência mecânica
                        Espessuras: 3mm, 4mm, 5mm, 8mm e 10mm
                        Larguras: 1m, 1,20m e 1,50m',
  '[]',
  '',
  '[]',
  NULL,
  'Manta Térmica Aluminizada - Planac Distribuidora',
  'A Manta Térmica Aluminizada é uma solução de alta eficiência para isolamento térmico, composta por múltiplas camadas que incluem alumínio reflexivo e material isolante. Esta tecnologia avançada reflete até 97% do calor radiante, sendo ideal para ambientes que necessitam de proteção contra altas temperaturas.',
  'Manta Térmica Aluminizada, Manta Térmica, Isolamento Termoacústico',
  4,
  0,
  'PUBLICADO',
  'menu-termoacustica',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Forro Mineral
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-012',
  'Forro Mineral',
  'mineral-page',
  '',
  'O Forro Mineral (também conhecido como forro acústico ou forro de fibra mineral) é a solução premium para ambientes que exigem excelente desempenho acústico, acabamento profissional e visual clean. Fabricado a partir de fibras minerais (lã de rocha ou fibra de vidro) combinadas com aglomerantes, este forro é referência em qualidade para projetos comerciais e corporativos.',
  'O Forro Mineral (também conhecido como forro acústico ou forro de fibra mineral) é a solução premium para ambientes que exigem excelente desempenho acústico, acabamento profissional e visual clean. Fabricado a partir de fibras minerais (lã de rocha ou fibra de vidro) combinadas com aglomerantes, este forro é referência em qualidade para projetos comerciais e corporativos.

Amplamente utilizado em escritórios, hospitais, escolas, teatros, estúdios e ambientes corporativos, o forro mineral oferece absorção acústica superior, resistência ao fogo, durabilidade excepcional e manutenção facilitada pelo sistema modular de placas removíveis. É a escolha de arquitetos e engenheiros para projetos que não abrem mão de qualidade.

Com coeficiente de absorção sonora de até 0,95 (NRC), o forro mineral elimina reverberações, ecos e ruídos indesejados. Ideal para ambientes que exigem concentração, privacidade e conforto acústico!',
  '["Início","›","Forros","›","Forro Mineral"]',
  '[]',
  '["Corporativo: Escritórios, salas de reunião, call centers, coworkings","Hospitalar: Hospitais, clínicas, laboratórios, centros cirúrgicos","Educacional: Escolas, universidades, bibliotecas, auditórios","Comercial: Shoppings, lojas, supermercados, bancos","Cultural: Teatros, cinemas, estúdios, salas de concerto","Industrial: Áreas administrativas de indústrias","Hotelaria: Hotéis, pousadas, resorts","Aeroportos: Terminais e áreas de embarque"]',
  'Nossos forros minerais atendem os mais altos padrões de qualidade:
Dimensões Padrão: 625x625mm, 600x600mm, 1250x625mm
                        Espessura: 12mm, 15mm, 18mm, 20mm
                        Densidade: 180 a 400 kg/m³
                        NRC (Absorção): 0,50 a 0,95
                        Classificação de Fogo: A1 ou A2 (incombustível)
                        Refletância de Luz: Até 86%
                        Umidade Relativa: Até 70% (ou 95% versão RH)
                        Certificações: ISO 9001, ISO 14001, Inmetro',
  '[]',
  '',
  '[]',
  NULL,
  'Forro Mineral - Planac Distribuidora',
  'O Forro Mineral (também conhecido como forro acústico ou forro de fibra mineral) é a solução premium para ambientes que exigem excelente desempenho acústico, acabamento profissional e visual clean. Fabricado a partir de fibras minerais (lã de rocha ou fibra de vidro) combinadas com aglomerantes, este forro é referência em qualidade para projetos comerciais e corporativos.',
  'Forro Mineral, Mineral, Forros Modulares',
  4,
  0,
  'PUBLICADO',
  'menu-forros-modulares',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Forro de Gesso Acartonado
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-013',
  'Forro de Gesso Acartonado',
  'planac-forro-gesso-completo',
  '',
  'O forro de gesso acartonado, popularmente conhecido como Drywall, é uma solução moderna, versátil e extremamente eficiente para acabamento de tetos. Composto por placas de gesso revestidas com papel cartão especial, este sistema revolucionou o mercado da construção civil por sua praticidade, acabamento impecável e excelente custo-benefício.',
  'O forro de gesso acartonado, popularmente conhecido como Drywall, é uma solução moderna, versátil e extremamente eficiente para acabamento de tetos. Composto por placas de gesso revestidas com papel cartão especial, este sistema revolucionou o mercado da construção civil por sua praticidade, acabamento impecável e excelente custo-benefício.

O sistema Drywall permite criar ambientes sofisticados com acabamento liso e perfeito, além de possibilitar a instalação de iluminação embutida, sancas, rebaixos e diversos outros recursos decorativos. É amplamente utilizado em residências, escritórios, lojas, consultórios e estabelecimentos comerciais.

É a opção mais moderna e utilizada no mercado! Oferece instalação rápida, limpa, acabamento superior e permite personalizações incríveis. Ideal para quem busca qualidade e praticidade.',
  '["Início","›","Forros","›","Forro de Gesso Acartonado"]',
  '[]',
  '["Residencial: Salas, quartos, cozinhas, banheiros, varandas","Comercial: Lojas, escritórios, consultórios, clínicas","Corporativo: Empresas, salas de reunião, recepções","Hospitalar: Hospitais, laboratórios, centros médicos","Educacional: Escolas, universidades, bibliotecas","Hotelaria: Hotéis, pousadas, resorts"]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Forro de Gesso Acartonado - Planac Distribuidora',
  'O forro de gesso acartonado, popularmente conhecido como Drywall, é uma solução moderna, versátil e extremamente eficiente para acabamento de tetos. Composto por placas de gesso revestidas com papel cartão especial, este sistema revolucionou o mercado da construção civil por sua praticidade, acabamento impecável e excelente custo-benefício.',
  'Forro de Gesso Acartonado, Forro de Gesso Acartonado, Forros de Gesso',
  1,
  0,
  'PUBLICADO',
  'menu-forros-gesso',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Gesso Modular
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-014',
  'Gesso Modular',
  'planac-gesso-modular',
  '',
  'O Gesso Modular é uma solução sofisticada e prática para forros, composta por placas pré-fabricadas que se encaixam em uma estrutura metálica suspensa. Este sistema combina o acabamento refinado do gesso com a praticidade de instalação modular, oferecendo um resultado estético impecável e funcional.',
  'O Gesso Modular é uma solução sofisticada e prática para forros, composta por placas pré-fabricadas que se encaixam em uma estrutura metálica suspensa. Este sistema combina o acabamento refinado do gesso com a praticidade de instalação modular, oferecendo um resultado estético impecável e funcional.

Muito utilizado em ambientes comerciais, corporativos e residenciais de alto padrão, o forro de gesso modular proporciona um visual clean e moderno, além de permitir fácil acesso às instalações hidráulicas e elétricas através da remoção pontual das placas.

Sistema inteligente que une beleza, praticidade e funcionalidade. Ideal para quem busca elegância com facilidade de manutenção!',
  '["Início","›","Forros","›","Gesso Modular"]',
  '[]',
  '["Comercial: Lojas, shoppings, supermercados","Corporativo: Escritórios, salas de reunião, recepções","Hospitalar: Clínicas, hospitais, consultórios","Educacional: Escolas, faculdades, laboratórios","Residencial: Casas e apartamentos de alto padrão","Industrial: Áreas administrativas de indústrias","Institucional: Órgãos públicos, bancos, instituições"]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Gesso Modular - Planac Distribuidora',
  'O Gesso Modular é uma solução sofisticada e prática para forros, composta por placas pré-fabricadas que se encaixam em uma estrutura metálica suspensa. Este sistema combina o acabamento refinado do gesso com a praticidade de instalação modular, oferecendo um resultado estético impecável e funcional.',
  'Gesso Modular, Gesso Modular, Forros Modulares',
  1,
  0,
  'PUBLICADO',
  'menu-forros-modulares',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Portas Sanfonadas
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-015',
  'Portas Sanfonadas',
  'portas-sanfonadas',
  '',
  'As Portas Sanfonadas são a solução mais econômica e prática para fechamento de vãos, caracterizadas por seu sistema de abertura em sanfona que permite máxima economia de espaço. Ideais para ambientes que necessitam praticidade e versatilidade, as portas sanfonadas são fabricadas em PVC de alta qualidade, oferecendo durabilidade e fácil manutenção.',
  'As Portas Sanfonadas são a solução mais econômica e prática para fechamento de vãos, caracterizadas por seu sistema de abertura em sanfona que permite máxima economia de espaço. Ideais para ambientes que necessitam praticidade e versatilidade, as portas sanfonadas são fabricadas em PVC de alta qualidade, oferecendo durabilidade e fácil manutenção.

Com design compacto e funcional, as portas sanfonadas se dobram completamente durante a abertura, ocupando mínimo espaço e permitindo aproveitamento total do vão. São perfeitas para áreas de serviço, despensas, closets, banheiros, varandas e diversos outros ambientes residenciais e comerciais.

A solução mais econômica do mercado! Porta sanfonada une preço acessível com praticidade total - ocupa apenas 10cm quando aberta!',
  '["Início","›","Portas","›","Portas Sanfonadas"]',
  '[]',
  '[]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Portas Sanfonadas - Planac Distribuidora',
  'As Portas Sanfonadas são a solução mais econômica e prática para fechamento de vãos, caracterizadas por seu sistema de abertura em sanfona que permite máxima economia de espaço. Ideais para ambientes que necessitam praticidade e versatilidade, as portas sanfonadas são fabricadas em PVC de alta qualidade, oferecendo durabilidade e fácil manutenção.',
  'Portas Sanfonadas, Portas Sanfonadas, Kits de Portas',
  3,
  0,
  'PUBLICADO',
  'menu-kit-portas',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- PVC Amadeirado
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-016',
  'PVC Amadeirado',
  'pvc-amadeirado-page',
  '',
  'O Forro de PVC Amadeirado é a escolha perfeita para quem deseja unir a beleza natural da madeira com todas as vantagens práticas do PVC. Com texturas e cores que reproduzem fielmente diversos tipos de madeira, este forro oferece um acabamento sofisticado e aconchegante, sem as desvantagens da madeira natural.',
  'O Forro de PVC Amadeirado é a escolha perfeita para quem deseja unir a beleza natural da madeira com todas as vantagens práticas do PVC. Com texturas e cores que reproduzem fielmente diversos tipos de madeira, este forro oferece um acabamento sofisticado e aconchegante, sem as desvantagens da madeira natural.

Ideal para ambientes residenciais e comerciais que buscam um toque rústico ou clássico, o PVC amadeirado traz calor e elegância aos espaços, sendo perfeito para varandas, áreas gourmet, salas, quartos e áreas externas cobertas. Além da beleza estética, você não precisa se preocupar com cupins, umidade ou manutenções constantes.

Visual nobre da madeira natural + Durabilidade e praticidade do PVC = Economia e beleza garantidas! Sem cupins, sem rachaduras, sem necessidade de envernizar!',
  '["Início","›","Forros","›","PVC Amadeirado"]',
  '[]',
  '["Residencial: Salas, quartos, cozinhas, varandas, áreas gourmet","Áreas Externas Cobertas: Varandas, pergolados, coberturas","Comercial: Restaurantes, cafés, bares, lojas","Rural: Casas de campo, sítios, chácaras","Hotéis e Pousadas: Recepções, quartos, áreas comuns","Espaços de Eventos: Salões, buffets"]',
  'Nosso PVC amadeirado possui características técnicas de alta qualidade:
Largura das réguas: 20cm ou 25cm
                        Comprimento: Sob medida (até 6 metros)
                        Espessura: 7mm, 8mm ou 10mm
                        Acabamento: Texturizado (imita veios da madeira)
                        Sistema: Encaixe macho-fêmea com perfil "H"
                        Resistência UV: Proteção contra desbotamento',
  '[]',
  '',
  '[]',
  NULL,
  'PVC Amadeirado - Planac Distribuidora',
  'O Forro de PVC Amadeirado é a escolha perfeita para quem deseja unir a beleza natural da madeira com todas as vantagens práticas do PVC. Com texturas e cores que reproduzem fielmente diversos tipos de madeira, este forro oferece um acabamento sofisticado e aconchegante, sem as desvantagens da madeira natural.',
  'PVC Amadeirado, Forro PVC Amadeirado, Forros de PVC',
  2,
  0,
  'PUBLICADO',
  'menu-forros-pvc',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Forro de PVC Branco
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-017',
  'Forro de PVC Branco',
  'pvc-branco-page',
  '',
  'O Forro de PVC Branco é uma das soluções mais populares e econômicas para acabamento de tetos. Fabricado em policloreto de vinila (PVC), este tipo de forro oferece excelente custo-benefício, aliando durabilidade, facilidade de instalação e manutenção, além de um acabamento limpo e moderno.',
  'O Forro de PVC Branco é uma das soluções mais populares e econômicas para acabamento de tetos. Fabricado em policloreto de vinila (PVC), este tipo de forro oferece excelente custo-benefício, aliando durabilidade, facilidade de instalação e manutenção, além de um acabamento limpo e moderno.

Ideal para ambientes residenciais e comerciais, o forro de PVC branco é resistente à umidade, não enferruja, não apodrece e não necessita de pintura. Sua cor branca neutra proporciona luminosidade aos ambientes e combina perfeitamente com qualquer estilo de decoração.

O PVC branco é a escolha inteligente para quem busca economia sem abrir mão da qualidade. Resistente, durável e de fácil manutenção - perfeito para qualquer ambiente!',
  '["Início","›","Forros","›","PVC Branco"]',
  '[]',
  '["Residencial: Cozinhas, banheiros, áreas de serviço, varandas, quartos, salas","Comercial: Lojas, escritórios, clínicas, consultórios","Industrial: Galpões, fábricas, depósitos","Áreas Externas: Varandas, garagens, coberturas","Rural: Casas de campo, sítios, chácaras","Institucional: Escolas, igrejas, salões de festas"]',
  'Nossos forros de PVC branco são fabricados com material de primeira qualidade:
Largura das réguas: 20cm ou 25cm
                        Comprimento: Sob medida (até 6 metros)
                        Espessura: 7mm, 8mm ou 10mm
                        Acabamento: Liso brilhante ou fosco
                        Cor: Branco neve (tonalidade uniforme)
                        Sistema: Encaixe macho-fêmea',
  '[]',
  '',
  '[]',
  NULL,
  'Forro de PVC Branco - Planac Distribuidora',
  'O Forro de PVC Branco é uma das soluções mais populares e econômicas para acabamento de tetos. Fabricado em policloreto de vinila (PVC), este tipo de forro oferece excelente custo-benefício, aliando durabilidade, facilidade de instalação e manutenção, além de um acabamento limpo e moderno.',
  'Forro de PVC Branco, Forro PVC Branco, Forros de PVC',
  1,
  0,
  'PUBLICADO',
  'menu-forros-pvc',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Forro PVC Modular
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-018',
  'Forro PVC Modular',
  'pvc-modular-page',
  '',
  'O Forro PVC Modular é uma solução inovadora que une a resistência e economia do PVC com a praticidade do sistema modular. Composto por placas individuais que se encaixam em uma estrutura metálica suspensa, este forro oferece acesso facilitado às instalações, manutenção simplificada e um acabamento moderno e profissional.',
  'O Forro PVC Modular é uma solução inovadora que une a resistência e economia do PVC com a praticidade do sistema modular. Composto por placas individuais que se encaixam em uma estrutura metálica suspensa, este forro oferece acesso facilitado às instalações, manutenção simplificada e um acabamento moderno e profissional.

Muito utilizado em ambientes comerciais, escritórios, clínicas e hospitais, o forro PVC modular é ideal para locais que necessitam de manutenções frequentes nas instalações elétricas, hidráulicas ou de ar-condicionado. As placas podem ser removidas individualmente sem danificar o resto do forro, proporcionando praticidade sem igual.

Acesso total às instalações! Remova apenas a placa necessária para manutenção, sem quebrar ou danificar o resto do forro. Economia de tempo e dinheiro em manutenções!',
  '["Início","›","Forros","›","PVC Modular"]',
  '[]',
  '["Comercial: Lojas, shoppings, supermercados","Corporativo: Escritórios, salas de reunião, coworkings","Hospitalar: Hospitais, clínicas, laboratórios","Educacional: Escolas, faculdades, cursos","Industrial: Áreas administrativas e limpas","Institucional: Bancos, órgãos públicos","Restaurantes: Cozinhas industriais e áreas de atendimento","Academias: Salas de musculação e aeróbica"]',
  'Nosso forro PVC modular é fabricado com materiais de primeira linha:
Dimensões das Placas: 60x60cm ou 62,5x62,5cm
                        Espessura: 7mm a 10mm
                        Acabamento: Liso, texturizado ou perfurado
                        Cores: Branco, bege, cinza e outras sob consulta
                        Estrutura: Perfis de aço galvanizado
                        Sistema: Encaixe por pressão ou parafusado
                        Peso: Aproximadamente 1,2 kg/m²',
  '[]',
  '',
  '[]',
  NULL,
  'Forro PVC Modular - Planac Distribuidora',
  'O Forro PVC Modular é uma solução inovadora que une a resistência e economia do PVC com a praticidade do sistema modular. Composto por placas individuais que se encaixam em uma estrutura metálica suspensa, este forro oferece acesso facilitado às instalações, manutenção simplificada e um acabamento moderno e profissional.',
  'Forro PVC Modular, PVC Modular, Forros Modulares',
  2,
  0,
  'PUBLICADO',
  'menu-forros-modulares',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Rodapés
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  'page-019',
  'Rodapés',
  'rodapes',
  '',
  'Os Rodapés são elementos essenciais para o acabamento de qualquer ambiente, oferecendo proteção às paredes e um visual harmonioso entre piso e parede. Mais do que um detalhe estético, os rodapés protegem as paredes contra impactos de móveis, vassouras, aspiradores e umidade, além de esconder eventuais imperfeições no encontro entre piso e parede.',
  'Os Rodapés são elementos essenciais para o acabamento de qualquer ambiente, oferecendo proteção às paredes e um visual harmonioso entre piso e parede. Mais do que um detalhe estético, os rodapés protegem as paredes contra impactos de móveis, vassouras, aspiradores e umidade, além de esconder eventuais imperfeições no encontro entre piso e parede.

Disponíveis em diversos materiais, alturas e acabamentos, os rodapés permitem criar desde ambientes clássicos e elegantes até designs modernos e minimalistas. A escolha correta do rodapé complementa e valoriza o projeto, agregando sofisticação e proteção duradoura.

O detalhe que faz toda a diferença! Rodapés protegem suas paredes, escondem imperfeições e dão o toque final perfeito à sua decoração.',
  '["Início","›","Rodapés","›","Rodapés"]',
  '[]',
  '["Residencial: Salas, quartos, corredores, cozinhas","Comercial: Escritórios, lojas, consultórios","Corporativo: Empresas, prédios comerciais","Hospitalar: Clínicas, hospitais (PVC ou PU)","Educacional: Escolas, faculdades","Hotelaria: Hotéis, pousadas"]',
  '',
  '[]',
  '',
  '[]',
  NULL,
  'Rodapés - Planac Distribuidora',
  'Os Rodapés são elementos essenciais para o acabamento de qualquer ambiente, oferecendo proteção às paredes e um visual harmonioso entre piso e parede. Mais do que um detalhe estético, os rodapés protegem as paredes contra impactos de móveis, vassouras, aspiradores e umidade, além de esconder eventuais imperfeições no encontro entre piso e parede.',
  'Rodapés, Rodapés, Rodapés',
  1,
  0,
  'PUBLICADO',
  'menu-rodapes',
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ===========================================
-- FIM DA MIGRAÇÃO
-- ===========================================
