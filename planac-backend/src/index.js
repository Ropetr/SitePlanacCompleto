/**
 * ===========================================
 * PLANAC BACKEND API - Cloudflare Workers
 * ===========================================
 * Framework: Hono (ultra-rápido e leve)
 * Banco: Cloudflare D1 (SQL serverless)
 * Storage: Cloudflare R2 (imagens)
 * Cache: Cloudflare KV
 * ===========================================
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { jwt } from 'hono/jwt';

// Importar rotas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import quoteRoutes from './routes/quotes.js';
import contactRoutes from './routes/contacts.js';
import settingRoutes from './routes/settings.js';
import pageRoutes from './routes/pages.js';
import mediaRoutes from './routes/media.js';
import dashboardRoutes from './routes/dashboard.js';

// Criar app Hono
const app = new Hono();

// ===========================================
// MIDDLEWARES GLOBAIS
// ===========================================

// Logger - registra todas as requisições
app.use('*', logger());

// Pretty JSON - formata respostas JSON
app.use('*', prettyJSON());

// Secure Headers - adiciona headers de segurança
app.use('*', secureHeaders());

// CORS - permite requisições do frontend
app.use('*', cors({
  origin: [
    'https://siteplanaccompleto.pages.dev',
    'https://admin-planac.pages.dev', // Painel admin
    'http://localhost:5173', // Dev frontend
    'http://localhost:3000', // Dev admin
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
}));

// ===========================================
// ROTAS PÚBLICAS
// ===========================================

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'OK',
    message: 'Planac API rodando no Cloudflare Workers 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Rotas de autenticação (públicas)
app.route('/api/auth', authRoutes);

// Rotas públicas da API
app.route('/api/products', productRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/settings', settingRoutes);
app.route('/api/pages', pageRoutes);

// Formulários públicos (sem autenticação)
app.route('/api/quotes', quoteRoutes);
app.route('/api/contacts', contactRoutes);

// ===========================================
// MIDDLEWARE JWT - Protege rotas admin
// ===========================================

app.use('/api/admin/*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

// ===========================================
// ROTAS PROTEGIDAS (ADMIN)
// ===========================================

app.route('/api/admin/dashboard', dashboardRoutes);
app.route('/api/admin/media', mediaRoutes);

// Rotas admin para gerenciar recursos
app.route('/api/admin/products', productRoutes);
app.route('/api/admin/categories', categoryRoutes);
app.route('/api/admin/quotes', quoteRoutes);
app.route('/api/admin/contacts', contactRoutes);
app.route('/api/admin/settings', settingRoutes);
app.route('/api/admin/pages', pageRoutes);

// ===========================================
// TRATAMENTO DE ERROS
// ===========================================

// 404 - Rota não encontrada
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'Rota não encontrada',
    path: c.req.path,
  }, 404);
});

// Error handler global
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);

  if (err.message.includes('JWT')) {
    return c.json({
      error: 'Unauthorized',
      message: 'Token inválido ou expirado',
    }, 401);
  }

  return c.json({
    error: 'Internal Server Error',
    message: process.env.ENVIRONMENT === 'development' ? err.message : 'Erro interno do servidor',
  }, 500);
});

// ===========================================
// EXPORTAR APP
// ===========================================

export default app;
