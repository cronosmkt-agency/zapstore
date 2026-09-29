import { createFileRoute, Link } from '@tanstack/react-router';
import { db } from '@/lib/mockDb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Info, Users, Sparkles, Settings, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/admin/planos')({
  component: AdminPlansPage,
});

function AdminPlansPage() {
  const plans = db.plans.getAll();
  const allUsers = db.profiles.getAll().filter((u) => !u.is_admin);
  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gerenciamento de Planos & Assinaturas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize limites, precificação e a adesão de lojistas por plano.
          </p>
        </div>

        <div>
          <Link
            to="/admin/configuracoes"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Settings size={14} />
            <span>Editar Preços & Limites</span>
          </Link>
        </div>
      </div>

      {/* Cloudflare Workers / Supabase Info Banner */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex gap-3 text-blue-900 shadow-xs">
        <Info className="shrink-0 mt-0.5 text-blue-600" size={18} />
        <div className="text-xs">
          <p className="font-bold text-blue-900">Sincronização em Nuvem (Cloudflare + Supabase)</p>
          <p className="text-blue-700 mt-0.5 leading-relaxed">
            Neste ambiente demonstrativo os planos operam com armazenamento local mock. Na integração com
            Cloudflare Workers e Supabase, as assinaturas e webhooks de pagamento (Stripe/Asaas) serão sincronizados automaticamente.
          </p>
        </div>
      </div>

      {/* Plan Cards Grid: 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-1">
        {plans.map((plan) => {
          const userCount = allUsers.filter((u) => u.plan === plan.slug).length;
          const isPopular = plan.slug === 'pro';

          return (
            <Card
              key={plan.id}
              className={`bg-white border relative overflow-hidden flex flex-col rounded-2xl shadow-xs transition-all hover:shadow-md ${
                isPopular
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/10'
                  : 'border-slate-200/90'
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-bl-xl z-10 shadow-xs flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Mais Popular</span>
                </div>
              )}

              <CardHeader className="p-4 sm:p-5 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base sm:text-lg font-black text-slate-900">
                    {plan.name}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-slate-400">
                  Recursos e limites deste nível
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 pt-0 flex-1 flex flex-col">
                {/* Price Display */}
                <div className="mb-4 pb-4 border-b border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {fmt(plan.price_monthly ?? plan.price ?? 0)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 ml-1">/mês</span>
                  </div>

                  {/* Active merchants count */}
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                    <Users size={11} />
                    <span>{userCount} {userCount === 1 ? 'loja' : 'lojas'}</span>
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link to Settings */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link
                    to="/admin/configuracoes"
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-200/80 hover:border-blue-600 shadow-xs"
                  >
                    <Settings size={13} />
                    <span>Editar Regras & Preço</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
