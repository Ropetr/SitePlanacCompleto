/**
 * ============================================
 * IMAGE OPTIMIZER - Cloudflare Image Resizing
 * ============================================
 *
 * Converte automaticamente qualquer imagem para WebP otimizado
 * usando Cloudflare Image Resizing.
 *
 * Docs: https://developers.cloudflare.com/images/image-resizing/
 */

const R2_DOMAIN = 'https://planac-images.r2.dev';
const R2_PUBLIC_DOMAIN = 'https://pub-63c4447c03264f5397d9b5cf2daf1a44.r2.dev';

/**
 * Verifica se a URL é do R2 da Planac
 */
function isR2Image(url) {
  if (!url) return false;
  return url.includes('planac-images.r2.dev') ||
         url.includes('pub-63c4447c03264f5397d9b5cf2daf1a44.r2.dev');
}

/**
 * Extrai o nome do arquivo da URL do R2
 */
function extractFileName(url) {
  if (!url) return null;
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch {
    return null;
  }
}

/**
 * Gera URL otimizada com Cloudflare Image Resizing
 *
 * @param {string} imageUrl - URL original da imagem
 * @param {object} options - Opções de otimização
 * @param {number} options.width - Largura desejada (opcional)
 * @param {number} options.height - Altura desejada (opcional)
 * @param {string} options.fit - Modo de fit: scale-down, contain, cover, crop, pad
 * @param {number} options.quality - Qualidade (1-100, padrão: 85)
 * @param {string} options.format - Formato: webp, avif, auto (padrão: webp)
 * @returns {string} URL otimizada
 */
export function optimizeImage(imageUrl, options = {}) {
  // Se não for imagem do R2, retorna original
  if (!isR2Image(imageUrl)) {
    return imageUrl;
  }

  const {
    width,
    height,
    fit = 'scale-down',
    quality = 85,
    format = 'webp'
  } = options;

  const fileName = extractFileName(imageUrl);
  if (!fileName) return imageUrl;

  // Construir parâmetros de otimização
  const params = [];

  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  params.push(`fit=${fit}`);
  params.push(`quality=${quality}`);
  params.push(`format=${format}`);

  const queryString = params.join(',');

  // URL final com Cloudflare Image Resizing
  return `${R2_DOMAIN}/cdn-cgi/image/${queryString}/${fileName}`;
}

/**
 * Otimiza logo (menor, alta qualidade)
 */
export function optimizeLogo(imageUrl) {
  return optimizeImage(imageUrl, {
    width: 400,
    quality: 90,
    fit: 'contain'
  });
}

/**
 * Otimiza banner de página (grande, boa qualidade)
 */
export function optimizeBanner(imageUrl) {
  return optimizeImage(imageUrl, {
    width: 1920,
    height: 800,
    quality: 85,
    fit: 'cover'
  });
}

/**
 * Otimiza thumbnail (pequeno, qualidade média)
 */
export function optimizeThumbnail(imageUrl) {
  return optimizeImage(imageUrl, {
    width: 400,
    height: 300,
    quality: 80,
    fit: 'cover'
  });
}

/**
 * Otimiza imagem de galeria (médio, boa qualidade)
 */
export function optimizeGallery(imageUrl) {
  return optimizeImage(imageUrl, {
    width: 1200,
    height: 900,
    quality: 85,
    fit: 'scale-down'
  });
}

/**
 * Otimiza preview no admin (pequeno, baixa qualidade)
 */
export function optimizePreview(imageUrl) {
  return optimizeImage(imageUrl, {
    width: 300,
    height: 200,
    quality: 75,
    fit: 'cover'
  });
}

/**
 * Gera srcset responsivo para imagens
 * Retorna string pronta para usar em <img srcset="">
 */
export function generateSrcSet(imageUrl, sizes = [640, 1024, 1920]) {
  if (!isR2Image(imageUrl)) {
    return imageUrl;
  }

  return sizes
    .map(width => `${optimizeImage(imageUrl, { width })} ${width}w`)
    .join(', ');
}

/**
 * Retorna URL original (sem otimização)
 * Útil para downloads ou quando precisar da imagem original
 */
export function getOriginalImage(imageUrl) {
  return imageUrl;
}
