/**
 * Templates HTML para renderização dinâmica de páginas
 */

export const PRODUCT_PAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{meta_title}}</title>
    <meta name="description" content="{{meta_description}}">
    <meta name="keywords" content="{{meta_keywords}}">
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles-components.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; font-size: 10px; }
        body { font-family: 'Barlow', sans-serif; overflow-x: hidden; }
        .container { max-width: 1410px; width: 90%; margin: 0 auto; padding: 0 15px; }
        .service-banner { width: 100%; height: 60vh; min-height: 400px; position: relative; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; margin-top: 0; background-image: url('{{imagem_banner}}'); }
        .service-banner::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .service-banner-content { position: relative; z-index: 2; text-align: center; color: #fff; max-width: 900px; }
        .service-banner h1 { font-size: clamp(3.5rem, 6vw, 6rem); margin-bottom: 20px; text-transform: uppercase; filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.6)); }
        .service-banner p { font-size: clamp(1.8rem, 2.5vw, 2.4rem); filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.6)); }
        .breadcrumb { padding: 20px 0; background: #f6f8fb; }
        .breadcrumb-list { display: flex; gap: 10px; list-style: none; font-size: 1.4rem; flex-wrap: wrap; }
        .breadcrumb-list li { display: flex; align-items: center; gap: 10px; }
        .breadcrumb-list a { color: #AA000E; text-decoration: none; }
        .breadcrumb-list a:hover { text-decoration: underline; }
        .breadcrumb-list span { color: #666; }
        .service-content { padding: 80px 0; background: #fff; }
        .service-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 50px; align-items: start; }
        .service-main { background: #fff; }
        .service-main h2 { font-size: 3.6rem; color: #AA000E; margin-bottom: 30px; text-transform: uppercase; }
        .service-main h3 { font-size: 2.8rem; color: #3d3d3d; margin: 40px 0 20px; }
        .service-main p { font-size: 1.8rem; line-height: 1.8; color: #3d3d3d; margin-bottom: 20px; text-align: justify; }
        .service-main ul { list-style: none; padding-left: 0; margin: 20px 0; }
        .service-main li { font-size: 1.8rem; padding: 12px 0 12px 30px; position: relative; color: #3d3d3d; }
        .service-main li::before { content: '✓'; position: absolute; left: 0; color: #AA000E; font-weight: bold; font-size: 2rem; }
        .service-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 40px 0; }
        .gallery-item { position: relative; height: 250px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer; transition: 0.3s; }
        .gallery-item:hover { transform: scale(1.05); }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .service-sidebar { position: sticky; top: 180px; }
        .sidebar-card { background: #f6f8fb; padding: 30px; border-radius: 10px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .sidebar-card h3 { font-size: 2.4rem; color: #AA000E; margin-bottom: 20px; text-transform: uppercase; }
        .cta-section { background: linear-gradient(135deg, #AA000E 0%, #96181c 100%); padding: 60px 0; text-align: center; color: #fff; }
        .cta-section h2 { font-size: 4rem; margin-bottom: 20px; text-transform: uppercase; }
        .cta-section p { font-size: 2rem; margin-bottom: 40px; }
        .btn-primary { background: #fff; color: #AA000E; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-size: 1.8rem; font-weight: 700; display: inline-block; transition: 0.3s; }
        .btn-primary:hover { background: #ec3237; color: #fff; transform: translateY(-3px); box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
        .quote-form-section { padding: 80px 0; background: #f6f8fb; }
        .quote-form-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 50px; border-radius: 10px; box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
        .quote-form-container h2 { font-size: 3.6rem; color: #AA000E; margin-bottom: 30px; text-align: center; text-transform: uppercase; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; font-size: 1.6rem; font-weight: 600; margin-bottom: 8px; color: #3d3d3d; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 1.6rem; font-family: 'Barlow', sans-serif; transition: 0.3s; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #AA000E; box-shadow: 0 0 0 3px rgba(170,0,14,0.1); }
        .form-group textarea { min-height: 150px; resize: vertical; }
        .form-group button { width: 100%; background: #AA000E; color: #fff; padding: 18px; border: none; border-radius: 8px; font-size: 1.8rem; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .form-group button:hover { background: #96181c; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(170,0,14,0.3); }
        @media (max-width: 1024px) { .service-grid { grid-template-columns: 1fr; } .service-sidebar { position: static; } .service-banner { margin-top: 130px; } }
        @media (max-width: 768px) { .service-banner { height: 50vh; min-height: 300px; } .quote-form-container { padding: 30px 20px; } }
    </style>
</head>
<body>
    <div id="header-container"></div>

    <section class="service-banner">
        <div class="service-banner-content">
            <h1>{{nome}}</h1>
            <p>{{subtitulo}}</p>
        </div>
    </section>

    <section class="breadcrumb">
        <div class="container">
            <ul class="breadcrumb-list">
                <li><a href="/index.html">Início</a></li>
                <li>›</li>
                <li><a href="/index.html#{{categoria_slug}}">{{categoria_nome}}</a></li>
                <li>›</li>
                <li><span>{{nome}}</span></li>
            </ul>
        </div>
    </section>

    <section class="service-content">
        <div class="container">
            <div class="service-grid">
                <div class="service-main">
                    <h2>{{nome}}</h2>
                    {{descricao_completa}}

                    {{#if caracteristicas}}
                    <h3>Características Principais</h3>
                    <ul>
                        {{#each caracteristicas}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                    {{/if}}

                    {{#if vantagens}}
                    <h3>Vantagens</h3>
                    <ul>
                        {{#each vantagens}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                    {{/if}}

                    {{#if aplicacoes}}
                    <h3>Aplicações</h3>
                    <ul>
                        {{#each aplicacoes}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                    {{/if}}

                    {{#if especificacoes_tecnicas}}
                    <h3>Especificações Técnicas</h3>
                    <p>{{especificacoes_tecnicas}}</p>
                    {{/if}}

                    {{#if galeria_imagens}}
                    <h3>Galeria de Projetos</h3>
                    <div class="service-gallery">
                        {{#each galeria_imagens}}
                        <div class="gallery-item">
                            <img src="{{this}}" alt="{{../nome}} - Projeto">
                        </div>
                        {{/each}}
                    </div>
                    {{/if}}
                </div>

                <aside class="service-sidebar">
                    <div class="sidebar-card">
                        <h3>Fale Conosco</h3>
                        <p style="font-size: 1.6rem; margin-bottom: 15px;">Entre em contato para mais informações:</p>
                        <a href="https://api.whatsapp.com/send/?phone=5543984182582&text=Olá,%20Planac!%20Gostaria%20de%20orçamento%20para%20{{nome}}."
                           target="_blank"
                           style="background: #20b038; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: center; gap: 10px; border-radius: 8px; text-decoration: none;">
                            WhatsApp
                        </a>
                    </div>
                </aside>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <h2>Interessado em {{nome}}?</h2>
            <p>Solicite um orçamento personalizado!</p>
            <a href="#orcamento" class="btn-primary">Solicitar Orçamento Agora</a>
        </div>
    </section>

    <section class="quote-form-section" id="orcamento">
        <div class="container">
            <div class="quote-form-container">
                <h2>Solicite seu Orçamento</h2>
                <form id="quote-form">
                    <input type="hidden" name="produto" value="{{nome}}">
                    <div class="form-group">
                        <label for="nome">Nome Completo *</label>
                        <input type="text" id="nome" name="nome" required>
                    </div>
                    <div class="form-group">
                        <label for="email">E-mail *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="telefone">Telefone/WhatsApp *</label>
                        <input type="tel" id="telefone" name="telefone" required>
                    </div>
                    <div class="form-group">
                        <label for="cidade">Cidade *</label>
                        <input type="text" id="cidade" name="cidade" required>
                    </div>
                    <div class="form-group">
                        <label for="tipo">Tipo de Projeto</label>
                        <select id="tipo" name="tipo">
                            <option value="">Selecione...</option>
                            <option value="residencial">Residencial</option>
                            <option value="comercial">Comercial</option>
                            <option value="industrial">Industrial</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="mensagem">Detalhes do Projeto *</label>
                        <textarea id="mensagem" name="mensagem" placeholder="Descreva seu projeto..." required></textarea>
                    </div>
                    <div class="form-group">
                        <button type="submit">🚀 Enviar Orçamento</button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <div id="whatsapp-float-container"></div>
    <div id="footer-container"></div>

    <script src="/load-components.js?v=2"></script>
    <script src="/forms-integration.js"></script>
</body>
</html>`;
