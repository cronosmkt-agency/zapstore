# ⚡ ZapStore — Plataforma SaaS Multi-Lojas com Vendas Diretas pelo WhatsApp

> **Crie sua loja online personalizada em minutos para qualquer nicho e receba pedidos organizados diretamente no seu WhatsApp.**

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://zapstore-mu.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/cronosmkt-agency/zapstore)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌐 Links Rápidos de Produção

- **Landing Page Oficial da ZapStore:** [https://zapstore-mu.vercel.app](https://zapstore-mu.vercel.app)
- **Repositório Oficial no GitHub:** [https://github.com/cronosmkt-agency/zapstore](https://github.com/cronosmkt-agency/zapstore)
- **Acesso ao Painel do Lojista:** [https://zapstore-mu.vercel.app/login](https://zapstore-mu.vercel.app/login)
- **Cadastro de Nova Loja:** [https://zapstore-mu.vercel.app/signup](https://zapstore-mu.vercel.app/signup)

---

## 🛍️ Lojas Demos Interativas (6 Nichos)

A plataforma ZapStore foi projetada para vender **qualquer tipo de produto ou serviço**. Cada loja possui seu próprio subdomínio/rota dinâmica (`/[slug]`), identidade visual isolada, catálogo de produtos com imagens recortadas sem fundo (PNG transparente), categorias e botão de checkout direto para o WhatsApp do lojista:

| Nicho | Loja Demo | Slug / URL da Home | Catálogo Completo |
| :--- | :--- | :--- | :--- |
| 📱 **Eletrônicos & iPhones** | **TerePhones** *(Loja Modelo)* | [/terephones](https://zapstore-mu.vercel.app/terephones) | [/terephones/loja](https://zapstore-mu.vercel.app/terephones/loja) |
| 🏎️ **Veículos & Concessionária** | **Prime Motors** | [/prime-motors](https://zapstore-mu.vercel.app/prime-motors) | [/prime-motors/loja](https://zapstore-mu.vercel.app/prime-motors/loja) |
| 💻 **Infoprodutos & Softwares** | **Nexus Digital** | [/nexus-digital](https://zapstore-mu.vercel.app/nexus-digital) | [/nexus-digital/loja](https://zapstore-mu.vercel.app/nexus-digital/loja) |
| 👕 **Moda & Streetwear** | **Aura Store** | [/aura-store](https://zapstore-mu.vercel.app/aura-store) | [/aura-store/loja](https://zapstore-mu.vercel.app/aura-store/loja) |
| 🍔 **Gastronomia & Delivery** | **Craft Burger Art** | [/craft-burger](https://zapstore-mu.vercel.app/craft-burger) | [/craft-burger/loja](https://zapstore-mu.vercel.app/craft-burger/loja) |
| 🏡 **Imóveis & Alto Padrão** | **Alpha Imóveis Prime** | [/alpha-imoveis](https://zapstore-mu.vercel.app/alpha-imoveis) | [/alpha-imoveis/loja](https://zapstore-mu.vercel.app/alpha-imoveis/loja) |

---

## 🔑 Contas de Demonstração para Testes

Todas as contas abaixo já vêm pré-configuradas no banco de dados local com estoques e configurações completas:

| Função / Perfil | E-mail | Senha | Loja Vinculada | Permissões |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `admin@cronos.com` | `admin123` | Nenhuma (Visão Global) | Acesso ao `/admin`, impersonar qualquer lojista, ver métricas e MRR |
| 📱 **TerePhones** | `terephones@example.com` | `tere123` | `/terephones` | Painel Lojista Completo (Plano Pro) |
| 🏎️ **Prime Motors** | `motors@example.com` | `motors123` | `/prime-motors` | Painel Lojista Completo (Plano Pro) |
| 💻 **Nexus Digital** | `nexus@example.com` | `nexus123` | `/nexus-digital` | Painel Lojista Completo (Plano Starter) |
| 👕 **Aura Store** | `aura@example.com` | `aura123` | `/aura-store` | Painel Lojista Completo (Plano Pro) |
| 🍔 **Craft Burger** | `burger@example.com` | `burger123` | `/craft-burger` | Painel Lojista Completo (Plano Starter) |
| 🏡 **Alpha Imóveis** | `imoveis@example.com` | `imoveis123` | `/alpha-imoveis` | Painel Lojista Completo (Plano Pro) |
| 👤 **Usuário Teste** | `demo@example.com` | `demo123` | `/demo` | Loja teste em branco (Plano Grátis) |

---

## 💎 Planos Oficiais ZapStore

O modelo de monetização foi padronizado em 3 opções diretas e acessíveis:

1. **Grátis — R$ 0,00:**
   - Até 10 produtos cadastrados
   - 1 imagem por produto
   - Pedidos no WhatsApp
   - Suporte padrão comunitário

2. **Starter — R$ 19,99 / mês:**
   - Até 50 produtos cadastrados
   - Até 3 imagens por produto
   - Botão flutuante do WhatsApp customizado
   - Suporte prioritário via WhatsApp
   - Badges e destaques promocionais

3. **Pro — R$ 49,99 / mês:**
   - Produtos ilimitados
   - Até 5 imagens por produto em alta resolução
   - Chat ao vivo integrado (Tawk.to)
   - Paleta de cores e temas 100% personalizados
   - Suporte VIP exclusivo e relatórios

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Framework Web** | **TanStack Start** (`@tanstack/react-start`) | SSR de alta performance com hidratação rápida em SPA. |
| **Roteamento** | **TanStack React Router** (`@tanstack/react-router`) | Roteamento baseado em arquivos com tipagem estática rigorosa. |
| **Linguagem & UI** | **React 19** + **TypeScript** | Código robusto com tipagem forte e componentes acessíveis. |
| **Estilização** | **Tailwind CSS v4** | Design responsivo para Web, Tablet e Mobile com design tokens modernos. |
| **Componentes Base** | **Radix UI** + **Lucide React** | Primitivas acessíveis e ícones minimalistas em SVG. |
| **Feedback Visual** | **Sonner** | Toasts elegantes e não obstrutivos para confirmações de ações. |
| **Banco de Dados** | **MockDb Reativo (LocalStorage / Memory)** | Persistência cliente/servidor com versionamento de schema (`DB_VERSION`). Pronto para integração direta com Supabase/PostgreSQL. |
| **Hospedagem & CI/CD**| **Vercel** | Build automático a cada commit na branch `main`. |

---

## 🚀 Funcionalidades Principais Implementadas

### 1. Landing Page Oficial (`/`)
- Hero moderno com proposta de valor clara e pílulas de navegação rápida para nichos.
- **Showcase Interativo de Lojas Demos (`#lojas-demo`):**
  - Abas de filtros interativos por segmento (*Todas*, *iPhones*, *Carros*, *Infoprodutos*, *Moda*, *Burgers*, *Imóveis*).
  - Cards detalhados com logo oficial, proposta de valor, lista de produtos em destaque e botões de acesso direto (**"Ver Loja"** e **"Catálogo"**).
- Tabela de preços clara com os 3 planos oficiais.
- Sessão de benefícios, FAQ e rodapé institucional.

### 2. Rotas Dinâmicas de Lojas Públicas (`/$slug` e `/$slug/loja`)
- **Página Inicial da Loja (`/$slug`):**
  - Navbar dinâmica com logo do lojista, link para o catálogo e WhatsApp.
  - Hero personalizado com título, subtítulo e CTA do próprio lojista.
  - Seção de "Mais Pedidos / Destaques" com cards de produtos.
  - Seção de Diferenciais competitivos (entrega rápida, garantia, etc.).
  - Seção de Avaliações e Depoimentos de clientes.
  - Rodapé completo com redes sociais, endereço e horários de funcionamento.
  - Botão flutuante do WhatsApp com mensagem pronta configurável.
  - Widget opcional do Tawk.to para chat em tempo real.
- **Catálogo de Produtos (`/$slug/loja`):**
  - Filtro dinâmico por categorias criadas pelo lojista.
  - Campo de busca instantânea por nome ou especificações.
  - Alternador de visualização (Modo Grade vs. Vitrine).
  - Modal de Ficha Técnica Detalhada do produto com fotos reais e especificações completas.
  - Botão "Pedir no WhatsApp" que codifica o pedido detalhado com nome, valor e especificações na URL do WhatsApp.

### 3. Painel do Lojista (`/dashboard`)
- **Header Responsivo Aprimorado:**
  - Exibição da logo da loja e avatar do usuário.
  - Informações de perfil, e-mail e badge do plano atual.
  - Menu suspenso com atalho para a loja pública e botão de logout ("Sair").
- **Design 100% Responsivo:**
  - Sidebar em desktop com efeito glassmorphism.
  - Header fixo com drawer e barra de navegação ergonômica inferior no mobile.
- **Gestão de Produtos (`/dashboard/produtos`):**
  - Listagem com busca, status de estoque, preços e miniaturas.
  - Badges de destaque alinhados horizontal e verticalmente.
  - Formulário de cadastro/edição com 4 abas estruturadas (Básico, Preços/Estoque, Upload de Imagens locais/URL, Especificações Chave-Valor dinâmicas).
- **Configurações Gerais (`/dashboard/configuracoes`):**
  - 5 Abas: Identidade (Nome, Slogan, Logo, Favicon), Visual (Temas White, Black Piano e Cores Personalizadas), Contato (WhatsApp com máscara, Telefones, Endereço, Redes), SEO (Meta Tags, OG Image, Google Preview) e Integrações (WhatsApp Flutuante, Tawk.to, Modo Escuro).
  - **Correção de Escopo de Tema:** O tema escuro/black piano ativado na loja não quebra nem polui o painel administrativo do lojista.
- **Avaliações (`/dashboard/avaliacoes`):**
  - Moderação de depoimentos de clientes (visibilidade, edição e exclusão).
- **Planos (`/dashboard/planos`):**
  - Visualização do plano ativo e comparativo dos planos Grátis, Starter e Pro.

### 4. Painel Administrativo Master (`/admin`)
- Restrito exclusivamente a usuários administradores (`session.is_admin === true`).
- Não vincula loja própria ao admin: visão 100% focada na governança da plataforma.
- **Recurso de Suporte Técnico / Impersonação de Lojista:**
  - O Admin pode acessar as configurações e gerenciar a loja de qualquer cliente com um clique para sanar dúvidas ou prestar suporte direto.
- Dashboard de KPIs com Total de Lojistas, Lojistas Ativos, Faturamento Estimado (MRR) e Total de Produtos cadastrados.
- Listagem geral de usuários com filtros por plano e status de ativação.

### 5. Ativos Reais em PNG com Fundo Transparente (`public/demos/`)
- Criação e padronização de imagens locais em PNG transparente sem fundo para todos os produtos das 5 lojas secundárias:
  - `public/demos/cars/`: Corolla Cross, Compass, BMW 320i, Civic Touring, Hilux SRX.
  - `public/demos/digital/`: Packs 3D para Tráfego Pago, Notion OS, IA WhatsApp Bot, Mentoria 100k, Copywriting.
  - `public/demos/fashion/`: Camiseta Oversized, Moletom Acid Wash, Calça Cargo, Corta-Vento, Boné Vintage.
  - `public/demos/food/`: Bacon Supremo, Truffle Gorgonzola, Double Smash Monster, Batata Rústica, Milkshake Nutella.
  - `public/demos/realestate/`: Casa Alphaville, Cobertura Frente Mar, Apartamento Decorado, Mansão Neoclássica.
- Criação de logos e favicons dedicados para cada marca em `public/demos/logos/`.

---

## 📁 Estrutura de Diretórios do Projeto

```text
terephones/
├── public/
│   ├── demos/
│   │   ├── cars/                # PNGs recortados de veículos
│   │   ├── digital/             # PNGs 3D de infoprodutos
│   │   ├── fashion/             # PNGs de peças de vestuário
│   │   ├── food/                # PNGs de hambúrgueres e porções
│   │   ├── logos/               # Logotipos PNG das lojas demo
│   │   └── realestate/          # PNGs arquitetônicos de imóveis
│   ├── iphones/                 # Fotos reais dos aparelhos Apple
│   └── favicon.ico / logo.png   # Ativos gerais
├── src/
│   ├── components/              # Componentes de interface compartilhados
│   │   ├── ui/                  # Primitivas shadcn/ui (button, dialog, tabs, card...)
│   │   ├── BrandLogo.tsx        # Logotipo adaptável
│   │   ├── ProductDetailModal.tsx # Modal de ficha técnica do produto
│   │   ├── SiteNavbar.tsx       # Navbar principal
│   │   ├── SiteFooter.tsx       # Rodapé principal
│   │   ├── WhatsFloat.tsx       # Botão flutuante do WhatsApp
│   │   └── MobileBottomNav.tsx  # Navegação mobile ergonômica
│   ├── context/
│   │   └── AuthContext.tsx      # Gerenciador de sessão e autenticação
│   ├── lib/
│   │   ├── auth.ts              # Funções de login, signup e verificação de slug
│   │   ├── mockDb.ts            # Banco de dados reativo com dados iniciais (Seed)
│   │   ├── planLimits.ts        # Regras de limite de produtos e imagens por plano
│   │   └── slugUtils.ts         # Sanitização e validação de slugs de lojas
│   ├── routes/
│   │   ├── __root.tsx           # Layout raiz com providers globais
│   │   ├── index.tsx            # Landing Page oficial com vitrine de demos
│   │   ├── login.tsx            # Página de autenticação
│   │   ├── signup.tsx           # Cadastro em 3 etapas de nova loja
│   │   ├── admin.tsx            # Layout protegido do administrador
│   │   ├── admin/               # Rotas do admin (index, usuarios, planos, metricas)
│   │   ├── dashboard.tsx        # Layout protegido do painel do lojista
│   │   ├── dashboard/           # Rotas do lojista (index, produtos, configuracoes, avaliacoes, planos)
│   │   ├── $slug.tsx            # Layout dinâmico da loja pública
│   │   ├── $slug/index.tsx      # Home da loja do lojista
│   │   └── $slug/loja.tsx       # Catálogo de produtos da loja do lojista
│   ├── styles.css               # Design tokens, temas e classes Tailwind v4
│   └── types/index.ts           # Interfaces TypeScript completas
├── package.json
├── vite.config.ts
└── README.md                    # [Este arquivo]
```

---

## 💻 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/cronosmkt-agency/zapstore.git
   cd zapstore
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   - Aplicação: `http://localhost:3000` (ou porta informada no terminal)

5. **Compilação para Produção:**
   ```bash
   npm run build
   ```

---

## 🚀 Publicação & Deploy Contínuo

O projeto conta com deploy contínuo integrado à **Vercel**:
- Todo `git push zapstore main` dispara uma compilação automática na Vercel.
- O site entra em produção em menos de 30 segundos com CDN global ativo.

---

© 2026 **ZapStore** — Desenvolvido por [Cronos Marketing & Tech](https://github.com/cronosmkt-agency). Todos os direitos reservados.
