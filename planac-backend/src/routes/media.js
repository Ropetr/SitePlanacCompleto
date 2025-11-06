/**
 * ===========================================
 * MEDIA ROUTES - Upload e Gestão de Mídia
 * ===========================================
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';

const media = new Hono();

// ===========================================
// POST /api/admin/media/upload - Upload de imagem (ADMIN)
// ===========================================
media.post('/upload', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'Arquivo não fornecido' }, 400);
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF' }, 400);
    }

    // Validar tamanho (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ error: 'Arquivo muito grande. Máximo: 10MB' }, 400);
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${extension}`;

    // Upload para Cloudflare R2
    const arrayBuffer = await file.arrayBuffer();
    await c.env.R2_IMAGES.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // URL pública do arquivo
    // Substitua pelo seu domínio R2 público ou Custom Domain
    const publicUrl = `https://planac-images.r2.dev/${fileName}`;

    // Salvar registro no banco
    const mediaId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO media (
        id, nome_original, nome_arquivo, tipo, mime_type, tamanho,
        url, uploaded_by_id, created_at
      ) VALUES (?, ?, ?, 'IMAGEM', ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      mediaId,
      file.name,
      fileName,
      file.type,
      file.size,
      publicUrl,
      payload.id
    ).run();

    return c.json({
      success: true,
      message: 'Imagem enviada com sucesso',
      data: {
        id: mediaId,
        url: publicUrl,
        nome: fileName,
        tamanho: file.size,
      },
    }, 201);

  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return c.json({ error: 'Erro ao fazer upload da imagem' }, 500);
  }
});

// ===========================================
// GET /api/admin/media - Listar arquivos (ADMIN)
// ===========================================
media.get('/', async (c) => {
  try {
    const { tipo, page = 1, limit = 50 } = c.req.query();

    let query = `SELECT * FROM media`;
    const params = [];

    if (tipo) {
      query += ` WHERE tipo = ?`;
      params.push(tipo);
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
    console.error('Erro ao listar mídia:', error);
    return c.json({ error: 'Erro ao listar arquivos' }, 500);
  }
});

// ===========================================
// DELETE /api/admin/media/:id - Excluir arquivo (ADMIN)
// ===========================================
media.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const mediaFile = await c.env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first();

    if (!mediaFile) {
      return c.json({ error: 'Arquivo não encontrado' }, 404);
    }

    // Excluir do R2
    await c.env.R2_IMAGES.delete(mediaFile.nome_arquivo);

    // Excluir do banco
    await c.env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: 'Arquivo excluído com sucesso',
    });

  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
    return c.json({ error: 'Erro ao excluir arquivo' }, 500);
  }
});

export default media;
