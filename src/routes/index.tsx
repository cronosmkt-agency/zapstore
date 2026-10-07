import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Smartphone,
  Shield,
  ShieldCheck,
  Layers,
  Store,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ExternalLink,
  Eye,
  Rocket,
  Clock,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  UserPlus,
  Package,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { ThemeToggleSwitch } from "@/components/SiteNavbar";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZapStore — Crie sua Loja Online e Venda no WhatsApp" },
      {
        name: "description",
        content:
          "Crie seu catálogo digital profissional em minutos. Cadastre produtos com fotos e preços e receba pedidos no WhatsApp. Sem comissões!",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string>("todos");

  const DEMO_STORES = [
    {
      id: "terephones",
      name: "Terephones",
      niche: "Celulares & Apple",
      nicheKey: "celulares",
      slug: "terephones",
      logo: "https://ik.imagekit.io/zinma/tr:w-300,f-auto,q-85/TerePhones-Logo.png",
      badge: "Loja Modelo Oficial",
      badgeColor: "bg-blue-500/15 text-blue-600 border-blue-500/25",
      description: "Catálogo completo com mais de 17 modelos de iPhones novos e seminovos, especificações técnicas detalhadas, saúde de bateria, garantia mundial Apple e pedido pronto no WhatsApp.",
      highlight: "iPhones 17 Pro Max, 16 Pro, 15 Pro",
      theme: "Modo White & Black",
    },
    {
      id: "prime-motors",
      name: "Prime Motors",
      niche: "Carros & Veículos",
      nicheKey: "veiculos",
      slug: "prime-motors",
      logo: "/demos/logos/prime-motors.png",
      badge: "Veículos & Seminovos",
      badgeColor: "bg-amber-500/15 text-amber-600 border-amber-500/25",
      description: "Showroom automotivo com fotos de estúdio sem fundo, quilometragem, ano, câmbio, motorização, laudo cautelar e simulação rápida de financiamento.",
      highlight: "Corolla Cross, Compass, BMW 320i, Hilux",
      theme: "Modo White",
    },
    {
      id: "nexus-digital",
      name: "Nexus Digital",
      niche: "Cursos & Infoprodutos",
      nicheKey: "digital",
      slug: "nexus-digital",
      logo: "/demos/logos/nexus-digital.png",
      badge: "Infoprodutos & IA",
      badgeColor: "bg-indigo-500/15 text-indigo-600 border-indigo-500/25",
      description: "Plataforma de infoprodutos com mockups 3D de alta conversão, formações de tráfego, dashboards no Notion, automações no WhatsApp com IA e mentorias VIP.",
      highlight: "Cursos, Notion OS & Agentes IA",
      theme: "Black Piano",
    },
    {
      id: "aura-store",
      name: "Aura Store",
      niche: "Moda & Streetwear",
      nicheKey: "moda",
      slug: "aura-store",
      logo: "/demos/logos/aura-store.png",
      badge: "Moda & Streetwear",
      badgeColor: "bg-pink-500/15 text-pink-600 border-pink-500/25",
      description: "E-commerce de moda com packshots de camisetas oversized 280g, moletons heavyweight 400g, calças cargo táticas e bonés com fotos em fundo limpo.",
      highlight: "Modelagens Oversized & Drop Limitado",
      theme: "Black Piano",
    },
    {
      id: "craft-burger",
      name: "Craft Burger",
      niche: "Gastronomia & Delivery",
      nicheKey: "gastronomia",
      slug: "craft-burger",
      logo: "/demos/logos/craft-burger.png",
      badge: "Hamburgueria na Brasa",
      badgeColor: "bg-orange-500/15 text-orange-600 border-orange-500/25",
      description: "Cardápio gastronômico com fotos apetitosas sem fundo de burgers artesanais na brasa, smash burgers, porções de batata rústica e milkshakes com pedido em 1 clique.",
      highlight: "Blends 100% Angus & Delivery 35min",
      theme: "Modo White",
    },
    {
      id: "alpha-imoveis",
      name: "Alpha Imóveis",
      niche: "Imobiliária",
      nicheKey: "imoveis",
      slug: "alpha-imoveis",
      logo: "/demos/logos/alpha-imoveis.png",
      badge: "Imóveis de Luxo",
      badgeColor: "bg-teal-500/15 text-teal-600 border-teal-500/25",
      description: "Portfólio de imóveis de alto padrão com fotos de casas em condomínio, coberturas vista mar e mansões exclusivas com agendamento de visita VIP.",
      highlight: "Casas em Condomínio & Coberturas",
      theme: "Modo White",
    },
  ];

  // Theme state: 'white' or 'black-piano'
  const [currentTheme, setCurrentTheme] = useState<"white" | "black-piano">("white");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("zapstore_landing_theme");
    const initial = saved === "black-piano" ? "black-piano" : "white";
    setCurrentTheme(initial);

    const root = document.documentElement;
    root.classList.remove("theme-white", "theme-black-piano", "dark");
    if (initial === "black-piano") {
      root.classList.add("theme-black-piano", "dark");
    } else {
      root.classList.add("theme-white");
    }
  }, []);

  const toggleTheme = () => {
    const next = currentTheme === "black-piano" ? "white" : "black-piano";
    setCurrentTheme(next);

    const root = document.documentElement;
    root.classList.remove("theme-white", "theme-black-piano", "dark");
    if (next === "black-piano") {
      root.classList.add("theme-black-piano", "dark");
    } else {
      root.classList.add("theme-white");
    }

    localStorage.setItem("zapstore_landing_theme", next);
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: next } }));
    toast.success(next === "black-piano" ? "Modo Black ativado" : "Modo Branco ativado", {
      id: "theme-toggle",
      duration: 1200,
    });
  };

  const isDark = currentTheme === "black-piano";

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Preciso pagar alguma comissão por venda?",
      a: "Não! O valor de cada venda é 100% seu. Nós não cobramos nenhuma porcentagem sobre os produtos vendidos. Todo o lucro fica diretamente com você.",
    },
    {
      q: "Como meus clientes realizam o pagamento?",
      a: "O pagamento é combinado diretamente entre você e seu cliente pelo WhatsApp (via PIX, cartão na entrega, link de pagamento ou dinheiro), dando total autonomia para sua loja.",
    },
    {
      q: "Como o pedido chega no meu WhatsApp?",
      a: "Quando o cliente clica em 'Pedir no WhatsApp', o sistema monta uma mensagem automática e organizada com o nome do produto, capacidade, preço e condição, pronta para você fechar a venda.",
    },
    {
      q: "Preciso de computador ou posso usar tudo pelo celular?",
      a: "Você faz 100% pelo celular! O painel do lojista e a vitrine dos seus clientes funcionam com perfeição no navegador do celular, sem precisar instalar aplicativos pesados.",
    },
    {
      q: "Posso usar meu próprio domínio (ex: loja.meunome.com.br)?",
      a: "Sim! No plano Pro você pode apontar o seu próprio domínio com certificado de segurança SSL gratuito, ou utilizar o seu link exclusivo sem custo adicional.",
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans overflow-x-hidden pb-20 md:pb-0 transition-colors duration-300 selection:bg-blue-600 selection:text-white ${
        isDark ? "bg-[#06080d] text-zinc-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ─── Top Glow Gradient ──────────────────────────────────── */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none z-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]"
        }`}
      />

      {/* ─── Navbar ────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          isDark
            ? "bg-[#06080d]/85 border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
            : "bg-white/90 border-slate-200/90 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <img
                src="/zapstore-logo.png"
                alt="ZapStore"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover transition-transform group-hover:scale-105 ${
                  isDark
                    ? "shadow-[0_0_15px_rgba(59,130,246,0.4)] ring-1 ring-blue-500/30"
                    : "shadow-md shadow-blue-500/20"
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-black text-lg sm:text-xl tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Zap<span className="text-blue-500">Store</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                SaaS WhatsApp
              </span>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold p-1 rounded-full border backdrop-blur-md ${
              isDark
                ? "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                : "bg-slate-100/80 border-slate-200/80 text-slate-600"
            }`}
          >
            <a
              href="#como-funciona"
              className="px-3 py-1.5 rounded-full hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition"
            >
              Como Funciona
            </a>
            <a
              href="#lojas-demo"
              className="px-3 py-1.5 rounded-full hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
            >
              <span>Lojas Demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </a>
            <a
              href="#vantagens"
              className="px-3 py-1.5 rounded-full hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition"
            >
              Vantagens
            </a>
            <a
              href="#planos"
              className="px-3 py-1.5 rounded-full hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition"
            >
              Planos
            </a>
            <a
              href="#faq"
              className="px-3 py-1.5 rounded-full hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition"
            >
              Dúvidas
            </a>
          </nav>

          {/* Right Action Bar (Theme Toggle + Auth Buttons) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Day/Night Neumorphic Slider Switch */}
            <div className="scale-75 sm:scale-85 origin-center">
              <ThemeToggleSwitch isDark={isDark} toggleTheme={toggleTheme} />
            </div>

            {/* Login button (desktop and tablet) */}
            <Link
              to="/login"
              className={`hidden sm:inline-flex px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border transition whitespace-nowrap shadow-2xs cursor-pointer ${
                isDark
                  ? "bg-zinc-900/80 border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-800 hover:border-zinc-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100/90"
              }`}
            >
              Entrar
            </Link>

            {/* Signup CTA button (desktop and tablet) */}
            <Link
              to="/signup"
              className="hidden sm:inline-flex px-3.5 sm:px-4.5 py-1.5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-[right_center] rounded-xl shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-[1.02] active:scale-[0.98] items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Criar Loja</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
              aria-label="Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden px-4 py-4 border-t space-y-2 animate-in slide-in-from-top-2 duration-200 ${
              isDark ? "bg-[#06080d]/95 border-zinc-800 text-zinc-200" : "bg-white/95 border-slate-200 text-slate-800"
            }`}
          >
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-semibold text-xs hover:bg-blue-500/10 hover:text-blue-500 transition"
            >
              Como Funciona
            </a>
            <a
              href="#lojas-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-semibold text-xs hover:bg-blue-500/10 hover:text-blue-500 transition flex items-center justify-between"
            >
              <span>Lojas Demo de Demonstração</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </a>
            <a
              href="#vantagens"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-semibold text-xs hover:bg-blue-500/10 hover:text-blue-500 transition"
            >
              Vantagens
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-semibold text-xs hover:bg-blue-500/10 hover:text-blue-500 transition"
            >
              Planos & Preços
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-semibold text-xs hover:bg-blue-500/10 hover:text-blue-500 transition"
            >
              Dúvidas Frequentes
            </a>

            {/* Quick Action Buttons in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-800/60 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center py-2.5 px-3 text-xs font-bold rounded-xl border text-center transition ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 px-3 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center shadow-xs transition"
              >
                Criar Loja &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── 1. HERO SECTION (Full Viewport Fold on Mobile) ─────── */}
      <section id="inicio" className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center py-6 sm:py-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 relative z-10 w-full my-auto">
          {/* Eyebrow Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border backdrop-blur-md transition-all shadow-xs ${
              isDark
                ? "bg-zinc-900/90 border-indigo-500/30 text-indigo-300"
                : "bg-blue-50/90 border-blue-200/90 text-blue-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap">Plataforma nº 1 de vendas no WhatsApp</span>
          </div>

          {/* Main Title */}
          <h1
            className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] sm:leading-[1.15] ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Crie sua loja online e{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              venda no WhatsApp.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xs sm:text-base max-w-lg mx-auto leading-relaxed font-normal ${
              isDark ? "text-zinc-300" : "text-slate-600"
            }`}
          >
            Cadastre seus produtos com fotos e preços, receba pedidos organizados no seu WhatsApp e fique com 100% do lucro. Sem intermediários e com 0% de comissão.
          </p>

          {/* High-Converting Action CTAs */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto py-3 sm:py-3.5 px-7 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>Criar Minha Loja Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#lojas-demo"
              className={`w-full sm:w-auto py-3 sm:py-3.5 px-6 rounded-full font-bold text-sm sm:text-base border shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80"
                  : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
              }`}
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Ver 6 Lojas Demos ao Vivo</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Quick Niche Pills */}
          <div className="w-full pt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Explore por nicho:
            </span>
            {[
              { key: "celulares", label: "📱 iPhones" },
              { key: "veiculos", label: "🏎️ Carros" },
              { key: "digital", label: "💻 Cursos/IA" },
              { key: "moda", label: "👕 Moda" },
              { key: "gastronomia", label: "🍔 Burgers" },
              { key: "imoveis", label: "🏡 Imóveis" },
            ].map((n) => (
              <a
                key={n.key}
                href="#lojas-demo"
                onClick={() => setSelectedNiche(n.key)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all hover:scale-105 cursor-pointer ${
                  selectedNiche === n.key
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : isDark
                    ? "bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 shadow-xs"
                }`}
              >
                {n.label}
              </a>
            ))}
          </div>

          {/* 4 Micro Trust Pills (2x2 Grid on Mobile, Flex on Desktop - matching minhaloja layout) */}
          <div className="w-full pt-2 sm:pt-4">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold">
              <div
                className={`flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isDark
                    ? "bg-zinc-900/80 border-zinc-800 text-zinc-300"
                    : "bg-white border-slate-200/80 text-slate-700 shadow-xs"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>No ar em 5 minutos</span>
              </div>

              <div
                className={`flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isDark
                    ? "bg-zinc-900/80 border-zinc-800 text-emerald-400 font-bold"
                    : "bg-white border-slate-200/80 text-emerald-600 font-bold shadow-xs"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>0% de comissão</span>
              </div>

              <div
                className={`flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isDark
                    ? "bg-zinc-900/80 border-zinc-800 text-zinc-300"
                    : "bg-white border-slate-200/80 text-slate-700 shadow-xs"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Sem cartão de crédito</span>
              </div>

              <div
                className={`flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isDark
                    ? "bg-zinc-900/80 border-zinc-800 text-zinc-300"
                    : "bg-white border-slate-200/80 text-slate-700 shadow-xs"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>100% pelo celular</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. COMO FUNCIONA (Passo a Passo Rápido) ─────────────── */}
      <section
        id="como-funciona"
        className={`py-12 sm:py-20 px-4 sm:px-6 border-y transition-colors duration-300 ${
          isDark ? "bg-zinc-900/40 border-zinc-800/60" : "bg-slate-100/70 border-slate-200"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Passo a Passo
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Como funciona o ZapStore?
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Em 3 passos rápidos você tem sua vitrine online pronta para fechar pedidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            {/* Step 1 */}
            <div
              className={`border rounded-2xl p-5 sm:p-6 relative transition-all group ${
                isDark
                  ? "bg-zinc-950/80 border-zinc-800 hover:border-indigo-500/40"
                  : "bg-white border-slate-200 shadow-sm hover:border-blue-400"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-600 font-black text-base mb-3 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3
                className={`text-base sm:text-lg font-bold mb-1.5 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Crie sua conta em 1 minuto
              </h3>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Escolha o nome da loja e defina seu link exclusivo (ex: <code className="text-blue-600 font-semibold">zapstore.com/sualoja</code>) e WhatsApp.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`border rounded-2xl p-5 sm:p-6 relative transition-all group ${
                isDark
                  ? "bg-zinc-950/80 border-zinc-800 hover:border-indigo-500/40"
                  : "bg-white border-slate-200 shadow-sm hover:border-blue-400"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-600 font-black text-base mb-3 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3
                className={`text-base sm:text-lg font-bold mb-1.5 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Cadastre seus produtos
              </h3>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Adicione fotos, preço à vista, opções de parcelamento, estoque e especificações técnicas de forma intuitiva.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`border rounded-2xl p-5 sm:p-6 relative transition-all group ${
                isDark
                  ? "bg-zinc-950/80 border-zinc-800 hover:border-indigo-500/40"
                  : "bg-white border-slate-200 shadow-sm hover:border-blue-400"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-600 font-black text-base mb-3 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3
                className={`text-base sm:text-lg font-bold mb-1.5 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Receba pedidos no WhatsApp
              </h3>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Coloque o link na bio do Instagram. O cliente clica no produto e o pedido chega pronto para você fechar a venda!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. LOJAS DEMO (Demonstração ao Vivo • 6 Nichos) ──────── */}
      <section id="lojas-demo" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Demonstrações Reais • 6 Nichos
            </span>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Veja como sua loja vai ficar
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Clique para navegar nas lojas reais de teste com fotos de estúdio sem fundo, especificações adaptadas e pedidos automáticos pelo WhatsApp.
            </p>
          </div>

          {/* Interactive Niche Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-8 sm:mb-10">
            {[
              { key: "todos", label: "Todas as Lojas (6)" },
              { key: "celulares", label: "📱 iPhones" },
              { key: "veiculos", label: "🏎️ Carros" },
              { key: "digital", label: "💻 Infoprodutos" },
              { key: "moda", label: "👕 Moda" },
              { key: "gastronomia", label: "🍔 Burgers" },
              { key: "imoveis", label: "🏡 Imóveis" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedNiche(tab.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedNiche === tab.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                    : isDark
                    ? "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 shadow-xs"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Demo Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
            {DEMO_STORES.filter(
              (s) => selectedNiche === "todos" || s.nicheKey === selectedNiche
            ).map((store) => (
              <div
                key={store.id}
                className={`border rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl group ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 hover:border-indigo-500/50"
                    : "bg-white border-slate-200 hover:border-blue-400"
                }`}
              >
                <div>
                  {/* Store Header: Logo + Title + Slug */}
                  <div className="flex items-start gap-3 mb-3.5">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${store.badgeColor}`}
                        >
                          {store.niche}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono truncate">
                          /{store.slug}
                        </span>
                      </div>
                      <h3
                        className={`text-base sm:text-lg font-black truncate ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {store.name}
                      </h3>
                    </div>
                  </div>

                  {/* Highlights tag */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold mb-3 ${
                      isDark ? "bg-zinc-900 text-zinc-300 border border-zinc-800" : "bg-slate-50 text-slate-700 border border-slate-200/80"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">{store.highlight}</span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3 ${
                      isDark ? "text-zinc-400" : "text-slate-600"
                    }`}
                  >
                    {store.description}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div
                  className={`flex gap-2 pt-3 border-t ${
                    isDark ? "border-zinc-800/80" : "border-slate-100"
                  }`}
                >
                  <a
                    href={`/${store.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Loja</span>
                  </a>
                  <a
                    href={`/${store.slug}/loja`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                      isDark
                        ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Catálogo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. VANTAGENS FOCADAS EM FECHAR VENDAS ───────────────── */}
      <section
        id="vantagens"
        className={`py-12 sm:py-20 px-4 sm:px-6 border-t transition-colors duration-300 ${
          isDark ? "bg-zinc-900/30 border-zinc-800/60" : "bg-slate-100/70 border-slate-200"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Vantagens Exclusivas
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Por que vender pelo ZapStore?
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Recursos pensados para aumentar sua conversão sem complicações técnicas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
            <div
              className={`border rounded-2xl p-5 sm:p-6 transition ${
                isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3">
                <WhatsAppIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <h3
                className={`font-bold text-base sm:text-lg mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Pedido Pronto no WhatsApp
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                O cliente clica em comprar e a mensagem já vai pronta com o nome do produto, capacidade, preço e condição direto no seu chat.
              </p>
            </div>

            <div
              className={`border rounded-2xl p-5 sm:p-6 transition ${
                isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-base sm:text-lg mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                0% de Comissão por Venda
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Diferente de marketplaces que cobram até 20% do valor dos seus produtos, no ZapStore todo o faturamento fica no seu bolso.
              </p>
            </div>

            <div
              className={`border rounded-2xl p-5 sm:p-6 transition ${
                isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-base sm:text-lg mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Tema White & Black Piano
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Alterne entre tema Claro Titanium e Black Piano OLED, configure as cores da sua marca, logotipo e redes sociais.
              </p>
            </div>

            <div
              className={`border rounded-2xl p-5 sm:p-6 transition ${
                isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-base sm:text-lg mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                100% Mobile First
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Projetado especialmente para compras rápidas no celular, com navegação fluida e botões de toque confortáveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. PLANOS SIMPLIFICADOS (3 Níveis Claros) ───────────── */}
      <section id="planos" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Preços Transparentes
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Comece grátis hoje mesmo
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Crie sua conta no plano gratuito e faça upgrade apenas quando o seu negócio crescer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Free */}
            <div
              className={`border rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between ${
                isDark ? "bg-zinc-900/90 border-zinc-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold mb-1">Free</h3>
                <p className="text-xs text-slate-400 mb-4">Para começar a vender agora</p>
                <div className="mb-5">
                  <span className="text-3xl font-black">R$ 0</span>
                  <span className="text-slate-400 text-xs">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Até 10 produtos cadastrados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    1 imagem por produto
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Botão Pedir no WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Link exclusivo da sua loja
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs text-center transition ${
                  isDark
                    ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                Começar Grátis
              </Link>
            </div>

            {/* Starter */}
            <div
              className={`border rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between ${
                isDark ? "bg-zinc-900/90 border-zinc-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold mb-1">Starter</h3>
                <p className="text-xs text-slate-400 mb-4">Para estoques em expansão</p>
                <div className="mb-5">
                  <span className="text-3xl font-black">R$ 19,99</span>
                  <span className="text-slate-400 text-xs">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Até 50 produtos cadastrados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    5 imagens por produto
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Chat Tawk.to ao vivo integrado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    SEO avançado e Pixel do Facebook
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs text-center transition ${
                  isDark
                    ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                Selecionar Starter
              </Link>
            </div>

            {/* Pro (Highlight) */}
            <div
              className={`border-2 border-blue-600 dark:border-indigo-500 rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between relative shadow-xl ${
                isDark
                  ? "bg-zinc-900/95 text-white shadow-[0_0_35px_-5px_rgba(99,102,241,0.35)]"
                  : "bg-white text-slate-900 shadow-[0_0_35px_-5px_rgba(37,99,235,0.2)]"
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                Mais Popular
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Pro</h3>
                <p className="text-xs text-blue-600 dark:text-indigo-400 font-semibold mb-4">Para lojas profissionais</p>
                <div className="mb-5">
                  <span className="text-3xl font-black">R$ 49,99</span>
                  <span className="text-slate-400 text-xs">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-indigo-400 shrink-0" />
                    <strong>Produtos ilimitados</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-indigo-400 shrink-0" />
                    20 imagens por produto
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-indigo-400 shrink-0" />
                    <strong>Domínio próprio customizado</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-indigo-400 shrink-0" />
                    Suporte prioritário no WhatsApp
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-600/30 transition hover:scale-105"
              >
                Selecionar Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ (Perguntas Frequentes) ───────────────────────── */}
      <section
        id="faq"
        className={`py-12 sm:py-20 px-4 sm:px-6 border-t transition-colors duration-300 ${
          isDark ? "bg-zinc-900/30 border-zinc-800/60" : "bg-slate-100/70 border-slate-200"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Dúvidas Frequentes
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Tire todas as suas dúvidas
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Respostas claras sobre como a plataforma funciona.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold transition ${
                    isDark ? "text-white hover:text-indigo-400" : "text-slate-900 hover:text-blue-600"
                  }`}
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div
                    className={`px-4 sm:px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3.5 ${
                      isDark
                        ? "text-zinc-400 border-zinc-800/60"
                        : "text-slate-600 border-slate-100"
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. FINAL HIGH-CONVERSION CTA ────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div
          className={`max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-center space-y-4 relative shadow-2xl backdrop-blur-xl border ${
            isDark
              ? "bg-gradient-to-r from-indigo-900/40 via-indigo-800/30 to-blue-900/40 border-indigo-500/40 text-white"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white border-blue-400/40"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Pronto para colocar sua loja no ar hoje?
          </h2>
          <p className="text-white/90 text-xs sm:text-base max-w-lg mx-auto">
            Cadastre-se gratuitamente agora mesmo, adicione seus produtos e compartilhe seu catálogo no WhatsApp ainda hoje.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              <span>Criar Minha Loja Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-black/25 hover:bg-black/35 text-white font-semibold text-xs sm:text-sm border border-white/20 transition"
            >
              Já tenho uma conta &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 8. FOOTER COM ÍCONES ───────────────────────────────── */}
      <footer
        className={`pt-12 sm:pt-16 pb-8 sm:pb-12 border-t text-xs transition-colors duration-300 ${
          isDark
            ? "border-zinc-800 bg-zinc-950 text-zinc-400"
            : "border-slate-200 bg-white text-slate-500"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 sm:pb-12 border-b border-slate-200/80 dark:border-zinc-800/80">
            {/* Brand Col */}
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <img
                  src="/zapstore-logo.png"
                  alt="ZapStore"
                  className="w-8 h-8 rounded-xl object-cover shadow-xs"
                />
                <span
                  className={`font-black text-base ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Zap<span className="text-blue-600">Store</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed max-w-xs">
                A plataforma mais rápida para criar seu catálogo digital, receber pedidos organizados no WhatsApp e vender sem intermediários.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                <ShieldCheck size={14} className="shrink-0" />
                <span>0% de comissão • 100% seguro</span>
              </div>
            </div>

            {/* Col 1: Acesso */}
            <div className="space-y-3 text-left">
              <h4
                className={`font-black text-xs uppercase tracking-wider ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Acesso & Gestão
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition group"
                  >
                    <LayoutDashboard size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>Acessar Painel Lojista</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition group"
                  >
                    <UserPlus size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span>Criar Minha Loja Grátis</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition group"
                  >
                    <Shield size={14} className="text-purple-500 group-hover:scale-110 transition-transform" />
                    <span>Painel Super Admin</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Demonstrações */}
            <div className="space-y-3 text-left">
              <h4
                className={`font-black text-xs uppercase tracking-wider ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Lojas de Demonstração
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="/terephones"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition group"
                  >
                    <ShoppingBag size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>Loja Modelo Terephones</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/demo"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition group"
                  >
                    <Store size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span>Loja Demonstração</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/terephones/loja"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition group"
                  >
                    <Package size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>Catálogo com Filtros</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Contato & Recursos */}
            <div className="space-y-3 text-left">
              <h4
                className={`font-black text-xs uppercase tracking-wider ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Suporte & Contato
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://wa.me/5521964639999"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Falar no WhatsApp</span>
                  </a>
                </li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                  <Smartphone size={14} />
                  <span>100% Adaptado para Celular</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                  <Clock size={14} />
                  <span>Atendimento Rápido</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-center sm:text-left text-xs">
            <p>&copy; {new Date().getFullYear()} ZapStore. Todos os direitos reservados.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
              <Link to="/termos-de-uso" className="hover:text-blue-600 transition">
                Termos de Uso
              </Link>
              <span>•</span>
              <Link to="/politica-de-privacidade" className="hover:text-blue-600 transition">
                Privacidade
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sistemas 100% Operacionais
              </span>
              <span>•</span>
              <a href="#inicio" className="hover:text-blue-600 transition">
                Voltar ao topo ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Mobile Bottom Navigation (Landing Page) ────────────── */}
      <nav
        aria-label="Navegação rápida mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#06080d]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-zinc-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.7)] px-2 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 w-full max-w-md mx-auto items-center">
          {/* 1. Início */}
          <a
            href="#inicio"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
          >
            <Store className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-semibold leading-tight">Início</span>
          </a>

          {/* 2. Demos */}
          <a
            href="#lojas-demo"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-semibold leading-tight">Demos</span>
          </a>

          {/* 3. Planos */}
          <a
            href="#planos"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-semibold leading-tight">Planos</span>
          </a>

          {/* 4. Entrar */}
          <Link
            to="/login"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-semibold leading-tight">Entrar</span>
          </Link>

          {/* 5. Criar Loja CTA */}
          <Link
            to="/signup"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-blue-600 dark:text-sky-400 font-extrabold transition group"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] leading-tight">Criar Loja</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
