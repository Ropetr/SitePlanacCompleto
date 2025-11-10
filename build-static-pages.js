/**
 * ================================================
 * BUILD STATIC PAGES - Elimina CLS e Melhora LCP
 * ================================================
 *
 * Este script:
 * - Insere header.html e footer.html INLINE no HTML
 * - Elimina carregamento via fetch (que causa CLS)
 * - Melhora LCP com preload de imagens críticas
 * - Gera versões otimizadas de todas as páginas
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuração
const PAGES_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'dist');
const FOOTER_PATH = path.join(PAGES_DIR, 'footer.html');
const WHATSAPP_PATH = path.join(PAGES_DIR, 'whatsapp-float.html');
const HEADER_API_URL = 'https://planac-backend-api.planacacabamentos.workers.dev/api/pages/header';

/**
 * Buscar header do KV cache via API
 */
async function fetchHeaderFromAPI() {
  return new Promise((resolve, reject) => {
    https.get(HEADER_API_URL, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Header carregado da API (KV cache)');
          resolve(data);
        } else {
          console.error('❌ Erro ao buscar header da API:', res.statusCode);
          // Fallback: tentar ler arquivo local se API falhar
          const fallbackPath = path.join(PAGES_DIR, 'header.html');
          if (fs.existsSync(fallbackPath)) {
            console.log('⚠️  Usando header.html local como fallback');
            resolve(fs.readFileSync(fallbackPath, 'utf-8'));
          } else {
            reject(new Error('Header não encontrado na API nem localmente'));
          }
        }
      });
    }).on('error', (err) => {
      console.error('❌ Erro de rede ao buscar header:', err.message);
      // Fallback: tentar ler arquivo local
      const fallbackPath = path.join(PAGES_DIR, 'header.html');
      if (fs.existsSync(fallbackPath)) {
        console.log('⚠️  Usando header.html local como fallback');
        resolve(fs.readFileSync(fallbackPath, 'utf-8'));
      } else {
        reject(err);
      }
    });
  });
}

// Criar diretório de saída
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Processa um arquivo HTML
 */
function processHTMLFile(filePath, headerHTML, footerHTML, whatsappHTML) {
  console.log(`📄 Processando: ${path.basename(filePath)}`);

  let html = fs.readFileSync(filePath, 'utf-8');

  // Substituir containers por HTML inline
  html = html.replace(
    '<div id="header-container"></div>',
    headerHTML
  );

  html = html.replace(
    '<div id="footer-container"></div>',
    footerHTML
  );

  if (whatsappHTML) {
    html = html.replace(
      '<div id="whatsapp-float-container"></div>',
      whatsappHTML
    );
  }

  // Adicionar preload para imagens críticas (banner)
  const bannerMatch = html.match(/background-image:\s*url\(['"]([^'"]+)['"]\)/);
  if (bannerMatch && bannerMatch[1]) {
    const bannerUrl = bannerMatch[1];
    const preloadTag = `    <link rel="preload" as="image" href="${bannerUrl}" fetchpriority="high">\n`;

    // Inserir preload antes do </head>
    html = html.replace('</head>', `${preloadTag}</head>`);
  }

  // Adicionar preload para Logo
  const preloadLogo = `    <link rel="preload" as="image" href="Logo.svg" fetchpriority="high">\n`;
  html = html.replace('</head>', `${preloadLogo}</head>`);

  // Remover script load-components.js (não é mais necessário)
  html = html.replace(/<script src="load-components\.js(\?v=\d+)?"><\/script>\s*/g, '');

  // Adicionar scripts de inicialização inline (sem fetch)
  const initScript = `
    <script>
      // Inicialização inline - Sem CLS!
      (function() {
        console.log('🚀 Página carregada com header/footer inline - Zero CLS!');

        // Inicializar eventos do header/footer
        function initializeHeaderEvents() {
          const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
          const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
          const mobileMenuSidebar = document.querySelector('.mobile-menu-sidebar');
          const mobileMenuClose = document.querySelector('.mobile-menu-close');

          function openMobileMenu() {
            if (mobileMenuBtn) mobileMenuBtn.classList.add('clicked');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
            if (mobileMenuSidebar) mobileMenuSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
          }

          function closeMobileMenu() {
            if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
            if (mobileMenuSidebar) mobileMenuSidebar.classList.remove('active');
            document.body.style.overflow = '';
          }

          if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', openMobileMenu);
          }

          if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
          }

          if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
          }

          document.querySelectorAll('.mobile-menu-dropdown > a').forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              const parent = this.parentElement;
              parent.classList.toggle('open');
            });
          });

          document.querySelectorAll('.mobile-menu-submenu > a').forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              const parent = this.parentElement;
              parent.classList.toggle('open');
            });
          });

          document.querySelectorAll('.mobile-menu-content a[href*=".html"]').forEach(link => {
            if (!link.parentElement.classList.contains('mobile-menu-dropdown') &&
                !link.parentElement.classList.contains('mobile-menu-submenu')) {
              link.addEventListener('click', closeMobileMenu);
            }
          });

          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          });

          document.querySelectorAll('.dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (toggle && menu) {
              dropdown.addEventListener('mouseenter', function() {
                const rect = toggle.getBoundingClientRect();
                const leftPos = (rect.left - 457) + 'px';
                const width = rect.width + 'px';

                menu.style.left = leftPos;
                menu.style.minWidth = width;

                menu.style.setProperty('--dropdown-left', leftPos);
                menu.style.setProperty('--dropdown-width', width);
              });
            }
          });
        }

        // Executar quando DOM estiver pronto
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initializeHeaderEvents);
        } else {
          initializeHeaderEvents();
        }

        // Carregar menus dinâmicos após a página estar visível (não bloqueia renderização)
        setTimeout(() => {
          if (window.DynamicMenus) {
            window.DynamicMenus.updateHeaderWithDynamicMenus();
          }
        }, 100);
      })();
    </script>
  `;

  // Inserir script antes do </body>
  html = html.replace('</body>', `${initScript}\n</body>`);

  // Salvar arquivo processado
  const fileName = path.basename(filePath);
  const outputPath = path.join(OUTPUT_DIR, fileName);
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`✅ Salvo: ${fileName}`);
}

/**
 * Processar todos os arquivos .html
 */
async function processAllPages() {
  console.log('🚀 Iniciando build de páginas estáticas...\n');

  // Buscar header da API (KV cache)
  let headerHTML;
  try {
    headerHTML = await fetchHeaderFromAPI();
  } catch (error) {
    console.error('❌ Falha ao buscar header:', error.message);
    process.exit(1);
  }

  // Ler footer e whatsapp localmente (não mudam dinamicamente)
  const footerHTML = fs.readFileSync(FOOTER_PATH, 'utf-8');
  const whatsappHTML = fs.existsSync(WHATSAPP_PATH)
    ? fs.readFileSync(WHATSAPP_PATH, 'utf-8')
    : '';

  // Buscar todos os .html no diretório
  const files = fs.readdirSync(PAGES_DIR)
    .filter(file =>
      file.endsWith('.html') &&
      file !== 'header.html' &&
      file !== 'footer.html' &&
      file !== 'whatsapp-float.html'
    );

  let processedCount = 0;

  files.forEach(file => {
    const filePath = path.join(PAGES_DIR, file);
    try {
      processHTMLFile(filePath, headerHTML, footerHTML, whatsappHTML);
      processedCount++;
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error.message);
    }
  });

  console.log(`\n✅ Build completo! ${processedCount}/${files.length} páginas processadas.`);
  console.log(`📂 Saída: ${OUTPUT_DIR}`);
  console.log('\n🎯 Resultado:');
  console.log('   ✅ CLS eliminado (header/footer inline)');
  console.log('   ✅ LCP otimizado (preload de imagens)');
  console.log('   ✅ Zero JavaScript bloqueante');
  console.log('   ✅ Header dinâmico do KV cache');
}

// Executar
processAllPages().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
