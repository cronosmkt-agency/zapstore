import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Truck,
  Building2,
  ShieldCheck,
  Star,
  ShoppingBag,
  Zap,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { ThemeSelectorModal, type ThemeMode } from "@/components/ThemeSelectorModal";
import { ProductDetailModal, type ProductItem } from "@/components/ProductDetailModal";
import { defaultProducts, fmt, WHATSAPP, PHONE_DISPLAY, reviews as defaultReviews } from "@/data/storeData";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsFloat } from "@/components/WhatsFloat";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { TawkFloatingWidget } from "@/components/TawkFloatingWidget";
import { db, initDb } from "@/lib/mockDb";
import type { Profile, StoreSettings, Product, StoreReview } from "@/types";
import { toast } from "sonner";

const heroIphone = "https://ik.imagekit.io/zinma/tr:w-800,f-webp,q-85/Terephones-iphone.png";

export const Route = createFileRoute("/$slug/")({
  component: SlugStorePage,
});

/* ---------- Visual Background Elements ---------- */
function BackgroundOrbs() {
  return (
    <div className="brand-bg" aria-hidden="true">
      <div className="brand-orb brand-orb-1" />
      <div className="brand-orb brand-orb-2" />
      <div className="brand-orb brand-orb-3" />
    </div>
  );
}

/* ---------- 3D Floating Tilt Phone (Desktop Only) ---------- */
function TiltPhone({ image }: { image?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const targetRef = useRef({ rotX: 0, rotY: 0 });
  const currentRef = useRef({ rotX: 0, rotY: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let isRunning = false;

    const animate = () => {
      const speed = 0.08;
      const diffX = targetRef.current.rotX - currentRef.current.rotX;
      const diffY = targetRef.current.rotY - currentRef.current.rotY;
      currentRef.current.rotX += diffX * speed;
      currentRef.current.rotY += diffY * speed;
      el.style.transform = `perspective(900px) rotateX(${currentRef.current.rotX}deg) rotateY(${currentRef.current.rotY}deg) scale3d(1.04, 1.04, 1.04)`;

      if (
        Math.abs(diffX) > 0.02 ||
        Math.abs(diffY) > 0.02 ||
        targetRef.current.rotX !== 0 ||
        targetRef.current.rotY !== 0
      ) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        isRunning = false;
        frameRef.current = undefined;
      }
    };

    const startAnimate = () => {
      if (!isRunning) {
        isRunning = true;
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      targetRef.current = { rotX: -dy * 16, rotY: dx * 16 };

      if (glowRef.current) {
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(26,111,232,0.18), transparent 65%)`;
      }
      startAnimate();
    };

    const onLeave = () => {
      targetRef.current = { rotX: 0, rotY: 0 };
      startAnimate();
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(26,111,232,0.18), transparent 65%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <img
        src={image || heroIphone}
        alt="iPhone em destaque"
        fetchPriority="high"
        decoding="async"
        width={500}
        height={500}
        className="relative z-10 w-[300px] lg:w-[460px] h-auto float-slow"
        style={{
          filter: "drop-shadow(0 35px 50px rgba(13,27,62,0.22))",
          transformStyle: "preserve-3d",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
}

/* ---------- Reusable Section Title ---------- */
function SectionTitle({
  eyebrow,
  title,
  subtitle,
  badge,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-sky-950/60 text-blue-600 dark:text-sky-400 border border-blue-200/80 dark:border-sky-800/80 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>
      )}
      {eyebrow && (
        <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-blue-600 dark:text-sky-400 mb-2">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------- Mapper from DB Product to Store ProductItem ---------- */
function mapToProductItem(p: Product): ProductItem {
  const specsObj: Record<string, string | undefined> =
    Array.isArray(p.specs)
      ? Object.fromEntries((p.specs as any[]).map((s: any) => [s.key || s.name, s.value]))
      : (p.specs as Record<string, string | undefined>) || {};

  return {
    name: p.name,
    price: p.price,
    cat: p.category_name || (p.badge?.toLowerCase().includes("lacrado") ? "Lacrados" : "Seminovos"),
    badge: p.badge || "",
    img: p.primary_image || p.images?.[0] || "",
    specs: Object.values(specsObj).filter(Boolean).join(" • "),
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

/* =========================================================================
   MAIN SLUG STORE PAGE
   ========================================================================= */
function SlugStorePage() {
  const { slug } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("white");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load store data on mount
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

    const isTerephones = slug === "terephones";

    const prods = db.products.getBySlug(slug);
    if (prods && prods.length > 0) {
      setProductList(prods.map(mapToProductItem));
    } else if (isTerephones) {
      setProductList(defaultProducts);
    } else {
      setProductList([]);
    }

    const revs = db.reviews.getVisibleBySlug(slug);
    if (revs && revs.length > 0) {
      setReviewsList(
        revs.map((r) => ({
          name: r.author_name,
          neighborhood: r.neighborhood || "Cliente",
          text: r.comment,
        }))
      );
    } else if (isTerephones) {
      setReviewsList(defaultReviews);
    } else {
      setReviewsList([]);
    }

    // Track store visit in analytics
    if (p.id) {
      db.analytics.trackVisit(p.id);
    }

    // Set initial theme based on store settings or scoped localStorage
    const themeKey = `zapstore_theme_${slug}`;
    const saved = (localStorage.getItem(themeKey) || (isTerephones ? localStorage.getItem("terephones_theme") : null)) as ThemeMode | null;
    const initialTheme: ThemeMode =
      saved === "black-piano" || saved === "white"
        ? saved
        : s?.theme_mode === "black-piano"
        ? "black-piano"
        : "white";

    setCurrentTheme(initialTheme);
    const root = document.documentElement;
    root.classList.remove("theme-white", "theme-black-piano", "dark");
    if (initialTheme === "black-piano") {
      root.classList.add("theme-black-piano", "dark");
    } else {
      root.classList.add("theme-white");
    }

    setLoading(false);
  }, [slug]);

  // Dynamic SEO meta tags and Page Title
  useEffect(() => {
    if (settings?.meta_title) {
      document.title = settings.meta_title;
    } else if (settings?.store_name) {
      document.title = `${settings.store_name} | Loja Oficial`;
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

  // Dynamic Theme Colors
  useEffect(() => {
    if (settings?.primary_color) {
      document.documentElement.style.setProperty('--store-primary', settings.primary_color);
    }
    if (settings?.accent_color) {
      document.documentElement.style.setProperty('--store-accent', settings.accent_color);
    }
    return () => {
      document.documentElement.style.removeProperty('--store-primary');
      document.documentElement.style.removeProperty('--store-accent');
    };
  }, [settings?.primary_color, settings?.accent_color]);

  const toggleTheme = () => {
    const next: ThemeMode = currentTheme === "black-piano" ? "white" : "black-piano";
    setCurrentTheme(next);
    const root = document.documentElement;
    root.classList.remove("theme-white", "theme-black-piano", "dark");
    if (next === "black-piano") {
      root.classList.add("theme-black-piano", "dark");
    } else {
      root.classList.add("theme-white");
    }
    localStorage.setItem(`zapstore_theme_${slug}`, next);
    if (slug === "terephones") {
      localStorage.setItem("terephones_theme", next);
    }
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: next } }));
    toast.success(next === "black-piano" ? "Modo Black ativado" : "Modo Branco ativado", {
      id: "theme-toggle",
      duration: 1200,
    });
  };

  const handleOpenDetail = (product: ProductItem) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleBuyWhatsApp = (prod: ProductItem) => {
    if (profile?.id) {
      db.analytics.trackLead(profile.id);
    }

    const isTerephones = slug === "terephones" || (settings?.store_name || "").toLowerCase().includes("terephones");
    const isNovo =
      prod.cat === "Novos" ||
      prod.cat === "Lacrados" ||
      prod.badge.toLowerCase().includes("lacrad") ||
      prod.badge.toLowerCase().includes("novo") ||
      prod.name.toLowerCase().includes("lacrad");
    const storageDisplay =
      prod.storage || prod.name.match(/\d+(gb|tb)/i)?.[0]?.toUpperCase() || "";
    const condText = isTerephones
      ? (isNovo
        ? "Novo Lacrado de Fábrica Apple"
        : `Seminovo Grade A+${prod.battery ? ` (Saúde da Bateria: ${prod.battery})` : ""}`)
      : (prod.specs || prod.condition || "Pronta entrega");

    const storeName = settings?.store_name || (isTerephones ? "Terephones" : "Loja");
    const defaultTemplate = isTerephones
      ? `Olá, equipe {store_name}! Gostaria de pedir este iPhone que vi no catálogo:\n\n📱 *Aparelho:* {nome}\n💰 *Valor à vista:* {preco} (ou até 18x no cartão)\n💾 *Capacidade:* {storage}\n✨ *Condição:* {condition}\n\nGostaria de confirmar a disponibilidade para entrega hoje!`
      : `Olá, equipe {store_name}! Gostaria de fazer o pedido deste item que vi no catálogo:\n\n🛍️ *Produto:* {nome}\n💰 *Valor:* {preco}\n✨ *Detalhes:* {condition}\n\nGostaria de verificar a disponibilidade e entrega!`;

    let text = settings?.whatsapp_message_template || defaultTemplate;

    text = text
      .replace(/{store_name}/g, storeName)
      .replace(/{nome}/g, prod.name)
      .replace(/{preco}/g, fmt(prod.price))
      .replace(/{storage}/g, storageDisplay || "Padrão")
      .replace(/{condition}/g, condText);

    const rawWhatsapp = settings?.whatsapp || "5521964639999";
    const digits = rawWhatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleTradeWhatsApp = () => {
    if (profile?.id) {
      db.analytics.trackLead(profile.id);
    }
    const storeName = settings?.store_name || "Terephones";
    let text = settings?.tradein_whatsapp_message || `Olá, equipe {store_name}! Gostaria de fazer uma simulação de Troca com Troco (Trade-in) do meu aparelho usado por um novo.`;
    text = text.replace(/{store_name}/g, storeName);
    const rawWhatsapp = settings?.whatsapp || "5521964639999";
    const digits = rawWhatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Top 4 best-sellers / featured products
  const featured = useMemo(() => {
    const list = productList;
    if (list.length === 0) return [];

    const explicit = list.filter((p: any) => p.is_featured);
    const chosen: ProductItem[] = [...explicit];

    if (chosen.length < 4 && slug === "terephones") {
      const findModel = (query: string) =>
        list.find((p) => p.name.toLowerCase().includes(query.toLowerCase()));

      const p1 = findModel("iPhone 17 Pro Max") || list[0];
      const p2 = findModel("iPhone 17 Pro") || findModel("iPhone 17 256GB") || findModel("iPhone 17") || list[1];
      const p3 = findModel("iPhone 16 Pro Max") || findModel("iPhone 16 Pro") || list[2];
      const p4 = findModel("iPhone 16 128GB") || findModel("iPhone 16") || findModel("iPhone 16 Pro") || list[3];

      [p1, p2, p3, p4].forEach((p) => {
        if (p && chosen.length < 4 && !chosen.some((c) => c.name === p.name)) {
          chosen.push(p);
        }
      });
    }

    if (chosen.length < 4) {
      for (const p of list) {
        if (!chosen.some((c) => c.name === p.name)) {
          chosen.push(p);
        }
        if (chosen.length === 4) break;
      }
    }

    return chosen.slice(0, 4);
  }, [productList, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile || !settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-4">
        <h1 className="text-3xl font-extrabold mb-2">Loja não encontrada</h1>
        <p className="text-slate-600 mb-6">A loja "{slug}" ainda não foi configurada ou está inativa.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition"
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  const rawWhatsapp = settings.whatsapp || "5521964639999";
  const whatsDigits = rawWhatsapp.replace(/\D/g, "");
  const whatsLink = `https://wa.me/${whatsDigits}`;
  const storeName = settings.store_name || "Terephones";
  const storeTagline = settings.store_tagline || "iPhones Novos & Seminovos em Teresópolis";
  const phoneDisplay = settings.phone_display || "(21) 96463-9999";

  const doubledReviews = [...reviewsList, ...reviewsList];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-slate-900 dark:text-white transition-colors duration-300"
      style={{
        "--primary": settings.primary_color || "#2563eb",
        "--accent": settings.accent_color || "#0ea5e9",
      } as React.CSSProperties}
    >
      <ThemeSelectorModal currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      <BackgroundOrbs />

      {/* Navbar with dynamic store props */}
      <SiteNavbar
        currentTheme={currentTheme}
        toggleTheme={toggleTheme}
        basePath={`/${slug}`}
        storeName={storeName}
        storeLogo={settings.logo_url}
        whatsapp={rawWhatsapp}
        showThemeToggle={settings.enable_dark_mode_toggle !== false}
      />

      <main>
        {/* 1. HERO SECTION */}
        <section
          id="inicio"
          className="hero-section-fold relative pt-24 pb-8 sm:pt-28 sm:pb-12 lg:py-16 px-4 sm:px-6 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-20 my-auto">
            {/* Left Column: Headlines & High-Value Buying CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50/90 dark:bg-sky-950/60 text-blue-600 dark:text-sky-400 border border-blue-200/80 dark:border-sky-800/80 shadow-xs mb-3 sm:mb-4 mx-auto lg:mx-0 w-fit">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{storeTagline}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-slate-900 dark:text-white">
                {settings.hero_title ? (
                  <span className="whitespace-pre-line">{settings.hero_title}</span>
                ) : slug === "terephones" ? (
                  <>
                    O seu novo{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-teal-300">
                      iPhone
                    </span>
                    ,<br />
                    na sua mão hoje.
                  </>
                ) : (
                  <>
                    Bem-vindo à{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-teal-300">
                      {storeName}
                    </span>
                  </>
                )}
              </h1>

              {/* Value Prop Subtitle */}
              <p className="mt-3 sm:mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {settings.hero_subtitle || (
                  slug === "terephones" ? (
                    <>
                      Entrega Express em até 1 hora na sua porta ou Retirada presencial na loja parceira{" "}
                      <strong className="text-slate-900 dark:text-white font-bold">SejaDelta</strong>.
                      Aparelhos revisados com até 1 ano de garantia Apple e{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                        pagamento somente na entrega!
                      </strong>{" "}
                      🍎⚡
                    </>
                  ) : (
                    <>
                      Confira nossa seleção exclusiva de produtos com procedência e qualidade garantida.
                      Faça seus pedidos de forma simples e direta pelo nosso WhatsApp oficial!
                    </>
                  )
                )}
              </p>

              {/* Action CTAs */}
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start">
                <Link
                  to="/$slug/loja"
                  params={{ slug }}
                  className="btn-primary-glow inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-6 rounded-full font-bold text-sm text-white shadow-lg active:scale-95 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{settings.cta_button_text || "Ver Catálogo na Loja"}</span>
                </Link>

                <a
                  href={whatsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-6 rounded-full font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Pedir no WhatsApp</span>
                </a>
              </div>

              {/* Micro Trust Indicators */}
              <div className="mt-5 sm:mt-8 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <span>{settings.trust_badge_rating || (slug === "terephones" ? "4,9 no Google" : "Nota 5.0")}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                  <Truck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{settings.trust_badge_delivery || (slug === "terephones" ? "Entrega em até 1h" : "Entrega Ágil")}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{settings.trust_badge_location || (slug === "terephones" ? "Ponto SejaDelta" : "Loja Verificada")}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-emerald-600 dark:text-emerald-400 font-black">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{settings.trust_badge_payment || (slug === "terephones" ? "Pague só na Entrega" : "Compra Segura")}</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Tilt Phone on Desktop */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
              <TiltPhone image={settings.hero_image_url || featured[0]?.img || (slug === "terephones" ? heroIphone : undefined)} />
            </div>
          </div>
        </section>

        {/* 2. FEATURED PRODUCTS */}
        <section id="destaques" className="py-10 sm:py-16 px-4 sm:px-6 relative scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <SectionTitle
              badge={settings.featured_badge || "Mais Desejados"}
              eyebrow={settings.featured_eyebrow || "Catálogo Selecionado"}
              title={settings.featured_title || "Destaques da Vitrine"}
              subtitle={settings.featured_subtitle || (slug === "terephones" ? "Os modelos mais procurados com garantia e pronta entrega imediata." : "Confira os itens mais procurados e disponíveis agora para pedido.")}
            />

            {featured.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4 glass-card rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 max-w-xl mx-auto my-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Novidades chegando no catálogo!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  Estamos cadastrando e atualizando nossos produtos. Fale direto com a nossa equipe pelo WhatsApp para consultar disponibilidade e fazer seu pedido exclusivo agora mesmo.
                </p>
                <a
                  href={whatsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 py-2.5 px-6 rounded-full font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Chamar no WhatsApp</span>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {featured.map((item) => {
                  const isNovo =
                    item.cat === "Novos" ||
                    item.cat === "Lacrados" ||
                    item.badge.toLowerCase().includes("lacrad") ||
                    item.badge.toLowerCase().includes("novo") ||
                    item.name.toLowerCase().includes("lacrad");
                  const catLabel = slug === "terephones"
                    ? (isNovo ? "Novo Lacrado" : "Seminovo Premium")
                    : (item.cat || "Destaque");

                  let tagLabel = item.badge || "";
                  if (slug === "terephones") {
                    if (item.battery) {
                      const match = item.battery.match(/(\d+)\s*%/);
                      tagLabel = match ? `Bateria ${match[1]}%` : `Bateria ${item.battery.replace(/^bateria\s*/i, "")}`;
                    } else if (isNovo) {
                      tagLabel = "Bateria 100%";
                    }
                  }

                  return (
                    <div
                      key={item.name}
                      className="glass-card flex flex-col justify-between p-3 sm:p-5 rounded-2xl group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
                    >
                      {/* Top Tags */}
                      <div className="flex items-center justify-between gap-1 mb-2 w-full">
                        <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/80 text-blue-600 dark:text-sky-400 border border-blue-200/60 dark:border-sky-800/60 truncate max-w-[50%]">
                          {catLabel}
                        </span>
                        {tagLabel ? (
                          <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 truncate max-w-[50%]">
                            {tagLabel}
                          </span>
                        ) : null}
                      </div>

                      {/* Product Photo */}
                      <div
                        className="relative py-2 sm:py-4 flex items-center justify-center cursor-pointer"
                        onClick={() => handleOpenDetail(item)}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className="w-24 h-24 sm:w-36 sm:h-36 object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="mt-1 sm:mt-2 text-left">
                        <h3
                          onClick={() => handleOpenDetail(item)}
                          className="font-black text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug cursor-pointer hover:text-blue-600 dark:hover:text-sky-400 transition"
                          title={item.name}
                        >
                          {item.name}
                        </h3>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
                          {item.specs || item.storage || "Pronta entrega"}
                        </div>

                        {/* Price Display */}
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-sm sm:text-xl font-black text-blue-600 dark:text-sky-400 leading-tight">
                            {fmt(item.price)}
                          </div>
                          <div className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                            à vista ou até 18x no cartão
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleBuyWhatsApp(item)}
                          className="w-full py-1.5 sm:py-2 px-2 rounded-xl font-bold text-[11px] sm:text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>Pedir no Zap</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(item)}
                          className="w-full py-1 sm:py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Info className="w-3 h-3" />
                          <span>Ver Detalhes</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Transition Banner to Full Store */}
            {productList.length > 0 && (
              <div className="mt-6 sm:mt-8 glass-card p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border border-blue-500/20 text-center sm:text-left">
                <div>
                  <div className="text-xs sm:text-base font-black text-slate-900 dark:text-white">
                    {settings.catalog_banner_title || "Buscando outro modelo, cor ou opção?"}
                  </div>
                  <div className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    {settings.catalog_banner_subtitle || (slug === "terephones" ? "Temos estoque completo atualizado diariamente com garantia Apple de até 1 ano." : "Veja todas as opções disponíveis em nosso catálogo online completo.")}
                  </div>
                </div>
                <Link
                  to="/$slug/loja"
                  params={{ slug }}
                  className="btn-primary-glow shrink-0 py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold text-white inline-flex items-center gap-2 shadow-md active:scale-95 transition"
                >
                  <span>{settings.catalog_banner_button_text || "Ver Catálogo Completo na Loja"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 3. TRUST & DIFFERENTIALS */}
        <section id="diferenciais" className="py-10 sm:py-16 px-4 sm:px-6 relative scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <SectionTitle
              badge={settings.differentials_badge || "Segurança Total"}
              eyebrow={settings.differentials_eyebrow || `Por que a ${storeName}?`}
              title={settings.differentials_title || (slug === "terephones" ? "A Experiência Apple Mais Segura de Teresópolis" : `Por que comprar na ${storeName}?`)}
              subtitle={settings.differentials_subtitle || (slug === "terephones" ? "Comprar seu iPhone novo ou seminovo não precisa ser arriscado nem demorado." : "Qualidade garantida, atendimento ágil e as melhores condições para você.")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {(settings.differentials && settings.differentials.length > 0
                ? settings.differentials
                : (slug === "terephones"
                  ? [
                      { icon: "🚚", title: "Entrega Express em até 1h", description: "Levamos seu iPhone na sua porta em qualquer bairro de Teresópolis. Rápido, seguro e sem espera de dias." },
                      { icon: "🛡️", title: "Pague Só na Entrega", description: "Zero risco de golpe na internet: confira a caixa, teste a câmera, tela e funções na sua mão antes de fazer o pagamento." },
                      { icon: "🏪", title: "Ponto Físico na SejaDelta", description: "Prefere retirar presencialmente? Atendimento exclusivo na loja parceira SejaDelta no centro de Teresópolis." },
                      { icon: "⭐", title: "Até 1 Ano de Garantia", description: "Novos lacrados com garantia mundial Apple e seminovos aprovados em 25+ testes com 90 dias de garantia total." },
                    ]
                  : [
                      { icon: "🚀", title: "Atendimento Personalizado", description: "Tire dúvidas e faça seus pedidos diretamente com nossos especialistas via WhatsApp com resposta rápida." },
                      { icon: "🛡️", title: "Compra 100% Segura", description: "Negocie com transparência, acompanhe seu pedido e tenha total suporte antes e após a compra." },
                      { icon: "⭐", title: "Qualidade Garantida", description: "Produtos e serviços selecionados com alto padrão de qualidade, procedência e garantia." },
                      { icon: "💳", title: "Pagamento Facilitado", description: "Aceitamos PIX, cartões de crédito e as melhores condições de pagamento para o seu bolso." },
                    ]
                )
              ).map((p, idx) => {
                const colors = [
                  "from-sky-500 to-blue-600",
                  "from-emerald-500 to-teal-600",
                  "from-indigo-500 to-purple-600",
                  "from-amber-500 to-orange-600",
                ];
                return (
                  <div
                    key={p.title || idx}
                    className="glass-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition hover:-translate-y-1"
                  >
                    <div>
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${colors[idx % 4]} shadow-md mb-4 text-xl`}
                      >
                        <span>{p.icon || "✨"}</span>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. TRADE-IN SECTION (Apenas quando explicitamente habilitado) */}
        {(settings.enable_tradein === true || (slug === "terephones" && settings.enable_tradein !== false)) && (
          <section id="troca" className="py-10 sm:py-16 px-4 sm:px-6 relative scroll-mt-24">
            <div className="max-w-4xl mx-auto glass-card p-6 sm:p-10 rounded-3xl border border-blue-500/20 text-center">
              <SectionTitle
                badge={settings.tradein_badge || "Trade-in Inteligente"}
                eyebrow={settings.tradein_eyebrow || "Troque de Aparelho"}
                title={settings.tradein_title || "Seu Usado Vale Dinheiro na Troca"}
                subtitle={settings.tradein_subtitle || "Aceitamos seu aparelho usado como entrada no novo. Avaliação rápida, justa e sem burocracia."}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 mt-4 text-left">
                {[
                  {
                    num: "1",
                    title: settings.tradein_step1_title || "Envie as Fotos no WhatsApp",
                    desc: settings.tradein_step1_desc || "Mande fotos do seu aparelho, informe modelo, capacidade e estado geral.",
                  },
                  {
                    num: "2",
                    title: settings.tradein_step2_title || "Receba a Avaliação Imediata",
                    desc: settings.tradein_step2_desc || "Nosso especialista avalia na hora e passa o valor exato de entrada do seu seminovo.",
                  },
                  {
                    num: "3",
                    title: settings.tradein_step3_title || "Pague Só a Diferença (ou Receba Troco)",
                    desc: settings.tradein_step3_desc || "Entregamos o produto novo e pegamos o seu usado no ato, com total segurança.",
                  },
                ].map((s) => (
                  <div
                    key={s.num}
                    className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col justify-between"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                      {s.num}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {s.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleTradeWhatsApp}
                  className="btn-primary-glow py-3.5 px-8 rounded-full font-bold text-sm text-white inline-flex items-center gap-2 shadow-lg active:scale-95 transition cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>{settings.tradein_button_text || "Simular Troca no WhatsApp Agora"}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                Atendimento humanizado e resposta imediata durante o horário comercial.
              </p>
            </div>
          </section>
        )}

        {/* 5. REVIEWS & LOCATION (Apenas quando houver depoimentos) */}
        {reviewsList.length > 0 && (
          <section id="sobre" className="py-10 sm:py-16 px-4 sm:px-6 overflow-hidden scroll-mt-24">
            <div className="max-w-6xl mx-auto">
              <SectionTitle
                badge={settings.reviews_badge || "Avaliação 5 ★"}
                eyebrow={settings.reviews_eyebrow || "Depoimentos Reais"}
                title={settings.reviews_title || (slug === "terephones" ? "Quem Compra em Teresópolis Recomenda" : "O Que Nossos Clientes Dizem")}
                subtitle={settings.reviews_subtitle || (slug === "terephones" ? "Mais de 500 clientes atendidos com nota máxima em procedência e rapidez." : "Depoimentos de quem já comprou e comprova a nossa qualidade e atendimento.")}
              />

              <div className="relative mt-4 mb-12 sm:mb-16 overflow-hidden py-2">
                <div className="marquee">
                  {doubledReviews.map((r, i) => (
                    <div
                      key={i}
                      className="glass-card p-4 sm:p-5 w-[280px] sm:w-[320px] rounded-2xl shrink-0 text-left border border-slate-200/70 dark:border-slate-800/70"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-blue-600 to-sky-500 shadow-xs">
                          {r.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {r.name}
                          </div>
                          <div className="text-[11px] text-blue-600 dark:text-sky-400 font-semibold">
                            {r.neighborhood ? `${r.neighborhood} • ` : ""}{settings.city || "Cliente Verificado"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2 text-amber-400 text-xs">
                        {"★".repeat(5)}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{r.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Location Card (Apenas se habilitado) */}
              {(settings.enable_physical_location === true || (slug === "terephones" && settings.enable_physical_location !== false)) && (
                <div className="glass-card p-6 sm:p-10 rounded-3xl border border-blue-500/20 max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 text-center md:text-left">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 mb-3">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{settings.location_badge || "Ponto de Atendimento"}</span>
                      </span>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {settings.location_title || (slug === "terephones" ? "Loja Parceira SejaDelta em Teresópolis" : "Atendimento Presencial")}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {settings.location_desc || (slug === "terephones" ? "Você conta com o suporte e a segurança de um endereço presencial no centro da cidade para retirar aparelhos, aplicar películas ou tirar dúvidas pessoalmente." : "Venha conhecer nosso espaço ou agendar a retirada presencial do seu pedido com total comodidade.")}
                      </p>

                      <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {settings.address && (
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                            <span>{settings.address}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                          <span>{settings.business_hours || "Segunda a Sábado — Horário Comercial"}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Phone className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                          <span>WhatsApp de Suporte: {phoneDisplay}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col items-center justify-center gap-3">
                      {settings.address && (
                        <a
                          href={settings.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary-glow w-full py-3 px-5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
                        >
                          <ExternalLink className="w-4 h-4 shrink-0" />
                          <span>Abrir no Google Maps</span>
                        </a>
                      )}

                      <a
                        href={`${whatsLink}?text=${encodeURIComponent(`Olá! Gostaria de mais informações sobre atendimento presencial ou agendar uma retirada.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-center"
                      >
                        Agendar Atendimento
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        whatsappNumber={whatsDigits}
        storeName={storeName}
      />

      {/* Footer */}
      <SiteFooter
        currentTheme={currentTheme}
        basePath={`/${slug}`}
        storeName={storeName}
        storeLogo={settings.logo_url}
        storeTagline={storeTagline}
        whatsapp={rawWhatsapp}
        phoneDisplay={phoneDisplay}
        address={settings.address}
        city={settings.city}
        state={settings.state}
        businessHours={settings.business_hours}
        instagramUrl={settings.instagram_url}
        facebookUrl={settings.facebook_url}
        tiktokUrl={settings.tiktok_url}
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
