/**
 * ===========================================
 * QUOTES ROUTES - Orçamentos e Leads
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, quoteSchema } from '../utils/validators.js';

const quotes = new Hono();

// ===========================================
// POST /api/quotes - Enviar orçamento (PÚBLICO)
// ===========================================
quotes.post('/', async (c) => {
  try {
    const body = await c.req.json();

    const validation = validate(quoteSchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;
    const quoteId = generateId();

    // Capturar informações de rastreamento
    const ipAddress = c.req.header('CF-Connecting-IP') || 'unknown';
    const userAgent = c.req.header('User-Agent') || '';
    const referer = c.req.header('Referer') || '';

    // Extrair UTM parameters da origem
    let utmSource = null;
    let utmMedium = null;
    let utmCampaign = null;

    if (data.origem) {
      try {
        const url = new URL(data.origem);
        utmSource = url.searchParams.get('utm_source');
        utmMedium = url.searchParams.get('utm_medium');
        utmCampaign = url.searchParams.get('utm_campaign');
      } catch (e) {
        // URL inválida, ignorar
      }
    }

    await c.env.DB.prepare(`
      INSERT INTO quotes (
        id, nome, email, telefone, cidade, produto, tipo_projeto, mensagem, origem,
        status, ip_address, user_agent, utm_source, utm_medium, utm_campaign,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NOVO', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      quoteId,
      data.nome,
      data.email,
      data.telefone,
      data.cidade || null,
      data.produto || null,
      data.tipoProjeto || null,
      data.mensagem,
      data.origem || referer || null,
      ipAddress,
      userAgent,
      utmSource,
      utmMedium,
      utmCampaign
    ).run();

    // TODO: Enviar notificação por e-mail/WhatsApp

    return c.json({
      success: true,
      message: 'Orçamento enviado com sucesso! Entraremos em contato em breve.',
      data: { id: quoteId },
    }, 201);

  } catch (error) {
    console.error('Erro ao enviar orçamento:', error);
    return c.json({ error: 'Erro ao enviar orçamento' }, 500);
  }
});

// ===========================================
// GET /api/admin/quotes - Listar orçamentos (ADMIN)
// ===========================================
quotes.get('/admin/quotes', async (c) => {
  try {
    const { status, page = 1, limit = 50 } = c.req.query();

    let query = `
      SELECT q.*, u.nome as vendedor_nome
      FROM quotes q
      LEFT JOIN users u ON q.vendedor_id = u.id
    `;

    const params = [];

    if (status) {
      query += ` WHERE q.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY q.created_at DESC`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    const countQuery = status
      ? `SELECT COUNT(*) as total FROM quotes WHERE status = ?`
      : `SELECT COUNT(*) as total FROM quotes`;

    const countParams = status ? [status] : [];
    const { total } = await c.env.DB.prepare(countQuery).bind(...countParams).first();

    return c.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });

  } catch (error) {
    console.error('Erro ao listar orçamentos:', error);
    return c.json({ error: 'Erro ao listar orçamentos' }, 500);
  }
});

// ===========================================
// GET /api/admin/quotes/:id - Detalhes do orçamento (ADMIN)
// ===========================================
quotes.get('/admin/quotes/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const quote = await c.env.DB.prepare(`
      SELECT q.*, u.nome as vendedor_nome, u.email as vendedor_email
      FROM quotes q
      LEFT JOIN users u ON q.vendedor_id = u.id
      WHERE q.id = ?
    `).bind(id).first();

    if (!quote) {
      return c.json({ error: 'Orçamento não encontrado' }, 404);
    }

    return c.json({
      success: true,
      data: quote,
    });

  } catch (error) {
    console.error('Erro ao buscar orçamento:', error);
    return c.json({ error: 'Erro ao buscar orçamento' }, 500);
  }
});

// ===========================================
// PATCH /api/admin/quotes/:id - Atualizar status (ADMIN)
// ===========================================
quotes.patch('/admin/quotes/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { id } = c.req.param();
    const { status, vendedorId, observacoes } = await c.req.json();

    const existing = await c.env.DB.prepare('SELECT * FROM quotes WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Orçamento não encontrado' }, 404);
    }

    const updates = [];
    const params = [];

    if (status) {
      if (!['NOVO', 'EM_ATENDIMENTO', 'ATENDIDO', 'PERDIDO'].includes(status)) {
        return c.json({ error: 'Status inválido' }, 400);
      }
      updates.push('status = ?');
      params.push(status);
    }

    if (vendedorId !== undefined) {
      updates.push('vendedor_id = ?');
      params.push(vendedorId);
    }

    if (observacoes !== undefined) {
      updates.push('observacoes = ?');
      params.push(observacoes);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    params.push(id);

    await c.env.DB.prepare(`
      UPDATE quotes SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, old_values, new_values, created_at)
      VALUES (?, ?, 'UPDATE', 'Quote', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      id,
      JSON.stringify({ status: existing.status }),
      JSON.stringify({ status, vendedorId, observacoes })
    ).run();

    return c.json({
      success: true,
      message: 'Orçamento atualizado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao atualizar orçamento:', error);
    return c.json({ error: 'Erro ao atualizar orçamento' }, 500);
  }
});

// ===========================================
// DELETE /api/admin/quotes/:id - Excluir orçamento (ADMIN)
// ===========================================
quotes.delete('/admin/quotes/:id', async (c) => {
  try {
    const { id } = c.req.param();

    await c.env.DB.prepare('DELETE FROM quotes WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: 'Orçamento excluído com sucesso',
    });

  } catch (error) {
    console.error('Erro ao excluir orçamento:', error);
    return c.json({ error: 'Erro ao excluir orçamento' }, 500);
  }
});

export default quotes;
