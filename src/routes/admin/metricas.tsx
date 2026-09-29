import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Info, TrendingUp, Users, DollarSign, PieChart as PieIcon } from 'lucide-react';
import { db } from '@/lib/mockDb';

export const Route = createFileRoute('/admin/metricas')({
  component: AdminMetricsPage,
});

const COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6'];

function AdminMetricsPage() {
  const users = db.profiles.getAll().filter((u) => !u.is_admin);

  const planDistribution = [
    { name: 'Grátis', value: users.filter((u) => u.plan === 'free').length },
    { name: 'Starter', value: users.filter((u) => u.plan === 'starter').length },
    { name: 'Pro', value: users.filter((u) => u.plan === 'pro').length },
  ].filter((d) => d.value > 0);

  const paidUsersCount = users.filter((u) => u.plan !== 'free').length;
  const conversionRate = users.length > 0 ? Math.round((paidUsersCount / users.length) * 100) : 0;

  // Mock growth data for the last 6 months
  const growthData = [
    { name: 'Jan', usuarios: 4 },
    { name: 'Fev', usuarios: 8 },
    { name: 'Mar', usuarios: 14 },
    { name: 'Abr', usuarios: 22 },
    { name: 'Mai', usuarios: 35 },
    { name: 'Jun', usuarios: Math.max(users.length, 48) },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Métricas da Plataforma
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Análise de crescimento, adesão a planos e distribuição de lojistas.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex gap-3 text-blue-900 shadow-xs">
        <Info className="shrink-0 mt-0.5 text-blue-600" size={18} />
        <div className="text-xs">
          <p className="font-bold text-blue-900">Métricas em Tempo Real</p>
          <p className="text-blue-700 mt-0.5 leading-relaxed">
            Dados calculados a partir dos registros mock locais. Na esteira de produção com Cloudflare Workers e Supabase, as métricas incluirão retenção de coorte, churn, CAC e taxas de conversão de visitantes para compras no WhatsApp.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Lojistas Pagantes
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{paidUsersCount}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            {paidUsersCount} de {users.length} usuários
          </p>
        </Card>

        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Taxa de Conversão
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">{conversionRate}%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Free para Planos Pagos</p>
        </Card>

        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Projeção Anual (ARR)
            </span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {(db.stats.mrr() * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Baseado no MRR atual</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Pie Chart: Plan Distribution */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <PieIcon size={16} className="text-blue-600" />
              <CardTitle className="text-sm sm:text-base font-black text-slate-900">
                Distribuição por Plano
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-72 sm:h-80 p-3 sm:p-6 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution.length > 0 ? planDistribution : [{ name: 'Sem dados', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    color: '#0f172a',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Growth */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              <CardTitle className="text-sm sm:text-base font-black text-slate-900">
                Crescimento de Lojistas (6 meses)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-72 sm:h-80 p-3 sm:p-6 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={growthData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  axisLine={false}
                  tickLine={false}
                  fontSize={11}
                />
                <YAxis
                  stroke="#94a3b8"
                  axisLine={false}
                  tickLine={false}
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    color: '#0f172a',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="usuarios" name="Lojistas" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
