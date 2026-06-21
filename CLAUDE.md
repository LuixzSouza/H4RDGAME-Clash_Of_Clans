# CLAUDE.md

Guia para agentes de IA trabalharem neste repositório. Leia antes de editar.

## O que é

**H4RD G4ME - Clash Manager**: painel web privado do clã *H4RD G4ME* (Clash of Clans).
Serve para o clã salvar e consultar informações úteis: membros, guerra, tesouraria,
layouts de base (Fortaleza), estratégias (Laboratório), eventos e ferramentas.

Idioma do produto e do código (comentários, labels, mensagens): **Português (pt-BR)**.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config via `@theme` em CSS, sem `tailwind.config.js`)
- **Prisma 5** + **PostgreSQL** (`DATABASE_URL` no ambiente)
- **Radix UI** + componentes estilo **shadcn/ui** em `src/components/ui`
- **lucide-react** para ícones
- Autenticação **caseira** por cookie de sessão (NÃO usa NextAuth apesar da dep instalada)
- `bcryptjs` para hash de senha

## Comandos

```bash
npm run dev        # roda o seed (prisma/seed.ts) e sobe o next dev
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # eslint
npm run db:reset   # prisma migrate reset --force + re-seed (APAGA o banco)
```

> `npm run dev` executa `prisma/seed.ts` automaticamente antes de subir.

## Arquitetura

```
src/
  app/
    page.tsx                 # Landing page pública (Navbar, Hero, etc.)
    login/page.tsx           # Login
    layout.tsx               # Root layout (fontes, <body>)
    globals.css              # Tema, tokens de cor (oklch), classes utilitárias .btn-clash etc.
    actions.ts               # Server actions globais: login/logout/getCurrentUser/log/seed
    dashboard/
      layout.tsx             # Shell do app: sidebar + topbar (client component)
      page.tsx               # Visão geral (dashboard)
      <secao>/
        page.tsx             # Página da seção (membros, guerra, financeiro, etc.)
        actions.ts           # Server actions daquela seção (CRUD via Prisma)
  components/
    ui/                      # Primitivos shadcn (button, card, dialog, badge, ...)
    <secao>/                 # Componentes de cada seção do dashboard
    landing/                 # Componentes da landing pública
  lib/
    prisma.ts                # Singleton do Prisma Client
    utils.ts                 # cn() (clsx + tailwind-merge)
    coc.ts                   # Helpers de domínio Clash of Clans
prisma/
  schema.prisma              # Modelos: Member, FinanceEvent, War, Attack, Strategy, Layout...
  seed.ts                    # Popula dados iniciais
```

### Seções do dashboard
`membros`, `guerra`, `financeiro` (Tesouraria), `fortaleza` (layouts de base),
`laboratorio` (estratégias), `eventos`, `ferramentas`, `perfil`.

## Convenções

- **Import alias**: `@/` → `src/` (ex.: `@/components/ui/button`, `@/lib/utils`).
- **Server actions**: arquivos `actions.ts` com `"use server"` no topo. Cada seção tem o seu.
  Toda mutação relevante deve gerar log via `createLog(action, details, memberId?)` (`src/app/actions.ts`).
- **Client components**: páginas interativas usam `"use client"` e buscam dados via server
  actions dentro de `useEffect` (ex.: `dashboard/page.tsx`). Não há fetch HTTP interno.
- **Auth/sessão**: cookie `h4rdgame_session` guarda o `member.id`. Use `getCurrentUser()`
  para obter o usuário logado. Papéis: `LIDER`, `COLIDER`, `ANCIAO`, `MEMBRO`
  (admin = `LIDER` ou `COLIDER`).
- **Estilização**: classes Tailwind. Tokens semânticos preferidos (`bg-card`, `text-primary`,
  `border-border`) definidos em `globals.css`. Componentes `ui/` usam esses tokens.
  Há também classes utilitárias custom: `.btn-clash`, `.btn-clash-green`, `.glass-panel`,
  `.card-clash`. Ver "Identidade visual" abaixo.
- **Tipografia**: `--font-heading` (Titan_One, estilo logo Clash) para títulos;
  `--font-body` (Nunito) para texto.

## Identidade visual (em padronização)

Objetivo: deixar o visual **fiel ao tema oficial do Clash of Clans** (referência:
loja oficial `store.supercell.com` — fundo escuro, dourado como cor de ação, texto branco,
uso contido de cores). Hoje o sistema usa cores demais (azul, vermelho, verde, roxo, etc.)
de forma inconsistente entre as seções.

Diretrizes ao criar/editar UI:
- **Cor de ação primária = dourado/âmbar** (token `--primary`). Evite introduzir paletas
  novas (purple/pink/cyan/teal/indigo...).
- Cores semânticas (verde = positivo/"IN", vermelho = perigo/"OUT") só quando carregam
  significado funcional — não como decoração.
- Prefira tokens (`bg-card`, `border-border`, `text-muted-foreground`) a hex hardcoded
  (`bg-[#1e202b]`). Hex espalhado é dívida a ser migrada para tokens.
- O app é **dark-first**. O modo claro existe nos tokens mas não é o foco.

> Esta seção reflete uma refatoração visual em andamento. Ao tocar num componente, migre-o
> para os tokens/dourado em vez de propagar o estilo antigo colorido.

## Cuidados

- `globals.css` mistura tokens (`@theme`), variáveis de tema claro/escuro e classes de
  componente. Mudanças de cor devem começar pelos tokens, não por overrides pontuais.
- `npm run db:reset` é destrutivo (apaga o banco). Confirme antes de rodar.
- Imagens/arte oficiais da Supercell são propriedade da Supercell. Replicar o **estilo**
  (cores, layout, fontes) é seguro; ao usar assets oficiais, prefira material de imprensa/
  brand permitido e mantenha como uso interno do clã.
