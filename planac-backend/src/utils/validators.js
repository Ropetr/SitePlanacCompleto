/**
 * ===========================================
 * VALIDATORS - Validação de dados com Zod
 * ===========================================
 */

import { z } from 'zod';

// ===========================================
// AUTH VALIDATORS
// ===========================================

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VENDEDOR']).optional(),
});

// ===========================================
// PRODUCT VALIDATORS
// ===========================================

export const productSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  subtitulo: z.string().optional(),
  descricaoCurta: z.string().optional(),
  descricaoCompleta: z.string().optional(),
  caracteristicas: z.array(z.string()).optional(),
  vantagens: z.array(z.string()).optional(),
  aplicacoes: z.array(z.string()).optional(),
  especificacoes: z.record(z.any()).optional(),
  normasCertificacoes: z.array(z.string()).optional(),
  imagemBanner: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  galeriaImagens: z.array(z.string().url()).optional(),
  videoUrl: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  ordem: z.number().int().optional(),
  destaque: z.boolean().optional(),
  status: z.enum(['RASCUNHO', 'PUBLICADO', 'ARQUIVADO']).optional(),
  menuId: z.string().uuid('ID do menu inválido'),
});

// ===========================================
// MENU VALIDATORS
// ===========================================

export const menuSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  icone: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  menuPaiId: z.string().uuid().optional().nullable(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

// ===========================================
// QUOTE VALIDATORS
// ===========================================

export const quoteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  cidade: z.string().optional(),
  produto: z.string().optional(),
  tipoProjeto: z.enum(['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'OUTRO']).optional(),
  mensagem: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
  origem: z.string().url().optional(),
});

// ===========================================
// CONTACT VALIDATORS
// ===========================================

export const contactSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().optional(),
  mensagem: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
});

// ===========================================
// SETTING VALIDATORS
// ===========================================

export const settingSchema = z.object({
  chave: z.string().min(2, 'Chave deve ter no mínimo 2 caracteres'),
  valor: z.string().optional(),
  tipo: z.enum(['string', 'number', 'boolean', 'json', 'image']),
  descricao: z.string().optional(),
  grupo: z.string().optional(),
});

// ===========================================
// PAGE VALIDATORS
// ===========================================

export const pageSchema = z.object({
  tipo: z.enum(['HOME', 'SOBRE', 'CONTATO', 'CUSTOM']),
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  conteudo: z.string().optional(),
  bannerImagem: z.string().url().optional(),
  bannerTitulo: z.string().optional(),
  bannerSubtitulo: z.string().optional(),
  sections: z.array(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  ativo: z.boolean().optional(),
});

// ===========================================
// HELPER: Validate data
// ===========================================

export function validate(schema, data) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };
  }
}
