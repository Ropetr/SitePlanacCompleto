/**
 * Motor de Renderização de Templates Handlebars
 * Suporta variáveis {{var}}, condicionais {{#if}} e loops {{#each}}
 */

export class TemplateEngine {
  /**
   * Renderiza um template com os dados fornecidos
   * @param {string} template - Template com placeholders Handlebars
   * @param {object} data - Dados para substituir no template
   * @returns {string} - HTML renderizado
   */
  static render(template, data) {
    let html = template;

    // 1. Processar loops {{#each array}}...{{/each}}
    html = this.processEach(html, data);

    // 2. Processar condicionais {{#if condition}}...{{/if}}
    html = this.processIf(html, data);

    // 3. Processar variáveis simples {{variable}}
    html = this.processVariables(html, data);

    return html;
  }

  /**
   * Processa loops {{#each}}...{{/each}}
   */
  static processEach(template, data) {
    const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return template.replace(eachRegex, (match, arrayName, content) => {
      const array = data[arrayName];

      if (!array || !Array.isArray(array) || array.length === 0) {
        return '';
      }

      return array.map(item => {
        // Se o item for string, substitui {{this}}
        if (typeof item === 'string') {
          return content.replace(/\{\{this\}\}/g, item);
        }

        // Se for objeto, substitui todas as propriedades
        let itemHtml = content;
        Object.keys(item).forEach(key => {
          const value = item[key] || '';
          itemHtml = itemHtml.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        });

        return itemHtml;
      }).join('');
    });
  }

  /**
   * Processa condicionais {{#if}}...{{/if}}
   */
  static processIf(template, data) {
    const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return template.replace(ifRegex, (match, condition, content) => {
      const value = data[condition];

      // Verifica se a condição é verdadeira
      const isTrue = value &&
        (Array.isArray(value) ? value.length > 0 : true) &&
        value !== 'false' &&
        value !== '0';

      return isTrue ? content : '';
    });
  }

  /**
   * Processa variáveis simples {{variable}}
   */
  static processVariables(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      const value = data[variable];

      if (value === undefined || value === null) {
        return '';
      }

      // Se for array ou objeto, converte para JSON (não deveria acontecer)
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return String(value);
    });
  }

  /**
   * Carrega template de arquivo
   * @param {string} templateName - Nome do template (sem extensão)
   * @returns {string} - Conteúdo do template
   */
  static async loadTemplate(templateName) {
    // Templates agora são importados de templates.js
    // Não precisamos mais carregar de arquivos HTML
    throw new Error(`Use import direto de templates.js ao invés de loadTemplate()`);
  }

  /**
   * Prepara dados de produto para renderização
   * @param {object} product - Dados do produto do banco
   * @returns {object} - Dados formatados para o template
   */
  static prepareProductData(product) {
    // Processar campos JSON
    const parseField = (field) => {
      if (!field) return [];

      // Se já for array
      if (Array.isArray(field)) return field;

      // Se for string JSON
      if (typeof field === 'string') {
        try {
          // Tenta parsear como JSON
          if (field.startsWith('[') || field.startsWith('{')) {
            return JSON.parse(field);
          }
          // Caso contrário, divide por linhas
          return field.split('\n').filter(line => line.trim());
        } catch (e) {
          return field.split('\n').filter(line => line.trim());
        }
      }

      return [];
    };

    return {
      // Meta tags
      meta_title: product.meta_title || product.nome,
      meta_description: product.meta_description || product.descricao_curta || '',
      meta_keywords: product.meta_keywords || '',

      // Informações básicas
      nome: product.nome || '',
      subtitulo: product.subtitulo || '',
      imagem_banner: product.imagem_banner || '',

      // Categoria
      categoria_nome: product.categoria_nome || '',
      categoria_slug: product.categoria_slug || '',

      // Descrições
      descricao_curta: product.descricao_curta || '',
      descricao_completa: product.descricao_completa || '',

      // Arrays processados
      caracteristicas: parseField(product.caracteristicas),
      vantagens: parseField(product.vantagens),
      aplicacoes: parseField(product.aplicacoes),

      // Especificações (pode ser texto ou JSON)
      especificacoes_tecnicas: product.especificacoes || '',
      normas_certificacoes: product.normas_certificacoes || '',

      // Galeria
      galeria_imagens: parseField(product.galeria_imagens),

      // Vídeo
      video_url: product.video_url || '',

      // Data de publicação
      data_publicacao: product.published_at ?
        new Date(product.published_at).toLocaleDateString('pt-BR') : ''
    };
  }
}
