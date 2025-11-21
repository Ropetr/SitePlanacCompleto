-- ============================================
-- MIGRATION: Add Responsive Image Fields
-- ============================================
-- Adiciona campos para URLs desktop/mobile e dimensões originais
-- Execute: wrangler d1 execute planac-database --file=./migration-add-responsive-images.sql

-- Adicionar colunas para URLs responsivas
ALTER TABLE media ADD COLUMN desktop_url TEXT;
ALTER TABLE media ADD COLUMN mobile_url TEXT;

-- Adicionar colunas para dimensões originais
ALTER TABLE media ADD COLUMN width_original INTEGER;
ALTER TABLE media ADD COLUMN height_original INTEGER;

-- Atualizar registros existentes (copiar URL principal para desktop_url)
UPDATE media SET desktop_url = url WHERE desktop_url IS NULL;

-- Verificar alterações
SELECT
    id,
    nome_arquivo,
    url,
    desktop_url,
    mobile_url,
    width_original,
    height_original
FROM media
LIMIT 5;
