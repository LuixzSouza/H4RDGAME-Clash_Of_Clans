# ⚔️ H4RD G4ME Manager

> **Sistema de Gestão Tática e Financeira para Clãs de Clash of Clans.**

O **H4RD G4ME Manager** é um painel administrativo completo desenvolvido para profissionalizar a gestão do clã. Ele centraliza dados dos membros, controla o fluxo de caixa (doações/eventos), gerencia avisos de guerra e padroniza a comunicação externa.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_14-black?style=for-the-badge)

---

## 📸 Visão Geral

O sistema foi projetado com uma estética **"Dark/Gamer/Militar"**, focada na usabilidade para líderes e na transparência para membros.

### Principais Módulos

#### 1. 🏠 Quartel General (Dashboard)
- **Visão Macro:** Estatísticas em tempo real de membros, status de guerra (Verde/Vermelho) e tesouraria.
- **Feed de Atividades:** Log detalhado de ações (pagamentos, expulsões, recrutamento).
- **Cards de Identidade:** Para membros, exibe status pessoal. Para líderes, exibe atalhos de comando.

#### 2. 👥 Gestão de Membros
- **Sincronização via API:** Conexão direta com a API do Clash of Clans para puxar dados atualizados (Troféus, TH, Liga).
- **Controle de Cargos:** Sistema de hierarquia (Líder, Colíder, Ancião, Membro).
- **Detector de Inatividade:** Monitora quem não ataca ou não doa.

#### 3. 💰 Tesouraria (Financeiro 2.0)
- **Múltiplos Eventos:** Suporte para Vaquinhas, Rifas, Bolões e Skins.
- **Gamificação:** Ranking de "Top Apoiador" e barra de progresso visual (estilo loot).
- **Transparência:** Histórico de quem pagou e quanto falta para a meta.

#### 4. 📢 Centro de Comunicação (Ferramentas)
- **Gerador de Comandos:** Cria mensagens padronizadas para WhatsApp/Discord.
- **Templates Inteligentes:**
  - ⚔️ Chamadas de Guerra (Início / Última hora).
  - 🏰 Avisos da Capital do Clã.
  - 🤝 Pedidos de Doação.
  - 📢 Anúncios de Recrutamento.
- **Variáveis Dinâmicas:** Preenchimento automático de Data, Hora e Responsável.

#### 5. 🗓️ Mural & Eventos
- **Calendário Tático:** Avisos visuais com contagem regressiva (Timer).
- **Check-in:** Botão para membros marcarem "Ciente" ou "Presença".

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza o que há de mais moderno no ecossistema React/Next.js:

- **Frontend:**
  - [Next.js 14/15](https://nextjs.org/) (App Router)
  - [React](https://react.dev/)
  - [Tailwind CSS](https://tailwindcss.com/) (Estilização)
  - [Shadcn/ui](https://ui.shadcn.com/) (Componentes de UI Reutilizáveis)
  - [Lucide React](https://lucide.dev/) (Ícones)
  - [Framer Motion](https://www.framer.com/motion/) (Animações suaves)

- **Backend & Dados:**
  - **Server Actions:** Para mutações de dados seguras sem API routes tradicionais.
  - **Prisma ORM:** Gerenciamento do banco de dados.
  - **SQLite:** Banco de dados local (pode ser migrado para PostgreSQL).
  - **Bcryptjs:** Hash e segurança de senhas.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado.
- Gerenciador de pacotes (npm, yarn ou pnpm).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/h4rdgame-manager.git](https://github.com/seu-usuario/h4rdgame-manager.git)
   cd h4rdgame-manager
   ```

2. **Instale as dependências:**
    ```bash
    npm install
    ```

3. **Configure as Variáveis de Ambiente:** Crie um arquivo .env na raiz do projeto e adicione:
    ```bash
    # Banco de Dados
    DATABASE_URL="file:./dev.db"

    # Clash of Clans API (Opcional para sync)
    COC_API_TOKEN="seu_token_aqui"
    ```

4. **Configure o Banco de Dados:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5. **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

## 🔐 Contas Padrão (Desenvolvimento)

Para o primeiro acesso, você pode precisar criar um usuário via Seed ou registrar manualmente no banco, mas o sistema possui uma trava de segurança para a tag #ADMIN.