import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Sparkles,
  Truck,
  Building2,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  Phone,
  ArrowRight,
} from "lucide-react";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsFloat } from "@/components/WhatsFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ThemeSelectorModal, type ThemeMode } from "@/components/ThemeSelectorModal";
import { BrandLogo } from "@/components/BrandLogo";
import {
  defaultProducts,
  WHATSAPP,
  fmt,
} from "@/data/storeData";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat & Atendimento Online — Terephones Teresópolis" },
      {
        name: "description",
        content:
          "Tire suas dúvidas ou faça seu pedido de iPhone diretamente pelo Chat oficial da Terephones. Entrega em 2h ou retirada na SejaDelta.",
      },
    ],
  }),
  component: ChatPage,
});

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  options?: { label: string; action: string }[];
  orderCard?: {
    model: string;
    price: number;
    delivery: string;
    payment: string;
    customerName: string;
    customerAddress: string;
  };
  productPicker?: boolean;
}

function ChatPage() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("white");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Order state machine
  const [orderStep, setOrderStep] = useState<
    "idle" | "picking_model" | "picking_delivery" | "picking_payment" | "typing_info" | "finished"
  >("idle");
  const [draftOrder, setDraftOrder] = useState({
    model: "",
    price: 0,
    delivery: "",
    payment: "",
    customerName: "",
    customerAddress: "",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

      // Initial messages
      const now = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages([
        {
          id: "welcome-1",
          sender: "bot",
          text: "Olá! Seja muito bem-vindo ao Chat Oficial da Terephones em Teresópolis! 👋",
          time: now,
        },
        {
          id: "welcome-2",
          sender: "bot",
          text: "Por aqui você pode tirar dúvidas sobre prazos, retirada na SejaDelta, formas de pagamento ou já fazer o seu pedido direto sem precisar entrar no WhatsApp!",
          time: now,
          options: [
            { label: "🛍️ Quero Fazer um Pedido Agora", action: "start_order" },
            { label: "⚡ Como funciona a entrega em 2h?", action: "faq_delivery" },
            { label: "📍 Onde retirar na SejaDelta?", action: "faq_sejadelta" },
            { label: "💳 Formas de Pagamento & Parcelas", action: "faq_payment" },
            { label: "🔄 Como funciona a Troca com Troco?", action: "faq_tradein" },
            { label: "🛡️ Garantia e Procedência", action: "faq_warranty" },
          ],
        },
      ]);
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
  };

  const addBotMessage = (
    text: string,
    options?: { label: string; action: string }[],
    extra?: Partial<ChatMessage>
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const time = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: "bot",
          text,
          time,
          options,
          ...extra,
        },
      ]);
    }, 600);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: "user",
        text,
        time,
      },
    ]);
    if (!textToSend) setInputValue("");

    // If typing info for order
    if (orderStep === "typing_info") {
      const finalOrder = {
        ...draftOrder,
        customerAddress: text,
      };
      setDraftOrder(finalOrder);
      setOrderStep("finished");

      addBotMessage(
        `🎉 Pedido finalizado com sucesso, ${finalOrder.customerName || "Cliente"}!`,
        [
          { label: "📲 Enviar Cópia para o WhatsApp da Loja", action: "copy_whatsapp" },
          { label: "🛍️ Fazer Outro Pedido", action: "start_order" },
          { label: "❓ Tirar Dúvidas", action: "show_faq" },
        ],
        {
          orderCard: finalOrder,
        }
      );
      return;
    }

    // Process user question through knowledge base
    const lower = text.toLowerCase();

    if (
      lower.includes("pedido") ||
      lower.includes("comprar") ||
      lower.includes("quero") ||
      lower.includes("pedir") ||
      lower.includes("encomendar")
    ) {
      handleAction("start_order");
    } else if (
      lower.includes("entrega") ||
      lower.includes("tempo") ||
      lower.includes("demora") ||
      lower.includes("frete") ||
      lower.includes("2h")
    ) {
      handleAction("faq_delivery");
    } else if (
      lower.includes("sejadelta") ||
      lower.includes("onde") ||
      lower.includes("retirada") ||
      lower.includes("loja") ||
      lower.includes("endereço")
    ) {
      handleAction("faq_sejadelta");
    } else if (
      lower.includes("pagar") ||
      lower.includes("pagamento") ||
      lower.includes("pix") ||
      lower.includes("cartao") ||
      lower.includes("cartão") ||
      lower.includes("parcel")
    ) {
      handleAction("faq_payment");
    } else if (
      lower.includes("troca") ||
      lower.includes("usado") ||
      lower.includes("trade")
    ) {
      handleAction("faq_tradein");
    } else if (
      lower.includes("garantia") ||
      lower.includes("defeito") ||
      lower.includes("original")
    ) {
      handleAction("faq_warranty");
    } else {
      addBotMessage(
        "Entendi! Temos 15 iPhones pronta-entrega testados e com garantia hoje em Teresópolis. Como posso te orientar agora?",
        [
          { label: "🛍️ Ver Aparelhos e Fazer Pedido", action: "start_order" },
          { label: "⚡ Como funciona a entrega em 2h?", action: "faq_delivery" },
          { label: "📍 Onde retirar na SejaDelta?", action: "faq_sejadelta" },
          { label: "💬 Falar com Atendente no WhatsApp", action: "open_whatsapp" },
        ]
      );
    }
  };

  const handleAction = (action: string, payload?: any) => {
    const time = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (action === "start_order") {
      setOrderStep("picking_model");
      addBotMessage(
        "Maravilha! Escolha abaixo qual iPhone você quer pedir hoje a pronta entrega:",
        undefined,
        { productPicker: true }
      );
    } else if (action === "select_product") {
      const prod = payload as typeof defaultProducts[0];
      setDraftOrder((prev) => ({
        ...prev,
        model: prod.name,
        price: prod.price,
      }));
      setOrderStep("picking_delivery");

      addBotMessage(
        `Ótima escolha! O ${prod.name} sai por ${fmt(prod.price)} no PIX com garantia e nota.\n\nComo você prefere receber seu aparelho em Teresópolis?`,
        [
          {
            label: "🚚 Entrega Express na minha porta (até 2h)",
            action: "set_delivery_express",
          },
          {
            label: "🏢 Retirar pessoalmente na SejaDelta",
            action: "set_delivery_sejadelta",
          },
        ]
      );
    } else if (action === "set_delivery_express" || action === "set_delivery_sejadelta") {
      const deliveryMode =
        action === "set_delivery_express"
          ? "Entrega Express em Domicílio (até 2h)"
          : "Retirada Presencial na Loja SejaDelta";

      setDraftOrder((prev) => ({
        ...prev,
        delivery: deliveryMode,
      }));
      setOrderStep("picking_payment");

      addBotMessage(
        `Perfeito: ${deliveryMode}.\n\nQual será a forma de pagamento na entrega? (Lembrando que você testa o iPhone na sua mão antes de pagar!)`,
        [
          {
            label: "⚡ PIX com Desconto Especial",
            action: "set_payment_pix",
          },
          {
            label: "💳 Cartão de Crédito em até 18x",
            action: "set_payment_card",
          },
        ]
      );
    } else if (action === "set_payment_pix" || action === "set_payment_card") {
      const paymentMode =
        action === "set_payment_pix"
          ? "PIX com Desconto"
          : "Cartão de Crédito (até 18x)";

      setDraftOrder((prev) => ({
        ...prev,
        payment: paymentMode,
      }));
      setOrderStep("typing_info");

      addBotMessage(
        "Quase lá! Por favor, digite seu Nome e Endereço ou Bairro em Teresópolis (ou deixe apenas seu WhatsApp) para separarmos seu aparelho:"
      );
    } else if (action === "copy_whatsapp") {
      const text = `*NOVO PEDIDO PELO CHAT TEREPHONES*\n\n📱 *Aparelho:* ${draftOrder.model}\n💰 *Valor:* ${fmt(draftOrder.price)}\n🚚 *Recebimento:* ${draftOrder.delivery}\n💳 *Pagamento:* ${draftOrder.payment}\n📍 *Dados:* ${draftOrder.customerAddress}\n\nPor favor, confirmem o envio/retirada para hoje!`;
      window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
    } else if (action === "open_whatsapp") {
      window.open(WHATSAPP, "_blank");
    } else if (action === "faq_delivery") {
      addBotMessage(
        "⚡ *Entrega Express em até 2 Horas:*\n\nNosso motoboy ou motorista oficial leva o iPhone lacrado ou seminovo embalado com termo de garantia diretamente até a sua residência ou trabalho em qualquer bairro de Teresópolis.\n\nVocê liga, testa todas as funções (câmera, Face ID, tela, bateria) e só faz o pagamento quando estiver 100% satisfeito!",
        [
          { label: "🛍️ Fazer Pedido com Entrega Express", action: "start_order" },
          { label: "📍 Prefiro Retirar na SejaDelta", action: "faq_sejadelta" },
        ]
      );
    } else if (action === "faq_sejadelta") {
      addBotMessage(
        "🏢 *Ponto Parceiro Oficial SejaDelta:*\n\nVocê pode retirar seu iPhone presencialmente na SejaDelta, no Centro / Várzea de Teresópolis.\n\nHorário de atendimento: Segunda a Sábado das 10h às 18h. Um ambiente seguro, climatizado, onde aplicamos sua película na hora de cortesia!",
        [
          { label: "🛍️ Reservar iPhone para Retirar", action: "start_order" },
          { label: "💬 Falar com a equipe no WhatsApp", action: "open_whatsapp" },
        ]
      );
    } else if (action === "faq_payment") {
      addBotMessage(
        "💳 *Formas de Pagamento Seguras:*\n\n1. **PIX:** Com o melhor preço e desconto especial à vista.\n2. **Cartão de Crédito:** Parcelamento facilitado em até 12x ou 18x nas melhores taxas.\n3. **Troca inteligente (Trade-In):** Seu iPhone usado entra com desconto abatido na hora.\n\n*O pagamento é feito apenas na entrega ou retirada, após conferir tudo!*",
        [
          { label: "🛍️ Fazer Pedido com PIX ou Cartão", action: "start_order" },
          { label: "🔄 Quero simular troca do meu usado", action: "faq_tradein" },
        ]
      );
    } else if (action === "faq_tradein") {
      addBotMessage(
        "🔄 *Troca Inteligente (Trade-In):*\n\nAceitamos o seu iPhone usado a partir do iPhone 11 como entrada com avaliação justa e honesta.\n\nVocê não precisa ficar sem celular: a troca é feita no momento da entrega do seu novo aparelho!",
        [
          { label: "🛍️ Escolher Meu Novo iPhone", action: "start_order" },
          { label: "💬 Avaliar meu usado no WhatsApp", action: "open_whatsapp" },
        ]
      );
    } else if (action === "faq_warranty") {
      addBotMessage(
        "🛡️ *Garantia & Procedência Terephones:*\n\n- **iPhones Novos Lacrados:** 1 Ano de Garantia Mundial Oficial da Apple.\n- **iPhones Seminovos:** 90 Dias de Garantia total com certificado emitido pela Terephones, bateria original aprovada e aparelhos 100% livres de bloqueios de iCloud.",
        [
          { label: "🛍️ Ver Aparelhos em Estoque", action: "start_order" },
          { label: "⚡ Como funciona a entrega em 2h?", action: "faq_delivery" },
        ]
      );
    } else if (action === "show_faq") {
      addBotMessage("Escolha abaixo o que gostaria de saber:", [
        { label: "⚡ Entrega em 2h", action: "faq_delivery" },
        { label: "📍 Retirada SejaDelta", action: "faq_sejadelta" },
        { label: "💳 Pagamento", action: "faq_payment" },
        { label: "🔄 Troca de Usado", action: "faq_tradein" },
        { label: "🛡️ Garantia", action: "faq_warranty" },
      ]);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground flex flex-col">
      <ThemeSelectorModal currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      <SiteNavbar currentTheme={currentTheme} toggleTheme={toggleTheme} />

      <main className="pt-24 sm:pt-32 pb-24 sm:pb-12 px-3 sm:px-6 max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Chat Window Container */}
        <div className="flex-1 flex flex-col rounded-3xl glass border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[560px]">
          {/* Top Bar do Atendimento */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <BrandLogo height={24} showText={false} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Atendimento Terephones</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-sky-950 text-blue-700 dark:text-sky-300 font-bold">
                    Oficial
                  </span>
                </h2>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online agora • Resposta automática imediata</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMessages([]);
                  setOrderStep("idle");
                  setTimeout(() => {
                    handleAction("show_faq");
                  }, 100);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition cursor-pointer"
                title="Reiniciar conversa"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white font-medium rounded-tr-xs"
                      : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs"
                  }`}
                >
                  {msg.text}

                  {/* Card de Pedido Confirmado */}
                  {msg.orderCard && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-black mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>RESUMO DO SEU PEDIDO</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="text-slate-500">Aparelho:</span>{" "}
                          <strong>{msg.orderCard.model}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Valor no PIX:</span>{" "}
                          <strong className="text-blue-600 dark:text-sky-400">
                            {fmt(msg.orderCard.price)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Recebimento:</span>{" "}
                          <strong>{msg.orderCard.delivery}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Pagamento:</span>{" "}
                          <strong>{msg.orderCard.payment}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Destino/Contato:</span>{" "}
                          <strong>{msg.orderCard.customerAddress}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                        📦 Seu pedido já está no sistema! Nossa equipe de logística entrará em contato para alinhar os detalhes da rota.
                      </p>
                    </div>
                  )}

                  {/* Seletor Visual de iPhones em Estoque */}
                  {msg.productPicker && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 max-h-72 overflow-y-auto space-y-2 pr-1">
                      {defaultProducts.map((prod) => (
                        <div
                          key={prod.name}
                          onClick={() => handleAction("select_product", prod)}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl glass hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer border border-slate-200 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={prod.img}
                              alt={prod.name}
                              className="w-8 h-10 object-contain shrink-0"
                            />
                            <div className="min-w-0 text-left">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {prod.name}
                              </p>
                              <span className="text-[10px] text-blue-600 dark:text-sky-400 font-extrabold">
                                {fmt(prod.price)}
                              </span>
                            </div>
                          </div>
                          <button className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold shrink-0">
                            Escolher
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      msg.sender === "user"
                        ? "text-blue-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {/* Quick action buttons / Options */}
                {msg.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleAction(opt.action)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold glass hover:bg-blue-600 hover:text-white transition cursor-pointer border border-blue-500/20 text-blue-700 dark:text-sky-300 active:scale-95 text-left"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-24">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  orderStep === "typing_info"
                    ? "Digite seu nome e endereço/bairro..."
                    : "Digite sua dúvida ou modelo desejado..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl glass border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter currentTheme={currentTheme} />
      <WhatsFloat />
      <MobileBottomNav />
    </div>
  );
}
