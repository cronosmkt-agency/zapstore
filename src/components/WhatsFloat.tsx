import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { WHATSAPP } from "@/data/storeData";

export function WhatsFloat({
  whatsapp,
  phoneDisplay,
  storeName,
}: {
  whatsapp?: string;
  phoneDisplay?: string;
  storeName?: string;
} = {}) {
  const isTere = (storeName || "").toLowerCase().includes("terephones");
  const whatsUrl = whatsapp
    ? (whatsapp.startsWith("http") ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, "")}`)
    : (isTere ? WHATSAPP : "#");
  const phoneText = phoneDisplay || (isTere ? "(21) 96463-9999" : "Atendimento Online");
  const nameText = storeName || "Loja Oficial";

  return (
    <a
      href={whatsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp oficial de ${nameText}`}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3.5 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2 p-1.5 sm:p-2 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        boxShadow: "0 6px 22px rgba(34, 197, 94, 0.4)",
      }}
      title={`Falar com ${nameText} no WhatsApp: ${phoneText}`}
    >
      <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        {/* Pulse online badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 border border-emerald-600" />
        </span>
      </div>

      {/* Text label on desktop */}
      <div className="hidden sm:flex flex-col pr-2.5 pl-0.5 text-left leading-tight text-white">
        <span className="text-[9px] uppercase font-bold tracking-wider opacity-90">
          Online agora
        </span>
        <span className="text-[11px] font-black tracking-tight">
          {phoneText}
        </span>
      </div>
    </a>
  );
}
