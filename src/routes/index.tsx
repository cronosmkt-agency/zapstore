import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Truck, Wrench, DollarSign, Recycle, Star, MapPin, ShoppingCart,
  MessageCircle, Menu, X, Smartphone, Battery, Droplets, Unlock,
  ShieldCheck, Home, Check, Instagram, Facebook, Phone, Clock,
  ChevronDown, Zap, Camera,
} from "lucide-react";
import iphone15Pro from "@/assets/iphone-15-pro.webp";
import heroIphone from "@/assets/hero-iphone.webp";
import iphone14 from "@/assets/iphone-14.webp";
import iphone13 from "@/assets/iphone-13.webp";
import iphone12 from "@/assets/iphone-12.webp";
import sejaDeltaLogo from "@/assets/sejadelta-logo.webp";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Casa da Maçã — iPhones, Assistência e Delivery em Teresópolis" },
      { name: "description", content: "Compre iPhones, acessórios e conserte seu smartphone com delivery em Teresópolis - RJ. Loja A Casa da Maçã: 4,9★ no Google, melhores preços da região." },
      { property: "og:title", content: "A Casa da Maçã — iPhones, Assistência e Delivery em Teresópolis" },
      { property: "og:description", content: "Compre, repare e revenda com quem mais entende de smartphone em Teresópolis. Delivery até você." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "A Casa da Maçã",
          description:
            "Loja de iPhones, acessórios e assistência técnica com delivery em Teresópolis - RJ.",
          telephone: "+5521993446336",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. José Joaquim de Araújo Regadas, 146",
            addressLocality: "Teresópolis",
            addressRegion: "RJ",
            addressCountry: "BR",
            postalCode: "25953-040",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "10:00",
              closes: "18:00",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "500",
          },
        }),
      },
    ],
  }),

  component: DeltaStore,
});

const WHATSAPP = "https://wa.me/5521993446336";
const PHONE_DISPLAY = "(21) 99344-6336";

/* ---------- Tokens util ---------- */
const T = {
  primary: "var(--blue-primary)",
  vivid: "var(--blue-vivid)",
  text: "var(--text-primary)",
  sub: "var(--text-secondary)",
  muted: "var(--text-muted)",
  grad: "linear-gradient(135deg, var(--blue-primary), var(--blue-vivid))",
};

/* ---------- Data ---------- */
const differentials = [
  { icon: Truck, title: "Delivery Express", desc: "Serviços e produtos na sua porta em Teresópolis" },
  { icon: Wrench, title: "Assistência Rápida", desc: "Diagnóstico gratuito e conserto no mesmo dia" },
  { icon: DollarSign, title: "Menor Preço", desc: "Melhores preços em iPhones da região" },
  { icon: Recycle, title: "Valorização do Usado", desc: "Traga seu aparelho e ganhe o melhor valor" },
  { icon: Star, title: "4,9 no Google", desc: "46 avaliações 5 estrelas de clientes reais" },
  { icon: MapPin, title: "Loja + Delivery", desc: "Atendimento presencial ou onde você estiver" },
];

const products: { name: string; price: number; cat: string; badge: string; img: string }[] = [
  { name: "iPhone 15 Pro", price: 6999, cat: "iPhones", badge: "Pronta Entrega", img: iphone15Pro },
  { name: "iPhone 14", price: 4499, cat: "iPhones", badge: "Pronta Entrega", img: iphone14 },
  { name: "iPhone 13", price: 3299, cat: "iPhones", badge: "Delivery", img: iphone13 },
  { name: "iPhone 12 (seminovo)", price: 2499, cat: "Seminovos", badge: "Seminovo", img: iphone12 },
  { name: "iPhone 15 Pro Max", price: 7899, cat: "iPhones", badge: "Pronta Entrega", img: iphone15Pro },
  { name: "iPhone 14 Pro", price: 5299, cat: "iPhones", badge: "Pronta Entrega", img: iphone14 },
  { name: "iPhone 13 mini", price: 2899, cat: "iPhones", badge: "Delivery", img: iphone13 },
  { name: "iPhone 11 (seminovo)", price: 1999, cat: "Seminovos", badge: "Seminovo", img: iphone12 },
];

const filters = ["Todos", "iPhones", "Seminovos"];

const services = [
  { icon: Smartphone, title: "Troca de Tela", desc: "Original e com garantia. A partir de R$ 299" },
  { icon: Battery, title: "Troca de Bateria", desc: "Bateria 100% original. A partir de R$ 199" },
  { icon: Droplets, title: "Dano por Água", desc: "Recuperação e limpeza especializada" },
  { icon: Unlock, title: "Desbloqueio", desc: "Desbloqueio oficial e seguro" },
  { icon: ShieldCheck, title: "Diagnóstico Grátis", desc: "Seu aparelho avaliado sem custo" },
  { icon: Home, title: "Visita Domiciliar", desc: "Técnico vai até você — Delivery Técnico" },
];

const reviews = [
  { name: "Ghost", text: "Melhores preços nos iPhone" },
  { name: "Thiago Lima", text: "Serviço top, melhor atendimento da cidade, qualidade, preço e rapidez na assistência." },
  { name: "Enzo Michelin", text: "Atendimento ótimo! Valorização do seu usado e pronta entrega! Alto nível!!!" },
  { name: "Camila Cunha", text: "Excelente atendimento e rapidez no serviço. Super indico" },
];

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- Components ---------- */
function BackgroundOrbs() {
  return (
    <div className="delta-bg" aria-hidden>
      <div className="delta-orb delta-orb-1" />
      <div className="delta-orb delta-orb-2" />
      <div className="delta-orb delta-orb-3" />
      <div className="deco-shape rounded-3xl" style={{ width: 120, height: 120, top: "18%", left: "6%", transform: "rotate(18deg)" }} />
      <div className="deco-shape rounded-full" style={{ width: 80, height: 80, top: "62%", right: "9%", animationDelay: "-3s" }} />
      <div className="deco-shape rounded-2xl" style={{ width: 60, height: 60, top: "40%", right: "22%", animationDelay: "-5s" }} />
    </div>
  );
}

function DeltaLogo({ height = 40, textSize = "text-xl" }: { height?: number; textSize?: string }) {
  return (
    <span className="flex items-center gap-2">
      <img
        src={sejaDeltaLogo}
        alt="A Casa da Maçã"
        decoding="async"
        width={height}
        height={height}
        style={{ height, width: "auto" }}
        className="object-contain"
      />
      <span
        className={`${textSize} font-bold tracking-tight whitespace-nowrap`}
        style={{ color: "var(--text-primary)" }}
      >
        A Casa da<span style={{ color: "var(--blue-primary)" }}> Maçã</span>
      </span>
    </span>
  );
}


function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 20);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const links = [
    ["Início", "#inicio"], ["Produtos", "#produtos"], ["Serviços", "#servicos"],
    ["Delivery", "#delivery"], ["Contato", "#contato"],
  ];
  return (
    <>
      {/* Desktop navbar */}
      <div
        className="hidden lg:block fixed inset-x-0 z-[60] header-top-bar"
        style={{ top: scrolled ? 64 : 76 }}
      />
      <nav className={`hidden lg:block fixed top-0 inset-x-0 z-50 navbar-desk ${scrolled ? "scrolled" : ""}`}>

        <div className="navbar-desk-inner">
          <a href="#inicio" className="shrink-0 logo-desk">
            <DeltaLogo height={scrolled ? 44 : 52} textSize="text-2xl" />
          </a>
          <div className="flex items-center justify-center nav-links-desk">
            {links.map(([l, h]) => (
              <a key={h} href={h} className="nav-link nav-link-desk">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-6 justify-end">
            <div className="badge-aberto">Aberto até 18:00</div>
            <span className="h-6 border-l" style={{ borderColor: "rgba(var(--blue-rgb),0.18)" }} />
            <a href={WHATSAPP} className="btn-pedir-agora">Pedir Agora</a>
          </div>
        </div>
      </nav>

      {/* Mobile pill navbar */}
      <nav className={`lg:hidden nav-pill ${scrolled ? "scrolled" : ""}`}>
        <div className="relative flex items-center justify-start h-14 px-5">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#1A6FE8] shadow-[0_4px_15px_rgba(26,111,232,0.25)]"

          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <a href="#inicio" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <DeltaLogo height={36} textSize="text-lg" />
          </a>
        </div>

      </nav>


      {open && (
        <div className="lg:hidden mobile-menu p-4">

          <div className="flex flex-col">
            {links.map(([l, h]) => (
              <a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold transition border-b last:border-0"
                style={{ color: T.text, borderColor: "rgba(var(--blue-rgb),.10)" }}
              >
                {l}
              </a>
            ))}
          </div>
          <a
            href={WHATSAPP}
            onClick={() => setOpen(false)}
            className="btn-primary-glow text-center text-sm mt-4 block"
          >
            Pedir Agora
          </a>
        </div>
      )}
      {open && (
        <button
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(13,27,62,.15)" }}
        />
      )}
    </>
  );
}

function TiltPhone() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const targetRef = useRef({ rotX: 0, rotY: 0 });
  const currentRef = useRef({ rotX: 0, rotY: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      targetRef.current = { rotX: -dy * 18, rotY: dx * 18 };
      setGlowPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    const onLeave = () => { targetRef.current = { rotX: 0, rotY: 0 }; };

    const animate = () => {
      const speed = 0.08;
      currentRef.current.rotX += (targetRef.current.rotX - currentRef.current.rotX) * speed;
      currentRef.current.rotY += (targetRef.current.rotY - currentRef.current.rotY) * speed;
      el.style.transform = `perspective(900px) rotateX(${currentRef.current.rotX}deg) rotateY(${currentRef.current.rotY}deg) scale3d(1.04, 1.04, 1.04)`;
      frameRef.current = requestAnimationFrame(animate);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center fade-up"
      style={{ animationDelay: ".2s", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(26,111,232,0.18), transparent 65%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "24px",
          background: "radial-gradient(ellipse, rgba(26,111,232,0.20), transparent 70%)",
          filter: "blur(16px)",
          zIndex: 0,
        }}
      />
      <img
        src={heroIphone}
        alt="iPhone A Casa da Maçã em destaque"
        fetchPriority="high"
        decoding="async"
        width={520}
        height={520}
        className="relative z-10 w-[320px] sm:w-[420px] h-auto float-slow"
        style={{
          filter: "drop-shadow(0 40px 60px rgba(13,27,62,0.22))",
          transformStyle: "preserve-3d",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100dvh] lg:min-h-screen flex flex-col justify-between lg:justify-center pt-28 pb-12 lg:pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Imagem de fundo (apenas mobile/tablet) */}
      <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden" aria-hidden>
        <img
          src={heroIphone}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover opacity-5 scale-130 hero-bg-float"
          draggable={false}
        />

      </div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${(i * 53) % 100}%`,
              bottom: `-10px`,
              animationDuration: `${7 + (i % 5) * 1.5}s`,
              animationDelay: `${(i * 0.4) % 5}s`,
              opacity: 0.2 + ((i % 4) * 0.1),
            }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto w-full my-auto lg:my-0 lg:pt-24 lg:pb-24 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-20">
        <div className="fade-up relative z-20">
          <div className="glass inline-flex items-center gap-2 px-3 py-1.5 text-xs mb-4 lg:mb-6" style={{ borderRadius: 999 }}>
            <Zap className="w-3.5 h-3.5" style={{ color: T.primary }} />
            <span className="font-medium" style={{ color: T.sub }}>A referência em smartphones em Teresópolis</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight" style={{ color: T.text }}>
            O <span className="text-gradient-blue">iPhone</span> que você quer,<br />
            na sua porta.
          </h1>
          <p className="mt-6 text-lg max-w-xl" style={{ color: T.sub }}>
            Compre, repare e revenda com quem mais entende de smartphone em
            Teresópolis. Delivery até você! 🚀
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
            <a href="#produtos" className="btn-primary-glow inline-flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Ver produtos
            </a>
            <a href={WHATSAPP} className="btn-glass hidden lg:inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
          <div className="mt-6 lg:mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm font-medium" style={{ color: T.sub }}>
            <div className="flex items-center gap-2"><Star className="w-4 h-4" style={{ color: T.sub }} /> 4,9 no Google</div>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4" style={{ color: T.sub }} /> Delivery no mesmo dia</div>
          </div>
        </div>

        <div className="hidden lg:block relative z-10">
          <TiltPhone />
        </div>

      </div>

      <a href="#diferenciais" className="hidden lg:block absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce" style={{ color: T.muted }}>
        <ChevronDown />
      </a>
    </section>
  );
}

function VimeoPlayer() {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;

    const init = () => {
      const Vimeo = (window as any).Vimeo;
      if (!iframeRef.current || !Vimeo) return;
      const player = new Vimeo.Player(iframeRef.current);
      playerRef.current = player;
      player.on("play", () => setPlaying(true));
      player.on("pause", () => setPlaying(false));
      player.on("ended", () => setPlaying(false));
      player.on("timeupdate", (data: any) => {
        setProgress((data.seconds / data.duration) * 100 || 0);
      });
      player.play().catch(() => {});
    };

    if ((window as any).Vimeo) {
      init();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://player.vimeo.com/api/player.js"]');
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, [loaded]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pause();
    else playerRef.current.play();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ borderRadius: "18px", aspectRatio: "16/9", background: "#050A18" }}
    >
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center flex-col gap-4"
          style={{ cursor: "pointer", background: "linear-gradient(135deg, rgba(13,27,62,0.92) 0%, rgba(26,111,232,0.18) 100%)" }}
          onClick={() => setLoaded(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLoaded(true); }}
          aria-label="Reproduzir vídeo da A Casa da Maçã"
        >
          <img
            src="https://vumbnail.com/1214863083.jpg"
            alt="Thumbnail do vídeo A Casa da Maçã"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.45, borderRadius: "18px" }}
            loading="lazy"
            decoding="async"
          />
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", pointerEvents: "none" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--blue-primary), var(--blue-vivid))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 16px rgba(26,111,232,0.15), 0 8px 32px rgba(26,111,232,0.45)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "4px" }} aria-hidden="true">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              Clique para assistir
            </span>
          </div>
        </div>
      )}

      {loaded && (
        <>
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1214863083?controls=0&autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0&dnt=1&transparent=0&background=0"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Conheça a A Casa da Maçã"
            style={{ border: "none", borderRadius: "18px" }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "10px 14px 12px",
              background: "linear-gradient(to top, rgba(5,10,24,0.85) 0%, transparent 100%)",
              borderRadius: "0 0 18px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pausar" : "Reproduzir"}
              style={{
                width: "36px", height: "36px", borderRadius: "50%", border: "none",
                background: "linear-gradient(135deg, var(--blue-primary), var(--blue-vivid))",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                boxShadow: "0 4px 12px rgba(26,111,232,0.4)",
              }}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "2px" }} aria-hidden="true">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>

            <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: "2px",
                  background: "linear-gradient(90deg, var(--blue-primary), var(--blue-vivid))",
                  width: `${progress}%`,
                  transition: "width 0.5s linear",
                }}
              />
            </div>

            <button
              onClick={toggleFullscreen}
              aria-label="Tela cheia"
              style={{
                width: "32px", height: "32px", borderRadius: "8px", border: "none",
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function VSL() {
  return (
    <section id="vsl" className="py-10 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(var(--blue-rgb), 0.07), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] font-bold text-gradient-blue mb-3">
            Conheça a A Casa da Maçã
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            Veja por que somos <span className="text-gradient-blue">a referência</span> em Teresópolis
          </h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Qualidade, preço e atendimento que só a A Casa da Maçã oferece. Assista e descubra.
          </p>
        </div>

        <div className="glass-card overflow-hidden relative" style={{ borderRadius: "24px", padding: "8px" }}>
          <VimeoPlayer />


          <div className="flex items-center justify-center sm:justify-between px-4 py-3">
            <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true" style={{ color: "var(--blue-primary)" }}>
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
              <span className="text-xs font-medium">A Casa da Maçã — Teresópolis, RJ</span>
            </div>
            <a
              href="https://wa.me/552120080400"
              className="btn-primary-glow text-xs py-2 px-4 hidden sm:inline-flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
              </svg>
              Falar com a A Casa da Maçã
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center justify-center gap-2">
            <span style={{ color: "gold" }}>★★★★★</span>
            <span>4,9 no Google</span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(var(--blue-rgb), 0.25)" }}>|</span>
          <div className="flex items-center justify-center gap-2">
            <span style={{ color: "var(--blue-primary)" }}>✓</span>
            <span>46 avaliações reais</span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(var(--blue-rgb), 0.25)" }}>|</span>
          <div className="flex items-center justify-center gap-2">
            <span style={{ color: "var(--blue-primary)" }}>🚚</span>
            <span>Delivery no mesmo dia</span>
          </div>
        </div>

      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, badge }: { eyebrow?: string; title: string; badge?: string }) {
  return (
    <div className="text-center">
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.3em] font-bold text-gradient-blue mb-3">{eyebrow}</div>
      )}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: T.text }}>{title}</h2>
        {badge && <span className="glass px-3 py-1.5 text-sm text-gradient-blue font-bold">{badge}</span>}
      </div>
      <div className="mx-auto mt-5 w-24 h-[3px] rounded-full" style={{ background: T.grad }} />
    </div>
  );
}

function IconBadge({ Icon }: { Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-5 text-white"
         style={{ background: T.grad, boxShadow: "0 8px 24px rgba(var(--blue-rgb),.30)" }}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
  );
}

function Differentials() {
  return (
    <section id="diferenciais" className="py-10 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Por que A Casa da Maçã" title="Diferenciais que só quem entende oferece" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-14">
          {differentials.map((d) => (
            <div key={d.title} className="glass-card p-4 sm:p-7 group">
              <IconBadge Icon={d.icon} />
              <h3 className="text-sm sm:text-xl font-bold" style={{ color: T.text }}>{d.title}</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed" style={{ color: T.sub }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Products() {
  const [f, setF] = useState("Todos");
  const list = f === "Todos" ? products : products.filter(p => p.cat === f);
  return (
    <section id="produtos" className="py-10 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Loja A Casa da Maçã" title="Nossos Produtos" />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {filters.map(fl => (
            <button
              key={fl}
              onClick={() => setF(fl)}
              className="px-5 py-2 text-sm font-semibold rounded-full transition-all"
              style={
                f === fl
                  ? { background: T.grad, color: "#fff", boxShadow: "0 6px 20px rgba(var(--blue-rgb),.3)" }
                  : { background: "rgba(255,255,255,.7)", border: "1px solid rgba(var(--blue-rgb),.2)", color: T.sub, backdropFilter: "blur(20px)" }
              }
            >
              {fl}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {list.map(p => (
            <div key={p.name} className="glass-card p-5 flex flex-col">


              <div className="relative h-44 rounded-2xl mb-4 overflow-hidden flex items-center justify-center"
                   style={{ background: "radial-gradient(circle at center, rgba(var(--blue-rgb),.10), rgba(255,255,255,0) 70%)" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={400}
                  height={400}
                  className="h-full w-auto object-contain"
                  style={{ filter: "drop-shadow(0 14px 22px rgba(13,27,62,0.18))" }}
                />
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "var(--blue-light)", color: T.primary, border: "1px solid rgba(var(--blue-rgb),.25)" }}>
                  {p.badge}
                </span>
              </div>
              <h3 className="font-bold text-lg" style={{ color: T.text }}>{p.name}</h3>
              <div className="mt-2">
                <div className="text-2xl font-black" style={{ color: T.primary }}>{fmt(p.price)}</div>
                <div className="text-xs mt-1" style={{ color: T.muted }}>12x de {fmt(p.price / 12)}</div>
              </div>
              <div className="mt-5 flex gap-2 pt-4 border-t" style={{ borderColor: "rgba(var(--blue-rgb),.12)" }}>
                <a href={WHATSAPP} className="btn-primary-glow flex-1 text-xs text-center py-2 flex items-center justify-center gap-1">
                  <ShoppingCart className="w-3.5 h-3.5" /> Comprar
                </a>
                <a href={WHATSAPP} className="btn-glass flex-1 text-xs text-center py-2 flex items-center justify-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="py-10 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Assistência Técnica" title="Serviços A Casa da Maçã" badge="#acasadamaça" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-14">
          {services.map(s => (
            <div key={s.title} className="glass-card p-4 sm:p-7 flex flex-col">
              <IconBadge Icon={s.icon} />
              <h3 className="text-sm sm:text-xl font-bold" style={{ color: T.text }}>{s.title}</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm" style={{ color: T.sub }}>{s.desc}</p>
              <a href={WHATSAPP} className="btn-glass mt-4 sm:mt-6 inline-block text-center text-xs sm:text-sm px-3 py-2 sm:px-6 sm:py-3 self-start">Agendar</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function DeliverySection() {
  const benefits = [
    "Entrega no mesmo dia em Teresópolis",
    "Técnico especializado na sua casa",
    "Pagamento seguro na entrega",
    "Rastreio via WhatsApp em tempo real",
  ];
  return (
    <section id="delivery" className="py-10 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto glass p-8 sm:p-14 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full float-slow"
             style={{ background: "radial-gradient(circle, rgba(var(--blue-rgb),.16), transparent 70%)", filter: "blur(50px)" }} />
        <div className="grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 text-xs font-semibold mb-5"
                 style={{ borderRadius: 999, color: T.sub }}>
              <Truck className="w-3.5 h-3.5" style={{ color: T.primary }} /> Delivery A Casa da Maçã
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: T.text }}>
              Na sua porta, <span className="text-gradient-blue">no seu tempo.</span>
            </h2>
            <p className="mt-5 text-lg" style={{ color: T.sub }}>
              Levamos produtos e serviços técnicos diretamente até você em Teresópolis e região.
            </p>
            <ul className="mt-8 space-y-3">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-3" style={{ color: T.sub }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: T.grad }}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <a href={WHATSAPP} className="btn-primary-glow wa-float mt-8 inline-flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Chamar no WhatsApp
            </a>
            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: T.muted }}>
              <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="glass w-56 h-56 rounded-full flex items-center justify-center float-slow">
              <Truck className="w-24 h-24" style={{ color: T.primary }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const doubled = [...reviews, ...reviews, ...reviews];
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Avaliações" title="O que nossos clientes dizem" badge="Google 4,9 ★" />
        <div className="mt-14 relative">
          <div className="marquee">
            {doubled.map((r, i) => (
              <div key={i} className="glass-card p-6 w-[320px] shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
                       style={{ background: T.grad }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: T.text }}>{r.name}</div>
                    <div className="text-xs" style={{ color: T.primary }}>Avaliação Google</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3 text-yellow-500 text-sm">★★★★★</div>
                <p className="text-sm leading-relaxed" style={{ color: T.sub }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SellUsed() {
  const fieldStyle = {
    background: "rgba(255,255,255,.85)",
    color: T.text,
  } as const;
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [aparelhoAtual, setAparelhoAtual] = useState("");
  const [armazenamento, setArmazenamento] = useState("");
  const [bateria, setBateria] = useState("");
  const [estado, setEstado] = useState("");
  const [aparelhoDesejado, setAparelhoDesejado] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list).map((f) => f.name)].slice(0, 8));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensagem =
      `Olá, equipe A Casa da Maçã! Vim pelo site e tenho interesse na Troca Inteligente. Aqui estão os dados do meu aparelho para pré-avaliação:\n\n` +
      `📱 *Meu aparelho:* ${aparelhoAtual}\n\n` +
      `💾 *Armazenamento:* ${armazenamento}\n\n` +
      `🔋 *Saúde da Bateria:* ${bateria}%\n\n` +
      `✨ *Estado de conservação:* ${estado}\n\n` +
      `🎯 *Aparelho que desejo:* ${aparelhoDesejado}\n\n` +
      `📞 *Meu WhatsApp:* ${whatsapp}\n\n` +
      `*(Tenho as fotos do aparelho prontas para enviar por aqui)*`;

    toast.success("Redirecionando para o WhatsApp...");
    window.open("https://wa.me/5521993446336?text=" + encodeURIComponent(mensagem), "_blank");
  };

  const cls = "glass px-4 py-3 outline-none placeholder:opacity-60 w-full";

  return (
    <section id="contato" className="py-10 sm:py-24 px-4 sm:px-6 scroll-mt-24">
      <div className="max-w-3xl mx-auto glass-card p-6 sm:p-10">
        <SectionTitle eyebrow="Troca inteligente" title="Simulador de avaliação do seu aparelho" />
        <form className="mt-10 grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input required placeholder="Qual o seu iPhone atual?" className={cls} style={fieldStyle}
                 value={aparelhoAtual} onChange={(e) => setAparelhoAtual(e.target.value)} />

          <select required className={cls} style={fieldStyle}
                  value={armazenamento} onChange={(e) => setArmazenamento(e.target.value)}>
            <option value="" disabled>Armazenamento</option>
            <option>64GB</option><option>128GB</option><option>256GB</option>
            <option>512GB</option><option>1TB</option>
          </select>

          <input required type="number" min={1} max={100} placeholder="Saúde da bateria (%)"
                 className={cls} style={fieldStyle}
                 value={bateria} onChange={(e) => setBateria(e.target.value)} />

          <select required className={cls} style={fieldStyle}
                  value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="" disabled>Estado de conservação</option>
            <option>Perfeito estado</option>
            <option>Marcas de uso</option>
            <option>Tela trincada</option>
            <option>Defeito</option>
          </select>

          <input required placeholder="Qual modelo você deseja comprar?" className={cls} style={fieldStyle}
                 value={aparelhoDesejado} onChange={(e) => setAparelhoDesejado(e.target.value)} />

          <input required placeholder="(21) 99999-9999" className={cls} style={fieldStyle}
                 value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            className="sm:col-span-2 cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all"
            style={{
              borderColor: dragging ? T.primary : "rgba(26,111,232,.35)",
              background: dragging ? "rgba(26,111,232,.10)" : "rgba(26,111,232,.05)",
            }}
          >
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                   onChange={(e) => addFiles(e.target.files)} />
            <Camera className="w-8 h-8 mx-auto mb-3" style={{ color: T.primary }} />
            <p className="text-sm font-medium" style={{ color: T.text }}>
              Adicione fotos do seu aparelho (frente, verso e cantos) para uma avaliação mais precisa
            </p>
            <p className="text-xs mt-1" style={{ color: T.muted }}>
              Arraste as imagens aqui ou clique para selecionar
            </p>
            {files.length > 0 && (
              <p className="text-xs mt-3" style={{ color: T.primary }}>
                {files.length} foto{files.length > 1 ? "s" : ""} selecionada{files.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <button className="btn-primary-glow sm:col-span-2 py-3 flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Receber Avaliação no WhatsApp
          </button>

          <p className="sm:col-span-2 text-center text-xs" style={{ color: T.muted }}>
            Nossa equipe analisará as informações e enviará uma pré-avaliação em poucos minutos.
          </p>
        </form>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="py-10 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto glass p-8 sm:p-12">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <SectionTitle eyebrow="Quem somos" title="A Casa da Maçã — a Apple experience de Teresópolis" />
            <p className="mt-6 leading-relaxed" style={{ color: T.sub }}>
              A <span className="text-gradient-blue font-bold">A Casa da Maçã</span> nasceu para
              transformar a relação dos teresopolitanos com seus smartphones:
              produtos originais, assistência técnica de confiança e um atendimento
              que trata cada cliente como único.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5" style={{ color: T.primary }} />
                <div className="text-sm" style={{ color: T.sub }}>
                  Av. José Joaquim de Araújo Regadas, 146 — Várzea<br />
                  Teresópolis - RJ, 25953-040
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: T.primary }} />
                <div className="text-sm" style={{ color: T.sub }}>Segunda a Sábado — até 18:30</div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" style={{ color: T.primary }} />
                <div className="text-sm" style={{ color: T.sub }}>{PHONE_DISPLAY}</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden relative"
               style={{ border: "1px solid rgba(var(--blue-rgb),.2)", boxShadow: "0 20px 60px rgba(var(--blue-rgb),.15)" }}>
            <iframe
              title="A Casa da Maçã — Localização"
              src="https://www.google.com/maps?q=Av.+Jos%C3%A9+Joaquim+de+Ara%C3%BAjo+Regadas,+142+-+V%C3%A1rzea,+Teres%C3%B3polis+-+RJ&output=embed"
              className="w-full h-full min-h-[340px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contato" className="pt-20 pb-10 px-4 sm:px-6"
            style={{ background: "rgba(255,255,255,.75)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(var(--blue-rgb),.15)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <DeltaLogo />
            <p className="text-sm mt-4" style={{ color: T.sub }}>
              A experiência premium em smartphones que Teresópolis merece.
            </p>
          </div>
          <FooterCol title="Loja" links={[
            ["iPhones", "#produtos"], ["Acessórios", "#produtos"],
            ["Seminovos", "#produtos"], ["Peças", "#produtos"],
          ]} />
          <FooterCol title="Serviços" links={[
            ["Troca de Tela", "#servicos"], ["Bateria", "#servicos"],
            ["Diagnóstico", "#servicos"], ["Visita Domiciliar", "#delivery"],
          ]} />
          <div>
            <div className="font-bold mb-4" style={{ color: T.text }}>Contato</div>
            <div className="text-sm space-y-2" style={{ color: T.sub }}>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {PHONE_DISPLAY}</div>
              <a href="https://instagram.com/sejadelta" className="flex items-center gap-2"><Instagram className="w-4 h-4" /> @sejadelta</a>
              <a href="https://facebook.com/sejadelta" className="flex items-center gap-2"><Facebook className="w-4 h-4" /> sejadelta</a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <div className="text-4xl font-black text-gradient-blue">#sejadelta</div>
        </div>
        <div className="mt-10 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--blue-primary), var(--blue-vivid), transparent)" }} />
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs" style={{ color: T.muted }}>
          <div>© {new Date().getFullYear()} A Casa da Maçã — Teresópolis, RJ. Todos os direitos reservados.</div>
          <div>Feito com 💙 em Teresópolis</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="font-bold mb-4" style={{ color: T.text }}>{title}</div>
      <ul className="space-y-2 text-sm">
        {links.map(([l, h]) => (
          <li key={l}><a href={h} className="transition" style={{ color: T.sub }}>{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

function WhatsFloat() {
  return (
    <a
      href={WHATSAPP}
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center wa-float"
      style={{ background: T.grad }}
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

/* ---------- Page ---------- */
function DeltaStore() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ color: T.text }}>
      <BackgroundOrbs />
      <Navbar />
      <main>
        <Hero />
        <VSL />
        <Differentials />
        <Products />
        <Services />
        <DeliverySection />
        <Reviews />
        <SellUsed />
        <About />
      </main>
      <Footer />
      <WhatsFloat />
    </div>
  );
}
