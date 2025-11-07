/**
 * ===========================================
 * EMAIL HELPER - Envio via Hostinger SMTP
 * ===========================================
 */

/**
 * Envia e-mail usando Cloudflare Email Workers
 * Nota: Cloudflare Workers não suporta SMTP direto via socket
 * Alternativas:
 * 1. Usar Cloudflare Email Routing + MailChannels (gratuito)
 * 2. Usar API externa como SendGrid, Resend, Mailgun
 * 3. Usar Cloudflare Workers com fetch para API SMTP
 */

export async function sendEmail({ to, subject, html, text }) {
  // Para Cloudflare Workers, precisamos usar uma API externa ou Email Routing
  // Por enquanto, vamos retornar sucesso e logar
  console.log('[EMAIL] Enviando e-mail:', { to, subject });

  // TODO: Implementar com MailChannels (gratuito para Cloudflare Workers)
  // Exemplo: https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/

  try {
    // MailChannels API (gratuito para Cloudflare Workers)
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: {
          email: 'contato@planacdivisorias.com.br',
          name: 'Planac Distribuidora',
        },
        subject,
        content: [
          {
            type: 'text/plain',
            value: text || html.replace(/<[^>]*>/g, ''),
          },
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('[EMAIL] Erro ao enviar:', await response.text());
      return false;
    }

    console.log('[EMAIL] E-mail enviado com sucesso');
    return true;
  } catch (error) {
    console.error('[EMAIL] Erro:', error);
    return false;
  }
}

/**
 * Template de e-mail para novo orçamento
 */
export function createQuoteEmailTemplate(quote) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Orçamento</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #AA000E 0%, #96181c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🎉 Novo Orçamento Recebido!</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #AA000E; border-bottom: 2px solid #AA000E; padding-bottom: 10px;">Dados do Cliente</h2>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; font-weight: bold; width: 150px;">Nome:</td>
        <td style="padding: 10px;">${quote.nome}</td>
      </tr>
      <tr style="background: #fff;">
        <td style="padding: 10px; font-weight: bold;">E-mail:</td>
        <td style="padding: 10px;"><a href="mailto:${quote.email}" style="color: #AA000E;">${quote.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Telefone:</td>
        <td style="padding: 10px;"><a href="tel:${quote.telefone}" style="color: #AA000E;">${quote.telefone}</a></td>
      </tr>
      <tr style="background: #fff;">
        <td style="padding: 10px; font-weight: bold;">Cidade:</td>
        <td style="padding: 10px;">${quote.cidade || 'Não informada'}</td>
      </tr>
      ${quote.produto ? `
      <tr>
        <td style="padding: 10px; font-weight: bold;">Produto:</td>
        <td style="padding: 10px;">${quote.produto}</td>
      </tr>
      ` : ''}
      ${quote.tipoProjeto ? `
      <tr style="background: #fff;">
        <td style="padding: 10px; font-weight: bold;">Tipo de Projeto:</td>
        <td style="padding: 10px;">${quote.tipoProjeto}</td>
      </tr>
      ` : ''}
    </table>

    <h3 style="color: #AA000E; margin-top: 30px; border-bottom: 2px solid #AA000E; padding-bottom: 10px;">Mensagem</h3>
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #AA000E;">
      <p style="margin: 0; white-space: pre-wrap;">${quote.mensagem}</p>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
      <a href="https://main.planac-admin.pages.dev/quotes"
         style="display: inline-block; background: #AA000E; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        📊 Ver no Painel Admin
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
      Recebido em ${new Date().toLocaleString('pt-BR')}
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Template de e-mail para novo contato
 */
export function createContactEmailTemplate(contact) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Mensagem de Contato</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #AA000E 0%, #96181c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">💬 Nova Mensagem de Contato</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; font-weight: bold; width: 150px;">Nome:</td>
        <td style="padding: 10px;">${contact.nome}</td>
      </tr>
      <tr style="background: #fff;">
        <td style="padding: 10px; font-weight: bold;">E-mail:</td>
        <td style="padding: 10px;"><a href="mailto:${contact.email}" style="color: #AA000E;">${contact.email}</a></td>
      </tr>
      ${contact.telefone ? `
      <tr>
        <td style="padding: 10px; font-weight: bold;">Telefone:</td>
        <td style="padding: 10px;"><a href="tel:${contact.telefone}" style="color: #AA000E;">${contact.telefone}</a></td>
      </tr>
      ` : ''}
    </table>

    <h3 style="color: #AA000E; margin-top: 30px; border-bottom: 2px solid #AA000E; padding-bottom: 10px;">Mensagem</h3>
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #AA000E;">
      <p style="margin: 0; white-space: pre-wrap;">${contact.mensagem}</p>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
      <a href="https://main.planac-admin.pages.dev/contacts"
         style="display: inline-block; background: #AA000E; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        📊 Ver no Painel Admin
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
      Recebido em ${new Date().toLocaleString('pt-BR')}
    </p>
  </div>
</body>
</html>
  `;
}
