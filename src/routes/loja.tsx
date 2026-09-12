import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Smartphone,
  LayoutGrid,
  Search,
  MessageCircle,
  Info,
  Check,
  Zap,
  ShieldCheck,
  Truck,
  Building2,
  Filter,
} from "lucide-react";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsFloat } from "@/components/WhatsFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ThemeSelectorModal, type ThemeMode } from "@/components/ThemeSelectorModal";
import { ProductDetailModal, type ProductItem } from "@/components/ProductDetailModal";
import { fetchGoogleSheetInventory } from "@/services/googleSheets";
import {
  defaultProducts,
  filters,
  comboUpsell,
  fmt,
  WHATSAPP,
} from "@/data/storeData";
import { toast } from "sonner";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja — iPhones Disponíveis a Pronta Entrega | Terephones" },
      {
        name: "description",
        content:
          "Veja todos os iPhones novos e seminovos disponíveis hoje em Teresópolis - RJ. Entrega Express em até 2h ou retirada na SejaDelta.",
      },
      { property: "og:title", content: "Loja de iPhones em Teresópolis — Terephones" },
      {
        property: "og:description",
        content:
          "Catálogo completo de iPhones pronta entrega com fotos reais, bateria testada e garantia. Pague só na entrega.",
      },
    ],
  }),
  component: LojaPage,
});

function LojaPage() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("white");
  const [productList, setProductList] = useState<ProductItem[]>(defaultProducts);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"compact" | "showcase">("compact");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("terephones_theme") as ThemeMode | null;
      if (saved === "black-piano" || saved === "white") {
        setCurrentTheme(saved);
        const root = document.documentElement;
        root.classList.remove("theme-white", "theme-black-piano", "dark");
        if (saved === "black-piano") {
          root.classList.add("theme-black-piano", "dark");
        } else {
          root.classList.add("theme-white");
        }
      }

      // Sync Google Sheets
      setLoading(true);
      fetchGoogleSheetInventory()
        .then((items) => {
          if (items && items.length > 0) {
            setProductList(items);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = currentTheme === "black-piano" ? "white" : "black-piano";
    setCurrentTheme(next);
    const root = document.documentElement;
    root.classList.remove("theme-white", "theme-black-piano", "dark");
    if (next === "black-piano") {
      root.classList.add("theme-black-piano", "dark");
    } else {
      root.classList.add("theme-white");
    }
    localStorage.setItem("terephones_theme", next);
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: next } }));
    toast.success(next === "black-piano" ? "Tema Black Piano ativado!" : "Tema Branco Titânio ativado!");
  };

  const handleOpenDetail = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setModalOpen(true);
  };

  const handleOrderWhatsApp = (prod: ProductItem) => {
    const text = `Olá, Terephones! Vi o *${prod.name}* na Loja do site por ${fmt(prod.price)} e gostaria de pedir para entrega/retirada hoje em Teresópolis!`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Filter & Search
  const filtered = productList.filter((item) => {
    const matchCat = activeFilter === "Todos" || item.cat === activeFilter;
    const matchSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.specs && item.specs.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.storage && item.storage.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ThemeSelectorModal currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      <SiteNavbar currentTheme={currentTheme} toggleTheme={toggleTheme} />

      <main className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header da Loja */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold glass mb-3 border border-blue-500/20 text-blue-600 dark:text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Estoque Oficial Atualizado Hoje em Teresópolis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Catálogo Completo de <span className="text-gradient-blue">iPhones</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Aparelhos 100% testados em mais de 25 itens técnicos. Pague só no momento da entrega ou retire na loja parceira SejaDelta.
          </p>
        </div>

        {/* Barra de Busca & Filtros Rápidos */}
        <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por modelo (ex: 16 Pro, 15, Branco, 256GB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Filtros Mobile: Segmented Control Unificado (1 linha) */}
        <div className="sm:hidden mt-6 flex flex-col gap-3">
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-inner backdrop-blur-md">
            {filters.map((fl) => {
              const count =
                fl === "Todos"
                  ? productList.length
                  : productList.filter((p) => p.cat === fl).length;
              const isActive = activeFilter === fl;
              return (
                <button
                  key={fl}
                  onClick={() => setActiveFilter(fl)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "btn-primary-glow text-white shadow-md font-black scale-[1.02]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                  }`}
                >
                  <span className="truncate">{fl}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-200/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                {filtered.length} {filtered.length === 1 ? "aparelho encontrado" : "aparelhos encontrados"}
              </span>
            </div>

            <div className="flex items-center p-0.5 bg-slate-100/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <button
                onClick={() => setViewMode("compact")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "compact"
                    ? "btn-primary-glow text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title="Grade 2 por linha"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">Grade 2x</span>
              </button>

              <button
                onClick={() => setViewMode("showcase")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "showcase"
                    ? "btn-primary-glow text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title="Vitrine 1 por linha"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">Vitrine 1x</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Desktop */}
        <div className="hidden sm:flex mt-8 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {filters.map((fl) => {
              const count =
                fl === "Todos"
                  ? productList.length
                  : productList.filter((p) => p.cat === fl).length;
              const isActive = activeFilter === fl;
              return (
                <button
                  key={fl}
                  onClick={() => setActiveFilter(fl)}
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "btn-primary-glow text-white shadow-lg scale-105"
                      : "section-pill hover:scale-105"
                  }`}
                >
                  <span>{fl}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-blue-100 text-blue-800 dark:bg-sky-400/25 dark:text-sky-200 border border-blue-200/50 dark:border-sky-400/30"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{filtered.length} aparelhos prontos para entrega imediata</span>
          </div>
        </div>

        {/* Grade de Produtos */}
        {filtered.length === 0 ? (
          <div className="mt-16 text-center py-16 glass rounded-3xl border border-slate-200 dark:border-slate-800">
            <Smartphone className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold">Nenhum iPhone encontrado para essa busca</h3>
            <p className="text-sm text-slate-500 mt-1">
              Tente buscar por outro modelo ou limpe o filtro de busca.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("Todos");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700"
            >
              Ver todos os modelos
            </button>
          </div>
        ) : (
          <div
            className={`mt-8 ${
              viewMode === "showcase" ? "hidden sm:grid" : "grid"
            } grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6`}
          >
            {filtered.map((prod, idx) => (
              <div
                key={prod.name + idx}
                className="group relative rounded-2xl sm:rounded-3xl glass p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl border border-slate-200/60 dark:border-slate-800/80 hover:-translate-y-1"
              >
                {/* Badge Superior */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-sky-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-sky-800/40">
                    {prod.badge}
                  </span>
                  {prod.storage && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {prod.storage}
                    </span>
                  )}
                </div>

                {/* Imagem do Aparelho */}
                <div className="relative aspect-4/5 w-full flex items-center justify-center p-2 sm:p-4 mb-3">
                  <img
                    src={prod.img}
                    alt={prod.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Dados do Aparelho */}
                <div>
                  <h3 className="text-xs sm:text-sm font-black line-clamp-1 text-slate-900 dark:text-white" title={prod.name}>
                    {prod.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {prod.specs || "Garantia Terephones • Testado"}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-lg font-black text-blue-600 dark:text-sky-400">
                        {fmt(prod.price)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        no PIX
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      ou 12x de {fmt(Math.round((prod.price * 1.15) / 12))} no cartão
                    </p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-3 grid grid-cols-2 gap-1.5 pt-2">
                  <Link
                    to="/chat"
                    className="w-full py-1.5 sm:py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Pedir</span>
                  </Link>

                  <button
                    onClick={() => handleOpenDetail(prod)}
                    className="w-full py-1.5 sm:py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Info</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modo Vitrine Mobile (1 card grande por linha) */}
        {viewMode === "showcase" && (
          <div className="sm:hidden mt-6 space-y-4">
            {filtered.map((prod, idx) => (
              <div
                key={prod.name + idx + "-showcase"}
                className="rounded-3xl glass p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 dark:bg-sky-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-sky-800/40">
                    {prod.badge}
                  </span>
                  <span className="text-xs font-black text-slate-500">
                    {prod.storage}
                  </span>
                </div>

                <div className="h-60 w-full flex items-center justify-center p-4 my-2">
                  <img
                    src={prod.img}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  />
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{prod.specs}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-black text-blue-600 dark:text-sky-400">
                      {fmt(prod.price)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">PIX</span>
                    <p className="text-[11px] text-slate-500">
                      ou 12x de {fmt(Math.round((prod.price * 1.15) / 12))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetail(prod)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <Link
                      to="/chat"
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Pedir no Chat</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Banner de Assistente Online */}
        <div className="mt-16 rounded-3xl p-6 sm:p-10 glass border border-blue-500/30 shadow-xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Atendimento em Tempo Real</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Em dúvida sobre qual iPhone escolher?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
              Converse com nosso assistente virtual no Chat ou faça seu pedido diretamente por lá sem precisar sair da página.
            </p>
          </div>

          <Link
            to="/chat"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg flex items-center gap-2 hover:scale-105 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Abrir Chat Terephones</span>
          </Link>
        </div>
      </main>

      {/* Modal de Especificações */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        whatsappNumber="5521964639999"
      />

      <SiteFooter currentTheme={currentTheme} />
      <WhatsFloat />
      <MobileBottomNav />
    </div>
  );
}
