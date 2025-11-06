/**
 * ===========================================
 * PRODUCTS ROUTES - Gestão de Produtos
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, productSchema } from '../utils/validators.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';

const products = new Hono();

// ===========================================
// GET /api/products - Listar produtos (PÚBLICO)
// ===========================================
products.get('/', async (c) => {
  try {
    const { categoria, destaque, status = 'PUBLICADO', page = 1, limit = 20 } = c.req.query();

    let query = `
      SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = ?
    `;

    const params = [status];

    if (categoria) {
      query += ` AND c.slug = ?`;
      params.push(categoria);
    }

    if (destaque === 'true') {
      query += ` AND p.destaque = 1`;
    }

    query += ` ORDER BY p.ordem ASC, p.created_at DESC`;

    // Paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Parse JSON fields
    const products = results.map(p => ({
      ...p,
      caracteristicas: p.caracteristicas ? JSON.parse(p.caracteristicas) : [],
      vantagens: p.vantagens ? JSON.parse(p.vantagens) : [],
      aplicacoes: p.aplicacoes ? JSON.parse(p.aplicacoes) : [],
      especificacoes: p.especificacoes ? JSON.parse(p.especificacoes) : {},
      normasCertificacoes: p.normas_certificacoes ? JSON.parse(p.normas_certificacoes) : [],
      galeriaImagens: p.galeria_imagens ? JSON.parse(p.galeria_imagens) : [],
      metaKeywords: p.meta_keywords ? JSON.parse(p.meta_keywords) : [],
    }));

    // Total count
    const countQuery = `SELECT COUNT(*) as total FROM products WHERE status = ?`;
    const { total } = await c.env.DB.prepare(countQuery).bind(status).first();

    return c.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return c.json({ error: 'Erro ao listar produtos' }, 500);
  }
});

// ===========================================
// GET /api/products/:slug - Detalhes do produto (PÚBLICO)
// ===========================================
products.get('/:slug', async (c) => {
  try {
    const { slug } = c.req.param();

    const product = await c.env.DB.prepare(`
      SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.status = 'PUBLICADO'
    `).bind(slug).first();

    if (!product) {
      return c.json({ error: 'Produto não encontrado' }, 404);
    }

    // Parse JSON fields
    const productData = {
      ...product,
      caracteristicas: product.caracteristicas ? JSON.parse(product.caracteristicas) : [],
      vantagens: product.vantagens ? JSON.parse(product.vantagens) : [],
      aplicacoes: product.aplicacoes ? JSON.parse(product.aplicacoes) : [],
      especificacoes: product.especificacoes ? JSON.parse(product.especificacoes) : {},
      normasCertificacoes: product.normas_certificacoes ? JSON.parse(product.normas_certificacoes) : [],
      galeriaImagens: product.galeria_imagens ? JSON.parse(product.galeria_imagens) : [],
      metaKeywords: product.meta_keywords ? JSON.parse(product.meta_keywords) : [],
    };

    return c.json({
      success: true,
      data: productData,
    });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return c.json({ error: 'Erro ao buscar produto' }, 500);
  }
});

// ===========================================
// POST /api/admin/products - Criar produto (ADMIN)
// ===========================================
products.post('/admin/products', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const body = await c.req.json();

    // Validar dados
    const validation = validate(productSchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;

    // Gerar slug único
    const baseSlug = slugify(data.nome);
    const slug = await generateUniqueSlug(c.env.DB, 'products', baseSlug);

    // Preparar dados JSON
    const caracteristicas = JSON.stringify(data.caracteristicas || []);
    const vantagens = JSON.stringify(data.vantagens || []);
    const aplicacoes = JSON.stringify(data.aplicacoes || []);
    const especificacoes = JSON.stringify(data.especificacoes || {});
    const normasCertificacoes = JSON.stringify(data.normasCertificacoes || []);
    const galeriaImagens = JSON.stringify(data.galeriaImagens || []);
    const metaKeywords = JSON.stringify(data.metaKeywords || []);

    const productId = generateId();
    const now = new Date().toISOString();

    await c.env.DB.prepare(`
      INSERT INTO products (
        id, nome, slug, subtitulo, descricao_curta, descricao_completa,
        caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
        imagem_banner, galeria_imagens, video_url,
        meta_title, meta_description, meta_keywords,
        ordem, destaque, status, category_id, created_by_id,
        published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      productId, data.nome, slug,
      data.subtitulo || null,
      data.descricaoCurta || null,
      data.descricaoCompleta || null,
      caracteristicas, vantagens, aplicacoes, especificacoes, normasCertificacoes,
      data.imagemBanner || null,
      galeriaImagens,
      data.videoUrl || null,
      data.metaTitle || data.nome,
      data.metaDescription || data.descricaoCurta,
      metaKeywords,
      data.ordem || 0,
      data.destaque ? 1 : 0,
      data.status || 'RASCUNHO',
      data.categoryId,
      payload.id,
      data.status === 'PUBLICADO' ? now : null,
      now, now
    ).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, new_values, created_at)
      VALUES (?, ?, 'CREATE', 'Product', ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      productId,
      JSON.stringify({ nome: data.nome, slug })
    ).run();

    return c.json({
      success: true,
      message: 'Produto criado com sucesso',
      data: { id: productId, slug },
    }, 201);

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return c.json({ error: 'Erro ao criar produto' }, 500);
  }
});

// ===========================================
// PUT /api/admin/products/:id - Editar produto (ADMIN)
// ===========================================
products.put('/admin/products/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { id } = c.req.param();
    const body = await c.req.json();

    // Buscar produto existente
    const existing = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Produto não encontrado' }, 404);
    }

    // Validar dados parciais
    const validation = validate(productSchema.partial(), body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;

    // Atualizar slug se o nome mudou
    let slug = existing.slug;
    if (data.nome && data.nome !== existing.nome) {
      const baseSlug = slugify(data.nome);
      slug = await generateUniqueSlug(c.env.DB, 'products', baseSlug, id);
    }

    // Preparar campos para update
    const updates = [];
    const params = [];

    if (data.nome) { updates.push('nome = ?'); params.push(data.nome); }
    if (slug !== existing.slug) { updates.push('slug = ?'); params.push(slug); }
    if (data.subtitulo !== undefined) { updates.push('subtitulo = ?'); params.push(data.subtitulo); }
    if (data.descricaoCurta !== undefined) { updates.push('descricao_curta = ?'); params.push(data.descricaoCurta); }
    if (data.descricaoCompleta !== undefined) { updates.push('descricao_completa = ?'); params.push(data.descricaoCompleta); }

    if (data.caracteristicas) { updates.push('caracteristicas = ?'); params.push(JSON.stringify(data.caracteristicas)); }
    if (data.vantagens) { updates.push('vantagens = ?'); params.push(JSON.stringify(data.vantagens)); }
    if (data.aplicacoes) { updates.push('aplicacoes = ?'); params.push(JSON.stringify(data.aplicacoes)); }
    if (data.especificacoes) { updates.push('especificacoes = ?'); params.push(JSON.stringify(data.especificacoes)); }
    if (data.normasCertificacoes) { updates.push('normas_certificacoes = ?'); params.push(JSON.stringify(data.normasCertificacoes)); }

    if (data.imagemBanner !== undefined) { updates.push('imagem_banner = ?'); params.push(data.imagemBanner); }
    if (data.galeriaImagens) { updates.push('galeria_imagens = ?'); params.push(JSON.stringify(data.galeriaImagens)); }
    if (data.videoUrl !== undefined) { updates.push('video_url = ?'); params.push(data.videoUrl); }

    if (data.metaTitle !== undefined) { updates.push('meta_title = ?'); params.push(data.metaTitle); }
    if (data.metaDescription !== undefined) { updates.push('meta_description = ?'); params.push(data.metaDescription); }
    if (data.metaKeywords) { updates.push('meta_keywords = ?'); params.push(JSON.stringify(data.metaKeywords)); }

    if (data.ordem !== undefined) { updates.push('ordem = ?'); params.push(data.ordem); }
    if (data.destaque !== undefined) { updates.push('destaque = ?'); params.push(data.destaque ? 1 : 0); }
    if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }
    if (data.categoryId !== undefined) { updates.push('category_id = ?'); params.push(data.categoryId); }

    updates.push('updated_by_id = ?');
    params.push(payload.id);

    updates.push('updated_at = CURRENT_TIMESTAMP');

    // Atualizar published_at se mudou para PUBLICADO
    if (data.status === 'PUBLICADO' && existing.status !== 'PUBLICADO') {
      updates.push('published_at = CURRENT_TIMESTAMP');
    }

    params.push(id); // WHERE id = ?

    await c.env.DB.prepare(`
      UPDATE products SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, old_values, new_values, created_at)
      VALUES (?, ?, 'UPDATE', 'Product', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      id,
      JSON.stringify({ nome: existing.nome }),
      JSON.stringify(data)
    ).run();

    return c.json({
      success: true,
      message: 'Produto atualizado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return c.json({ error: 'Erro ao atualizar produto' }, 500);
  }
});

// ===========================================
// DELETE /api/admin/products/:id - Excluir produto (ADMIN)
// ===========================================
products.delete('/admin/products/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { id } = c.req.param();

    const existing = await c.env.DB.prepare('SELECT nome FROM products WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Produto não encontrado' }, 404);
    }

    await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, old_values, created_at)
      VALUES (?, ?, 'DELETE', 'Product', ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      id,
      JSON.stringify({ nome: existing.nome })
    ).run();

    return c.json({
      success: true,
      message: 'Produto excluído com sucesso',
    });

  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return c.json({ error: 'Erro ao excluir produto' }, 500);
  }
});

export default products;
