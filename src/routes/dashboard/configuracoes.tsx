import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/mockDb';
import { useState, useEffect } from 'react';
import {
  Save,
  Store,
  Palette,
  Phone,
  Globe,
  Link as LinkIcon,
  Instagram,
  Facebook,
  Sparkles,
  MessageCircle,
  MapPin,
  Truck,
  ShieldCheck,
  Star,
  RefreshCw,
  Layers,
  ExternalLink,
  Image as ImageIcon,
  Check,
  Building2,
  Zap,
  Tag,
  Edit2,
  Plus,
  X,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Differential, ProductCategory } from '@/types';
import { ImageUploadField } from '@/components/ImageUploadField';

export const Route = createFileRoute('/dashboard/configuracoes')({
  component: SettingsPage,
});

const DEFAULT_DIFFERENTIALS: Differential[] = [
  { icon: '🚚', title: 'Entrega Express em até 1h', description: 'Levamos seu iPhone na sua porta em qualquer bairro de Teresópolis. Rápido, seguro e sem espera de dias.' },
  { icon: '🛡️', title: 'Pague Só na Entrega', description: 'Zero risco de golpe na internet: confira a caixa, teste a câmera, tela e funções na sua mão antes de fazer o pagamento.' },
  { icon: '🏪', title: 'Ponto Físico na SejaDelta', description: 'Prefere retirar presencialmente? Atendimento exclusivo na loja parceira SejaDelta no centro de Teresópolis.' },
  { icon: '⭐', title: 'Até 1 Ano de Garantia', description: 'Novos lacrados com garantia mundial Apple e seminovos aprovados em 25+ testes com 90 dias de garantia total.' },
];

function SettingsPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('identidade');

  const [formData, setFormData] = useState({
    // 1. Identidade
    store_name: '',
    store_tagline: '',
    logo_url: '',
    favicon_url: '',

    // 2. Landing Page: Hero & Topo
    hero_title: '',
    hero_subtitle: '',
    cta_button_text: 'Ver Catálogo na Loja',
    hero_image_url: '',
    trust_badge_rating: '4,9 no Google',
    trust_badge_delivery: 'Entrega em até 1h',
    trust_badge_location: 'Ponto SejaDelta',
    trust_badge_payment: 'Pague só na Entrega',

    // 3. Landing Page: Destaques & Catálogo
    featured_badge: 'Mais Desejados',
    featured_eyebrow: 'Catálogo Selecionado',
    featured_title: 'Destaques da Semana',
    featured_subtitle: 'Os modelos mais procurados com garantia e pronta entrega imediata.',
    catalog_banner_title: 'Buscando outro modelo, cor ou capacidade?',
    catalog_banner_subtitle: 'Temos estoque completo atualizado diariamente com garantia Apple de até 1 ano.',
    catalog_banner_button_text: 'Ver Catálogo Completo na Loja',

    // 4. Landing Page: Diferenciais
    differentials_badge: 'Segurança Total',
    differentials_eyebrow: '',
    differentials_title: 'A Experiência Apple Mais Segura de Teresópolis',
    differentials_subtitle: 'Comprar seu iPhone novo ou seminovo não precisa ser arriscado nem demorado.',
    differentials: DEFAULT_DIFFERENTIALS,

    // 5. Landing Page: Troca / Trade-in
    enable_tradein: true,
    tradein_badge: 'Trade-in Inteligente',
    tradein_eyebrow: 'Troque de Aparelho',
    tradein_title: 'Seu iPhone Usado Vale Dinheiro na Troca',
    tradein_subtitle: 'Aceitamos seu iPhone a partir do modelo XR como entrada no novo. Avaliação rápida, justa e sem burocracia.',
    tradein_step1_title: 'Envie as Fotos no WhatsApp',
    tradein_step1_desc: 'Mande fotos do seu aparelho, informe modelo, capacidade e saúde da bateria.',
    tradein_step2_title: 'Receba a Avaliação Imediata',
    tradein_step2_desc: 'Nosso especialista avalia na hora e passa o valor exato de entrada do seu seminovo.',
    tradein_step3_title: 'Pague Só a Diferença (ou Receba Troco)',
    tradein_step3_desc: 'Entregamos o aparelho novo e pegamos o seu usado no ato, com total segurança.',
    tradein_button_text: 'Simular Troca no WhatsApp Agora',
    tradein_whatsapp_message: 'Olá, equipe {store_name}! Gostaria de fazer uma simulação de Troca com Troco (Trade-in) do meu iPhone usado por um novo.',

    // 6. Landing Page: Ponto Físico & Avaliações
    enable_physical_location: true,
    location_badge: 'Ponto Físico Oficial de Apoio',
    location_title: 'Loja Parceira SejaDelta em Teresópolis',
    location_desc: 'Você conta com o suporte e a segurança de um endereço presencial no centro da cidade para retirar aparelhos, aplicar películas ou tirar dúvidas pessoalmente.',
    google_maps_url: '',
    reviews_badge: 'Google 4,9 ★',
    reviews_eyebrow: 'Depoimentos Reais',
    reviews_title: 'Quem Compra em Teresópolis Recomenda',
    reviews_subtitle: 'Mais de 500 clientes atendidos com nota máxima em procedência e rapidez.',

    // 7. Mensagens WhatsApp
    whatsapp_message_template: '',

    // 8. Visual & Tema
    theme_mode: 'white' as any,
    primary_color: '#2563eb',
    accent_color: '#0ea5e9',
    font_family: 'Inter',

    // 9. Contato & Redes
    whatsapp: '',
    phone_display: '',
    address: '',
    city: '',
    state: '',
    business_hours: '',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',

    // 10. SEO & Google
    meta_title: '',
    meta_description: '',
    og_image_url: '',

    // 11. Integrações
    enable_whatsapp_float: true,
    enable_tawk: false,
    tawk_widget_id: '',
    enable_dark_mode_toggle: true,

    // 12. Header & Rodapé
    header_logo_alignment_desktop: 'left' as 'left' | 'center' | 'right',
    header_logo_alignment_mobile: 'left' as 'left' | 'center' | 'right',
    header_show_theme_toggle: true,
    header_show_hours_badge: false,
    header_hours_text: '',
    header_show_whatsapp_mobile: false,
    header_show_announcement: false,
    header_announcement_text: '',
    header_cta_text: '',
    header_show_whatsapp_button: false,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Catálogo',

    footer_about_text: '',
    footer_show_navigation: true,
    footer_nav_title: 'Navegação',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Catálogo',
    footer_show_tradein_link: true,
    footer_tradein_label: 'Troca com Troco',
    footer_show_delivery_link: true,
    footer_delivery_label: 'Entrega Expressa',
    footer_show_location_link: true,
    footer_location_label: 'Ponto Físico',
    footer_show_institutional: true,
    footer_inst_title: 'Institucional',
    footer_about_link_label: 'Sobre Nós',
    footer_warranty_link_label: 'Termos de Garantia',
    footer_show_contact: true,
    footer_contact_title: 'Atendimento',
    footer_custom_copyright: '',
  });

  const [merchantSlug, setMerchantSlug] = useState('');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const loadCategories = () => {
    if (session) {
      const cats = db.categories.getByProfileId(session.userId);
      setCategories(cats);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    if (session) {
      const profile = db.profiles.getById(session.userId);
      if (profile) setMerchantSlug(profile.slug);

      const settings = db.storeSettings.getByProfileId(session.userId);
      if (settings) {
        setFormData(prev => ({
          ...prev,
          ...settings,
          differentials: (settings.differentials && settings.differentials.length > 0)
            ? settings.differentials
            : DEFAULT_DIFFERENTIALS,
        }));
      }

      loadCategories();
    }
  }, [session]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !session) return;
    const name = newCatName.trim();
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    db.categories.create({
      profile_id: session.userId,
      name,
      slug: slug || `cat-${Date.now()}`,
      sort_order: categories.length + 1,
    });
    setNewCatName('');
    loadCategories();
    toast.success(`Categoria "${name}" criada com sucesso!`);
  };

  const handleUpdateCategory = (id: string) => {
    if (!editingCatName.trim() || !session) return;
    const name = editingCatName.trim();
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    db.categories.update(id, { name, slug });
    setEditingCatId(null);
    setEditingCatName('');
    loadCategories();
    toast.success('Categoria renomeada com sucesso!');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover a categoria "${name}"? Os produtos vinculados a ela não serão apagados.`)) {
      db.categories.delete(id);
      loadCategories();
      toast.success(`Categoria "${name}" excluída.`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDifferentialChange = (index: number, field: keyof Differential, value: string) => {
    setFormData(prev => {
      const updated = [...prev.differentials];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, differentials: updated };
    });
  };

  const handleSubmit = () => {
    if (session) {
      db.storeSettings.update(session.userId, formData);
      if (formData.store_name) {
        db.profiles.update(session.userId, { 
          display_name: formData.store_name,
          store_name: formData.store_name,
        });
      }
      toast.success('Configurações da loja salvas com sucesso!');
    }
  };

  const tabs = [
    { id: 'identidade', label: 'Identidade da Loja', icon: Store, group: 'Geral' },
    { id: 'categorias', label: 'Categorias de Produtos', icon: Tag, group: 'Catálogo' },
    { id: 'hero', label: 'Landing: Hero & Topo', icon: Zap, group: 'Landing Page' },
    { id: 'destaques', label: 'Landing: Destaques', icon: Sparkles, group: 'Landing Page' },
    { id: 'diferenciais', label: 'Landing: Diferenciais', icon: Layers, group: 'Landing Page' },
    { id: 'troca', label: 'Landing: Troca (Trade-in)', icon: RefreshCw, group: 'Landing Page' },
    { id: 'local', label: 'Landing: Ponto Físico', icon: Building2, group: 'Landing Page' },
    { id: 'mensagens', label: 'Mensagens WhatsApp', icon: MessageCircle, group: 'Comunicação' },
    { id: 'visual', label: 'Visual & Tema', icon: Palette, group: 'Aparência' },
    { id: 'header_footer', label: 'Header & Rodapé', icon: SlidersHorizontal, group: 'Aparência' },
    { id: 'contato', label: 'Contato & Redes', icon: Phone, group: 'Comunicação' },
    { id: 'seo', label: 'SEO & Google', icon: Globe, group: 'Marketing' },
    { id: 'integracoes', label: 'Integrações', icon: LinkIcon, group: 'Sistema' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Configurações da Loja & Landing Page
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Personalize 100% dos textos, títulos, diferenciais, formas de contato e visual da sua vitrine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {merchantSlug && (
            <a
              href={`/${merchantSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white text-slate-700 hover:text-blue-600 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              title="Abrir vitrine em nova aba"
            >
              <span>Ver Minha Loja</span>
              <ExternalLink size={13} />
            </a>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full lg:w-64 shrink-0 space-y-1 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs overflow-x-auto lg:overflow-visible flex lg:flex-col gap-1 lg:gap-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-auto lg:w-full shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-slate-50/80 lg:bg-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Main Settings Panel */}
        <main className="flex-1 w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xs text-slate-800">
          <div className="space-y-6 max-w-3xl">

            {/* ─── TAB 1: IDENTIDADE DA LOJA ────────────────────────── */}
            {activeTab === 'identidade' && (
              <div className="space-y-5 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Identidade da Loja</h2>
                  <p className="text-xs text-slate-500">Nome exibido no cabeçalho, rodapé e títulos das páginas.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nome da Loja
                  </label>
                  <input
                    name="store_name"
                    value={formData.store_name}
                    onChange={handleChange}
                    placeholder="Ex: Terephones"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Slogan / Frase de Destaque no Topo
                  </label>
                  <input
                    name="store_tagline"
                    value={formData.store_tagline || ''}
                    onChange={handleChange}
                    placeholder="Ex: iPhones Novos & Seminovos em Teresópolis"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <ImageUploadField
                    label="Logo da Loja"
                    value={formData.logo_url || ''}
                    onChange={(val) => setFormData((prev) => ({ ...prev, logo_url: val }))}
                    aspectRatio="square"
                    maxDimension={600}
                    description="Logomarca visível no topo da página e cabeçalho."
                    placeholder="https://..."
                  />

                  <ImageUploadField
                    label="Favicon da Loja"
                    value={formData.favicon_url || ''}
                    onChange={(val) => setFormData((prev) => ({ ...prev, favicon_url: val }))}
                    aspectRatio="square"
                    maxDimension={128}
                    description="Ícone exibido na aba do navegador (32x32 ou 64x64)."
                    placeholder="https://.../favicon.ico"
                  />
                </div>
              </div>
            )}

            {/* ─── TAB 2: CATEGORIAS DE PRODUTOS ────────────────────── */}
            {activeTab === 'categorias' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Categorias de Produtos</h2>
                  <p className="text-xs text-slate-500">
                    Crie as categorias para o seu negócio (ex: Celulares, Roupas, Perfumes, Acessórios). Seus clientes poderão filtrar produtos por elas na loja.
                  </p>
                </div>

                {/* Form Adicionar Categoria */}
                <form onSubmit={handleAddCategory} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Nova Categoria
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Ex: Calçados, Roupas, Eletrônicos, Acessórios..."
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs"
                    />
                    <button
                      type="submit"
                      disabled={!newCatName.trim()}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>Adicionar Categoria</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    O link (slug) da categoria será gerado automaticamente para os filtros da sua vitrine.
                  </p>
                </form>

                {/* Lista de Categorias Cadastradas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Categorias Cadastradas ({categories.length})
                    </h3>
                  </div>

                  {categories.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Tag className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-semibold text-slate-600">Nenhuma categoria cadastrada ainda.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Crie sua primeira categoria acima para organizar seus produtos.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {categories.map((cat, idx) => {
                        const isEditing = editingCatId === cat.id;
                        const productCount = session
                          ? db.products.getByProfileId(session.userId).filter(
                              (p) => p.category_id === cat.id || p.category_name === cat.name
                            ).length
                          : 0;

                        return (
                          <div
                            key={cat.id}
                            className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition"
                          >
                            {isEditing ? (
                              <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
                                <input
                                  type="text"
                                  value={editingCatName}
                                  onChange={(e) => setEditingCatName(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                                  autoFocus
                                />
                                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCategory(cat.id)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check size={13} />
                                    <span>Salvar</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCatId(null);
                                      setEditingCatName('');
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  >
                                    <X size={13} />
                                    <span>Cancelar</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                        {cat.name}
                                      </h4>
                                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                        /{cat.slug}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                      {productCount} {productCount === 1 ? 'produto vinculado' : 'produtos vinculados'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCatId(cat.id);
                                      setEditingCatName(cat.name);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 cursor-pointer transition shadow-xs"
                                    title="Renomear categoria"
                                  >
                                    <Edit2 size={13} />
                                    <span className="hidden sm:inline">Renomear</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                    className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                                    title="Excluir categoria"
                                  >
                                    <Trash2 size={13} />
                                    <span className="hidden sm:inline">Excluir</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB 2: LANDING PAGE — HERO & TOPO ────────────────── */}
            {activeTab === 'hero' && (
              <div className="space-y-5 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Landing Page: Hero (Primeira Dobra)</h2>
                  <p className="text-xs text-slate-500">
                    A primeira seção visual que o cliente enxerga ao abrir a vitrine da sua loja.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Título Principal da Hero (h1)
                  </label>
                  <textarea
                    name="hero_title"
                    value={formData.hero_title || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder={`Ex:\nO seu novo iPhone,\nna sua mão hoje.`}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                  <span className="text-[11px] text-slate-400">Dica: aperte Enter para quebrar linhas na chamada.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subtítulo / Proposta de Valor
                  </label>
                  <textarea
                    name="hero_subtitle"
                    value={formData.hero_subtitle || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ex: Entrega Express em até 1 hora na sua porta ou Retirada presencial na loja parceira SejaDelta. Aparelhos revisados com até 1 ano de garantia Apple e pagamento somente na entrega! 🍎⚡"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Texto do Botão de Catálogo (CTA)
                  </label>
                  <input
                    name="cta_button_text"
                    value={formData.cta_button_text}
                    onChange={handleChange}
                    placeholder="Ver Catálogo na Loja"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="pt-2">
                  <ImageUploadField
                    label="Imagem Principal da Hero (Banner / Produto em Destaque)"
                    value={formData.hero_image_url || ''}
                    onChange={(val) => setFormData((prev) => ({ ...prev, hero_image_url: val }))}
                    aspectRatio="video"
                    maxDimension={1200}
                    description="Imagem ilustrativa principal da primeira dobra do seu site (deixe em branco para usar o padrão)."
                    placeholder="https://..."
                  />
                </div>

                {/* 4 Micro Trust Badges */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Os 4 Selos de Confiança da Hero
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 mb-1 block">Selo 1 (Avaliação)</span>
                      <input
                        name="trust_badge_rating"
                        value={formData.trust_badge_rating}
                        onChange={handleChange}
                        placeholder="4,9 no Google"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 mb-1 block">Selo 2 (Entrega)</span>
                      <input
                        name="trust_badge_delivery"
                        value={formData.trust_badge_delivery}
                        onChange={handleChange}
                        placeholder="Entrega em até 1h"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 mb-1 block">Selo 3 (Ponto/Local)</span>
                      <input
                        name="trust_badge_location"
                        value={formData.trust_badge_location}
                        onChange={handleChange}
                        placeholder="Ponto SejaDelta"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 mb-1 block">Selo 4 (Pagamento)</span>
                      <input
                        name="trust_badge_payment"
                        value={formData.trust_badge_payment}
                        onChange={handleChange}
                        placeholder="Pague só na Entrega"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: LANDING PAGE — DESTAQUES & CATÁLOGO ──────── */}
            {activeTab === 'destaques' && (
              <div className="space-y-5 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Landing Page: Destaques & Catálogo</h2>
                  <p className="text-xs text-slate-500">
                    Cabeçalho da vitrine dos produtos mais pedidos e banner de convite para o catálogo geral.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Tag / Selo da Seção
                    </label>
                    <input
                      name="featured_badge"
                      value={formData.featured_badge}
                      onChange={handleChange}
                      placeholder="Mais Desejados"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subtítulo Superior (Eyebrow)
                    </label>
                    <input
                      name="featured_eyebrow"
                      value={formData.featured_eyebrow}
                      onChange={handleChange}
                      placeholder="Catálogo Selecionado"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Título da Seção de Destaques
                  </label>
                  <input
                    name="featured_title"
                    value={formData.featured_title}
                    onChange={handleChange}
                    placeholder="Destaques da Semana"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Descrição da Seção de Destaques
                  </label>
                  <textarea
                    name="featured_subtitle"
                    value={formData.featured_subtitle}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Os modelos mais procurados com garantia e pronta entrega imediata."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                {/* Banner de Transição para a Loja */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Banner de Transição para o Catálogo Completo
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Título do Banner</label>
                    <input
                      name="catalog_banner_title"
                      value={formData.catalog_banner_title}
                      onChange={handleChange}
                      placeholder="Buscando outro modelo, cor ou capacidade?"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Subtítulo do Banner</label>
                    <input
                      name="catalog_banner_subtitle"
                      value={formData.catalog_banner_subtitle}
                      onChange={handleChange}
                      placeholder="Temos estoque completo atualizado diariamente com garantia Apple de até 1 ano."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Texto do Botão do Banner</label>
                    <input
                      name="catalog_banner_button_text"
                      value={formData.catalog_banner_button_text}
                      onChange={handleChange}
                      placeholder="Ver Catálogo Completo na Loja"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: LANDING PAGE — DIFERENCIAIS ───────────────── */}
            {activeTab === 'diferenciais' && (
              <div className="space-y-5 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Landing Page: Seção de Diferenciais</h2>
                  <p className="text-xs text-slate-500">
                    Apresente os motivos e seguranças para o cliente comprar com a sua loja.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Selo / Badge
                    </label>
                    <input
                      name="differentials_badge"
                      value={formData.differentials_badge}
                      onChange={handleChange}
                      placeholder="Segurança Total"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subtítulo Superior (Eyebrow)
                    </label>
                    <input
                      name="differentials_eyebrow"
                      value={formData.differentials_eyebrow}
                      onChange={handleChange}
                      placeholder="Por que a nossa loja?"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Título Principal dos Diferenciais
                  </label>
                  <input
                    name="differentials_title"
                    value={formData.differentials_title}
                    onChange={handleChange}
                    placeholder="A Experiência Apple Mais Segura de Teresópolis"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subtítulo Explicativo
                  </label>
                  <textarea
                    name="differentials_subtitle"
                    value={formData.differentials_subtitle}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Comprar seu iPhone novo ou seminovo não precisa ser arriscado nem demorado."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>

                {/* Os 4 Cards de Diferenciais */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Os 4 Cards de Diferenciais da Loja
                  </h3>

                  <div className="space-y-3">
                    {formData.differentials.map((diff, index) => (
                      <div key={index} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                            #{index + 1}
                          </span>
                          <input
                            type="text"
                            value={diff.icon}
                            onChange={(e) => handleDifferentialChange(index, 'icon', e.target.value)}
                            placeholder="Ícone / Emoji (ex: 🚚)"
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-center text-sm font-bold"
                          />
                          <input
                            type="text"
                            value={diff.title}
                            onChange={(e) => handleDifferentialChange(index, 'title', e.target.value)}
                            placeholder="Título do Diferencial"
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                          />
                        </div>
                        <textarea
                          value={diff.description}
                          onChange={(e) => handleDifferentialChange(index, 'description', e.target.value)}
                          placeholder="Descrição detalhada deste diferencial..."
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 5: LANDING PAGE — TROCA (TRADE-IN) ───────────── */}
            {activeTab === 'troca' && (
              <div className="space-y-5 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Landing Page: Seção de Troca (Trade-in)</h2>
                    <p className="text-xs text-slate-500">
                      Permite que clientes usem o aparelho usado como entrada no novo.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="enable_tradein"
                      checked={formData.enable_tradein}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {formData.enable_tradein ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Selo da Seção
                        </label>
                        <input
                          name="tradein_badge"
                          value={formData.tradein_badge}
                          onChange={handleChange}
                          placeholder="Trade-in Inteligente"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Subtítulo Superior (Eyebrow)
                        </label>
                        <input
                          name="tradein_eyebrow"
                          value={formData.tradein_eyebrow}
                          onChange={handleChange}
                          placeholder="Troque de Aparelho"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Título da Seção de Troca
                      </label>
                      <input
                        name="tradein_title"
                        value={formData.tradein_title}
                        onChange={handleChange}
                        placeholder="Seu iPhone Usado Vale Dinheiro na Troca"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Subtítulo Explicativo
                      </label>
                      <textarea
                        name="tradein_subtitle"
                        value={formData.tradein_subtitle}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Aceitamos seu iPhone a partir do modelo XR como entrada no novo. Avaliação rápida, justa e sem burocracia."
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      />
                    </div>

                    {/* Os 3 Passos */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Os 3 Passos da Simulação de Troca
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <span className="text-[11px] font-bold text-blue-600 block">Passo 1</span>
                          <input
                            name="tradein_step1_title"
                            value={formData.tradein_step1_title}
                            onChange={handleChange}
                            placeholder="Envie as Fotos no WhatsApp"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          />
                          <textarea
                            name="tradein_step1_desc"
                            value={formData.tradein_step1_desc}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Mande fotos do aparelho..."
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600"
                          />
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <span className="text-[11px] font-bold text-blue-600 block">Passo 2</span>
                          <input
                            name="tradein_step2_title"
                            value={formData.tradein_step2_title}
                            onChange={handleChange}
                            placeholder="Receba a Avaliação Imediata"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          />
                          <textarea
                            name="tradein_step2_desc"
                            value={formData.tradein_step2_desc}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Nosso especialista avalia..."
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600"
                          />
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <span className="text-[11px] font-bold text-blue-600 block">Passo 3</span>
                          <input
                            name="tradein_step3_title"
                            value={formData.tradein_step3_title}
                            onChange={handleChange}
                            placeholder="Pague Só a Diferença"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          />
                          <textarea
                            name="tradein_step3_desc"
                            value={formData.tradein_step3_desc}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Entregamos o aparelho novo..."
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Texto do Botão de Simulação
                      </label>
                      <input
                        name="tradein_button_text"
                        value={formData.tradein_button_text}
                        onChange={handleChange}
                        placeholder="Simular Troca no WhatsApp Agora"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                    A seção de troca está desativada. Ela não será exibida na landing page.
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 6: LANDING PAGE — PONTO FÍSICO & AVALIAÇÕES ──── */}
            {activeTab === 'local' && (
              <div className="space-y-5 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Ponto Físico / Retirada Presencial</h2>
                    <p className="text-xs text-slate-500">
                      Caso possua loja ou endereço parceiro para atendimento presencial.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="enable_physical_location"
                      checked={formData.enable_physical_location}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {formData.enable_physical_location ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Selo / Tag do Local
                        </label>
                        <input
                          name="location_badge"
                          value={formData.location_badge}
                          onChange={handleChange}
                          placeholder="Ponto Físico Oficial de Apoio"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Título do Ponto Físico
                        </label>
                        <input
                          name="location_title"
                          value={formData.location_title}
                          onChange={handleChange}
                          placeholder="Loja Parceira SejaDelta em Teresópolis"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Descrição do Atendimento Presencial
                      </label>
                      <textarea
                        name="location_desc"
                        value={formData.location_desc}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Você conta com o suporte e a segurança de um endereço presencial no centro da cidade para retirar aparelhos..."
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Link de Como Chegar no Google Maps
                      </label>
                      <input
                        name="google_maps_url"
                        value={formData.google_maps_url || ''}
                        onChange={handleChange}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                    O card de ponto físico está desativado (ideal para lojas 100% online).
                  </div>
                )}

                {/* Cabeçalho da Seção de Avaliações */}
                <div className="pt-5 border-t border-slate-100 space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Textos da Seção de Depoimentos & Avaliações
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Selo da Seção</label>
                      <input
                        name="reviews_badge"
                        value={formData.reviews_badge}
                        onChange={handleChange}
                        placeholder="Google 4,9 ★"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Subtítulo Superior (Eyebrow)</label>
                      <input
                        name="reviews_eyebrow"
                        value={formData.reviews_eyebrow}
                        onChange={handleChange}
                        placeholder="Depoimentos Reais"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Título da Seção de Avaliações</label>
                    <input
                      name="reviews_title"
                      value={formData.reviews_title}
                      onChange={handleChange}
                      placeholder="Quem Compra em Teresópolis Recomenda"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Subtítulo da Seção</label>
                    <textarea
                      name="reviews_subtitle"
                      value={formData.reviews_subtitle}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Mais de 500 clientes atendidos com nota máxima em procedência e rapidez."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 7: MENSAGENS DO WHATSAPP ─────────────────────── */}
            {activeTab === 'mensagens' && (
              <div className="space-y-5 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Mensagens Automáticas do WhatsApp</h2>
                  <p className="text-xs text-slate-500">
                    Defina o formato exato das mensagens enviadas quando um cliente clica para pedir um produto ou solicitar troca.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Template do Pedido de Produto
                    </label>
                    <span className="text-[11px] text-blue-600 font-bold">Variáveis disponíveis</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {['{store_name}', '{nome}', '{preco}', '{storage}', '{condition}'].map((v) => (
                      <span key={v} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-mono">
                        {v}
                      </span>
                    ))}
                  </div>
                  <textarea
                    name="whatsapp_message_template"
                    value={formData.whatsapp_message_template || ''}
                    onChange={handleChange}
                    rows={7}
                    placeholder={`Olá, equipe {store_name}! Gostaria de pedir este iPhone que vi no catálogo:\n\n📱 *Aparelho:* {nome}\n💰 *Valor:* {preco}\n💾 *Capacidade:* {storage}\n✨ *Condição:* {condition}\n\nGostaria de confirmar a disponibilidade para entrega hoje!`}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Template da Mensagem de Troca (Trade-in)
                  </label>
                  <textarea
                    name="tradein_whatsapp_message"
                    value={formData.tradein_whatsapp_message || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Olá, equipe {store_name}! Gostaria de fazer uma simulação de Troca com Troco (Trade-in) do meu iPhone usado por um novo."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* ─── TAB 8: VISUAL & TEMA ─────────────────────────────── */}
            {activeTab === 'visual' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Visual & Tema da Vitrine</h2>
                  <p className="text-xs text-slate-500">Escolha o modo de cor e as tonalidades da sua marca.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Tema Padrão da Loja
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'white', label: 'Clean White', desc: 'Claro, Minimalista e Iluminado' },
                      { id: 'black-piano', label: 'Black Piano', desc: 'Premium, Escuro e Luxuoso' },
                      { id: 'custom', label: 'Personalizado', desc: 'Defina cores exclusivas da sua marca' },
                    ].map((t) => (
                      <label
                        key={t.id}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                          formData.theme_mode === t.id
                            ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600/30'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="theme_mode"
                          value={t.id}
                          checked={formData.theme_mode === t.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="font-bold text-slate-900 mb-1 text-sm">{t.label}</div>
                        <div className="text-xs text-slate-500">{t.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.theme_mode === 'custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Cor Primária
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          name="primary_color"
                          value={formData.primary_color}
                          onChange={handleChange}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0"
                        />
                        <input
                          type="text"
                          name="primary_color"
                          value={formData.primary_color}
                          onChange={handleChange}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 outline-none uppercase font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Cor de Destaque (Accent)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          name="accent_color"
                          value={formData.accent_color}
                          onChange={handleChange}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0"
                        />
                        <input
                          type="text"
                          name="accent_color"
                          value={formData.accent_color}
                          onChange={handleChange}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 outline-none uppercase font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Fonte Tipográfica
                  </label>
                  <select
                    name="font_family"
                    value={formData.font_family}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  >
                    <option value="Inter">Inter (Moderna, Alta Legibilidade)</option>
                    <option value="Poppins">Poppins (Arredondada, Descontraída)</option>
                    <option value="Montserrat">Montserrat (Elegante e Sofisticada)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ─── TAB: HEADER & RODAPÉ ─────────────────────────────── */}
            {activeTab === 'header_footer' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Cabeçalho (Header) & Rodapé (Footer)</h2>
                  <p className="text-xs text-slate-500">
                    Personalize barras de comunicado, botões de ação do topo, textos sobre a empresa, links de navegação e copyright.
                  </p>
                </div>

                {/* 1. SEÇÃO CABEÇALHO */}
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-5">
                  <div className="border-b border-slate-200/80 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>Cabeçalho da Vitrine (Header)</span>
                    </h3>
                    <p className="text-xs text-slate-500">Posicionamento da marca, logo, widgets e barra de comunicados.</p>
                  </div>

                  {/* Alinhamento Logo Mobile & Web */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Alinhamento Mobile */}
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Logo & Nome no Mobile (Smartphones)
                        </label>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Padrão: Esquerda
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Como a sua marca será exibida no cabeçalho dos celulares:
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {[
                          { id: 'left', label: 'Esquerda (Padrão)' },
                          { id: 'center', label: 'Centro' },
                          { id: 'right', label: 'Direita' },
                        ].map((align) => (
                          <button
                            key={align.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, header_logo_alignment_mobile: align.id as any }))}
                            className={`py-2 px-1 text-center rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              (formData.header_logo_alignment_mobile || 'left') === align.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Alinhamento Web/Desktop */}
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Logo & Nome na Web (Desktop)
                        </label>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Padrão: Esquerda
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Posição da logo na barra de navegação dos computadores:
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {[
                          { id: 'left', label: 'Esquerda (Padrão)' },
                          { id: 'center', label: 'Centro' },
                          { id: 'right', label: 'Direita' },
                        ].map((align) => (
                          <button
                            key={align.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, header_logo_alignment_desktop: align.id as any }))}
                            className={`py-2 px-1 text-center rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              (formData.header_logo_alignment_desktop || 'left') === align.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Widgets do Cabeçalho */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Widgets & Recursos do Cabeçalho</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Widget 1: WhatsApp Direto no Mobile */}
                      <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Ícone WhatsApp no Mobile</div>
                          <div className="text-[11px] text-slate-500">Atalho rápido para o cliente chamar no WhatsApp pelo cabeçalho do celular</div>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${formData.header_show_whatsapp_mobile !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                          <input type="checkbox" name="header_show_whatsapp_mobile" checked={formData.header_show_whatsapp_mobile !== false} onChange={handleChange} className="sr-only" />
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.header_show_whatsapp_mobile !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </label>

                      {/* Widget 2: Alternador de Tema */}
                      <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Alternador de Modo Escuro / Claro</div>
                          <div className="text-[11px] text-slate-500">Chave deslizante neumórfica para o visitante trocar o tema no cabeçalho</div>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${formData.header_show_theme_toggle !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                          <input type="checkbox" name="header_show_theme_toggle" checked={formData.header_show_theme_toggle !== false} onChange={handleChange} className="sr-only" />
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.header_show_theme_toggle !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </label>

                      {/* Widget 3: Badge de Horário / Status */}
                      <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Badge de Horário / Status</div>
                          <div className="text-[11px] text-slate-500">Exibe badge informando se a loja está aberta ou horário de atendimento</div>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${formData.header_show_hours_badge !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                          <input type="checkbox" name="header_show_hours_badge" checked={formData.header_show_hours_badge !== false} onChange={handleChange} className="sr-only" />
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.header_show_hours_badge !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </label>

                      {/* Widget 4: Botão de Ação CTA */}
                      <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Botão de Ação (CTA) Web</div>
                          <div className="text-[11px] text-slate-500">Exibe o botão de contato em destaque no cabeçalho para computadores</div>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${formData.header_show_whatsapp_button !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                          <input type="checkbox" name="header_show_whatsapp_button" checked={formData.header_show_whatsapp_button !== false} onChange={handleChange} className="sr-only" />
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.header_show_whatsapp_button !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </label>
                    </div>

                    {formData.header_show_hours_badge !== false && (
                      <div className="pt-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Texto Personalizado do Badge de Horário (Opcional)
                        </label>
                        <input
                          name="header_hours_text"
                          value={formData.header_hours_text || ''}
                          onChange={handleChange}
                          placeholder="Deixe em branco para automático (Ex: Aberto até 18:00)"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                        />
                      </div>
                    )}
                  </div>

                  {/* Toggle Barra de Anúncio */}
                  <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Barra de Comunicado no Topo</div>
                      <div className="text-[11px] sm:text-xs text-slate-500">Exibir faixa destacada no topo da vitrine com aviso importante, frete ou garantia</div>
                    </div>
                    <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${formData.header_show_announcement ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <input type="checkbox" name="header_show_announcement" checked={Boolean(formData.header_show_announcement)} onChange={handleChange} className="sr-only" />
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.header_show_announcement ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </label>

                  {formData.header_show_announcement && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Texto da Barra de Comunicado
                      </label>
                      <input
                        name="header_announcement_text"
                        value={formData.header_announcement_text || ''}
                        onChange={handleChange}
                        placeholder="Ex: ⚡ Entrega Express em até 1 hora na sua porta • Pagamento na entrega!"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Texto do Link "Início"
                      </label>
                      <input
                        name="header_nav_home_label"
                        value={formData.header_nav_home_label || ''}
                        onChange={handleChange}
                        placeholder="Início"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Texto do Link "Catálogo"
                      </label>
                      <input
                        name="header_nav_catalog_label"
                        value={formData.header_nav_catalog_label || ''}
                        onChange={handleChange}
                        placeholder="Catálogo / Estoque / Cardápio"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Texto do Botão de Ação (CTA) Web
                    </label>
                    <input
                      name="header_cta_text"
                      value={formData.header_cta_text || ''}
                      onChange={handleChange}
                      placeholder="Ex: Falar no WhatsApp, Ver Estoque, Fazer Pedido"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                {/* 2. SEÇÃO RODAPÉ - SOBRE E COPYRIGHT */}
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="border-b border-slate-200/80 pb-2">
                    <h3 className="text-sm font-bold text-slate-900">Rodapé: Sobre & Copyright</h3>
                    <p className="text-xs text-slate-500">Texto institucional da loja e rodapé de encerramento.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Texto Institucional / Missão da Loja
                    </label>
                    <textarea
                      name="footer_about_text"
                      value={formData.footer_about_text || ''}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Breve parágrafo descrevendo sua loja, tempo de mercado, procedência e garantia."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Texto de Copyright
                    </label>
                    <input
                      name="footer_custom_copyright"
                      value={formData.footer_custom_copyright || ''}
                      onChange={handleChange}
                      placeholder="Ex: © 2026 Minha Loja. Todos os direitos reservados."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                {/* 3. SEÇÃO RODAPÉ - COLUNA NAVEGAÇÃO */}
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="border-b border-slate-200/80 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Rodapé: Coluna de Navegação</h3>
                      <p className="text-xs text-slate-500">Links rápidos da vitrine para seções da página e catálogo.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-bold text-slate-700">Ativar Coluna</span>
                      <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${formData.footer_show_navigation !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <input type="checkbox" name="footer_show_navigation" checked={formData.footer_show_navigation !== false} onChange={handleChange} className="sr-only" />
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${formData.footer_show_navigation !== false ? 'translate-x-4.5' : 'translate-x-1'}`} />
                      </div>
                    </label>
                  </div>

                  {formData.footer_show_navigation !== false && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Título da Coluna
                          </label>
                          <input
                            name="footer_nav_title"
                            value={formData.footer_nav_title || ''}
                            onChange={handleChange}
                            placeholder="Navegação / Catálogo"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Link "Início"
                          </label>
                          <input
                            name="footer_nav_home_label"
                            value={formData.footer_nav_home_label || ''}
                            onChange={handleChange}
                            placeholder="Início"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Link "Catálogo"
                          </label>
                          <input
                            name="footer_catalog_link_label"
                            value={formData.footer_catalog_link_label || ''}
                            onChange={handleChange}
                            placeholder="Catálogo de Produtos"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {/* Entrega */}
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs font-bold text-slate-900">Link Entrega / Frete</span>
                            <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${formData.footer_show_delivery_link !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                              <input type="checkbox" name="footer_show_delivery_link" checked={formData.footer_show_delivery_link !== false} onChange={handleChange} className="sr-only" />
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${formData.footer_show_delivery_link !== false ? 'translate-x-4.5' : 'translate-x-1'}`} />
                            </div>
                          </label>
                          <input
                            name="footer_delivery_label"
                            value={formData.footer_delivery_label || ''}
                            onChange={handleChange}
                            placeholder="Entrega Express em 1h"
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>

                        {/* Trade-in */}
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs font-bold text-slate-900">Link Troca (Trade-in)</span>
                            <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${Boolean(formData.footer_show_tradein_link) ? 'bg-blue-600' : 'bg-slate-300'}`}>
                              <input type="checkbox" name="footer_show_tradein_link" checked={Boolean(formData.footer_show_tradein_link)} onChange={handleChange} className="sr-only" />
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${Boolean(formData.footer_show_tradein_link) ? 'translate-x-4.5' : 'translate-x-1'}`} />
                            </div>
                          </label>
                          <input
                            name="footer_tradein_label"
                            value={formData.footer_tradein_label || ''}
                            onChange={handleChange}
                            placeholder="Troca com Troco"
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>

                        {/* Ponto Físico */}
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs font-bold text-slate-900">Link Ponto Físico</span>
                            <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${formData.footer_show_location_link !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                              <input type="checkbox" name="footer_show_location_link" checked={formData.footer_show_location_link !== false} onChange={handleChange} className="sr-only" />
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${formData.footer_show_location_link !== false ? 'translate-x-4.5' : 'translate-x-1'}`} />
                            </div>
                          </label>
                          <input
                            name="footer_location_label"
                            value={formData.footer_location_label || ''}
                            onChange={handleChange}
                            placeholder="Ponto Físico / Showroom"
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. SEÇÃO RODAPÉ - COLUNA INSTITUCIONAL */}
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="border-b border-slate-200/80 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Rodapé: Coluna Institucional</h3>
                      <p className="text-xs text-slate-500">Links sobre termos, garantia e institucional da loja.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-bold text-slate-700">Ativar Coluna</span>
                      <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${formData.footer_show_institutional !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <input type="checkbox" name="footer_show_institutional" checked={formData.footer_show_institutional !== false} onChange={handleChange} className="sr-only" />
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${formData.footer_show_institutional !== false ? 'translate-x-4.5' : 'translate-x-1'}`} />
                      </div>
                    </label>
                  </div>

                  {formData.footer_show_institutional !== false && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Título da Coluna
                        </label>
                        <input
                          name="footer_inst_title"
                          value={formData.footer_inst_title || ''}
                          onChange={handleChange}
                          placeholder="Institucional / Transparência"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Link "Sobre a Loja"
                        </label>
                        <input
                          name="footer_about_link_label"
                          value={formData.footer_about_link_label || ''}
                          onChange={handleChange}
                          placeholder="Sobre Nossa Loja"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Link "Termos / Garantia"
                        </label>
                        <input
                          name="footer_warranty_link_label"
                          value={formData.footer_warranty_link_label || ''}
                          onChange={handleChange}
                          placeholder="Termos de Garantia"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. SEÇÃO RODAPÉ - COLUNA DE ATENDIMENTO */}
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="border-b border-slate-200/80 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Rodapé: Coluna de Contato & Localização</h3>
                      <p className="text-xs text-slate-500">Exibição de endereço, horário de funcionamento e WhatsApp no rodapé.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-bold text-slate-700">Ativar Coluna</span>
                      <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${formData.footer_show_contact !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <input type="checkbox" name="footer_show_contact" checked={formData.footer_show_contact !== false} onChange={handleChange} className="sr-only" />
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${formData.footer_show_contact !== false ? 'translate-x-4.5' : 'translate-x-1'}`} />
                      </div>
                    </label>
                  </div>

                  {formData.footer_show_contact !== false && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Título da Coluna de Contato
                      </label>
                      <input
                        name="footer_contact_title"
                        value={formData.footer_contact_title || ''}
                        onChange={handleChange}
                        placeholder="Atendimento / Fale Conosco"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB 9: CONTATO & REDES SOCIAIS ───────────────────── */}
            {activeTab === 'contato' && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Contato & Redes Sociais</h2>
                  <p className="text-xs text-slate-500">Canais de atendimento direto e perfis oficiais da loja.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      WhatsApp para Pedidos (apenas números com DDD)
                    </label>
                    <input
                      name="whatsapp"
                      value={formData.whatsapp || ''}
                      onChange={handleChange}
                      placeholder="Ex: 5521964639999"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Telefone Formatado para Exibição
                    </label>
                    <input
                      name="phone_display"
                      value={formData.phone_display || ''}
                      onChange={handleChange}
                      placeholder="Ex: (21) 96463-9999"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Endereço Completo
                    </label>
                    <input
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      placeholder="Ex: Av. José Joaquim de Araújo Regadas, 146"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-[2]">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Cidade
                      </label>
                      <input
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        placeholder="Teresópolis"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        UF
                      </label>
                      <input
                        name="state"
                        value={formData.state || ''}
                        onChange={handleChange}
                        maxLength={2}
                        placeholder="RJ"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none uppercase text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Horário de Funcionamento
                  </label>
                  <input
                    name="business_hours"
                    value={formData.business_hours || ''}
                    onChange={handleChange}
                    placeholder="Seg a Sab: 10h às 18h"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Redes Sociais</h3>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      name="instagram_url"
                      value={formData.instagram_url || ''}
                      onChange={handleChange}
                      placeholder="https://instagram.com/sua-loja"
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      name="facebook_url"
                      value={formData.facebook_url || ''}
                      onChange={handleChange}
                      placeholder="https://facebook.com/sua-loja"
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 10: SEO & GOOGLE ─────────────────────────────── */}
            {activeTab === 'seo' && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">SEO & Google</h2>
                  <p className="text-xs text-slate-500">Como sua vitrine aparece nos resultados de busca do Google e redes sociais.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Título SEO (Meta Title)
                  </label>
                  <input
                    name="meta_title"
                    value={formData.meta_title || ''}
                    onChange={handleChange}
                    placeholder="Terephones — iPhones Novos & Seminovos em Teresópolis"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    <span>Descrição SEO (Meta Description)</span>
                    <span className={(formData.meta_description?.length || 0) > 160 ? 'text-rose-600 font-bold' : 'text-slate-400 font-normal'}>
                      {formData.meta_description?.length || 0}/160
                    </span>
                  </label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="iPhones novos e seminovos em Teresópolis/RJ. Entrega Express em até 1h. Garantia de até 1 ano."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs sm:text-sm font-medium resize-none"
                  />
                </div>

                <div className="pt-2">
                  <ImageUploadField
                    label="Imagem de Compartilhamento Social (Open Graph / WhatsApp)"
                    value={formData.og_image_url || ''}
                    onChange={(val) => setFormData((prev) => ({ ...prev, og_image_url: val }))}
                    aspectRatio="video"
                    maxDimension={1200}
                    description="Imagem que aparece ao enviar o link da sua loja no WhatsApp, Instagram ou redes sociais (1200x630 recomendado)."
                    placeholder="https://..."
                  />
                </div>

                {/* Google Snippet Live Preview */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                    Prévia no Google
                  </span>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                    <p className="text-xs text-slate-500 mb-0.5">https://seusite.com/{merchantSlug || 'loja'}</p>
                    <p className="text-base text-blue-800 font-medium hover:underline cursor-pointer">
                      {formData.meta_title || `${formData.store_name || 'Loja'} — Catálogo Online`}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {formData.meta_description || 'Confira os modelos disponíveis a pronta entrega com garantia e entrega rápida.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 11: INTEGRAÇÕES ──────────────────────────────── */}
            {activeTab === 'integracoes' && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Integrações & Widgets Flutuantes</h2>
                  <p className="text-xs text-slate-500">Recursos interativos para os visitantes na loja.</p>
                </div>

                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900 text-sm mb-0.5">Botão Flutuante do WhatsApp</div>
                    <div className="text-xs text-slate-500">Exibir ícone flutuante do WhatsApp no canto da tela</div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.enable_whatsapp_float ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <input type="checkbox" name="enable_whatsapp_float" checked={formData.enable_whatsapp_float} onChange={handleChange} className="sr-only" />
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.enable_whatsapp_float ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-900 text-sm mb-0.5 flex items-center gap-2">
                        Chat Online Tawk.to
                      </div>
                      <div className="text-xs text-slate-500">Ativar widget de chat ao vivo na vitrine</div>
                    </div>
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.enable_tawk ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <input type="checkbox" name="enable_tawk" checked={formData.enable_tawk} onChange={handleChange} className="sr-only" />
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.enable_tawk ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </label>
                  {formData.enable_tawk && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Tawk.to Property ID / Direct Widget ID
                      </label>
                      <input
                        name="tawk_widget_id"
                        value={formData.tawk_widget_id || ''}
                        onChange={handleChange}
                        placeholder="Ex: 6aac00529d89af3444bee888/1k2o8b0j4"
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-600 text-xs sm:text-sm font-mono"
                      />
                    </div>
                  )}
                </div>

                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900 text-sm mb-0.5">Permitir Alternar Tema</div>
                    <div className="text-xs text-slate-500">Permite que o visitante alterne entre modo Clean White e Black Piano</div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.enable_dark_mode_toggle ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <input type="checkbox" name="enable_dark_mode_toggle" checked={formData.enable_dark_mode_toggle} onChange={handleChange} className="sr-only" />
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${formData.enable_dark_mode_toggle ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>
            )}

            {/* Bottom Save Button */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Todas as Configurações</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
