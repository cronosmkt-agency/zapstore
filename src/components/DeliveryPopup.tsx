import { useEffect, useState } from "react";
import { X } from "lucide-react";
const sejaDeltaLogo = "https://ik.imagekit.io/cronosmkt/A%20Casa%20da%20Ma%C3%A7a.png?updatedAt=1785982094106";


export function DeliveryPopup() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [afterHours, setAfterHours] = useState(false);

  useEffect(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    setAfterHours(minutes >= 18 * 60 + 30);

    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!visible || closed) return null;

  const title = afterHours ? "🌙 Agende sua Entrega" : "Delivery Expresso";
  const subtitle = afterHours
    ? "Garanta hoje e receba amanhã cedo!"
    : "Receba seu iPhone hoje até as 18:30h.";

  return (
    <div
      role="status"
      className="fixed z-[60] bottom-6 right-[5.75rem] left-4 md:bottom-6 md:left-6 md:right-auto md:max-w-xs animate-fade-in"
    >
      {/* Mobile: card compacto, alinhado ao botão de chat */}
      <div className="md:hidden relative flex h-14 items-center gap-2 rounded-2xl border border-white/40 bg-white/85 px-3 py-2 pr-7 shadow-lg backdrop-blur-md">
        <div className="shrink-0 grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
          <img src={sejaDeltaLogo} alt="A Casa da Maçã" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] font-semibold leading-tight text-gray-900">
            {!afterHours && <span className="animate-pulse">🟢</span>}
            <span className="truncate">{title}</span>
          </p>
          <p className="mt-0.5 truncate text-[10px] leading-tight text-gray-600">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Fechar aviso de entrega"
          className="absolute right-1 top-1 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-700"
        >
          <X className="h-3 w-3" />
        </button>
      </div>


      {/* Desktop: card completo */}
      <div className="hidden md:flex relative items-start gap-3 rounded-2xl border border-white/40 bg-white/80 p-4 pr-8 shadow-lg backdrop-blur-md">
        <div className="shrink-0 grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
          <img src={sejaDeltaLogo} alt="A Casa da Maçã" width={28} height={28} className="h-7 w-7 object-contain" />
        </div>

        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            {!afterHours && <span className="animate-pulse">🟢</span>}
            <span className="truncate">{title}</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-600">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Fechar aviso de entrega"
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
