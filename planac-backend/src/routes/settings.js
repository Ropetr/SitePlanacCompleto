/**
 * ===========================================
 * SETTINGS ROUTES - Configurações Globais
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, settingSchema } from '../utils/validators.js';

const settings = new Hono();

// ===========================================
// GET /api/settings - Obter configurações (PÚBLICO)
// ===========================================
settings.get('/', async (c) => {
  try {
    const { grupo } = c.req.query();

    let query = `SELECT chave, valor, tipo FROM settings`;
    const params = [];

    if (grupo) {
      query += ` WHERE grupo = ?`;
      params.push(grupo);
    }

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Transformar em objeto key-value
    const settingsObj = {};
    results.forEach(setting => {
      let value = setting.valor;

      // Parse baseado no tipo
      if (setting.tipo === 'number') {
        value = parseFloat(value);
      } else if (setting.tipo === 'boolean') {
        value = value === 'true' || value === '1';
      } else if (setting.tipo === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = null;
        }
      }

      settingsObj[setting.chave] = value;
    });

    return c.json({
      success: true,
      data: settingsObj,
    });

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return c.json({ error: 'Erro ao buscar configurações' }, 500);
  }
});

// ===========================================
// GET /api/admin/settings - Listar todas (ADMIN)
// ===========================================
settings.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM settings ORDER BY grupo, chave
    `).all();

    return c.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error('Erro ao listar configurações:', error);
    return c.json({ error: 'Erro ao listar configurações' }, 500);
  }
});

// ===========================================
// POST /api/admin/settings - Criar configuração (ADMIN)
// ===========================================
settings.post('/', async (c) => {
  try {
    const body = await c.req.json();

    const validation = validate(settingSchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;
    const settingId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO settings (id, chave, valor, tipo, descricao, grupo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      settingId,
      data.chave,
      data.valor || null,
      data.tipo,
      data.descricao || null,
      data.grupo || null
    ).run();

    // Invalidar cache KV
    await c.env.KV_CACHE.delete('settings:all');

    return c.json({
      success: true,
      message: 'Configuração criada',
      data: { id: settingId },
    }, 201);

  } catch (error) {
    console.error('Erro ao criar configuração:', error);
    return c.json({ error: 'Erro ao criar configuração' }, 500);
  }
});

// ===========================================
// PUT /api/admin/settings/:chave - Atualizar configuração (ADMIN)
// ===========================================
settings.put('/:chave', async (c) => {
  try {
    const { chave } = c.req.param();
    const { valor } = await c.req.json();

    await c.env.DB.prepare(`
      UPDATE settings SET valor = ?, updated_at = CURRENT_TIMESTAMP WHERE chave = ?
    `).bind(valor, chave).run();

    // Invalidar cache
    await c.env.KV_CACHE.delete('settings:all');
    await c.env.KV_CACHE.delete(`setting:${chave}`);

    return c.json({
      success: true,
      message: 'Configuração atualizada',
    });

  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    return c.json({ error: 'Erro ao atualizar configuração' }, 500);
  }
});

export default settings;
