# 📘 README-CLAUDE.md – Instruções para IA trabalhar neste projeto

Este arquivo define **como QUALQUER IA (Claude, ChatGPT, etc.) deve atuar** neste repositório.

## 1. Antes de qualquer coisa

1. **Leia o arquivo `DOCUMENTACAO-AUDITORIA-PLANAC.md` na raiz.**
2. Considere esse arquivo como a **foto oficial do estado atual** do projeto.
3. NÃO assuma nada que contradiga essa documentação sem antes perguntar.

---

## 2. Regras obrigatórias de trabalho

### 2.1 Antes de escrever QUALQUER código

Você DEVE:

1. **Explicar o problema** que pretende resolver (em linguagem simples).
2. **Listar os arquivos** que pretende alterar (com caminho completo).
3. **Descrever, em 3–5 tópicos por arquivo**, o que será feito em cada um.

⬇️ **Depois disso, você DEVE PARAR e esperar o dono do projeto responder com "APROVADO".**

Sem "APROVADO", é proibido:

- Alterar arquivos
- Criar arquivos
- Deletar arquivos

### 2.2 Escopo das alterações

- Mantenha as alterações **pequenas e focadas**.
- Em uma mesma "rodada", altere **no máximo 3–5 arquivos**.
- Evite "refatorar o mundo" em uma única etapa.

### 2.3 Depois de alterar código

Você DEVE:

1. Mostrar um **resumo/diff textual** do que mudou (por arquivo).
2. Explicar **como testar**:
   - Qual página abrir (URL ou caminho local).
   - O que observar para validar que está funcionando.

### 2.4 Proibições

Você **NÃO PODE**:

- Remover funcionalidades existentes sem:
  - Explicar o impacto.
  - Propor uma alternativa.
  - Registrar isso na documentação ou no `CHANGELOG.md`.

---

## 3. Prioridades atuais do projeto

As prioridades técnicas estão detalhadas em `DOCUMENTACAO-AUDITORIA-PLANAC.md`.
Resumidamente, siga esta ORDEM:

1. **BUGS CRÍTICOS**
   - Corrigir o endpoint `/api/admin/media/replace`:
     - Parar de salvar JPG/PNG fingindo que é `.webp`.
   - Padronizar header/footer nas páginas de produto:
     - Remover `<header>` e `<footer>` colados.
     - Usar `<div id="header-container"></div>` e `<div id="footer-container"></div>` com `load-components.js`.

2. **Configurações globais / Admin**
   - Implementar uma tela real de **Configurações (Settings)** no admin.
   - Permitir editar:
     - Logo
     - Telefones / WhatsApp
     - Endereço
     - Redes sociais
     - Horário de funcionamento
     - Texto de rodapé

3. **SEO Essencial**
   - Garantir:
     - `<meta name="description">` na home.
     - `<link rel="canonical">` em TODAS as páginas.
     - `sitemap.xml`.
     - `robots.txt` apontando para o sitemap.

4. **Performance básica**
   - Deixar de prometer WebP se não estiver implementado de verdade.
   - Aplicar `loading="lazy"` onde couber.
   - Manter `fetchpriority="high"` apenas em imagens realmente críticas.

---

## 4. Atualização de documentação

Sempre que concluir uma mudança APROVADA, você DEVE:

1. Atualizar **pelo menos um**:
   - `DOCUMENTACAO-AUDITORIA-PLANAC.md` **ou**
   - `CHANGELOG.md`
2. Registrar:
   - O que foi feito.
   - Em quais arquivos.
   - Qual bug ou item de prioridade foi atendido.

---

## 5. Sobre "limpar" o projeto

⚠️ **NÃO APAGUE grandes blocos da raiz do projeto por conta própria.**

- Arquivos "feios" ou "legados" devem ser:
  - Movidos para pastas de legado (ex.: `arquivos-legados/`, `legacy-html/`),
  - E **nunca deletados sem autorização explícita**.

Se achar que algo deve ser apagado:

1. Explique por que pode ser deletado.
2. Liste exatamente quais arquivos/pastas.
3. Espere o dono do projeto escrever "APROVADO".

---

## 6. Formato de resposta esperado da IA

Sempre que for propor uma ação, a resposta deve seguir este formato:

1. **Contexto / Problema**
2. **Arquivos que pretendo alterar**
3. **O que vou fazer em cada arquivo (3–5 bullets)**
4. **Pausa para aprovação** (não escrever código ainda)

Depois de aprovado:

5. **Código / mudanças aplicadas**
6. **Resumo das mudanças (diff textual)**
7. **Como testar**
8. **Atualização de documentação (se aplicável)**

---

Se você (IA) não seguir este README, está trabalhando contra as regras do projeto.
