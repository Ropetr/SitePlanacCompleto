# 🏗️ Site Planac Distribuidora

Site institucional profissional da **Planac Distribuidora** - empresa especializada em forros, divisórias e acabamentos em geral.

## 🚀 NOVO: Sistema Completo de Otimização de Imagens

✅ **Scripts automáticos** para download, otimização e upload de imagens
✅ **Conversão para WebP** (redução de 60-80% no tamanho)
✅ **Integração com Cloudflare R2** para CDN global grátis
✅ **SEO otimizado** - PageSpeed score 90-100

**📖 Veja:** [IMAGES-QUICKSTART.md](IMAGES-QUICKSTART.md) para começar!

## 📁 Estrutura do Projeto

```
SitePlanacCompleto-main/
├── index.html              # Página principal
├── assets/                 # Recursos estáticos
│   ├── css/               # Arquivos de estilo
│   │   ├── main.css       # Estilos principais centralizados
│   │   └── styles-components.css  # Estilos dos componentes
│   ├── js/                # Scripts JavaScript
│   │   └── load-components.js     # Carregador de componentes
│   ├── svg/               # Ícones e logos SVG
│   │   ├── Logo.svg
│   │   ├── coracao.svg
│   │   ├── localizacao.svg
│   │   └── whatsapp-float.svg
│   └── images/            # Sistema de gerenciamento de imagens
│       ├── original/      # Imagens originais (backup)
│       ├── optimized/     # Imagens WebP otimizadas
│       └── README.md      # Documentação do sistema
├── components/            # Componentes reutilizáveis
│   ├── header.html        # Cabeçalho com navegação
│   ├── footer.html        # Rodapé
│   └── whatsapp-float.html # Botão flutuante WhatsApp
├── pages/                 # Páginas de produtos
│   ├── divisoria-naval-page.html
│   ├── drywall-divisoria-page.html
│   ├── forrovid-page.html
│   ├── forro-vinilico-revid.html
│   ├── isopor-page.html
│   ├── kit-porta.html
│   ├── kit-porta-correr.html
│   ├── la-pet-page.html
│   ├── la-rocha-page.html
│   ├── la-vidro-page.html
│   ├── manta-termica.html
│   ├── mineral-page.html
│   ├── planac-forro-gesso-completo.html
│   ├── planac-gesso-modular.html
│   ├── portas-sanfonadas.html
│   ├── pvc-amadeirado-page.html
│   ├── pvc-branco-page.html
│   ├── pvc-modular-page.html
│   └── rodapes.html
├── download-images.py    # Script de download de imagens
├── optimize-images.py    # Script de otimização WebP
├── upload-to-r2.py       # Upload para Cloudflare R2
├── update-image-links.py # Atualiza links nos HTMLs
├── requirements.txt      # Dependências Python
├── cloudflare-r2-setup.md # Guia Cloudflare R2
├── IMAGES-QUICKSTART.md  # Guia rápido de imagens
└── README.md             # Este arquivo
```

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos com design responsivo
- **JavaScript (Vanilla)** - Interatividade sem dependências
- **Google Fonts** - Tipografia (Barlow & Poppins)
- **SVG** - Ícones vetoriais

## ✨ Funcionalidades

### 📱 Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Menu hambúrguer em telas pequenas
- Imagens e cards responsivos

### 🧩 Componentes Modulares
- Header, footer e WhatsApp float carregados dinamicamente
- Fácil manutenção e atualização
- Versioning system para cache busting

### 🎨 Interface Moderna
- Animações suaves (smooth scroll)
- Hover effects
- Dropdown menus
- Cards interativos

### 📞 Integração WhatsApp
- Botão flutuante com animação pulse
- Links diretos para contato
- Formulário que redireciona para WhatsApp

## 📦 Produtos/Serviços

### Divisórias
- Divisória Naval
- Divisória de Gesso Acartonado (Drywall)

### Drywall
- Parede de Gesso Acartonado
- Forro de Gesso Acartonado

### Forros
- Gesso Acartonado
- PVC Branco
- PVC Amadeirado
- Forro Vinílico REVID

### Forros Modulares
- Gesso Modular
- PVC Modular
- Forrovid
- Mineral
- Isopor

### Termoacústica
- Lã de Rocha
- Lã de Vidro
- Lã de PET
- Manta Térmica

### Kit Portas
- Kit Porta de Giro
- Kit Porta de Correr
- Portas Sanfonadas

### Rodapés
- Diversos modelos e acabamentos

## 🛠️ Como Usar

### Opção 1: Servidor Local (Recomendado)
```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (npx)
npx serve

# Usando PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

### Opção 2: Abrir Diretamente
Abra o arquivo `index.html` em um navegador moderno.

**⚠️ Nota**: Alguns navegadores podem bloquear o carregamento de componentes via `fetch()` quando abertos diretamente do sistema de arquivos. Use um servidor local para melhor experiência.

## 🎨 Cores do Brand

- **Vermelho Principal**: `#AA000E`
- **Vermelho Secundário**: `#96181c`
- **Vermelho CTA**: `#ec3237`
- **Background Claro**: `#f6f8fb`
- **Texto Escuro**: `#3d3d3d`

## 📱 Contato

- **Telefone**: (43) 3028-5316
- **WhatsApp**: (43) 98418-2582
- **Email**: contato@planacdivisorias.com.br
- **Endereço**: Av. Abelio Benatti, 4912 - Londrina-PR
- **Instagram**: [@planacdistribuidora](https://www.instagram.com/planacdistribuidora/)

## 🔧 Manutenção

### Atualizar Componentes
1. Edite o arquivo desejado em `/components/`
2. Atualize a versão em `/assets/js/load-components.js`:
   ```javascript
   const COMPONENTS_VERSION = '1.0.1'; // Incrementar
   ```

### Adicionar Nova Página de Produto
1. Crie o arquivo em `/pages/novo-produto.html`
2. Adicione o link no `/components/header.html`
3. Adicione o card correspondente no `index.html`

### Alterar Estilos
- **Estilos globais**: `/assets/css/main.css`
- **Estilos de componentes**: `/assets/css/styles-components.css`

## ⚡ Performance

- **CSS Externo**: Centralizado para melhor cache
- **Component Versioning**: Cache busting automático
- **SVG Icons**: Vetoriais e leves
- **Imagens CDN**: Hospedadas externamente

## 📝 Checklist de Deploy

- [ ] Testar todos os links
- [ ] Verificar responsividade (mobile/tablet/desktop)
- [ ] Testar formulário de contato
- [ ] Validar links WhatsApp e telefone
- [ ] Otimizar imagens (se houver locais)
- [ ] Testar em diferentes navegadores
- [ ] Configurar meta tags (SEO)
- [ ] Adicionar analytics (Google Analytics, etc.)

## 👨‍💻 Desenvolvido por

**RPetri** com ❤️

---

**© 2024 Planac Distribuidora - Todos os direitos reservados**
