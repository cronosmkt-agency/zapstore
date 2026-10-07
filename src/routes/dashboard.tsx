import { createFileRoute, Outlet, useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import {
  Home,
  Package,
  Settings,
  Star,
  CreditCard,
  LogOut,
  Store,
  ExternalLink,
  Shield,
  X,
  Menu,
  ChevronRight,
  Eye,
  Moon,
  Sun,
  ShieldAlert,
} from 'lucide-react';
import { planBadgeClass, planLabel } from '@/lib/planLimits';
import { db } from '@/lib/mockDb';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { session, loading, logout, stopImpersonate, isImpersonating } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState<'white' | 'black-piano'>('white');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('zapstore_dashboard_theme');
      if (t === 'black-piano' || document.documentElement.classList.contains('theme-black-piano')) {
        setCurrentTheme('black-piano');
      } else {
        setCurrentTheme('white');
      }
    }
  }, []);

  const handleToggleTheme = () => {
    const next = currentTheme === 'black-piano' ? 'white' : 'black-piano';
    setCurrentTheme(next);
    localStorage.setItem('zapstore_dashboard_theme', next);
    const root = document.documentElement;
    root.classList.remove('theme-white', 'theme-black-piano', 'dark');
    if (next === 'black-piano') {
      root.classList.add('theme-black-piano', 'dark');
      toast.success('Modo Black Piano ativado');
    } else {
      root.classList.add('theme-white');
      toast.success('Modo White ativado');
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate({ to: '/login' });
      } else if (session.is_admin && !session.impersonatedBy) {
        navigate({ to: '/admin' });
      }
    }
  }, [session, loading, navigate]);

  useEffect(() => {
    if (session?.userId) {
      const s = db.storeSettings.getByProfileId(session.userId);
      setStoreSettings(s || null);
    }
  }, [session]);

  const handleExitImpersonation = () => {
    stopImpersonate();
    toast.success('Retornando ao Painel Admin...');
    navigate({ to: '/admin/usuarios' });
  };

  if (loading || !session || (session.is_admin && !session.impersonatedBy)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#06080e]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navItems = [
    { label: 'Início', mobileLabel: 'Início', icon: Home, to: '/dashboard' },
    { label: 'Produtos', mobileLabel: 'Produtos', icon: Package, to: '/dashboard/produtos' },
    { label: 'Configurações', mobileLabel: 'Ajustes', icon: Settings, to: '/dashboard/configuracoes' },
    { label: 'Avaliações', mobileLabel: 'Reviews', icon: Star, to: '/dashboard/avaliacoes' },
    { label: 'Planos', mobileLabel: 'Planos', icon: CreditCard, to: '/dashboard/planos' },
  ];

  const storeName = storeSettings?.store_name || session.user.display_name || 'Loja';
  const logoUrl = storeSettings?.logo_url;
  const storeSlug = session.user.slug || 'terephones';
  const hasActiveImpersonation = isImpersonating || !!session.impersonatedBy;

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    if (hasActiveImpersonation) {
      stopImpersonate();
    }
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* ─── Admin Impersonation Persistent Banner ─────────────── */}
      {hasActiveImpersonation && (
        <aside aria-label="Aviso de Modo Suporte do Administrador" className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-3.5 sm:px-6 py-2.5 shadow-md flex items-center justify-between text-xs font-bold z-50 sticky top-0 border-b border-amber-500/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldAlert className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
            <span className="truncate text-xs">
              <span className="font-black uppercase tracking-wider bg-amber-950/40 px-2 py-0.5 rounded-md mr-1.5 border border-white/20">
                Modo Suporte Admin
              </span>
              Gerenciando loja <strong>{storeName}</strong> ({session.user.email})
            </span>
          </div>

          <button
            type="button"
            onClick={handleExitImpersonation}
            className="inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm transition shrink-0 ml-3 cursor-pointer"
          >
            <LogOut size={13} className="text-rose-600" />
            <span className="hidden sm:inline">Sair e</span> Voltar ao Admin
          </button>
        </aside>
      )}

      <div className="flex flex-col md:flex-row flex-1">
        {/* ─── Mobile Header (Top) ────────────────────────────────── */}
        <header className="md:hidden flex items-center justify-between h-15 px-3.5 sm:px-4 bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 z-30 sticky top-0 shadow-xs">
          {/* Store Logo & Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            {logoUrl ? (
              <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121724] p-0.5 flex shrink-0 items-center justify-center shadow-xs overflow-hidden">
                <img src={logoUrl} alt={storeName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex shrink-0 items-center justify-center font-bold text-sm shadow-xs">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[135px] sm:max-w-[190px]">
                  {storeName}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${planBadgeClass(
                    session.user.plan_slug
                  )}`}
                >
                  {planLabel(session.user.plan_slug)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[130px]">
                /{storeSlug}
              </span>
            </div>
          </div>

          {/* Quick Actions (Theme + Ver Loja + Menu) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer"
              title={currentTheme === 'black-piano' ? 'Mudar para Modo White' : 'Mudar para Modo Black Piano'}
            >
              {currentTheme === 'black-piano' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <a
              href={`/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs"
              title="Abrir vitrine em nova aba"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden xs:inline text-[11px]">Ver Loja</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent cursor-pointer"
              aria-label="Abrir menu da conta"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ─── Mobile Slide-over Drawer / Menu ─────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer content */}
            <div className="relative ml-auto w-4/5 max-w-xs bg-white dark:bg-[#0b0e17] text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-[#0e121d]">
                <div className="flex items-center gap-2.5 min-w-0">
                  {logoUrl ? (
                    <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121724] p-0.5 flex shrink-0 items-center justify-center shadow-xs overflow-hidden">
                      <img src={logoUrl} alt={storeName} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex shrink-0 items-center justify-center font-bold text-sm shadow-xs">
                      {storeName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-black text-sm text-slate-900 dark:text-white truncate block">{storeName}</span>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Plan Badge Card */}
              <div className="p-3.5 mx-3 my-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Plano da Loja
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{planLabel(session.user.plan_slug)}</span>
                </div>
                <Link
                  to="/dashboard/planos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-[#121724] px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs"
                >
                  Upgrade
                </Link>
              </div>

              {/* Links & Quick Actions */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {hasActiveImpersonation && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleExitImpersonation();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/50 font-bold text-xs border border-amber-300 dark:border-amber-800 shadow-xs cursor-pointer mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-amber-700 dark:text-amber-400" />
                      <span>Voltar ao Super Admin</span>
                    </div>
                    <LogOut size={13} />
                  </button>
                )}

                <a
                  href={`/${storeSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 font-bold text-xs transition border border-emerald-200/80 dark:border-emerald-900/50 mb-2 shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Store size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Ver Minha Loja Online</span>
                  </div>
                  <ExternalLink size={13} />
                </a>

                <Link
                  to="/dashboard/configuracoes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-xs transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings size={16} className="text-slate-500 dark:text-slate-400" />
                    <span>Configurações da Loja</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                {/* Theme toggle option */}
                <button
                  type="button"
                  onClick={handleToggleTheme}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {currentTheme === 'black-piano' ? (
                      <Sun size={16} className="text-amber-400" />
                    ) : (
                      <Moon size={16} className="text-slate-500" />
                    )}
                    <span>Tema: {currentTheme === 'black-piano' ? 'Black Piano' : 'White'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Alternar</span>
                </button>

                {session.is_admin && !hasActiveImpersonation && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-blue-700 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 font-semibold text-xs transition border border-blue-200/80 dark:border-blue-900/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                      <span>Painel Super Admin</span>
                    </div>
                    <ChevronRight size={14} className="text-blue-400" />
                  </Link>
                )}
              </nav>

              {/* Logout Footer */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0e121d]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all font-bold text-xs w-full text-left cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Desktop Sidebar ───────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0b0e17] border-r border-slate-200/90 dark:border-slate-800/80 fixed h-screen z-20 shadow-xs transition-colors duration-200">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3 mb-2">
              {logoUrl ? (
                <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121724] p-0.5 flex shrink-0 items-center justify-center shadow-xs overflow-hidden">
                  <img src={logoUrl} alt={storeName} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex shrink-0 items-center justify-center shadow-md shadow-blue-500/20 font-bold text-base">
                  {storeName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {storeName}
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">{session.user.email}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-bold border ${planBadgeClass(
                  session.user.plan_slug
                )}`}
              >
                {planLabel(session.user.plan_slug)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>

          <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
            {hasActiveImpersonation && (
              <button
                type="button"
                onClick={handleExitImpersonation}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 font-bold text-xs border border-amber-300 dark:border-amber-800/80 shadow-xs cursor-pointer mb-3 transition hover:scale-[1.01]"
              >
                <div className="flex items-center gap-2">
                  <Shield size={15} className="text-amber-700 dark:text-amber-400" />
                  <span>Voltar ao Admin</span>
                </div>
                <LogOut size={13} />
              </button>
            )}

            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all [&.active]:bg-blue-600 [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-blue-600/20 font-semibold text-xs"
                activeOptions={{ exact: item.to === '/dashboard' }}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}

            <a
              href={`/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/80 transition-all mt-4 border border-emerald-200/80 dark:border-emerald-900/50 font-bold text-xs shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ver Minha Loja</span>
              </div>
              <ExternalLink size={12} />
            </a>

            {session.is_admin && !hasActiveImpersonation && (
              <Link
                to="/admin"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 font-bold text-xs transition border border-blue-200 dark:border-blue-900/50 mt-2"
              >
                <Shield size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Painel Super Admin</span>
              </Link>
            )}
          </nav>

          {/* Theme & Logout Footer */}
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0e121d] space-y-2">
            <button
              type="button"
              onClick={handleToggleTheme}
              className="flex items-center justify-between px-3.5 py-2 w-full rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all font-semibold text-xs cursor-pointer border border-slate-200/70 dark:border-slate-800"
            >
              <div className="flex items-center gap-2">
                {currentTheme === 'black-piano' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-500" />
                )}
                <span>Tema {currentTheme === 'black-piano' ? 'Black Piano' : 'White'}</span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Trocar</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3.5 py-2 w-full rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all font-bold text-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </aside>

        {/* ─── Main Content ───────────────────────────────────────── */}
        <main className="flex-1 md:ml-64 pb-20 md:pb-8 relative min-h-screen bg-slate-50 dark:bg-[#06080e] transition-colors duration-200">
          <div className="p-3.5 sm:p-6 lg:p-8 max-w-6xl mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ─── Mobile Bottom Nav (Fix Overflow on Small Screens) ──────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0b0e17]/95 border-t border-slate-200/90 dark:border-slate-800/80 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-1 z-30 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-5 w-full max-w-md mx-auto items-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 [&.active]:text-blue-600 dark:[&.active]:text-blue-400 [&.active]:font-bold transition-colors min-w-0"
              activeOptions={{ exact: item.to === '/dashboard' }}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[9.5px] sm:text-[10px] tracking-tight truncate max-w-full leading-tight">
                {item.mobileLabel || item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
