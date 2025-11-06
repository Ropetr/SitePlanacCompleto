# 📁 Pasta de Referência - Backend Planac

Esta pasta contém toda a documentação de referência para o desenvolvimento do backend e CMS do site Planac Distribuidora.

## 📄 Documentos Disponíveis

### 1. ESTRUTURA_SITE_ATUAL.md
**Descrição completa da estrutura técnica do site atual:**
- Arquitetura e organização de arquivos
- Stack tecnológico utilizado
- Componentes e recursos
- Design system (cores, tipografia, efeitos)
- Responsividade e breakpoints
- Funcionalidades implementadas
- Pontos fortes e fracos
- Dependências

**Use este documento para:**
- Entender como o site funciona atualmente
- Identificar o que precisa ser migrado
- Conhecer as limitações atuais
- Planejar a integração com o backend

---

### 2. PROPOSTA_BACKEND_CMS.md
**Proposta técnica completa do backend/CMS:**
- Arquitetura sugerida (Node.js, PHP, Python)
- Todas as funcionalidades detalhadas
- Estrutura do banco de dados
- API REST (endpoints)
- Painel administrativo
- Segurança e permissões
- Integrações (WhatsApp, Analytics, E-mail)
- SEO e Analytics
- Cronograma de desenvolvimento
- Estimativa de custos

**Use este documento para:**
- Planejar o desenvolvimento do backend
- Entender escopo completo do projeto
- Estimar prazos e custos
- Apresentar proposta a clientes/investidores
- Guiar o desenvolvimento

---

### 3. LISTA_CONTEUDO_ATUAL.md
**Inventário completo do conteúdo do site:**
- Lista de todas as 21 produtos
- 7 categorias organizadas
- Conteúdo institucional (Sobre, Missão, Visão, Valores)
- Informações de contato
- URLs de imagens
- Estrutura de navegação
- Formulários
- CTAs e links do WhatsApp

**Use este documento para:**
- Cadastrar produtos no novo CMS
- Migrar conteúdo existente
- Criar estrutura de categorias
- Importar imagens
- Configurar formulários

---

### 4. README.md (este arquivo)
**Guia de uso desta pasta de referência**

---

## 🎯 Como Usar Esta Documentação

### Para Desenvolvedores
1. **Leia primeiro**: `ESTRUTURA_SITE_ATUAL.md`
   - Entenda o site atual antes de começar

2. **Planeje com**: `PROPOSTA_BACKEND_CMS.md`
   - Use como blueprint do que desenvolver

3. **Migre usando**: `LISTA_CONTEUDO_ATUAL.md`
   - Cadastre todos os produtos e conteúdos

### Para Gestores de Projeto
1. Use `PROPOSTA_BACKEND_CMS.md` para:
   - Definir escopo
   - Estimar prazos
   - Calcular custos
   - Apresentar a clientes

2. Use `LISTA_CONTEUDO_ATUAL.md` para:
   - Planejar migração de dados
   - Dimensionar trabalho de cadastro

### Para Clientes/Proprietários
1. Leia `PROPOSTA_BACKEND_CMS.md` seção "BENEFÍCIOS"
   - Entenda o que ganhará com o backend

2. Revise `LISTA_CONTEUDO_ATUAL.md`
   - Veja todo o conteúdo que será gerenciável

---

## 🚀 Próximos Passos Recomendados

### Fase 1: Decisão
- [ ] Definir qual stack tecnológica usar (Node.js, PHP ou Python)
- [ ] Definir orçamento disponível
- [ ] Escolher entre desenvolver internamente, freelancer ou agência
- [ ] Priorizar funcionalidades (MVP vs. Completo)

### Fase 2: Planejamento Detalhado
- [ ] Criar wireframes do painel admin
- [ ] Modelar banco de dados completo
- [ ] Documentar API endpoints
- [ ] Definir cronograma de sprints

### Fase 3: Ambiente
- [ ] Contratar servidor/hospedagem
- [ ] Configurar domínio e subdomínio para admin
- [ ] Preparar ambiente de desenvolvimento
- [ ] Configurar repositório Git

### Fase 4: Desenvolvimento
- [ ] Backend (API + Banco)
- [ ] Painel Administrativo
- [ ] Integração com site frontend
- [ ] Testes

### Fase 5: Migração
- [ ] Importar todas as imagens
- [ ] Cadastrar categorias
- [ ] Cadastrar produtos
- [ ] Configurar textos institucionais
- [ ] Configurar formulários

### Fase 6: Deploy e Treinamento
- [ ] Deploy em produção
- [ ] Treinamento da equipe
- [ ] Documentação de uso
- [ ] Suporte inicial

---

## 💡 Dicas Importantes

### Para um MVP Rápido
Se o orçamento ou prazo for limitado, comece com:
1. CRUD de Produtos e Categorias
2. Upload de Imagens
3. Configurações Globais (telefone, endereço, etc.)
4. Gestão de Orçamentos (leads)

Adicione depois:
- Blog
- Depoimentos
- FAQ
- Analytics avançado

### Para Economizar
- Use soluções open-source (PostgreSQL, Node.js)
- Hospedagem VPS ao invés de serviços gerenciados
- Templates prontos para o admin (AdminLTE, React Admin)
- Começe com funcionalidades essenciais

### Para Escalabilidade
- Use arquitetura em camadas (API separada do admin)
- Banco de dados normalizado
- Caching (Redis)
- CDN para imagens
- Load balancer (futuro)

---

## 📞 Informações do Site

**Empresa**: Planac Distribuidora
**Site**: siteplanaccompleto.pages.dev
**Telefone**: (43) 98418-2582
**Endereço**: Av. Abelio Benatti, 4912 - Londrina-PR

---

## 📝 Notas Técnicas

### Arquivos do Site Atual
```
/
├── index.html (Home principal)
├── planac-website.html (Home alternativa)
├── header.html (componente)
├── footer.html (componente)
├── whatsapp-float.html (componente)
├── load-components.js (carregador dinâmico)
├── styles-components.css (estilos globais)
├── glass-s23.css (não utilizado)
├── *.svg (logos e ícones - 8 arquivos)
└── [21 páginas de produtos].html
```

### Imagens Hospedadas Externamente
- **CDN**: painel-planac.codiehost.com.br/uploads/
- **Quantidade**: ~15+ imagens de produtos
- **Ação necessária**: Baixar e hospedar localmente ou em novo CDN

### Integrações Existentes
- WhatsApp Business API (funcionando)
- Google Fonts (funcionando)
- Google Maps (link externo)
- Instagram (link externo)

### Integrações a Implementar
- [ ] Google Analytics
- [ ] Google Tag Manager
- [ ] Facebook Pixel (opcional)
- [ ] E-mail SMTP (notificações)
- [ ] Backup automatizado

---

## ✅ Checklist de Funcionalidades

### Backend API
- [ ] Autenticação JWT
- [ ] CRUD Produtos
- [ ] CRUD Categorias
- [ ] Upload de Imagens
- [ ] Gestão de Orçamentos
- [ ] Gestão de Contatos
- [ ] Configurações Globais
- [ ] Relatórios e Analytics

### Painel Admin
- [ ] Login/Logout
- [ ] Dashboard com métricas
- [ ] Gerenciar Produtos
- [ ] Gerenciar Categorias
- [ ] Biblioteca de Mídia
- [ ] Visualizar Orçamentos
- [ ] Configurações do Site
- [ ] Gerenciar Usuários

### Segurança
- [ ] HTTPS (SSL)
- [ ] Validação de inputs
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Backup automático
- [ ] Logs de auditoria

### SEO
- [ ] URLs amigáveis
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Meta tags dinâmicas
- [ ] Open Graph
- [ ] Schema.org

---

## 📚 Recursos Úteis

### Documentação Técnica
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)

### Ferramentas Recomendadas
- **Desenvolvimento**: VS Code, Postman, DBeaver
- **Design**: Figma (wireframes)
- **Versionamento**: Git + GitHub/GitLab
- **Monitoramento**: PM2, Sentry
- **Deploy**: Docker, GitHub Actions

### Templates de Admin
- [AdminLTE](https://adminlte.io/) (Bootstrap)
- [React Admin](https://marmelab.com/react-admin/)
- [Vue Admin](https://github.com/PanJiaChen/vue-element-admin)
- [Laravel Nova](https://nova.laravel.com/) (se usar Laravel)

---

## 🤝 Contribuindo

Se você for modificar ou expandir esta documentação:

1. Mantenha a formatação Markdown
2. Atualize o README quando adicionar novos arquivos
3. Use linguagem clara e objetiva
4. Adicione exemplos quando possível
5. Mantenha o histórico de versões

---

## 📅 Histórico de Versões

- **v1.0** (06/11/2025) - Documentação inicial completa
  - ESTRUTURA_SITE_ATUAL.md
  - PROPOSTA_BACKEND_CMS.md
  - LISTA_CONTEUDO_ATUAL.md
  - README.md

---

## 📧 Contato

Para dúvidas sobre esta documentação ou sobre o projeto:

**Desenvolvedor**: [Seu Nome]
**E-mail**: [seu@email.com]
**Data**: 06 de Novembro de 2025

---

**Boa sorte no desenvolvimento do backend! 🚀**
