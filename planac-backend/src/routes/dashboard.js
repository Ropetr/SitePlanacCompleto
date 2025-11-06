/**
 * ===========================================
 * DASHBOARD ROUTES - Estatísticas Admin
 * ===========================================
 */

import { Hono } from 'hono';

const dashboard = new Hono();

// ===========================================
// GET /api/admin/dashboard - Estatísticas gerais (ADMIN)
// ===========================================
dashboard.get('/', async (c) => {
  try {
    // Contar produtos
    const { total: produtosTotal } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM products'
    ).first();

    const { total: produtosPublicados } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM products WHERE status = ?'
    ).bind('PUBLICADO').first();

    // Contar categorias
    const { total: categoriasTotal } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM categories WHERE ativo = 1'
    ).first();

    // Orçamentos
    const { total: orcamentosTotal } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM quotes'
    ).first();

    const { total: orcamentosNovos } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM quotes WHERE status = ?'
    ).bind('NOVO').first();

    const { total: orcamentosAtendimento } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM quotes WHERE status = ?'
    ).bind('EM_ATENDIMENTO').first();

    const { total: orcamentosAtendidos } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM quotes WHERE status = ?'
    ).bind('ATENDIDO').first();

    // Contatos
    const { total: contatosTotal } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM contacts'
    ).first();

    const { total: contatosNaoLidos } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM contacts WHERE lido = 0'
    ).first();

    // Orçamentos recentes (últimos 7 dias)
    const { results: orcamentosRecentes } = await c.env.DB.prepare(`
      SELECT DATE(created_at) as data, COUNT(*) as total
      FROM quotes
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY data DESC
    `).all();

    // Produtos mais visualizados (simular - você pode adicionar tracking depois)
    const { results: produtosPopulares } = await c.env.DB.prepare(`
      SELECT id, nome, slug, imagem_banner, destaque
      FROM products
      WHERE status = 'PUBLICADO'
      ORDER BY destaque DESC, ordem ASC
      LIMIT 5
    `).all();

    // Últimos orçamentos
    const { results: ultimosOrcamentos } = await c.env.DB.prepare(`
      SELECT id, nome, email, telefone, produto, status, created_at
      FROM quotes
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    return c.json({
      success: true,
      data: {
        resumo: {
          produtos: {
            total: produtosTotal,
            publicados: produtosPublicados,
            rascunhos: produtosTotal - produtosPublicados,
          },
          categorias: {
            total: categoriasTotal,
          },
          orcamentos: {
            total: orcamentosTotal,
            novos: orcamentosNovos,
            emAtendimento: orcamentosAtendimento,
            atendidos: orcamentosAtendidos,
          },
          contatos: {
            total: contatosTotal,
            naoLidos: contatosNaoLidos,
          },
        },
        graficos: {
          orcamentosPorDia: orcamentosRecentes,
        },
        listas: {
          produtosPopulares,
          ultimosOrcamentos,
        },
      },
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    return c.json({ error: 'Erro ao carregar dashboard' }, 500);
  }
});

// ===========================================
// GET /api/admin/dashboard/stats - Estatísticas detalhadas (ADMIN)
// ===========================================
dashboard.get('/stats', async (c) => {
  try {
    const { periodo = '30' } = c.req.query(); // dias

    // Orçamentos por período
    const { results: orcamentosPorPeriodo } = await c.env.DB.prepare(`
      SELECT
        DATE(created_at) as data,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ATENDIDO' THEN 1 ELSE 0 END) as atendidos,
        SUM(CASE WHEN status = 'PERDIDO' THEN 1 ELSE 0 END) as perdidos
      FROM quotes
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY DATE(created_at)
      ORDER BY data ASC
    `).bind(periodo).all();

    // Taxa de conversão
    const { total: totalOrcamentos } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM quotes WHERE created_at >= datetime(\'now\', \'-\' || ? || \' days\')'
    ).bind(periodo).first();

    const { total: totalAtendidos } = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM quotes WHERE status = ? AND created_at >= datetime(\'now\', \'-\' || ? || \' days\')'
    ).bind('ATENDIDO', periodo).first();

    const taxaConversao = totalOrcamentos > 0 ? (totalAtendidos / totalOrcamentos * 100).toFixed(2) : 0;

    // Produtos mais solicitados
    const { results: produtosMaisSolicitados } = await c.env.DB.prepare(`
      SELECT produto, COUNT(*) as total
      FROM quotes
      WHERE produto IS NOT NULL AND created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY produto
      ORDER BY total DESC
      LIMIT 10
    `).bind(periodo).all();

    // Origem dos leads (UTM Source)
    const { results: origemLeads } = await c.env.DB.prepare(`
      SELECT
        COALESCE(utm_source, 'Direto') as origem,
        COUNT(*) as total
      FROM quotes
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY utm_source
      ORDER BY total DESC
    `).bind(periodo).all();

    return c.json({
      success: true,
      data: {
        periodo: `Últimos ${periodo} dias`,
        orcamentosPorDia: orcamentosPorPeriodo,
        taxaConversao: `${taxaConversao}%`,
        totalOrcamentos,
        totalAtendidos,
        produtosMaisSolicitados,
        origemLeads,
      },
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return c.json({ error: 'Erro ao carregar estatísticas' }, 500);
  }
});

export default dashboard;
