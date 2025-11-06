/**
 * ===========================================
 * CATEGORIES ROUTES - Gestão de Categorias
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, categorySchema } from '../utils/validators.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';

const categories = new Hono();

// ===========================================
// GET /api/categories - Listar categorias (PÚBLICO)
// ===========================================
categories.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status = 'PUBLICADO') as produtos_count
      FROM categories c
      WHERE c.ativo = 1
      ORDER BY c.ordem ASC, c.nome ASC
    `).all();

    // Organizar em árvore hierárquica
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.categoria_pai_id === parentId)
        .map(item => ({
          ...item,
          metadata: item.metadata ? JSON.parse(item.metadata) : null,
          subcategorias: buildTree(items, item.id),
        }));
    };

    const tree = buildTree(results);

    return c.json({
      success: true,
      data: tree,
    });

  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return c.json({ error: 'Erro ao listar categorias' }, 500);
  }
});

// ===========================================
// GET /api/categories/:slug - Detalhes da categoria (PÚBLICO)
// ===========================================
categories.get('/:slug', async (c) => {
  try {
    const { slug } = c.req.param();

    const category = await c.env.DB.prepare(`
      SELECT * FROM categories WHERE slug = ? AND ativo = 1
    `).bind(slug).first();

    if (!category) {
      return c.json({ error: 'Categoria não encontrada' }, 404);
    }

    // Buscar produtos da categoria
    const { results: products } = await c.env.DB.prepare(`
      SELECT id, nome, slug, subtitulo, imagem_banner, destaque
      FROM products
      WHERE category_id = ? AND status = 'PUBLICADO'
      ORDER BY destaque DESC, ordem ASC
    `).bind(category.id).all();

    return c.json({
      success: true,
      data: {
        ...category,
        metadata: category.metadata ? JSON.parse(category.metadata) : null,
        produtos: products,
      },
    });

  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return c.json({ error: 'Erro ao buscar categoria' }, 500);
  }
});

// ===========================================
// POST /api/admin/categories - Criar categoria (ADMIN)
// ===========================================
categories.post('/admin/categories', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const body = await c.req.json();

    const validation = validate(categorySchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;
    const baseSlug = slugify(data.nome);
    const slug = await generateUniqueSlug(c.env.DB, 'categories', baseSlug);

    const categoryId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO categories (id, nome, slug, descricao, icone, categoria_pai_id, ordem, ativo, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      categoryId,
      data.nome,
      slug,
      data.descricao || null,
      data.icone || null,
      data.categoriaPaiId || null,
      data.ordem || 0,
      data.ativo !== false ? 1 : 0,
      data.metadata ? JSON.stringify(data.metadata) : null
    ).run();

    return c.json({
      success: true,
      message: 'Categoria criada com sucesso',
      data: { id: categoryId, slug },
    }, 201);

  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return c.json({ error: 'Erro ao criar categoria' }, 500);
  }
});

// ===========================================
// PUT /api/admin/categories/:id - Editar categoria (ADMIN)
// ===========================================
categories.put('/admin/categories/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await c.env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Categoria não encontrada' }, 404);
    }

    const validation = validate(categorySchema.partial(), body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;

    let slug = existing.slug;
    if (data.nome && data.nome !== existing.nome) {
      const baseSlug = slugify(data.nome);
      slug = await generateUniqueSlug(c.env.DB, 'categories', baseSlug, id);
    }

    const updates = [];
    const params = [];

    if (data.nome) { updates.push('nome = ?'); params.push(data.nome); }
    if (slug !== existing.slug) { updates.push('slug = ?'); params.push(slug); }
    if (data.descricao !== undefined) { updates.push('descricao = ?'); params.push(data.descricao); }
    if (data.icone !== undefined) { updates.push('icone = ?'); params.push(data.icone); }
    if (data.categoriaPaiId !== undefined) { updates.push('categoria_pai_id = ?'); params.push(data.categoriaPaiId); }
    if (data.ordem !== undefined) { updates.push('ordem = ?'); params.push(data.ordem); }
    if (data.ativo !== undefined) { updates.push('ativo = ?'); params.push(data.ativo ? 1 : 0); }
    if (data.metadata !== undefined) { updates.push('metadata = ?'); params.push(JSON.stringify(data.metadata)); }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    params.push(id);

    await c.env.DB.prepare(`
      UPDATE categories SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    return c.json({
      success: true,
      message: 'Categoria atualizada com sucesso',
    });

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return c.json({ error: 'Erro ao atualizar categoria' }, 500);
  }
});

// ===========================================
// DELETE /api/admin/categories/:id - Excluir categoria (ADMIN)
// ===========================================
categories.delete('/admin/categories/:id', async (c) => {
  try {
    const { id } = c.req.param();

    // Verificar se existem produtos usando esta categoria
    const { count } = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?'
    ).bind(id).first();

    if (count > 0) {
      return c.json({
        error: 'Não é possível excluir categoria com produtos associados',
        productsCount: count
      }, 400);
    }

    // Verificar se existem subcategorias
    const { count: subCount } = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM categories WHERE categoria_pai_id = ?'
    ).bind(id).first();

    if (subCount > 0) {
      return c.json({
        error: 'Não é possível excluir categoria com subcategorias',
        subcategoriesCount: subCount
      }, 400);
    }

    await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: 'Categoria excluída com sucesso',
    });

  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return c.json({ error: 'Erro ao excluir categoria' }, 500);
  }
});

export default categories;
