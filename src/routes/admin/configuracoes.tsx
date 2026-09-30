import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { db } from '@/lib/mockDb';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Settings,
  Shield,
  Save,
  Check,
  Building,
  Key,
  DollarSign,
  Smartphone,
  Store,
  LogOut,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { PlanSlug } from '@/types';

export const Route = createFileRoute('/admin/configuracoes')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'payments' | 'plans' | 'platform' | 'account'>('payments');

  // Platform Settings State
  const [platform, setPlatform] = useState(() => db.platformSettings.get());

  // Plans state
  const [plans, setPlans] = useState(() => db.plans.getAll());
  const [editingPlanSlug, setEditingPlanSlug] = useState<PlanSlug>('pro');

  const selectedPlan = plans.find((p) => p.slug === editingPlanSlug) || plans[0];

  const [planPrice, setPlanPrice] = useState<number>(selectedPlan?.price_monthly ?? 0);
  const [planMaxProducts, setPlanMaxProducts] = useState<number>(
    selectedPlan?.limits?.products ?? selectedPlan?.max_products ?? 10
  );
  const [planMaxImages, setPlanMaxImages] = useState<number>(selectedPlan?.limits?.images_per_product ?? 5);
  const [planCustomDomain, setPlanCustomDomain] = useState<boolean>(
    selectedPlan?.limits?.custom_domain ?? true
  );

  useEffect(() => {
    if (selectedPlan) {
      setPlanPrice(selectedPlan.price_monthly ?? selectedPlan.price ?? 0);
      setPlanMaxProducts(selectedPlan.limits?.products ?? selectedPlan.max_products ?? 10);
      setPlanMaxImages(selectedPlan.limits?.images_per_product ?? 5);
      setPlanCustomDomain(selectedPlan.limits?.custom_domain ?? false);
    }
  }, [editingPlanSlug]);

  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    db.platformSettings.save(platform);
    toast.success('Configurações da plataforma salvas com sucesso!');
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const updated = db.plans.update(editingPlanSlug, {
      price_monthly: Number(planPrice),
      price: Number(planPrice),
      max_products: Number(planMaxProducts),
      limits: {
        ...selectedPlan.limits,
        products: Number(planMaxProducts),
        images_per_product: Number(planMaxImages),
        custom_domain: Boolean(planCustomDomain),
      },
    });

    if (updated) {
      setPlans(db.plans.getAll());
      toast.success(`Plano ${selectedPlan.name} atualizado com sucesso!`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Configurações do Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gerencie integrações de pagamento, precificação de planos e parâmetros gerais do SaaS.
          </p>
        </div>
      </div>

      {/* Tabs Bar (Horizontally scrollable on mobile) */}
      <div className="flex gap-1.5 sm:gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <CreditCard size={15} />
          <span>Pagamentos & Gateways</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'plans'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <DollarSign size={15} />
          <span>Regras dos Planos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('platform')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'platform'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Settings size={15} />
          <span>Plataforma & Suporte</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'account'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Shield size={15} />
          <span>Conta Super Admin</span>
        </button>
      </div>

      {/* ─── TAB 1: PAYMENTS & GATEWAYS ─────────────────────────── */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSavePlatform} className="space-y-5">
          <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden text-left">
            <CardHeader className="p-4 sm:p-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard size={18} />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Provedores de Pagamento das Assinaturas
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Configure os gateways para receber as assinaturas dos lojistas via PIX, Cartão e Boleto.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* Gateway selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Provedor Principal</Label>
                  <select
                    value={platform.payment_gateway}
                    onChange={(e) => setPlatform({ ...platform, payment_gateway: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600"
                  >
                    <option value="asaas">Asaas (PIX Instantâneo, Boleto & Cartão)</option>
                    <option value="mercadopago">Mercado Pago</option>
                    <option value="pix">PIX Direto na Chave</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Ambiente de Operação</Label>
                  <select
                    value={platform.payment_mode}
                    onChange={(e) => setPlatform({ ...platform, payment_mode: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600"
                  >
                    <option value="sandbox">Sandbox (Ambiente de Testes)</option>
                    <option value="live">Produção (Pagamentos Reais)</option>
                  </select>
                </div>
              </div>

              {/* PIX Key */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Chave PIX da Plataforma (Recebimento Direto)
                </Label>
                <Input
                  value={platform.pix_key}
                  onChange={(e) => setPlatform({ ...platform, pix_key: e.target.value })}
                  placeholder="CNPJ, E-mail ou Chave Aleatória"
                  className="h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                />
                <p className="text-[11px] text-slate-400">
                  Exibida quando um lojista optar por pagar a assinatura via transferência PIX.
                </p>
              </div>

              {/* Asaas API Key */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  API Key / Token de Acesso (Asaas ou Mercado Pago)
                </Label>
                <Input
                  type="password"
                  value={platform.asaas_api_key}
                  onChange={(e) => setPlatform({ ...platform, asaas_api_key: e.target.value })}
                  placeholder="$aact_YTU5YTE0M2M6N2Zm..."
                  className="h-10 bg-slate-50 border-slate-200 text-xs font-mono rounded-xl"
                />
                <p className="text-[11px] text-slate-400">
                  Chave de autorização utilizada pelos Cloudflare Workers para emitir faturas e PIX Copia-e-Cola automático.
                </p>
              </div>

              {/* Webhook Secret */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Webhook Secret para Confirmação Automática
                </Label>
                <Input
                  type="password"
                  value={platform.stripe_webhook_secret || ''}
                  onChange={(e) => setPlatform({ ...platform, stripe_webhook_secret: e.target.value })}
                  placeholder="whsec_..."
                  className="h-10 bg-slate-50 border-slate-200 text-xs font-mono rounded-xl"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-5 h-10 shadow-xs cursor-pointer">
                  <Save size={14} className="mr-1.5" />
                  <span>Salvar Configurações de Pagamento</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* ─── TAB 2: PLANS RULES & LIMITS ────────────────────────── */}
      {activeTab === 'plans' && (
        <div className="space-y-5">
          <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden text-left">
            <CardHeader className="p-4 sm:p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Editar Regras e Valores dos Planos
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Defina o preço mensal e as permissões de cada nível oferecido aos lojistas.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-5">
              {/* Select Plan to Edit */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Selecione o Plano para Editar:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {plans.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setEditingPlanSlug(p.slug)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        editingPlanSlug === p.slug
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 block">{p.name}</span>
                      <span className="text-[11px] text-blue-600 font-black">
                        {p.price_monthly ? `R$ ${p.price_monthly}/mês` : 'Grátis'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit Form for selected plan */}
              <form onSubmit={handleSavePlan} className="space-y-4 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Preço Mensal (R$)</Label>
                    <Input
                      type="number"
                      value={planPrice}
                      onChange={(e) => setPlanPrice(Number(e.target.value))}
                      className="h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                      min={0}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Limite de Produtos</Label>
                    <Input
                      type="number"
                      value={planMaxProducts}
                      onChange={(e) => setPlanMaxProducts(Number(e.target.value))}
                      className="h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                      placeholder="-1 para ilimitado"
                    />
                    <span className="text-[10px] text-slate-400">Digite -1 para produtos ilimitados</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Fotos por Produto</Label>
                    <Input
                      type="number"
                      value={planMaxImages}
                      onChange={(e) => setPlanMaxImages(Number(e.target.value))}
                      className="h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                      min={1}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={planCustomDomain}
                      onChange={(e) => setPlanCustomDomain(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Permitir Apontamento de Domínio Próprio (.com.br) neste plano</span>
                  </label>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-5 h-10 shadow-xs cursor-pointer">
                    <Save size={14} className="mr-1.5" />
                    <span>Salvar Alterações do Plano {selectedPlan.name}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── TAB 3: PLATFORM & BRANDING ─────────────────────────── */}
      {activeTab === 'platform' && (
        <form onSubmit={handleSavePlatform} className="space-y-5">
          <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden text-left">
            <CardHeader className="p-4 sm:p-6 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Parâmetros Gerais do SaaS & Contato Central
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Informações visíveis em e-mails automáticos, suporte e cabeçalhos.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Nome da Plataforma</Label>
                  <Input
                    value={platform.platform_name}
                    onChange={(e) => setPlatform({ ...platform, platform_name: e.target.value })}
                    className="h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">WhatsApp de Suporte aos Lojistas</Label>
                  <Input
                    value={platform.support_whatsapp}
                    onChange={(e) => setPlatform({ ...platform, support_whatsapp: e.target.value })}
                    className="h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Global Banner for Merchants */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-700">
                    Aviso Global para todos os Lojistas no Painel
                  </Label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-blue-600">
                    <input
                      type="checkbox"
                      checked={platform.global_banner_enabled}
                      onChange={(e) => setPlatform({ ...platform, global_banner_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Ativar Banner</span>
                  </label>
                </div>
                <Input
                  value={platform.global_banner_message || ''}
                  onChange={(e) => setPlatform({ ...platform, global_banner_message: e.target.value })}
                  placeholder="Ex: Atualização programada hoje às 23h para melhorias no PIX automático."
                  className="h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-5 h-10 shadow-xs cursor-pointer">
                  <Save size={14} className="mr-1.5" />
                  <span>Salvar Parâmetros da Plataforma</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* ─── TAB 4: ACCOUNT & ACCESS ────────────────────────────── */}
      {activeTab === 'account' && (
        <div className="space-y-5">
          <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden text-left">
            <CardHeader className="p-4 sm:p-6 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Conta do Administrador Geral
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Credenciais e atalhos rápidos de navegação no sistema.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    E-mail do Administrador
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{session?.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold w-fit">
                  Privilégio Super Admin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  to="/dashboard"
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center gap-3 font-bold text-xs text-slate-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Store size={16} />
                  </div>
                  <div>
                    <span>Ir para o Painel do Lojista</span>
                    <p className="text-[11px] text-slate-400 font-normal">Acessar dashboard da sua loja</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition flex items-center gap-3 font-bold text-xs text-rose-700 text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <LogOut size={16} />
                  </div>
                  <div>
                    <span>Encerrar Sessão</span>
                    <p className="text-[11px] text-rose-500 font-normal">Fazer logout seguro do sistema</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
