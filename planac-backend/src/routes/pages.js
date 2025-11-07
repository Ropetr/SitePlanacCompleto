/**
 * ===========================================
 * PAGES ROUTES - Páginas Institucionais
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, pageSchema } from '../utils/validators.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';

const pages = new Hono();

// ===========================================
// GET /api/pages/:tipo - Obter página por tipo (PÚBLICO)
// ===========================================
pages.get('/:tipo', async (c) => {
  try {
    const { tipo } = c.req.param();

    const page = await c.env.DB.prepare(`
      SELECT * FROM pages WHERE tipo = ? AND ativo = 1
    `).bind(tipo.toUpperCase()).first();

    if (!page) {
      return c.json({ error: 'Página não encontrada' }, 404);
    }

    return c.json({
      success: true,
      data: {
        ...page,
        sections: page.sections ? JSON.parse(page.sections) : [],
        metadata: page.metadata ? JSON.parse(page.metadata) : null,
      },
    });

  } catch (error) {
    console.error('Erro ao buscar página:', error);
    return c.json({ error: 'Erro ao buscar página' }, 500);
  }
});

// ===========================================
// GET /api/admin/pages - Listar páginas (ADMIN)
// ===========================================
pages.get('/admin/pages', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM pages ORDER BY tipo
    `).all();

    return c.json({
      success: true,
      data: results.map(p => ({
        ...p,
        sections: p.sections ? JSON.parse(p.sections) : [],
        metadata: p.metadata ? JSON.parse(p.metadata) : null,
      })),
    });

  } catch (error) {
    console.error('Erro ao listar páginas:', error);
    return c.json({ error: 'Erro ao listar páginas' }, 500);
  }
});

// ===========================================
// POST /api/admin/pages - Criar página (ADMIN)
// ===========================================
pages.post('/admin/pages', async (c) => {
  try {
    const body = await c.req.json();

    const validation = validate(pageSchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;
    const baseSlug = slugify(data.titulo);
    const slug = await generateUniqueSlug(c.env.DB, 'pages', baseSlug);

    const pageId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO pages (
        id, tipo, titulo, slug, conteudo, banner_imagem, banner_titulo, banner_subtitulo,
        sections, metadata, ativo, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      pageId,
      data.tipo,
      data.titulo,
      slug,
      data.conteudo || null,
      data.bannerImagem || null,
      data.bannerTitulo || null,
      data.bannerSubtitulo || null,
      data.sections ? JSON.stringify(data.sections) : null,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.ativo !== false ? 1 : 0
    ).run();

    return c.json({
      success: true,
      message: 'Página criada',
      data: { id: pageId, slug },
    }, 201);

  } catch (error) {
    console.error('Erro ao criar página:', error);
    return c.json({ error: 'Erro ao criar página' }, 500);
  }
});

// ===========================================
// PUT /api/admin/pages/:id - Atualizar página (ADMIN)
// ===========================================
pages.put('/admin/pages/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Página não encontrada' }, 404);
    }

    const validation = validate(pageSchema.partial(), body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;

    let slug = existing.slug;
    if (data.titulo && data.titulo !== existing.titulo) {
      const baseSlug = slugify(data.titulo);
      slug = await generateUniqueSlug(c.env.DB, 'pages', baseSlug, id);
    }

    const updates = [];
    const params = [];

    if (data.tipo) { updates.push('tipo = ?'); params.push(data.tipo); }
    if (data.titulo) { updates.push('titulo = ?'); params.push(data.titulo); }
    if (slug !== existing.slug) { updates.push('slug = ?'); params.push(slug); }
    if (data.conteudo !== undefined) { updates.push('conteudo = ?'); params.push(data.conteudo); }
    if (data.bannerImagem !== undefined) { updates.push('banner_imagem = ?'); params.push(data.bannerImagem); }
    if (data.bannerTitulo !== undefined) { updates.push('banner_titulo = ?'); params.push(data.bannerTitulo); }
    if (data.bannerSubtitulo !== undefined) { updates.push('banner_subtitulo = ?'); params.push(data.bannerSubtitulo); }
    if (data.sections) { updates.push('sections = ?'); params.push(JSON.stringify(data.sections)); }
    if (data.metadata) { updates.push('metadata = ?'); params.push(JSON.stringify(data.metadata)); }
    if (data.ativo !== undefined) { updates.push('ativo = ?'); params.push(data.ativo ? 1 : 0); }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    params.push(id);

    await c.env.DB.prepare(`
      UPDATE pages SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    return c.json({
      success: true,
      message: 'Página atualizada',
    });

  } catch (error) {
    console.error('Erro ao atualizar página:', error);
    return c.json({ error: 'Erro ao atualizar página' }, 500);
  }
});

// ===========================================
// GET /api/pages/product/:slug - Obter HTML de produto (PÚBLICO)
// ===========================================
pages.get('/product/:slug', async (c) => {
  try {
    const { slug } = c.req.param();

    const product = await c.env.DB.prepare(`
      SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug
      FROM products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      WHERE p.slug = ? AND p.status = 'PUBLICADO'
    `).bind(slug).first();

    if (!product) {
      return c.json({ error: 'Produto não encontrado' }, 404);
    }

    // Buscar categoria pai (se existir)
    let categoriaPrincipal = null;
    if (product.categoria_id) {
      const categoria = await c.env.DB.prepare(`
        SELECT c.*, cp.slug as pai_slug, cp.nome as pai_nome
        FROM categories c
        LEFT JOIN categories cp ON c.categoria_pai_id = cp.id
        WHERE c.id = ?
      `).bind(product.categoria_id).first();

      categoriaPrincipal = categoria;
    }

    // Gerar HTML da página
    const html = generateProductHTML(product, categoriaPrincipal);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache de 1 hora
      }
    });

  } catch (error) {
    console.error('Erro ao gerar página do produto:', error);
    return c.json({ error: 'Erro ao gerar página' }, 500);
  }
});

// ===========================================
// Função auxiliar para gerar HTML do produto
// ===========================================
function generateProductHTML(product, categoria) {
  const breadcrumbItems = [];
  breadcrumbItems.push({ text: 'Início', url: '/index.html' });

  if (categoria) {
    if (categoria.pai_nome && categoria.pai_slug) {
      breadcrumbItems.push({ text: categoria.pai_nome, url: `/index.html#${categoria.pai_slug}` });
    }
    breadcrumbItems.push({ text: categoria.nome, url: `/index.html#${categoria.slug}` });
  }

  breadcrumbItems.push({ text: product.nome, url: null });

  const breadcrumbHTML = breadcrumbItems.map((item, index) => {
    if (index === breadcrumbItems.length - 1) {
      return `<li><span>${item.text}</span></li>`;
    }
    return `<li><a href="${item.url}">${item.text}</a></li><li>›</li>`;
  }).join('');

  // Processar listas de características, vantagens, aplicações
  const caracteristicasHTML = product.caracteristicas ?
    product.caracteristicas.split('\n').filter(l => l.trim()).map(item =>
      `<li>${item.trim()}</li>`
    ).join('') : '';

  const vantagensHTML = product.vantagens ?
    product.vantagens.split('\n').filter(l => l.trim()).map(item =>
      `<li>${item.trim()}</li>`
    ).join('') : '';

  const aplicacoesHTML = product.aplicacoes ?
    product.aplicacoes.split('\n').filter(l => l.trim()).map(item =>
      `<li>${item.trim()}</li>`
    ).join('') : '';

  const especificacoesHTML = product.especificacoes_tecnicas ?
    product.especificacoes_tecnicas.split('\n').filter(l => l.trim()).map(item =>
      `<li>${item.trim()}</li>`
    ).join('') : '';

  // Template HTML completo
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.nome} - Planac Distribuidora</title>
    ${product.meta_descricao ? `<meta name="description" content="${product.meta_descricao}">` : ''}
    ${product.palavra_chave ? `<meta name="keywords" content="${product.palavra_chave}">` : ''}
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles-components.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; font-size: 10px; }
        body { font-family: 'Barlow', sans-serif; overflow-x: hidden; }
        .container { max-width: 1410px; width: 90%; margin: 0 auto; padding: 0 15px; }

        header { position: fixed; top: 0; left: 0; width: 100%; z-index: 999; background: transparent; }
        .header-logo { background: #fff; width: 32%; min-width: 280px; height: 100px; border-bottom-right-radius: 20px; display: flex; align-items: center; justify-content: flex-end; padding-right: 50px; box-shadow: 0 0 5px rgba(0,0,0,0.15); }
        .header-logo img { width: 200px; height: auto; }
        .header-nav { background: #AA000E; display: flex; align-items: center; justify-content: space-between; padding: 10px 30px; min-height: 50px; }
        .nav-links { display: flex; gap: 30px; list-style: none; align-items: center; }
        .nav-links a { color: #fff; text-decoration: none; font-size: 1.6rem; transition: 0.3s; position: relative; }
        .nav-links a:hover::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 100%; height: 1px; background: #fff; }

        .service-banner { width: 100%; height: 60vh; min-height: 400px; position: relative; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; margin-top: 0; }
        .service-banner::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .service-banner-content { position: relative; z-index: 2; text-align: center; color: #fff; max-width: 900px; }
        .service-banner h1 { font-size: clamp(3.5rem, 6vw, 6rem); margin-bottom: 20px; text-transform: uppercase; filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.6)); }
        .service-banner p { font-size: clamp(1.8rem, 2.5vw, 2.4rem); filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.6)); }

        .breadcrumb { padding: 20px 0; background: #f6f8fb; }
        .breadcrumb-list { display: flex; gap: 10px; list-style: none; font-size: 1.4rem; flex-wrap: wrap; }
        .breadcrumb-list li { display: flex; align-items: center; gap: 10px; }
        .breadcrumb-list a { color: #AA000E; text-decoration: none; }
        .breadcrumb-list a:hover { text-decoration: underline; }
        .breadcrumb-list span { color: #666; }

        .service-content { padding: 80px 0; background: #fff; }
        .service-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 50px; align-items: start; }
        .service-main { background: #fff; }
        .service-main h2 { font-size: 3.6rem; color: #AA000E; margin-bottom: 30px; text-transform: uppercase; }
        .service-main h3 { font-size: 2.8rem; color: #3d3d3d; margin: 40px 0 20px; }
        .service-main p { font-size: 1.8rem; line-height: 1.8; color: #3d3d3d; margin-bottom: 20px; text-align: justify; }
        .service-main ul { list-style: none; padding-left: 0; margin: 20px 0; }
        .service-main li { font-size: 1.8rem; padding: 12px 0 12px 30px; position: relative; color: #3d3d3d; }
        .service-main li::before { content: '✓'; position: absolute; left: 0; color: #AA000E; font-weight: bold; font-size: 2rem; }

        .highlight-box { background: linear-gradient(135deg, #AA000E 0%, #96181c 100%); color: #fff; padding: 30px; border-radius: 10px; margin: 30px 0; box-shadow: 0 5px 20px rgba(170,0,14,0.2); }
        .highlight-box h4 { font-size: 2.4rem; margin-bottom: 15px; }
        .highlight-box p { font-size: 1.8rem; color: #fff; text-align: left; }

        .cta-section { background: linear-gradient(135deg, #AA000E 0%, #96181c 100%); padding: 60px 0; text-align: center; color: #fff; }
        .cta-section h2 { font-size: 4rem; margin-bottom: 20px; text-transform: uppercase; }
        .cta-section p { font-size: 2rem; margin-bottom: 40px; }
        .btn-primary { background: #fff; color: #AA000E; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-size: 1.8rem; font-weight: 700; display: inline-block; transition: 0.3s; }
        .btn-primary:hover { background: #ec3237; color: #fff; transform: translateY(-3px); box-shadow: 0 5px 20px rgba(0,0,0,0.3); }

        @media (max-width: 1024px) {
            .service-grid { grid-template-columns: 1fr; }
            .service-banner { margin-top: 130px; }
        }
    </style>
</head>
<body>
    <!-- Header Container -->
    <div id="header-container"></div>

    <section class="service-banner" style="background-image: url('${product.imagem_banner || ''}')">
        <div class="service-banner-content">
            <h1>${product.nome}</h1>
            <p>${product.subtitulo || ''}</p>
        </div>
    </section>

    <section class="breadcrumb">
        <div class="container">
            <ul class="breadcrumb-list">
                ${breadcrumbHTML}
            </ul>
        </div>
    </section>

    <section class="service-content">
        <div class="container">
            <div class="service-grid">
                <div class="service-main">
                    <h2>${product.nome}</h2>

                    ${product.descricao_curta ? `<p><strong>${product.descricao_curta}</strong></p>` : ''}

                    ${product.descricao_completa ? product.descricao_completa.split('\n\n').map(p => `<p>${p}</p>`).join('') : ''}

                    ${caracteristicasHTML ? `
                    <h3>Características Principais</h3>
                    <ul>${caracteristicasHTML}</ul>
                    ` : ''}

                    ${vantagensHTML ? `
                    <h3>Vantagens</h3>
                    <ul>${vantagensHTML}</ul>
                    ` : ''}

                    ${aplicacoesHTML ? `
                    <h3>Aplicações</h3>
                    <ul>${aplicacoesHTML}</ul>
                    ` : ''}

                    ${especificacoesHTML ? `
                    <h3>Especificações Técnicas</h3>
                    <ul>${especificacoesHTML}</ul>
                    ` : ''}
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <h2>Interessado em ${product.nome}?</h2>
            <p>Solicite um orçamento personalizado!</p>
            <a href="#orcamento" class="btn-primary">Solicitar Orçamento Agora</a>
        </div>
    </section>

    <!-- WhatsApp Float Container -->
    <div id="whatsapp-float-container"></div>

    <!-- Footer Container -->
    <div id="footer-container"></div>

    <!-- Load Header and Footer Components -->
    <script src="/load-components.js?v=2"></script>
</body>
</html>`;
}

export default pages;
