import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Truck, Wrench, DollarSign, Recycle, Star, MapPin, ShoppingCart,
  MessageCircle, Menu, X, Smartphone, Battery, Droplets, Unlock,
  ShieldCheck, Home, Check, Instagram, Facebook, Phone, Clock,
  ChevronDown, Zap, Camera, LayoutGrid, Building2, ShieldAlert,
  Sun, Moon, Info
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeSelectorModal, type ThemeMode } from "@/components/ThemeSelectorModal";
import { ProductDetailModal, type ProductItem } from "@/components/ProductDetailModal";
import { fetchGoogleSheetInventory, DEFAULT_SHEET_URL, DEVICE_IMAGES } from "@/services/googleSheets";
const heroIphone = "https://ik.imagekit.io/zinma/tr:w-800,f-webp,q-85/Terephones-iphone.png";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terephones — iPhones Novos & Seminovos em Teresópolis" },
      { name: "description", content: "Compre seu iPhone novo ou seminovo com Entrega Express em até 2h na sua porta ou retire na loja parceira SejaDelta em Teresópolis - RJ. Garantia de até 1 ano." },
      { property: "og:title", content: "Terephones — iPhones Novos & Seminovos em Teresópolis" },
      { property: "og:description", content: "Entrega no mesmo dia em domicílio ou retirada presencial na SejaDelta. Seu novo iPhone em Teresópolis com pagamento seguro na entrega." },
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
          name: "Terephones",
          description:
            "Venda de iPhones novos e seminovos com Entrega Express no mesmo dia e ponto de retirada na loja parceira SejaDelta em Teresópolis - RJ.",
          telephone: "+5521964639999",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Teresópolis",
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

  component: BrandStore,
});

const WHATSAPP_NUMBER = "5521964639999";
const WHATSAPP = "https://wa.me/" + WHATSAPP_NUMBER;
const PHONE_DISPLAY = "(21) 96463-9999";
const INSTAGRAM_HANDLE = "@terephones";
const INSTAGRAM_URL = "https://instagram.com/terephones";

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
  { icon: Truck, title: "Entrega Express em 2h", desc: "Seu novo iPhone entregue na sua porta em qualquer bairro de Teresópolis" },
  { icon: Building2, title: "Ponto Físico na SejaDelta", desc: "Ponto parceiro oficial para você ver de perto, testar na mão e retirar" },
  { icon: ShieldCheck, title: "1 Ano de Garantia Apple", desc: "Aparelhos lacrados com garantia mundial Apple e seminovos com 90 dias" },
  { icon: DollarSign, title: "Desconto no PIX & 18x", desc: "Melhores preços da região no PIX ou parcele em até 18x no cartão" },
  { icon: Recycle, title: "Troca com Troco (Trade-In)", desc: "Seu iPhone usado entra na troca com avaliação honesta e rápida" },
  { icon: Star, title: "Pague só na Entrega", desc: "Sem risco de golpe: confira e teste o aparelho antes de fazer o pagamento" },
];

const products: ProductItem[] = [
  // 15 iPhones do Estoque Real da Loja
  {
    name: "iPhone 16 Pro Max 256GB Desert",
    price: 5290,
    cat: "Seminovos",
    badge: "Bateria 98%",
    img: DEVICE_IMAGES.iphone16ProMaxDesert,
    specs: "256GB • Titânio Deserto • Bateria 98%",
    storage: "256 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "98% de Saúde Original",
    screen: '6.9" Super Retina XDR ProMotion 120Hz',
    camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Teleobjetiva 5x",
    chip: "Apple A18 Pro com Ray Tracing",
  },
  {
    name: "iPhone 16 Pro Max 256GB Desert (Unid. 2)",
    price: 5290,
    cat: "Seminovos",
    badge: "Bateria 90%",
    img: DEVICE_IMAGES.iphone16ProMaxDesert,
    specs: "256GB • Titânio Deserto • Bateria 90%",
    storage: "256 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "90% de Saúde Original",
    screen: '6.9" Super Retina XDR ProMotion 120Hz',
    camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Teleobjetiva 5x",
    chip: "Apple A18 Pro com Ray Tracing",
  },
  {
    name: "iPhone 16 Pro Max 256GB Titânio Natural",
    price: 5290,
    cat: "Seminovos",
    badge: "Bateria 89%",
    img: DEVICE_IMAGES.iphone16ProMaxNatural,
    specs: "256GB • Titânio Natural • Bateria 89%",
    storage: "256 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "89% de Saúde Original",
    screen: '6.9" Super Retina XDR ProMotion 120Hz',
    camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Teleobjetiva 5x",
    chip: "Apple A18 Pro com Ray Tracing",
  },
  {
    name: "iPhone 16 Pro 256GB Desert",
    price: 4990,
    cat: "Seminovos",
    badge: "Bateria 99%",
    img: DEVICE_IMAGES.iphone16ProDesert,
    specs: "256GB • Titânio Deserto • Bateria 99%",
    storage: "256 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "99% (Praticamente novo)",
    screen: '6.3" Super Retina XDR ProMotion 120Hz',
    camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Tele 5x",
    chip: "Apple A18 Pro",
  },
  {
    name: "iPhone 16 Pro 256GB Branco Titânio",
    price: 4990,
    cat: "Seminovos",
    badge: "Bateria 92%",
    img: DEVICE_IMAGES.iphone16ProWhite,
    specs: "256GB • Titânio Branco • Bateria 92%",
    storage: "256 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "92% de Saúde Original",
    screen: '6.3" Super Retina XDR ProMotion 120Hz',
    camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Tele 5x",
    chip: "Apple A18 Pro",
  },
  {
    name: "iPhone 16 128GB Branco",
    price: 3790,
    cat: "Seminovos",
    badge: "Bateria 91%",
    img: DEVICE_IMAGES.iphone16White,
    specs: "128GB • Branco Estelar • Bateria 91%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "91% de Saúde Original",
    screen: '6.1" Super Retina XDR com Dynamic Island',
    camera: "Câmera Fusion 48MP com controle de câmera",
    chip: "Apple A18 Bionic",
  },
  {
    name: "iPhone 16e 128GB Branco",
    price: 2990,
    cat: "Seminovos",
    badge: "Bateria 92%",
    img: DEVICE_IMAGES.iphone16eWhite,
    specs: "128GB • Branco • Bateria 92%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "92% de Saúde Original",
    screen: '6.1" Super Retina XDR OLED',
    camera: "Câmera 48MP Fusion Ultra Rápida",
    chip: "Apple A18",
  },
  {
    name: "iPhone 15 Pro 128GB Azul Titânio",
    price: 3690,
    cat: "Seminovos",
    badge: "Bateria 85%",
    img: DEVICE_IMAGES.iphone15ProBlue,
    specs: "128GB • Titânio Azul • Bateria 85%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "85% (Testado e certificado)",
    screen: '6.1" Super Retina XDR OLED 120Hz ProMotion',
    camera: "Tripla 48MP + Teleobjetiva 3x + Macro",
    chip: "A17 Pro (Arquitetura 3nm)",
  },
  {
    name: "iPhone 14 Plus 128GB Preto",
    price: 2790,
    cat: "Seminovos",
    badge: "Bateria 89%",
    img: DEVICE_IMAGES.iphone14PlusBlack,
    specs: "128GB • Meia-noite • Bateria 89%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "89% (Bateria de longa duração)",
    screen: '6.7" Super Retina XDR OLED tela grande',
    camera: "Dupla 12MP Avançada c/ Modo Ação e Cinema",
    chip: "A15 Bionic com GPU de 5 núcleos",
  },
  {
    name: "iPhone 14 128GB Preto",
    price: 2390,
    cat: "Seminovos",
    badge: "Bateria 84%",
    img: DEVICE_IMAGES.iphone14Black,
    specs: "128GB • Meia-noite • Bateria 84%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "84% (Testado e certificado)",
    screen: '6.1" Super Retina XDR OLED True Tone',
    camera: "Dupla 12MP Avançada c/ Gravação 4K HDR",
    chip: "A15 Bionic com GPU de 5 núcleos",
  },
  {
    name: "iPhone 13 Pro Max 128GB Branco",
    price: 2990,
    cat: "Seminovos",
    badge: "Bateria 85%",
    img: DEVICE_IMAGES.iphone13ProMaxWhite,
    specs: "128GB • Prateado / Branco • Bateria 85%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "85% (Testado em 25+ itens)",
    screen: '6.7" Super Retina XDR 120Hz ProMotion',
    camera: "Sistema Pro Triplo 12MP com Teleobjetiva 3x",
    chip: "A15 Bionic com Neural Engine",
  },
  {
    name: "iPhone 13 Pro Max 128GB Branco (Unid. 2)",
    price: 2990,
    cat: "Seminovos",
    badge: "Bateria 84%",
    img: DEVICE_IMAGES.iphone13ProMaxWhite,
    specs: "128GB • Prateado / Branco • Bateria 84%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "84% (Testado e aprovado)",
    screen: '6.7" Super Retina XDR 120Hz ProMotion',
    camera: "Sistema Pro Triplo 12MP com Teleobjetiva 3x",
    chip: "A15 Bionic com Neural Engine",
  },
  {
    name: "iPhone 13 Pro Max 256GB Grafite",
    price: 3190,
    cat: "Seminovos",
    badge: "Bateria 85%",
    img: DEVICE_IMAGES.iphone13ProMaxGraphite,
    specs: "256GB • Grafite • Bateria 85%",
    storage: "256 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "85% (Testado e aprovado)",
    screen: '6.7" Super Retina XDR 120Hz ProMotion',
    camera: "Sistema Pro Triplo 12MP com modo macro e tele 3x",
    chip: "A15 Bionic Alta Performance",
  },
  {
    name: "iPhone 13 128GB Preto",
    price: 1590,
    cat: "Seminovos",
    badge: "Bateria 100% Nova",
    img: DEVICE_IMAGES.iphone13Black,
    specs: "128GB • Meia-noite • Bateria Trocada 100%",
    storage: "128 GB",
    condition: "Seminovo Revisado Grade A+",
    warranty: "90 Dias de Garantia Terephones",
    battery: "Bateria Nova Trocada (100% Saúde)",
    screen: '6.1" Super Retina XDR OLED brilhante',
    camera: "Dupla 12MP c/ Estabilização Sensor-Shift",
    chip: "A15 Bionic Super Eficiente",
  },
  {
    name: "iPhone 12 Pro Max 128GB Azul Pacífico",
    price: 1990,
    cat: "Seminovos",
    badge: "Bateria 82%",
    img: DEVICE_IMAGES.iphone12ProMaxBlue,
    specs: "128GB • Azul Pacífico • Bateria 82%",
    storage: "128 GB",
    condition: "Seminovo Grade A+ Impecável",
    warranty: "90 Dias de Garantia Terephones",
    battery: "82% (Testado e certificado)",
    screen: '6.7" Super Retina XDR OLED tela grande',
    camera: "Sistema Pro Triplo 12MP com Sensor LiDAR",
    chip: "A14 Bionic com conexão 5G",
  },
  // Novos Lacrados
  {
    name: "iPhone 16 Pro 128GB Lacrado",
    price: 5990,
    cat: "Novos",
    badge: "Lacrado Apple",
    img: DEVICE_IMAGES.iphone16ProDesert,
    specs: "128GB • Titânio • 1 Ano Garantia Apple",
    storage: "128 GB",
    condition: "Novo Lacrado Apple",
    warranty: "1 Ano Garantia Mundial Apple",
    battery: "100% (Novo Lacrado)",
    screen: '6.3" Super Retina XDR ProMotion 120Hz',
    camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Tele 5x",
    chip: "Apple A18 Pro",
  },
  {
    name: "iPhone 15 128GB Lacrado",
    price: 4690,
    cat: "Novos",
    badge: "Lacrado Apple",
    img: DEVICE_IMAGES.iphone15Black,
    specs: "128GB • Dynamic Island • 1 Ano Garantia Apple",
    storage: "128 GB",
    condition: "Novo Lacrado Apple",
    warranty: "1 Ano Garantia Mundial Apple",
    battery: "100% (Novo Lacrado)",
    screen: '6.1" Super Retina XDR com Dynamic Island',
    camera: "Dupla 48MP c/ zoom óptico 2x de alta resolução",
    chip: "A16 Bionic Ultra Rápido",
  },
];

const filters = ["Todos", "Seminovos", "Novos"];

const comboUpsell = {
  title: "Kit Essencial Proteção Total",
  desc: "Capa MagSafe Antichoque + Película 3D Privacidade + Carregador Turbo 20W USB-C homologado",
  originalPrice: 180,
  promoPrice: 99,
};

const reviews = [
  { name: "Fernanda Lima", neighborhood: "Agriões", text: "Fiquei impressionada com a rapidez. Comprei pelo WhatsApp da Terephones e em menos de 1h30 o aparelho estava aqui no meu prédio. Paguei no cartão na entrega. Nota 10!" },
  { name: "Ricardo Santos", neighborhood: "Alto", text: "Fui retirar na loja parceira SejaDelta. Ambiente super seguro, equipe atenciosa, conferi tudo na hora e já saí com a película aplicada." },
  { name: "Bruno Ferreira", neighborhood: "Várzea", text: "A Terephones é nota 10. Fiz a troca inteligente do meu iPhone 11 pelo 14 Pro com facilidade. Ismael e equipe muito honestos e transparentes." },
  { name: "Beatriz Lopes", neighborhood: "Comary", text: "Estava receosa de pedir pela internet e ficar esperando os Correios subirem a serra. A Terephones entregou na minha porta no mesmo dia. Atendimento impecável!" },
  { name: "Lucas Mendes", neighborhood: "Barra do Imbuí", text: "Aparelho 100% lacrado com 1 ano de garantia oficial Apple verificado na hora. Melhor preço e atendimento de Teresópolis." },
  { name: "Juliana Costa", neighborhood: "Taumaturgo", text: "Vendi meu iPhone antigo por um valor muito justo no Trade-in e peguei o 15. Processo limpo, rápido e sem burocracia." },
  { name: "Tiago Souza", neighborhood: "Tijuca", text: "Excelente consultoria pelo WhatsApp. Me mandou fotos e laudo do seminovo antes de enviar a rota. O aparelho parece que saiu de fábrica!" },
];

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- Components ---------- */
function BackgroundOrbs() {
  return (
    <div className="brand-bg" aria-hidden>
      <div className="brand-orb brand-orb-1" />
      <div className="brand-orb brand-orb-2" />
      <div className="brand-orb brand-orb-3" />
      <div className="deco-shape rounded-3xl" style={{ width: 120, height: 120, top: "18%", left: "6%", transform: "rotate(18deg)" }} />
      <div className="deco-shape rounded-full" style={{ width: 80, height: 80, top: "62%", right: "9%", animationDelay: "-3s" }} />
      <div className="deco-shape rounded-2xl" style={{ width: 60, height: 60, top: "40%", right: "22%", animationDelay: "-5s" }} />
    </div>
  );
}


function Navbar({
  currentTheme,
  toggleTheme,
}: {
  currentTheme: ThemeMode;
  toggleTheme: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [afterHours, setAfterHours] = useState(false);
  const isDark = currentTheme === "black-piano";

  useEffect(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    // Same logic as DeliveryPopup: after 18:00 (18 * 60)
    setAfterHours(minutes >= 18 * 60);
  }, []);
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
    ["Início", "#inicio"], ["Produtos", "#produtos"],
    ["Delivery", "#delivery"], ["Contato", "#contato"],
  ];

  const openThemeModal = () => {
    window.dispatchEvent(new CustomEvent("open-theme-modal"));
  };

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
            <BrandLogo height={scrolled ? 44 : 52} showText={true} dark={isDark} />
          </a>
          <div className="flex items-center justify-center nav-links-desk">
            {links.map(([l, h]) => (
              <a key={h} href={h} className="nav-link nav-link-desk">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-4 justify-end">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold glass transition-all hover:scale-105 cursor-pointer border shadow-sm"
              title={isDark ? "Mudar para Branco Titânio" : "Mudar para Black Piano"}
            >
              {isDark ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                  <span className="text-slate-200">Black Piano</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(26,111,232,0.4)]" />
                  <span className="text-slate-700">Branco</span>
                </>
              )}
            </button>

            <div className="badge-aberto">
              {afterHours ? "Fechado — Abre amanhã às 10:00" : "Aberto até 18:00"}
            </div>
            <span className="h-6 border-l" style={{ borderColor: "rgba(var(--blue-rgb),0.18)" }} />
            <a href={WHATSAPP} className="btn-pedir-agora">Pedir Agora</a>
          </div>
        </div>
      </nav>

      {/* Mobile pill navbar */}
      <nav className={`lg:hidden nav-pill ${scrolled ? "scrolled" : ""}`}>
        <div className="relative flex items-center justify-between h-14 px-4">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="w-9 h-9 flex items-center justify-center rounded-full glass border cursor-pointer"
            style={{ color: "var(--blue-primary)" }}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <a href="#inicio" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <BrandLogo height={34} showText={true} dark={isDark} />
          </a>

          {/* Quick theme toggle for mobile */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema visual"
            className="w-9 h-9 flex items-center justify-center rounded-full glass border text-xs cursor-pointer shadow-sm hover:scale-105 transition"
            title="Alternar tema"
          >
            {isDark ? "⚫" : "⚪"}
          </button>
        </div>

      </nav>


      {open && (
        <div className="lg:hidden mobile-menu p-5">

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

            {/* Mobile Menu Theme Selector Trigger */}
            <button
              onClick={() => {
                setOpen(false);
                openThemeModal();
              }}
              className="py-3 text-sm font-semibold transition border-b flex items-center justify-between w-full text-left cursor-pointer"
              style={{ color: T.text, borderColor: "rgba(var(--blue-rgb),.10)" }}
            >
              <span>Escolher Atmosfera Visual</span>
              <span className="section-pill text-xs py-1 px-3">
                {isDark ? "⚫ Black Piano" : "⚪ Branco Titânio"}
              </span>
            </button>
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
          style={{ background: "rgba(0,0,0,.5)" }}
        />
      )}
    </>
  );
}

function TiltPhone() {
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

      if (Math.abs(diffX) > 0.02 || Math.abs(diffY) > 0.02 || targetRef.current.rotX !== 0 || targetRef.current.rotY !== 0) {
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
      targetRef.current = { rotX: -dy * 18, rotY: dx * 18 };

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
      className="relative flex justify-center items-center fade-up"
      style={{ animationDelay: ".2s", transformStyle: "preserve-3d", willChange: "transform" }}
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
        alt="iPhone Terephones em destaque"
        fetchPriority="high"
        decoding="async"
        width={520}
        height={520}
        className="relative z-10 w-[320px] sm:w-[420px] lg:w-[480px] h-auto float-slow"
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
          <div className="section-pill mb-4 lg:mb-6">
            <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--blue-primary)" }} />
            <span>iPhones Novos & Seminovos em Teresópolis</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight" style={{ color: T.text }}>
            O seu novo <span className="text-gradient-blue">iPhone</span>,<br />
            na sua mão hoje.
          </h1>
          <p className="mt-6 text-lg max-w-xl" style={{ color: T.sub }}>
            Entrega Express em até 2 horas na sua porta em Teresópolis ou Retirada presencial na loja parceira <strong>SejaDelta</strong>. Compre com procedência, até 1 ano de garantia Apple e pague somente na entrega! 🍎⚡
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <a href="#produtos" className="btn-primary-glow inline-flex items-center justify-center gap-2 py-3.5 px-6 text-center font-bold text-sm sm:text-base">
              <ShoppingCart className="w-4 h-4" /> Ver Modelos Disponíveis
            </a>
            <a href={WHATSAPP} className="btn-whatsapp inline-flex items-center justify-center gap-2 py-3.5 px-6 text-center font-bold text-sm sm:text-base">
              <MessageCircle className="w-4 h-4 fill-white" /> Falar no WhatsApp
            </a>
          </div>
          <div className="mt-6 lg:mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm font-medium" style={{ color: T.sub }}>
            <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> <span className="font-bold text-slate-800 dark:text-slate-100">4,9</span> no Google</div>
            <div className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-sky-500" /> Entrega Express 2h</div>
            <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-indigo-500" /> Retirada na SejaDelta</div>
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
          aria-label="Reproduzir vídeo da Terephones"
        >
          <img
            src="https://ik.imagekit.io/zinma/tr:w-800,f-webp,q-80/Terephones-capa.png"
            alt="Thumbnail do vídeo Terephones"
            width={800}
            height={450}
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
            title="Conheça a Terephones"
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
            Experiência Terephones
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            Veja por que somos <span className="text-gradient-blue">a escolha nº 1</span> em Teresópolis
          </h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Qualidade, procedência, entrega em até 2 horas e o respaldo de uma loja parceira física em Teresópolis.
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
              <span className="text-xs font-medium">Terephones — Teresópolis, RJ</span>
            </div>
            <a
              href={WHATSAPP}
              className="btn-primary-glow text-xs py-2 px-4 hidden sm:inline-flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
              </svg>
              Falar com a Terephones
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
            <span style={{ color: "var(--blue-primary)" }}>🏢</span>
            <span>Ponto Físico na SejaDelta</span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(var(--blue-rgb), 0.25)" }}>|</span>
          <div className="flex items-center justify-center gap-2">
            <span style={{ color: "var(--blue-primary)" }}>🚚</span>
            <span>Entrega Express em 2h</span>
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
        <div className="text-xs uppercase tracking-[0.3em] font-extrabold text-gradient-blue mb-3">{eyebrow}</div>
      )}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: T.text }}>{title}</h2>
        {badge && <span className="section-pill text-xs sm:text-sm font-extrabold">{badge}</span>}
      </div>
      <div className="mx-auto mt-4 sm:mt-5 w-24 h-[3px] rounded-full" style={{ background: T.grad }} />
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
        <SectionTitle eyebrow="Por que a Terephones" title="Diferenciais que garantem sua tranquilidade" />
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
  const [viewMode, setViewMode] = useState<"compact" | "showcase">("compact");
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Carregamento transparente e em tempo real da Planilha Google oficial
  const [productList, setProductList] = useState<ProductItem[]>(products);

  useEffect(() => {
    const sheetUrl =
      (import.meta.env.VITE_GOOGLE_SHEET_URL as string) ||
      DEFAULT_SHEET_URL;

    if (sheetUrl) {
      fetchGoogleSheetInventory(sheetUrl)
        .then(items => {
          if (items && items.length > 0) {
            setProductList(items);
          }
        })
        .catch(err => {
          console.warn("Utilizando catálogo padrão Terephones:", err);
        });
    }
  }, []);

  const filteredList = f === "Todos" ? productList : productList.filter(p => p.cat === f);
  const displayList = showAll ? filteredList : filteredList.slice(0, 8);

  const handleProductWhatsApp = (prod: ProductItem) => {
    const text = `Olá, Terephones! Vi o *${prod.name}* no site por ${fmt(prod.price)} e gostaria de saber se tem a pronta-entrega para hoje em Teresópolis!`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="produtos" className="py-14 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Estoque Pronta Entrega"
          title="iPhones Prontos Para Retirada ou Entrega"
          badge="Teresópolis / RJ"
        />

        {/* Filtros e Alternador de Visualização */}
        {/* Mobile: Barra de Filtros Segmentada & Controles */}
        <div className="sm:hidden mt-6 flex flex-col gap-3">
          {/* Segmented Control de 3 Colunas Perfeitas (0 quebras, 100% simétrico) */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-inner backdrop-blur-md">
            {filters.map(fl => {
              const count = fl === "Todos" ? productList.length : productList.filter(p => p.cat === fl).length;
              const isActive = f === fl;
              return (
                <button
                  key={fl}
                  onClick={() => {
                    setF(fl);
                    setShowAll(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "btn-primary-glow text-white shadow-md font-black scale-[1.02]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                  }`}
                >
                  <span className="truncate">{fl}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-200/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-barra: Estoque disponível na esquerda + Alternador de Visualização na direita */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                {filtered.length} {filtered.length === 1 ? "iPhone disponível" : "iPhones disponíveis"}
              </span>
            </div>

            {/* Alternador de Visualização Mobile (Grade 2x vs Vitrine 1x) */}
            <div className="flex items-center p-0.5 bg-slate-100/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <button
                onClick={() => setViewMode("compact")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "compact"
                    ? "btn-primary-glow text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title="Grade 2 por linha no celular"
                aria-label="Grade 2x"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">Grade 2x</span>
              </button>

              <button
                onClick={() => setViewMode("showcase")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "showcase"
                    ? "btn-primary-glow text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title="Vitrine 1 card por linha no celular"
                aria-label="Vitrine 1x"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">Vitrine 1x</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Filtros de Categoria em Barra Ampla */}
        <div className="hidden sm:flex mt-8 sm:mt-10 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {filters.map(fl => {
              const count = fl === "Todos" ? productList.length : productList.filter(p => p.cat === fl).length;
              const isActive = f === fl;
              return (
                <button
                  key={fl}
                  onClick={() => {
                    setF(fl);
                    setShowAll(false);
                  }}
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "btn-primary-glow text-white shadow-lg scale-105"
                      : "section-pill hover:scale-105"
                  }`}
                >
                  <span>{fl}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-blue-100 text-blue-800 dark:bg-sky-400/25 dark:text-sky-200 border border-blue-200/50 dark:border-sky-400/30"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{filtered.length} aparelhos prontos para entrega hoje em Teresópolis</span>
          </div>
        </div>

        {/* Grade de Produtos (Sempre ativa no Computador/Web; no Mobile ativa em modo Grade 2x) */}
        <div
          className={`mt-8 ${
            viewMode === "showcase" ? "hidden sm:grid" : "grid"
          } grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5`}
        >
          {displayList.map(p => (
            <div
              key={p.name}
              className="product-card p-2.5 sm:p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="product-image-box h-32 sm:h-44 mb-2 sm:mb-3 shrink-0 cursor-pointer relative flex items-center justify-center rounded-xl"
                onClick={() => setSelectedProduct(p)}
                title="Clique para ver detalhes"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={300}
                  height={300}
                  className="h-full w-auto object-contain p-1.5 transition-transform duration-300 hover:scale-105"
                  style={{ filter: "drop-shadow(0 10px 18px rgba(13,27,62,0.18))" }}
                />
                <span
                  className={`absolute top-2 left-2 text-[8px] sm:text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md ${
                    p.cat === "Novos" ? "product-badge-novo" : "product-badge-seminovo"
                  }`}
                >
                  {p.badge}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-xs sm:text-base tracking-tight truncate" style={{ color: T.text }} title={p.name}>
                      {p.name}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      {p.storage || "128GB"}
                    </span>
                  </div>

                  <p className="text-[10px] sm:text-xs font-medium mt-1 leading-snug line-clamp-1" style={{ color: T.sub }}>
                    {p.specs}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-xl font-black text-gradient-blue">
                        {fmt(p.price)}
                      </span>
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        PIX
                      </span>
                    </div>
                    <div className="text-[9px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      ou 12x de {fmt(p.price / 12)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-white/10 flex items-center gap-1.5">
                  <button
                    onClick={() => handleProductWhatsApp(p)}
                    className="btn-whatsapp flex-1 py-2 px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-md rounded-xl"
                  >
                    <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white shrink-0" />
                    <span>Pedir</span>
                  </button>
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="btn-outline-glass py-2 px-2 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 cursor-pointer rounded-xl shrink-0"
                    title="Ver Informações"
                  >
                    <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">Info</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vitrine Mobile: Exclusiva no celular (1 card por linha com visual amplo) */}
        {viewMode === "showcase" && (
          <div className="sm:hidden mt-8 grid grid-cols-1 gap-4">
            {displayList.map(p => (
              <div
                key={p.name}
                className="product-card p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="product-image-box h-48 mb-3 shrink-0 cursor-pointer relative flex items-center justify-center rounded-2xl"
                  onClick={() => setSelectedProduct(p)}
                  title="Clique para ver detalhes"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    width={400}
                    height={400}
                    className="h-full w-auto object-contain p-3 transition-transform duration-300 hover:scale-105"
                    style={{ filter: "drop-shadow(0 14px 24px rgba(13,27,62,0.2))" }}
                  />
                  <span
                    className={`absolute top-2.5 left-2.5 text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
                      p.cat === "Novos" ? "product-badge-novo" : "product-badge-seminovo"
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-base tracking-tight" style={{ color: T.text }}>
                        {p.name}
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0">
                        {p.storage || "128GB"}
                      </span>
                    </div>

                    <p className="text-xs font-medium mt-1 leading-snug" style={{ color: T.sub }}>
                      {p.specs}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-white/10">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-gradient-blue">
                          {fmt(p.price)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                          à vista PIX
                        </span>
                      </div>
                      <div className="text-xs mt-0.5 font-medium text-slate-500 dark:text-slate-400">
                        ou até 12x de {fmt(p.price / 12)} (até 18x no cartão)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-white/10 flex flex-col gap-2">
                    <button
                      onClick={() => handleProductWhatsApp(p)}
                      className="btn-whatsapp w-full py-3 px-4 text-xs flex items-center justify-center gap-2 font-bold cursor-pointer transition-all shadow-md rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                      <span>Pedir no WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="btn-outline-glass w-full py-2.5 px-4 text-xs flex items-center justify-center gap-2 font-bold cursor-pointer transition-all rounded-xl"
                    >
                      <Info className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Ver Informações</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão Ver Todos */}
        {!showAll && filteredList.length > 8 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="btn-glass px-8 py-3.5 text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-transform"
            >
              <span>Ver todos os {filteredList.length} modelos disponíveis</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal com Ficha Técnica Completa */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsappNumber={WHATSAPP_NUMBER}
      />
    </section>
  );
}

function HybridSejaDelta() {
  const comboWhatsApp = () => {
    const text = `Olá! Gostaria de incluir o Combo de Proteção Total (Capa MagSafe + Película 3D + Fonte 20W) por R$ 99 no meu pedido!`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="retirada" className="py-10 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Modelo Híbrido Exclusivo"
          title="Como Você Prefere Receber Seu iPhone?"
          badge="Loja Parceira SejaDelta"
        />

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-14">
          {/* Card 1: Entrega Express */}
          <div className="glass-card p-6 sm:p-9 flex flex-col justify-between border-2" style={{ borderColor: "rgba(var(--blue-rgb), 0.3)" }}>
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white" style={{ background: T.grad }}>
                <Truck className="w-6 h-6" />
              </div>
              <div className="section-pill text-xs font-extrabold uppercase tracking-wider mb-2.5">
                Opção 1 • Máxima Comodidade
              </div>
              <h3 className="text-2xl font-black" style={{ color: T.text }}>
                Entrega Express na Sua Porta em até 2h
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: T.sub }}>
                Você pede pelo nosso WhatsApp e nosso entregador leva até você em qualquer bairro de Teresópolis. Você não paga nada adiantado: confere a caixa, confere o lacre, testa o aparelho e paga na hora no PIX ou no cartão de crédito em até 18x.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm" style={{ color: T.sub }}>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Entrega no mesmo dia em Várzea, Agriões, Alto, Comary, Barra e região</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sem risco de extravio dos Correios ou golpes online</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Máquina de cartão levada até você</span>
                </li>
              </ul>
            </div>
            <a
              href={WHATSAPP}
              className="btn-primary-glow mt-8 text-center text-sm py-3 flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" /> Solicitar Entrega Express
            </a>
          </div>

          {/* Card 2: Retirada SejaDelta */}
          <div className="glass-card p-6 sm:p-9 flex flex-col justify-between border-2" style={{ borderColor: "rgba(var(--blue-rgb), 0.3)" }}>
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white" style={{ background: T.grad }}>
                <Building2 className="w-6 h-6" />
              </div>
              <div className="section-pill text-xs font-extrabold uppercase tracking-wider mb-2.5">
                Opção 2 • Ver & Testar Pessoalmente
              </div>
              <h3 className="text-2xl font-black" style={{ color: T.text }}>
                Retirada na Loja Parceira SejaDelta
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: T.sub }}>
                Faz questão de segurar o aparelho na mão, conferir as cores ao vivo ou prefere o ambiente acolhedor de uma loja física? Retire seu iPhone diretamente no nosso ponto oficial parceiro na loja <strong>SejaDelta</strong> em Teresópolis.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm" style={{ color: T.sub }}>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Atendimento prioritário com voucher Terephones</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Vitrine com expositores de capas, películas e caixas de som</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Película aplicada na hora pela equipe SejaDelta</span>
                </li>
              </ul>
            </div>
            <a
              href={`${WHATSAPP}?text=${encodeURIComponent("Olá! Gostaria de reservar um iPhone para retirar na loja SejaDelta em Teresópolis.")}`}
              className="btn-glass mt-8 text-center text-sm py-3 flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" /> Reservar para Retirar na SejaDelta
            </a>
          </div>
        </div>

        {/* Banner Combo Proteção Total */}
        <div className="mt-8 glass-card p-6 sm:p-8 relative overflow-hidden border border-emerald-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <span className="section-pill text-xs font-extrabold uppercase tracking-wider border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Oferta Especial de Lançamento
              </span>
              <h4 className="text-2xl font-black mt-2" style={{ color: T.text }}>
                {comboUpsell.title}
              </h4>
              <p className="text-sm mt-1 max-w-2xl" style={{ color: T.sub }}>
                {comboUpsell.desc}. Saia com seu iPhone 100% blindado desde o primeiro minuto!
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-xs line-through text-gray-400 block">{fmt(comboUpsell.originalPrice)}</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{fmt(comboUpsell.promoPrice)}</span>
              </div>
              <button
                onClick={comboWhatsApp}
                className="btn-primary-glow text-sm px-6 py-3 cursor-pointer"
              >
                Garantir Combo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliverySection() {
  const benefits = [
    "Entrega no mesmo dia em até 2 horas em Teresópolis",
    "Atendimento consultivo e VIP via WhatsApp",
    "Pagamento seguro no ato do recebimento (PIX ou cartão até 18x)",
    "Ponto de retirada presencial na loja parceira SejaDelta",
    "Garantia de 1 ano oficial Apple (lacrados) ou 90 dias (seminovos)",
  ];
  return (
    <section id="delivery" className="py-10 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto glass p-8 sm:p-14 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full float-slow"
             style={{ background: "radial-gradient(circle, rgba(var(--blue-rgb),.16), transparent 70%)", filter: "blur(50px)" }} />
        <div className="grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            <div className="section-pill mb-5">
              <Truck className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--blue-primary)" }} />
              <span>Logística Terephones</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: T.text }}>
              Na sua porta em até 2h, <span className="text-gradient-blue">sem frete lento.</span>
            </h2>
            <p className="mt-5 text-lg" style={{ color: T.sub }}>
              Chega de esperar dias pelos Correios e rezar para subir a serra. Na Terephones você escolhe agora e recebe hoje em mãos com total segurança.
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
              <MessageCircle className="w-5 h-5" /> Falar com Especialista no WhatsApp
            </a>
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
        <SectionTitle eyebrow="Depoimentos Reais" title="Quem Compra em Teresópolis Recomenda" badge="Google 4,9 ★" />
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
                    <div className="text-xs" style={{ color: T.primary }}>{r.neighborhood} • Teresópolis</div>
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
    background: "var(--glass-bg)",
    color: T.text,
    border: "1px solid var(--glass-border)",
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
      `Olá, equipe Terephones! Vim pelo site e tenho interesse na Troca Inteligente (Trade-In). Aqui estão os dados do meu aparelho para pré-avaliação:\n\n` +
      `📱 *Meu iPhone atual:* ${aparelhoAtual}\n\n` +
      `💾 *Armazenamento:* ${armazenamento}\n\n` +
      `🔋 *Saúde da Bateria:* ${bateria}%\n\n` +
      `✨ *Estado de conservação:* ${estado}\n\n` +
      `🎯 *Modelo que desejo comprar:* ${aparelhoDesejado}\n\n` +
      `📞 *Meu WhatsApp:* ${whatsapp}\n\n` +
      `*(Tenho fotos do aparelho prontas para enviar por aqui)*`;

    toast.success("Redirecionando para o WhatsApp da Terephones...");
    window.open(`${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank");
  };

  const cls = "glass px-4 py-3 outline-none placeholder:opacity-60 w-full";

  return (
    <section id="troca" className="py-10 sm:py-24 px-4 sm:px-6 scroll-mt-24">
      <div className="max-w-3xl mx-auto glass-card p-6 sm:p-10">
        <SectionTitle eyebrow="Troca Inteligente" title="Simulador de Avaliação do Seu Usado" badge="Melhor Valor de Terê" />
        <form className="mt-10 grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input required placeholder="Qual o seu iPhone atual? (Ex: 11 64GB)" className={cls} style={fieldStyle}
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
            <option>Perfeito estado (sem marcas)</option>
            <option>Marcas leves de uso</option>
            <option>Tela trincada / Detalhes físicos</option>
            <option>Necessita reparo / Troca de peça</option>
          </select>

          <input required placeholder="Qual modelo você deseja comprar? (Ex: 14 Pro)" className={cls} style={fieldStyle}
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

          <button className="btn-primary-glow sm:col-span-2 py-3 flex items-center justify-center gap-2 cursor-pointer">
            <MessageCircle className="w-5 h-5" />
            Receber Avaliação no WhatsApp
          </button>

          <p className="sm:col-span-2 text-center text-xs" style={{ color: T.muted }}>
            Nossa equipe analisa seus dados e envia uma pré-avaliação em poucos minutos pelo WhatsApp.
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
            <SectionTitle eyebrow="Sobre a Terephones" title="A Apple Experience de Teresópolis" />
            <p className="mt-6 leading-relaxed text-base" style={{ color: T.sub }}>
              A <span className="text-gradient-blue font-bold">Terephones</span> nasceu para revolucionar a forma como moradores de Teresópolis compram e trocam seus iPhones: unindo a agilidade do digital com a segurança e suporte de um ponto físico presencial.
            </p>
            <p className="mt-4 leading-relaxed text-sm" style={{ color: T.sub }}>
              Em parceria com a conceituada loja <strong>SejaDelta</strong>, oferecemos um ecossistema completo: você pode solicitar sua <strong>Entrega Express em domicílio em até 2h</strong> ou retirar presencialmente na loja com atendimento personalizado, aplicação de películas e garantia estendida.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--blue-primary)" }} />
                <div className="text-sm" style={{ color: T.sub }}>
                  <strong>Ponto de Retirada Parceiro Oficial:</strong><br />
                  Loja SejaDelta — Teresópolis - RJ
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 shrink-0" style={{ color: "var(--blue-primary)" }} />
                <div className="text-sm" style={{ color: T.sub }}>Segunda a Sábado — 10:00 às 18:00</div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" style={{ color: "var(--blue-primary)" }} />
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: T.sub }}
                >
                  WhatsApp: {PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: "var(--blue-primary)" }} />
                <div className="text-sm" style={{ color: T.sub }}>Garantia Oficial Apple de 1 ano (Lacrados) • 90 dias loja (Seminovos)</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden relative flex flex-col justify-center"
               style={{ border: "1px solid rgba(var(--blue-rgb),.2)", boxShadow: "0 20px 60px rgba(var(--blue-rgb),.15)" }}>
            <iframe
              title="Terephones e SejaDelta — Localização em Teresópolis"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.8344589947883!2d-42.97341072469956!3d-22.416416979603593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99b9a62254f15d%3A0xcf823f6685514b8a!2sAv.%20Jos%C3%A9%20Joaquim%20de%20Ara%C3%BAjo%20Regadas%2C%20146%20-%20V%C3%A1rzea%2C%20Teres%C3%B3polis%20-%20RJ%2C%2025953-040!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
              className="w-full h-full min-h-[340px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ currentTheme }: { currentTheme?: ThemeMode }) {
  const isDark = currentTheme === "black-piano";
  return (
    <footer id="contato" className="pt-20 pb-28 sm:pb-10 px-4 sm:px-6"
            style={{ background: "var(--glass-bg)", backdropFilter: "var(--glass-blur)", borderTop: "1px solid var(--glass-border)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <BrandLogo showText={true} dark={isDark} />
            <p className="text-sm mt-4 leading-relaxed" style={{ color: T.sub }}>
              A sua melhor experiência na compra de iPhones novos e seminovos em Teresópolis com entrega express no mesmo dia ou retirada na loja parceira SejaDelta.
            </p>
          </div>
          <FooterCol title="Navegação" links={[
            ["Modelos Disponíveis", "#produtos"],
            ["Entrega Express 2h", "#delivery"],
            ["Retirada na SejaDelta", "#retirada"],
            ["Troca Inteligente", "#troca"],
          ]} />
          <FooterCol title="Institucional" links={[
            ["Sobre a Terephones", "#sobre"],
            ["Parceria SejaDelta", "#sobre"],
            ["Garantia & Procedência", "#diferenciais"],
            ["WhatsApp Vendas", WHATSAPP],
          ]} />
          <div>
            <div className="font-bold mb-4" style={{ color: T.text }}>Atendimento</div>
            <div className="text-sm space-y-2.5" style={{ color: T.sub }}>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-500 transition font-medium"
              >
                <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--blue-primary)" }} />
                <span>{PHONE_DISPLAY}</span>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-sky-400 transition">
                <Instagram className="w-4 h-4 shrink-0" style={{ color: "var(--blue-primary)" }} /> {INSTAGRAM_HANDLE}
              </a>
              <div className="flex items-center gap-2 text-xs" style={{ color: T.muted }}>
                <Clock className="w-3.5 h-3.5 shrink-0" /> Seg a Sáb das 10h às 18h
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl sm:text-4xl font-black text-gradient-blue hover:opacity-80 transition"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>
        <div className="mt-10 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--blue-primary), var(--blue-vivid), transparent)" }} />
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs" style={{ color: T.muted }}>
          <div>© {new Date().getFullYear()} Terephones — Teresópolis, RJ. Todos os direitos reservados.</div>
          <div>Entrega no mesmo dia • Retirada na loja física parceira SejaDelta</div>
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
          <li key={l}><a href={h} className="transition hover:text-blue-600" style={{ color: T.sub }}>{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

function WhatsFloat() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp oficial da Terephones"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3.5 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2 p-1.5 sm:p-2 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        boxShadow: "0 6px 22px rgba(34, 197, 94, 0.4)",
      }}
      title="Falar com a Terephones no WhatsApp: (21) 96463-9999"
    >
      <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
        <MessageCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white fill-white" />
        {/* Pulse online badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 border border-emerald-600" />
        </span>
      </div>

      {/* Text label on desktop */}
      <div className="hidden sm:flex flex-col pr-2.5 pl-0.5 text-left leading-tight text-white">
        <span className="text-[9px] uppercase font-bold tracking-wider opacity-90">Online agora</span>
        <span className="text-[11px] font-black tracking-tight">(21) 96463-9999</span>
      </div>
    </a>
  );
}

/**
 * Mobile Bottom Navigation Bar (Footer de Navegação Rápida)
 * Abas: Início, Loja, Chat
 */
function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState<"inicio" | "loja" | "chat">("inicio");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const produtosEl = document.getElementById("produtos");
      const produtosTop = produtosEl ? produtosEl.offsetTop - 220 : 500;

      if (scrollY >= produtosTop) {
        setActiveTab("loja");
      } else {
        setActiveTab("inicio");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (tab: "inicio" | "loja" | "chat") => {
    setActiveTab(tab);
    if (tab === "inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "loja") {
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "chat") {
      window.open(WHATSAPP, "_blank");
    }
  };

  return (
    <nav
      aria-label="Navegação rápida mobile"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/92 dark:bg-slate-950/92 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] px-4 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-3 max-w-xs mx-auto items-center">
        {/* Início */}
        <button
          onClick={() => handleNav("inicio")}
          className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "inicio"
              ? "text-blue-600 dark:text-sky-400 font-black"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === "inicio" ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] leading-none">Início</span>
        </button>

        {/* Loja */}
        <button
          onClick={() => handleNav("loja")}
          className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "loja"
              ? "text-blue-600 dark:text-sky-400 font-black"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
          }`}
        >
          <Smartphone className={`w-5 h-5 transition-transform ${activeTab === "loja" ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] leading-none">Loja</span>
        </button>

        {/* Chat */}
        <button
          onClick={() => handleNav("chat")}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all cursor-pointer text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-black group"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110 stroke-[2.2]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
          </div>
          <span className="text-[11px] leading-none">Chat</span>
        </button>
      </div>
    </nav>
  );
}

/* ---------- Page ---------- */
function BrandStore() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("white");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("terephones_theme") as ThemeMode | null;
      if (saved === "black-piano" || saved === "white") {
        setCurrentTheme(saved);
        const root = document.documentElement;
        root.classList.remove("theme-white", "theme-black-piano", "dark");
        if (saved === "black-piano") {
          root.classList.add("theme-black-piano", "dark");
        } else {
          root.classList.add("theme-white");
        }
      }
      const onThemeChanged = (e: any) => {
        if (e.detail?.theme) {
          setCurrentTheme(e.detail.theme);
        }
      };
      window.addEventListener("theme-changed", onThemeChanged);
      return () => window.removeEventListener("theme-changed", onThemeChanged);
    }
  }, []);

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
    localStorage.setItem("terephones_theme", next);
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: next } }));
    toast.success(next === "black-piano" ? "Tema Black Piano ativado!" : "Tema Branco Titânio ativado!");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ color: T.text }}>
      <ThemeSelectorModal currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      <BackgroundOrbs />
      <Navbar currentTheme={currentTheme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <VSL />
        <Differentials />
        <Products />
        <HybridSejaDelta />
        <DeliverySection />
        <Reviews />
        <SellUsed />
        <About />
      </main>
      <Footer currentTheme={currentTheme} />
      <WhatsFloat />
      <MobileBottomNav />
    </div>
  );
}
