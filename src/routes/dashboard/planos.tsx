import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import {
  ShieldCheck,
  Check,
  Sparkles,
  Zap,
  HelpCircle,
  ArrowRight,
  MessageCircle,
  Percent,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { planLabel, planBadgeClass } from '@/lib/planLimits';
import { useState } from 'react';

export const Route = createFileRoute('/dashboard/planos')({
  component: PlansPage,
});

function PlansPage() {
  const { session } = useAuth();
  const plans = db.plans.getAll();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!session) return null;
  const currentPlan = session.user.plan_slug;
  const storeSettings = db.storeSettings.getByProfileId(session.userId);
  const storeName = storeSettings?.store_name || session.user.display_name || 'Minha Loja';
  const platform = db.platformSettings.get();
  const supportWhatsapp = (platform?.support_whatsapp || '5521964639999').replace(/\D/g, '');

  const handleUpgradeClick = (planName: string) => {
    const message = encodeURIComponent(
      `Olá, equipe ZapStore! Tenho a loja "${storeName}" (link: zapstore.com/${session.user.slug}) e gostaria de fazer upgrade para o plano ${planName}. Como posso proceder com a ativação?`
    );
    const waUrl = `https://wa.me/${supportWhatsapp}?text=${message}`;

    toast.info('Solicitação de Upgrade', {
      description: `Entrando em contato com nossa equipe para ativar o plano ${planName}.`,
      action: {
        label: 'Abrir WhatsApp',
        onClick: () => window.open(waUrl, '_blank'),
      },
    });

    window.open(waUrl, '_blank');
  };

  const faqs = [
    {
      q: 'Existe taxa ou comissão sobre as minhas vendas?',
      a: 'Não! Cobramos 0% de comissão. Todo o valor das vendas realizadas pelo WhatsApp ou na sua loja física vai 100% para o seu bolso.',
    },
    {
      q: 'Posso alterar meu plano a qualquer momento?',
      a: 'Sim, você pode fazer upgrade ou downgrade quando desejar, sem fidelidade e sem taxas de cancelamento.',
    },
    {
      q: 'Como funciona o Domínio Próprio?',
      a: 'A partir do plano Pro, você pode conectar seu próprio endereço (ex: www.sualoja.com.br). Nós auxiliamos em toda a configuração de DNS e certificado SSL.',
    },
    {
      q: 'O suporte está incluso?',
      a: 'Sim! Todos os planos contam com suporte direto via WhatsApp para tirar dúvidas e ajudar a impulsionar sua loja.',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* ─── Top Header Card ─────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Planos & Assinatura
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${planBadgeClass(currentPlan)}`}
            >
              Plano Atual: {planLabel(currentPlan)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Escolha o plano ideal para acelerar as vendas da sua loja. Comece sem custo e evolua conforme seu negócio cresce, com 0% de taxas por venda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleUpgradeClick('Pro')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Falar com Consultor</span>
          </button>
        </div>
      </div>

      {/* ─── 3 Value Proposition Chips ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex shrink-0 items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">0% de Comissões</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Você fica com 100% do lucro de cada venda.</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex shrink-0 items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Vendas no WhatsApp</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Clientes compram direto pelo seu mensageiro.</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex shrink-0 items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Ativação Instantânea</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Sem burocracia, catálogo liberado na hora.</p>
          </div>
        </div>
      </div>

      {/* ─── Plan Cards Grid (Mobile 1-col, Desktop 3-col) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {plans.map((plan) => {
          const isCurrent = plan.slug === currentPlan;
          const isPopular = plan.slug === 'pro';
          const price = plan.price_monthly ?? plan.price ?? 0;
          const priceDisplay = price === 0 ? 'Grátis' : price % 1 === 0 ? price.toFixed(0) : price.toFixed(2).replace('.', ',');

          return (
            <div
              key={plan.id}
              className={`relative bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col justify-between shadow-xs ${
                isCurrent
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : isPopular
                    ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-lg shadow-blue-500/10'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Badges */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Plano Atual</span>
                </div>
              )}

              {!isCurrent && isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Mais Popular</span>
                </div>
              )}

              <div>
                {/* Header: Name + Price */}
                <div className="mb-5 pt-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1 flex items-center gap-1.5">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {price === 0 ? (
                        'Grátis'
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-slate-500 mr-0.5">R$</span>
                          {priceDisplay}
                        </>
                      )}
                    </span>
                    {price > 0 && (
                      <span className="text-slate-400 text-xs font-semibold">/mês</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {price === 0
                      ? 'Sem mensalidade, use sempre'
                      : 'Sem taxa de setup, cancele quando quiser'}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    O que está incluso:
                  </span>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-left">
                      <div className="mt-0.5 p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleUpgradeClick(plan.name)}
                  disabled={isCurrent}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default opacity-90'
                      : isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 active:scale-98'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-98'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Plano Atual</span>
                    </>
                  ) : (
                    <>
                      <span>Mudar para {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Frequently Asked Questions (FAQ) Accordion ─────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 lg:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-black text-slate-900 text-sm sm:text-base">
            Perguntas Frequentes sobre os Planos
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 text-base">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── WhatsApp Help & Custom Enterprise Banner ───────────── */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm sm:text-base">
              Precisa de ajuda ou plano personalizado?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Fale diretamente com nossos especialistas. Ajudamos a escolher o plano ideal para sua operação.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleUpgradeClick('Personalizado')}
          className="w-full sm:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Falar no WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
