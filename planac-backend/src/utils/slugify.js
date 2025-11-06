/**
 * ===========================================
 * SLUGIFY - Gera URLs amigáveis
 * ===========================================
 */

/**
 * Converte string para slug
 * Exemplo: "Divisória Naval" -> "divisoria-naval"
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/--+/g, '-') // Remove hífens duplicados
    .replace(/^-+/, '') // Remove hífen do início
    .replace(/-+$/, ''); // Remove hífen do final
}

/**
 * Gera slug único adicionando número se necessário
 */
export async function generateUniqueSlug(db, table, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = `SELECT id FROM ${table} WHERE slug = ?`;
    const params = [slug];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const existing = await db.prepare(query).bind(...params).first();

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
