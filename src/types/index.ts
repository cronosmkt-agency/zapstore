// ============================================================
// TIPOS COMPARTILHADOS — Plataforma SaaS
// ============================================================

export type PlanSlug = 'free' | 'starter' | 'pro';
export type ThemeMode = 'white' | 'black-piano' | 'custom';

// ─── Perfil do Lojista ────────────────────────────────────────
export interface Profile {
  id: string;
  slug: string;
  display_name: string;
  store_name?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  plan: PlanSlug;
  plan_expires_at?: string;
  is_active: boolean;
  is_admin?: boolean;
  created_at: string;
}

// ─── Configurações da Loja ────────────────────────────────────
export interface Differential {
  icon: string; // emoji ou nome de ícone
  title: string;
  description: string;
}

export interface StoreSettings {
  id: string;
  profile_id: string;
  store_name: string;
  store_tagline?: string;
  logo_url?: string;
  favicon_url?: string;
  // Contato
  whatsapp?: string;
  phone_display?: string;
  address?: string;
  city?: string;
  state?: string;
  business_hours?: string;
  // Domínio customizado
  custom_domain?: string;
  custom_domain_verified: boolean;
  custom_domain_cname_token?: string;
  // Visual
  theme_mode: ThemeMode;
  primary_color: string;
  accent_color: string;
  font_family: string;
  // SEO
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  // Integrações
  enable_tawk: boolean;
  tawk_widget_id?: string;
  enable_whatsapp_float: boolean;
  enable_dark_mode_toggle: boolean;
  // Textos Hero & Destaque
  hero_title?: string;
  hero_subtitle?: string;
  cta_button_text: string;
  hero_image_url?: string;
  trust_badge_rating?: string;
  trust_badge_delivery?: string;
  trust_badge_location?: string;
  trust_badge_payment?: string;
  // Destaques & Catálogo
  featured_badge?: string;
  featured_eyebrow?: string;
  featured_title?: string;
  featured_subtitle?: string;
  catalog_banner_title?: string;
  catalog_banner_subtitle?: string;
  catalog_banner_button_text?: string;
  // Diferenciais
  differentials_badge?: string;
  differentials_eyebrow?: string;
  differentials_title?: string;
  differentials_subtitle?: string;
  differentials: Differential[];
  // Troca / Trade-in
  enable_tradein?: boolean;
  tradein_badge?: string;
  tradein_eyebrow?: string;
  tradein_title?: string;
  tradein_subtitle?: string;
  tradein_step1_title?: string;
  tradein_step1_desc?: string;
  tradein_step2_title?: string;
  tradein_step2_desc?: string;
  tradein_step3_title?: string;
  tradein_step3_desc?: string;
  tradein_button_text?: string;
  tradein_whatsapp_message?: string;
  // Ponto Físico / Local
  enable_physical_location?: boolean;
  location_badge?: string;
  location_title?: string;
  location_desc?: string;
  google_maps_url?: string;
  // Depoimentos
  reviews_badge?: string;
  reviews_eyebrow?: string;
  reviews_title?: string;
  reviews_subtitle?: string;
  whatsapp_message_template?: string;
  // Redes sociais
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  // Header Customization
  header_logo_alignment_desktop?: 'left' | 'center' | 'right';
  header_logo_alignment_mobile?: 'left' | 'center' | 'right';
  header_show_theme_toggle?: boolean;
  header_show_hours_badge?: boolean;
  header_hours_text?: string;
  header_show_whatsapp_mobile?: boolean;
  header_show_announcement?: boolean;
  header_announcement_text?: string;
  header_cta_text?: string;
  header_show_whatsapp_button?: boolean;
  header_nav_home_label?: string;
  header_nav_catalog_label?: string;
  // Footer Customization
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
  // Legado
  google_sheet_url?: string;
  updated_at: string;
}

// ─── Categoria de Produto ─────────────────────────────────────
export interface ProductCategory {
  id: string;
  profile_id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

// ─── Produto ──────────────────────────────────────────────────
export interface ProductSpecs {
  storage?: string;
  screen?: string;
  chip?: string;
  camera?: string;
  battery?: string;
  warranty?: string;
  condition?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  profile_id: string;
  category_id?: string;
  category_name?: string; // joined
  name: string;
  slug?: string;
  description?: string;
  price: number;
  price_installments?: number;
  installments_count: number;
  badge?: string;
  quantity: number;
  is_available: boolean;
  deleted_at?: string;
  specs: ProductSpecs | { key: string; value: string }[] | Record<string, any>;
  images: string[];        // URLs (R2 ou base64 em dev)
  gallery?: string[];      // alias used by some forms
  primary_image?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Review ───────────────────────────────────────────────────
export interface StoreReview {
  id: string;
  profile_id: string;
  author_name: string;
  neighborhood?: string;
  rating: number;
  comment: string;
  is_visible: boolean;
  sort_order?: number;
  created_at: string;
}

// ─── Plano ───────────────────────────────────────────────────
export interface Plan {
  id: string;
  name: string;
  slug: PlanSlug;
  price?: number;
  price_monthly?: number;
  price_yearly?: number;
  max_products?: number;  // undefined = ilimitado
  max_images?: number;
  limits?: {
    products?: number;
    images?: number;
    custom_domain?: boolean;
    [key: string]: any;
  };
  features: string[];
  is_active: boolean;
}

// ─── Assinatura ───────────────────────────────────────────────
export interface Subscription {
  id: string;
  profile_id: string;
  plan_slug: PlanSlug;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_subscription_id?: string;
  current_period_end?: string;
  created_at: string;
}

// ─── Sessão de Auth local ─────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  slug: string;
  plan: PlanSlug;
  plan_slug: PlanSlug;
  is_admin: boolean;
  impersonatedBy?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  display_name: string;
  slug: string;
  plan: PlanSlug;
  plan_slug?: PlanSlug;
  is_admin: boolean;
  impersonatedBy?: string;
  expires_at: number; // timestamp ms
  user: AuthUser;
}

// ─── Contexto da Loja Pública ─────────────────────────────────
export interface StoreContext {
  profile: Profile;
  settings: StoreSettings;
  categories: ProductCategory[];
  products: Product[];
  reviews: StoreReview[];
}

// ─── Log de Atividade ─────────────────────────────────────────
export interface ActivityLog {
  id: string;
  profile_id: string;
  action: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
