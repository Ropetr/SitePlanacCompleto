/**
 * Script para adicionar configurações faltantes no banco D1
 * Execute: node add-missing-settings.js
 */

const settingsToAdd = [
  {
    id: 'set-009',
    chave: 'logo_url',
    valor: 'Logo.svg',
    tipo: 'string',
    descricao: 'URL do logo do site',
    grupo: 'geral'
  },
  {
    id: 'set-010',
    chave: 'facebook_url',
    valor: '',
    tipo: 'string',
    descricao: 'Link do Facebook',
    grupo: 'contato'
  },
  {
    id: 'set-011',
    chave: 'horario_funcionamento',
    valor: 'Segunda a Sexta: 8h às 17h\nSábado: 8h às 12h',
    tipo: 'string',
    descricao: 'Horário de funcionamento',
    grupo: 'geral'
  },
  {
    id: 'set-012',
    chave: 'texto_rodape',
    valor: '© 2025 Planac Distribuidora. Todos os direitos reservados.',
    tipo: 'string',
    descricao: 'Texto do rodapé (copyright)',
    grupo: 'geral'
  }
];

console.log('📝 Configurações a serem adicionadas:');
console.log('=====================================\n');

settingsToAdd.forEach(setting => {
  console.log(`INSERT INTO settings (id, chave, valor, tipo, descricao, grupo, created_at, updated_at)`);
  console.log(`VALUES ('${setting.id}', '${setting.chave}', '${setting.valor}', '${setting.tipo}', '${setting.descricao}', '${setting.grupo}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`);
  console.log('');
});

console.log('\n🔧 Execute cada comando acima no Wrangler:');
console.log('npx wrangler d1 execute planac-database --command="INSERT INTO..."');
console.log('\nOu execute todos de uma vez com o comando abaixo:\n');

const allCommands = settingsToAdd.map(s =>
  `INSERT OR IGNORE INTO settings (id, chave, valor, tipo, descricao, grupo, created_at, updated_at) VALUES ('${s.id}', '${s.chave}', '${s.valor}', '${s.tipo}', '${s.descricao}', '${s.grupo}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
).join(' ');

console.log(`npx wrangler d1 execute planac-database --command="${allCommands}"`);
