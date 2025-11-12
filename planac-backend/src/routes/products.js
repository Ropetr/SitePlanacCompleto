/**
 * ===========================================
 * PRODUCTS ROUTES - Gestão de Produtos
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, productSchema } from '../utils/validators.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';
import { rebuildPage, deleteCachedPage } from '../utils/page-builder.js';

const products = new Hono();

/**
 * Aciona build e deploy automático (não bloqueia a resposta)
 */
async function triggerBuildDeploy(env) {
  try {
    const url = `${env.API_URL || 'https://planac-backend-api.planacacabamentos.workers.dev'}/api/internal/build-deploy`;
    console.log('🚀 Acionando build/deploy em:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Build/deploy executado com sucesso:', result);
    } else {
      console.error('❌ Erro ao acionar build/deploy:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Exceção ao acionar build/deploy:', error.message);
  }
}

// ===========================================
// GET /api/products - Listar produtos (PÚBLICO)
// ===========================================
products.get('/', async (c) => {
  try {
    const { categoria, destaque, status = 'PUBLICADO', page = 1, limit = 20 } = c.req.query();

    let query = `
      SELECT p.*, m.nome as menu_nome, m.slug as menu_slug
      FROM pages p
      LEFT JOIN menus m ON p.menu_id = m.id
      WHERE p.status = ?
    `;

    const params = [status];

    if (categoria) {
      query += ` AND m.slug = ?`;
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

    // Helper para converter string/JSON para array
    const parseArrayField = (field) => {
      if (!field) return [];
      if (typeof field === 'string') {
        try {
          // Tenta fazer parse como JSON primeiro
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // Se falhar, trata como texto (split por linha)
          return field.split('\n').map(l => l.trim()).filter(l => l);
        }
      }
      return Array.isArray(field) ? field : [];
    };

    // Parse JSON fields
    const products = results.map(p => ({
      ...p,
      caracteristicas: parseArrayField(p.caracteristicas),
      vantagens: parseArrayField(p.vantagens),
      aplicacoes: parseArrayField(p.aplicacoes),
      especificacoes: p.especificacoes ?
        (typeof p.especificacoes === 'string' ? p.especificacoes : JSON.stringify(p.especificacoes))
        : null,
      normas_certificacoes: parseArrayField(p.normas_certificacoes),
    }));

    // Total count
    const countQuery = `SELECT COUNT(*) as total FROM pages WHERE status = ?`;
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
      SELECT p.*, m.nome as menu_nome, m.slug as menu_slug
      FROM pages p
      LEFT JOIN menus m ON p.menu_id = m.id
      WHERE p.slug = ? AND p.status = 'PUBLICADO'
    `).bind(slug).first();

    if (!product) {
      return c.json({ error: 'Produto não encontrado' }, 404);
    }

    // Helper para converter string/JSON para array
    const parseArrayField = (field) => {
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
    };

    // Parse JSON fields
    const productData = {
      ...product,
      caracteristicas: parseArrayField(product.caracteristicas),
      vantagens: parseArrayField(product.vantagens),
      aplicacoes: parseArrayField(product.aplicacoes),
      especificacoes: product.especificacoes ?
        (typeof product.especificacoes === 'string' ? product.especificacoes : JSON.stringify(product.especificacoes))
        : null,
      normas_certificacoes: parseArrayField(product.normas_certificacoes),
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
products.post('/', async (c) => {
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

    // Helper para preparar campos de array/texto
    const prepareArrayField = (field) => {
      if (!field) return JSON.stringify([]);
      // Se for string, converte para array (split por linha)
      if (typeof field === 'string') {
        const lines = field.split('\n').map(l => l.trim()).filter(l => l);
        return JSON.stringify(lines);
      }
      // Se já for array, stringifica
      return JSON.stringify(field);
    };

    // Preparar dados JSON
    const caracteristicas = prepareArrayField(data.caracteristicas);
    const vantagens = prepareArrayField(data.vantagens);
    const aplicacoes = prepareArrayField(data.aplicacoes);
    const especificacoes = data.especificacoes || null;
    const normasCertificacoes = prepareArrayField(data.normas_certificacoes);
    const galeriaImagens = JSON.stringify(data.galeriaImagens || []);
    const metaKeywords = typeof data.meta_keywords === 'string' ?
      data.meta_keywords : JSON.stringify(data.meta_keywords || []);

    const productId = generateId();
    const now = new Date().toISOString();

    await c.env.DB.prepare(`
      INSERT INTO pages (
        id, nome, slug, subtitulo, descricao_curta, descricao_completa,
        caracteristicas, vantagens, aplicacoes, especificacoes, normas_certificacoes,
        imagem_banner, galeria_imagens, video_url,
        meta_title, meta_description, meta_keywords,
        ordem, destaque, status, menu_id, created_by_id,
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
      data.menuId,
      payload.id,
      data.status === 'PUBLICADO' ? now : null,
      now, now
    ).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, acao, entidade, entidade_id, dados_novos, created_at)
      VALUES (?, ?, 'CREATE', 'Product', ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      productId,
      JSON.stringify({ nome: data.nome, slug })
    ).run();

    // 🚀 Rebuild página automaticamente
    await rebuildPage(productId, c.env);

    // 🚀 Acionar build do header/footer (mantém para atualizar menu)
    triggerBuildDeploy(c.env);

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
products.put('/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { id } = c.req.param();
    const body = await c.req.json();

    // Buscar produto existente
    const existing = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first();

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
    if (data.descricaoCurta !== undefined || data.descricao_curta !== undefined) {
      updates.push('descricao_curta = ?');
      params.push(data.descricaoCurta || data.descricao_curta);
    }
    if (data.descricaoCompleta !== undefined || data.descricao_completa !== undefined) {
      updates.push('descricao_completa = ?');
      params.push(data.descricaoCompleta || data.descricao_completa);
    }

    // Helper para preparar campos de array/texto
    const prepareArrayField = (field) => {
      if (!field) return JSON.stringify([]);
      if (typeof field === 'string') {
        const lines = field.split('\n').map(l => l.trim()).filter(l => l);
        return JSON.stringify(lines);
      }
      return JSON.stringify(field);
    };

    if (data.caracteristicas !== undefined) { updates.push('caracteristicas = ?'); params.push(prepareArrayField(data.caracteristicas)); }
    if (data.vantagens !== undefined) { updates.push('vantagens = ?'); params.push(prepareArrayField(data.vantagens)); }
    if (data.aplicacoes !== undefined) { updates.push('aplicacoes = ?'); params.push(prepareArrayField(data.aplicacoes)); }
    if (data.especificacoes !== undefined) { updates.push('especificacoes = ?'); params.push(data.especificacoes); }
    if (data.normasCertificacoes !== undefined || data.normas_certificacoes !== undefined) {
      updates.push('normas_certificacoes = ?');
      params.push(prepareArrayField(data.normasCertificacoes || data.normas_certificacoes));
    }

    if (data.imagemBanner !== undefined || data.imagem_banner !== undefined) {
      updates.push('imagem_banner = ?');
      params.push(data.imagemBanner || data.imagem_banner);
    }
    if (data.galeriaImagens || data.galeria_imagens) {
      updates.push('galeria_imagens = ?');
      params.push(JSON.stringify(data.galeriaImagens || data.galeria_imagens));
    }
    if (data.videoUrl !== undefined || data.video_url !== undefined) {
      updates.push('video_url = ?');
      params.push(data.videoUrl || data.video_url);
    }

    if (data.metaTitle !== undefined || data.meta_title !== undefined) {
      updates.push('meta_title = ?');
      params.push(data.metaTitle || data.meta_title);
    }
    if (data.metaDescription !== undefined || data.meta_description !== undefined) {
      updates.push('meta_description = ?');
      params.push(data.metaDescription || data.meta_description);
    }
    if (data.metaKeywords || data.meta_keywords) {
      updates.push('meta_keywords = ?');
      const keywords = data.metaKeywords || data.meta_keywords;
      params.push(typeof keywords === 'string' ? keywords : JSON.stringify(keywords));
    }

    if (data.ordem !== undefined) { updates.push('ordem = ?'); params.push(parseInt(data.ordem)); }
    if (data.destaque !== undefined) { updates.push('destaque = ?'); params.push(data.destaque ? 1 : 0); }
    if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }
    if (data.menuId !== undefined || data.menu_id !== undefined) {
      updates.push('menu_id = ?');
      params.push(data.menuId || data.menu_id);
    }

    updates.push('updated_by_id = ?');
    params.push(payload.id);

    updates.push('updated_at = CURRENT_TIMESTAMP');

    // Atualizar published_at se mudou para PUBLICADO
    if (data.status === 'PUBLICADO' && existing.status !== 'PUBLICADO') {
      updates.push('published_at = CURRENT_TIMESTAMP');
    }

    params.push(id); // WHERE id = ?

    await c.env.DB.prepare(`
      UPDATE pages SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, acao, entidade, entidade_id, dados_anteriores, dados_novos, created_at)
      VALUES (?, ?, 'UPDATE', 'Product', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      id,
      JSON.stringify({ nome: existing.nome }),
      JSON.stringify(data)
    ).run();

    // 🚀 Rebuild página automaticamente
    await rebuildPage(id, c.env);

    // 🚀 Acionar build do header/footer (mantém para atualizar menu)
    triggerBuildDeploy(c.env);

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
products.delete('/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { id } = c.req.param();

    const existing = await c.env.DB.prepare('SELECT nome, slug FROM pages WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Produto não encontrado' }, 404);
    }

    await c.env.DB.prepare('DELETE FROM pages WHERE id = ?').bind(id).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, acao, entidade, entidade_id, dados_anteriores, created_at)
      VALUES (?, ?, 'DELETE', 'Product', ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      id,
      JSON.stringify({ nome: existing.nome })
    ).run();

    // 🗑️ Remover página do cache
    await deleteCachedPage(existing.slug, c.env);

    // 🚀 Acionar build do header/footer (mantém para atualizar menu)
    triggerBuildDeploy(c.env);

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
