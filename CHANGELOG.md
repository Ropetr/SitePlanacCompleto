# 📝 CHANGELOG – PLANAC WEBSITE V3
Este documento segue o formato **Keep a Changelog** e a especificação **Semantic Versioning 2.0.0**.

Todas as mudanças realizadas pelo Claude ou por qualquer desenvolvedor devem ser registradas aqui.

---

## 📌 Convenções importantes

### Tipos de mudança
- **Added** – Novo recurso adicionado
- **Changed** – Mudanças em recursos existentes
- **Fixed** – Correções de bugs
- **Removed** – Funcionalidades removidas
- **Deprecated** – Recurso ainda existe, mas será removido
- **Security** – Correções relacionadas à segurança

### Regras obrigatórias (Claude Code)
Para cada mudança:
1. A mudança deve ser previamente **aprovada** pelo usuário.
2. Claude deve adicionar uma nova entrada no CHANGELOG.
3. Claude **não deve alterar** entradas antigas.
4. Cada versão deve conter data e descrição clara.

---

# 🔰 VERSÕES INICIAIS

## [0.0.3] – 2025-02-10
### Added
- Estrutura oficial do **CHANGELOG.md** revisada e substituída.
- Seções padronizadas para uso contínuo no fluxo Claude Code + Cloudflare.
- Categoria "Claude Automation Notes" adicionada para rastrear ações automáticas do modelo.

### Changed
- Removido CHANGELOG anterior (legacy) que estava inconsistente com o novo fluxo.
- Padronização para Semantic Versioning (SemVer) estabelecida.

---

## [0.0.2] – 2025-02-09
### Added
- `README-CLAUDE.md` criado com:
  - regras operacionais
  - fluxo de aprovação
  - limites de escopo
  - formato obrigatório de tarefas

### Changed
- Documentação do projeto reorganizada em arquivos específicos.

---

## [0.0.1] – 2025-02-08
### Added
- Versão inicial do Planac Website V3 importada para Cloudflare + ClaudeCode.
- Reestruturação de pastas e importação do código original.
- Auditoria inicial dos sistemas backend, frontend e admin.

---

# 🔮 FUTURAS VERSÕES (Claude deve completar e criar conforme avançarmos)

## [0.1.0] – 2025-11-14
### Added
- **ServicePageTemplateV1** criado como template oficial para páginas de produtos/serviços
- Sistema de padronização de páginas HTML implementado
- CSS inline completo (420+ linhas) aplicado em todas as páginas
- Estrutura completa com: Banner hero, Breadcrumb, Grid sidebar, CTA section, Formulário de orçamento
- Scripts funcionais: máscaras de telefone, smooth scroll, integração WhatsApp
- Header/footer dinâmicos via `load-components.js` em todas as páginas

### Changed
- **18 páginas HTML padronizadas** seguindo ServicePageTemplateV1:
  - Divisórias: divisoria-naval-page.html, drywall-divisoria-page.html
  - Forros: planac-gesso-modular.html, forro-de-gesso-modular.html, forrovid-page.html, forro-de-pvc-modular.html, forro-vinilico-revid.html, pvc-modular-page.html, pvc-amadeirado-page.html, pvc-branco-page.html, mineral-page.html, isopor-page.html
  - Isolamentos: la-rocha-page.html, la-vidro-page.html, la-pet-page.html, manta-termica.html
  - Portas/Rodapés: kit-porta-correr.html, rodapes.html
- Layout de todas as páginas unificado mantendo identidade visual consistente
- Breadcrumbs atualizados com categorias corretas (Forros, Divisórias, Isolamentos)
- Formulários de orçamento personalizados por produto com integração WhatsApp

### Fixed
- Páginas com layout inconsistente agora seguem o mesmo padrão visual
- Headers e footers hardcoded removidos, substituídos por carregamento dinâmico
- Estrutura CSS padronizada eliminando duplicação de estilos

## [Unreleased]
### Added
- *(Futuras features)*

### Changed
- *(Futuras alterações)*

### Fixed
- *(Futuros bugs)*

---

# 🧩 Claude Automation Notes
Uso interno do Claude Code:
- Toda tarefa deve gerar uma nova nota aqui, incluindo:
  - número da tarefa
  - arquivos alterados
  - resumo técnico
  - link do commit (quando publicado no GitHub)

*(Claude preenche automaticamente, nunca o usuário)*

---

# 📎 Guia rápido para novos registros

### Exemplo de registro futuro
```markdown
## [0.0.4] – 2025-02-11
### Added
- Página Settings.jsx implementada com formulários para telefones, redes sociais e endereço.

### Fixed
- Bug no header.component: carregamento duplicado resolvido.

### Changed
- Atualizado build-static-pages.js para suportar templates dinâmicos.
```

---

**Mantido por:** Claude Code Assistant
**Projeto:** Planac Distribuidora - Sistema CMS V3
