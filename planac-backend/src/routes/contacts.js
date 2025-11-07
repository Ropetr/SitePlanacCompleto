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
// POST /api/contacts - Enviar contato (PÚBLICO)
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

    await c.env.DB.prepare(`
      INSERT INTO contacts (id, nome, email, telefone, mensagem, lido, respondido, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      contactId,
      data.nome,
      data.email,
      data.telefone || null,
      data.mensagem
    ).run();

    // Enviar notificação por e-mail
    try {
      const emailHtml = createContactEmailTemplate({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
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
// GET /api/admin/contacts - Listar contatos (ADMIN)
// ===========================================
contacts.get('/admin/contacts', async (c) => {
  try {
    const { lido, page = 1, limit = 50 } = c.req.query();

    let query = `SELECT * FROM contacts`;
    const params = [];

    if (lido !== undefined) {
      query += ` WHERE lido = ?`;
      params.push(lido === 'true' ? 1 : 0);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    return c.json({ error: 'Erro ao listar contatos' }, 500);
  }
});

// ===========================================
// PATCH /api/admin/contacts/:id - Marcar como lido (ADMIN)
// ===========================================
contacts.patch('/admin/contacts/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { lido, respondido } = await c.req.json();

    const updates = [];
    const params = [];

    if (lido !== undefined) {
      updates.push('lido = ?');
      params.push(lido ? 1 : 0);
    }

    if (respondido !== undefined) {
      updates.push('respondido = ?');
      params.push(respondido ? 1 : 0);
      if (respondido) {
        updates.push('respondido_em = CURRENT_TIMESTAMP');
      }
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await c.env.DB.prepare(`
      UPDATE contacts SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();

    return c.json({
      success: true,
      message: 'Contato atualizado',
    });

  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    return c.json({ error: 'Erro ao atualizar contato' }, 500);
  }
});

export default contacts;
