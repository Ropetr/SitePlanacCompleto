/**
 * ===========================================
 * EXTRAÇÃO COMPLETA DE DADOS DAS PÁGINAS HTML
 * ===========================================
 * Lê todos os HTMLs da pasta planac-admin/src/components/pages
 * e extrai TODOS os dados estruturados para popular o banco
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a pasta com os HTMLs
const htmlDir = path.join(__dirname, '..', 'planac-admin', 'src', 'components', 'pages');

// Mapeamento de páginas para menus
const pageMenuMapping = {
  'divisoria-naval-page.html': { menu: 'divisorias', nome: 'Divisória Naval', ordem: 1 },
  'drywall-divisoria-page.html': { menu: 'drywall', nome: 'Drywall - Divisória', ordem: 1 },
  'planac-forro-gesso-completo.html': { menu: 'forros-gesso', nome: 'Forro de Gesso Acartonado', ordem: 1 },
  'pvc-branco-page.html': { menu: 'forros-pvc', nome: 'Forro PVC Branco', ordem: 1 },
  'pvc-amadeirado-page.html': { menu: 'forros-pvc', nome: 'Forro PVC Amadeirado', ordem: 2 },
  'forro-vinilico-revid.html': { menu: 'forros-vinilico', nome: 'Forro Vinílico REVID', ordem: 1 },
  'planac-gesso-modular.html': { menu: 'forros-modulares', nome: 'Gesso Modular', ordem: 1 },
  'pvc-modular-page.html': { menu: 'forros-modulares', nome: 'PVC Modular', ordem: 2 },
  'forrovid-page.html': { menu: 'forros-modulares', nome: 'Forrovid', ordem: 3 },
  'mineral-page.html': { menu: 'forros-modulares', nome: 'Mineral', ordem: 4 },
  'isopor-page.html': { menu: 'forros-modulares', nome: 'Isopor', ordem: 5 },
  'la-rocha-page.html': { menu: 'termoacustica', nome: 'Lã de Rocha', ordem: 1 },
  'la-vidro-page.html': { menu: 'termoacustica', nome: 'Lã de Vidro', ordem: 2 },
  'la-pet-page.html': { menu: 'termoacustica', nome: 'Lã PET', ordem: 3 },
  'manta-termica.html': { menu: 'termoacustica', nome: 'Manta Térmica', ordem: 4 },
  'kit-porta.html': { menu: 'kit-portas', nome: 'Kit Porta Pronta', ordem: 1 },
  'kit-porta-correr.html': { menu: 'kit-portas', nome: 'Kit Porta de Correr', ordem: 2 },
  'portas-sanfonadas.html': { menu: 'kit-portas', nome: 'Portas Sanfonadas', ordem: 3 },
  'rodapes.html': { menu: 'rodapes', nome: 'Rodapés', ordem: 1 },
};

// IDs dos menus (serão criados no banco)
const menuIds = {
  'divisorias': 'menu-divisorias',
  'drywall': 'menu-drywall',
  'forros-gesso': 'menu-forros-gesso',
  'forros-pvc': 'menu-forros-pvc',
  'forros-vinilico': 'menu-forros-vinilico',
  'forros-modulares': 'menu-forros-modulares',
  'termoacustica': 'menu-termoacustica',
  'kit-portas': 'menu-kit-portas',
  'rodapes': 'menu-rodapes',
};

// Nomes legíveis dos menus
const menuNames = {
  'divisorias': 'Divisórias',
  'drywall': 'Drywall',
  'forros-gesso': 'Forros de Gesso',
  'forros-pvc': 'Forros de PVC',
  'forros-vinilico': 'Forros Vinílicos',
  'forros-modulares': 'Forros Modulares',
  'termoacustica': 'Isolamento Termoacústico',
  'kit-portas': 'Kits de Portas',
  'rodapes': 'Rodapés',
};

function extractTextContent(element) {
  if (!element) return '';
  return element.textContent.trim();
}

function extractArrayFromList(ul) {
  if (!ul) return [];
  const items = ul.querySelectorAll('li');
  return Array.from(items).map(li => extractTextContent(li)).filter(text => text);
}

function extractPageData(htmlContent, fileName) {
  const info = pageMenuMapping[fileName];
  if (!info) return null;

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Extrair título
  const h1 = document.querySelector('h1');
  const titulo = h1 ? extractTextContent(h1) : info.nome;

  // Extrair subtítulo (primeiro p depois do h1 ou texto no hero)
  const hero = document.querySelector('.hero, .banner, .page-header');
  let subtitulo = '';
  if (hero) {
    const p = hero.querySelector('p');
    if (p) subtitulo = extractTextContent(p);
  }

  // Extrair imagem do banner
  let imagemBanner = '';
  const bannerImg = document.querySelector('.hero img, .banner img, .page-header img');
  if (bannerImg) {
    imagemBanner = bannerImg.src || bannerImg.getAttribute('src') || '';
  }
  // Tentar extrair de background-image
  if (!imagemBanner && hero) {
    const style = hero.getAttribute('style') || '';
    const bgMatch = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
    if (bgMatch) imagemBanner = bgMatch[1];
  }

  // Extrair descrição completa (parágrafos do conteúdo principal)
  const contentSection = document.querySelector('.service-content, .content, main, article');
  let descricaoCompleta = '';
  if (contentSection) {
    const paragraphs = contentSection.querySelectorAll('p');
    const texts = Array.from(paragraphs)
      .map(p => extractTextContent(p))
      .filter(text => text && text.length > 20);
    descricaoCompleta = texts.slice(0, 3).join('\n\n');
  }

  // Extrair descrição curta (primeiro parágrafo)
  const descricaoCurta = descricaoCompleta.split('\n\n')[0] || subtitulo;

  // Extrair características (primeira lista)
  const caracteristicas = [];
  const firstUl = document.querySelector('ul');
  if (firstUl) {
    caracteristicas.push(...extractArrayFromList(firstUl));
  }

  // Extrair vantagens (segunda lista ou lista com título "Vantagens")
  const vantagens = [];
  const headings = document.querySelectorAll('h2, h3');
  for (const heading of headings) {
    if (heading.textContent.toLowerCase().includes('vantagem')) {
      let next = heading.nextElementSibling;
      while (next && next.tagName !== 'H2' && next.tagName !== 'H3') {
        if (next.tagName === 'UL') {
          vantagens.push(...extractArrayFromList(next));
          break;
        }
        next = next.nextElementSibling;
      }
    }
  }

  // Extrair aplicações (lista com título "Aplicações" ou "Onde usar")
  const aplicacoes = [];
  for (const heading of headings) {
    if (heading.textContent.toLowerCase().includes('aplicaç') ||
        heading.textContent.toLowerCase().includes('onde usar')) {
      let next = heading.nextElementSibling;
      while (next && next.tagName !== 'H2' && next.tagName !== 'H3') {
        if (next.tagName === 'UL') {
          aplicacoes.push(...extractArrayFromList(next));
          break;
        }
        next = next.nextElementSibling;
      }
    }
  }

  // Extrair especificações técnicas
  let especificacoes = '';
  for (const heading of headings) {
    if (heading.textContent.toLowerCase().includes('especificaç') ||
        heading.textContent.toLowerCase().includes('técnica')) {
      let next = heading.nextElementSibling;
      const specs = [];
      while (next && next.tagName !== 'H2' && next.tagName !== 'H3') {
        if (next.tagName === 'P' || next.tagName === 'UL') {
          specs.push(extractTextContent(next));
        }
        next = next.nextElementSibling;
      }
      especificacoes = specs.join('\n');
    }
  }

  // Extrair normas e certificações
  const normas = [];
  for (const heading of headings) {
    if (heading.textContent.toLowerCase().includes('norma') ||
        heading.textContent.toLowerCase().includes('certificaç')) {
      let next = heading.nextElementSibling;
      while (next && next.tagName !== 'H2' && next.tagName !== 'H3') {
        if (next.tagName === 'UL') {
          normas.push(...extractArrayFromList(next));
          break;
        }
        next = next.nextElementSibling;
      }
    }
  }

  // Gerar slug
  const slug = fileName.replace('.html', '');

  return {
    nome: titulo,
    slug: slug,
    subtitulo: subtitulo,
    descricao_curta: descricaoCurta,
    descricao_completa: descricaoCompleta,
    caracteristicas: caracteristicas,
    vantagens: vantagens,
    aplicacoes: aplicacoes,
    especificacoes: especificacoes,
    normas_certificacoes: normas,
    imagem_banner: imagemBanner,
    galeria_imagens: [],
    video_url: null,
    meta_title: `${titulo} - Planac Distribuidora`,
    meta_description: descricaoCurta || `${titulo} de alta qualidade. Entre em contato para orçamento.`,
    meta_keywords: [titulo, info.nome, menuNames[info.menu]].join(', '),
    ordem: info.ordem,
    destaque: 0,
    status: 'PUBLICADO',
    menu_id: menuIds[info.menu],
    menu_nome: menuNames[info.menu],
  };
}

// Processar todos os HTMLs
console.log('🔍 Lendo arquivos HTML da pasta:', htmlDir);
console.log('');

const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html') && f !== 'index.html');
const pages = [];

for (const fileName of files) {
  if (!pageMenuMapping[fileName]) {
    console.log(`⚠️  Ignorando ${fileName} (não mapeado)`);
    continue;
  }

  const filePath = path.join(htmlDir, fileName);
  const htmlContent = fs.readFileSync(filePath, 'utf-8');
  const pageData = extractPageData(htmlContent, fileName);

  if (pageData) {
    pages.push(pageData);
    console.log(`✅ ${pageData.nome} (${pageData.slug})`);
    console.log(`   Menu: ${pageData.menu_nome}`);
    console.log(`   Características: ${pageData.caracteristicas.length}`);
    console.log(`   Vantagens: ${pageData.vantagens.length}`);
    console.log(`   Aplicações: ${pageData.aplicacoes.length}`);
    console.log('');
  }
}

// Gerar JSON completo
const jsonPath = path.join(__dirname, 'pages-extracted-complete.json');
fs.writeFileSync(jsonPath, JSON.stringify(pages, null, 2), 'utf-8');

console.log(`\n📄 JSON gerado: ${jsonPath}`);
console.log(`📊 Total: ${pages.length} páginas\n`);

// Gerar SQL para criar menus
const menusSQL = Object.entries(menuNames).map(([slug, nome], index) => {
  const menuId = menuIds[slug];
  return `-- Menu: ${nome}
INSERT OR IGNORE INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, created_at, updated_at)
VALUES (
  '${menuId}',
  '${nome}',
  '${slug}',
  'Produtos de ${nome}',
  '',
  NULL,
  ${index + 1},
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`;
}).join('\n\n');

// Gerar SQL para criar páginas
const pagesSQL = pages.map((page, index) => {
  const id = `page-${String(index + 1).padStart(3, '0')}`;
  const escape = (str) => str.replace(/'/g, "''");

  return `-- ${page.nome}
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  '${id}',
  '${escape(page.nome)}',
  '${page.slug}',
  '${escape(page.subtitulo)}',
  '${escape(page.descricao_curta)}',
  '${escape(page.descricao_completa)}',
  '${escape(JSON.stringify(page.caracteristicas))}',
  '${escape(JSON.stringify(page.vantagens))}',
  '${escape(JSON.stringify(page.aplicacoes))}',
  '${escape(page.especificacoes)}',
  '${escape(JSON.stringify(page.normas_certificacoes))}',
  '${page.imagem_banner}',
  '${escape(JSON.stringify(page.galeria_imagens))}',
  ${page.video_url ? `'${page.video_url}'` : 'NULL'},
  '${escape(page.meta_title)}',
  '${escape(page.meta_description)}',
  '${escape(page.meta_keywords)}',
  ${page.ordem},
  ${page.destaque},
  '${page.status}',
  '${page.menu_id}',
  'admin-001',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`;
}).join('\n\n');

// Salvar SQL
const sqlPath = path.join(__dirname, 'populate-database-complete.sql');
const sqlContent = `-- ===========================================
-- SCRIPT DE POPULAÇÃO COMPLETA DO BANCO DE DADOS
-- ===========================================
-- Gerado automaticamente em ${new Date().toISOString()}
-- Total de menus: ${Object.keys(menuNames).length}
-- Total de páginas: ${pages.length}
-- ===========================================

-- ===========================================
-- 1. CRIAR MENUS
-- ===========================================

${menusSQL}

-- ===========================================
-- 2. CRIAR PÁGINAS
-- ===========================================

${pagesSQL}

-- ===========================================
-- FIM DA MIGRAÇÃO
-- ===========================================
`;

fs.writeFileSync(sqlPath, sqlContent, 'utf-8');

console.log(`✅ SQL gerado: ${sqlPath}\n`);
console.log(`🚀 Para executar no D1:\n`);
console.log(`   wrangler d1 execute planac-database --file=./populate-database-complete.sql\n`);
