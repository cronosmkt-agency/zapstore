import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { db } from '@/lib/mockDb';
import { planBadgeClass, planLabel } from '@/lib/planLimits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  CreditCard,
  Activity,
  Package,
  ArrowRight,
  TrendingUp,
  Store,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    mrr: 0,
    totalProducts: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    setStats({
      totalUsers: db.stats.totalUsers(),
      activeUsers: db.stats.activeUsers(),
      mrr: db.stats.mrr(),
      totalProducts: db.stats.totalProducts(),
    });

    setActivities(db.activityLogs.getAll().slice(0, 10));

    // Top 5 recent users (excluding admin)
    const users = db.profiles
      .getAll()
      .filter((u) => !u.is_admin)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    setRecentUsers(users);
  }, []);

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Visão Geral da Plataforma
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhe o faturamento, crescimento de lojistas e atividades em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/usuarios"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Users size={14} />
            <span>Gerenciar Lojistas</span>
          </Link>
        </div>
      </div>

      {/* KPIs Grid (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Lojistas */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-5 pb-2">
            <CardTitle className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Lojistas
            </CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalUsers}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>Lojas cadastradas</span>
            </p>
          </CardContent>
        </Card>

        {/* Lojistas Pagantes */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-5 pb-2">
            <CardTitle className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assinantes
            </CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-black text-emerald-600">{stats.activeUsers}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Starter / Pro / Ent</p>
          </CardContent>
        </Card>

        {/* MRR */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-5 pb-2">
            <CardTitle className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              MRR Mensal
            </CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900">{fmt(stats.mrr)}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Recorrência ativa</p>
          </CardContent>
        </Card>

        {/* Total de Produtos */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-5 pb-2">
            <CardTitle className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Itens em Estoque
            </CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalProducts}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Em todas as vitrines</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Users + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Recent Users Table */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-4 sm:p-5">
            <div>
              <CardTitle className="text-sm sm:text-base font-black text-slate-900">
                Lojistas Recentes
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Últimos usuários cadastrados na plataforma</p>
            </div>
            <Link
              to="/admin/usuarios"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
            >
              <span>Ver todos</span>
              <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile Cards (md:hidden) */}
            <div className="md:hidden divide-y divide-slate-100">
              {recentUsers.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-medium">
                  Nenhum lojista encontrado.
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                        {(user.display_name || user.full_name || 'L').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {user.display_name || user.full_name || 'Sem nome'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono truncate block">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${planBadgeClass(user.plan)}`}>
                        {planLabel(user.plan)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {db.products.getByProfileId(user.id).length} itens
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop / Tablet Table (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-5 py-3 font-bold">Lojista</th>
                    <th className="px-4 sm:px-5 py-3 font-bold">Plano</th>
                    <th className="px-4 sm:px-5 py-3 font-bold">Produtos</th>
                    <th className="px-4 sm:px-5 py-3 font-bold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-xs font-medium">
                        Nenhum lojista encontrado.
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 sm:px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold text-xs truncate max-w-[180px]">
                              {user.display_name || user.full_name || 'Sem nome'}
                            </span>
                            <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                              {user.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${planBadgeClass(
                              user.plan
                            )}`}
                          >
                            {planLabel(user.plan)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 text-slate-700 font-semibold text-xs whitespace-nowrap">
                          {db.products.getByProfileId(user.id).length} itens
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 p-4 sm:p-5">
            <CardTitle className="text-sm sm:text-base font-black text-slate-900">
              Atividade Recente
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Logs de eventos e ações do sistema</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-3">
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Nenhuma atividade recente.</p>
              ) : (
                activities.map((log) => {
                  const user = db.profiles.getById(log.profile_id || (log as any).user_id);
                  return (
                    <div
                      key={log.id}
                      className="flex gap-2.5 items-start border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Activity size={12} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">{log.action}</span>
                        <span className="text-[10px] text-slate-400">
                          {user?.display_name || 'Usuário'} •{' '}
                          {new Date(log.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
