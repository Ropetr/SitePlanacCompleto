/**
 * ===========================================
 * AUTH ROUTES - Autenticação e Usuários
 * ===========================================
 */

import { Hono } from 'hono';
import { hashPassword, verifyPassword, generateId } from '../utils/crypto.js';
import { createToken, verifyToken } from '../utils/jwt.js';
import { validate, loginSchema, registerSchema } from '../utils/validators.js';

const auth = new Hono();

// ===========================================
// POST /api/auth/login - Login de usuário
// ===========================================
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    console.log('[LOGIN] Request body:', body);

    // Validar dados
    const validation = validate(loginSchema, body);
    if (!validation.success) {
      console.log('[LOGIN] Validation failed:', validation.errors);
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const { email, senha } = validation.data;
    console.log('[LOGIN] Email:', email);

    // Buscar usuário no banco
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ? AND ativo = 1'
    ).bind(email).first();

    if (!user) {
      console.log('[LOGIN] User not found');
      return c.json({ error: 'E-mail ou senha incorretos' }, 401);
    }

    console.log('[LOGIN] User found:', user.id, user.email);

    // Verificar senha
    const isValidPassword = await verifyPassword(senha, user.senha);
    console.log('[LOGIN] Password valid:', isValidPassword);

    if (!isValidPassword) {
      return c.json({ error: 'E-mail ou senha incorretos' }, 401);
    }

    // Atualizar último acesso
    await c.env.DB.prepare(
      'UPDATE users SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(user.id).run();

    // Criar tokens JWT
    const payload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    };

    const accessToken = await createToken(payload, c.env.JWT_SECRET, '7d');
    const refreshToken = await createToken(
      { id: user.id },
      c.env.JWT_REFRESH_SECRET,
      '30d'
    );

    // Salvar refresh token no KV
    await c.env.KV_SESSIONS.put(
      `refresh:${user.id}`,
      refreshToken,
      { expirationTtl: 30 * 24 * 60 * 60 } // 30 dias
    );

    // Log de auditoria
    await c.env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, acao, entidade, ip_address, created_at)
       VALUES (?, ?, 'LOGIN', 'User', ?, CURRENT_TIMESTAMP)`
    ).bind(
      generateId(),
      user.id,
      c.req.header('CF-Connecting-IP') || 'unknown'
    ).run();

    return c.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    console.error('[LOGIN] Error caught:', error);
    console.error('[LOGIN] Error message:', error.message);
    console.error('[LOGIN] Error stack:', error.stack);
    return c.json({
      error: 'Erro ao fazer login',
      message: error.message,
      details: error.stack
    }, 500);
  }
});

// ===========================================
// POST /api/auth/register - Registrar usuário (admin)
// ===========================================
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();

    // Validar dados
    const validation = validate(registerSchema, body);
    if (!validation.success) {
      return c.json({ error: 'Dados inválidos', errors: validation.errors }, 400);
    }

    const { nome, email, senha, role = 'EDITOR' } = validation.data;

    // Verificar se e-mail já existe
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return c.json({ error: 'E-mail já cadastrado' }, 409);
    }

    // Hash da senha
    const hashedPassword = await hashPassword(senha);

    // Inserir usuário
    const userId = generateId();
    await c.env.DB.prepare(
      `INSERT INTO users (id, nome, email, senha, role, ativo, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(userId, nome, email, hashedPassword, role).run();

    return c.json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: userId,
        nome,
        email,
        role,
      },
    }, 201);

  } catch (error) {
    console.error('Erro no registro:', error);
    return c.json({ error: 'Erro ao cadastrar usuário' }, 500);
  }
});

// ===========================================
// POST /api/auth/refresh - Renovar access token
// ===========================================
auth.post('/refresh', async (c) => {
  try {
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
      return c.json({ error: 'Refresh token não fornecido' }, 400);
    }

    // Verificar refresh token
    const { valid, payload } = await verifyToken(refreshToken, c.env.JWT_REFRESH_SECRET);

    if (!valid) {
      return c.json({ error: 'Refresh token inválido ou expirado' }, 401);
    }

    // Verificar se o token ainda está no KV
    const storedToken = await c.env.KV_SESSIONS.get(`refresh:${payload.id}`);
    if (storedToken !== refreshToken) {
      return c.json({ error: 'Refresh token revogado' }, 401);
    }

    // Buscar usuário
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE id = ? AND ativo = 1'
    ).bind(payload.id).first();

    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Criar novo access token
    const newAccessToken = await createToken({
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    }, c.env.JWT_SECRET, '7d');

    return c.json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return c.json({ error: 'Erro ao renovar token' }, 500);
  }
});

// ===========================================
// POST /api/auth/logout - Logout (revoga refresh token)
// ===========================================
auth.post('/logout', async (c) => {
  try {
    const payload = c.get('jwtPayload');

    if (payload?.id) {
      // Remover refresh token do KV
      await c.env.KV_SESSIONS.delete(`refresh:${payload.id}`);
    }

    return c.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });

  } catch (error) {
    console.error('Erro no logout:', error);
    return c.json({ error: 'Erro ao fazer logout' }, 500);
  }
});

// ===========================================
// GET /api/auth/me - Dados do usuário logado
// ===========================================
auth.get('/me', async (c) => {
  try {
    const payload = c.get('jwtPayload');

    if (!payload) {
      return c.json({ error: 'Não autenticado' }, 401);
    }

    const user = await c.env.DB.prepare(
      'SELECT id, nome, email, role, avatar, ativo, ultimo_acesso FROM users WHERE id = ?'
    ).bind(payload.id).first();

    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    return c.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return c.json({ error: 'Erro ao buscar dados do usuário' }, 500);
  }
});

export default auth;
