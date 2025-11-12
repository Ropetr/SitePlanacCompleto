// Lista todos os produtos do banco
const https = require('https');

https.get('https://planac-backend-api.planacacabamentos.workers.dev/api/products?limit=100', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const products = json.data || [];

      console.log('\n📄 PRODUTOS PUBLICADOS NO BANCO:\n');
      console.log('STATUS     | SLUG                                | MENU                      | NOME');
      console.log('─'.repeat(120));

      products
        .sort((a, b) => (a.menu_nome || '').localeCompare(b.menu_nome || ''))
        .forEach(p => {
          const status = (p.status || '').padEnd(10);
          const slug = (p.slug || '').padEnd(35);
          const menu = (p.menu_nome || 'Sem menu').padEnd(25);
          const nome = p.nome || '';
          console.log(`${status} | ${slug} | ${menu} | ${nome}`);
        });

      console.log(`\n✅ Total: ${products.length} produtos\n`);
    } catch (e) {
      console.error('Erro:', e.message);
      console.log('Data:', data);
    }
  });
}).on('error', err => console.error('Erro:', err.message));
