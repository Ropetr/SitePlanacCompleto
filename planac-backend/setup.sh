#!/bin/bash

# ===========================================
# SETUP AUTOMÁTICO - Planac Backend
# ===========================================
# Este script configura tudo automaticamente!
# ===========================================

echo "🚀 Iniciando setup do Planac Backend..."
echo ""

# Verificar se wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler não encontrado!"
    echo "📦 Instalando Wrangler..."
    npm install -g wrangler
fi

echo "✅ Wrangler instalado!"
echo ""

# Login no Cloudflare
echo "🔐 Fazendo login no Cloudflare..."
wrangler login

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "🗄️  Criando banco de dados D1..."
DB_OUTPUT=$(wrangler d1 create planac-database 2>&1)
DB_ID=$(echo "$DB_OUTPUT" | grep "database_id" | awk '{print $3}' | tr -d '"')

echo "✅ Banco criado! ID: $DB_ID"
echo "📝 Atualizando wrangler.toml..."

# Atualizar wrangler.toml com o DB ID
sed -i "s/database_id = \"SEU_DATABASE_ID_AQUI\"/database_id = \"$DB_ID\"/" wrangler.toml

echo ""
echo "🗂️  Criando KV Namespaces..."

# KV Cache
KV_CACHE_OUTPUT=$(wrangler kv:namespace create "KV_CACHE" 2>&1)
KV_CACHE_ID=$(echo "$KV_CACHE_OUTPUT" | grep "id = " | awk '{print $3}' | tr -d '"')

# KV Sessions
KV_SESSIONS_OUTPUT=$(wrangler kv:namespace create "KV_SESSIONS" 2>&1)
KV_SESSIONS_ID=$(echo "$KV_SESSIONS_OUTPUT" | grep "id = " | awk '{print $3}' | tr -d '"')

echo "✅ KV Namespaces criados!"
echo "📝 Atualizando wrangler.toml..."

# Atualizar IDs dos KV no wrangler.toml
sed -i "s/id = \"SEU_KV_ID_AQUI\"/id = \"$KV_CACHE_ID\"/" wrangler.toml
sed -i "s/id = \"SEU_KV_SESSIONS_ID_AQUI\"/id = \"$KV_SESSIONS_ID\"/" wrangler.toml

echo ""
echo "🪣  Criando bucket R2..."
wrangler r2 bucket create planac-images

echo "✅ Bucket R2 criado!"
echo ""

echo "🔑 Configurando secrets..."
echo ""
echo "Digite uma chave secreta forte para JWT (mínimo 32 caracteres):"
echo "Sugestão: $(openssl rand -hex 32)"
wrangler secret put JWT_SECRET

echo ""
echo "Digite uma chave secreta forte para JWT Refresh:"
echo "Sugestão: $(openssl rand -hex 32)"
wrangler secret put JWT_REFRESH_SECRET

echo ""
echo "📊 Criando tabelas no banco de dados..."
wrangler d1 execute planac-database --file=./schema.sql

echo "✅ Banco de dados configurado!"
echo ""

echo "========================================="
echo "✅ SETUP CONCLUÍDO COM SUCESSO!"
echo "========================================="
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1️⃣  Para rodar localmente:"
echo "   npm run dev"
echo ""
echo "2️⃣  Para fazer deploy em produção:"
echo "   npm run deploy"
echo ""
echo "3️⃣  Para acessar o painel D1:"
echo "   wrangler d1 execute planac-database --command='SELECT * FROM users'"
echo ""
echo "4️⃣  Login padrão:"
echo "   E-mail: admin@planacdivisorias.com.br"
echo "   Senha: (será definida no primeiro acesso)"
echo ""
echo "🎉 Seu backend está pronto para usar!"
echo "========================================="
