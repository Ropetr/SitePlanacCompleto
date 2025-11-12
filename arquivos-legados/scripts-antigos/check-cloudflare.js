/**
 * Script para verificar configurações do Cloudflare
 * Pages Projects e Workers
 */

const https = require('https');
const { execSync } = require('child_process');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
    return output;
  } catch (error) {
    if (!silent) {
      console.error(`Erro ao executar: ${command}`);
      console.error(error.message);
    }
    return null;
  }
}

async function main() {
  log('\n🔍 VERIFICANDO CONFIGURAÇÕES DO CLOUDFLARE\n', 'bright');

  // 1. Verificar conta
  log('📋 Informações da Conta:', 'cyan');
  execCommand('wrangler whoami');

  // 2. Listar Workers
  log('\n⚡ Workers Implantados:', 'cyan');
  const workersOutput = execCommand('wrangler deployments list --name planac-backend-api', true);
  if (workersOutput) {
    console.log(workersOutput);
  } else {
    log('❌ Nenhum worker encontrado ou erro ao listar', 'red');
  }

  // 3. Listar Pages Projects
  log('\n📄 Projetos Cloudflare Pages:', 'cyan');
  execCommand('wrangler pages project list');

  // 4. Verificar D1 Databases
  log('\n💾 Bancos de Dados D1:', 'cyan');
  execCommand('wrangler d1 list');

  // 5. Verificar KV Namespaces
  log('\n🗄️  KV Namespaces:', 'cyan');
  execCommand('wrangler kv namespace list');

  // 6. Verificar R2 Buckets
  log('\n📦 R2 Buckets:', 'cyan');
  execCommand('wrangler r2 bucket list');

  // 7. Verificar configuração do wrangler.toml
  log('\n⚙️  Configuração do Backend (wrangler.toml):', 'cyan');
  const fs = require('fs');
  const path = require('path');
  const wranglerPath = path.join(__dirname, 'planac-backend', 'wrangler.toml');

  if (fs.existsSync(wranglerPath)) {
    const wranglerConfig = fs.readFileSync(wranglerPath, 'utf-8');
    log(wranglerConfig, 'blue');
  } else {
    log('❌ wrangler.toml não encontrado', 'red');
  }

  // 8. Testar endpoints
  log('\n🌐 Testando Endpoints:', 'cyan');

  const endpoints = [
    {
      name: 'Backend API Health',
      url: 'https://planac-backend-api.planacacabamentos.workers.dev/health'
    },
    {
      name: 'Admin Panel',
      url: 'https://main.planac-admin.pages.dev'
    },
    {
      name: 'Site Principal',
      url: 'https://siteplanaccompleto.pages.dev'
    }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      const status = response.status;
      const statusColor = status === 200 ? 'green' : 'yellow';
      log(`  ${endpoint.name}: ${status} ${response.statusText}`, statusColor);
    } catch (error) {
      log(`  ${endpoint.name}: ❌ Erro - ${error.message}`, 'red');
    }
  }

  // 9. Verificar integração Git
  log('\n🔗 Integração Git:', 'cyan');
  const gitRemote = execCommand('git remote -v', true);
  if (gitRemote) {
    console.log(gitRemote);
  }

  log('\n✅ Verificação completa!\n', 'green');
  log('📚 Próximos passos:', 'yellow');
  log('  1. Acesse o Cloudflare Dashboard: https://dash.cloudflare.com', 'yellow');
  log('  2. Verifique Workers & Pages', 'yellow');
  log('  3. Configure integração Git se necessário', 'yellow');
}

// Executar
main().catch(error => {
  console.error('Erro:', error);
  process.exit(1);
});
