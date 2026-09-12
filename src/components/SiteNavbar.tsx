import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, MessageCircle, ShoppingBag } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import type { ThemeMode } from "@/components/ThemeSelectorModal";
import { WHATSAPP } from "@/data/storeData";

interface SiteNavbarProps {
  currentTheme: ThemeMode;
  toggleTheme: () => void;
}

export function SiteNavbar({ currentTheme, toggleTheme }: SiteNavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [afterHours, setAfterHours] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isDark = currentTheme === "black-piano";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    setAfterHours(minutes >= 18 * 60);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Início", path: "/" },
    { label: "Loja", path: "/loja" },
    { label: "Chat Online", path: "/chat" },
    { label: "Diferenciais", path: "/#diferenciais" },
    { label: "SejaDelta", path: "/#retirada" },
    { label: "Avaliações", path: "/#avaliacoes" },
    { label: "Sobre", path: "/#sobre" },
  ];

  return (
    <>
      {/* Desktop navbar */}
      <nav
        className={`hidden lg:block fixed top-0 inset-x-0 z-50 navbar-desk ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <div className="navbar-desk-inner">
          <Link to="/" className="shrink-0 logo-desk">
            <BrandLogo height={scrolled ? 42 : 48} showText={true} dark={isDark} />
          </Link>

          <div className="flex items-center justify-center nav-links-desk gap-1">
            {navLinks.map((link) => {
              const isCurrent = currentPath === link.path;
              const isExternalHash = link.path.includes("#");

              if (isExternalHash) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    className="nav-link nav-link-desk"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link nav-link-desk ${
                    isCurrent
                      ? "text-blue-600 dark:text-sky-400 font-extrabold"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 justify-end">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold glass transition-all hover:scale-105 cursor-pointer border shadow-sm"
              title={isDark ? "Mudar para Branco Titânio" : "Mudar para Black Piano"}
            >
              {isDark ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                  <span className="text-slate-200">Black Piano</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(26,111,232,0.4)]" />
                  <span className="text-slate-700">Branco</span>
                </>
              )}
            </button>

            <div className="badge-aberto">
              {afterHours
                ? "Fechado — Abre amanhã às 10:00"
                : "Aberto até 18:00"}
            </div>

            <span
              className="h-6 border-l"
              style={{ borderColor: "rgba(var(--blue-rgb),0.18)" }}
            />

            <Link
              to="/chat"
              className="btn-pedir-agora flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir no Chat</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile pill navbar */}
      <nav className={`lg:hidden nav-pill ${scrolled ? "scrolled" : ""}`}>
        <div className="relative flex items-center justify-between h-14 px-4">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Abrir Menu"
            className="w-9 h-9 flex items-center justify-center rounded-full glass border cursor-pointer"
            style={{ color: "var(--blue-primary)" }}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <BrandLogo height={32} showText={true} dark={isDark} />
          </Link>

          {/* Quick theme toggle for mobile */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema visual"
            className="w-9 h-9 flex items-center justify-center rounded-full glass border text-xs cursor-pointer shadow-sm hover:scale-105 transition"
            title="Alternar tema"
          >
            {isDark ? "⚫" : "⚪"}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown drawer menu */}
      {open && (
        <div className="lg:hidden mobile-menu p-5">
          <div className="flex flex-col">
            {navLinks.map((link) => {
              const isCurrent = currentPath === link.path;
              const isExternalHash = link.path.includes("#");

              if (isExternalHash) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={() => setOpen(false)}
                    className="py-3 text-sm font-semibold transition border-b last:border-0"
                    style={{
                      color: "var(--text-primary)",
                      borderColor: "rgba(var(--blue-rgb),.10)",
                    }}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-sm font-semibold transition border-b last:border-0 ${
                    isCurrent
                      ? "text-blue-600 dark:text-sky-400 font-black"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                  style={{ borderColor: "rgba(var(--blue-rgb),.10)" }}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-4 pt-4 border-t flex flex-col gap-2.5">
              <Link
                to="/chat"
                onClick={() => setOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-black bg-blue-600 text-white shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atendimento & Pedidos no Chat</span>
              </Link>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="w-full py-2 px-4 rounded-xl text-center text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center justify-center gap-2"
              >
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
