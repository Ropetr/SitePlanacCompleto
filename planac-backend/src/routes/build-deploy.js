/**
 * ===============================================
 * BUILD & DEPLOY WORKER
 * ===============================================
 * Aciona build e deploy automaticamente quando
 * uma página ou menu é salvo/editado no Admin.
 */

import { Hono } from 'hono';

const buildDeploy = new Hono();

/**
 * Buscar menus ativos
 */
async function fetchMenus(env) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM menus
    WHERE ativo = 1
    ORDER BY ordem
  `).all();

  return results;
}

/**
 * Buscar produtos publicados
 */
async function fetchProducts(env) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM pages
    WHERE status = 'PUBLICADO'
    ORDER BY ordem
  `).all();

  return results;
}

/**
 * Gerar HTML do header com menus dinâmicos
 */
function generateHeaderHTML(menus, products) {
  // Separar menus principais de submenus
  const mainMenus = menus.filter(m => !m.menu_pai_id);
  const submenusByParent = {};

  menus.forEach(menu => {
    if (menu.menu_pai_id) {
      if (!submenusByParent[menu.menu_pai_id]) {
        submenusByParent[menu.menu_pai_id] = [];
      }
      submenusByParent[menu.menu_pai_id].push(menu);
    }
  });

  // Agrupar produtos por menu
  const productsByMenu = {};
  products.forEach(product => {
    if (!productsByMenu[product.menu_id]) {
      productsByMenu[product.menu_id] = [];
    }
    productsByMenu[product.menu_id].push(product);
  });

  // Gerar menu desktop (apenas menus principais)
  let menuHTML = '';
  mainMenus.forEach(menu => {
    const menuProducts = productsByMenu[menu.id] || [];
    const submenus = submenusByParent[menu.id] || [];
    const hasDropdown = menuProducts.length > 0 || submenus.length > 0;

    if (hasDropdown) {
      // Dropdown com produtos e/ou submenus
      menuHTML += `            <li class="dropdown">\n`;
      menuHTML += `                <a href="planac-website.html#${menu.slug}" class="dropdown-toggle">${menu.nome}</a>\n`;
      menuHTML += `                <ul class="dropdown-menu">\n`;

      // Adicionar submenus primeiro com dropdown aninhado
      submenus.forEach(submenu => {
        const submenuProducts = productsByMenu[submenu.id] || [];

        if (submenuProducts.length > 0) {
          // Submenu com produtos: cria dropdown aninhado
          menuHTML += `                    <li class="dropdown-submenu">\n`;
          menuHTML += `                        <a href="#" class="dropdown-toggle-sub">${submenu.nome} →</a>\n`;
          menuHTML += `                        <ul class="dropdown-menu-sub">\n`;

          submenuProducts.forEach(product => {
            menuHTML += `                            <li><a href="${product.slug}.html">${product.nome}</a></li>\n`;
          });

          menuHTML += `                        </ul>\n`;
          menuHTML += `                    </li>\n`;
        } else {
          // Submenu sem produtos: link direto
          menuHTML += `                    <li><a href="planac-website.html#${submenu.slug}">${submenu.nome}</a></li>\n`;
        }
      });

      // Depois adicionar produtos diretos do menu pai
      menuProducts.forEach(product => {
        menuHTML += `                    <li><a href="${product.slug}.html">${product.nome}</a></li>\n`;
      });

      menuHTML += `                </ul>\n`;
      menuHTML += `            </li>\n`;
    } else {
      // Link direto (sem dropdown)
      menuHTML += `            <a href="planac-website.html#${menu.slug}">${menu.nome}</a>\n`;
    }
  });

  // Gerar menu mobile (apenas menus principais)
  let mobileMenuHTML = '';
  mainMenus.forEach(menu => {
    const menuProducts = productsByMenu[menu.id] || [];
    const submenus = submenusByParent[menu.id] || [];
    const hasDropdown = menuProducts.length > 0 || submenus.length > 0;

    if (hasDropdown) {
      mobileMenuHTML += `            <li class="mobile-menu-dropdown">\n`;
      mobileMenuHTML += `                <a href="planac-website.html#${menu.slug}">${menu.nome}</a>\n`;
      mobileMenuHTML += `                <ul>\n`;

      // Adicionar submenus primeiro com dropdown aninhado no mobile
      submenus.forEach(submenu => {
        const submenuProducts = productsByMenu[submenu.id] || [];

        if (submenuProducts.length > 0) {
          // Submenu com produtos: cria dropdown aninhado
          mobileMenuHTML += `                    <li class="mobile-menu-submenu">\n`;
          mobileMenuHTML += `                        <a href="#">${submenu.nome}</a>\n`;
          mobileMenuHTML += `                        <ul>\n`;

          submenuProducts.forEach(product => {
            mobileMenuHTML += `                            <li><a href="${product.slug}.html">${product.nome}</a></li>\n`;
          });

          mobileMenuHTML += `                        </ul>\n`;
          mobileMenuHTML += `                    </li>\n`;
        } else {
          // Submenu sem produtos: link direto
          mobileMenuHTML += `                    <li><a href="planac-website.html#${submenu.slug}">${submenu.nome}</a></li>\n`;
        }
      });

      // Depois adicionar produtos diretos do menu pai
      menuProducts.forEach(product => {
        mobileMenuHTML += `                    <li><a href="${product.slug}.html">${product.nome}</a></li>\n`;
      });

      mobileMenuHTML += `                </ul>\n`;
      mobileMenuHTML += `            </li>\n`;
    } else {
      mobileMenuHTML += `            <li><a href="planac-website.html#${menu.slug}">${menu.nome}</a></li>\n`;
    }
  });

  // Template do header
  return `<header>
    <div class="header-logo">
        <a href="https://siteplanaccompleto.pages.dev/">
            <img src="Logo.svg" alt="Planac Logo">
        </a>
    </div>
    <div class="header-nav">
        <nav class="nav-links">
${menuHTML}        </nav>
        <div class="header-buttons">
            <a href="https://www.instagram.com/planacdistribuidora/" target="_blank" class="instagram-btn">
                <img src="Instagram.svg" alt="Instagram" width="35" height="35">
            </a>
        </div>
        <button class="mobile-menu-btn">☰</button>
    </div>
</header>

<!-- Mobile Menu -->
<div class="mobile-menu-overlay"></div>
<div class="mobile-menu-sidebar">
    <div class="mobile-menu-header">
        <h2 style="color: #fff; margin: 0; font-size: 2rem; text-shadow: 0 0 8px rgba(0,0,0,0.8); position: relative; z-index: 1;">Menu</h2>
        <button class="mobile-menu-close">×</button>
    </div>
    <nav class="mobile-menu-content">
        <ul>
${mobileMenuHTML}        </ul>
    </nav>
</div>`;
}

/**
 * Acionar deploy via Cloudflare Pages API
 */
async function triggerDeploy(env, headerHTML) {
  try {
    // 1. Salvar header atualizado no KV (cache)
    await env.SITE_CACHE.put('header.html', headerHTML);

    // 2. Invalidar cache do site
    await env.SITE_CACHE.put('cache:invalidated_at', Date.now().toString());

    console.log('✅ Cache atualizado e invalidado');

    // 3. Acionar deploy via webhook (se configurado)
    if (env.DEPLOY_WEBHOOK_URL) {
      const webhookResponse = await fetch(env.DEPLOY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger: 'admin_save',
          timestamp: new Date().toISOString(),
        }),
      });

      console.log('✅ Deploy webhook acionado:', webhookResponse.status);
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao acionar deploy:', error);
    return false;
  }
}

// ===============================================
// POST /api/admin/build-deploy
// ===============================================
buildDeploy.post('/', async (c) => {
  try {
    console.log('🚀 Iniciando build e deploy automático...');

    // 1. Buscar menus e produtos
    const menus = await fetchMenus(c.env);
    const products = await fetchProducts(c.env);

    console.log(`📋 ${menus.length} menus encontrados`);
    console.log(`📄 ${products.length} produtos encontrados`);

    // 2. Gerar header HTML
    const headerHTML = generateHeaderHTML(menus, products);

    // 3. Acionar deploy
    const deployed = await triggerDeploy(c.env, headerHTML);

    if (deployed) {
      return c.json({
        success: true,
        message: 'Build e deploy acionados com sucesso',
        data: {
          menus: menus.length,
          products: products.length,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      return c.json({
        success: false,
        error: 'Erro ao acionar deploy',
      }, 500);
    }

  } catch (error) {
    console.error('❌ Erro no build/deploy:', error);
    return c.json({
      success: false,
      error: 'Erro ao processar build e deploy',
    }, 500);
  }
});

// ===============================================
// GET /api/admin/build-deploy/status
// ===============================================
buildDeploy.get('/status', async (c) => {
  try {
    // Buscar última invalidação do cache
    const lastInvalidated = await c.env.SITE_CACHE.get('cache:invalidated_at');

    return c.json({
      success: true,
      data: {
        last_build: lastInvalidated ? new Date(parseInt(lastInvalidated)).toISOString() : null,
        cache_available: !!lastInvalidated,
      },
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Erro ao verificar status',
    }, 500);
  }
});

export default buildDeploy;
