-- ===========================================
-- MIGRATION: Renomear tabela products para pages
-- Data: 2025-01-12
-- Motivo: Liberar 'products' para catálogo real de produtos vendáveis
-- ===========================================

-- 1. Deletar tabela pages vazia (já existe)
DROP TABLE IF EXISTS pages;

-- 2. Renomear tabela products para pages
ALTER TABLE products RENAME TO pages;

-- 3. Atualizar audit_logs para apontar para 'Page' ao invés de 'Product'
UPDATE audit_logs SET entidade = 'Page' WHERE entidade = 'Product';

-- 4. Verificação
SELECT COUNT(*) as total_pages FROM pages;
SELECT COUNT(*) as total_audit_logs_pages FROM audit_logs WHERE entidade = 'Page';
