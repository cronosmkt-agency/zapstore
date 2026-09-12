import { useState, useEffect } from "react";
import { X, Sparkles, Check, Moon, Sun } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export type ThemeMode = "white" | "black-piano";

interface ThemeSelectorModalProps {
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeSelectorModal({
  currentTheme: propTheme,
  onThemeChange,
}: ThemeSelectorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>("white");
  const [hoveredTheme, setHoveredTheme] = useState<ThemeMode | null>(null);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("terephones_theme") as ThemeMode | null;

    if (saved === "black-piano" || saved === "white") {
      setSelectedTheme(saved);
      applyTheme(saved);
      // Already set, no need to auto-open
    } else {
      // First visit: open modal after a brief delay for a grand entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync prop changes if any
  useEffect(() => {
    if (propTheme) {
      setSelectedTheme(propTheme);
    }
  }, [propTheme]);

  // Listen to global open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-theme-modal", handleOpen);
    return () => window.removeEventListener("open-theme-modal", handleOpen);
  }, []);

  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove("theme-white", "theme-black-piano", "dark");
    if (theme === "black-piano") {
      root.classList.add("theme-black-piano", "dark");
    } else {
      root.classList.add("theme-white");
    }
    localStorage.setItem("terephones_theme", theme);
    if (onThemeChange) {
      onThemeChange(theme);
    }
    // Dispatch event so other components (Navbar, etc.) can react
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme } }));
  };

  const handleSelect = (theme: ThemeMode) => {
    setSelectedTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        animation: "fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-10 border text-white overflow-hidden shadow-2xl transition-all"
        style={{
          background: "linear-gradient(135deg, rgba(18, 22, 34, 0.96) 0%, rgba(9, 11, 18, 0.98) 100%)",
          borderColor: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 30px 100px rgba(0, 0, 0, 0.9), 0 0 60px rgba(56, 189, 248, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.25), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Fechar e manter padrão"
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-4">
            <BrandLogo height={42} showText={true} dark={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-sky-400/30 bg-sky-500/10 text-sky-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalize sua experiência</span>
          </div>

          <h2
            id="theme-modal-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white"
          >
            Como você prefere ver o site?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Escolha a atmosfera visual ideal para navegar pelos iPhones da Terephones. Você pode alternar a qualquer momento no menu superior.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-8 relative z-10">
          {/* Card 1: White Titanium */}
          <div
            onClick={() => handleSelect("white")}
            onMouseEnter={() => setHoveredTheme("white")}
            onMouseLeave={() => setHoveredTheme(null)}
            className={`group cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between relative overflow-hidden ${
              selectedTheme === "white"
                ? "ring-2 ring-blue-500 shadow-xl"
                : "hover:border-white/40"
            }`}
            style={{
              background: "linear-gradient(145deg, rgba(248, 250, 252, 0.98) 0%, rgba(226, 232, 240, 0.92) 100%)",
              borderColor: selectedTheme === "white" ? "#2563eb" : "rgba(255, 255, 255, 0.25)",
              color: "#0f172a",
              boxShadow: hoveredTheme === "white"
                ? "0 20px 50px rgba(255, 255, 255, 0.2), 0 0 30px rgba(37, 99, 235, 0.2)"
                : "0 10px 30px rgba(0, 0, 0, 0.3)",
              transform: hoveredTheme === "white" ? "translateY(-4px)" : "none",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-inner">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">Branco Titânio</h3>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Clean & Luminoso</span>
                  </div>
                </div>
                {selectedTheme === "white" && (
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Mini Preview Graphic */}
              <div className="h-28 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100/80 p-3 flex flex-col justify-between relative overflow-hidden mb-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-blue-600 shadow-xs border border-blue-100">
                    Original
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-3/4 rounded bg-slate-800/80" />
                  <div className="h-2 w-1/2 rounded bg-blue-600/70" />
                </div>
                <div className="h-6 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  Entrar no Branco
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Estilo clássico da Apple com tons brancos de titânio, azul safira cristalino e nitidez para navegação diurna.
              </p>
            </div>

            <button
              type="button"
              className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition bg-blue-600 text-white hover:bg-blue-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Escolher Branco</span>
            </button>
          </div>

          {/* Card 2: Black Piano */}
          <div
            onClick={() => handleSelect("black-piano")}
            onMouseEnter={() => setHoveredTheme("black-piano")}
            onMouseLeave={() => setHoveredTheme(null)}
            className={`group cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between relative overflow-hidden ${
              selectedTheme === "black-piano"
                ? "ring-2 ring-sky-400 shadow-xl"
                : "hover:border-sky-400/40"
            }`}
            style={{
              background: "linear-gradient(145deg, rgba(14, 18, 28, 0.98) 0%, rgba(2, 6, 14, 1) 100%)",
              borderColor: selectedTheme === "black-piano" ? "#38bdf8" : "rgba(255, 255, 255, 0.16)",
              color: "#f8fafc",
              boxShadow: hoveredTheme === "black-piano"
                ? "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.3)"
                : "0 10px 30px rgba(0, 0, 0, 0.5)",
              transform: hoveredTheme === "black-piano" ? "translateY(-4px)" : "none",
            }}
          >
            {/* Gloss rim highlight */}
            <div
              className="absolute top-0 inset-x-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), transparent)",
              }}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight flex items-center gap-1.5">
                      Black Piano
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    </h3>
                    <span className="text-[11px] font-medium text-sky-300 uppercase tracking-wider">Glassmorphism OLED</span>
                  </div>
                </div>
                {selectedTheme === "black-piano" && (
                  <span className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-4 h-4 font-black" />
                  </span>
                )}
              </div>

              {/* Mini Preview Graphic */}
              <div className="h-28 rounded-xl bg-black/70 border border-sky-500/30 p-3 flex flex-col justify-between relative overflow-hidden mb-4 shadow-inner">
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    background: "radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.3), transparent 60%)",
                  }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                    Apple Dark Lux
                  </span>
                </div>
                <div className="space-y-1.5 relative z-10">
                  <div className="h-2.5 w-3/4 rounded bg-slate-100" />
                  <div className="h-2 w-1/2 rounded bg-sky-400" />
                </div>
                <div className="h-6 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.4)] relative z-10">
                  Entrar no Black Piano
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Preto absoluto OLED, vidro fumê reflexivo com acabamento Black Piano e reflexos ciano elétrico de alta fidelidade.
              </p>
            </div>

            <button
              type="button"
              className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-110 shadow-[0_4px_16px_rgba(56,189,248,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Escolher Black Piano</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 relative z-10">
          <span>✨ Você pode alternar quando quiser pelo botão no topo do site</span>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:text-white transition underline underline-offset-4 cursor-pointer"
          >
            Decidir depois
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelectorModal;
