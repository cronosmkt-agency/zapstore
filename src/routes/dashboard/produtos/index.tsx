import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  ImageIcon,
  Package,
  Layers,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { canAddProduct, planLimits } from '@/lib/planLimits';
import { toast } from 'sonner';

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const Route = createFileRoute('/dashboard/produtos/')({
  component: ProdutosList,
});

function ProdutosList() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('Todos');

  useEffect(() => {
    if (session) {
      loadProducts();
    }
  }, [session]);

  const loadProducts = () => {
    if (session) {
      const data = db.products.getByProfileId(session.userId);
      setProducts(data);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    db.products.update(id, { is_available: !currentStatus });
    loadProducts();
    toast.success(!currentStatus ? 'Produto visível no catálogo' : 'Produto desativado do catálogo');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      db.products.softDelete(id);
      loadProducts();
      toast.success('Produto excluído com sucesso');
    }
  };

  if (!session) return null;

  const userCats = db.categories
    .getByProfileId(session.userId)
    .filter((c) => c.name.toLowerCase() !== 'todos' && c.slug.toLowerCase() !== 'todos');
  const categories = [
    'Todos',
    ...Array.from(new Set([...userCats.map((c) => c.name), ...products.map((p) => p.category_name).filter(Boolean)])),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'Todos' || p.category_name === selectedCat;
    return matchesSearch && matchesCat;
  });

  const canAdd = canAddProduct(session.user.plan_slug, products.length);
  const limit = planLimits[session.user.plan_slug].products;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* ─── Top Header & Controls ──────────────────────────────── */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Produtos do Catálogo
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                {products.length} {products.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {limit === Infinity || limit >= 99999
                ? 'Seu plano permite produtos ilimitados cadastrados.'
                : `${products.length} de ${limit} produtos utilizados no seu plano.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/configuracoes"
              search={{ tab: 'categorias' } as any}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200/80 transition shadow-xs cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Categorias</span>
            </Link>

            {canAdd ? (
              <Link
                to="/dashboard/produtos/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Produto</span>
              </Link>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-200 text-slate-400 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-not-allowed"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Limite Atingido</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between pt-1 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por modelo ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 transition-all shadow-xs"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat as string)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!canAdd && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="text-xs">
            <h4 className="font-bold text-sm text-amber-900">Limite de produtos atingido</h4>
            <p className="mt-0.5 text-amber-700">Faça upgrade do seu plano para cadastrar mais produtos na sua loja.</p>
            <Link to="/dashboard/planos" className="font-bold text-amber-800 underline mt-1 inline-block">
              Ver planos disponíveis &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* ─── MOBILE CARDS VIEW (md:hidden) — No horizontal scrolling! ─── */}
      <div className="md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-bold text-slate-600">Nenhum produto encontrado.</p>
            <Link to="/dashboard/produtos/novo" className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block">
              Cadastrar novo produto &rarr;
            </Link>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const specsObj: Record<string, any> =
              Array.isArray(product.specs)
                ? Object.fromEntries((product.specs as any[]).map((s) => [s.key || s.name, s.value]))
                : product.specs || {};

            return (
              <div
                key={product.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col gap-3"
              >
                {/* Top: Image + Info + Price */}
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-1 flex shrink-0 items-center justify-center overflow-hidden">
                    {product.primary_image ? (
                      <img src={product.primary_image} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {product.category_name || 'Geral'}
                      </span>
                      {product.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 mt-1 truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-black text-blue-600">{fmt(product.price)}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        {product.quantity > 0 ? `${product.quantity} un.` : 'Esgotado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Status Toggle + Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(product.id, product.is_available)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                        product.is_available ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                          product.is_available ? 'translate-x-4.5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-bold text-slate-600">
                      {product.is_available ? 'Ativo na Loja' : 'Oculto'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to="/dashboard/produtos/$id"
                      params={{ id: product.id }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Edit2 size={13} />
                      <span>Editar</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Excluir produto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── DESKTOP/TABLET TABLE VIEW (hidden md:block) ─────────── */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 w-16">Foto</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 bg-white">
                    <p className="text-sm font-medium">Nenhum produto cadastrado com os filtros atuais.</p>
                    <Link to="/dashboard/produtos/novo" className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block">
                      Cadastrar primeiro produto &rarr;
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      {product.primary_image ? (
                        <img
                          src={product.primary_image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200/80 p-0.5"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {product.category_name || 'Geral'}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-black text-blue-600 text-base">
                      {fmt(product.price)}
                    </td>
                    <td className="p-4">
                      {product.quantity > 0 ? (
                        <span className="text-slate-700 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
                          {product.quantity} un.
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Esgotado
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product.id, product.is_available)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          product.is_available ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={product.is_available ? 'Desativar produto' : 'Ativar produto'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                            product.is_available ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/dashboard/produtos/$id"
                          params={{ id: product.id }}
                          className="p-2 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-xl transition"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
