/**
 * ===========================================
 * MENUS ROUTES - Gestão de Menus de Navegação
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, menuSchema } from '../utils/validators.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';

const menus = new Hono();

// ===========================================
// GET /api/menus - Listar menus (PÚBLICO)
// ===========================================
menus.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT m.*,
        (SELECT COUNT(*) FROM products p WHERE p.menu_id = m.id AND p.status = 'PUBLICADO') as produtos_count
      FROM menus m
      WHERE m.ativo = 1
      ORDER BY m.ordem ASC, m.nome ASC
    `).all();

    // Organizar em árvore hierárquica
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.menu_pai_id === parentId)
        .map(item => ({
          ...item,
          metadata: item.metadata ? JSON.parse(item.metadata) : null,
          submenus: buildTree(items, item.id),
        }));
    };

    const tree = buildTree(results);

    return c.json({
      success: true,
      data: tree,
    });

  } catch (error) {
    console.error('Erro ao listar menus:', error);
    return c.json({ error: 'Erro ao listar menus' }, 500);
  }
});

// ===========================================
// GET /api/menus/:slug - Detalhes do menu (PÚBLICO)
// ===========================================
menus.get('/:slug', async (c) => {
  try {
    const { slug } = c.req.param();

    const menu = await c.env.DB.prepare(`
      SELECT * FROM menus WHERE slug = ? AND ativo = 1
    `).bind(slug).first();

    if (!menu) {
      return c.json({ error: 'Menu não encontrado' }, 404);
    }

    // Buscar produtos do menu
    const { results: products } = await c.env.DB.prepare(`
      SELECT id, nome, slug, subtitulo, imagem_banner, destaque
      FROM products
      WHERE menu_id = ? AND status = 'PUBLICADO'
      ORDER BY destaque DESC, ordem ASC
    `).bind(menu.id).all();

    return c.json({
      success: true,
      data: {
        ...menu,
        metadata: menu.metadata ? JSON.parse(menu.metadata) : null,
        produtos: products,
      },
    });

  } catch (error) {
    console.error('Erro ao buscar menu:', error);
    return c.json({ error: 'Erro ao buscar menu' }, 500);
  }
});

// ===========================================
// POST /api/admin/menus - Criar menu (ADMIN)
// ===========================================
menus.post('/', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const body = await c.req.json();

    const validation = validate(menuSchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;
    const baseSlug = slugify(data.nome);
    const slug = await generateUniqueSlug(c.env.DB, 'menus', baseSlug);

    const menuId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO menus (id, nome, slug, descricao, icone, menu_pai_id, ordem, ativo, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      menuId,
      data.nome,
      slug,
      data.descricao || null,
      data.icone || null,
      data.menuPaiId || null,
      data.ordem || 0,
      data.ativo !== false ? 1 : 0,
      data.metadata ? JSON.stringify(data.metadata) : null
    ).run();

    return c.json({
      success: true,
      message: 'Menu criado com sucesso',
      data: { id: menuId, slug },
    }, 201);

  } catch (error) {
    console.error('Erro ao criar menu:', error);
    return c.json({ error: 'Erro ao criar menu' }, 500);
  }
});

// ===========================================
// PUT /api/admin/menus/:id - Editar menu (ADMIN)
// ===========================================
menus.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = await c.env.DB.prepare('SELECT * FROM menus WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Menu não encontrado' }, 404);
    }

    const validation = validate(menuSchema.partial(), body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;

    let slug = existing.slug;
    if (data.nome && data.nome !== existing.nome) {
      const baseSlug = slugify(data.nome);
      slug = await generateUniqueSlug(c.env.DB, 'menus', baseSlug, id);
    }

    const updates = [];
    const params = [];

    if (data.nome) { updates.push('nome = ?'); params.push(data.nome); }
    if (slug !== existing.slug) { updates.push('slug = ?'); params.push(slug); }
    if (data.descricao !== undefined) { updates.push('descricao = ?'); params.push(data.descricao); }
    if (data.icone !== undefined) { updates.push('icone = ?'); params.push(data.icone); }
    if (data.menuPaiId !== undefined) { updates.push('menu_pai_id = ?'); params.push(data.menuPaiId); }
    if (data.ordem !== undefined) { updates.push('ordem = ?'); params.push(data.ordem); }
    if (data.ativo !== undefined) { updates.push('ativo = ?'); params.push(data.ativo ? 1 : 0); }
    if (data.metadata !== undefined) { updates.push('metadata = ?'); params.push(JSON.stringify(data.metadata)); }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    params.push(id);

    await c.env.DB.prepare(`
      UPDATE menus SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    return c.json({
      success: true,
      message: 'Menu atualizado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao atualizar menu:', error);
    return c.json({ error: 'Erro ao atualizar menu' }, 500);
  }
});

// ===========================================
// DELETE /api/admin/menus/:id - Excluir menu (ADMIN)
// ===========================================
menus.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    // Verificar se existem produtos usando este menu
    const { count } = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM products WHERE menu_id = ?'
    ).bind(id).first();

    if (count > 0) {
      return c.json({
        error: 'Não é possível excluir menu com páginas associadas',
        productsCount: count
      }, 400);
    }

    // Verificar se existem submenus
    const { count: subCount } = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM menus WHERE menu_pai_id = ?'
    ).bind(id).first();

    if (subCount > 0) {
      return c.json({
        error: 'Não é possível excluir menu com submenus',
        submenusCount: subCount
      }, 400);
    }

    await c.env.DB.prepare('DELETE FROM menus WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: 'Menu excluído com sucesso',
    });

  } catch (error) {
    console.error('Erro ao excluir menu:', error);
    return c.json({ error: 'Erro ao excluir menu' }, 500);
  }
});

export default menus;
