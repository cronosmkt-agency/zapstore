import { useEffect } from "react";
import {
  X,
  ShieldCheck,
  Truck,
  Building2,
  Battery,
  Cpu,
  Camera,
  Smartphone,
  MessageCircle,
  Gift,
  CheckCircle2,
  CreditCard,
  Zap,
} from "lucide-react";

export interface ProductItem {
  name: string;
  price: number;
  cat: string;
  badge: string;
  img: string;
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
}

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  whatsappNumber = "5521964639999",
}: ProductDetailModalProps) {
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

  if (!isOpen || !product) return null;

  const handleWhatsApp = () => {
    const text = `Olá, equipe Terephones! Estive vendo a ficha técnica do *${product.name}* (R$ ${product.price.toLocaleString("pt-BR")}) no site e gostaria de confirmar a disponibilidade para entrega hoje em Teresópolis!`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const isNovo = product.cat === "Novos" || product.badge.toLowerCase().includes("lacrado");

  const defaultBoxItems = isNovo
    ? [
        "Aparelho iPhone Novo Lacrado de Fábrica",
        "Cabo original Apple USB-C / Lightning trançado",
        "Documentação oficial & chave de chip",
        "Brinde Terephones: Película 3D de alta proteção instalada",
        "Brinde Terephones: Capa protetora anti-impacto MagSafe",
      ]
    : [
        "Aparelho iPhone Seminovo Grade A+ Impecável",
        "Cabo de carregamento Turbo homologado",
        "Certificado de revisão técnica em 25+ itens",
        "Brinde Terephones: Película 3D instalada na hora",
        "Brinde Terephones: Capa protetora anti-impacto MagSafe",
      ];

  const boxList = product.boxItems && product.boxItems.length > 0 ? product.boxItems : defaultBoxItems;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl my-auto glass-card overflow-hidden shadow-2xl z-10 border border-white/20 dark:border-white/10 max-h-[92vh] flex flex-col"
        style={{
          borderRadius: "24px",
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar com botão fechar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200/40 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] sm:text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-full"
              style={{
                background: isNovo ? "rgba(37, 211, 102, 0.15)" : "rgba(56, 189, 248, 0.15)",
                color: isNovo ? "#15803d" : "var(--blue-primary)",
                border: isNovo ? "1px solid rgba(37, 211, 102, 0.3)" : "1px solid rgba(56, 189, 248, 0.3)",
              }}
            >
              {product.badge}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {product.cat}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 sm:px-7 py-5 space-y-6">
          {/* Top Section: Imagem + Título + Preço */}
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div
              className="relative rounded-2xl p-6 flex items-center justify-center overflow-hidden border border-slate-200/50 dark:border-slate-800/60"
              style={{
                background: "radial-gradient(circle at center, rgba(var(--blue-rgb), 0.15), rgba(0,0,0,0) 70%)",
                minHeight: "220px",
              }}
            >
              <img
                src={product.img}
                alt={product.name}
                className="max-h-56 w-auto object-contain transition-transform hover:scale-105 duration-300"
                style={{ filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.22))" }}
              />
            </div>

            <div className="flex flex-col justify-center">
              <h2
                id="product-modal-title"
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
                {product.specs || "Disponível para pronta-entrega em Teresópolis / RJ"}
              </p>

              {/* Preço */}
              <div className="mt-4 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Valor à vista no PIX
                </div>
                <div className="text-3xl font-black text-gradient-blue mt-0.5">
                  {fmt(product.price)}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>ou em até 12x de {fmt(product.price / 12)} no cartão (até 18x disponível)</span>
                </div>
              </div>

              {/* Trade-in notice */}
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>Aceitamos seu iPhone usado na troca (Troca Inteligente)</span>
              </div>
            </div>
          </div>

          {/* Ficha Técnica / Especificações em Grid */}
          <div>
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-500" />
              Especificações Técnicas do Modelo
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                  Armazenamento
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-slate-800 dark:text-slate-200">
                  {product.storage || "128 GB"}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Battery className="w-3.5 h-3.5 text-emerald-500" />
                  Saúde da Bateria
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                  {product.battery || (isNovo ? "100% (Lacrado Apple)" : "88% a 100% (Alta Performance)")}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Garantia
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-slate-800 dark:text-slate-200">
                  {product.warranty || (isNovo ? "1 Ano Mundial Apple" : "90 Dias Garantia Terephones")}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                  Tela
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-slate-800 dark:text-slate-200 truncate">
                  {product.screen || "Super Retina XDR OLED"}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Camera className="w-3.5 h-3.5 text-blue-500" />
                  Câmeras
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-slate-800 dark:text-slate-200 truncate">
                  {product.camera || "Sistema Apple c/ Modo Cinema"}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  Processador
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-slate-800 dark:text-slate-200 truncate">
                  {product.chip || "Apple Bionic Alta Velocidade"}
                </div>
              </div>
            </div>
          </div>

          {/* O que vem na embalagem / Pedido */}
          <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-500" />
              O que você recebe no seu pedido:
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {boxList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compromissos de Segurança */}
          <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-900/30">
              <Truck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Entrega Express em até 2h em Teresópolis</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-900/30">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pague somente na entrega após testar</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/30 dark:border-indigo-900/30">
              <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Retirada presencial na loja SejaDelta</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-7 py-4 border-t border-slate-200/40 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Dúvidas ou quer negociar? Fale direto no WhatsApp:
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              (21) 96463-9999 • Atendimento Rápido
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Fechar
            </button>
            <button
              onClick={handleWhatsApp}
              className="btn-whatsapp px-6 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 font-bold cursor-pointer w-full sm:w-auto shrink-0 shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Comprar pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetailModal;
