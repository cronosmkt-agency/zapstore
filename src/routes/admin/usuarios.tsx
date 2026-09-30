import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import { Profile, PlanSlug } from '@/types';
import { planBadgeClass, planLabel } from '@/lib/planLimits';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Search,
  Store,
  ExternalLink,
  Users,
  CheckCircle2,
  XCircle,
  Settings2,
  Key,
  Shield,
  X,
  Save,
  Package,
  Sparkles,
  Lock,
  LogIn,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/usuarios')({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState<PlanSlug | 'all'>('all');

  // Modal State for Managing a Merchant
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editPlan, setEditPlan] = useState<PlanSlug>('free');
  const [editActive, setEditActive] = useState(true);
  const [newPassword, setNewPassword] = useState('');

  const { impersonate } = useAuth();
  const navigate = useNavigate();

  const handleImpersonateUser = (user: Profile) => {
    const result = impersonate(user.id);
    if (result) {
      toast.success(`Entrando como ${user.display_name || user.email}`, {
        description: 'Você está no modo de suporte do administrador.',
      });
      navigate({ to: '/dashboard' });
    } else {
      toast.error('Erro ao acessar a conta do lojista.');
    }
  };

  const handleImpersonateAndConfigure = (user: Profile) => {
    const result = impersonate(user.id);
    if (result) {
      toast.success(`Abrindo configurações de ${user.display_name || user.email}`, {
        description: 'Você está no modo de suporte editando a loja.',
      });
      navigate({ to: '/dashboard/configuracoes' });
    } else {
      toast.error('Erro ao acessar a conta do lojista.');
    }
  };

  const loadUsers = () => {
    const all = db.profiles.getAll().filter((u) => !u.is_admin);
    setUsers(all);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openManageModal = (user: Profile) => {
    setSelectedUser(user);
    setEditName(user.display_name || '');
    setEditSlug(user.slug || '');
    setEditPlan(user.plan);
    setEditActive(user.is_active);
    setNewPassword('');
  };

  const closeManageModal = () => {
    setSelectedUser(null);
  };

  const handleSaveUserDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Check slug collision if slug changed
    if (editSlug.trim() !== selectedUser.slug) {
      const isAvailable = db.profiles.slugAvailable(editSlug.trim(), selectedUser.id);
      if (!isAvailable) {
        toast.error('Este link/slug já está em uso por outra loja!');
        return;
      }
    }

    db.profiles.update(selectedUser.id, {
      display_name: editName.trim() || selectedUser.display_name,
      slug: editSlug.trim().toLowerCase() || selectedUser.slug,
      plan: editPlan,
      is_active: editActive,
    });

    toast.success(`Loja ${editName || selectedUser.slug} atualizada com sucesso!`);
    loadUsers();
    closeManageModal();
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    db.passwords.set(selectedUser.email, newPassword);
    toast.success(`Senha do lojista ${selectedUser.email} redefinida com sucesso!`);
    setNewPassword('');
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.display_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.slug?.toLowerCase() || '').includes(search.toLowerCase());

    const matchesPlan = filterPlan === 'all' || u.plan === filterPlan;

    return matchesSearch && matchesPlan;
  });

  const toggleActive = (id: string, current: boolean) => {
    db.profiles.update(id, { is_active: !current });
    toast.success(!current ? 'Lojista ativado com sucesso!' : 'Lojista suspenso.');
    loadUsers();
  };

  const activeCount = users.filter((u) => u.is_active).length;
  const suspendedCount = users.filter((u) => !u.is_active).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gerenciamento de Lojistas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize, altere planos, redefina senhas e controle o acesso de cada loja.
          </p>
        </div>

        {/* Quick summary chips */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs">
            Total: <strong>{users.length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            Ativos: <strong>{activeCount}</strong>
          </span>
          {suspendedCount > 0 && (
            <span className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              Inativos: <strong>{suspendedCount}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nome, email ou slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 focus:outline-none transition shadow-xs"
          />
        </div>

        {/* Plan Filters Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'free', 'starter', 'pro'].map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setFilterPlan(plan as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterPlan === plan
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {plan === 'all' ? 'Todos' : planLabel(plan as PlanSlug)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="bg-white border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Mobile Cards View (md:hidden) */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                Nenhum lojista encontrado para os filtros selecionados.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const productsCount = db.products.getByProfileId(user.id).length;
                return (
                  <div key={user.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 font-bold text-sm">
                          {user.display_name?.charAt(0).toUpperCase() || 'L'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-slate-900 font-bold text-xs sm:text-sm block truncate">
                            {user.display_name || 'Sem nome'}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono block truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          user.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${planBadgeClass(
                            user.plan
                          )}`}
                        >
                          {planLabel(user.plan)}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {productsCount} itens
                        </span>
                      </div>

                      {user.slug && (
                        <a
                          href={`/${user.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100"
                        >
                          <Store size={12} />
                          <span>/{user.slug}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openManageModal(user)}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                      >
                        <Settings2 size={13} />
                        <span>Gerenciar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(user.id, user.is_active)}
                        className={`text-xs font-bold py-2 rounded-xl transition cursor-pointer text-center ${
                          user.is_active
                            ? 'text-rose-600 hover:bg-rose-50 border border-rose-200 bg-white'
                            : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200 bg-white'
                        }`}
                      >
                        {user.is_active ? 'Suspender' : 'Ativar Loja'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImpersonateUser(user)}
                        className="col-span-2 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition cursor-pointer shadow-xs"
                      >
                        <LogIn size={14} />
                        <span>Acessar Painel do Lojista</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop/Tablet Table (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200/80">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5 font-bold">Lojista</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold">Link da Loja</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold">Plano</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold">Produtos</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold">Status</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-xs font-medium">
                      Nenhum lojista encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const productsCount = db.products.getByProfileId(user.id).length;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 font-bold text-xs">
                              {user.display_name?.charAt(0).toUpperCase() || 'L'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-slate-900 font-bold text-xs truncate max-w-[160px] sm:max-w-none">
                                {user.display_name || 'Sem nome'}
                              </span>
                              <span className="text-slate-400 text-[11px] truncate max-w-[160px] sm:max-w-none">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {user.slug ? (
                            <a
                              href={`/${user.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition"
                            >
                              <Store size={13} />
                              <span>/{user.slug}</span>
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-block ${planBadgeClass(
                              user.plan
                            )}`}
                          >
                            {planLabel(user.plan)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-slate-700 font-semibold text-xs whitespace-nowrap">
                          {productsCount} itens
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              user.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {user.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 sm:gap-2">
                            <button
                              type="button"
                              onClick={() => handleImpersonateUser(user)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-xs"
                              title="Acessar painel deste lojista como administrador"
                            >
                              <LogIn size={13} />
                              <span>Acessar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleImpersonateAndConfigure(user)}
                              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-xs"
                              title="Abrir configurações de identidade, visual e catálogo desta loja"
                            >
                              <SlidersHorizontal size={13} />
                              <span>Configurar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openManageModal(user)}
                              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-xs"
                            >
                              <Settings2 size={13} />
                              <span>Gerenciar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleActive(user.id, user.is_active)}
                              className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                                user.is_active
                                  ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                                  : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                              }`}
                              title={user.is_active ? 'Suspender loja' : 'Ativar loja'}
                            >
                              {user.is_active ? 'Suspender' : 'Ativar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ─── MODAL: GERENCIAR LOJISTA ───────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={closeManageModal}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {selectedUser.display_name?.charAt(0).toUpperCase() || 'L'}
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Gerenciar: {selectedUser.display_name || selectedUser.slug}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[220px] sm:max-w-none">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeManageModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left">
              {/* Quick Store Link & Impersonate */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">
                    Produtos: <strong>{db.products.getByProfileId(selectedUser.id).length} itens</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleImpersonateUser(selectedUser)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <LogIn size={12} />
                    <span>Acessar Painel</span>
                  </button>
                  {selectedUser.slug && (
                    <a
                      href={`/${selectedUser.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-xs"
                    >
                      <span>Ver Loja</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Support Mode Card */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block">Modo Suporte do Administrador</span>
                    <span className="text-[11px] text-slate-500 block">
                      Acesse a loja deste lojista para ajustar configurações e produtos diretamente.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleImpersonateUser(selectedUser)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <LogIn size={13} />
                    <span>Painel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImpersonateAndConfigure(selectedUser)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <SlidersHorizontal size={13} />
                    <span>Configurações</span>
                  </button>
                </div>
              </div>

              {/* Form: Store & Plan Details */}
              <form onSubmit={handleSaveUserDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Nome da Loja</Label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ex: Terephones"
                      className="h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Link / Slug da Loja</Label>
                    <div className="flex items-center">
                      <span className="text-xs text-slate-400 px-2 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">/</span>
                      <Input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="minha-loja"
                        className="h-10 text-xs rounded-l-none rounded-r-xl bg-slate-50 border-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Plano de Assinatura</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['free', 'starter', 'pro'] as PlanSlug[]).map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setEditPlan(plan)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          editPlan === plan
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-black shadow-xs ring-1 ring-blue-600'
                            : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 text-xs font-semibold'
                        }`}
                      >
                        <span className="text-xs block capitalize">{planLabel(plan)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active switch */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Status da Loja</span>
                    <span className="text-[11px] text-slate-400">
                      {editActive ? 'Loja visível ao público e lojista com acesso' : 'Loja desativada e bloqueada'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editActive}
                      onChange={(e) => setEditActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save size={15} />
                    <span>Salvar Dados e Plano do Lojista</span>
                  </Button>
                </div>
              </form>

              {/* Password Reset Section */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-bold text-slate-800">Redefinir Senha de Acesso</h3>
                </div>
                <p className="text-[11px] text-slate-400">
                  Defina uma nova senha para este lojista caso ele tenha esquecido ou solicitado alteração.
                </p>

                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nova senha (ex: 12345678)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9 text-xs rounded-xl bg-slate-50 border-slate-200 font-mono"
                  />
                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    variant="outline"
                    className="h-9 px-3 text-xs font-bold rounded-xl border-slate-300 hover:bg-slate-100 shrink-0 cursor-pointer"
                  >
                    <Key size={13} className="mr-1 text-slate-600" />
                    <span>Redefinir</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
