# AGENTS.md — Atlas da Formação do Brasil

Este repositório utiliza uma arquitetura de **4 agentes especializados** para separar arquitetura, curadoria histórica, implementação técnica e qualidade/versionamento.

## Estrutura de Agentes

1. **`planejamento` (Planejamento & Arquitetura)**
   - **Escopo:** Quebra de etapas, definição de contratos TypeScript (`src/types/`), arquitetura de componentes e critérios de aceite.
   - **Permissões:** Somente leitura (não altera código diretamente).

2. **`pesquisa-historica` (Pesquisa Histórica & Curadoria)**
   - **Escopo:** Curadoria e manutenção dos dados em `src/data/` (21 marcos históricos entre Colônia, Império e República, lentes teóricas de Sérgio Buarque de Holanda e Darcy Ribeiro, Os 5 Brasis e Fios de Continuidade).
   - **Diretriz:** Rigor conceitual em *Raízes do Brasil* e *O Povo Brasileiro*, sem citações inventadas, coordenadas `[lon, lat]` precisas no território brasileiro e conexões claras com o Brasil contemporâneo.

3. **`codigo` (Desenvolvimento Frontend & Cartografia)**
   - **Escopo:** Setup Vite + React + TypeScript + Tailwind CSS + `d3-geo` / `topojson-client`, mapa vetorial SVG, camadas por Era e 5 Brasis, linha do tempo, painel lateral editorial e testes unitários (`vitest`).
   - **Diretriz:** Estética Editorial Cartográfica Contemporânea (papel pergaminho `#F7F3E9`, tinta `#1E242B`, terracota `#B85336`, verde-mata `#2F5D50`, azul-índigo `#2B4570`). Não executa commits Git.

4. **`review-git` (Review, QA & Controle de Versão)**
   - **Escopo:** Revisão de `git diff`, execução de `npm run build` e `npm test`, auditoria de integridade dos dados históricos, manutenção de `.gitignore` e commits atômicos no padrão Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
   - **Diretriz:** Só executa `git push` mediante solicitação explícita.

## Fluxo de Trabalho Padrão

```text
planejamento ──► pesquisa-historica ──► codigo ──► review-git
```
