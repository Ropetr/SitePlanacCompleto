// Load Header and Footer Components
(function() {
    // Função para carregar um componente
    function loadComponent(url, elementId) {
        // Adiciona timestamp para evitar cache
        const cacheBuster = '?v=' + new Date().getTime();
        fetch(url + cacheBuster)
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

                    // Se for o header, reinicializar eventos do menu mobile
                    if (elementId === 'header-container') {
                        initializeHeaderEvents();
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao carregar componente:', error);
            });
    }

    // Função para inicializar eventos do header
    function initializeHeaderEvents() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuSidebar = document.querySelector('.mobile-menu-sidebar');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');

        // Função para abrir o menu
        function openMobileMenu() {
            if (mobileMenuBtn) mobileMenuBtn.classList.add('clicked');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
            if (mobileMenuSidebar) mobileMenuSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Função para fechar o menu
        function closeMobileMenu() {
            if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
            if (mobileMenuSidebar) mobileMenuSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Event listeners
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', openMobileMenu);
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        // Dropdowns do menu mobile
        document.querySelectorAll('.mobile-menu-dropdown > a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('open');
            });
        });

        // Submenus do menu mobile
        document.querySelectorAll('.mobile-menu-submenu > a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('open');
            });
        });

        // Fechar menu ao clicar em links finais
        document.querySelectorAll('.mobile-menu-content a[href*=".html"]').forEach(link => {
            // Não adicionar evento aos links que são toggles de dropdown
            if (!link.parentElement.classList.contains('mobile-menu-dropdown') &&
                !link.parentElement.classList.contains('mobile-menu-submenu')) {
                link.addEventListener('click', closeMobileMenu);
            }
        });

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Posicionar dropdowns dinamicamente ao passar o mouse
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (toggle && menu) {
                dropdown.addEventListener('mouseenter', function() {
                    const rect = toggle.getBoundingClientRect();
                    // Subtrai 457px para deslocar à esquerda (450 + 7 = 457)
                    const leftPos = (rect.left - 457) + 'px';
                    const width = rect.width + 'px';

                    // Posiciona o dropdown
                    menu.style.left = leftPos;
                    menu.style.minWidth = width;

                    // Atualiza o overlay escuro para seguir o dropdown
                    menu.style.setProperty('--dropdown-left', leftPos);
                    menu.style.setProperty('--dropdown-width', width);
                });
            }
        });
    }

    // Carregar os componentes quando a página carregar
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Carregando componentes - Versão 4.0 (header dinâmico da API)');

        // Carregar header dinâmico da API (com cache-busting)
        const API_URL = 'https://planac-backend-api.planacacabamentos.workers.dev';
        loadComponent(`${API_URL}/api/pages/header`, 'header-container');

        // Carregar outros componentes locais
        loadComponent('footer.html', 'footer-container');
        loadComponent('whatsapp-float.html', 'whatsapp-float-container');
    });
})();
