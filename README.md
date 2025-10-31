# Site Planac Distribuidora

Site institucional e catálogo de produtos da Planac Distribuidora - distribuidora de materiais de construção em Londrina-PR.

## 🚀 Tecnologias

- HTML5
- CSS3 (Glassmorphism, Flexbox, Grid)
- JavaScript Vanilla
- Google Fonts (Barlow, Poppins)

## 📋 Estrutura do Projeto

### Páginas Principais
- `index.html` - Landing page principal
- `planac-website.html` - Home alternativa

### Componentes Reutilizáveis
- `header.html` - Cabeçalho com navegação e dropdowns
- `footer.html` - Rodapé com informações
- `whatsapp-float.html` - Botão flutuante do WhatsApp

### Páginas de Produtos

**Divisórias**
- `divisoria-naval-page.html`
- `drywall-divisoria-page.html`

**Forros**
- `planac-forro-gesso-completo.html`
- `pvc-branco-page.html`
- `pvc-amadeirado-page.html`
- `forro-vinilico-revid.html`

**Forros Modulares**
- `planac-gesso-modular.html`
- `pvc-modular-page.html`
- `forrovid-page.html`
- `mineral-page.html`
- `isopor-page.html`

**Termoacústica**
- `la-rocha-page.html`
- `la-vidro-page.html`
- `la-pet-page.html`
- `manta-termica.html`

**Kit Portas**
- `kit-porta.html`
- `kit-porta-correr.html`
- `portas-sanfonadas.html`

**Outros**
- `rodapes.html`

## 🎨 Design System

### Cores
- **Primary (Vinho)**: `#AA000E`
- **Secondary (Vermelho)**: `#ec3237`
- **Branco**: `#fff`
- **Chumbo (Menus)**: `rgba(50, 55, 65, 0.5)`

### Efeitos Visuais

**Header - Box da Logo**
```css
background: linear-gradient(to bottom, #fff 0%, #fff 50%, rgba(170,0,14,0.1) 100%);
box-shadow: 0 -2px 5px rgba(0,0,0,0.1), 2px 0 5px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.1);
```

**Text Shadow (Títulos e Textos)**
```css
text-shadow:
    0 0 10px rgba(0,0,0,0.8),
    0 0 20px rgba(0,0,0,0.6),
    0 0 30px rgba(0,0,0,0.4),
    0 0 40px rgba(0,0,0,0.3),
    0 0 50px rgba(0,0,0,0.2),
    2px 2px 4px rgba(0,0,0,0.9);
```

**Dropdowns Principais**
```css
background: rgba(50, 55, 65, 0.5);
backdrop-filter: blur(10px);
border: 1.5px solid rgba(255, 255, 255, 0.4);
```

**Submenu Modulares**
```css
background: rgba(50, 55, 65, 0.5);
backdrop-filter: blur(10px);
border: 1.5px solid rgba(255, 255, 255, 0.4);
```

### Navegação

**Menu Principal**
- Divisórias
- Drywall
- Forros
  - Gesso Acartonado
  - PVC Branco
  - PVC Amadeirado
  - Forro Vinílico REVID
  - **Modulares →** (Submenu)
    - Gesso Modular
    - PVC Modular
    - Forrovid
    - Mineral
    - Isopor
- Termoacústica
- Kit Portas
- Rodapés
- Sobre
- Contato

### Responsividade

**Breakpoints:**
- `1900px` - Ajustes iniciais
- `1750px` - Redução de fontes
- `1650px` - Esconde números de telefone (apenas ícones)
- `1400px` - Ajustes de espaçamento
- `1200px` - Transição para mobile
- `1024px` - Menu hambúrguer ativado

**Menu Responsivo:**
- Desktop: Menu completo com dropdowns
- Tablet/Mobile: Menu hambúrguer + ícones de contato

**Layout Mobile (≤1024px):**
- Grid de 2 colunas para cards e services
- Container com 95% de largura
- Cards compactos: padding 20px 15px
- Ícones reduzidos: 40px (de 60px)
- Textos menores: 1.4rem (de 2.4rem)
- Gap reduzido: 15px

## 📞 Contatos

- **Telefone**: (43) 3028-5316
- **WhatsApp**: (43) 98418-2582
- **Email**: contato@planacdivisorias.com.br
- **Endereço**: Av. Abelio Benatti, 4912 - Londrina-PR
- **Horário**: Segunda a Sexta, 8h às 17h

## 🔧 Funcionalidades

### Carregamento Dinâmico de Componentes
```javascript
// load-components.js
- Carrega header, footer e whatsapp-float dinamicamente
- Cache-busting com timestamps
- Inicialização de eventos do mobile menu
```

### Formulários
- Integração com WhatsApp Business API
- Máscara de telefone
- Validação HTML5
- Envio direto para WhatsApp

### Animações CSS
- Heart pulse (footer)
- WhatsApp pulse
- Hamburger pulse
- Hover effects nos menus

## 🌐 Deploy

Site hospedado no **Cloudflare Pages**:
- URL: https://siteplanaccompleto.pages.dev/
- Deploy automático via GitHub
- Build instantâneo a cada push

## 📝 Estrutura de Arquivos

```
SitePlanacCompleto/
├── index.html
├── planac-website.html
├── header.html
├── footer.html
├── whatsapp-float.html
├── styles-components.css
├── load-components.js
├── Logo.svg
├── Logo 2.svg
├── coracao.svg
├── Telefone.svg
├── Whats.svg
├── Instagram.svg
├── Localização Atualizado.svg
├── whatsapp-float.svg
└── [páginas de produtos]
```

## 🎯 Melhorias Recentes

### Navegação e Menus
- ✅ Dropdowns responsivos com hover estável
- ✅ Submenu "Modulares" dentro de "Forros"
- ✅ Efeito glassmorphism em todos os menus
- ✅ Alinhamento perfeito do dropdown com sublinhado
- ✅ Números de telefone escondem em telas menores

### Visual e Estética (Janeiro 2025)
- ✅ Text-shadow com efeito degradê/glow em todos os textos
- ✅ Gradiente sutil no box da logo (branco → avermelhado)
- ✅ Ícones SVG externos para header e footer
- ✅ Box-shadow ajustada no header para melhor integração
- ✅ Sublinhado customizado (2px, -3.5px)
- ✅ Bordas translúcidas e sombras

### Mobile e Responsividade (Janeiro 2025)
- ✅ Layout de 2 colunas para cards no mobile
- ✅ Redução proporcional de ícones (60px → 40px)
- ✅ Redução de fontes nos cards (2.4rem → 1.4rem)
- ✅ Padding otimizado para mobile (40px → 20px)
- ✅ Container expandido (95% largura) para melhor uso do espaço
- ✅ Gap reduzido (30px → 15px) entre elementos

### UX/UI
- ✅ Ponte invisível para hover nos dropdowns
- ✅ Transição suave entre menus
- ✅ Feedback visual em todos os elementos clicáveis
- ✅ Consistência visual em toda a navegação
- ✅ Cache-busting no header para atualizações instantâneas

## 📦 Dependências Externas

- Google Fonts API
- WhatsApp Business API
- Imagens hospedadas em `painel-planac.codiehost.com.br`

## 🔒 Segurança

- Site estático (sem backend)
- Sem armazenamento de dados sensíveis
- Formulários redirecionam para WhatsApp
- HTTPS via Cloudflare

## 📄 Licença

© 2024 Planac Distribuidora. Todos os direitos reservados.

---

**Desenvolvido com ❤️ por Claude Code**
