/**
 * ===========================================
 * INTEGRAÇÃO DE FORMULÁRIOS COM A API
 * ===========================================
 * Este script integra os formulários do site
 * com a API do backend Planac
 * ===========================================
 */

const API_URL = 'https://planac-backend-api.planacacabamentos.workers.dev';

// ===========================================
// FUNÇÕES AUXILIARES
// ===========================================

/**
 * Exibe notificação de sucesso
 */
function showSuccess(message) {
  alert(`✅ ${message}`);
}

/**
 * Exibe notificação de erro
 */
function showError(message) {
  alert(`❌ ${message}`);
}

/**
 * Valida email
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida telefone brasileiro
 */
function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

// ===========================================
// FORMULÁRIO DE ORÇAMENTO
// ===========================================

/**
 * Envia orçamento para a API
 */
async function enviarOrcamento(formData) {
  try {
    // Validações
    if (!formData.nome || formData.nome.trim().length < 3) {
      showError('Por favor, informe seu nome completo.');
      return false;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      showError('Por favor, informe um e-mail válido.');
      return false;
    }

    if (!formData.telefone || !isValidPhone(formData.telefone)) {
      showError('Por favor, informe um telefone válido.');
      return false;
    }

    if (!formData.cidade || formData.cidade.trim().length < 3) {
      showError('Por favor, informe sua cidade.');
      return false;
    }

    if (!formData.mensagem || formData.mensagem.trim().length < 10) {
      showError('Por favor, descreva os detalhes do seu projeto (mínimo 10 caracteres).');
      return false;
    }

    // Preparar dados para a API
    const payload = {
      nome: formData.nome.trim(),
      email: formData.email.trim().toLowerCase(),
      telefone: formData.telefone.replace(/\D/g, ''),
      cidade: formData.cidade.trim(),
      produto: formData.produto || null,
      tipoProjeto: formData.tipo || formData.tipoProjeto || null,
      mensagem: formData.mensagem.trim(),
      origem: window.location.href
    };

    console.log('Enviando orçamento:', payload);

    // Enviar para a API
    const response = await fetch(`${API_URL}/api/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao enviar orçamento');
    }

    console.log('Orçamento enviado com sucesso:', data);
    showSuccess(data.message || 'Orçamento enviado com sucesso! Entraremos em contato em breve.');

    return data.data.id;

  } catch (error) {
    console.error('Erro ao enviar orçamento:', error);
    showError(error.message || 'Erro ao enviar orçamento. Tente novamente.');
    return false;
  }
}

/**
 * Handler para formulário de orçamento
 * Esta função substitui a antiga handleQuote()
 */
async function handleQuote(event) {
  event.preventDefault();

  const form = event.target;

  const formData = {
    nome: form.querySelector('#nome')?.value || form.querySelector('[name="nome"]')?.value,
    email: form.querySelector('#email')?.value || form.querySelector('[name="email"]')?.value,
    telefone: form.querySelector('#telefone')?.value || form.querySelector('[name="telefone"]')?.value,
    cidade: form.querySelector('#cidade')?.value || form.querySelector('[name="cidade"]')?.value,
    tipo: form.querySelector('#tipo')?.value || form.querySelector('[name="tipo"]')?.value,
    produto: form.querySelector('#produto')?.value || form.querySelector('[name="produto"]')?.value,
    mensagem: form.querySelector('#mensagem')?.value || form.querySelector('[name="mensagem"]')?.value,
    tipoProjeto: form.querySelector('#tipoProjeto')?.value || form.querySelector('[name="tipoProjeto"]')?.value
  };

  const quoteId = await enviarOrcamento(formData);

  if (quoteId) {
    // Limpar formulário
    form.reset();

    // Opcional: enviar também via WhatsApp
    const whatsappEnabled = form.dataset.whatsapp !== 'false';
    if (whatsappEnabled) {
      const productName = document.querySelector('h1')?.textContent || 'Produto';
      const whatsappMsg = `*Orçamento - ${productName}*\n\n` +
        `*Nome:* ${formData.nome}\n` +
        `*E-mail:* ${formData.email}\n` +
        `*Telefone:* ${formData.telefone}\n` +
        `*Cidade:* ${formData.cidade}\n` +
        `*Tipo:* ${formData.tipo || 'Não especificado'}\n\n` +
        `*Detalhes:*\n${formData.mensagem}\n\n` +
        `_Orçamento ID: ${quoteId}_`;

      const whatsappURL = `https://api.whatsapp.com/send/?phone=5543984182582&text=${encodeURIComponent(whatsappMsg)}`;

      setTimeout(() => {
        window.open(whatsappURL, '_blank');
      }, 1000);
    }
  }
}

// ===========================================
// FORMULÁRIO DE CONTATO
// ===========================================

/**
 * Envia contato para a API
 */
async function enviarContato(formData) {
  try {
    // Validações
    if (!formData.nome || formData.nome.trim().length < 3) {
      showError('Por favor, informe seu nome completo.');
      return false;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      showError('Por favor, informe um e-mail válido.');
      return false;
    }

    if (!formData.mensagem || formData.mensagem.trim().length < 10) {
      showError('Por favor, escreva uma mensagem (mínimo 10 caracteres).');
      return false;
    }

    // Preparar dados para a API
    const payload = {
      nome: formData.nome.trim(),
      email: formData.email.trim().toLowerCase(),
      telefone: formData.telefone ? formData.telefone.replace(/\D/g, '') : null,
      assunto: formData.assunto?.trim() || null,
      tipo: formData.tipo || null,
      mensagem: formData.mensagem.trim()
    };

    console.log('Enviando contato:', payload);

    // Enviar para a API
    const response = await fetch(`${API_URL}/api/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao enviar mensagem');
    }

    console.log('Contato enviado com sucesso:', data);
    showSuccess(data.message || 'Mensagem enviada com sucesso! Responderemos em breve.');

    return data.data.id;

  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    showError(error.message || 'Erro ao enviar mensagem. Tente novamente.');
    return false;
  }
}

/**
 * Handler para formulário de contato
 */
async function handleContact(event) {
  event.preventDefault();

  const form = event.target;

  const formData = {
    nome: form.querySelector('#nome')?.value || form.querySelector('[name="nome"]')?.value,
    email: form.querySelector('#email')?.value || form.querySelector('[name="email"]')?.value,
    telefone: form.querySelector('#telefone')?.value || form.querySelector('[name="telefone"]')?.value,
    assunto: form.querySelector('#assunto')?.value || form.querySelector('[name="assunto"]')?.value,
    tipo: form.querySelector('#tipo')?.value || form.querySelector('[name="tipo"]')?.value,
    mensagem: form.querySelector('#mensagem')?.value || form.querySelector('[name="mensagem"]')?.value
  };

  const contactId = await enviarContato(formData);

  if (contactId) {
    // Limpar formulário
    form.reset();
  }
}

// ===========================================
// MÁSCARA DE TELEFONE
// ===========================================

/**
 * Aplica máscara de telefone em inputs
 */
function setupPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="telefone"], input#telefone');

  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else {
        value = value.replace(/^(\d*)/, '($1');
      }

      e.target.value = value;
    });
  });
}

// ===========================================
// INICIALIZAÇÃO
// ===========================================

/**
 * Inicializa os handlers de formulários quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Integrando formulários com a API Planac...');

  // Aplicar máscara de telefone
  setupPhoneMask();

  // Detectar e configurar formulários de orçamento
  const quoteForm = document.querySelector('form[onsubmit*="handleQuote"]') ||
                    document.querySelector('.quote-form-container form') ||
                    document.querySelector('#quote-form');

  if (quoteForm) {
    // Remover onsubmit inline se existir
    quoteForm.removeAttribute('onsubmit');

    // Adicionar novo handler
    quoteForm.addEventListener('submit', handleQuote);
    console.log('✅ Formulário de orçamento configurado');
  }

  // Detectar e configurar formulários de contato
  const contactForm = document.querySelector('form[onsubmit*="handleContact"]') ||
                      document.querySelector('.contact-form-container form') ||
                      document.querySelector('#contact-form');

  if (contactForm) {
    // Remover onsubmit inline se existir
    contactForm.removeAttribute('onsubmit');

    // Adicionar novo handler
    contactForm.addEventListener('submit', handleContact);
    console.log('✅ Formulário de contato configurado');
  }

  console.log('Formulários integrados com a API!');
});

// Exportar funções globalmente para compatibilidade com código existente
window.handleQuote = handleQuote;
window.handleContact = handleContact;
window.enviarOrcamento = enviarOrcamento;
window.enviarContato = enviarContato;
