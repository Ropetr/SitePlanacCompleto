/**
 * ===========================================
 * RENDERIZAÇÃO DINÂMICA DA HOME PAGE
 * ===========================================
 * Busca dados da página Index e produtos para renderizar seções dinamicamente
 */

const API_URL = 'https://planac-backend-api.ropetrsergio.workers.dev';

/**
 * Busca dados da página Home
 */
async function fetchHomePage() {
    try {
        const response = await fetch(`${API_URL}/api/products/index`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        }
    } catch (error) {
        console.error('Erro ao buscar página home:', error);
    }

    return null;
}

/**
 * Busca produtos por menu
 */
async function fetchProductsByMenu(menuSlug) {
    try {
        const response = await fetch(`${API_URL}/api/products?categoria=${menuSlug}&status=PUBLICADO&limit=10`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        }
    } catch (error) {
        console.error(`Erro ao buscar produtos do menu ${menuSlug}:`, error);
    }

    return [];
}

/**
 * Busca todos os produtos para as seções da home
 */
async function fetchHomeProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products?status=PUBLICADO&destaque=true&limit=50`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        }
    } catch (error) {
        console.error('Erro ao buscar produtos da home:', error);
    }

    return [];
}

/**
 * Renderiza cards de produtos por menu
 */
function renderProductCards(products, limit = 3) {
    return products.slice(0, limit).map(product => `
        <div class="service-card" style="background-image: url('${product.imagem_banner || 'https://via.placeholder.com/400x300'}')">
            <div class="service-content">
                <h2>${product.nome}</h2>
                <h6>${product.subtitulo || ''}</h6>
                <a href="${product.slug}.html" class="btn-primary">Saiba Mais</a>
            </div>
        </div>
    `).join('');
}

/**
 * Atualiza seção de Forros
 */
async function updateForrosSection() {
    const forrosProducts = await fetchProductsByMenu('forros');

    if (forrosProducts.length > 0) {
        const forrosGrid = document.querySelector('#forros .services-grid');
        if (forrosGrid) {
            forrosGrid.innerHTML = renderProductCards(forrosProducts, 3);
        }
    }
}

/**
 * Atualiza seção de Divisórias
 */
async function updateDivisoriasSection() {
    const divisoriasProducts = await fetchProductsByMenu('divisorias');

    if (divisoriasProducts.length > 0) {
        const divisoriasGrid = document.querySelector('#divisorias .services-grid');
        if (divisoriasGrid) {
            divisoriasGrid.innerHTML = renderProductCards(divisoriasProducts, 3);
        }
    }
}

/**
 * Atualiza banner principal
 */
async function updateBanner() {
    const homePage = await fetchHomePage();

    if (homePage) {
        // Atualizar imagem de fundo do banner
        if (homePage.imagem_banner) {
            const banner = document.querySelector('.banner');
            if (banner) {
                banner.style.backgroundImage = `url('${homePage.imagem_banner}')`;
            }
        }

        // Atualizar título
        if (homePage.descricao_curta) {
            const bannerTitle = document.querySelector('.banner h1');
            if (bannerTitle) {
                bannerTitle.textContent = homePage.descricao_curta;
            }
        }

        // Atualizar subtítulo
        if (homePage.subtitulo) {
            const bannerSubtitle = document.querySelector('.banner p');
            if (bannerSubtitle) {
                bannerSubtitle.innerHTML = homePage.subtitulo.replace(/\n/g, '<br>');
            }
        }
    }
}

/**
 * Atualiza cards de features
 */
async function updateFeatureCards() {
    const homePage = await fetchHomePage();

    if (homePage && homePage.caracteristicas) {
        try {
            let features = [];

            // Parse do JSON de características
            if (typeof homePage.caracteristicas === 'string') {
                features = JSON.parse(homePage.caracteristicas);
            } else if (Array.isArray(homePage.caracteristicas)) {
                features = homePage.caracteristicas;
            }

            if (features.length > 0) {
                const cardsGrid = document.querySelector('.cards-grid');
                if (cardsGrid) {
                    cardsGrid.innerHTML = features.map(feature => {
                        // Feature format: "TEXTO|URL_IMAGEM"
                        const [text, imageUrl] = feature.split('|');
                        return `
                            <div class="card">
                                <div class="card-icon">
                                    <img src="${imageUrl || 'https://via.placeholder.com/60'}" alt="${text}">
                                </div>
                                <h4>${text}</h4>
                            </div>
                        `;
                    }).join('');
                }
            }
        } catch (error) {
            console.error('Erro ao processar features:', error);
        }
    }
}

/**
 * Atualiza seção Sobre
 */
async function updateAboutSection() {
    const homePage = await fetchHomePage();

    if (homePage && homePage.descricao_completa) {
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            // Manter h5 e h2, substituir parágrafos
            const paragraphs = homePage.descricao_completa.split('\n\n');
            const paragraphsHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');

            // Encontrar e atualizar apenas os parágrafos
            const existingParagraphs = aboutText.querySelectorAll('p');
            if (existingParagraphs.length > 0) {
                // Remover parágrafos antigos
                existingParagraphs.forEach(p => p.remove());

                // Adicionar novos parágrafos
                aboutText.insertAdjacentHTML('beforeend', paragraphsHTML);
            }
        }
    }

    // Atualizar Missão, Visão, Valores
    if (homePage && homePage.especificacoes) {
        try {
            let mvv = {};

            if (typeof homePage.especificacoes === 'string') {
                mvv = JSON.parse(homePage.especificacoes);
            } else {
                mvv = homePage.especificacoes;
            }

            // Atualizar Missão
            if (mvv.missao) {
                const missaoCard = document.querySelector('.value-card:nth-child(1) p');
                if (missaoCard) missaoCard.textContent = mvv.missao;
            }

            // Atualizar Visão
            if (mvv.visao) {
                const visaoCard = document.querySelector('.value-card:nth-child(2) p');
                if (visaoCard) visaoCard.textContent = mvv.visao;
            }

            // Atualizar Valores
            if (mvv.valores) {
                const valoresCard = document.querySelector('.value-card:nth-child(3) p');
                if (valoresCard) valoresCard.textContent = mvv.valores;
            }
        } catch (error) {
            console.error('Erro ao processar Missão/Visão/Valores:', error);
        }
    }
}

/**
 * Inicializa renderização dinâmica da home
 */
async function initDynamicHome() {
    console.log('🏠 Iniciando renderização dinâmica da home...');

    try {
        await Promise.all([
            updateBanner(),
            updateFeatureCards(),
            updateForrosSection(),
            updateDivisoriasSection(),
            updateAboutSection()
        ]);

        console.log('✅ Home renderizada dinamicamente com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao renderizar home:', error);
    }
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicHome);
} else {
    initDynamicHome();
}

// Exportar para uso externo
window.DynamicHome = {
    fetchHomePage,
    fetchHomeProducts,
    initDynamicHome
};
