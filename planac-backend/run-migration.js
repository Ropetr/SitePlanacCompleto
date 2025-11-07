/**
 * Script para executar a migração de dados localmente
 */

import { migrateData } from './migrate-data.js';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simulando o objeto DB do Cloudflare D1 para SQLite local
function createDBWrapper(sqliteDb) {
  return {
    prepare: (sql) => {
      return {
        bind: (...params) => {
          return {
            run: async () => {
              try {
                const stmt = sqliteDb.prepare(sql);
                const result = stmt.run(...params);
                return { success: true, meta: { changes: result.changes } };
              } catch (error) {
                console.error('Erro SQL:', error.message);
                throw error;
              }
            },
            first: async () => {
              const stmt = sqliteDb.prepare(sql);
              return stmt.get(...params);
            },
            all: async () => {
              const stmt = sqliteDb.prepare(sql);
              return stmt.all(...params);
            }
          };
        }
      };
    }
  };
}

async function main() {
  try {
    console.log('📦 Conectando ao banco de dados local...\n');

    // Conectar ao banco SQLite local
    const dbPath = join(__dirname, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject', '8021a2b12013db39cb2b3a7ebd67202af4ba901c0cd5fb8db38fa142e4a78fa0.sqlite');
    const sqliteDb = new Database(dbPath);
    const db = createDBWrapper(sqliteDb);

    // Executar migração
    await migrateData(db);

    sqliteDb.close();
    console.log('\n🎉 Banco de dados atualizado com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao executar migração:', error);
    process.exit(1);
  }
}

main();
