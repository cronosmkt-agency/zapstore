import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import { useState, useEffect, useRef } from 'react';
import { ProductCategory } from '@/types';
import { maxImages } from '@/lib/planLimits';
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  Star,
  Check,
  X,
  RefreshCw,
  Smartphone,
  Shirt,
  Footprints,
  Box,
  CreditCard,
  Sparkles,
  Car,
  UtensilsCrossed,
  Home,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';
import { optimizeImageFile } from '@/components/ImageUploadField';

export const Route = createFileRoute('/dashboard/produtos/$id')({
  component: ProductEdit,
});

const TEMPLATES = {
  iphone: [
    { key: 'Armazenamento', value: '128GB' },
    { key: 'Tela', value: '6.1" Super Retina XDR' },
    { key: 'Processador', value: 'A15 Bionic' },
    { key: 'Câmera', value: 'Dupla 12MP' },
    { key: 'Bateria', value: '100% (Saúde)' },
    { key: 'Garantia', value: '3 meses' },
    { key: 'Condição', value: 'Seminovo Impecável' },
  ],
  veiculos: [
    { key: 'Ano/Modelo', value: '2023 / 2024' },
    { key: 'Quilometragem', value: '28.000 km' },
    { key: 'Câmbio', value: 'Automático' },
    { key: 'Motor', value: '2.0 Turbo Flex' },
    { key: 'Combustível', value: 'Flex (Álcool/Gasolina)' },
    { key: 'Laudo Cautelar', value: '100% Aprovado' },
    { key: 'Garantia', value: '1 Ano de Garantia' },
  ],
  gastronomia: [
    { key: 'Tamanho / Porção', value: 'Individual (350g)' },
    { key: 'Pão / Base', value: 'Brioche Selado na Manteiga' },
    { key: 'Blend / Recheio', value: '160g Blend Bovino Especial' },
    { key: 'Acompanhamento', value: 'Batata Rústica e Molho da Casa' },
    { key: 'Tempo de Entrega', value: '30 a 45 minutos' },
  ],
  roupas: [
    { key: 'Tamanho', value: 'M (Veste 38 ao 40)' },
    { key: 'Cor', value: 'Preto' },
    { key: 'Tecido', value: '100% Algodão Premium' },
    { key: 'Modelagem', value: 'Oversized / Confort' },
    { key: 'Gênero', value: 'Unissex' },
    { key: 'Cuidados', value: 'Lavar à mão ou ciclo delicado' },
  ],
  imoveis: [
    { key: 'Área Útil', value: '120 m²' },
    { key: 'Quartos & Suítes', value: '3 Quartos (1 Suíte)' },
    { key: 'Vagas de Garagem', value: '2 Vagas Cobertas' },
    { key: 'Condomínio', value: 'R$ 850 / mês' },
    { key: 'IPTU', value: 'R$ 2.400 / ano' },
    { key: 'Destaques', value: 'Varanda Gourmet com Vista Livre' },
  ],
  infoprodutos: [
    { key: 'Formato', value: 'Aulas 100% Online em Vídeo' },
    { key: 'Duração', value: '40 Horas de Conteúdo Prático' },
    { key: 'Acesso', value: 'Vitalício com Suporte a Dúvidas' },
    { key: 'Certificado', value: 'Certificado Reconhecido Incluso' },
    { key: 'Bônus', value: 'Comunidade VIP + Ferramentas Prontas' },
  ],
  calcados: [
    { key: 'Numeração', value: '40' },
    { key: 'Material', value: 'Couro Sintético e Mesh' },
    { key: 'Cor', value: 'Branco / Cinza' },
    { key: 'Solado', value: 'Borracha Antiderrapante' },
    { key: 'Fechamento', value: 'Cadarço' },
    { key: 'Indicação', value: 'Dia a dia e caminhada' },
  ],
  geral: [
    { key: 'Marca', value: '' },
    { key: 'Modelo', value: '' },
    { key: 'Cor', value: '' },
    { key: 'Dimensões', value: '' },
    { key: 'Garantia', value: '90 dias' },
    { key: 'Itens Inclusos', value: 'Produto na embalagem original' },
  ],
};

function ProductEdit() {
  const { id } = Route.useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeTab, setActiveTab] = useState('basico');
  const [notFound, setNotFound] = useState(false);

  // Quick category addition state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState('');

  // Image uploader state
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    badge: '',
    description: '',
    is_available: true,
    is_featured: false,
    price: 0,
    price_installments: 0,
    installments_count: 12,
    quantity: 1,
    gallery: [] as string[],
    specs: [] as { key: string; value: string }[],
  });

  const loadCategories = () => {
    if (session) {
      const userCats = db.categories
        .getByProfileId(session.userId)
        .filter((c) => c.name.toLowerCase() !== 'todos' && c.slug.toLowerCase() !== 'todos');
      setCategories(userCats);
    }
  };

  useEffect(() => {
    if (session) {
      loadCategories();

      const prod = db.products.getById(id);
      if (!prod || prod.profile_id !== session.userId) {
        setNotFound(true);
      } else {
        let specsList: { key: string; value: string }[] = [];
        if (Array.isArray(prod.specs)) {
          specsList = prod.specs;
        } else if (prod.specs && typeof prod.specs === 'object') {
          if (Array.isArray((prod.specs as any).features)) {
            specsList = (prod.specs as any).features;
          } else {
            specsList = Object.entries(prod.specs).map(([k, v]) => ({ key: k, value: String(v) }));
          }
        }

        setFormData({
          name: prod.name,
          category_id: prod.category_id || '',
          badge: prod.badge || '',
          description: prod.description || '',
          is_available: prod.is_available,
          is_featured: prod.is_featured,
          price: prod.price,
          price_installments: prod.price_installments || 0,
          installments_count: prod.installments_count || 12,
          quantity: prod.quantity,
          gallery: prod.gallery || prod.images || [],
          specs: specsList,
        });
      }
    }
  }, [id, session]);

  const handleQuickAddCategory = () => {
    if (!quickCategoryName.trim() || !session) return;
    const name = quickCategoryName.trim();
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const created = db.categories.create({
      profile_id: session.userId,
      name,
      slug: slug || `cat-${Date.now()}`,
      sort_order: categories.length + 1,
    });

    const updated = db.categories
      .getByProfileId(session.userId)
      .filter((c) => c.name.toLowerCase() !== 'todos' && c.slug.toLowerCase() !== 'todos');
    setCategories(updated);
    setFormData((prev) => ({ ...prev, category_id: created.id }));
    setQuickCategoryName('');
    setIsAddingCategory(false);
    toast.success(`Categoria "${name}" criada com sucesso!`);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !session) return;
    const limit = maxImages(session.user.plan_slug);
    const remaining = limit - formData.gallery.length;

    if (remaining <= 0) {
      toast.error(`Seu plano (${session.user.plan_slug.toUpperCase()}) permite até ${limit} fotos por produto.`);
      return;
    }

    const toProcess = Array.from(files).slice(0, remaining);
    setIsUploading(true);

    try {
      const newImgs: string[] = [];
      for (const f of toProcess) {
        if (f.type.startsWith('image/')) {
          const optimized = await optimizeImageFile(f, 1000);
          newImgs.push(optimized);
        }
      }

      if (newImgs.length > 0) {
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...newImgs] }));
        toast.success(`${newImgs.length} foto(s) adicionada(s)!`);
      }

      if (files.length > remaining) {
        toast.info(`Apenas ${remaining} foto(s) foram adicionadas devido ao limite de ${limit} fotos do seu plano.`);
      }
    } catch {
      toast.error('Erro ao processar as fotos selecionadas.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim() || !session) return;
    const limit = maxImages(session.user.plan_slug);
    if (formData.gallery.length >= limit) {
      toast.error(`Seu plano permite até ${limit} imagens por produto.`);
      return;
    }
    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, newImageUrl.trim()] }));
    setNewImageUrl('');
    toast.success('Imagem adicionada via link!');
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const item = prev.gallery[index];
      const rest = prev.gallery.filter((_, i) => i !== index);
      return { ...prev, gallery: [item, ...rest] };
    });
    toast.success('Foto definida como Capa do produto!');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const addSpecRow = () => {
    setFormData((prev) => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }));
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = val;
    setFormData((prev) => ({ ...prev, specs: newSpecs }));
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  };

  const applyTemplate = (templateKey: keyof typeof TEMPLATES) => {
    setFormData((prev) => ({
      ...prev,
      specs: [...TEMPLATES[templateKey]],
    }));
    toast.success('Modelo de especificações aplicado!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!formData.name.trim()) {
      toast.error('O nome do produto é obrigatório.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === formData.category_id);

    const updatedProduct = {
      ...formData,
      category_name: selectedCategory?.name || (categories[0]?.name || 'Destaques'),
      images: formData.gallery,
      primary_image: formData.gallery.length > 0 ? formData.gallery[0] : undefined,
    };

    db.products.update(id, updatedProduct);
    toast.success('Produto atualizado com sucesso!');
    navigate({ to: '/dashboard/produtos' });
  };

  if (!session) return null;

  if (notFound) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Produto não encontrado</h2>
        <p className="text-xs text-slate-500">O produto solicitado não existe ou pertence a outra loja.</p>
        <Link
          to="/dashboard/produtos"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Voltar aos Produtos
        </Link>
      </div>
    );
  }

  const currentPlan = session.user.plan_slug;
  const imageLimit = maxImages(currentPlan);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/produtos"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Editar Produto</h1>
            <p className="text-xs text-slate-500">Atualize informações, preços, fotos e especificações</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200/80 p-2 gap-1.5 sm:gap-2 bg-slate-50/70 scrollbar-none">
          {[
            { id: 'basico', label: 'Básico' },
            { id: 'precos-e-estoque', label: 'Preços e Estoque' },
            { id: 'imagens', label: `Fotos (${formData.gallery.length}/${imageLimit})` },
            { id: 'especificacoes', label: 'Especificações' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ─── ABA 1: BÁSICO ─────────────────────────────────── */}
            {activeTab === 'basico' && (
              <div className="space-y-4 animate-in slide-in-from-left-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: iPhone 16 Pro Max, Tênis Nike Air, Vestido Floral M..."
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Categoria
                      </label>
                      {!isAddingCategory && (
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(true)}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Nova Categoria</span>
                        </button>
                      )}
                    </div>

                    {isAddingCategory ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Nome da categoria..."
                          value={quickCategoryName}
                          onChange={(e) => setQuickCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleQuickAddCategory();
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-blue-400 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddCategory}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCategory(false);
                            setQuickCategoryName('');
                          }}
                          className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs cursor-pointer"
                      >
                        <option value="">Selecione a categoria...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Badge / Selo (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 📦 Novo, 15% OFF, Mais Vendido, Frete Grátis"
                      value={formData.badge}
                      onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Descrição do Produto
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Conte mais sobre o produto, benefícios, estado de conservação ou garantia..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none shadow-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_available: e.target.checked }))}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800">Produto Disponível</span>
                      <p className="text-xs text-slate-500">Exibir este item publicamente no catálogo</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800">Destaque na Página Inicial</span>
                      <p className="text-xs text-slate-500">Aparecer na seção de Mais Pedidos da home</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ─── ABA 2: PREÇOS E ESTOQUE ───────────────────────── */}
            {activeTab === 'precos-e-estoque' && (
              <div className="space-y-6 animate-in slide-in-from-left-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card 1: Precificação & Condições */}
                  <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Valores & Condições de Pagamento
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Preço à vista e simulação para compra parcelada
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Preço à vista */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Preço à Vista *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500">
                            R$
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="0,00"
                            value={formData.price || ''}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base font-bold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs transition"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Valor principal exibido em destaque no card do produto.
                        </p>
                      </div>

                      {/* Preço parcelado */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Preço Parcelado Total (opcional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500">
                            R$
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0,00 (deixe vazio se for o mesmo que à vista)"
                            value={formData.price_installments || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, price_installments: parseFloat(e.target.value) || 0 }))
                            }
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs transition"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Preço com juros da maquininha ou taxa da operadora de cartão.
                        </p>
                      </div>

                      {/* Máximo de Parcelas */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Número Máximo de Parcelas
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={48}
                            value={formData.installments_count}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, installments_count: parseInt(e.target.value) || 12 }))
                            }
                            className="w-24 px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-bold text-center focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs"
                          />
                          <div className="flex flex-wrap gap-1.5">
                            {[1, 6, 10, 12, 18, 24].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, installments_count: n }))}
                                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                                  formData.installments_count === n
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {n}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Estoque & Preview da Loja */}
                  <div className="space-y-6">
                    {/* Subcard Estoque */}
                    <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Box className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            Controle de Estoque
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Quantidade de unidades físicas disponíveis
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Quantidade em Estoque
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, quantity: Math.max(0, (prev.quantity || 0) - 1) }))}
                            className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition shadow-xs select-none"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={formData.quantity}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, quantity: Math.max(0, parseInt(e.target.value) || 0) }))
                            }
                            className="w-24 text-center py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base font-bold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, quantity: (prev.quantity || 0) + 1 }))}
                            className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition shadow-xs select-none"
                          >
                            +
                          </button>
                          <span className={`text-xs font-bold px-3 py-2 rounded-xl border ${
                            formData.quantity > 0
                              ? 'bg-emerald-50 dark:bg-emerald-950/85 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/85 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          }`}>
                            {formData.quantity > 0 ? `${formData.quantity} un. em estoque` : 'Esgotado'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subcard Prévia em tempo real */}
                    <div className="p-5 bg-linear-to-br from-blue-50/80 via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-sky-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Prévia de Exibição na Loja
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">Tempo real</span>
                      </div>

                      <div className="p-4 bg-white/90 dark:bg-slate-950/90 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                        <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-sky-400">
                          {(formData.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                          à vista no PIX/Dinheiro
                          {formData.installments_count > 1 && (
                            <>
                              {' '}ou até <strong>{formData.installments_count}x</strong> de{' '}
                              <strong className="text-slate-900 dark:text-white">
                                {(((formData.price_installments || formData.price || 0)) / formData.installments_count).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </strong>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── ABA 3: FOTOS / IMAGENS ────────────────────────── */}
            {activeTab === 'imagens' && (
              <div className="space-y-6 animate-in slide-in-from-left-2">
                {/* Uploader Box */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
                    {isUploading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {isUploading
                      ? 'Otimizando fotos...'
                      : 'Clique para escolher fotos ou arraste arquivos aqui'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Suporta PNG, JPG, WebP. Selecione uma ou várias fotos de uma vez.
                  </p>
                  <p className="text-xs font-semibold text-blue-600 mt-2">
                    Limite do seu plano ({currentPlan.toUpperCase()}): {formData.gallery.length} de {imageLimit} fotos
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />

                {/* Ou Link URL fallback */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="Ou cole o link direto da foto (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:border-blue-600 outline-none shadow-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs transition cursor-pointer"
                  >
                    Adicionar URL
                  </button>
                </div>

                {/* Grid de Fotos */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Fotos do Produto ({formData.gallery.length})
                  </span>

                  {formData.gallery.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 border border-slate-200 rounded-xl bg-slate-50">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">Nenhuma foto adicionada ainda.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.gallery.map((url, i) => (
                        <div
                          key={i}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-50 flex items-center justify-center shadow-xs"
                        >
                          <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-contain p-1.5" />

                          {/* Capa Badge */}
                          {i === 0 && (
                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow-xs flex items-center gap-1 z-10">
                              <Star size={10} fill="currentColor" />
                              Capa
                            </span>
                          )}

                          {/* Overlay Controls */}
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {i !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(i)}
                                title="Definir como foto de capa"
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-xs"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(i)}
                              title="Remover foto"
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer shadow-xs"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── ABA 4: ESPECIFICAÇÕES ─────────────────────────── */}
            {activeTab === 'especificacoes' && (
              <div className="space-y-4 animate-in slide-in-from-left-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Ficha Técnica & Atributos
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure características como tamanho, cor, armazenamento ou garantia.
                    </p>
                  </div>

                  {/* Pre-fill template buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Modelos Rápidos:</span>
                    <button
                      type="button"
                      onClick={() => applyTemplate('iphone')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Smartphone size={12} className="text-blue-600" />
                      <span>Celular</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('veiculos')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Car size={12} className="text-rose-600" />
                      <span>Veículos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('gastronomia')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <UtensilsCrossed size={12} className="text-orange-600" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('roupas')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Shirt size={12} className="text-indigo-600" />
                      <span>Moda</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('imoveis')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Home size={12} className="text-teal-600" />
                      <span>Imóveis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('infoprodutos')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <GraduationCap size={12} className="text-violet-600" />
                      <span>Cursos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('calcados')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Footprints size={12} className="text-amber-600" />
                      <span>Calçados</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('geral')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Box size={12} className="text-emerald-600" />
                      <span>Geral</span>
                    </button>
                  </div>
                </div>

                {formData.specs.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500">
                      Nenhum atributo cadastrado. Use um modelo rápido acima ou adicione linhas manualmente.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80"
                      >
                        <input
                          type="text"
                          placeholder="Atributo (ex: Tamanho, Armazenamento)"
                          value={spec.key}
                          onChange={(e) => updateSpec(i, 'key', e.target.value)}
                          className="w-full sm:w-1/3 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                        />
                        <input
                          type="text"
                          placeholder="Valor (ex: G, 128GB, Couro)"
                          value={spec.value}
                          onChange={(e) => updateSpec(i, 'value', e.target.value)}
                          className="w-full sm:flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(i)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer shrink-0"
                          title="Remover linha"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addSpecRow}
                  className="px-4 py-2 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-blue-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Adicionar Linha</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
