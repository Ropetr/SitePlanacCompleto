-- Dados iniciais

-- Usuário admin padrão (senha: Admin@123)
INSERT OR IGNORE INTO users (id, nome, email, senha, role, ativo)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Administrador',
    'admin@planacdivisorias.com.br',
    'JWH8S/aCGdzD7H1z3vFbBqkqGjCiHa2h/d5/A/kbloc=',
    'SUPER_ADMIN',
    1
);

-- Configurações padrão do site
INSERT OR IGNORE INTO settings (id, chave, valor, tipo, descricao, grupo, ordem) VALUES
('set_001', 'site_nome', 'Planac Distribuidora', 'string', 'Nome do site', 'geral', 1),
('set_002', 'site_descricao', 'Especialista em divisórias e soluções arquitetônicas', 'string', 'Descrição do site', 'geral', 2),
('set_003', 'contato_telefone', '(47) 3025-2222', 'string', 'Telefone principal', 'contato', 3),
('set_004', 'contato_whatsapp', '5547988887777', 'string', 'WhatsApp para contato', 'contato', 4),
('set_005', 'contato_email', 'contato@planacdivisorias.com.br', 'string', 'E-mail de contato', 'contato', 5),
('set_006', 'endereco_completo', 'Rua Exemplo, 123 - Blumenau/SC', 'string', 'Endereço completo', 'contato', 6),
('set_007', 'redes_sociais', '{"facebook":"","instagram":"","linkedin":""}', 'json', 'Links das redes sociais', 'social', 7),
('set_008', 'manutencao_ativa', 'false', 'boolean', 'Modo de manutenção', 'sistema', 8);
