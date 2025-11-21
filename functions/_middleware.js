/**
 * Cloudflare Pages Middleware
 * Redireciona requisições .html não encontradas para o Worker backend
 */

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Se for uma requisição .html
  if (url.pathname.endsWith('.html')) {
    try {
      // Tenta servir o arquivo estático primeiro
      const response = await next();

      // Se arquivo existe (200), retorna normalmente
      if (response.status === 200) {
        return response;
      }

      // Se não existe (404), tenta buscar do Worker backend
      if (response.status === 404) {
        const workerURL = `https://planac-backend-api.planacacabamentos.workers.dev${url.pathname}`;

        console.log(`📄 Arquivo estático não encontrado, buscando do Worker: ${url.pathname}`);

        const workerResponse = await fetch(workerURL, {
          headers: request.headers,
        });

        // Se Worker encontrou a página, retorna
        if (workerResponse.ok) {
          return new Response(workerResponse.body, {
            status: workerResponse.status,
            headers: {
              ...Object.fromEntries(workerResponse.headers),
              'X-Served-By': 'Worker-Dynamic',
            },
          });
        }
      }

      // Se nada funcionou, retorna o 404 original
      return response;

    } catch (error) {
      console.error('Erro no middleware:', error);
      return next();
    }
  }

  // Para outras requisições, passa normalmente
  return next();
}
