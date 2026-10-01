import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, useMemo, useRef } from 'react';
import { db, initDb } from '@/lib/mockDb';
import { Profile, StoreSettings, Product, ProductCategory } from '@/types';
import { MessageCircle, Search, LayoutGrid, List, Sparkles, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductDetailModal, type ProductItem } from '@/components/ProductDetailModal';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { WhatsFloat } from '@/components/WhatsFloat';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ThemeSelectorModal, type ThemeMode } from '@/components/ThemeSelectorModal';
import { TawkFloatingWidget } from '@/components/TawkFloatingWidget';
import { defaultProducts, fmt, WHATSAPP } from '@/data/storeData';
import { toast } from 'sonner';

export const Route = createFileRoute('/$slug/loja')({
  component: StoreCatalogPage,
});

function toProductItem(p: Product): ProductItem {
  const specsObj: Record<string, string | undefined> = 
    Array.isArray(p.specs)
      ? Object.fromEntries((p.specs as any[]).map((s: any) => [s.key || s.name, s.value]))
      : (p.specs as Record<string, string | undefined>) || {};

  return {
    name: p.name,
    price: p.price,
    cat: p.category_name || (p.badge?.toLowerCase().includes('lacrado') ? 'Lacrados' : (p.badge?.toLowerCase().includes('seminov') ? 'Seminovos' : '')),
    badge: p.badge || '',
    img: p.primary_image || p.images?.[0] || '',
    images: p.images && p.images.length > 0 ? p.images : (p.primary_image ? [p.primary_image] : []),
    specs: Object.values(specsObj).filter(Boolean).join(' • '),
    storage: specsObj.storage,
    condition: specsObj.condition,
    warranty: specsObj.warranty,
    battery: specsObj.battery,
    screen: specsObj.screen,
    camera: specsObj.camera,
    chip: specsObj.chip,
    quantity: p.quantity,
    is_featured: p.is_featured,
    description: p.description,
  };
}

function StoreCatalogPage() {
  const { slug } = Route.useParams();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('white');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Mouse Drag-to-Scroll for categories
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isDraggingCategory, setIsDraggingCategory] = useState(false);
  const [categoryStartX, setCategoryStartX] = useState(0);
  const [categoryScrollLeft, setCategoryScrollLeft] = useState(0);

  const handleCategoryMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return;
    setIsDraggingCategory(true);
    setCategoryStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setCategoryScrollLeft(categoryScrollRef.current.scrollLeft);
  };

  const handleCategoryMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCategory || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - categoryStartX) * 1.5;
    categoryScrollRef.current.scrollLeft = categoryScrollLeft - walk;
  };

  const handleCategoryMouseUpOrLeave = () => {
    setIsDraggingCategory(false);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    const offset = direction === 'left' ? -220 : 220;
    categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  useEffect(() => {
    initDb();
    
    const p = db.profiles.getBySlug(slug);
    if (!p || !p.is_active) {
      setLoading(false);
      return;
    }
    
    setProfile(p);
    const s = db.storeSettings.getBySlug(slug) || null;
    setSettings(s);

    const prods = db.products.getBySlug(slug);
    setProducts(prods && prods.length > 0 ? prods : []);
    
    const cats = db.categories
      .getByProfileId(p.id)
      .filter((c) => c.name.toLowerCase() !== 'todos' && c.slug.toLowerCase() !== 'todos' && c.slug.toLowerCase() !== 'geral');
    setCategories(cats);

    // Theme initialization - scoped per store
    const themeKey = `zapstore_theme_${slug}`;
    const saved = localStorage.getItem(themeKey) as ThemeMode | null;
    const initialTheme: ThemeMode =
      saved === 'black-piano' || saved === 'white'
        ? saved
        : s?.theme_mode === 'black-piano'
        ? 'black-piano'
        : 'white';

    setCurrentTheme(initialTheme);
    const root = document.documentElement;
    root.classList.remove('theme-white', 'theme-black-piano', 'dark');
    if (initialTheme === 'black-piano') {
      root.classList.add('theme-black-piano', 'dark');
    } else {
      root.classList.add('theme-white');
    }

    setLoading(false);
  }, [slug]);

  // Track store visit
  useEffect(() => {
    if (profile?.id) {
      db.analytics.trackVisit(profile.id);
    }
  }, [profile?.id]);

  const toggleTheme = () => {
    const next: ThemeMode = currentTheme === 'black-piano' ? 'white' : 'black-piano';
    setCurrentTheme(next);
    const root = document.documentElement;
    root.classList.remove('theme-white', 'theme-black-piano', 'dark');
    if (next === 'black-piano') {
      root.classList.add('theme-black-piano', 'dark');
    } else {
      root.classList.add('theme-white');
    }
    localStorage.setItem(`zapstore_theme_${slug}`, next);
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: next } }));
    toast.success(next === 'black-piano' ? 'Modo Black ativado' : 'Modo Branco ativado', {
      id: 'theme-toggle',
      duration: 1200,
    });
  };

  const storeName = settings?.store_name || (slug === 'terephones' ? 'Terephones' : 'Loja');
  const isIphoneStore =
    slug === 'terephones' ||
    storeName.toLowerCase().includes('phone') ||
    storeName.toLowerCase().includes('apple');

  const productListItems = useMemo(() => {
    if (products.length > 0) {
      return products.map(toProductItem);
    }
    // Only fallback to defaultProducts for the official terephones demo store
    return slug === 'terephones' ? defaultProducts : [];
  }, [products, slug]);

  const categoryTabs = useMemo(() => {
    const dynamicNames = categories.map((c) => c.name);
    const fromProducts = productListItems.map((p) => p.cat).filter(Boolean) as string[];
    const allUnique = Array.from(new Set([...dynamicNames, ...fromProducts])).filter(
      (c) => c.toLowerCase() !== 'todos' && c.toLowerCase() !== 'geral' && c.toLowerCase() !== 'gerais'
    );
    return ['Todos', ...allUnique];
  }, [categories, productListItems]);

  const filteredProducts = useMemo(() => {
    return productListItems.filter(p => {
      const isItemNovo =
        p.cat.toLowerCase().includes('novo') ||
        p.cat.toLowerCase().includes('lacrad') ||
        p.badge.toLowerCase().includes('lacrad') ||
        p.badge.toLowerCase().includes('novo') ||
        p.name.toLowerCase().includes('lacrad');
      const matchCat =
        selectedCategory === 'Todos' ||
        p.cat.toLowerCase() === selectedCategory.toLowerCase() ||
        (isIphoneStore && selectedCategory.toLowerCase() === 'lacrados' && isItemNovo) ||
        (isIphoneStore && selectedCategory.toLowerCase() === 'seminovos' && !isItemNovo);
      const matchSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.specs && p.specs.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.storage && p.storage.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [productListItems, selectedCategory, searchQuery, isIphoneStore]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured: products marked as is_featured come first
      list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Dynamic SEO meta tags and Page Title
  useEffect(() => {
    if (settings?.meta_title) {
      document.title = `${settings.meta_title} | Catálogo`;
    } else if (settings?.store_name) {
      document.title = `${settings.store_name} | Catálogo de Produtos`;
    }

    if (settings?.meta_description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', settings.meta_description);
    }
  }, [settings?.meta_title, settings?.meta_description, settings?.store_name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#06080d] transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 flex-col px-4">
        <h1 className="text-3xl font-extrabold mb-2">Loja não encontrada</h1>
        <p className="text-slate-600 mb-6">A loja que você procura não existe ou está inativa.</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-md transition">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const rawWhatsapp = settings.whatsapp || '5521964639999';
  const whatsDigits = rawWhatsapp.replace(/\D/g, '');
  const phoneDisplay = settings.phone_display || '(21) 96463-9999';

  const handleOrderWhatsApp = (prod: ProductItem) => {
    if (profile?.id) {
      db.analytics.trackLead(profile.id);
    }

    const isNovo =
      prod.cat === 'Novos' ||
      prod.cat === 'Lacrados' ||
      prod.badge.toLowerCase().includes('lacrad') ||
      prod.badge.toLowerCase().includes('novo') ||
      prod.name.toLowerCase().includes('lacrad');

    const storageDisplay =
      prod.storage || prod.name.match(/\d+(gb|tb)/i)?.[0]?.toUpperCase() || '';

    const condText = isNovo
      ? 'Novo Lacrado de Fábrica'
      : `Seminovo Grade A+${prod.battery ? ` (Saúde da Bateria: ${prod.battery})` : ''}`;

    let text = settings.whatsapp_message_template;
    if (!text) {
      if (isIphoneStore) {
        text = `Olá, equipe ${storeName}! Gostaria de pedir este item que vi na Loja:

📱 *Aparelho:* ${prod.name}
💰 *Valor à vista:* ${fmt(prod.price)} (ou até 18x no cartão)${storageDisplay ? `\n💾 *Capacidade:* ${storageDisplay}` : ''}
✨ *Condição:* ${condText}

Gostaria de confirmar a disponibilidade para entrega hoje!`;
      } else {
        text = `Olá, equipe ${storeName}! Gostaria de pedir este item que vi no catálogo:

📦 *Produto:* ${prod.name}
💰 *Valor:* ${fmt(prod.price)}
🏷️ *Categoria:* ${prod.cat || 'Geral'}${prod.specs ? `\n⚙️ *Especificações:* ${prod.specs}` : ''}

Gostaria de confirmar a disponibilidade!`;
      }
    } else {
      text = text
        .replace(/{store_name}/g, storeName)
        .replace(/{nome}/g, prod.name)
        .replace(/{preco}/g, fmt(prod.price))
        .replace(/{storage}/g, storageDisplay)
        .replace(/{condition}/g, condText);
    }

    window.open(`https://wa.me/${whatsDigits}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-slate-900 dark:text-white transition-colors duration-300 pb-32 sm:pb-24"
      style={{
        '--primary': settings.primary_color || '#2563eb',
        '--accent': settings.accent_color || '#0ea5e9',
      } as React.CSSProperties}
    >
      <ThemeSelectorModal currentTheme={currentTheme} onThemeChange={setCurrentTheme} />

      {/* Navbar with dynamic store props */}
      <SiteNavbar
        currentTheme={currentTheme}
        toggleTheme={toggleTheme}
        basePath={`/${slug}`}
        storeName={storeName}
        storeLogo={settings.logo_url}
        whatsapp={rawWhatsapp}
        showThemeToggle={settings.enable_dark_mode_toggle !== false}
        header_logo_alignment_desktop={settings.header_logo_alignment_desktop}
        header_logo_alignment_mobile={settings.header_logo_alignment_mobile}
        header_show_theme_toggle={settings.header_show_theme_toggle}
        header_show_hours_badge={settings.header_show_hours_badge}
        header_hours_text={settings.header_hours_text}
        header_show_whatsapp_mobile={settings.header_show_whatsapp_mobile}
        header_show_announcement={settings.header_show_announcement}
        header_announcement_text={settings.header_announcement_text}
        header_cta_text={settings.header_cta_text}
        header_show_whatsapp_button={settings.header_show_whatsapp_button}
        header_nav_home_label={settings.header_nav_home_label}
        header_nav_catalog_label={settings.header_nav_catalog_label}
      />

      {/* Header */}
      <div className="pt-32 sm:pt-36 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-sky-950/60 text-blue-600 dark:text-sky-400 border border-blue-200/80 dark:border-sky-800/80 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catálogo Pronta Entrega</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Estoque de {storeName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-4">
          {settings.store_tagline || (isIphoneStore ? 'Aparelhos selecionados, revisados e com entrega express em até 1h. Pague com segurança na entrega.' : 'Confira nosso catálogo de produtos exclusivos e faça seu pedido direto pelo WhatsApp.')}
        </p>
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200/70 dark:border-blue-700/50">
          <span>{sortedProducts.length} de {productListItems.length} itens encontrados</span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mb-20 sm:mb-28">
        {/* Controls Bar */}
        <div className="p-3 sm:p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-center bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          {/* Category Tabs with Mouse Drag & Arrow Navigation */}
          <div className="relative flex items-center w-full md:w-auto max-w-full group/cat">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="hidden sm:flex absolute left-0 z-10 w-7 h-7 -translate-x-2 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-400 transition cursor-pointer"
              aria-label="Rolar categorias para esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              onMouseDown={handleCategoryMouseDown}
              onMouseMove={handleCategoryMouseMove}
              onMouseUp={handleCategoryMouseUpOrLeave}
              onMouseLeave={handleCategoryMouseUpOrLeave}
              className="flex overflow-x-auto gap-1.5 p-1 w-full md:w-auto hide-scrollbar scrollbar-hide cursor-grab select-none active:cursor-grabbing scroll-smooth px-1 sm:px-6"
            >
              {categoryTabs.map(cat => (
                <button 
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="hidden sm:flex absolute right-0 z-10 w-7 h-7 translate-x-2 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-400 transition cursor-pointer"
              aria-label="Rolar categorias para direita"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search + Sort + Grid / List Toggle */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto items-center">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Buscar produto..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl py-2 pl-9 pr-8 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 transition cursor-pointer shadow-xs shrink-0"
              title="Ordenar produtos"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name-asc">Nome A-Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900/80 rounded-xl p-1 border border-slate-200/80 dark:border-slate-800/80 shrink-0">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded-lg transition-colors focus:outline-none cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Visualização em Grade"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded-lg transition-colors focus:outline-none cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Visualização em Lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid / List */}
        {productListItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-sky-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              Catálogo em Atualização
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              A equipe da loja {storeName} está preparando novidades para você. Chame agora no WhatsApp para conferir a disponibilidade ou solicitar um pedido personalizado!
            </p>
            <a
              href={`https://wa.me/${whatsDigits}?text=${encodeURIComponent(`Olá! Gostaria de consultar os produtos e novidades disponíveis na loja ${storeName}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { if (profile?.id) db.analytics.trackLead(profile.id); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Falar com Atendente no WhatsApp</span>
            </a>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1.5">
              Nenhum produto encontrado
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
              {searchQuery ? `Não encontramos itens correspondentes a "${searchQuery}".` : 'Não há itens disponíveis nesta categoria no momento.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Limpar Filtros
              </button>
              <a
                href={`https://wa.me/${whatsDigits}?text=${encodeURIComponent(`Olá! Estou buscando "${searchQuery || selectedCategory}" na loja ${storeName}, vocês têm em estoque?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Consultar no WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" : "flex flex-col gap-3 sm:gap-4"}>
            {sortedProducts.map(product => {
              const isNovo =
                product.cat.toLowerCase().includes('novo') ||
                product.cat.toLowerCase().includes('lacrad') ||
                product.badge.toLowerCase().includes('lacrad') ||
                product.badge.toLowerCase().includes('novo') ||
                product.name.toLowerCase().includes('lacrad');
              const catLabel = isIphoneStore
                ? (isNovo ? 'Novo Lacrado' : 'Seminovo Premium')
                : (product.cat || (isNovo ? 'Novo' : 'Destaque'));

              let batteryLabel = '';
              if (product.battery) {
                const match = product.battery.match(/(\d+)\s*%/);
                batteryLabel = match ? `Bateria ${match[1]}%` : `Bateria ${product.battery.replace(/^bateria\s*/i, '')}`;
              } else if (isIphoneStore && isNovo) {
                batteryLabel = 'Bateria 100%';
              }

              const isLowStock = product.quantity !== undefined && product.quantity > 0 && product.quantity <= 2;

              return (
                <div 
                  key={product.name} 
                  className={`glass-card p-3 sm:p-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative border border-slate-200/80 dark:border-slate-800/80 ${
                    viewMode === 'list' ? 'flex flex-row gap-4 sm:gap-6 items-center' : 'flex flex-col h-full justify-between'
                  }`}
                >
                  {/* Uniform Top Badge */}
                  {product.badge && (
                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-blue-600 text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs z-10 pointer-events-none">
                      {product.badge}
                    </span>
                  )}

                  {/* Image */}
                  <div 
                    className={`relative flex items-center justify-center cursor-pointer shrink-0 ${
                      viewMode === 'list' ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-full h-36 sm:h-44 py-2 sm:py-3'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img 
                      src={product.img || ''} 
                      alt={product.name} 
                      className="w-full h-full max-h-full object-contain transition-transform duration-300 hover:scale-105 select-none" 
                    />
                  </div>

                  {/* Info */}
                  <div className={`flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center text-left' : 'text-left mt-2 flex flex-col justify-between'}`}>
                    <div>
                      {/* Fixed height badge row: no line wrapping to ensure identical heights */}
                      <div className="flex items-center justify-between gap-1 mb-1.5 w-full h-6 overflow-hidden">
                        <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/80 text-blue-600 dark:text-sky-400 border border-blue-200/60 dark:border-sky-800/60 truncate max-w-[60%]">
                          {catLabel}
                        </span>
                        {batteryLabel ? (
                          <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 truncate max-w-[40%]">
                            {batteryLabel}
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 truncate max-w-[40%]">
                            Últimas {product.quantity} un.
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[40%]">
                            {product.badge || 'Disponível'}
                          </span>
                        )}
                      </div>

                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        className="font-black text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 min-h-[2.5rem] leading-snug cursor-pointer hover:text-blue-600 dark:hover:text-sky-400 transition"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 h-4 sm:h-5 truncate">
                        {product.specs || product.storage || 'Pronta entrega'}
                      </p>
                    </div>
                    
                    {/* Price & Actions pinned to bottom */}
                    <div className="mt-auto">
                      <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-sm sm:text-lg font-black text-blue-600 dark:text-sky-400 leading-tight">
                          {fmt(product.price)}
                        </div>
                        <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          {product.price > 50000 ? 'Consulte opções de financiamento' : 'à vista ou até 18x no cartão'}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`mt-3 flex gap-1.5 ${viewMode === 'list' ? 'sm:flex-row' : 'flex-col'}`}>
                        <button 
                          type="button"
                          onClick={() => handleOrderWhatsApp(product)}
                          className="flex-1 py-1.5 sm:py-2 px-2 rounded-xl font-bold text-[11px] sm:text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition cursor-pointer"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>Pedir no Zap</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="py-1.5 sm:py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Detalhes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        whatsappNumber={whatsDigits}
        storeName={storeName}
      />

      {/* Footer */}
      <SiteFooter
        currentTheme={currentTheme}
        basePath={`/${slug}`}
        storeName={storeName}
        storeLogo={settings.logo_url}
        storeTagline={settings.store_tagline}
        whatsapp={rawWhatsapp}
        phoneDisplay={phoneDisplay}
        address={settings.address}
        city={settings.city}
        state={settings.state}
        businessHours={settings.business_hours}
        instagramUrl={settings.instagram_url}
        facebookUrl={settings.facebook_url}
        tiktokUrl={settings.tiktok_url}
        enable_tradein={settings.enable_tradein}
        enable_physical_location={settings.enable_physical_location}
        location_title={settings.location_title}
        footer_about_text={settings.footer_about_text}
        footer_show_navigation={settings.footer_show_navigation}
        footer_nav_title={settings.footer_nav_title}
        footer_nav_home_label={settings.footer_nav_home_label}
        footer_catalog_link_label={settings.footer_catalog_link_label}
        footer_show_tradein_link={settings.footer_show_tradein_link}
        footer_tradein_label={settings.footer_tradein_label}
        footer_show_delivery_link={settings.footer_show_delivery_link}
        footer_delivery_label={settings.footer_delivery_label}
        footer_show_location_link={settings.footer_show_location_link}
        footer_location_label={settings.footer_location_label}
        footer_show_institutional={settings.footer_show_institutional}
        footer_inst_title={settings.footer_inst_title}
        footer_about_link_label={settings.footer_about_link_label}
        footer_warranty_link_label={settings.footer_warranty_link_label}
        footer_show_contact={settings.footer_show_contact}
        footer_contact_title={settings.footer_contact_title}
        footer_custom_copyright={settings.footer_custom_copyright}
      />

      {/* Floating WhatsApp */}
      {settings.enable_whatsapp_float !== false && (
        <WhatsFloat
          whatsapp={rawWhatsapp}
          phoneDisplay={phoneDisplay}
          storeName={storeName}
        />
      )}

      {/* Tawk.to Live Chat */}
      {settings.enable_tawk && (
        <TawkFloatingWidget propertyId={settings.tawk_widget_id} />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav basePath={`/${slug}`} />
    </div>
  );
}

export default StoreCatalogPage;
