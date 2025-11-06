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

export default pages;
