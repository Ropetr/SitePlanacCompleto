#!/usr/bin/env node

/**
 * Script para rebuild automático de páginas HTML
 * Executado após editar página no admin
 *
 * Uso: node auto-rebuild-page.js <slug>
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const API_URL = 'https://planac-backend-api.planacacabamentos.workers.dev';

async function rebuildPage(slug) {
  try {
    console.log(`🔨 Iniciando rebuild da página: ${slug}`);

    // 1. Buscar dados da página do banco via API
    console.log(`📡 Buscando dados da API...`);
    const response = await fetch(`${API_URL}/api/products/${slug}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar página: ${response.status}`);
    }

    const { data: page } = await response.json();
    console.log(`✅ Página encontrada: ${page.nome}`);

    // 2. Gerar HTML
    console.log(`🔧 Gerando HTML...`);
    const html = generatePageHTML(page);

    // 3. Salvar arquivo
    const fileName = `${slug}.html`;
    const filePath = path.join(__dirname, fileName);

    await fs.writeFile(filePath, html, 'utf8');
    console.log(`💾 Arquivo salvo: ${fileName}`);

    // 4. Fazer commit
    console.log(`📦 Fazendo commit...`);
    execSync(`git add "${fileName}"`, { stdio: 'inherit' });

    const commitMessage = `chore: Auto-rebuild de ${page.nome} (${slug})

Atualização automática via Admin Panel

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    console.log(`✅ Commit realizado`);

    // 5. Push para GitHub
    console.log(`🚀 Fazendo push para GitHub...`);
    execSync(`git push`, { stdio: 'inherit' });
    console.log(`✅ Push realizado - Deploy automático será iniciado pelo Cloudflare Pages`);

    return {
      success: true,
      slug,
      fileName,
      message: 'Página rebuiltada e deploy iniciado com sucesso'
    };

  } catch (error) {
    console.error(`❌ Erro ao rebuild:`, error.message);
    throw error;
  }
}

/**
 * Gera HTML completo da página
 */
function generatePageHTML(page) {
  // Parse de campos JSON
  const caracteristicas = parseJSONField(page.caracteristicas);
  const vantagens = parseJSONField(page.vantagens);
  const aplicacoes = parseJSONField(page.aplicacoes);
  const normas = parseJSONField(page.normas_certificacoes);
  const galeria = parseJSONField(page.galeria_imagens);
  const especificacoes = page.especificacoes || '';

  // Imagem banner com fallback
  const imagemBanner = page.imagem_banner || 'https://painel-planac.codiehost.com.br/uploads/placeholder-service.jpg';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.meta_title || page.nome + ' - Planac Distribuidora'}</title>
    <meta name="description" content="${escapeHTML(page.meta_description || page.descricao_curta || '')}">
    <meta name="keywords" content="${escapeHTML(page.meta_keywords || '')}">
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
            font-size: 10px;
        }

        body {
            font-family: 'Barlow', sans-serif;
            overflow-x: hidden;
        }

        .container {
            max-width: 1410px;
            width: 90%;
            margin: 0 auto;
            padding: 0 15px;
        }

        /* Service Banner */
        .service-banner {
            width: 100%;
            height: 60vh;
            min-height: 400px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center;
            margin-top: 0;
        }

        .service-banner::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
        }

        .service-banner-content {
            position: relative;
            z-index: 2;
            text-align: center;
            color: #fff;
            max-width: 900px;
        }

        .service-banner h1 {
            font-size: clamp(3.5rem, 6vw, 6rem);
            margin-bottom: 20px;
            text-transform: uppercase;
            filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.6));
        }

        .service-banner p {
            font-size: clamp(1.8rem, 2.5vw, 2.4rem);
            filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.6));
        }

        /* Breadcrumb */
        .breadcrumb {
            padding: 20px 0;
            background: #f6f8fb;
        }

        .breadcrumb-list {
            display: flex;
            gap: 10px;
            list-style: none;
            font-size: 1.4rem;
            flex-wrap: wrap;
        }

        .breadcrumb-list li {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .breadcrumb-list a {
            color: #AA000E;
            text-decoration: none;
        }

        .breadcrumb-list a:hover {
            text-decoration: underline;
        }

        .breadcrumb-list span {
            color: #666;
        }

        /* Service Content */
        .service-content {
            padding: 80px 0;
            background: #fff;
        }

        .service-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 50px;
            align-items: start;
        }

        .service-main {
            background: #fff;
        }

        .service-main h2 {
            font-size: 3.6rem;
            color: #AA000E;
            margin-bottom: 30px;
            text-transform: uppercase;
        }

        .service-main h3 {
            font-size: 2.8rem;
            color: #3d3d3d;
            margin: 40px 0 20px;
        }

        .service-main p {
            font-size: 1.8rem;
            line-height: 1.8;
            color: #3d3d3d;
            margin-bottom: 20px;
            text-align: justify;
        }

        .service-main ul {
            list-style: none;
            padding-left: 0;
            margin: 20px 0;
        }

        .service-main li {
            font-size: 1.8rem;
            padding: 12px 0 12px 30px;
            position: relative;
            color: #3d3d3d;
        }

        .service-main li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #AA000E;
            font-weight: bold;
            font-size: 2rem;
        }

        /* Highlight Box */
        .highlight-box {
            background: linear-gradient(135deg, #AA000E 0%, #96181c 100%);
            color: #fff;
            padding: 30px;
            border-radius: 10px;
            margin: 30px 0;
            box-shadow: 0 5px 20px rgba(170,0,14,0.2);
        }

        .highlight-box h4 {
            font-size: 2.4rem;
            margin-bottom: 15px;
        }

        .highlight-box p {
            font-size: 1.8rem;
            color: #fff;
            text-align: left;
        }

        /* Gallery */
        .service-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .gallery-item {
            position: relative;
            height: 250px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: 0.3s;
        }

        .gallery-item:hover {
            transform: scale(1.05);
        }

        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Sidebar */
        .service-sidebar {
            position: sticky;
            top: 180px;
        }

        .sidebar-card {
            background: #f6f8fb;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .sidebar-card h3 {
            font-size: 2.4rem;
            color: #AA000E;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .sidebar-card ul {
            list-style: none;
        }

        .sidebar-card li {
            margin-bottom: 15px;
        }

        .sidebar-card a {
            color: #3d3d3d;
            text-decoration: none;
            font-size: 1.6rem;
            display: block;
            padding: 10px;
            border-radius: 5px;
            transition: 0.3s;
        }

        .sidebar-card a:hover,
        .sidebar-card a.active {
            background: #fff;
            color: #AA000E;
            padding-left: 20px;
        }

        /* CTA Section */
        .cta-section {
            background: linear-gradient(135deg, #AA000E 0%, #96181c 100%);
            padding: 60px 0;
            text-align: center;
            color: #fff;
        }

        .cta-section h2 {
            font-size: 4rem;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .cta-section p {
            font-size: 2rem;
            margin-bottom: 40px;
        }

        .btn-primary {
            background: #fff;
            color: #AA000E;
            padding: 15px 40px;
            border-radius: 10px;
            text-decoration: none;
            font-size: 1.8rem;
            font-weight: 700;
            display: inline-block;
            transition: 0.3s;
        }

        .btn-primary:hover {
            background: #ec3237;
            color: #fff;
            transform: translateY(-3px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        /* Quote Form */
        .quote-form-section {
            padding: 80px 0;
            background: #f6f8fb;
        }

        .quote-form-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 50px;
            border-radius: 10px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }

        .quote-form-container h2 {
            font-size: 3.6rem;
            color: #AA000E;
            margin-bottom: 30px;
            text-align: center;
            text-transform: uppercase;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            font-size: 1.6rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: #3d3d3d;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1.6rem;
            font-family: 'Barlow', sans-serif;
            transition: 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #AA000E;
            box-shadow: 0 0 0 3px rgba(170,0,14,0.1);
        }

        .form-group textarea {
            min-height: 150px;
            resize: vertical;
        }

        .form-group button {
            width: 100%;
            background: #AA000E;
            color: #fff;
            padding: 18px;
            border: none;
            border-radius: 8px;
            font-size: 1.8rem;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
        }

        .form-group button:hover {
            background: #96181c;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(170,0,14,0.3);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .service-grid {
                grid-template-columns: 1fr;
            }

            .service-sidebar {
                position: static;
            }

            .service-banner {
                margin-top: 130px;
            }
        }

        @media (max-width: 768px) {
            .service-banner {
                height: 50vh;
                min-height: 300px;
            }

            .quote-form-container {
                padding: 30px 20px;
            }
        }
    </style>
    <link rel="stylesheet" href="styles-components.css?v=8">
</head>
<body>
    <!-- Header Container -->
    <div id="header-container"></div>

    <!-- Service Banner -->
    <section class="service-banner" style="background-image: url('${imagemBanner}')">
        <div class="service-banner-content">
            <h1>${escapeHTML(page.nome)}</h1>
            ${page.subtitulo ? `<p>${escapeHTML(page.subtitulo)}</p>` : ''}
        </div>
    </section>

    <!-- Breadcrumb -->
    <section class="breadcrumb">
        <div class="container">
            <ul class="breadcrumb-list">
                <li><a href="index.html">Início</a></li>
                <li>›</li>
                <li><a href="index.html#${page.menu_slug || page.slug}">${page.menu_nome || 'Serviços'}</a></li>
                <li>›</li>
                <li><span>${escapeHTML(page.nome)}</span></li>
            </ul>
        </div>
    </section>

    <!-- Service Content -->
    <section class="service-content">
        <div class="container">
            <div class="service-grid">
                <!-- Main Content -->
                <div class="service-main">
                    <h2>${escapeHTML(page.nome)}</h2>

                    ${page.descricao_completa ? `
                    <p>${escapeHTML(page.descricao_completa).replace(/\n/g, '</p><p>')}</p>
                    ` : ''}

                    ${page.descricao_curta && !page.descricao_completa ? `
                    <div class="highlight-box">
                        <h4>Sobre o Produto</h4>
                        <p>${escapeHTML(page.descricao_curta)}</p>
                    </div>
                    ` : ''}

                    ${caracteristicas.length > 0 ? `
                    <h3>Características Principais</h3>
                    <ul>
                        ${caracteristicas.map(item => `<li>${escapeHTML(item)}</li>`).join('\n                        ')}
                    </ul>
                    ` : ''}

                    ${vantagens.length > 0 ? `
                    <h3>Vantagens</h3>
                    <ul>
                        ${vantagens.map(item => `<li>${escapeHTML(item)}</li>`).join('\n                        ')}
                    </ul>
                    ` : ''}

                    ${aplicacoes.length > 0 ? `
                    <h3>Aplicações</h3>
                    <ul>
                        ${aplicacoes.map(item => `<li>${escapeHTML(item)}</li>`).join('\n                        ')}
                    </ul>
                    ` : ''}

                    ${especificacoes ? `
                    <h3>Especificações Técnicas</h3>
                    <p>${escapeHTML(especificacoes).replace(/\n/g, '<br>')}</p>
                    ` : ''}

                    ${normas.length > 0 ? `
                    <h3>Normas e Certificações</h3>
                    <ul>
                        ${normas.map(item => `<li>${escapeHTML(item)}</li>`).join('\n                        ')}
                    </ul>
                    ` : ''}

                    ${galeria.length > 0 ? `
                    <h3>Galeria de Imagens</h3>
                    <div class="service-gallery">
                        ${galeria.map(img => `
                        <div class="gallery-item">
                            <img src="${img}" alt="${escapeHTML(page.nome)}" loading="lazy">
                        </div>
                        `).join('\n                        ')}
                    </div>
                    ` : ''}

                    <p>
                        Nossa equipe está pronta para auxiliar você na escolha do produto perfeito para seu projeto. Entre em contato e solicite seu orçamento!
                    </p>
                </div>

                <!-- Sidebar -->
                <aside class="service-sidebar">
                    <!-- Produtos Relacionados -->
                    <div class="sidebar-card">
                        <h3>Produtos Relacionados</h3>
                        <ul>
                            <li><a href="index.html#forros">Forros</a></li>
                            <li><a href="index.html#divisorias">Divisórias</a></li>
                            <li><a href="index.html#portas">Kit Portas</a></li>
                            <li><a href="index.html#drywall">Drywall</a></li>
                        </ul>
                    </div>

                    <!-- Contato Rápido -->
                    <div class="sidebar-card">
                        <h3>Fale Conosco</h3>
                        <p style="font-size: 1.6rem; margin-bottom: 15px;">Entre em contato para mais informações ou solicite um orçamento:</p>
                        <a href="https://api.whatsapp.com/send/?phone=5543984182582&text=Olá,%20Planac!%20Gostaria%20de%20orçamento%20para%20${encodeURIComponent(page.nome)}."
                           target="_blank"
                           style="background: #20b038; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: center; gap: 10px; border-radius: 8px; text-decoration: none;">
                            <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path d="M15.064 13.442c-.231.573-1.276 1.096-1.737 1.12-.46.024-.474.357-2.984-.734-2.51-1.09-4.02-3.743-4.14-3.914-.118-.17-.971-1.386-.925-2.61.046-1.223.716-1.8.955-2.04a.961.961 0 0 1 .68-.287c.198-.003.326-.006.472 0 .146.005.366-.031.556.474.19.506.645 1.748.703 1.875.058.127.094.273.004.436-.09.163-.135.265-.266.406-.13.14-.275.314-.392.422-.13.118-.267.248-.13.503.137.254.61 1.087 1.33 1.774.925.882 1.723 1.175 1.968 1.308.247.134.394.12.546-.041.152-.16.654-.703.83-.945.177-.243.342-.195.57-.104.226.091 1.435.739 1.681.873.246.133.41.202.47.308.058.106.04.604-.191 1.176zM10.18 0C4.76 0 .363 4.362.363 9.742c0 1.841.515 3.563 1.409 5.031L0 20l5.436-1.727a9.838 9.838 0 0 0 4.745 1.212c5.423 0 9.819-4.362 9.819-9.742C20 4.362 15.604 0 10.181 0z"></path></svg>
                            WhatsApp
                        </a>
                    </div>

                    <!-- Horário de Atendimento -->
                    <div class="sidebar-card">
                        <h3>Atendimento</h3>
                        <p style="font-size: 1.6rem; margin-bottom: 10px;">📞 (43) 98418-2582</p>
                        <p style="font-size: 1.4rem; color: #666;">Segunda a Sexta<br>8h às 17h</p>
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 1.4rem; color: #666;">📍 Av. Abelio Benatti, 4912<br>Jardim do Sol<br>Londrina-PR</p>
                    </div>
                </aside>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <h2>Interessado em ${escapeHTML(page.nome)}?</h2>
            <p>Solicite um orçamento sem compromisso e descubra as melhores soluções para seu projeto!</p>
            <a href="#orcamento" class="btn-primary">Solicitar Orçamento Agora</a>
        </div>
    </section>

    <!-- Quote Form -->
    <section class="quote-form-section" id="orcamento">
        <div class="container">
            <div class="quote-form-container">
                <h2>Solicite seu Orçamento</h2>
                <form onsubmit="handleQuote(event)">
                    <div class="form-group">
                        <label for="nome">Nome Completo *</label>
                        <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo" required>
                    </div>
                    <div class="form-group">
                        <label for="email">E-mail *</label>
                        <input type="email" id="email" name="email" placeholder="seu@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="telefone">Telefone/WhatsApp *</label>
                        <input type="tel" id="telefone" name="telefone" placeholder="(43) 98418-2582" required>
                    </div>
                    <div class="form-group">
                        <label for="cidade">Cidade *</label>
                        <input type="text" id="cidade" name="cidade" placeholder="Ex: Londrina-PR" required>
                    </div>
                    <div class="form-group">
                        <label for="tipo">Tipo de Projeto</label>
                        <select id="tipo" name="tipo">
                            <option value="">Selecione...</option>
                            <option value="residencial">Residencial</option>
                            <option value="comercial">Comercial</option>
                            <option value="industrial">Industrial</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="mensagem">Detalhes do Projeto *</label>
                        <textarea id="mensagem" name="mensagem" placeholder="Descreva seu projeto: metragem aproximada, tipo de ${escapeHTML(page.nome)} desejado, quantidade..." required></textarea>
                    </div>
                    <div class="form-group">
                        <button type="submit">Enviar Solicitação via WhatsApp</button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <script>
        // Phone mask
        document.getElementById('telefone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 10) {
                value = value.replace(/^(\\d{2})(\\d{5})(\\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\\d{2})(\\d{4})(\\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\\d{2})(\\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/^(\\d*)/, '($1');
            }

            e.target.value = value;
        });

        // Form submission
        function handleQuote(e) {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const cidade = document.getElementById('cidade').value;
            const tipo = document.getElementById('tipo').value;
            const mensagem = document.getElementById('mensagem').value;

            const whatsappMsg = \`*Solicitação de Orçamento - ${escapeHTML(page.nome)}*\\n\\n\` +
                \`*Nome:* \${nome}\\n\` +
                \`*E-mail:* \${email}\\n\` +
                \`*Telefone:* \${telefone}\\n\` +
                \`*Cidade:* \${cidade}\\n\` +
                \`*Tipo de Projeto:* \${tipo || 'Não especificado'}\\n\\n\` +
                \`*Detalhes do Projeto:*\\n\${mensagem}\`;

            const whatsappURL = \`https://api.whatsapp.com/send/?phone=5543984182582&text=\${encodeURIComponent(whatsappMsg)}\`;

            window.open(whatsappURL, '_blank');
            e.target.reset();
            alert('Obrigado! Você será redirecionado para o WhatsApp para finalizar sua solicitação.');
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Scroll to top on page load
        window.addEventListener('load', function() {
            window.scrollTo(0, 0);
        });
    </script>
    <!-- WhatsApp Float Container -->
    <div id="whatsapp-float-container"></div>

    <!-- Footer Container -->
    <div id="footer-container"></div>

    <!-- Load Header and Footer Components -->
    <script src="load-components.js?v=2"></script>
</body>
</html>`;
}

/**
 * Helper: Parse campo JSON
 */
function parseJSONField(field) {
  if (!field) return [];
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return field.split('\n').map(l => l.trim()).filter(l => l);
    }
  }
  return Array.isArray(field) ? field : [];
}

/**
 * Helper: Escape HTML
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Executar se chamado via CLI
if (require.main === module) {
  const slug = process.argv[2];

  if (!slug) {
    console.error('❌ Uso: node auto-rebuild-page.js <slug>');
    process.exit(1);
  }

  rebuildPage(slug)
    .then(result => {
      console.log('\n✅ Sucesso:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Erro:', error);
      process.exit(1);
    });
}

module.exports = { rebuildPage, generatePageHTML };
