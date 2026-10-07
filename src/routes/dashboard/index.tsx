import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
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
  MessageCircle,
  Copy,
  Check,
  Share2,
  Edit,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { planLabel } from '@/lib/planLimits';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
});

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function DashboardOverview() {
  const { session } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    visits: 0,
    leads: 0,
  });
  const [checklist, setChecklist] = useState({
    hasLogo: false,
    hasWhatsapp: false,
    hasProducts: false,
    hasSettings: false,
  });
  const [storeName, setStoreName] = useState('');
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (session?.userId) {
      const products = db.products.getByProfileId(session.userId);
      const settings = db.storeSettings.getByProfileId(session.userId);
      const analyticsStats = db.analytics.getStats(session.userId);

      setStoreName(settings?.store_name || session.user.display_name || 'Lojista');
      setRecentProducts([...products].slice(-4).reverse());

      setStats({
        totalProducts: products.length,
        availableProducts: products.filter((p) => p.is_available).length,
        visits: analyticsStats.visits,
        leads: analyticsStats.leads,
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

  const storeSlug = session.user.slug;
  const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/${storeSlug}` : `/${storeSlug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(storeUrl);
      setCopiedLink(true);
      toast.success('Link da sua loja copiado com sucesso!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

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
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Olá, {storeName.split(' ')[0]}! 👋
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Loja Ativa
            </span>
            <Link
              to="/dashboard/planos"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold hover:bg-purple-100 transition"
            >
              <ShieldCheck className="w-3 h-3" />
              Plano {planLabel(session.user.plan_slug)}
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Acompanhe o desempenho da sua loja e gerencie seu catálogo em tempo real.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center shrink-0 pt-1 sm:pt-0">
          <Link
            to="/dashboard/produtos/novo"
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 text-center cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Adicionar Produto</span>
          </Link>

          <a
            href={`/${session.user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-xs text-center cursor-pointer"
          >
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Ver Loja</span>
          </a>
        </div>
      </div>

      {/* ─── Share Store Link Card ───────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-blue-800/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full md:w-auto">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-sky-400 shrink-0 border border-white/10">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-black text-white">Link da Sua Loja Online</span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 shrink-0">
                Pronta para Vender
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1 truncate max-w-full">
              {storeUrl}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer backdrop-blur-md active:scale-95"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-300" />}
            <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Olá! Conheça o catálogo online da loja ${storeName} e faça seu pedido direto comigo: ${storeUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-sm active:scale-95"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>Divulgar no Zap</span>
          </a>

          <a
            href={`/${session.user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer backdrop-blur-md"
            title="Abrir vitrine em nova aba"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
            <span className="sm:hidden">Abrir Loja</span>
            <span className="hidden sm:inline">Abrir</span>
          </a>
        </div>
      </div>

      {/* ─── Metrics Grid ────────────────────────────────────────── */}
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

        {/* Visitas na Loja */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Visitas na Loja
            </h3>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.visits}</p>
          <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5 block truncate">
            Acessos à vitrine
          </span>
        </div>

        {/* Contatos no Zap / Leads */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Contatos no Zap
            </h3>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.leads}</p>
          <span className="text-[10px] sm:text-xs text-emerald-600/80 font-semibold mt-0.5 block truncate">
            Cliques em pedir no Zap
          </span>
        </div>
      </div>

      {/* ─── Produtos Recentes Table ─────────────────────────────── */}
      {recentProducts.length > 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Produtos Recentes</h2>
            </div>
            <Link
              to="/dashboard/produtos"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentProducts.map((p) => {
              const isLow = p.quantity !== undefined && p.quantity > 0 && p.quantity <= 2;
              const isOut = p.quantity === 0 || !p.is_available;

              return (
                <div key={p.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/70 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {p.primary_image ? (
                        <img src={p.primary_image} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <Package className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{p.category_name || 'Geral'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-black text-slate-900">{fmt(p.price)}</div>
                      <div className="text-[10px]">
                        {isOut ? (
                          <span className="font-bold text-rose-600">Esgotado</span>
                        ) : isLow ? (
                          <span className="font-bold text-amber-600">Restam {p.quantity} un.</span>
                        ) : (
                          <span className="font-bold text-emerald-600">{p.quantity || 1} un.</span>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/dashboard/produtos/$id"
                      params={{ id: p.id }}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                      title="Editar produto"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

export default DashboardOverview;
