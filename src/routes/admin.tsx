import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
  ArrowLeft,
  Shield,
  Store,
  Settings,
} from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  // Strict admin access check
  if (!session || !session.is_admin) {
    navigate({ to: '/dashboard' });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  const navItems = [
    { label: 'Visão Geral', mobileLabel: 'Geral', icon: LayoutDashboard, to: '/admin' },
    { label: 'Usuários', mobileLabel: 'Lojistas', icon: Users, to: '/admin/usuarios' },
    { label: 'Planos', mobileLabel: 'Planos', icon: CreditCard, to: '/admin/planos' },
    { label: 'Métricas', mobileLabel: 'Métricas', icon: BarChart3, to: '/admin/metricas' },
    { label: 'Configurações', mobileLabel: 'Config', icon: Settings, to: '/admin/configuracoes' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* ─── Mobile Header (Top) ────────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between h-14 sm:h-16 px-4 bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <img
            src="/zapstore-logo.png"
            alt="ZapStore"
            className="w-8 h-8 rounded-xl object-cover shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-slate-900">
                Zap<span className="text-blue-600">Store</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions: Ver Loja Demo + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="/terephones"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5 text-xs font-bold border border-slate-200"
            title="Visualizar Loja Demo TerePhones"
          >
            <Store size={14} className="text-blue-600" />
            <span>Ver Loja</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
            title="Sair da Conta"
            aria-label="Sair da Conta"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ─── Desktop & Tablet Sidebar (Fixed) ───────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 fixed h-screen z-20 shadow-xs">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img
              src="/zapstore-logo.png"
              alt="ZapStore"
              className="w-8 h-8 rounded-xl object-cover shadow-md shadow-blue-500/20"
            />
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight">
                Zap<span className="text-blue-600">Store</span>
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
            Admin
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all [&.active]:bg-blue-600 [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-blue-600/20 font-semibold text-xs"
              activeOptions={{ exact: item.to === '/admin' }}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/70">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Administrador</p>
            <p className="text-xs font-bold text-slate-800 truncate">{session.email}</p>
          </div>

          <a
            href="/terephones"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 transition-all font-bold text-xs w-full border border-blue-200/80 shadow-xs cursor-pointer"
            title="Visualizar a loja demo oficial TerePhones"
          >
            <div className="flex items-center gap-2">
              <Store size={14} className="text-blue-600" />
              <span>Ver Loja Demo</span>
            </div>
            <span className="text-[10px] font-mono text-blue-500">/terephones</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all font-semibold text-xs w-full text-left cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ──────────────────────────────────── */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen bg-slate-50 pb-20 md:pb-8">
        {/* Desktop Sticky Header */}
        <header className="hidden md:flex h-16 border-b border-slate-200/90 bg-white/90 backdrop-blur-md items-center justify-between px-6 lg:px-8 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              Painel do Administrador Geral
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Super Admin
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">{session.email}</span>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ─── Mobile Bottom Navigation Bar (Fixed) ───────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200/90 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-1.5 z-30 flex justify-around backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 py-1 px-2 text-slate-500 [&.active]:text-blue-600 [&.active]:font-bold transition-colors"
            activeOptions={{ exact: item.to === '/admin' }}
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight">{item.mobileLabel}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
