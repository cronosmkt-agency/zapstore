import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import { useState, useEffect } from 'react';
import { StoreReview } from '@/types';
import {
  Star,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/avaliacoes')({
  component: ReviewsPage,
});

function ReviewsPage() {
  const { session } = useAuth();
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'visible' | 'hidden'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newReview, setNewReview] = useState({
    author_name: '',
    neighborhood: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (session) {
      loadReviews();
    }
  }, [session]);

  const loadReviews = () => {
    if (session) {
      const data = db.reviews.getByProfileId(session.userId);
      setReviews(data);
    }
  };

  const handleToggleVisible = (id: string, current: boolean) => {
    db.reviews.update(id, { is_visible: !current });
    loadReviews();
    toast.success(!current ? 'Avaliação agora está visível na vitrine!' : 'Avaliação ocultada da vitrine.');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir o depoimento de "${name}"?`)) {
      db.reviews.delete(id);
      loadReviews();
      toast.success('Avaliação excluída com sucesso.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!newReview.author_name.trim() || !newReview.comment.trim()) {
      toast.error('Preencha o nome do cliente e o comentário.');
      return;
    }
    db.reviews.create({
      profile_id: session.userId,
      author_name: newReview.author_name.trim(),
      neighborhood: newReview.neighborhood.trim() || 'Cliente Satisfeito',
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      is_visible: true,
      sort_order: 0,
    });
    setNewReview({ author_name: '', neighborhood: '', rating: 5, comment: '' });
    setShowAddForm(false);
    loadReviews();
    toast.success('Avaliação adicionada com sucesso!');
  };

  if (!session) return null;

  const visibleCount = reviews.filter((r) => r.is_visible).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

  const filteredReviews = reviews.filter((r) => {
    if (filterMode === 'visible') return r.is_visible;
    if (filterMode === 'hidden') return !r.is_visible;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* ─── Header & Top Stats ─────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Avaliações & Depoimentos
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Depoimentos que geram credibilidade e prova social na vitrine da sua loja.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Fechar Formulário' : 'Nova Avaliação'}</span>
          </button>
        </div>
      </div>

      {/* ─── Quick Summary Chips ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
            Total
          </span>
          <p className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">{reviews.length}</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
            Na Vitrine
          </span>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5">{visibleCount}</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
            Média
          </span>
          <p className="text-lg sm:text-2xl font-black text-amber-500 mt-0.5 flex items-center gap-1">
            <span>{avgRating}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
          </p>
        </div>
      </div>

      {/* ─── Form: Adicionar Avaliação (Collapsible) ─────────────── */}
      {showAddForm && (
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs animate-in zoom-in-95 duration-200 text-left">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Cadastrar Novo Depoimento de Cliente</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Insira o feedback real enviado por clientes no WhatsApp ou Google.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={newReview.author_name}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Ex: João Silva"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Bairro ou Cidade
                </label>
                <input
                  type="text"
                  value={newReview.neighborhood}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, neighborhood: e.target.value }))}
                  placeholder="Ex: Várzea • Teresópolis"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Avaliação em Estrelas
              </label>
              <div className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{newReview.rating} de 5 estrelas</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Comentário / Depoimento *
              </label>
              <textarea
                required
                rows={3}
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Ex: Atendimento excelente! Comprei o iPhone 15 Pro lacrado e recebi em 40 minutos em casa com a máquina de cartão para conferir antes de pagar."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                Salvar Depoimento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Reviews Filter Tabs ─────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `Todos (${reviews.length})` },
          { id: 'visible', label: `Visíveis na Loja (${visibleCount})` },
          { id: 'hidden', label: `Ocultos (${reviews.length - visibleCount})` },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterMode(f.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              filterMode === f.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── Reviews Grid (1 Col Mobile, 2 Col Tablet, 3 Col Web) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Nenhum depoimento encontrado neste filtro.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Adicione avaliações de clientes satisfeitos para exibir o carrossel de depoimentos na sua vitrine.
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Adicionar Primeiro Depoimento
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                review.is_visible
                  ? 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                  : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {review.author_name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {review.neighborhood || 'Cliente'}
                    </p>
                  </div>
                  <div className="flex gap-0.5 shrink-0 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic mb-4 leading-relaxed line-clamp-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleToggleVisible(review.id, review.is_visible)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    review.is_visible
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {review.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{review.is_visible ? 'Visível na Loja' : 'Oculto'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(review.id, review.author_name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Excluir avaliação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
