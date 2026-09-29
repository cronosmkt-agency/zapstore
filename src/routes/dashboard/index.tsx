import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import { useEffect, useState } from 'react';
import {
  Package,
  CheckCircle,
  Store,
  Eye,
  ShieldCheck,
  ArrowRight,
  Plus,
  Sparkles,
  TrendingUp,
  Settings,
  Star,
  ExternalLink,
} from 'lucide-react';
import { planLabel } from '@/lib/planLimits';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { session } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    visits: 0,
  });
  const [checklist, setChecklist] = useState({
    hasLogo: false,
    hasWhatsapp: false,
    hasProducts: false,
    hasSettings: false,
  });
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    if (session?.userId) {
      const products = db.products.getByProfileId(session.userId);
      const settings = db.storeSettings.getByProfileId(session.userId);

      setStoreName(settings?.store_name || session.user.display_name || 'Lojista');

      setStats({
        totalProducts: products.length,
        availableProducts: products.filter((p) => p.is_available).length,
        visits: 0,
      });

      setChecklist({
        hasLogo: !!settings?.logo_url,
        hasWhatsapp: !!settings?.whatsapp,
        hasProducts: products.length > 0,
        hasSettings: !!settings?.store_name,
      });
    }
  }, [session]);

  if (!session) return null;

  const tasks = [
    { id: 'logo', label: 'Logo da loja adicionada', done: checklist.hasLogo, link: '/dashboard/configuracoes' },
    { id: 'whatsapp', label: 'WhatsApp de vendas configurado', done: checklist.hasWhatsapp, link: '/dashboard/configuracoes' },
    { id: 'settings', label: 'Textos da landing page configurados', done: checklist.hasSettings, link: '/dashboard/configuracoes' },
    { id: 'product', label: 'Primeiro produto cadastrado', done: checklist.hasProducts, link: '/dashboard/produtos/novo' },
    { id: 'published', label: 'Loja pronta para receber clientes!', done: Object.values(checklist).every((v) => v), link: `/${session.user.slug}` },
  ];

  const progress = Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* ─── Hero Welcome & Quick Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Olá, {storeName.split(' ')[0]}! 👋
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Loja Ativa
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Acompanhe o desempenho da sua loja e gerencie seu catálogo em tempo real.
          </p>
        </div>

        {/* Action Buttons: 2 columns on mobile, row on tablet/desktop */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center shrink-0 pt-1 sm:pt-0">
          <Link
            to="/dashboard/produtos/novo"
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 text-center"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Adicionar Produto</span>
          </Link>

          <a
            href={`/${session.user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-xs text-center"
          >
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Ver Loja</span>
          </a>
        </div>
      </div>

      {/* ─── Metrics Grid (2x2 on Mobile, 4x1 on Desktop) ────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total de Produtos */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Produtos
            </h3>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalProducts}</p>
          <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5 block truncate">
            No catálogo online
          </span>
        </div>

        {/* Produtos Disponíveis */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Disponíveis
            </h3>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.availableProducts}</p>
          <span className="text-[10px] sm:text-xs text-emerald-600/80 font-semibold mt-0.5 block truncate">
            Prontos para venda
          </span>
        </div>

        {/* Plano Atual */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Plano Atual
            </h3>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{planLabel(session.user.plan_slug)}</p>
          <Link
            to="/dashboard/planos"
            className="text-[10px] sm:text-xs text-blue-600 font-bold hover:underline mt-0.5 block truncate"
          >
            Ver limites do plano &rarr;
          </Link>
        </div>

        {/* Visitas */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Visitas (Hoje)
            </h3>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.visits}</p>
          <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5 block truncate">
            Analytics integrado
          </span>
        </div>
      </div>

      {/* ─── Onboarding Checklist & Progress ─────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">Configuração da Sua Loja</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete os passos para deixar sua vitrine pronta e atrair mais clientes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 sm:w-36 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-blue-600">{progress}%</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors gap-2"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    task.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'
                  }`}
                >
                  {task.done && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    task.done ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {task.label}
                </span>
              </div>
              <Link
                to={task.link}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition shrink-0"
              >
                <span>{task.done ? 'Alterar' : 'Configurar'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Shortcuts Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          to="/dashboard/produtos"
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Gerenciar Produtos</h4>
            <p className="text-[11px] text-slate-400">Preços, fotos e estoque</p>
          </div>
        </Link>

        <Link
          to="/dashboard/configuracoes"
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Settings size={20} />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Personalizar Loja</h4>
            <p className="text-[11px] text-slate-400">Textos, cores e WhatsApp</p>
          </div>
        </Link>

        <Link
          to="/dashboard/avaliacoes"
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Depoimentos</h4>
            <p className="text-[11px] text-slate-400">Avaliações dos clientes</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
