/**
 * ===========================================
 * JWT UTILS - Criação e validação de tokens
 * ===========================================
 * Usando a biblioteca 'jose' (compatível com Cloudflare Workers)
 */

import * as jose from 'jose';

/**
 * Cria um JWT token
 */
export async function createToken(payload, secret, expiresIn = '7d') {
  const secretKey = new TextEncoder().encode(secret);

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);

  return token;
}

/**
 * Verifica e decodifica um JWT token
 */
export async function verifyToken(token, secret) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, secretKey);
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Extrai token do header Authorization
 */
export function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
