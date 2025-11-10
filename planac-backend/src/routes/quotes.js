/**
 * ===========================================
 * QUOTES ROUTES - Orçamentos e Leads
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, quoteSchema } from '../utils/validators.js';
import { sendEmail, createQuoteEmailTemplate } from '../utils/email.js';

const quotes = new Hono();

// ===========================================
// POST / - Enviar orçamento (PÚBLICO - será /api/quotes)
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
        id, nome, email, telefone, cidade, produto_interesse, mensagem,
        status, ip_address, user_agent, utm_source, utm_medium, utm_campaign,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDENTE', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      quoteId,
      data.nome,
      data.email,
      data.telefone || null,
      data.cidade || null,
      data.produto_interesse || null,
      data.mensagem,
      ipAddress,
      userAgent,
      utmSource,
      utmMedium,
      utmCampaign
    ).run();

    // Enviar notificação por e-mail
    try {
      const emailHtml = createQuoteEmailTemplate({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cidade: data.cidade,
        produto_interesse: data.produto_interesse,
        mensagem: data.mensagem,
      });

      await sendEmail({
        to: 'contato@planacdivisorias.com.br',
        subject: `🎯 Novo Orçamento - ${data.nome}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Erro ao enviar e-mail:', emailError);
      // Continua mesmo se o e-mail falhar
    }

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
// GET / - Listar orçamentos (ADMIN - será /api/admin/quotes)
// ===========================================
quotes.get('/', async (c) => {
  try {
    const { status, search, page = 1, limit = 20 } = c.req.query();

    let query = `
      SELECT q.*
      FROM quotes q
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ` AND q.status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (q.nome LIKE ? OR q.email LIKE ? OR q.telefone LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY q.created_at DESC`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM quotes WHERE 1=1`;
    const countParams = [];

    if (status && status !== 'all') {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    if (search) {
      countQuery += ` AND (nome LIKE ? OR email LIKE ? OR telefone LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const { total } = await c.env.DB.prepare(countQuery).bind(...countParams).first();

    return c.json({
      success: true,
      quotes: results,
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
// GET /:id - Detalhes do orçamento (ADMIN)
// ===========================================
quotes.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const quote = await c.env.DB.prepare(`
      SELECT * FROM quotes WHERE id = ?
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
// PATCH /:id - Atualizar status (ADMIN)
// ===========================================
quotes.patch('/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { id } = c.req.param();
    const { status, observacoes_internas } = await c.req.json();

    const existing = await c.env.DB.prepare('SELECT * FROM quotes WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Orçamento não encontrado' }, 404);
    }

    const updates = [];
    const params = [];

    if (status) {
      if (!['PENDENTE', 'EM_ANALISE', 'RESPONDIDO', 'ARQUIVADO'].includes(status)) {
        return c.json({ error: 'Status inválido' }, 400);
      }
      updates.push('status = ?');
      params.push(status);
    }

    if (observacoes_internas !== undefined) {
      updates.push('observacoes_internas = ?');
      params.push(observacoes_internas);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    params.push(id);

    await c.env.DB.prepare(`
      UPDATE quotes SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, acao, entidade, entidade_id, dados_anteriores, dados_novos, created_at)
      VALUES (?, ?, 'UPDATE', 'Quote', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      id,
      JSON.stringify({ status: existing.status }),
      JSON.stringify({ status, observacoes_internas })
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
// DELETE /:id - Excluir orçamento (ADMIN)
// ===========================================
quotes.delete('/:id', async (c) => {
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
