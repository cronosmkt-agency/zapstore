import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import type { ThemeMode } from "@/components/ThemeSelectorModal";
import { Phone, Instagram, Facebook, Clock, MapPin } from "lucide-react";
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
  // Dynamic Settings / Flags
  enable_tradein?: boolean;
  enable_physical_location?: boolean;
  location_title?: string;
  // Footer Customization Fields
  footer_about_text?: string;
  footer_show_navigation?: boolean;
  footer_nav_title?: string;
  footer_nav_home_label?: string;
  footer_catalog_link_label?: string;
  footer_show_tradein_link?: boolean;
  footer_tradein_label?: string;
  footer_show_delivery_link?: boolean;
  footer_delivery_label?: string;
  footer_show_location_link?: boolean;
  footer_location_label?: string;
  footer_show_institutional?: boolean;
  footer_inst_title?: string;
  footer_about_link_label?: string;
  footer_warranty_link_label?: string;
  footer_show_contact?: boolean;
  footer_contact_title?: string;
  footer_custom_copyright?: string;
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
  enable_tradein,
  enable_physical_location,
  location_title,
  footer_about_text,
  footer_show_navigation = true,
  footer_nav_title,
  footer_nav_home_label,
  footer_catalog_link_label,
  footer_show_tradein_link,
  footer_tradein_label,
  footer_show_delivery_link = true,
  footer_delivery_label,
  footer_show_location_link = true,
  footer_location_label,
  footer_show_institutional = true,
  footer_inst_title,
  footer_about_link_label,
  footer_warranty_link_label,
  footer_show_contact = true,
  footer_contact_title,
  footer_custom_copyright,
}: SiteFooterProps = {}) {
  const isDark = currentTheme === "black-piano";
  const homePath = basePath || "/";
  const lojaPath = basePath ? `${basePath}/loja` : "/loja";
  const whatsDigits = (whatsapp || "5521964639999").replace(/\D/g, "");
  const whatsUrl = `https://wa.me/${whatsDigits}`;
  const name = storeName || "Loja";
  const phone = phoneDisplay || "(21) 96463-9999";
  
  const isIphoneStore =
    name.toLowerCase().includes("phone") ||
    name.toLowerCase().includes("apple") ||
    (basePath || "").includes("terephones");

  // Navigation column labels
  const navTitle = footer_nav_title || "Navegação";
  const homeLabel = footer_nav_home_label || "Página Inicial";
  const catalogLabel =
    footer_catalog_link_label ||
    (isIphoneStore ? "Loja de iPhones (Estoque Real)" : "Catálogo de Produtos");
  const showTradein =
    enable_tradein === true && footer_show_tradein_link !== false;
  const tradeinLabel = footer_tradein_label || "Troca com Troco (Trade-In)";
  const showDelivery = footer_show_delivery_link !== false;
  const deliveryLabel =
    footer_delivery_label ||
    (isIphoneStore ? "Entrega Express em 1h" : "Entrega & Envio");
  const showLocation =
    enable_physical_location === true && footer_show_location_link !== false;
  const locationLabel =
    footer_location_label ||
    (location_title || (isIphoneStore ? "Retirada na SejaDelta" : "Atendimento Presencial"));

  // Institutional column labels
  const instTitle = footer_inst_title || "Institucional";
  const aboutLabel = footer_about_link_label || `Sobre a ${name}`;
  const warrantyLabel =
    footer_warranty_link_label ||
    (isIphoneStore ? "Garantia & Procedência Apple" : "Garantia & Procedência");
  const contactTitle = footer_contact_title || "Atendimento & Contato";

  return (
    <footer
      id="contato"
      className="mt-16 sm:mt-24 pt-16 sm:pt-20 pb-28 sm:pb-12 px-4 sm:px-6 relative z-10"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur)",
        borderTop: "1px solid var(--glass-border)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Store Brand & Bio */}
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
            ) : name && !name.toLowerCase().includes("terephones") ? (
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
              {footer_about_text ||
                storeTagline ||
                "A sua melhor experiência de compra com produtos selecionados, pronta entrega e pagamento com total segurança."}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          {footer_show_navigation && (
            <div>
              <div
                className="font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {navTitle}
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to={homePath}
                    className="transition hover:text-blue-600"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {homeLabel}
                  </Link>
                </li>
                <li>
                  <Link
                    to={lojaPath}
                    className="transition hover:text-blue-600 font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {catalogLabel}
                  </Link>
                </li>
                <li>
                  <a
                    href={`${whatsUrl}?text=${encodeURIComponent(`Olá, equipe ${name}! Gostaria de tirar dúvidas sobre os produtos.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-emerald-500 font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Atendimento no WhatsApp</span>
                  </a>
                </li>
                {showDelivery && (
                  <li>
                    <a
                      href={`${homePath}#destaques`}
                      className="transition hover:text-blue-600"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {deliveryLabel}
                    </a>
                  </li>
                )}
                {showLocation && (
                  <li>
                    <a
                      href={`${homePath}#localizacao`}
                      className="transition hover:text-blue-600"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {locationLabel}
                    </a>
                  </li>
                )}
                {showTradein && (
                  <li>
                    <a
                      href={`${homePath}#troca`}
                      className="transition hover:text-blue-600"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {tradeinLabel}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Column 3: Institutional Links */}
          {footer_show_institutional && (
            <div>
              <div
                className="font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {instTitle}
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={`${homePath}#inicio`}
                    className="transition hover:text-blue-600"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {aboutLabel}
                  </a>
                </li>
                {showLocation && (
                  <li>
                    <a
                      href={`${homePath}#localizacao`}
                      className="transition hover:text-blue-600"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {locationLabel}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={`${homePath}#diferenciais`}
                    className="transition hover:text-blue-600"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {warrantyLabel}
                  </a>
                </li>
                <li>
                  <a
                    href={`${whatsUrl}?text=${encodeURIComponent(`Olá, equipe ${name}! Gostaria de falar com o atendimento oficial.`)}`}
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
          )}

          {/* Column 4: Contact & Social */}
          {footer_show_contact && (
            <div>
              <div
                className="font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {contactTitle}
              </div>
              <div
                className="text-sm space-y-2.5"
                style={{ color: "var(--text-secondary)" }}
              >
                <a
                  href={`${whatsUrl}?text=${encodeURIComponent(`Olá! Gostaria de atendimento na loja ${name}.`)}`}
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
                    className="flex items-center gap-2 hover:text-pink-500 transition"
                  >
                    <Instagram
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--blue-primary)" }}
                    />
                    <span>Instagram</span>
                  </a>
                )}

                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-blue-500 transition"
                  >
                    <Facebook
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--blue-primary)" }}
                    />
                    <span>Facebook</span>
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
          )}
        </div>

        {/* Separator Divider */}
        <div
          className="mt-12 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--blue-primary), var(--blue-vivid), transparent)",
          }}
        />

        {/* Bottom Bar: Copyright & SaaS Virality Link */}
        <div
          className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div>
            {footer_custom_copyright || (
              <>
                © {new Date().getFullYear()} {name}
                {city ? ` — ${city}, ${state || "Brasil"}` : ""}. Todos os
                direitos reservados.
              </>
            )}
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
