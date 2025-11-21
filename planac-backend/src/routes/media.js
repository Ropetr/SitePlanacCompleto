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
 * Mapeamento de dimensões por tipo de imagem
 */
const IMAGE_DIMENSIONS = {
  logo: { desktop: 500, mobile: 400, quality: 90 },      // Logos: pequenas, alta qualidade
  banner: { desktop: 1920, mobile: 720, quality: 85 },   // Banners: grandes, full-width
  gallery: { desktop: 1200, mobile: 600, quality: 85 },  // Galeria: médias
  thumbnail: { desktop: 400, mobile: 300, quality: 80 }, // Miniaturas: pequenas
  content: { desktop: 1000, mobile: 500, quality: 85 },  // Conteúdo: médias
  default: { desktop: 1920, mobile: 720, quality: 85 },  // Padrão: como banner
};

/**
 * Obtém dimensões da imagem a partir do ArrayBuffer
 * Suporta: JPEG, PNG, GIF, WebP
 */
async function getImageDimensions(arrayBuffer) {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);

    // Detectar tipo de imagem pelos magic bytes
    const isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8;
    const isPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50;
    const isGIF = uint8Array[0] === 0x47 && uint8Array[1] === 0x49;
    const isWebP = uint8Array[0] === 0x52 && uint8Array[1] === 0x49;

    if (isPNG && uint8Array.length >= 24) {
      // PNG: bytes 16-19 = width, 20-23 = height (big-endian)
      const width = (uint8Array[16] << 24) | (uint8Array[17] << 16) | (uint8Array[18] << 8) | uint8Array[19];
      const height = (uint8Array[20] << 24) | (uint8Array[21] << 16) | (uint8Array[22] << 8) | uint8Array[23];
      return { width, height };
    }

    if (isGIF && uint8Array.length >= 10) {
      // GIF: bytes 6-7 = width, 8-9 = height (little-endian)
      const width = uint8Array[6] | (uint8Array[7] << 8);
      const height = uint8Array[8] | (uint8Array[9] << 8);
      return { width, height };
    }

    if (isJPEG) {
      // JPEG: procurar por SOF0 marker (0xFFC0)
      for (let i = 2; i < uint8Array.length - 8; i++) {
        if (uint8Array[i] === 0xFF && uint8Array[i + 1] === 0xC0) {
          const height = (uint8Array[i + 5] << 8) | uint8Array[i + 6];
          const width = (uint8Array[i + 7] << 8) | uint8Array[i + 8];
          return { width, height };
        }
      }
    }

    if (isWebP && uint8Array.length >= 30) {
      // WebP: bytes 26-27 = width, 28-29 = height (little-endian, +1)
      const width = ((uint8Array[27] << 8) | uint8Array[26]) + 1;
      const height = ((uint8Array[29] << 8) | uint8Array[28]) + 1;
      return { width, height };
    }

    return { width: 0, height: 0 };
  } catch (error) {
    console.error('Erro ao obter dimensões da imagem:', error);
    return { width: 0, height: 0 };
  }
}

/**
 * Converte e redimensiona imagem para WebP usando Cloudflare Image Resizing.
 * Gera duas versões otimizadas baseadas no tipo de imagem.
 *
 * REGRAS DE REDIMENSIONAMENTO:
 * - Mantém proporção original (aspect ratio)
 * - NUNCA faz upscale (aumentar imagem)
 * - Usa dimensões específicas por tipo (logo, banner, gallery, etc)
 * - Se imagem for menor que target → mantém tamanho original
 *
 * @param {ArrayBuffer} arrayBuffer - Buffer da imagem original
 * @param {string} originalType - MIME type (image/jpeg, image/png, etc)
 * @param {Object} env - Cloudflare environment bindings
 * @param {string} imageType - Tipo da imagem: 'logo', 'banner', 'gallery', 'thumbnail', 'content'
 *
 * Retorno:
 * - { desktopBuffer, mobileBuffer, widthOriginal, heightOriginal, converted: true }
 * - { desktopBuffer: null, mobileBuffer: null, widthOriginal, heightOriginal, converted: false }
 */
async function convertToWebPResponsive(arrayBuffer, originalType, env, imageType = 'default') {
  try {
    // Obter dimensões originais
    const { width: widthOriginal, height: heightOriginal } = await getImageDimensions(arrayBuffer);

    if (!widthOriginal || !heightOriginal) {
      throw new Error('Não foi possível determinar dimensões da imagem');
    }

    // Se já for WebP E estiver nas dimensões ideais, não converte
    if (originalType === 'image/webp' && widthOriginal <= 1920) {
      return {
        desktopBuffer: arrayBuffer,
        mobileBuffer: widthOriginal <= 720 ? arrayBuffer : null,
        widthOriginal,
        heightOriginal,
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

    // 2) Obter dimensões alvo baseadas no tipo de imagem
    const dimensions = IMAGE_DIMENSIONS[imageType] || IMAGE_DIMENSIONS.default;
    const quality = dimensions.quality;

    // 3) Calcular larguras ideais (sem upscale)
    const desktopWidth = Math.min(widthOriginal, dimensions.desktop);
    const mobileWidth = Math.min(widthOriginal, dimensions.mobile);

    // 4) Gerar versão DESKTOP
    const desktopUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/cdn-cgi/image/format=webp,quality=${quality},width=${desktopWidth},fit=scale-down/${tempFileName}`;
    const desktopResponse = await fetch(desktopUrl);

    if (!desktopResponse.ok) {
      console.warn(`⚠️ Image Resizing não está disponível (status ${desktopResponse.status}). Cloudflare Image Resizing precisa ser habilitado no R2.`);
      throw new Error(`Image Resizing (desktop) failed with status ${desktopResponse.status}`);
    }

    const desktopBuffer = await desktopResponse.arrayBuffer();

    // 5) Gerar versão MOBILE
    const mobileUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/cdn-cgi/image/format=webp,quality=${quality},width=${mobileWidth},fit=scale-down/${tempFileName}`;
    const mobileResponse = await fetch(mobileUrl);

    if (!mobileResponse.ok) {
      throw new Error(`Image Resizing (mobile) failed with status ${mobileResponse.status}`);
    }

    const mobileBuffer = await mobileResponse.arrayBuffer();

    // 6) Apagar arquivo temporário
    try {
      await env.R2_IMAGES.delete(tempFileName);
    } catch (deleteError) {
      console.warn('Não foi possível deletar arquivo temporário:', deleteError);
    }

    // 7) Retornar buffers convertidos
    return {
      desktopBuffer,
      mobileBuffer,
      widthOriginal,
      heightOriginal,
      converted: true,
      imageType, // Retornar tipo usado
    };
  } catch (error) {
    console.error('Erro ao converter imagem para WebP responsivo:', error);

    // Fallback: tentar obter dimensões mesmo que conversão falhe
    const { width, height } = await getImageDimensions(arrayBuffer);

    return {
      desktopBuffer: null,
      mobileBuffer: null,
      widthOriginal: width || 0,
      heightOriginal: height || 0,
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
    const imageType = formData.get('imageType') || 'default'; // Tipo: logo, banner, gallery, etc

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

    // Converter para WebP responsivo (desktop + mobile) com tipo específico
    const arrayBuffer = await file.arrayBuffer();
    const conversion = await convertToWebPResponsive(arrayBuffer, file.type, c.env, imageType);

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);

    let desktopUrl = null;
    let mobileUrl = null;

    if (conversion.converted && conversion.desktopBuffer && conversion.mobileBuffer) {
      // ✅ Conversão OK -> salvar versões desktop e mobile como WebP

      // Salvar versão DESKTOP
      const desktopFileName = `${timestamp}-${randomStr}-desktop.webp`;
      await c.env.R2_IMAGES.put(desktopFileName, conversion.desktopBuffer, {
        httpMetadata: { contentType: 'image/webp' },
      });
      desktopUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/${desktopFileName}`;

      // Salvar versão MOBILE
      const mobileFileName = `${timestamp}-${randomStr}-mobile.webp`;
      await c.env.R2_IMAGES.put(mobileFileName, conversion.mobileBuffer, {
        httpMetadata: { contentType: 'image/webp' },
      });
      mobileUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/${mobileFileName}`;

      console.log(`✅ Imagem convertida: ${conversion.widthOriginal}x${conversion.heightOriginal} -> desktop.webp + mobile.webp`);

    } else {
      // ❌ Conversão falhou -> salvar original (fallback)
      console.warn(`⚠️ Conversão WebP falhou. Salvando imagem original.`);
      console.warn(`   Motivo: Cloudflare Image Resizing não está habilitado no bucket R2.`);

      const originalExt = file.name && file.name.includes('.')
        ? file.name.split('.').pop().toLowerCase()
        : 'jpg';

      const fileName = `${timestamp}-${randomStr}.${originalExt}`;

      // Salvar com Content-Type correto e cache headers
      const contentTypeMap = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp'
      };

      const contentType = contentTypeMap[originalExt] || file.type || 'application/octet-stream';

      await c.env.R2_IMAGES.put(fileName, arrayBuffer, {
        httpMetadata: {
          contentType,
          cacheControl: 'public, max-age=31536000',
        },
      });

      const publicUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/${fileName}`;
      desktopUrl = publicUrl;
      mobileUrl = publicUrl;

      console.log(`✅ Imagem original salva: ${fileName} (${conversion.widthOriginal}x${conversion.heightOriginal}px)`);
    }

    // Salvar registro no banco com URLs responsivas
    const mediaId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO media (
        id, nome_original, nome_arquivo, tipo, mime_type, tamanho,
        url, desktop_url, mobile_url, width_original, height_original,
        uploaded_by_id, created_at
      ) VALUES (?, ?, ?, 'IMAGEM', ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      mediaId,
      file.name,
      `${timestamp}-${randomStr}`, // base name sem extensão
      file.type,
      file.size,
      desktopUrl, // url principal = desktop
      desktopUrl,
      mobileUrl,
      conversion.widthOriginal || 0,
      conversion.heightOriginal || 0,
      payload.id
    ).run();

    return c.json({
      success: true,
      message: 'Imagem enviada e otimizada com sucesso',
      data: {
        id: mediaId,
        url: desktopUrl,
        desktop_url: desktopUrl,
        mobile_url: mobileUrl,
        width_original: conversion.widthOriginal,
        height_original: conversion.heightOriginal,
        converted: conversion.converted,
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
    const oldUrl = formData.get('oldUrl'); // URL da imagem antiga (desktop)
    const oldMobileUrl = formData.get('oldMobileUrl'); // URL da versão mobile antiga
    const imageType = formData.get('imageType') || 'default'; // Tipo: logo, banner, gallery, etc

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

    // Converter para WebP responsivo (desktop + mobile) com tipo específico
    const arrayBuffer = await file.arrayBuffer();
    const conversion = await convertToWebPResponsive(arrayBuffer, file.type, c.env, imageType);

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);

    let desktopUrl = null;
    let mobileUrl = null;
    let filesDeleted = 0;

    if (conversion.converted && conversion.desktopBuffer && conversion.mobileBuffer) {
      // ✅ Conversão OK -> salvar versões desktop e mobile como WebP

      // Salvar versão DESKTOP
      const desktopFileName = `${timestamp}-${randomStr}-desktop.webp`;
      await c.env.R2_IMAGES.put(desktopFileName, conversion.desktopBuffer, {
        httpMetadata: { contentType: 'image/webp' },
      });
      desktopUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/${desktopFileName}`;

      // Salvar versão MOBILE
      const mobileFileName = `${timestamp}-${randomStr}-mobile.webp`;
      await c.env.R2_IMAGES.put(mobileFileName, conversion.mobileBuffer, {
        httpMetadata: { contentType: 'image/webp' },
      });
      mobileUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/${mobileFileName}`;

      console.log(`✅ Imagem convertida: ${conversion.widthOriginal}x${conversion.heightOriginal} -> desktop.webp + mobile.webp`);

    } else {
      // ❌ Conversão falhou -> salvar original (fallback)
      console.warn(`⚠️ Conversão WebP falhou. Salvando imagem original.`);
      console.warn(`   Motivo: Cloudflare Image Resizing não está habilitado no bucket R2.`);

      const originalExt = file.name && file.name.includes('.')
        ? file.name.split('.').pop().toLowerCase()
        : 'jpg';

      const fileName = `${timestamp}-${randomStr}.${originalExt}`;

      // Salvar com Content-Type correto e cache headers
      const contentTypeMap = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp'
      };

      const contentType = contentTypeMap[originalExt] || file.type || 'application/octet-stream';

      await c.env.R2_IMAGES.put(fileName, arrayBuffer, {
        httpMetadata: {
          contentType,
          cacheControl: 'public, max-age=31536000',
        },
      });

      const publicUrl = `https://planac-backend-api.planacacabamentos.workers.dev/images/${fileName}`;
      desktopUrl = publicUrl;
      mobileUrl = publicUrl;

      console.log(`✅ Imagem original salva: ${fileName} (${conversion.widthOriginal}x${conversion.heightOriginal}px)`);
    }

    // Deletar imagens antigas se existirem (desktop + mobile)
    if (oldUrl) {
      const oldFileName = extractFileNameFromUrl(oldUrl);
      if (oldFileName) {
        try {
          await c.env.R2_IMAGES.delete(oldFileName);
          filesDeleted++;
          console.log(`✅ Imagem desktop antiga deletada: ${oldFileName}`);
        } catch (error) {
          console.warn(`⚠️ Não foi possível deletar desktop antiga: ${oldFileName}`, error);
        }
      }
    }

    if (oldMobileUrl && oldMobileUrl !== oldUrl) {
      const oldMobileFileName = extractFileNameFromUrl(oldMobileUrl);
      if (oldMobileFileName) {
        try {
          await c.env.R2_IMAGES.delete(oldMobileFileName);
          filesDeleted++;
          console.log(`✅ Imagem mobile antiga deletada: ${oldMobileFileName}`);
        } catch (error) {
          console.warn(`⚠️ Não foi possível deletar mobile antiga: ${oldMobileFileName}`, error);
        }
      }
    }

    // Salvar registro do novo arquivo no banco
    const mediaId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO media (
        id, nome_original, nome_arquivo, tipo, mime_type, tamanho,
        url, desktop_url, mobile_url, width_original, height_original,
        uploaded_by_id, created_at
      ) VALUES (?, ?, ?, 'IMAGEM', ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      mediaId,
      file.name,
      `${timestamp}-${randomStr}`, // base name sem extensão
      file.type,
      file.size,
      desktopUrl, // url principal = desktop
      desktopUrl,
      mobileUrl,
      conversion.widthOriginal || 0,
      conversion.heightOriginal || 0,
      payload.id
    ).run();

    return c.json({
      success: true,
      message: 'Imagem substituída e otimizada com sucesso',
      data: {
        id: mediaId,
        url: desktopUrl,
        desktop_url: desktopUrl,
        mobile_url: mobileUrl,
        width_original: conversion.widthOriginal,
        height_original: conversion.heightOriginal,
        converted: conversion.converted,
        oldFilesDeleted: filesDeleted,
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
