/**
 * PLANAC DISTRIBUIDORA - Component Loader
 * Carrega header, footer e whatsapp-float dinamicamente
 */
(function() {
    'use strict';

    // Versão dos componentes (atualizar quando modificar components/)
    const COMPONENTS_VERSION = '1.0.0';

    /**
     * Carrega um componente HTML externo
     * @param {string} url - Caminho do componente
     * @param {string} elementId - ID do container de destino
     */
    function loadComponent(url, elementId) {
        fetch(`${url}?v=${COMPONENTS_VERSION}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                const container = document.getElementById(elementId);
                if (container) {
                    container.innerHTML = html;

                    if (elementId === 'header-container') {
                        initializeHeaderEvents();
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao carregar componente:', error);
            });
    }

    /**
     * Inicializa eventos do header após carregamento
     */
    function initializeHeaderEvents() {
        // Menu mobile - mostra toast ao invés de alert
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                this.classList.add('clicked');

                // Scroll suave para o rodapé
                const footer = document.querySelector('footer');
                if (footer) {
                    footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // Smooth scroll para todos os links internos
        initializeSmoothScroll();
    }

    /**
     * Configura scroll suave para links âncora
     */
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Ignora links vazios ou só com #
                if (!href || href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Inicialização quando DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        loadComponent('components/header.html', 'header-container');
        loadComponent('components/footer.html', 'footer-container');
        loadComponent('components/whatsapp-float.html', 'whatsapp-float-container');
    });
})();
