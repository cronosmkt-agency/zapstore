import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sun, MoonStar } from "lucide-react";
import { BrandLogo, TEREPHONES_LOGO_URL } from "@/components/BrandLogo";
import type { ThemeMode } from "@/components/ThemeSelectorModal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { WHATSAPP } from "@/data/storeData";

interface SiteNavbarProps {
  currentTheme: ThemeMode;
  toggleTheme: () => void;
  basePath?: string;
  storeName?: string;
  storeLogo?: string;
  whatsapp?: string;
  showThemeToggle?: boolean;
  // Header Customization Props
  header_logo_alignment_desktop?: 'left' | 'center' | 'right';
  header_logo_alignment_mobile?: 'left' | 'center' | 'right';
  header_show_theme_toggle?: boolean;
  header_show_hours_badge?: boolean;
  header_hours_text?: string;
  header_show_whatsapp_mobile?: boolean;
  header_show_announcement?: boolean;
  header_announcement_text?: string;
  header_cta_text?: string;
  header_show_whatsapp_button?: boolean;
  header_nav_home_label?: string;
  header_nav_catalog_label?: string;
}

export function SiteNavbar({
  currentTheme,
  toggleTheme,
  basePath,
  storeName,
  storeLogo,
  whatsapp,
  showThemeToggle = true,
  header_logo_alignment_desktop = 'left',
  header_logo_alignment_mobile = 'center',
  header_show_theme_toggle = true,
  header_show_hours_badge = true,
  header_hours_text,
  header_show_whatsapp_mobile = false,
  header_show_announcement,
  header_announcement_text,
  header_cta_text,
  header_show_whatsapp_button = true,
  header_nav_home_label,
  header_nav_catalog_label,
}: SiteNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [afterHours, setAfterHours] = useState(false);
  const [themeNotice, setThemeNotice] = useState<{
    text: string;
    isDark: boolean;
  } | null>(null);
  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isDark = currentTheme === "black-piano" || currentTheme === ("black" as any) || currentTheme === ("dark" as any);
  const isIphoneStore =
    (storeName || "").toLowerCase().includes("phone") ||
    (storeName || "").toLowerCase().includes("apple") ||
    (basePath || "").includes("terephones");

  const handleToggleTheme = () => {
    const willBeDark = !isDark;
    if (toggleTheme) {
      toggleTheme();
    } else {
      const root = document.documentElement;
      root.classList.remove("theme-white", "theme-black-piano", "dark");
      if (willBeDark) {
        root.classList.add("theme-black-piano", "dark");
        document.body.style.backgroundColor = "#06080d";
        document.body.style.color = "#ffffff";
      } else {
        root.classList.add("theme-white");
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#0f172a";
      }
    }

    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }

    setThemeNotice({
      text: willBeDark ? "Modo Black ativado" : "Modo Branco ativado",
      isDark: willBeDark,
    });

    noticeTimerRef.current = setTimeout(() => {
      setThemeNotice(null);
    }, 1300);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });

    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    setAfterHours(minutes >= 18 * 60);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homePath = basePath || "/";
  const lojaPath = basePath ? `${basePath}/loja` : "/loja";
  const whatsUrl = whatsapp
    ? (whatsapp.startsWith("http") ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, "")}`)
    : WHATSAPP;

  const isCurrentHome = currentPath === homePath || currentPath === `${homePath}/`;
  const isCurrentLoja = currentPath === lojaPath || currentPath.startsWith(`${lojaPath}/`) || currentPath.includes('/loja');

  const navLinks: { label: string; path: string; hasDot?: boolean; active: boolean }[] = [
    { label: header_nav_home_label || "Início", path: homePath, active: isCurrentHome },
    { label: header_nav_catalog_label || (isIphoneStore ? "Loja" : "Catálogo"), path: lojaPath, hasDot: true, active: isCurrentLoja },
  ];

  const renderLogo = (isMobile = false) => {
    if (storeLogo) {
      return (
        <div className="flex items-center gap-2 sm:gap-2.5">
          <img
            src={storeLogo}
            alt={storeName || "Logo"}
            className={`${isMobile ? 'h-9 w-9' : 'h-9 w-9 sm:h-10 sm:w-10'} object-contain rounded-xl shrink-0 shadow-xs`}
          />
          {storeName && (
            <span className={`font-black ${isMobile ? 'text-base' : 'text-lg sm:text-xl'} tracking-tight text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-[200px]`}>
              {storeName}
            </span>
          )}
        </div>
      );
    }
    if (storeName && !storeName.toLowerCase().includes("terephones")) {
      return (
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className={`${isMobile ? 'w-9 h-9 text-sm' : 'w-9 h-9 sm:w-10 sm:h-10 text-base'} rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center shadow-xs shrink-0`}>
            {storeName.charAt(0).toUpperCase()}
          </div>
          <span className={`font-black ${isMobile ? 'text-base' : 'text-lg sm:text-xl'} tracking-tight text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-[200px]`}>
            {storeName}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 sm:gap-2.5">
        <img
          src={TEREPHONES_LOGO_URL}
          alt="Terephones"
          className={`${isMobile ? 'h-9 w-9' : 'h-9 w-9 sm:h-10 sm:w-10'} object-contain rounded-xl shrink-0 shadow-xs`}
        />
        <span className={`font-black ${isMobile ? 'text-base' : 'text-lg sm:text-xl'} tracking-tight text-slate-900 dark:text-white`}>
          {storeName || "Terephones"}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Top Announcement Bar if enabled */}
      {header_show_announcement && header_announcement_text && (
        <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-[11px] sm:text-xs font-bold py-1.5 px-4 text-center shadow-xs">
          <span>{header_announcement_text}</span>
        </div>
      )}

      {/* Desktop & Tablet pill navbar (Web e Tablet inspirados na Landing Page) */}
      <div className={`hidden md:flex fixed ${header_show_announcement && header_announcement_text ? 'top-8' : 'top-4'} inset-x-0 z-50 flex-col items-center pointer-events-none px-4 sm:px-6 transition-all duration-300`}>
        <nav
          className={`pointer-events-auto nav-pill nav-pill-desk ${
            scrolled ? "scrolled" : ""
          } flex items-center justify-between px-5 sm:px-6 py-2 w-full max-w-5xl xl:max-w-6xl transition-all duration-300`}
        >
          {header_logo_alignment_desktop === 'center' ? (
            <>
              {/* Left: Navigation Links */}
              <div className="flex items-center gap-1.5 flex-1 justify-start">
                <nav
                  className={`flex items-center gap-1 text-xs font-semibold p-1 rounded-full border backdrop-blur-md transition-all ${
                    isDark
                      ? "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                      : "bg-slate-100/80 border-slate-200/80 text-slate-600"
                  }`}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                        link.active
                          ? "bg-blue-600 text-white shadow-xs"
                          : isDark
                            ? "hover:text-white hover:bg-zinc-800/80"
                            : "hover:text-slate-900 hover:bg-white/80"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.hasDot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Center: Brand Logo */}
              <Link to={homePath} className="shrink-0 logo-desk flex items-center mx-4 group">
                {renderLogo(false)}
              </Link>

              {/* Right: Actions */}
              <div className="flex items-center gap-2.5 sm:gap-3 justify-end flex-1 shrink-0">
                {header_show_theme_toggle !== false && (
                  <div className="scale-75 sm:scale-85 origin-center">
                    <ThemeToggleSwitch isDark={isDark} toggleTheme={handleToggleTheme} />
                  </div>
                )}

                {header_show_hours_badge !== false && (
                  <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition whitespace-nowrap shadow-2xs ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-800 text-emerald-400"
                      : "bg-emerald-50/80 border-emerald-200/80 text-emerald-700"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{header_hours_text || (afterHours ? "Fechado • Abre às 10h" : "Aberto até 18:00")}</span>
                  </div>
                )}

                {header_show_whatsapp_button !== false && (
                  <a
                    href={whatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 sm:px-4.5 py-1.5 text-xs sm:text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>{header_cta_text || (isIphoneStore ? "Pedir no Zap" : "Chamar no Zap")}</span>
                  </a>
                )}
              </div>
            </>
          ) : header_logo_alignment_desktop === 'right' ? (
            /* Logo on Right */
            <>
              {/* Left: Navigation Links */}
              <div className="flex items-center gap-1.5 flex-1 justify-start">
                <nav
                  className={`flex items-center gap-1 text-xs font-semibold p-1 rounded-full border backdrop-blur-md transition-all ${
                    isDark
                      ? "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                      : "bg-slate-100/80 border-slate-200/80 text-slate-600"
                  }`}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                        link.active
                          ? "bg-blue-600 text-white shadow-xs"
                          : isDark
                            ? "hover:text-white hover:bg-zinc-800/80"
                            : "hover:text-slate-900 hover:bg-white/80"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.hasDot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Center: Actions */}
              <div className="flex items-center gap-2.5 sm:gap-3 justify-center shrink-0 mx-4">
                {header_show_theme_toggle !== false && (
                  <div className="scale-75 sm:scale-85 origin-center">
                    <ThemeToggleSwitch isDark={isDark} toggleTheme={handleToggleTheme} />
                  </div>
                )}

                {header_show_hours_badge !== false && (
                  <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition whitespace-nowrap shadow-2xs ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-800 text-emerald-400"
                      : "bg-emerald-50/80 border-emerald-200/80 text-emerald-700"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{header_hours_text || (afterHours ? "Fechado • Abre às 10h" : "Aberto até 18:00")}</span>
                  </div>
                )}

                {header_show_whatsapp_button !== false && (
                  <a
                    href={whatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 sm:px-4.5 py-1.5 text-xs sm:text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>{header_cta_text || (isIphoneStore ? "Pedir no Zap" : "Chamar no Zap")}</span>
                  </a>
                )}
              </div>

              {/* Right: Brand Logo */}
              <Link to={homePath} className="shrink-0 logo-desk flex items-center gap-2 group flex-1 justify-end">
                {renderLogo(false)}
              </Link>
            </>
          ) : (
            /* DEFAULT: Logo on Left (Padrão Landing Page) */
            <>
              {/* Left: Brand Logo + Subtitle Tag */}
              <Link to={homePath} className="shrink-0 logo-desk flex items-center gap-2 group">
                {renderLogo(false)}
                <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                  {isIphoneStore ? "iPhones" : "Oficial"}
                </span>
              </Link>

              {/* Center: Navigation Pill */}
              <div className="flex items-center justify-center">
                <nav
                  className={`flex items-center gap-1 text-xs font-semibold p-1 rounded-full border backdrop-blur-md transition-all ${
                    isDark
                      ? "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                      : "bg-slate-100/80 border-slate-200/80 text-slate-600"
                  }`}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                        link.active
                          ? "bg-blue-600 text-white shadow-xs"
                          : isDark
                            ? "hover:text-white hover:bg-zinc-800/80"
                            : "hover:text-slate-900 hover:bg-white/80"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.hasDot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Right: Actions Bar (Theme Switch + Status + WhatsApp CTA) */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {/* 1. Day/Night Neumorphic Slider Switch */}
                {header_show_theme_toggle !== false && (
                  <div className="scale-75 sm:scale-85 origin-center">
                    <ThemeToggleSwitch isDark={isDark} toggleTheme={handleToggleTheme} />
                  </div>
                )}

                {/* 2. Badge de Horário / Status */}
                {header_show_hours_badge !== false && (
                  <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition whitespace-nowrap shadow-2xs ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-800 text-emerald-400"
                      : "bg-emerald-50/80 border-emerald-200/80 text-emerald-700"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{header_hours_text || (afterHours ? "Fechado • Abre às 10h" : "Aberto até 18:00")}</span>
                  </div>
                )}

                {/* 3. Botão CTA do WhatsApp */}
                {header_show_whatsapp_button !== false && (
                  <a
                    href={whatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 sm:px-4.5 py-1.5 text-xs sm:text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>{header_cta_text || (isIphoneStore ? "Pedir no Zap" : "Chamar no Zap")}</span>
                  </a>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Notificação de troca de tema */}
        <div
          className={`transition-all duration-250 ease-out transform ${
            themeNotice
              ? "opacity-100 translate-y-2.5 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black shadow-xl backdrop-blur-xl border ${
              themeNotice?.isDark
                ? "bg-slate-950/92 text-white border-slate-700/80 shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
                : "bg-white/95 text-slate-900 border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.12)]"
            }`}
          >
            {themeNotice?.isDark ? (
              <MoonStar className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{themeNotice?.text}</span>
          </div>
        </div>
      </div>

      {/* Mobile pill navbar (< 768px: Smartphones) */}
      <div className={`md:hidden fixed ${header_show_announcement && header_announcement_text ? 'top-9' : 'top-3 sm:top-4'} left-3 right-3 sm:left-4 sm:right-4 z-50 flex flex-col items-center pointer-events-none transition-all duration-300`}>
        <nav className={`pointer-events-auto w-full nav-pill ${scrolled ? "scrolled" : ""}`}>
          {header_logo_alignment_mobile === 'center' ? (
            /* CENTER ALIGNMENT (PADRÃO MOBILE SOLICITADO): Balanced 3-column layout */
            <div className="grid grid-cols-3 items-center h-14 px-3 sm:px-4 w-full">
              {/* Left Column: WhatsApp Mobile Shortcut or Spacer */}
              <div className="flex items-center justify-start min-w-0">
                {header_show_whatsapp_mobile ? (
                  <a
                    href={whatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition active:scale-95 border border-emerald-500/25 shrink-0 shadow-xs"
                    title="Chamar no WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="w-8 h-8" aria-hidden="true" />
                )}
              </div>

              {/* Center Column: Rigorously Centered Brand Logo + Store Name */}
              <Link
                to={homePath}
                className="flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 active:scale-95 min-w-0 text-center mx-auto"
                aria-label={`Página Inicial ${storeName || "Terephones"}`}
              >
                {renderLogo(true)}
              </Link>

              {/* Right Column: Theme Toggle Switch */}
              <div className="flex items-center justify-end gap-1.5 shrink-0">
                {header_show_theme_toggle !== false && (
                  <div className="scale-80 sm:scale-85 origin-right">
                    <ThemeToggleSwitch isDark={isDark} toggleTheme={handleToggleTheme} />
                  </div>
                )}
              </div>
            </div>
          ) : header_logo_alignment_mobile === 'right' ? (
            /* RIGHT ALIGNMENT ON MOBILE */
            <div className="flex items-center justify-between h-14 px-3 sm:px-4 flex-row-reverse">
              {/* Right: Brand Logo + Store Name */}
              <Link
                to={homePath}
                className="flex items-center gap-2 transition-opacity hover:opacity-90 active:scale-95 min-w-0"
                aria-label={`Página Inicial ${storeName || "Terephones"}`}
              >
                {renderLogo(true)}
              </Link>

              {/* Left: Theme Switch + WhatsApp */}
              <div className="flex items-center gap-2 shrink-0">
                {header_show_theme_toggle !== false && (
                  <div className="scale-80 sm:scale-85 origin-left">
                    <ThemeToggleSwitch isDark={isDark} toggleTheme={handleToggleTheme} />
                  </div>
                )}
                {header_show_whatsapp_mobile && (
                  <a
                    href={whatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition active:scale-95 border border-emerald-500/25"
                    title="Chamar no WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* LEFT ALIGNMENT ON MOBILE */
            <div className="flex items-center justify-between h-14 px-3 sm:px-4">
              {/* Left: Brand Logo + Store Name */}
              <Link
                to={homePath}
                className="flex items-center gap-2 transition-opacity hover:opacity-90 active:scale-95 min-w-0"
                aria-label={`Página Inicial ${storeName || "Terephones"}`}
              >
                {renderLogo(true)}
              </Link>

              {/* Right: Theme Toggle Switch + WhatsApp */}
              <div className="flex items-center gap-2 shrink-0">
                {header_show_theme_toggle !== false && (
                  <div className="scale-80 sm:scale-85 origin-right">
                    <ThemeToggleSwitch isDark={isDark} toggleTheme={handleToggleTheme} />
                  </div>
                )}
                {header_show_whatsapp_mobile && (
                  <a
                    href={whatsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition active:scale-95 border border-emerald-500/25"
                    title="Chamar no WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Notificação rápida de tema (Mobile) */}
        <div
          className={`transition-all duration-250 ease-out transform ${
            themeNotice
              ? "opacity-100 translate-y-2 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black shadow-lg backdrop-blur-xl border ${
              themeNotice?.isDark
                ? "bg-slate-950/92 text-white border-slate-700/80 shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
                : "bg-white/95 text-slate-900 border-slate-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
            }`}
          >
            {themeNotice?.isDark ? (
              <MoonStar className="w-3 h-3 text-sky-400" />
            ) : (
              <Sun className="w-3 h-3 text-amber-500" />
            )}
            <span>{themeNotice?.text}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Neumorphic Day/Night Sliding Switch matching the reference UI
 */
export function ThemeToggleSwitch({
  isDark,
  toggleTheme,
  className = "",
}: {
  isDark: boolean;
  toggleTheme: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para Branco Titânio" : "Mudar para Black"}
      title={isDark ? "Mudar para Branco Titânio" : "Mudar para Black"}
      className={`relative inline-flex items-center w-[66px] h-[34px] p-[3px] rounded-full transition-all duration-300 cursor-pointer select-none shrink-0 ${
        isDark
          ? "bg-[#18202f] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-slate-700/70"
          : "bg-[#e2e8f0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.14)] border border-slate-300/80"
      } hover:opacity-95 active:scale-95 ${className}`}
    >
      {/* Background Reference Track Icons */}
      <div className="absolute inset-0 px-[9px] flex items-center justify-between pointer-events-none">
        {/* Left: Sun icon visible when knob slides to the right (dark mode) */}
        <Sun
          className={`w-4 h-4 transition-all duration-300 ${
            isDark ? "text-slate-500 opacity-90 scale-100" : "opacity-0 scale-75"
          }`}
          strokeWidth={2.4}
        />
        {/* Right: MoonStar icon visible when knob slides to the left (light mode) */}
        <MoonStar
          className={`w-4 h-4 transition-all duration-300 ${
            !isDark ? "text-slate-400 opacity-90 scale-100" : "opacity-0 scale-75"
          }`}
          strokeWidth={2.4}
        />
      </div>

      {/* Tactile 3D Sliding Knob */}
      <div
        className={`relative z-10 w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
          isDark
            ? "translate-x-[32px] bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white shadow-[0_4px_10px_rgba(37,99,235,0.45),0_1px_3px_rgba(0,0,0,0.2)]"
            : "translate-x-0 bg-gradient-to-b from-[#ffa31a] to-[#f97316] text-white shadow-[0_4px_10px_rgba(249,115,22,0.45),0_1px_3px_rgba(0,0,0,0.15)]"
        }`}
      >
        {isDark ? (
          <MoonStar
            className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] animate-in fade-in duration-200"
            strokeWidth={2.5}
          />
        ) : (
          <Sun
            className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] animate-in fade-in duration-200"
            strokeWidth={2.5}
          />
        )}
      </div>
    </button>
  );
}

export default SiteNavbar;
