import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

// Instância única do Prisma Client (Singleton)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Middleware para logging de queries lentas (> 1s)
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  const duration = after - before;

  if (duration > 1000) {
    logger.warn(`Query lenta detectada: ${params.model}.${params.action} levou ${duration}ms`);
  }

  return result;
});

// Conectar ao banco de dados
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Conectado ao banco de dados PostgreSQL');
  } catch (error) {
    logger.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

// Desconectar do banco de dados
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('🔌 Desconectado do banco de dados');
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default prisma;
