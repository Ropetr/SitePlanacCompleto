/**
 * ===========================================
 * MEDIA ROUTES - Upload e Gestão de Mídia
 * ===========================================
 * - Upload de imagens com conversão para WebP
 * - Otimização automática de qualidade
 * - Deleção de imagem antiga ao substituir
 */

import { Hono } from 'hono';
import { generateId } from '../utils/crypto.js';

const media = new Hono();

/**
 * Tenta converter uma imagem para WebP usando Cloudflare Image Resizing.
 *
 * Retorno:
 * - { buffer: ArrayBuffer, converted: true }  -> conversão OK (buffer é WebP)
 * - { buffer: ArrayBuffer, converted: false } -> conversão falhou, usar original
 */
async function convertToWebP(arrayBuffer, originalType, env) {
  try {
    // Se já for WebP, não faz nada
    if (originalType === 'image/webp') {
      return {
        buffer: arrayBuffer,
        converted: false,
      };
    }

    const tempId = Date.now() + '-' + Math.random().toString(36).substring(7);
    const extFromType = originalType?.split('/')?.[1] || 'bin';
    const tempFileName = `temp-${tempId}.${extFromType}`;

    // 1) Upload temporário da imagem original no R2
    await env.R2_IMAGES.put(tempFileName, arrayBuffer, {
      httpMetadata: {
        contentType: originalType || 'application/octet-stream',
      },
    });

    // 2) Monta URL com Image Resizing para converter para WebP
    const optimizedUrl = `https://planac-images.r2.dev/cdn-cgi/image/format=webp,quality=85/${tempFileName}`;

    const response = await fetch(optimizedUrl);
    if (!response.ok) {
      throw new Error(`Image Resizing failed with status ${response.status}`);
    }

    const webpBuffer = await response.arrayBuffer();

    // 3) Apaga o arquivo temporário original
    try {
      await env.R2_IMAGES.delete(tempFileName);
    } catch (deleteError) {
      console.warn('Não foi possível deletar arquivo temporário:', deleteError);
    }

    // 4) Retorna buffer já convertido
    return {
      buffer: webpBuffer,
      converted: true,
    };
  } catch (error) {
    console.error('Erro ao converter imagem para WebP:', error);
    // Se der erro, devolve o original para não quebrar nada
    return {
      buffer: arrayBuffer,
      converted: false,
    };
  }
}

/**
 * Extrai nome do arquivo da URL
 */
function extractFileNameFromUrl(url) {
  if (!url) return null;
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch {
    return null;
  }
}

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

    // Converter para WebP (se possível)
    const arrayBuffer = await file.arrayBuffer();
    const conversion = await convertToWebP(arrayBuffer, file.type, c.env);

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);

    let extension;
    let contentType;
    let bufferToSave;

    if (conversion.converted) {
      // Conversão OK -> salva como WebP de verdade
      extension = 'webp';
      contentType = 'image/webp';
      bufferToSave = conversion.buffer;
    } else {
      // Conversão falhou ou não está disponível -> salva original
      const originalExt = file.name && file.name.includes('.')
        ? file.name.split('.').pop()
        : 'bin';

      extension = originalExt;
      contentType = file.type || 'application/octet-stream';
      bufferToSave = arrayBuffer;
    }

    const fileName = `${timestamp}-${randomStr}.${extension}`;

    await c.env.R2_IMAGES.put(fileName, bufferToSave, {
      httpMetadata: {
        contentType,
      },
    });

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
// POST /api/admin/media/replace - Substituir imagem (upload + delete antiga)
// ===========================================
media.post('/replace', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const formData = await c.req.formData();
    const file = formData.get('file');
    const oldUrl = formData.get('oldUrl'); // URL da imagem antiga

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

    // Converter para WebP (se possível)
    const arrayBuffer = await file.arrayBuffer();
    const conversion = await convertToWebP(arrayBuffer, file.type, c.env);

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);

    let extension;
    let contentType;
    let bufferToSave;

    if (conversion.converted) {
      extension = 'webp';
      contentType = 'image/webp';
      bufferToSave = conversion.buffer;
    } else {
      const originalExt = file.name && file.name.includes('.')
        ? file.name.split('.').pop()
        : 'bin';

      extension = originalExt;
      contentType = file.type || 'application/octet-stream';
      bufferToSave = arrayBuffer;
    }

    const fileName = `${timestamp}-${randomStr}.${extension}`;

    await c.env.R2_IMAGES.put(fileName, bufferToSave, {
      httpMetadata: {
        contentType,
      },
    });

    const publicUrl = `https://planac-images.r2.dev/${fileName}`;

    // Deletar imagem antiga se existir
    if (oldUrl) {
      const oldFileName = extractFileNameFromUrl(oldUrl);
      if (oldFileName) {
        try {
          await c.env.R2_IMAGES.delete(oldFileName);
          console.log(`✅ Imagem antiga deletada: ${oldFileName}`);
        } catch (error) {
          console.warn(`⚠️ Não foi possível deletar imagem antiga: ${oldFileName}`, error);
        }
      }
    }

    // Salvar registro do novo arquivo no banco
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
      file.type, // Salva o mime_type REAL no banco
      file.size,
      publicUrl,
      payload.id
    ).run();

    return c.json({
      success: true,
      message: 'Imagem substituída com sucesso',
      data: {
        id: mediaId,
        url: publicUrl,
        nome: fileName,
        tamanho: file.size,
        oldFileDeleted: !!oldUrl,
      },
    }, 201);

  } catch (error) {
    console.error('Erro ao substituir imagem:', error);
    return c.json({ error: 'Erro ao substituir imagem' }, 500);
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

// ===========================================
// DELETE /api/admin/media/by-url - Excluir arquivo por URL
// ===========================================
media.delete('/by-url', async (c) => {
  try {
    const { url } = await c.req.json();

    if (!url) {
      return c.json({ error: 'URL não fornecida' }, 400);
    }

    const fileName = extractFileNameFromUrl(url);

    if (!fileName) {
      return c.json({ error: 'URL inválida' }, 400);
    }

    // Excluir do R2
    await c.env.R2_IMAGES.delete(fileName);

    // Excluir do banco
    await c.env.DB.prepare('DELETE FROM media WHERE nome_arquivo = ?').bind(fileName).run();

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
