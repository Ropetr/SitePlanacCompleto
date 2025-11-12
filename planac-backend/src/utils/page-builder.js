/**
 * ===========================================
 * PAGE BUILDER - Geração automática de HTML
 * ===========================================
 * Gera HTML completo das páginas dinamicamente
 */

/**
 * Gera HTML completo de uma página de produto
 */
export async function generatePageHTML(page, env) {
  // Buscar header e footer do KV cache
  const header = await env.SITE_CACHE.get('header.html') || '';
  const footer = await env.SITE_CACHE.get('footer.html') || '';
  const whatsappFloat = await env.SITE_CACHE.get('whatsapp-float.html') || '';

  // Parse de campos JSON
  const caracteristicas = parseJSONField(page.caracteristicas);
  const vantagens = parseJSONField(page.vantagens);
  const aplicacoes = parseJSONField(page.aplicacoes);
  const normas = parseJSONField(page.normas_certificacoes);
  const galeria = parseJSONField(page.galeria_imagens);

  const html = `<!DOCTYPE html>
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

    <link rel="stylesheet" href="glass-s23.css">
    <link rel="stylesheet" href="styles-components.css">
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
                    <a href="planac-website.html#contato" class="cta-button secondary">
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

  return html;
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
 * Rebuild completo de uma página (salva no KV)
 */
export async function rebuildPage(pageId, env) {
  try {
    // Buscar dados da página no banco
    const page = await env.DB.prepare(`
      SELECT * FROM pages WHERE id = ?
    `).bind(pageId).first();

    if (!page) {
      throw new Error(`Página ${pageId} não encontrada`);
    }

    // Gerar HTML
    const html = await generatePageHTML(page, env);

    // Salvar no KV Cache com chave baseada no slug
    const cacheKey = `page:${page.slug}`;
    await env.SITE_CACHE.put(cacheKey, html, {
      metadata: {
        pageId: page.id,
        slug: page.slug,
        status: page.status,
        updatedAt: new Date().toISOString()
      }
    });

    console.log(`✅ Página '${page.nome}' (${page.slug}) rebuiltada com sucesso!`);

    return {
      success: true,
      slug: page.slug,
      cacheKey
    };

  } catch (error) {
    console.error('❌ Erro ao rebuild página:', error);
    throw error;
  }
}

/**
 * Remove página do cache
 */
export async function deleteCachedPage(slug, env) {
  const cacheKey = `page:${slug}`;
  await env.SITE_CACHE.delete(cacheKey);
  console.log(`🗑️ Página '${slug}' removida do cache`);
}
