# Estrutura Atual do Site Planac

## Informações Gerais
- **Nome**: Planac Distribuidora - Forros e Divisórias
- **Domínio**: siteplanaccompleto.pages.dev
- **Telefone Principal**: (43) 98418-2582
- **Telefone Fixo**: (43) 3028-5316
- **Endereço**: Av. Abelio Benatti, 4912 - Jardim do Sol - Londrina-PR
- **E-mail**: contato@planacdivisorias.com.br
- **Instagram**: @planacdistribuidora

## Arquitetura do Site

### 1. Páginas Principais
- **index.html** - Página Home completa com todas as seções
- **planac-website.html** - Página alternativa/simplificada

### 2. Páginas de Produtos (24 páginas HTML)

#### Divisórias
- divisoria-naval-page.html
- drywall-divisoria-page.html

#### Forros
- planac-forro-gesso-completo.html (Gesso Acartonado)
- pvc-branco-page.html
- pvc-amadeirado-page.html
- forro-vinilico-revid.html

#### Forros Modulares
- planac-gesso-modular.html
- pvc-modular-page.html
- forrovid-page.html
- mineral-page.html
- isopor-page.html

#### Termoacústica
- la-rocha-page.html
- la-vidro-page.html
- la-pet-page.html
- manta-termica.html

#### Kit Portas
- kit-porta.html (Kit Porta de Giro)
- kit-porta-correr.html
- portas-sanfonadas.html

#### Rodapés
- rodapes.html

### 3. Componentes Reutilizáveis
- **header.html** - Cabeçalho com menu e logo
- **footer.html** - Rodapé com contatos
- **whatsapp-float.html** - Botão flutuante do WhatsApp

### 4. Assets e Recursos

#### Arquivos CSS
- **glass-s23.css** - Estilos globais (não utilizado atualmente)
- **styles-components.css** - Estilos dos componentes (header, footer, dropdowns, mobile menu)

#### Arquivos JavaScript
- **load-components.js** - Carrega header, footer e whatsapp-float dinamicamente

#### Imagens SVG
- Logo.svg
- Logo 2.svg
- Telefone.svg
- Whats.svg
- Instagram.svg
- Localização Atualizado.svg
- whatsapp-float.svg
- coracao.svg

#### Outros
- Fundo Gif.gif
- README.md

## Estrutura de Conteúdo

### Seções da Home (index.html)
1. **Banner Hero** - Título principal com CTA
2. **Cards de Benefícios** - 4 cards com vantagens (ABNT, Pronta Entrega, Agilidade, Flexibilidade)
3. **Divisórias** - Grid com produtos
4. **Drywall** - Parede e Forro
5. **Forros** - Diversos tipos
6. **Forros Modulares** - Sistema modular
7. **Termoacústica** - Isolamento
8. **Kit Portas** - Portas de Giro, Correr e Sanfonadas
9. **Rodapés** - Acabamentos
10. **Sobre Nós** - História da empresa + Missão, Visão e Valores
11. **Contato** - Formulário (não funcional, redireciona para WhatsApp)

### Navegação (Header)
Menu com dropdowns hierárquicos:
- Divisórias (dropdown)
- Drywall (dropdown)
- Forros (dropdown com submenu "Modulares")
- Termoacústica (dropdown)
- Kit Portas (dropdown)
- Rodapés (link direto)
- Sobre (link direto)
- Contato (link direto)

### Mobile Menu
- Menu lateral (sidebar) com overlay
- Estrutura hierárquica com dropdowns expansíveis
- Links para todas as páginas do site

## Stack Tecnológico Atual

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos com glassmorphism (Samsung S23)
- **Vanilla JavaScript** - Interatividade e carregamento de componentes
- **Google Fonts** - Barlow e Poppins

### Hospedagem de Imagens
- **painel-planac.codiehost.com.br/uploads/** - CDN para imagens dos produtos

### Recursos Externos
- **WhatsApp Business API** - Integração para contato direto
- **Google Maps** - Link para localização
- **Instagram** - Rede social

## Funcionalidades Atuais

### Funcionais
1. **Menu Responsivo** - Desktop com dropdowns, Mobile com sidebar
2. **Carregamento Dinâmico** - Header, Footer e WhatsApp Float
3. **Smooth Scroll** - Navegação suave entre seções
4. **Máscara de Telefone** - Formatação automática de inputs
5. **Formulário para WhatsApp** - Captura dados e redireciona
6. **Galeria de Imagens** - Clique para expandir
7. **Animações CSS** - Pulse effects, hover states

### Não Funcionais (Apenas Visual)
1. **Formulário de Contato** - Redireciona para WhatsApp (não salva no banco)
2. **Sistema de Busca** - Não implementado
3. **Painel Administrativo** - Não existe
4. **Banco de Dados** - Não implementado

## Integração com WhatsApp
Todos os CTAs e formulários redirecionam para:
```
https://api.whatsapp.com/send/?phone=5543984182582&text=[mensagem_formatada]
```

## Design System

### Cores Principais
- **Vermelho Planac**: #AA000E (primário)
- **Vermelho Escuro**: #96181c (secundário)
- **Vermelho CTA**: #ec3237 (botões)
- **Branco**: #fff
- **Cinza Claro**: #f6f8fb (backgrounds)
- **Cinza Texto**: #3d3d3d

### Tipografia
- **Títulos**: Barlow (700-800)
- **Corpo**: Barlow (400-600)
- **Base**: 10px (rem)

### Efeitos Visuais
- **Glassmorphism**: backdrop-filter: blur(28px)
- **Text Shadow**: Múltiplas camadas para legibilidade
- **Drop Shadow**: Ícones e logos com brilho
- **Box Shadow**: Elevação de cards e dropdowns

## Responsividade

### Breakpoints
- **Desktop**: > 1024px (menu completo)
- **Tablet**: 768px - 1024px (menu hamburger)
- **Mobile**: < 768px (layout simplificado)

### Ajustes Mobile
- Header reduzido (80px altura)
- Logo menor (127px)
- Menu hamburger
- Footer com ícones apenas
- Padding reduzido
- Grid de 1 coluna

## Git Repository
- **Branch Principal**: main
- **Status**: Clean (último commit relacionado a correções de CSS)

## Observações Importantes

### Pontos Fortes
1. Design moderno e profissional
2. Glassmorphism bem implementado
3. Componentes reutilizáveis
4. Navegação hierárquica clara
5. Integração WhatsApp funcional
6. Responsivo em todos os dispositivos

### Pontos a Melhorar
1. Todas as imagens vêm de URL externa (CDN)
2. Sem sistema de gerenciamento de conteúdo
3. Sem persistência de dados
4. Formulários não salvam informações
5. Conteúdo hardcoded no HTML
6. Sem analytics ou tracking
7. Sem sistema de busca
8. Sem painel administrativo

### Dados Hardcoded que Precisam de CMS
1. **Produtos**: Nome, descrição, características, aplicações, galeria
2. **Textos**: Títulos, subtítulos, descrições
3. **Imagens**: URLs, alt texts
4. **Links**: WhatsApp, Instagram, Maps
5. **Contatos**: Telefones, endereço, e-mail, horários
6. **Sobre**: História, missão, visão, valores
7. **Cards**: Ícones e textos dos benefícios

## Dependências
- Google Fonts (Barlow, Poppins)
- Nenhuma biblioteca JavaScript externa
- Nenhum framework CSS

## Performance
- Site estático leve
- Carregamento rápido
- Componentes carregados assincronamente
- Imagens podem ser otimizadas (vêm do CDN externo)
