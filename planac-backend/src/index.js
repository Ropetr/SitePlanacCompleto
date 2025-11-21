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
import menuRoutes from './routes/menus.js';
import quoteRoutes from './routes/quotes.js';
import contactRoutes from './routes/contacts.js';
import settingRoutes from './routes/settings.js';
import pageRoutes from './routes/pages.js';
import mediaRoutes from './routes/media.js';
import dashboardRoutes from './routes/dashboard.js';
import buildDeployRoutes from './routes/build-deploy.js';

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
    'https://main.planac-admin.pages.dev', // Painel admin (main branch)
    'https://planac-admin.pages.dev', // Painel admin (todas as branches)
    'http://localhost:5173', // Dev frontend
    'http://localhost:5174', // Dev frontend (porta alternativa)
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

// Root route - API info
app.get('/', (c) => {
  return c.json({
    name: 'Planac Backend API',
    version: '1.0.0',
    status: 'online',
    message: 'API REST para gerenciamento do site Planac Distribuidora',
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me'
      },
      public: {
        products: 'GET /api/products',
        menus: 'GET /api/menus',
        quotes: 'POST /api/quotes',
        contacts: 'POST /api/contacts'
      },
      admin: {
        dashboard: 'GET /api/admin/dashboard',
        products: 'GET/POST/PUT/DELETE /api/admin/products',
        menus: 'GET/POST/PUT/DELETE /api/admin/menus',
        quotes: 'GET/PATCH/DELETE /api/admin/quotes',
        contacts: 'GET /api/admin/contacts',
        media: 'POST /api/admin/media/upload'
      }
    },
    docs: 'https://github.com/planac-distribuidora/api-docs'
  });
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'OK',
    message: 'Planac API rodando no Cloudflare Workers 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    deployMethod: 'GitHub Actions - Auto Deploy',
  });
});

// Rotas de autenticação (públicas)
app.route('/api/auth', authRoutes);

// Rotas públicas da API
app.route('/api/products', productRoutes);
app.route('/api/menus', menuRoutes);
app.route('/api/settings', settingRoutes);
app.route('/api/pages', pageRoutes);

// Formulários públicos (sem autenticação)
app.route('/api/quotes', quoteRoutes);
app.route('/api/contacts', contactRoutes);

// Rota interna de build-deploy (sem JWT - usada pelo triggerBuildDeploy)
app.route('/api/internal/build-deploy', buildDeployRoutes);

// ===========================================
// ROTA PÚBLICA PARA SERVIR IMAGENS DO R2
// ===========================================
// Serve imagens do R2 através do Worker (contorna problemas de domínio público)
app.get('/images/:filename', async (c) => {
  try {
    const filename = c.req.param('filename');

    // Buscar arquivo do R2
    const object = await c.env.R2_IMAGES.get(filename);

    if (!object) {
      return c.json({ error: 'Imagem não encontrada' }, 404);
    }

    // Obter Content-Type dos metadados ou inferir da extensão
    const ext = filename.split('.').pop().toLowerCase();
    const contentTypeMap = {
      'webp': 'image/webp',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
    };

    const contentType = object.httpMetadata?.contentType || contentTypeMap[ext] || 'application/octet-stream';

    // Retornar imagem com headers corretos
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 1 ano de cache
        'ETag': object.httpEtag || '',
      },
    });

  } catch (error) {
    console.error('Erro ao servir imagem:', error);
    return c.json({ error: 'Erro ao carregar imagem' }, 500);
  }
});

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
app.route('/api/admin/build-deploy', buildDeployRoutes);

// Rotas admin para gerenciar recursos
app.route('/api/admin/products', productRoutes);
app.route('/api/admin/menus', menuRoutes);
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
