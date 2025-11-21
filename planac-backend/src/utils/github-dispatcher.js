/**
 * ===========================================
 * GITHUB DISPATCHER - Dispara GitHub Actions
 * ===========================================
 * Envia webhook para GitHub para executar rebuild
 */

/**
 * Dispara rebuild de página via GitHub Actions
 */
export async function dispatchPageRebuild(slug, githubToken) {
  try {
    const owner = 'Ropetr'; // Seu usuário GitHub
    const repo = 'SitePlanacCompleto';

    const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

    console.log(`🚀 Disparando GitHub Action para rebuild: ${slug}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'rebuild-page',
        client_payload: {
          slug: slug,
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    console.log(`✅ GitHub Action disparada com sucesso para: ${slug}`);

    return {
      success: true,
      message: `Rebuild iniciado para ${slug}. GitHub Actions processará em instantes.`
    };

  } catch (error) {
    console.error('❌ Erro ao disparar GitHub Action:', error);
    throw error;
  }
}

/**
 * Dispara múltiplos rebuilds em paralelo
 */
export async function dispatchMultipleRebuilds(slugs, githubToken) {
  const results = await Promise.allSettled(
    slugs.map(slug => dispatchPageRebuild(slug, githubToken))
  );

  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return {
    total: slugs.length,
    succeeded,
    failed,
    results
  };
}
