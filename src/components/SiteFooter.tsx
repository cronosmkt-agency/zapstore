import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import type { ThemeMode } from "@/components/ThemeSelectorModal";
import {
  WHATSAPP,
  PHONE_DISPLAY,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from "@/data/storeData";
import { Phone, Instagram, Clock, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export interface SiteFooterProps {
  currentTheme?: ThemeMode;
  basePath?: string;
  storeName?: string;
  storeLogo?: string;
  storeTagline?: string;
  whatsapp?: string;
  phoneDisplay?: string;
  address?: string;
  city?: string;
  state?: string;
  businessHours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

export function SiteFooter({
  currentTheme,
  basePath,
  storeName,
  storeLogo,
  storeTagline,
  whatsapp,
  phoneDisplay,
  address,
  city,
  state,
  businessHours,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
}: SiteFooterProps = {}) {
  const isDark = currentTheme === "black-piano";
  const homePath = basePath || "/";
  const lojaPath = basePath ? `${basePath}/loja` : "/loja";
  const whatsUrl = whatsapp
    ? (whatsapp.startsWith("http") ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, "")}`)
    : WHATSAPP;
  const name = storeName || "Terephones";
  const phone = phoneDisplay || PHONE_DISPLAY;

  return (
    <footer
      id="contato"
      className="pt-20 pb-28 sm:pb-12 px-4 sm:px-6"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur)",
        borderTop: "1px solid var(--glass-border)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            {storeLogo ? (
              <div className="flex items-center gap-2.5 mb-3">
                <img
                  src={storeLogo}
                  alt={name}
                  className="h-9 w-auto max-w-[150px] object-contain rounded-md"
                />
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  {name}
                </span>
              </div>
            ) : (name && !name.toLowerCase().includes("terephones")) ? (
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  {name}
                </span>
              </div>
            ) : (
              <BrandLogo showText={true} dark={isDark} />
            )}
            <p
              className="text-sm mt-3 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {storeTagline || "A sua melhor experiência de compra com produtos selecionados, pronta entrega e pagamento com total segurança."}
            </p>
          </div>

          <div>
            <div
              className="font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Navegação
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={homePath}
                  className="transition hover:text-blue-600"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link
                  to={lojaPath}
                  className="transition hover:text-blue-600 font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Loja de iPhones (Estoque Real)
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-emerald-500 font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Atendimento no WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="/#delivery"
                  className="transition hover:text-blue-600"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Entrega Express em 1h
                </a>
              </li>
              <li>
                <a
                  href="/#retirada"
                  className="transition hover:text-blue-600"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Retirada na SejaDelta
                </a>
              </li>
              <li>
                <a
                  href="/#troca"
                  className="transition hover:text-blue-600"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Troca com Troco (Trade-In)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div
              className="font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Institucional
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/#sobre"
                  className="transition hover:text-blue-600"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sobre a Terephones
                </a>
              </li>
              <li>
                <a
                  href="/#retirada"
                  className="transition hover:text-blue-600"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Ponto Parceiro SejaDelta
                </a>
              </li>
              <li>
                <a
                  href="/#diferenciais"
                  className="transition hover:text-blue-600"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Garantia & Procedência
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-emerald-500"
                  style={{ color: "var(--text-secondary)" }}
                >
                  WhatsApp Oficial
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div
              className="font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Atendimento & Contato
            </div>
            <div
              className="text-sm space-y-2.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <a
                href={whatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-500 transition font-medium"
              >
                <Phone
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--blue-primary)" }}
                />
                <span>{phone}</span>
              </a>

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-sky-400 transition"
                >
                  <Instagram
                    className="w-4 h-4 shrink-0"
                    style={{ color: "var(--blue-primary)" }}
                  />
                  <span>Instagram</span>
                </a>
              )}

              {businessHours && (
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{businessHours}</span>
                </div>
              )}

              {address && (
                <div
                  className="flex items-start gap-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {instagramUrl && (
          <div className="mt-12 text-center">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl sm:text-3xl font-black text-gradient-blue hover:opacity-80 transition"
            >
              {name} no Instagram
            </a>
          </div>
        )}

        <div
          className="mt-10 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--blue-primary), var(--blue-vivid), transparent)",
          }}
        />

        <div
          className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div>
            © {new Date().getFullYear()} {name}{city ? ` — ${city}, ${state || 'Brasil'}` : ''}. Todos os
            direitos reservados.
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Entrega express & suporte via WhatsApp</span>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700/60 transition shadow-2xs"
            >
              <span>⚡ Criado com ZapStore</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
