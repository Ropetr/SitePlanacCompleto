/**
 * Script de Migração - Páginas HTML → Banco de Dados D1
 *
 * Extrai dados das páginas HTML existentes e popula o banco
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeamento de páginas para menus
const pageMapping = {
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

// Mapeamento de slugs de menu para IDs (você precisará pegar do banco)
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

function extractDataFromHTML(htmlContent, fileName) {
  const info = pageMapping[fileName];

  // Extrair título (primeiro h1)
  const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const titulo = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : info.nome;

  // Extrair subtítulo (primeiro p depois do h1 ou texto no banner)
  const subtituloMatch = htmlContent.match(/<h1[^>]*>.*?<\/h1>\s*<p[^>]*>(.*?)<\/p>/is);
  const subtitulo = subtituloMatch ? subtituloMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  // Extrair imagem do banner
  const bannerMatch = htmlContent.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
  const imagemBanner = bannerMatch ? bannerMatch[1] : '';

  // Extrair descrição (parágrafos antes das listas)
  const descMatch = htmlContent.match(/<section[^>]*class="service-content"[^>]*>(.*?)<\/section>/is);
  let descricaoCompleta = '';
  if (descMatch) {
    const paragraphs = descMatch[1].match(/<p[^>]*>(.*?)<\/p>/gi);
    if (paragraphs) {
      descricaoCompleta = paragraphs.slice(0, 2).map(p =>
        p.replace(/<[^>]*>/g, '').trim()
      ).join('\n\n');
    }
  }

  // Extrair características (primeira lista ul)
  const caracteristicas = [];
  const listaMatch = htmlContent.match(/<ul[^>]*>(.*?)<\/ul>/is);
  if (listaMatch) {
    const items = listaMatch[1].match(/<li[^>]*>(.*?)<\/li>/gi);
    if (items) {
      items.forEach(item => {
        const text = item.replace(/<[^>]*>/g, '').trim();
        if (text) caracteristicas.push(text);
      });
    }
  }

  // Gerar slug
  const slug = fileName.replace('.html', '');

  return {
    nome: titulo,
    slug: slug,
    subtitulo: subtitulo,
    descricao_curta: subtitulo,
    descricao_completa: descricaoCompleta,
    caracteristicas: caracteristicas,
    vantagens: [],
    aplicacoes: [],
    especificacoes: '',
    normas_certificacoes: [],
    imagem_banner: imagemBanner,
    galeria_imagens: [],
    video_url: null,
    meta_title: `${titulo} - Planac Distribuidora`,
    meta_description: subtitulo || `${titulo} de alta qualidade. Entre em contato para orçamento.`,
    meta_keywords: titulo,
    ordem: info.ordem,
    destaque: 0,
    status: 'PUBLICADO',
    menu_id: menuIds[info.menu] || 'menu-divisorias',
  };
}

// Ler páginas HTML
const rootDir = path.join(__dirname, '..');
const pages = [];

console.log('🔍 Extraindo dados das páginas HTML...\n');

Object.keys(pageMapping).forEach(fileName => {
  const filePath = path.join(rootDir, fileName);

  if (fs.existsSync(filePath)) {
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const pageData = extractDataFromHTML(htmlContent, fileName);
    pages.push(pageData);
    console.log(`✅ ${pageData.nome} (${pageData.slug})`);
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${fileName}`);
  }
});

// Gerar SQL
console.log('\n📝 Gerando SQL...\n');

const sqlStatements = pages.map((page, index) => {
  const id = `page-${String(index + 1).padStart(3, '0')}`;

  return `
-- ${page.nome}
INSERT INTO products (
  id, nome, slug, subtitulo, descricao_curta, descricao_completa,
  caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
  imagem_banner, galeria_imagens, video_url,
  meta_title, meta_description, meta_keywords,
  ordem, destaque, status, menu_id,
  created_by_id, created_at, updated_at
) VALUES (
  '${id}',
  '${page.nome.replace(/'/g, "''")}',
  '${page.slug}',
  '${page.subtitulo.replace(/'/g, "''")}',
  '${page.descricao_curta.replace(/'/g, "''")}',
  '${page.descricao_completa.replace(/'/g, "''")}',
  '${JSON.stringify(page.caracteristicas).replace(/'/g, "''")}',
  '${JSON.stringify(page.vantagens).replace(/'/g, "''")}',
  '${JSON.stringify(page.aplicacoes).replace(/'/g, "''")}',
  '${page.especificacoes}',
  '${JSON.stringify(page.normas_certificacoes).replace(/'/g, "''")}',
  '${page.imagem_banner}',
  '${JSON.stringify(page.galeria_imagens).replace(/'/g, "''")}',
  ${page.video_url ? `'${page.video_url}'` : 'NULL'},
  '${page.meta_title.replace(/'/g, "''")}',
  '${page.meta_description.replace(/'/g, "''")}',
  '${page.meta_keywords}',
  ${page.ordem},
  ${page.destaque},
  '${page.status}',
  '${page.menu_id}',
  'admin-001',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`;
});

// Salvar SQL
const sqlContent = `-- ===========================================
-- MIGRAÇÃO DE PÁGINAS HTML → BANCO DE DADOS
-- ===========================================
-- Gerado automaticamente em ${new Date().toISOString()}
-- Total de páginas: ${pages.length}

${sqlStatements.join('\n')}

-- ===========================================
-- FIM DA MIGRAÇÃO
-- ===========================================
`;

const outputPath = path.join(__dirname, 'migrate-pages.sql');
fs.writeFileSync(outputPath, sqlContent, 'utf-8');

console.log(`\n✅ SQL gerado com sucesso!`);
console.log(`📁 Arquivo: ${outputPath}`);
console.log(`📊 Total: ${pages.length} páginas\n`);
console.log(`\n🚀 Para executar:`);
console.log(`   wrangler d1 execute planac-database --file=./migrate-pages.sql\n`);

// Gerar JSON também (para referência)
const jsonPath = path.join(__dirname, 'pages-extracted.json');
fs.writeFileSync(jsonPath, JSON.stringify(pages, null, 2), 'utf-8');
console.log(`📄 JSON gerado: ${jsonPath}\n`);
