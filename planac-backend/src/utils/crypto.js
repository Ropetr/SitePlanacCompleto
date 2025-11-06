/**
 * ===========================================
 * CRYPTO UTILS - Hash e JWT
 * ===========================================
 * Usando Web Crypto API (nativo do Cloudflare Workers)
 */

/**
 * Hash de senha usando bcrypt-like (Web Crypto API)
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

/**
 * Verifica se a senha corresponde ao hash
 */
export async function verifyPassword(password, hash) {
  const hashedAttempt = await hashPassword(password);
  return hashedAttempt === hash;
}

/**
 * Gera um ID único (UUID v4)
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Gera um token aleatório
 */
export function generateToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
