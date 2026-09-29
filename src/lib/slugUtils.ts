export const RESERVED_SLUGS = [
  'login', 'signup', 'logout', 'register', 'auth',
  'admin', 'dashboard', 'api', 'app', 'www',
  'loja', 'chat', 'sitemap', 'robots',
  'suporte', 'contato', 'sobre', 'termos', 'privacidade',
  'checkout', 'webhook', 'portal', 'upload', 'domain',
  'static', 'assets', 'public', 'images', 'media',
  'help', 'faq', 'blog', 'news', 'status',
];

export function isValidSlug(slug: string): boolean {
  // Mínimo 3 chars, máximo 48, apenas a-z 0-9 e hífen, não começa/termina com hífen
  if (!/^[a-z0-9][a-z0-9-]{1,46}[a-z0-9]$/.test(slug) && !/^[a-z0-9]{3,48}$/.test(slug)) {
    return false;
  }
  return !RESERVED_SLUGS.includes(slug);
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // remover acentos
    .replace(/[^a-z0-9-]/g, '-')       // substituir chars inválidos por hífen
    .replace(/-+/g, '-')               // colapsar hífens duplos
    .replace(/^-+|-+$/g, '')           // remover hífens no início/fim
    .slice(0, 48);
}

export function slugErrorMessage(slug: string): string | null {
  if (!slug) return null;
  if (slug.length < 3) return 'Mínimo de 3 caracteres.';
  if (slug.length > 48) return 'Máximo de 48 caracteres.';
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Apenas letras minúsculas, números e hífens.';
  if (/^-|-$/.test(slug)) return 'Não pode começar ou terminar com hífen.';
  if (RESERVED_SLUGS.includes(slug)) return 'Este nome está reservado. Escolha outro.';
  return null;
}
