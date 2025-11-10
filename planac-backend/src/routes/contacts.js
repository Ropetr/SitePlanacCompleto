/**
 * ===========================================
 * CONTACTS ROUTES - Formulário de Contato
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';
import { validate, contactSchema } from '../utils/validators.js';
import { sendEmail, createContactEmailTemplate } from '../utils/email.js';

const contacts = new Hono();

// ===========================================
// POST / - Enviar contato (PÚBLICO - será /api/contacts)
// ===========================================
contacts.post('/', async (c) => {
  try {
    const body = await c.req.json();

    const validation = validate(contactSchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const data = validation.data;
    const contactId = generateId();

    // Capturar informações de rastreamento
    const ipAddress = c.req.header('CF-Connecting-IP') || 'unknown';
    const userAgent = c.req.header('User-Agent') || '';

    await c.env.DB.prepare(`
      INSERT INTO contacts (
        id, nome, email, telefone, assunto, tipo, mensagem,
        status, ip_address, user_agent,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDENTE', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      contactId,
      data.nome,
      data.email,
      data.telefone || null,
      data.assunto || null,
      data.tipo || 'OUTROS',
      data.mensagem,
      ipAddress,
      userAgent
    ).run();

    // Enviar notificação por e-mail
    try {
      const emailHtml = createContactEmailTemplate({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        assunto: data.assunto,
        tipo: data.tipo,
        mensagem: data.mensagem,
      });

      await sendEmail({
        to: 'contato@planacdivisorias.com.br',
        subject: `💬 Nova Mensagem de Contato - ${data.nome}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Erro ao enviar e-mail:', emailError);
      // Continua mesmo se o e-mail falhar
    }

    return c.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Responderemos em breve.',
      data: { id: contactId },
    }, 201);

  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    return c.json({ error: 'Erro ao enviar mensagem' }, 500);
  }
});

// ===========================================
// GET / - Listar contatos (ADMIN - será /api/admin/contacts)
// ===========================================
contacts.get('/', async (c) => {
  try {
    const { status, search, page = 1, limit = 20 } = c.req.query();

    let query = `
      SELECT *
      FROM contacts
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (nome LIKE ? OR email LIKE ? OR assunto LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY created_at DESC`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM contacts WHERE 1=1`;
    const countParams = [];

    if (status && status !== 'all') {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    if (search) {
      countQuery += ` AND (nome LIKE ? OR email LIKE ? OR assunto LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const { total } = await c.env.DB.prepare(countQuery).bind(...countParams).first();

    return c.json({
      success: true,
      contacts: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });

  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    return c.json({ error: 'Erro ao listar contatos' }, 500);
  }
});

// ===========================================
// GET /:id - Detalhes do contato (ADMIN)
// ===========================================
contacts.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const contact = await c.env.DB.prepare(`
      SELECT * FROM contacts WHERE id = ?
    `).bind(id).first();

    if (!contact) {
      return c.json({ error: 'Contato não encontrado' }, 404);
    }

    return c.json({
      success: true,
      data: contact,
    });

  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    return c.json({ error: 'Erro ao buscar contato' }, 500);
  }
});

// ===========================================
// PATCH /:id - Atualizar status (ADMIN)
// ===========================================
contacts.patch('/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { id } = c.req.param();
    const { status, observacoes_internas } = await c.req.json();

    const existing = await c.env.DB.prepare('SELECT * FROM contacts WHERE id = ?').bind(id).first();

    if (!existing) {
      return c.json({ error: 'Contato não encontrado' }, 404);
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
      UPDATE contacts SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, acao, entidade, entidade_id, dados_anteriores, dados_novos, created_at)
      VALUES (?, ?, 'UPDATE', 'Contact', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      generateId(),
      payload.id,
      id,
      JSON.stringify({ status: existing.status }),
      JSON.stringify({ status, observacoes_internas })
    ).run();

    return c.json({
      success: true,
      message: 'Contato atualizado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    return c.json({ error: 'Erro ao atualizar contato' }, 500);
  }
});

// ===========================================
// DELETE /:id - Excluir contato (ADMIN)
// ===========================================
contacts.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    await c.env.DB.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: 'Contato excluído com sucesso',
    });

  } catch (error) {
    console.error('Erro ao excluir contato:', error);
    return c.json({ error: 'Erro ao excluir contato' }, 500);
  }
});

export default contacts;
