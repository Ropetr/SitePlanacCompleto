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
        // Menu mobile
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                this.classList.add('clicked');
                alert('Menu mobile: navegue usando os links do rodapé ou o botão WhatsApp!');
            });
        }

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
    }

    // Carregar os componentes quando a página carregar
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Carregando componentes - Versão 2.0');
        loadComponent('header.html', 'header-container');
        loadComponent('footer.html', 'footer-container');
        loadComponent('whatsapp-float.html', 'whatsapp-float-container');
    });
})();
