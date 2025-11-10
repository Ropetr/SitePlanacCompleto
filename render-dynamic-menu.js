/**
 * ===========================================
 * RENDERIZAÇÃO DINÂMICA DE MENUS
 * ===========================================
 * Busca menus da API e renderiza header/footer dinamicamente
 */

const API_URL = 'https://planac-backend-api.ropetrsergio.workers.dev';

// Cache para evitar múltiplas chamadas
let menusCache = null;
let productsCache = null;

/**
 * Busca todos os menus da API
 */
async function fetchMenus() {
    if (menusCache) return menusCache;

    try {
        const response = await fetch(`${API_URL}/api/menus?status=ativo`);
        const data = await response.json();

        if (data.success) {
            menusCache = data.data;
            return menusCache;
        }
    } catch (error) {
        console.error('Erro ao buscar menus:', error);
    }

    return [];
}

/**
 * Busca todos os produtos publicados
 */
async function fetchProducts() {
    if (productsCache) return productsCache;

    try {
        const response = await fetch(`${API_URL}/api/products?status=PUBLICADO&limit=100`);
        const data = await response.json();

        if (data.success) {
            productsCache = data.data;
            return productsCache;
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }

    return [];
}

/**
 * Organiza produtos por menu
 */
function groupProductsByMenu(products) {
    const grouped = {};

    products.forEach(product => {
        const menuId = product.menu_id;
        const menuName = product.menu_nome || 'Outros';
        const menuSlug = product.menu_slug || 'outros';

        if (!grouped[menuId]) {
            grouped[menuId] = {
                id: menuId,
                nome: menuName,
                slug: menuSlug,
                produtos: []
            };
        }

        grouped[menuId].produtos.push(product);
    });

    return Object.values(grouped);
}

/**
 * Renderiza menu dropdown do header
 */
function renderHeaderMenu(menus, products) {
    const groupedProducts = groupProductsByMenu(products);

    let menuHTML = '';

    // Criar dropdown para cada menu que tem produtos
    groupedProducts.forEach(menu => {
        if (menu.produtos.length === 0) return;

        menuHTML += `
        <li class="dropdown">
            <a href="planac-website.html#${menu.slug}" class="dropdown-toggle">${menu.nome}</a>
            <ul class="dropdown-menu">
        `;

        // Adicionar produtos ao dropdown
        menu.produtos.forEach(product => {
            menuHTML += `
                <li><a href="${product.slug}.html">${product.nome}</a></li>
            `;
        });

        menuHTML += `
            </ul>
        </li>
        `;
    });

    // Adicionar links fixos
    menuHTML += `
        <a href="planac-website.html#sobre">Sobre</a>
        <a href="planac-website.html#contato">Contato</a>
    `;

    return menuHTML;
}

/**
 * Renderiza menu mobile
 */
function renderMobileMenu(menus, products) {
    const groupedProducts = groupProductsByMenu(products);

    let menuHTML = '';

    groupedProducts.forEach(menu => {
        if (menu.produtos.length === 0) return;

        menuHTML += `
        <li class="mobile-menu-dropdown">
            <a href="planac-website.html#${menu.slug}">${menu.nome}</a>
            <ul>
        `;

        menu.produtos.forEach(product => {
            menuHTML += `
                <li><a href="${product.slug}.html">${product.nome}</a></li>
            `;
        });

        menuHTML += `
            </ul>
        </li>
        `;
    });

    // Links fixos
    menuHTML += `
        <li><a href="planac-website.html#sobre">Sobre</a></li>
        <li><a href="planac-website.html#contato">Contato</a></li>
    `;

    return menuHTML;
}

/**
 * Atualiza o header com menus dinâmicos
 */
async function updateHeaderWithDynamicMenus() {
    try {
        const menus = await fetchMenus();
        const products = await fetchProducts();

        // Atualizar nav-links (desktop)
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.innerHTML = renderHeaderMenu(menus, products);
        }

        // Atualizar mobile menu
        const mobileMenuContent = document.querySelector('.mobile-menu-content ul');
        if (mobileMenuContent) {
            mobileMenuContent.innerHTML = renderMobileMenu(menus, products);
        }

        console.log('✅ Menus dinâmicos carregados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao carregar menus dinâmicos:', error);
    }
}

/**
 * Inicializar quando o DOM estiver pronto
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeaderWithDynamicMenus);
} else {
    updateHeaderWithDynamicMenus();
}

// Exportar para uso externo
window.DynamicMenus = {
    fetchMenus,
    fetchProducts,
    updateHeaderWithDynamicMenus
};
