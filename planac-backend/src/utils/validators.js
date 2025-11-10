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
  descricao_curta: z.string().optional(), // snake_case alias
  descricaoCompleta: z.string().optional(),
  descricao_completa: z.string().optional(), // snake_case alias
  caracteristicas: z.union([z.array(z.string()), z.string()]).optional(),
  vantagens: z.union([z.array(z.string()), z.string()]).optional(),
  aplicacoes: z.union([z.array(z.string()), z.string()]).optional(),
  especificacoes: z.union([z.record(z.any()), z.string()]).optional(),
  normasCertificacoes: z.union([z.array(z.string()), z.string()]).optional(),
  normas_certificacoes: z.union([z.array(z.string()), z.string()]).optional(), // snake_case alias
  imagemBanner: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  imagem_banner: z.union([z.string().url(), z.literal('')]).optional().nullable(), // snake_case alias
  galeriaImagens: z.array(z.string()).optional(),
  galeria_imagens: z.array(z.string()).optional(), // snake_case alias
  videoUrl: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  video_url: z.union([z.string().url(), z.literal('')]).optional().nullable(), // snake_case alias
  metaTitle: z.string().optional(),
  meta_title: z.string().optional(), // snake_case alias
  metaDescription: z.string().optional(),
  meta_description: z.string().optional(), // snake_case alias
  metaKeywords: z.union([z.array(z.string()), z.string()]).optional(),
  meta_keywords: z.union([z.array(z.string()), z.string()]).optional(), // snake_case alias
  ordem: z.union([z.number().int(), z.string().transform(v => parseInt(v))]).optional(),
  destaque: z.union([z.boolean(), z.number().transform(v => v === 1)]).optional(),
  status: z.enum(['RASCUNHO', 'PUBLICADO', 'ARQUIVADO']).optional(),
  menuId: z.string().optional(),
  menu_id: z.string().optional(), // snake_case alias
});

// ===========================================
// MENU VALIDATORS
// ===========================================

export const menuSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  icone: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  menuPaiId: z.string().optional().nullable(),
  menu_pai_id: z.string().optional().nullable(), // snake_case alias
  ordem: z.union([z.number().int(), z.string().transform(v => parseInt(v))]).optional(),
  ativo: z.union([z.boolean(), z.number().transform(v => v === 1)]).optional(),
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
