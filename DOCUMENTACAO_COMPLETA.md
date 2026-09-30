# ⚡ ZapStore — Manual Técnico e Operacional Completo

> **Documentação Central de Arquitetura, Engenharia, Lojas Demos e Operação do Sistema**  
> Última atualização: 30 de Setembro de 2026

---

## 📌 1. Visão Geral da Plataforma

O **ZapStore** é uma plataforma SaaS *multi-tenant* moderna concebida para permitir que lojistas e prestadores de serviços de qualquer nicho (celulares/eletrônicos, concessionárias de veículos, infoprodutos digitais, lojas de roupas e vestuário, hamburguerias/delivery e imobiliárias de alto padrão) criem e gerenciem sua vitrine digital com checkout integrado e direto pelo **WhatsApp**.

A plataforma conta com:
- **Landing Page Institucional:** Apresentação da ferramenta, planos comerciais e vitrine de lojas demonstrativas com filtros por nicho.
- **Lojas Públicas Dinâmicas (`/[slug]` e `/[slug]/loja`):** Páginas personalizadas com logo, cores, catálogo, categorias, busca e botão de pedido formatado para o WhatsApp do lojista.
- **Painel do Lojista (`/dashboard`):** Gestão completa de catálogo (produtos, fotos em PNG recortado, especificações chave-valor), configurações de identidade, temas visuais com escopo isolado, dados de contato, SEO e avaliações.
- **Painel Administrativo (`/admin`):** Métricas consolidadas da plataforma (MRR, número de usuários ativos, total de produtos), moderação de lojistas e recurso de suporte direto ("Impersonate / Gerenciar Loja").

---

## 🌐 2. Ambientes, Links e Repositórios

| Recurso | Destino / URL |
| :--- | :--- |
| **Produção Oficial** | [https://zapstore-mu.vercel.app](https://zapstore-mu.vercel.app) |
| **Repositório GitHub (ZapStore)** | `https://github.com/cronosmkt-agency/zapstore.git` |
| **Repositório GitHub (TerePhones)**| `https://github.com/cronosmkt-agency/terephones.git` |
| **Diretório Local no Host** | `/home/zinma/Área de trabalho/Cronos/Projetos/Sites/projetos-gerados/terephones` |
| **Branch de Produção** | `main` |
| **Provedor de Deploy** | Vercel (CI/CD automático a cada push no Git) |

---

## 🛍️ 3. Lojas Demos Configuradas com Ativos Reais

Todas as 6 lojas demo contam com logotipos exclusivos (`/demos/logos/`), dados de contato personalizados e produtos reais com imagens em PNG com fundo recortado/transparente (`/demos/...`):

| Nicho | Loja Demo | Slug / URL da Home | Catálogo Completo |
| :--- | :--- | :--- | :--- |
| 📱 **Eletrônicos & Celulares** | **TerePhones** *(Loja Modelo)* | [/terephones](https://zapstore-mu.vercel.app/terephones) | [/terephones/loja](https://zapstore-mu.vercel.app/terephones/loja) |
| 🏎️ **Veículos & Concessionária** | **Prime Motors** | [/prime-motors](https://zapstore-mu.vercel.app/prime-motors) | [/prime-motors/loja](https://zapstore-mu.vercel.app/prime-motors/loja) |
| 💻 **Infoprodutos & Softwares** | **Nexus Digital** | [/nexus-digital](https://zapstore-mu.vercel.app/nexus-digital) | [/nexus-digital/loja](https://zapstore-mu.vercel.app/nexus-digital/loja) |
| 👕 **Moda & Streetwear** | **Aura Store** | [/aura-store](https://zapstore-mu.vercel.app/aura-store) | [/aura-store/loja](https://zapstore-mu.vercel.app/aura-store/loja) |
| 🍔 **Gastronomia & Hamburgueria** | **Craft Burger Art** | [/craft-burger](https://zapstore-mu.vercel.app/craft-burger) | [/craft-burger/loja](https://zapstore-mu.vercel.app/craft-burger/loja) |
| 🏡 **Imóveis de Alto Padrão** | **Alpha Imóveis Prime** | [/alpha-imoveis](https://zapstore-mu.vercel.app/alpha-imoveis) | [/alpha-imoveis/loja](https://zapstore-mu.vercel.app/alpha-imoveis/loja) |

---

## 🔑 4. Usuários e Credenciais de Demonstração

| Perfil | E-mail | Senha | Loja / Função |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@cronos.com` | `admin123` | Visão Global da Plataforma (`/admin`) + Suporte aos Lojistas |
| **TerePhones** | `terephones@example.com` | `tere123` | Loja Modelo de iPhones e Celulares (`/terephones`) |
| **Prime Motors** | `motors@example.com` | `motors123` | Concessionária de Veículos (`/prime-motors`) |
| **Nexus Digital** | `nexus@example.com` | `nexus123` | Plataforma de Cursos e Softwares (`/nexus-digital`) |
| **Aura Store** | `aura@example.com` | `aura123` | E-commerce de Vestuário Streetwear (`/aura-store`) |
| **Craft Burger** | `burger@example.com` | `burger123` | Hamburgueria Gourmet e Delivery (`/craft-burger`) |
| **Alpha Imóveis** | `imoveis@example.com` | `imoveis123` | Imobiliária de Alto Padrão (`/alpha-imoveis`) |
| **Lojista Teste** | `demo@example.com` | `demo123` | Loja Nova em Branco para Testes (`/demo`) |

---

## 💰 5. Matriz de Planos e Precificação

| Recurso | Grátis | Starter (R$ 19,99/mês) | Pro (R$ 49,99/mês) |
| :--- | :---: | :---: | :---: |
| **Limite de Produtos** | Até 10 | Até 50 | Ilimitado |
| **Fotos por Produto** | 1 imagem | Até 3 imagens | Até 5 imagens |
| **WhatsApp Flutuante** | Sim (Padrão) | Sim (Customizável) | Sim (Customizável) |
| **Chat ao Vivo Tawk.to** | Não | Não | Sim |
| **Paleta de Cores e Temas** | Padrão | Padrão | Personalização Completa |
| **Suporte** | Comunitário | Prioritário WhatsApp | VIP Exclusivo |

---

## 🛠️ 6. Stack Tecnológica e Arquitetura

- **Frontend & SSR:** React 19 + TanStack Start (`@tanstack/react-start`)
- **Roteamento:** TanStack React Router (`@tanstack/react-router`) com arquivos em `src/routes/`
- **Estilização:** Tailwind CSS v4 com design tokens e variáveis CSS dinâmicas
- **Componentes:** Radix UI + Lucide React + Sonner (toasts)
- **Persistência de Dados:** Camada reativa versionada (`src/lib/mockDb.ts`) com sincronização em LocalStorage, preparada para migração direta para Supabase / PostgreSQL
- **Formatadores e Regras de Negócio:**
  - `src/lib/auth.ts`: Sessões, login, signup e verificação de disponibilidade de slugs
  - `src/lib/planLimits.ts`: Validações de limites de produtos e imagens por plano
  - `src/lib/slugUtils.ts`: Sanitização e verificação de palavras reservadas para slugs
  - `src/context/AuthContext.tsx`: Contexto de autenticação global e atualização de sessão

---

## 📱 7. Responsividade e Correções de Interface (Web, Tablet e Mobile)

1. **Header do Lojista:**
   - Exibição de logo da loja, informações do usuário, badge do plano atual e menu rápido para sair ou abrir a loja pública em nova aba.
2. **Navegação Adaptável:**
   - Desktop: Barra lateral fixa com transparência e glassmorphism.
   - Mobile: Header compacto com menu de gaveta e barra inferior flutuante com abas de toque rápido.
3. **Formulário de Produtos e Configurações:**
   - Abas verticais/horizontais adaptadas com paddings consistentes para telas pequenas, médias e grandes.
   - Badges de destaque padronizados com altura e espaçamento homogêneo.
   - Upload de fotos aceita arquivos do computador (convertidos para data URL) ou URLs diretas.
4. **Isolamento de Temas (Black Piano / White):**
   - O tema ativado para a loja pública não contamina nem escurece os formulários internos do painel do lojista.

---

## 🚀 8. Comandos Úteis de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor local
npm run dev

# Checar tipagem TypeScript
npx tsc --noEmit

# Compilar projeto para produção
npm run build

# Enviar alterações para os repositórios remotos
git push zapstore main
git push origin main
```
