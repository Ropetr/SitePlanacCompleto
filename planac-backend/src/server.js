import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import { rateLimit } from 'express-rate-limit';

// Importar rotas
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import quoteRoutes from './routes/quote.routes.js';
import contactRoutes from './routes/contact.routes.js';
import settingRoutes from './routes/setting.routes.js';
import mediaRoutes from './routes/media.routes.js';
import pageRoutes from './routes/page.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Importar middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================================
// MIDDLEWARES DE SEGURANÇA
// ===========================================

// Helmet - Headers de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Configuração de origens permitidas
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://siteplanaccompleto.pages.dev'
    ];

    // Permite requisições sem origin (Postman, apps mobile, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate Limiting - Proteção contra ataques DDoS
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requisições
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ===========================================
// MIDDLEWARES GERAIS
// ===========================================

// Compressão de respostas
app.use(compression());

// Parser de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parser de Cookies
app.use(cookieParser());

// Upload de arquivos
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  abortOnLimit: true,
  responseOnLimit: 'Arquivo muito grande. Tamanho máximo: 10MB',
  uploadTimeout: 60000
}));

// Logger HTTP (Morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// ===========================================
// ROTAS DA API
// ===========================================

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Planac Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Rotas públicas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/pages', pageRoutes);

// Rotas protegidas (admin)
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// ===========================================
// TRATAMENTO DE ERROS
// ===========================================

// 404 - Rota não encontrada
app.use(notFound);

// Error handler global
app.use(errorHandler);

// ===========================================
// INICIAR SERVIDOR
// ===========================================

app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 URL: http://localhost:${PORT}`);
  logger.info(`✅ Health check: http://localhost:${PORT}/health`);

  if (process.env.NODE_ENV === 'development') {
    logger.info(`📚 API Docs: http://localhost:${PORT}/api`);
  }
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Desligando...');
  logger.error(err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Desligando...');
  logger.error(err);
  process.exit(1);
});

export default app;
