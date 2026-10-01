import { useEffect, useState, useMemo } from "react";
import {
  X,
  ShieldCheck,
  Truck,
  Building2,
  Battery,
  Cpu,
  Camera,
  Smartphone,
  Gift,
  CheckCircle2,
  CreditCard,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export interface ProductItem {
  name: string;
  price: number;
  cat: string;
  badge: string;
  img: string;
  images?: string[];
  specs?: string;
  storage?: string;
  condition?: string;
  warranty?: string;
  battery?: string;
  screen?: string;
  camera?: string;
  chip?: string;
  boxItems?: string[];
  features?: string[];
  quantity?: number;
  imeis?: string[];
  is_featured?: boolean;
  description?: string;
}

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
  storeName?: string;
}

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  whatsappNumber = "5521964639999",
  storeName = "Terephones",
}: ProductDetailModalProps) {
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (product) {
      setSelectedImg(product.img || product.images?.[0] || "");
      setQuantity(1);
    }
  }, [product]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.img) list.push(product.img);
    if (product.images && Array.isArray(product.images)) {
      for (const imgUrl of product.images) {
        if (imgUrl && !list.includes(imgUrl)) {
          list.push(imgUrl);
        }
      }
    }
    return list;
  }, [product]);

  if (!isOpen || !product) return null;

  const isNovo =
    (product.cat || "").toLowerCase().includes("novo") ||
    (product.cat || "").toLowerCase().includes("lacrad") ||
    (product.badge || "").toLowerCase().includes("lacrad") ||
    (product.badge || "").toLowerCase().includes("novo") ||
    (product.name || "").toLowerCase().includes("lacrad") ||
    (product.condition || "").toLowerCase().includes("lacrad") ||
    (product.condition || "").toLowerCase().includes("novo");

  const isIphoneStore =
    storeName.toLowerCase().includes("terephones") ||
    storeName.toLowerCase().includes("apple") ||
    storeName.toLowerCase().includes("phone") ||
    product.name.toLowerCase().includes("iphone");

  const storageDisplay =
    product.storage || product.name.match(/\d+(gb|tb)/i)?.[0]?.toUpperCase() || "";

  const maxQuantity = Math.max(1, product.quantity || 10);
  const totalPrice = product.price * quantity;

  // Contextual delivery badge
  const deliveryBadgeText = isIphoneStore
    ? "Pronta Entrega em até 1h"
    : product.price > 50000
    ? "Agendamento & Visita Exclusiva"
    : (product.cat?.toLowerCase().includes("curso") || product.cat?.toLowerCase().includes("info"))
    ? "Acesso Imediato Online"
    : "Pronta Entrega / Envio Ágil";

  // Contextual installments
  const installmentText = product.price > 50000
    ? "Consulte opções de financiamento ou entrada facilitada"
    : `ou até 12x de ${fmt(totalPrice / 12)} (consulte opções no cartão)`;

  const handleWhatsApp = () => {
    const condText = isNovo
      ? "Novo Lacrado de Fábrica Apple"
      : `Seminovo Grade A+${product.battery ? ` (Saúde da Bateria: ${product.battery})` : ""}`;

    const qtyNotice = quantity > 1 ? `\n🔢 *Quantidade:* ${quantity} unidades` : "";
    const totalNotice = quantity > 1 ? `\n💳 *Valor Total:* ${fmt(totalPrice)}` : "";

    let text = "";
    if (isIphoneStore) {
      text = `Olá, equipe ${storeName}! Gostaria de pedir este item que vi no catálogo:

📱 *Aparelho:* ${product.name}${qtyNotice}
💰 *Valor Unitário:* ${fmt(product.price)}${totalNotice} (ou até 18x no cartão)${storageDisplay ? `\n💾 *Capacidade:* ${storageDisplay}` : ""}
✨ *Condição:* ${condText}

Gostaria de confirmar a disponibilidade para entrega hoje!`;
    } else {
      text = `Olá, equipe ${storeName}! Gostaria de pedir este item que vi no catálogo:

📦 *Produto:* ${product.name}${qtyNotice}
💰 *Valor Unitário:* ${fmt(product.price)}${totalNotice}
🏷️ *Categoria:* ${product.cat || "Geral"}${product.specs ? `\n⚙️ *Especificações:* ${product.specs}` : ""}

Gostaria de confirmar a disponibilidade para compra!`;
    }

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const defaultBoxItems = isIphoneStore
    ? (isNovo
      ? [
          "Aparelho iPhone Novo Lacrado de Fábrica",
          "Cabo original Apple USB-C / Lightning trançado",
          "Documentação oficial & chave de chip",
          `Brinde ${storeName}: Película 3D de alta proteção instalada`,
          `Brinde ${storeName}: Capa protetora anti-impacto MagSafe`,
        ]
      : [
          "Aparelho iPhone Seminovo Grade A+ Impecável",
          "Cabo de carregamento Turbo homologado",
          "Certificado de revisão técnica em 25+ itens",
          `Brinde ${storeName}: Película 3D instalada na hora`,
          `Brinde ${storeName}: Capa protetora anti-impacto MagSafe`,
        ])
    : [];

  const boxList = product.boxItems && product.boxItems.length > 0 ? product.boxItems : defaultBoxItems;

  const badgeHasQty = Boolean(
    product.badge && (/\d+\s*un/i.test(product.badge) || /estoque/i.test(product.badge))
  );

  const hasBatteryInBadge =
    Boolean(product.badge && (product.badge.toLowerCase().includes("bateria") || product.badge.toLowerCase().includes("bat")));

  const formattedBattery = product.battery
    ? product.battery.toLowerCase().startsWith("bateria")
      ? product.battery
      : `Bateria ${product.battery.replace(/^bateria\s*/i, "")}`
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[94vw] sm:max-w-[720px] my-auto product-modal-container overflow-hidden shadow-2xl z-10 max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0b0f17]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar com badges e botão fechar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200/60 dark:border-white/10 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {product.badge && (
              <span
                className={`text-[10px] sm:text-xs uppercase tracking-wider font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs ${
                  isNovo ? "product-badge-novo" : "product-badge-seminovo"
                }`}
              >
                {product.badge}
              </span>
            )}
            {formattedBattery && !hasBatteryInBadge && (
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Battery className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{formattedBattery}</span>
              </span>
            )}
            {product.quantity && product.quantity > 0 && !badgeHasQty && (
              <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                product.quantity <= 2 
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}>
                <span>{product.quantity <= 2 ? `⚠️ Últimas ${product.quantity} un.` : `📦 ${product.quantity} un. em estoque`}</span>
              </span>
            )}
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 hidden xs:inline">
              {product.cat || (isNovo ? "Novo" : "Destaque")}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain px-3.5 sm:px-6 py-3.5 sm:py-5 space-y-4 sm:space-y-6 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.4)_transparent]">
          {/* Top Section: Imagem + Título + Preço */}
          <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-6 items-center">
            {/* Foto Principal + Faixa de Miniaturas */}
            <div className="flex flex-col gap-2">
              <div
                className="relative rounded-2xl p-3 sm:p-5 flex items-center justify-center overflow-hidden border border-slate-200/60 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/50"
                style={{ minHeight: "150px" }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30"
                  style={{
                    background: "radial-gradient(circle at center, rgba(56, 189, 248, 0.3), rgba(0,0,0,0) 70%)",
                  }}
                />
                <img
                  src={selectedImg || product.img}
                  alt={product.name}
                  className="max-h-36 sm:max-h-48 md:max-h-52 w-auto object-contain transition-all hover:scale-105 duration-300 relative z-1"
                  style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.28))" }}
                />
              </div>

              {/* Faixa de Miniaturas se houver mais de 1 imagem */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none justify-center">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImg(imgUrl)}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl p-1 border transition-all cursor-pointer bg-white dark:bg-slate-800 shrink-0 ${
                        selectedImg === imgUrl
                          ? "border-blue-600 ring-2 ring-blue-500/30 scale-105"
                          : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações Principais & Preço */}
            <div className="flex flex-col justify-center">
              <h2
                id="product-modal-title"
                className="text-lg sm:text-2xl font-black tracking-tight leading-tight text-slate-900 dark:text-white"
              >
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm font-semibold mt-1 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                {storageDisplay && (
                  <>
                    <span>{storageDisplay}</span>
                    <span>•</span>
                  </>
                )}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{deliveryBadgeText}</span>
              </p>

              {/* Preço em Destaque */}
              <div className="mt-2.5 sm:mt-3 product-modal-price-box p-3 sm:p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="price-label text-[10px] sm:text-[11px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-sky-300">
                    Valor à vista {quantity > 1 ? `(${quantity} unidades)` : "no PIX"}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    DESCONTO PIX
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gradient-blue mt-0.5">
                  {fmt(totalPrice)}
                </div>
                <div className="price-installments mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{installmentText}</span>
                </div>
              </div>

              {/* Seletor de Quantidade Interativo */}
              <div className="mt-3 flex items-center justify-between p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-white/10">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  Quantidade:
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-xs"
                  >
                    -
                  </button>
                  <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white min-w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                    aria-label="Aumentar quantidade"
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Trade-in notice */}
              {isIphoneStore && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <Zap className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span>Aceitamos seu aparelho usado na troca (Trade-In)</span>
                </div>
              )}
            </div>
          </div>

          {/* Ficha Técnica / Especificações em Grid */}
          {isIphoneStore ? (
            <div>
              <h3 className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-sky-400" />
                Especificações Técnicas
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                <div className="product-modal-box p-2.5 sm:p-3">
                  <div className="spec-label flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    Armazenamento
                  </div>
                  <div className="spec-value text-xs sm:text-sm font-extrabold mt-0.5 text-slate-900 dark:text-white">
                    {storageDisplay || "Original"}
                  </div>
                </div>

                <div className="product-modal-box p-2.5 sm:p-3">
                  <div className="spec-label flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    Saúde da Bateria
                  </div>
                  <div className="spec-value text-xs sm:text-sm font-extrabold mt-0.5 text-emerald-600 dark:text-emerald-400">
                    {product.battery || (isNovo ? "100% (Lacrado)" : "88% a 100% (Original)")}
                  </div>
                </div>

                <div className="product-modal-box p-2.5 sm:p-3">
                  <div className="spec-label flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    Garantia
                  </div>
                  <div className="spec-value text-xs sm:text-sm font-extrabold mt-0.5 text-blue-600 dark:text-sky-300 break-words leading-tight">
                    {product.warranty || (isNovo ? "1 Ano Oficial" : "90 Dias de Garantia")}
                  </div>
                </div>

                <div className="product-modal-box p-2.5 sm:p-3">
                  <div className="spec-label flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    Tela
                  </div>
                  <div className="spec-value text-xs sm:text-sm font-extrabold mt-0.5 text-slate-900 dark:text-white break-words leading-tight">
                    {product.screen || "Super Retina XDR"}
                  </div>
                </div>

                <div className="product-modal-box p-2.5 sm:p-3">
                  <div className="spec-label flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    <Camera className="w-3.5 h-3.5 text-sky-400" />
                    Câmeras
                  </div>
                  <div className="spec-value text-xs sm:text-sm font-extrabold mt-0.5 text-slate-900 dark:text-white break-words leading-tight">
                    {product.camera || "Apple Pro / 4K"}
                  </div>
                </div>

                <div className="product-modal-box p-2.5 sm:p-3">
                  <div className="spec-label flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" />
                    Chip
                  </div>
                  <div className="spec-value text-xs sm:text-sm font-extrabold mt-0.5 text-slate-900 dark:text-white break-words leading-tight">
                    {product.chip || "Apple Bionic / Pro"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            product.specs ? (
              <div>
                <h3 className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Destaques & Ficha Técnica Completa
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                  {(product.specs.includes(" • ")
                    ? product.specs.split(" • ")
                    : product.specs.includes(" | ")
                    ? product.specs.split(" | ")
                    : product.specs.includes("\n")
                    ? product.specs.split("\n")
                    : [product.specs]
                  )
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((spec, i) => {
                      const hasColon = spec.includes(":");
                      if (hasColon) {
                        const parts = spec.split(":");
                        const key = parts[0].trim();
                        const val = parts.slice(1).join(":").trim();
                        return (
                          <div key={i} className="product-modal-box p-2.5 sm:p-3 flex flex-col justify-center">
                            <div className="text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
                              {key}
                            </div>
                            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 break-words leading-snug">
                              {val}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="product-modal-box p-2.5 sm:p-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white break-words leading-snug">
                            {spec}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : null
          )}

          {/* Descrição do Produto (se informada) */}
          {product.description ? (
            <div className="product-modal-box p-3.5 sm:p-4 text-left">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-800 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                Descrição
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          ) : null}

          {/* O que vem na embalagem / Pedido */}
          {boxList.length > 0 ? (
            <div className="product-modal-box p-3.5 sm:p-5">
              <h3 className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-800 dark:text-white mb-2 sm:mb-2.5 flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400" />
                O que você recebe no seu pedido:
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-100 font-medium">
                {boxList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Compromissos de Segurança & Entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
            <div className="product-modal-box p-2.5 sm:p-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{isIphoneStore ? `Entrega Express ${storeName}` : "Atendimento Rápido e Seguro via WhatsApp"}</span>
            </div>
            <div className="product-modal-box p-2.5 sm:p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isIphoneStore ? "Pague na entrega após testar o produto" : "Garantia e Procedência Assegurada"}</span>
            </div>
            <div className="product-modal-box p-2.5 sm:p-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{isIphoneStore ? `Retirada presencial ou delivery ${storeName}` : "Pagamento Facilitado (Pix ou Cartão)"}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="product-modal-footer px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shrink-0 border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          {/* Mobile trust info */}
          <div className="flex sm:hidden items-center justify-between w-full text-[11px] text-slate-500 dark:text-slate-300">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Atendimento Direto</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
              WhatsApp: <span className="font-extrabold text-slate-900 dark:text-sky-300">{whatsappNumber ? whatsappNumber.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') : 'Online'}</span>
            </div>
          </div>

          {/* Desktop trust info */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-300 shrink-0">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Pedido direto com o lojista</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
              WhatsApp: <span className="font-extrabold text-slate-900 dark:text-sky-300">{whatsappNumber ? whatsappNumber.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') : 'Online'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
            >
              Fechar
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-none btn-whatsapp px-5 sm:px-6 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 text-white whitespace-nowrap"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0 text-white" />
              <span>Pedir no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
