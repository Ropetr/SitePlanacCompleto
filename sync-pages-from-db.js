/**
 * ========================================
 * SYNC PAGES FROM DATABASE TO HTML FILES
 * ========================================
 *
 * Este script:
 * 1. Busca todas as páginas PUBLICADAS do banco D1
 * 2. Gera arquivos HTML completos para cada página
 * 3. Salva na raiz do projeto
 * 4. Faz commit e push automático para GitHub
 * 5. Cloudflare Pages faz auto-deploy
 *
 * USO:
 * node sync-pages-from-db.js
 */

const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');

const API_URL = 'https://planac-backend-api.planacacabamentos.workers.dev';

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Erro ao parsear JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

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

// ========================================
// TEMPLATE DE PÁGINA
// ========================================

function generatePageHTML(page, header, footer, whatsappFloat) {
  const caracteristicas = parseJSONField(page.caracteristicas);
  const vantagens = parseJSONField(page.vantagens);
  const aplicacoes = parseJSONField(page.aplicacoes);
  const normas = parseJSONField(page.normas_certificacoes);
  const galeria = parseJSONField(page.galeria_imagens);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.meta_title || page.nome}</title>
    <meta name="description" content="${page.meta_description || page.descricao_curta || ''}">
    <meta name="keywords" content="${page.meta_keywords || ''}">

    <!-- Preload crítico -->
    <link rel="preload" as="image" href="${page.imagem_banner || ''}" fetchpriority="high">
    <link rel="preload" as="image" href="Logo.svg" fetchpriority="high">

    <link rel="stylesheet" href="styles-components.css?v=8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    ${header}

    <!-- Banner -->
    <section class="service-banner">
        ${page.imagem_banner ? `<img src="${page.imagem_banner}" alt="${page.nome}" class="banner-image">` : ''}
        <div class="banner-overlay"></div>
        <div class="container banner-content">
            <h1 class="banner-title">${page.nome}</h1>
            ${page.subtitulo ? `<p class="banner-subtitle">${page.subtitulo}</p>` : ''}
        </div>
    </section>

    <!-- Conteúdo -->
    <section class="product-content">
        <div class="container">
            ${page.descricao_completa ? `
            <div class="content-block">
                <h2>Descrição</h2>
                <p>${page.descricao_completa}</p>
            </div>
            ` : ''}

            ${caracteristicas.length > 0 ? `
            <div class="content-block">
                <h2>Características</h2>
                <ul class="features-list">
                    ${caracteristicas.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            ${vantagens.length > 0 ? `
            <div class="content-block">
                <h2>Vantagens</h2>
                <ul class="features-list">
                    ${vantagens.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            ${aplicacoes.length > 0 ? `
            <div class="content-block">
                <h2>Aplicações</h2>
                <ul class="features-list">
                    ${aplicacoes.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            ${galeria.length > 0 ? `
            <div class="content-block">
                <h2>Galeria</h2>
                <div class="gallery-grid">
                    ${galeria.map(img => `
                        <img src="${img}" alt="${page.nome}" loading="lazy">
                    `).join('')}
                </div>
            </div>
            ` : ''}

            ${page.video_url ? `
            <div class="content-block">
                <h2>Vídeo</h2>
                <div class="video-container">
                    <iframe src="${page.video_url}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            ` : ''}

            ${normas.length > 0 ? `
            <div class="content-block">
                <h2>Normas e Certificações</h2>
                <ul class="features-list">
                    ${normas.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <!-- Formulário de Contato/Orçamento -->
            <div class="content-block">
                <h2>Solicite um Orçamento</h2>
                <div class="contact-buttons">
                    <a href="https://api.whatsapp.com/send/?phone=5543984182582&text=Olá!%20Gostaria%20de%20um%20orçamento%20para%20${encodeURIComponent(page.nome)}"
                       target="_blank"
                       class="cta-button">
                        Solicitar via WhatsApp
                    </a>
                    <a href="index.html#contato" class="cta-button secondary">
                        Formulário de Contato
                    </a>
                </div>
            </div>
        </div>
    </section>

    ${footer}
    ${whatsappFloat}

    <script src="load-components.js"></script>
</body>
</html>`;
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log('🚀 Iniciando sincronização D1 → HTML → GitHub\n');

  try {
    // 1. Buscar componentes
    console.log('📥 Buscando componentes...');
    const header = fs.readFileSync('header.html', 'utf-8');
    const footer = fs.readFileSync('footer.html', 'utf-8');
    const whatsappFloat = fs.readFileSync('whatsapp-float.html', 'utf-8');
    console.log('✅ Componentes carregados\n');

    // 2. Buscar páginas publicadas
    console.log('📥 Buscando páginas PUBLICADAS do banco D1...');
    const response = await httpsGet(`${API_URL}/api/products?limit=100`);

    if (!response.success || !response.data) {
      throw new Error('Erro ao buscar páginas da API');
    }

    const pages = response.data;
    console.log(`✅ ${pages.length} páginas encontradas\n`);

    // 3. Gerar HTMLs
    console.log('🔨 Gerando arquivos HTML...\n');
    let generatedCount = 0;
    let skippedCount = 0;

    for (const page of pages) {
      const filename = `${page.slug}.html`;

      // Pular index.html (página inicial especial)
      if (page.slug === 'index') {
        console.log(`⏭️  Pulando ${filename} (página inicial especial)`);
        skippedCount++;
        continue;
      }

      try {
        const html = generatePageHTML(page, header, footer, whatsappFloat);
        fs.writeFileSync(filename, html, 'utf-8');
        console.log(`✅ ${filename} - ${page.nome}`);
        generatedCount++;
      } catch (error) {
        console.error(`❌ Erro ao gerar ${filename}:`, error.message);
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   Gerados: ${generatedCount}`);
    console.log(`   Pulados: ${skippedCount}`);
    console.log(`   Total: ${pages.length}\n`);

    // 4. Git commit e push
    console.log('📤 Fazendo commit e push para GitHub...\n');

    try {
      execSync('git add *.html', { stdio: 'inherit' });

      const commitMessage = `sync: Atualiza ${generatedCount} páginas do banco D1

Páginas sincronizadas automaticamente via sync-pages-from-db.js

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });

      console.log('\n✅ Commit e push realizados com sucesso!');
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('ℹ️  Nenhuma alteração para commitar (arquivos já atualizados)');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Sincronização concluída!');
    console.log('⏳ Cloudflare Pages fará auto-deploy em ~2 minutos\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

main();
