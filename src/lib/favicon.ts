/**
 * Utilitário para atualização dinâmica do Favicon do navegador por loja.
 * Permite que cada lojista (Craft Burger, Terephones, Prime Motors, etc.)
 * tenha seu próprio ícone na aba do navegador.
 */

const DEFAULT_FAVICON = '/favicon.ico';

export function updateFavicon(iconUrl?: string | null) {
  if (typeof document === 'undefined') return;

  const url = iconUrl && iconUrl.trim() !== '' ? iconUrl.trim() : DEFAULT_FAVICON;

  // Atualiza ou cria as tags link para rel="icon", rel="shortcut icon" e rel="apple-touch-icon"
  const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];

  rels.forEach((rel) => {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = url;
  });
}

export function restoreDefaultFavicon() {
  updateFavicon(DEFAULT_FAVICON);
}
