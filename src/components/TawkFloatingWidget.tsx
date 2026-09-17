import { useEffect, useState } from "react";
import { MessageSquareMore } from "lucide-react";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}

export function TawkFloatingWidget() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Hide the default minimized widget as soon as Tawk loads
    window.Tawk_API.onLoad = function () {
      setIsReady(true);
      try {
        window.Tawk_API.hideWidget();
      } catch (e) {}
    };

    // Whenever the user minimizes/closes the chat, keep the default widget hidden
    window.Tawk_API.onChatMinimized = function () {
      try {
        window.Tawk_API.hideWidget();
      } catch (e) {}
    };

    if (window.Tawk_API.isChatMaximized && window.Tawk_API.isChatMaximized()) {
      setIsReady(true);
    }

    if (document.getElementById("tawk-floating-script")) {
      setIsReady(true);
      return;
    }

    const s1 = document.createElement("script");
    s1.id = "tawk-floating-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/6aac00529d89af3444bee888/1k2o8b0j4";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  const handleOpenChat = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (window.Tawk_API) {
        try {
          if (typeof window.Tawk_API.showWidget === "function") {
            window.Tawk_API.showWidget();
          }
          if (typeof window.Tawk_API.maximize === "function") {
            window.Tawk_API.maximize();
            return;
          }
          if (typeof window.Tawk_API.toggle === "function") {
            window.Tawk_API.toggle();
            return;
          }
        } catch (err) {
          console.error("Error opening Tawk:", err);
        }
      }
      // Direct chat link fallback if Tawk script is not fully loaded or blocked
      window.open("https://tawk.to/chat/6aac00529d89af3444bee888/1k2o8b0j4", "_blank");
    }
  };

  return (
    <button
      onClick={handleOpenChat}
      type="button"
      aria-label="Abrir Chat de Atendimento Online Terephones"
      title="Falar com nosso atendimento online"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3.5 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2 p-1.5 sm:p-2 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
      style={{
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)",
        boxShadow: "0 6px 22px rgba(37, 99, 235, 0.45)",
      }}
    >
      <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
        <MessageSquareMore className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" />
        {/* Pulse online indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-300 border border-blue-600" />
        </span>
      </div>

      {/* Text label on desktop */}
      <div className="hidden sm:flex flex-col pr-2.5 pl-0.5 text-left leading-tight text-white">
        <span className="text-[9px] uppercase font-bold tracking-wider opacity-90 text-sky-200">
          Chat Online
        </span>
        <span className="text-[11px] font-black tracking-tight">
          Tire suas Dúvidas
        </span>
      </div>
    </button>
  );
}
