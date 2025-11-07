/**
 * Script de Migração de Dados das Páginas HTML para o Banco D1
 *
 * Este script extrai informações dos produtos das páginas HTML estáticas
 * e popula o banco de dados D1 com categorias e produtos.
 */

import { nanoid } from 'nanoid';

// Estrutura de categorias baseada no site
const categories = [
  {
    nome: 'Divisórias',
    slug: 'divisorias',
    descricao: 'Soluções completas em divisórias para construção civil',
    icone: '🏗️',
    ativo: 1,
    ordem: 1,
    subcategorias: [
      {
        nome: 'Divisória Naval',
        slug: 'divisoria-naval',
        descricao: 'Resistência extrema para ambientes agressivos',
        icone: '⚓',
        ativo: 1,
        ordem: 1
      },
      {
        nome: 'Divisória de Gesso Acartonado',
        slug: 'divisoria-de-gesso-acartonado',
        descricao: 'Drywall - Versatilidade e rapidez na construção',
        icone: '🧱',
        ativo: 1,
        ordem: 2
      }
    ]
  },
  {
    nome: 'Forros',
    slug: 'forros',
    descricao: 'Forros de alta qualidade para todo tipo de ambiente',
    icone: '🏠',
    ativo: 1,
    ordem: 2,
    subcategorias: [
      {
        nome: 'Forro de Gesso',
        slug: 'forro-gesso',
        descricao: 'Acabamento superior e isolamento acústico',
        icone: '⬜',
        ativo: 1,
        ordem: 1
      },
      {
        nome: 'Forro PVC Branco',
        slug: 'forro-pvc-branco',
        descricao: 'Durabilidade e economia',
        icone: '💠',
        ativo: 1,
        ordem: 2
      },
      {
        nome: 'Forro PVC Amadeirado',
        slug: 'forro-pvc-amadeirado',
        descricao: 'Beleza natural com praticidade',
        icone: '🌳',
        ativo: 1,
        ordem: 3
      },
      {
        nome: 'Forro Vinílico',
        slug: 'forro-vinilico',
        descricao: 'Elegância e sofisticação',
        icone: '✨',
        ativo: 1,
        ordem: 4
      }
    ]
  },
  {
    nome: 'Forros Modulares',
    slug: 'forros-modulares',
    descricao: 'Sistemas modulares para acabamento profissional',
    icone: '📐',
    ativo: 1,
    ordem: 3,
    subcategorias: [
      {
        nome: 'Forro Modular de Gesso',
        slug: 'forro-modular-gesso',
        descricao: 'Placas removíveis de gesso',
        icone: '⚪',
        ativo: 1,
        ordem: 1
      },
      {
        nome: 'Forro Modular PVC',
        slug: 'forro-modular-pvc',
        descricao: 'Praticidade e durabilidade',
        icone: '🔲',
        ativo: 1,
        ordem: 2
      },
      {
        nome: 'Forrovid',
        slug: 'forrovid',
        descricao: 'Sistema inteligente e modular',
        icone: '🎯',
        ativo: 1,
        ordem: 3
      },
      {
        nome: 'Forro Mineral',
        slug: 'forro-mineral',
        descricao: 'Acústica e resistência ao fogo',
        icone: '🔊',
        ativo: 1,
        ordem: 4
      },
      {
        nome: 'Forro Modular Isopor',
        slug: 'forro-modular-isopor',
        descricao: 'Leveza e isolamento térmico',
        icone: '☁️',
        ativo: 1,
        ordem: 5
      }
    ]
  },
  {
    nome: 'Isolamento Termoacústico',
    slug: 'termoacustica',
    descricao: 'Soluções completas em isolamento térmico e acústico',
    icone: '🔇',
    ativo: 1,
    ordem: 4,
    subcategorias: [
      {
        nome: 'Lã de Rocha',
        slug: 'la-rocha',
        descricao: 'Máxima resistência ao fogo e isolamento superior',
        icone: '🔥',
        ativo: 1,
        ordem: 1
      },
      {
        nome: 'Lã de Vidro',
        slug: 'la-vidro',
        descricao: 'Isolamento térmico e acústico de alta performance',
        icone: '🌡️',
        ativo: 1,
        ordem: 2
      },
      {
        nome: 'Lã de PET',
        slug: 'la-pet',
        descricao: 'Sustentável e eficiente',
        icone: '♻️',
        ativo: 1,
        ordem: 3
      },
      {
        nome: 'Manta Térmica Aluminizada',
        slug: 'manta-termica',
        descricao: 'Proteção contra calor radiante',
        icone: '☀️',
        ativo: 1,
        ordem: 4
      }
    ]
  },
  {
    nome: 'Kit Portas',
    slug: 'kit-portas',
    descricao: 'Kits completos de portas prontas para instalação',
    icone: '🚪',
    ativo: 1,
    ordem: 5,
    subcategorias: [
      {
        nome: 'Kit Porta de Giro',
        slug: 'kit-porta-giro',
        descricao: 'Portas de abrir tradicionais',
        icone: '🚪',
        ativo: 1,
        ordem: 1
      },
      {
        nome: 'Kit Porta de Correr',
        slug: 'kit-porta-correr',
        descricao: 'Economia de espaço e praticidade',
        icone: '↔️',
        ativo: 1,
        ordem: 2
      },
      {
        nome: 'Portas Sanfonadas',
        slug: 'portas-sanfonadas',
        descricao: 'Flexibilidade e design moderno',
        icone: '🪗',
        ativo: 1,
        ordem: 3
      }
    ]
  },
  {
    nome: 'Rodapés',
    slug: 'rodapes',
    descricao: 'Acabamento perfeito para suas obras',
    icone: '📏',
    ativo: 1,
    ordem: 6,
    subcategorias: []
  }
];

// Produtos com informações completas
const products = [
  {
    nome: 'Divisória Naval',
    slug: 'divisoria-naval',
    subtitulo: 'Resistência extrema para ambientes agressivos',
    descricao_curta: 'Solução robusta e durável projetada para ambientes que exigem alta resistência à umidade, corrosão, impactos e condições extremas.',
    descricao_completa: `A Divisória Naval, também conhecida como divisória metálica, é uma solução robusta e durável projetada especialmente para ambientes que exigem alta resistência à umidade, corrosão, impactos e condições extremas.

Fabricada em chapas de aço galvanizado ou alumínio com tratamento anticorrosivo e pintura eletrostática de alta durabilidade, a divisória naval oferece resistência incomparável, facilidade de limpeza e manutenção mínima.`,
    imagem_banner: 'https://painel-planac.codiehost.com.br/uploads/133471455167197486.jpg',
    categoria: 'divisoria-naval',
    status: 'PUBLICADO',
    destaque: 1,
    ordem: 1,
    caracteristicas: `100% Impermeável - Não apodrece, não embolora, não deforma
Alta Resistência Mecânica - Suporta impactos e uso intenso
Anticorrosiva - Tratamento especial contra ferrugem
Antivandalismo - Dificulta pichações e depredações
Higiênica - Superfície lisa facilita limpeza profunda
Durabilidade Extrema - Vida útil superior a 20 anos
Baixa Manutenção - Resistente a produtos de limpeza pesados`,
    vantagens: `Imunidade à Umidade - Não deforma com água ou vapor
Resistência Química - Suporta produtos de limpeza pesados
Facilidade de Limpeza - Superfície lisa não absorve sujeira
Higiene Superior - Não prolifera bactérias ou fungos
Resistência ao Fogo - Material não combustível
Longevidade - Décadas sem necessidade de troca`,
    aplicacoes: `Banheiros Públicos - Shoppings, aeroportos, rodoviárias
Industrial - Fábricas, plantas químicas
Vestiários - Academias, clubes, escolas
Hospitalar - Hospitais, clínicas, laboratórios
Áreas de Lavagem - Lava-rápidos, pet shops
Frigoríficos - Câmaras frias, açougues`,
    meta_title: 'Divisória Naval - Resistência Extrema | Planac Distribuidora',
    meta_description: 'Divisória Naval em aço galvanizado e alumínio. 100% impermeável, antivandalismo, ideal para banheiros públicos e ambientes agressivos.',
    meta_keywords: 'divisória naval, divisória metálica, divisória banheiro, divisória sanitária, aço galvanizado'
  },
  {
    nome: 'Divisória de Gesso Acartonado',
    slug: 'divisoria-gesso-acartonado',
    subtitulo: 'Drywall - Versatilidade e rapidez na construção',
    descricao_curta: 'Sistema construtivo moderno com placas de gesso revestidas, oferecendo instalação até 5x mais rápida que alvenaria tradicional.',
    descricao_completa: `A Divisória de Gesso Acartonado, popularmente conhecida como Drywall, revolucionou a construção civil moderna. Este sistema consiste em placas de gesso revestidas com cartão, fixadas em estrutura metálica de aço galvanizado.

Amplamente utilizado em obras residenciais, comerciais e corporativas, o drywall oferece vantagens significativas: instalação até 5x mais rápida, obra limpa com mínimo desperdício, flexibilidade para reformas futuras e excelente acabamento.`,
    imagem_banner: 'https://painel-planac.codiehost.com.br/uploads/133471436401074071.jpg',
    categoria: 'divisoria-de-gesso-acartonado',
    status: 'PUBLICADO',
    destaque: 1,
    ordem: 2,
    caracteristicas: `Instalação Rápida - Até 5x mais rápido que alvenaria
Obra Limpa - Mínimo desperdício e sujeira
Leveza - Até 7x mais leve que alvenaria
Acabamento Perfeito - Superfície lisa pronta para pintura
Flexibilidade - Facilita alterações futuras
Isolamento Acústico - Com lã mineral no interior`,
    vantagens: `Velocidade - Instalação em dias, não semanas
Limpeza - Obra organizada com mínimo entulho
Precisão - Divisórias perfeitamente retas e niveladas
Isolamento - Possibilidade de lã mineral entre placas
Passagem de Instalações - Fios e canos embutidos facilmente
Reformas - Fácil abertura e fechamento`,
    aplicacoes: `Divisórias - Separação de ambientes
Forros - Rebaixos de teto
Revestimentos - Cobrindo paredes existentes
Residencial - Casas e apartamentos
Comercial - Lojas, escritórios, clínicas
Corporativo - Salas de reunião`,
    meta_title: 'Divisória de Gesso Acartonado Drywall | Planac Distribuidora',
    meta_description: 'Drywall para divisórias e forros. Instalação 5x mais rápida, obra limpa e acabamento perfeito. Ideal para residencial e comercial.',
    meta_keywords: 'drywall, gesso acartonado, divisória gesso, parede drywall, forro drywall'
  },
  {
    nome: 'Lã de Rocha',
    slug: 'la-rocha',
    subtitulo: 'Máxima resistência ao fogo e isolamento superior',
    descricao_curta: 'Material isolante termoacústico premium incombustível, suportando até 750°C sem perder propriedades.',
    descricao_completa: `A Lã de Rocha é um material isolante termoacústico premium fabricado a partir de rochas basálticas fundidas a temperaturas superiores a 1500°C. Reconhecida mundialmente como a solução mais segura para proteção passiva contra incêndio.

Utilizada em projetos que exigem os mais altos padrões de segurança: indústrias petroquímicas, siderúrgicas, edifícios corporativos de alto padrão, hospitais e shopping centers.`,
    imagem_banner: 'https://painel-planac.codiehost.com.br/uploads/133471460691698903.jpg',
    categoria: 'la-rocha',
    status: 'PUBLICADO',
    destaque: 1,
    ordem: 1,
    caracteristicas: `Incombustível - Não propaga chamas, Classe A1
Resistência Térmica Extrema - Suporta até 750°C
Excelente Isolamento Térmico - Condutividade 0,035 a 0,040 W/mK
Absorção Acústica Superior - NRC até 1,00
Não Higroscópica - Repele água e umidade
Estabilidade Dimensional - Não deforma com temperatura`,
    vantagens: `Proteção Passiva Contra Incêndio - Ganha tempo para evacuação
Não Emite Gases Tóxicos - Segurança em caso de fogo
Economia de Energia - Reduz custos operacionais até 45%
Conforto Térmico Extremo - Eficaz em temperaturas extremas
Isolamento Acústico Premium - Excelente para ambientes críticos
Não Apodrece - Imune a fungos e roedores`,
    aplicacoes: `Proteção Passiva - Estruturas metálicas, rotas de fuga
Industrial - Fornos, caldeiras, tubulações
Petroquímica - Refinarias, plataformas offshore
Hospitalar - Centros cirúrgicos, áreas críticas
Comercial - Shopping centers, edifícios corporativos
Acústica - Estúdios profissionais, teatros`,
    normas_certificacoes: `NBR 11359 - Lã mineral para isolamento térmico
NBR 15220 - Desempenho térmico de edificações
ASTM C612 - Lã mineral
EN 13501-1 - Classificação ao fogo (Euroclasse A1)
ISO 9001 - Gestão da qualidade`,
    meta_title: 'Lã de Rocha - Isolamento Térmico e Acústico | Planac',
    meta_description: 'Lã de Rocha incombustível para isolamento termoacústico. Suporta 750°C, classe A1, ideal para proteção passiva contra incêndio.',
    meta_keywords: 'lã de rocha, isolamento térmico, isolamento acústico, proteção contra fogo, isolante incombustível'
  }
];

// Função para inserir categorias
async function insertCategories(db) {
  console.log('Inserindo categorias...');
  const categoryIds = {};

  for (const cat of categories) {
    const catId = nanoid();
    categoryIds[cat.slug] = catId;

    await db.prepare(`
      INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NULL, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(catId, cat.nome, cat.slug, cat.descricao, cat.icone, cat.ordem, cat.ativo).run();

    console.log(`✓ Categoria criada: ${cat.nome}`);

    // Inserir subcategorias
    if (cat.subcategorias && cat.subcategorias.length > 0) {
      for (const subcat of cat.subcategorias) {
        const subcatId = nanoid();
        categoryIds[subcat.slug] = subcatId;

        await db.prepare(`
          INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(subcatId, subcat.nome, subcat.slug, subcat.descricao, subcat.icone, catId, subcat.ordem, subcat.ativo).run();

        console.log(`  ✓ Subcategoria criada: ${subcat.nome}`);
      }
    }
  }

  return categoryIds;
}

// Função para inserir produtos
async function insertProducts(db, categoryIds) {
  console.log('\nInserindo produtos...');

  // Pegar o ID do usuário admin
  const adminUser = await db.prepare('SELECT id FROM users LIMIT 1').bind().first();
  const adminId = adminUser.id;

  for (const prod of products) {
    const prodId = nanoid();
    const categoryId = categoryIds[prod.categoria];

    if (!categoryId) {
      console.log(`⚠ Categoria não encontrada para: ${prod.nome} (slug: ${prod.categoria})`);
      continue;
    }

    await db.prepare(`
      INSERT INTO products (
        id, nome, slug, subtitulo, descricao_curta, descricao_completa,
        imagem_banner, category_id, status, destaque, ordem,
        caracteristicas, vantagens, aplicacoes, especificacoes,
        normas_certificacoes, meta_title, meta_description, meta_keywords,
        created_by_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      prodId,
      prod.nome,
      prod.slug,
      prod.subtitulo,
      prod.descricao_curta,
      prod.descricao_completa,
      prod.imagem_banner,
      categoryId,
      prod.status,
      prod.destaque,
      prod.ordem,
      prod.caracteristicas || null,
      prod.vantagens || null,
      prod.aplicacoes || null,
      prod.especificacoes || null,
      prod.normas_certificacoes || null,
      prod.meta_title || null,
      prod.meta_description || null,
      prod.meta_keywords || null,
      adminId
    ).run();

    console.log(`✓ Produto criado: ${prod.nome}`);
  }
}

// Função principal
export async function migrateData(db) {
  try {
    console.log('🚀 Iniciando migração de dados...\n');

    const categoryIds = await insertCategories(db);
    await insertProducts(db, categoryIds);

    console.log('\n✅ Migração concluída com sucesso!');
    console.log(`📊 Total: ${categories.length} categorias e ${products.length} produtos`);

    return { success: true };
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    throw error;
  }
}

export { categories, products };
