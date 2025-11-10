/**
 * =====================================================
 * SYNC FROM DATABASE - Sincroniza Banco → Arquivos HTML
 * =====================================================
 *
 * Busca dados do banco via API e atualiza os arquivos HTML.
 * Depois, comita e faz push para acionar o deploy automático.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = process.env.API_URL || 'https://planac-backend-api.planacacabamentos.workers.dev';

/**
 * Fazer requisição HTTP
 */
function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}${endpoint}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Atualizar header.html com menus do banco
 */
async function updateHeader() {
  console.log('📋 Buscando menus da API...');

  const menusResponse = await fetchAPI('/api/menus?status=ativo');
  const productsResponse = await fetchAPI('/api/products?status=publicado');

  if (!menusResponse.success || !productsResponse.success) {
    throw new Error('Erro ao buscar dados da API');
  }

  const menus = menusResponse.data;
  const products = productsResponse.data;

  console.log(`✅ ${menus.length} menus encontrados`);
  console.log(`✅ ${products.length} produtos encontrados`);

  // Agrupar produtos por menu
  const productsByMenu = {};
  products.forEach(product => {
    if (!productsByMenu[product.menu_id]) {
      productsByMenu[product.menu_id] = [];
    }
    productsByMenu[product.menu_id].push(product);
  });

  // Gerar HTML do menu
  let menuHTML = '';
  let mobileMenuHTML = '';

  menus.forEach(menu => {
    const menuProducts = productsByMenu[menu.id] || [];

    // Menu desktop
    if (menuProducts.length > 0) {
      // Tem produtos = dropdown
      menuHTML += `            <li class="dropdown">\n`;
      menuHTML += `                <a href="planac-website.html#${menu.slug}" class="dropdown-toggle">${menu.nome}</a>\n`;
      menuHTML += `                <ul class="dropdown-menu">\n`;

      menuProducts.forEach(product => {
        menuHTML += `                    <li><a href="${product.slug}.html">${product.nome}</a></li>\n`;
      });

      menuHTML += `                </ul>\n`;
      menuHTML += `            </li>\n`;
    } else {
      // Sem produtos = link direto
      menuHTML += `            <a href="planac-website.html#${menu.slug}">${menu.nome}</a>\n`;
    }

    // Menu mobile
    if (menuProducts.length > 0) {
      mobileMenuHTML += `            <li class="mobile-menu-dropdown">\n`;
      mobileMenuHTML += `                <a href="planac-website.html#${menu.slug}">${menu.nome}</a>\n`;
      mobileMenuHTML += `                <ul>\n`;

      menuProducts.forEach(product => {
        mobileMenuHTML += `                    <li><a href="${product.slug}.html">${product.nome}</a></li>\n`;
      });

      mobileMenuHTML += `                </ul>\n`;
      mobileMenuHTML += `            </li>\n`;
    } else {
      mobileMenuHTML += `            <li><a href="planac-website.html#${menu.slug}">${menu.nome}</a></li>\n`;
    }
  });

  // Ler header.html atual
  const headerPath = path.join(__dirname, 'header.html');
  let headerContent = fs.readFileSync(headerPath, 'utf-8');

  // Substituir menus no header
  // Desktop menu
  headerContent = headerContent.replace(
    /(<nav class="nav-links">)([\s\S]*?)(<\/nav>)/,
    `$1\n${menuHTML}        $3`
  );

  // Mobile menu
  headerContent = headerContent.replace(
    /(<nav class="mobile-menu-content">\s*<ul>)([\s\S]*?)(<\/ul>\s*<\/nav>)/,
    `$1\n${mobileMenuHTML}        $3`
  );

  // Salvar header.html
  fs.writeFileSync(headerPath, headerContent, 'utf-8');

  console.log('✅ header.html atualizado com menus do banco');
}

/**
 * Executar sincronização
 */
async function sync() {
  try {
    console.log('🚀 Iniciando sincronização com banco de dados...\n');

    await updateHeader();

    console.log('\n✅ Sincronização concluída!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Executar build: node build-static-pages.js');
    console.log('   2. Commit: git add . && git commit -m "sync: Atualiza menus do banco"');
    console.log('   3. Push: git push');
    console.log('   4. GitHub Actions fará deploy automático');

  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
    process.exit(1);
  }
}

// Executar
sync();
