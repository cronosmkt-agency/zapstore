# Plano Mestre de Auditoria e Refatoração Mobile — ZapStore
**Plataforma:** ZapStore SaaS Multi-Lojas  
**Data:** 06 de Outubro de 2026  
**Dispositivos Alvo:** Smartphones Pequenos (iPhone SE 320px–375px), Smartphones Médios (390px–414px), Tablets (640px–768px) e Web

---

## 1. Diagnóstico Geral & Mapeamento de Bugs

### 📱 Print 1: Vitrine da Loja Pública (`/[slug]`)
* **Problema:** O botão flutuante do WhatsApp (`WhatsFloat`) fica posicionado diretamente sobre o selo "Compra Segura", cobrindo o conteúdo de confiança e bloqueando cliques.
* **Causa Raiz:** `WhatsFloat.tsx` posicionado fixo em `bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3.5` sem margem segura ou recuo na grade de selos no mobile.
* **Solução:** 
  1. Adicionar margem de segurança no container de selos (`mb-4 sm:mb-0`).
  2. Reduzir o diâmetro do botão flutuante em telas ultracompactas (`< 380px`) para não invadir a área central dos selos.
  3. Garantir espaçamento entre a barra inferior fixa (`MobileBottomNav`) e o conteúdo da página.

---

### 📱 Print 2: Landing Page da Plataforma (`/`)
* **Problema:** Vazamento horizontal crítico (`overflow-x`). O conteúdo do Hero ("Crie sua loja online e venda no WhatsApp") é empurrado para a esquerda e cortado. Pílulas de nicho e badges quebram a largura.
* **Causa Raiz:** O cabeçalho mobile em `src/routes/index.tsx` tenta renderizar em uma única linha: Logo (~140px) + Switch de Tema (~66px) + "Entrar" (~70px) + "Criar Loja" (~115px) + Botão Hamburguer (~36px) = ~460px de largura mínima! Em telas de 320px a 390px, isso força o documento a esticar para 460px, gerando barra de rolagem horizontal invisível que desloca a tela.
* **Solução:**
  1. No header mobile (`< sm` e `< md`), ocultar os botões de texto "Entrar" e "Criar Loja" da barra superior. Eles já pertencem ao menu gaveta dropdown e serão adicionados à nova barra de navegação inferior mobile.
  2. No topo mobile, exibir apenas: **Logo ZapStore** + **Switch Neumórfico de Tema** + **Botão Hamburguer**.
  3. Aplicar `overflow-x-hidden` no wrapper principal da página e `w-full max-w-full`.
  4. Permitir rolagem horizontal limpa nas pílulas de nicho (`overflow-x-auto scrollbar-none`).

---

### 📱 Print 3: Painel do Lojista (`/dashboard`)
* **Problema 1:** No cabeçalho mobile, os controles ficam espremidos e o nome da loja é cortado ("Craft Burger (Gas...").
* **Problema 2:** No Card "Link da Sua Loja Online", a badge "PRONTA PARA VENDER" é cortada como "PRONTA PARA VEN...", a URL transborda a largura do card, e os 3 botões ("Copiar Link", "Abrir", "Divulgar no Zap") ficam espremidos na mesma linha.
* **Causa Raiz:**
  - Falta de `flex-wrap` no título do card e ausência de `min-w-0` no container de texto da URL.
  - Botões com larguras fixas tentando dividir 280px em telas pequenas.
* **Solução:**
  1. Tornar o cabeçalho do card flexível com quebra elegante: Título na linha 1, Badge na linha 2 em telas `< 380px`.
  2. URL com `truncate w-full min-w-0 font-mono text-xs`.
  3. No mobile, organizar os botões de ação em grid responsivo de 2 colunas: `[Copiar Link]` e `[Divulgar no Zap]` com largura total, e ícone de abrir link integrado.
  4. Melhorar o header mobile do dashboard para priorizar a identificação da loja.

---

### 📱 Print 4: Rodapé / Barra de Navegação Inferior (`MobileBottomNav`)
* **Problema:** No iPhone SE (320px), o 5º item da barra de navegação ("Planos") é cortado na borda direita como "P...".
* **Problema Reportado pelo Usuário:** *"o footer com icons e paginas na pagina inicio ele ta ficando diferente e ficando no fundo da tela"*.
  - Na Landing Page (`/`), não existia barra de navegação inferior com ícones; havia apenas o footer de rodapé estático lá no fim do scroll longo ("no fundo da tela").
  - Nas lojas e no dashboard, as barras possuíam estilos e comportamentos divergentes (`sm:hidden` vs `md:hidden`, rótulos longos vs curtos).
* **Causa Raiz:**
  - Uso de `flex justify-around` com padding `px-2.5` e palavras longas ("Configurações" e "Avaliações") em 320px de tela.
  - Inconsistência de breakpoints (`sm:hidden` na vitrine, `md:hidden` no dashboard).
* **Solução:**
  1. Converter a barra de navegação do dashboard para `grid grid-cols-5 w-full`, garantindo exatamente 20% da largura para cada aba.
  2. Usar rótulos compactos no mobile: `Início`, `Produtos`, `Ajustes`, `Reviews`, `Planos`.
  3. Implementar a barra de navegação inferior mobile também na **Landing Page** (`/`):
     - Abas: `Início`, `Demos`, `Planos`, `Entrar`, `Criar Loja` (com botão destacado de alta conversão).
  4. Padronizar o breakpoint para `md:hidden` em todas as barras de navegação mobile.
  5. Adicionar `pb-24` em todas as páginas para garantir que o conteúdo e os rodapés estáticos nunca fiquem escondidos sob a barra fixa.

---

## 2. Roteiro de Implementação

| Fase | Arquivo Alvo | Ação |
|---|---|---|
| **Fase 1** | `src/routes/index.tsx` | Eliminar vazamento horizontal do header; adicionar MobileBottomNav na Landing Page; ajustar espaçamento do Hero e rodapé. |
| **Fase 2** | `src/routes/dashboard.tsx` | Redesenhar o `MobileBottomNav` do painel com `grid grid-cols-5` e labels compactos; otimizar o header mobile. |
| **Fase 3** | `src/routes/dashboard/index.tsx` | Corrigir Card de Link da Loja (badge quebrando sem cortar, URL truncada limpa, botões empilhados/grid). |
| **Fase 4** | `src/components/WhatsFloat.tsx` & `src/routes/$slug/index.tsx` | Reposicionar botão flutuante e adicionar respiro inferior nos badges de confiança. |
| **Fase 5** | `src/components/MobileBottomNav.tsx` & `src/components/SiteNavbar.tsx` | Harmonizar `md:hidden` em toda a plataforma e unificar identidade visual. |
| **Fase 6** | `src/routes/dashboard/configuracoes.tsx` & Produtos | Corrigir bug de `space-y-1` na barra horizontal de abas das configurações. |
| **Fase 7** | Verificação Global | Testar em iPhone SE (320px), iPhone 14 (390px), iPad (768px) e compilar build sem erros. |
