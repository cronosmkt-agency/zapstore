-- ============================================================
-- ⚡ ZAPSTORE — SCRIPT COMPLETO DE CRIAÇÃO DO BANCO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criar Types / Enums
DO $$ BEGIN
    CREATE TYPE plan_slug AS ENUM ('free', 'starter', 'pro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE theme_mode AS ENUM ('white', 'black-piano', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabela: profiles (Perfis de Lojistas e Administradores)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    store_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    plan plan_slug DEFAULT 'free' NOT NULL,
    plan_expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_admin BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela: store_settings (Configurações Visuais, Identidade e SEO da Loja)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    store_name TEXT NOT NULL,
    store_tagline TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    
    -- Contato
    whatsapp TEXT,
    phone_display TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    business_hours TEXT,
    
    -- Domínio Customizado
    custom_domain TEXT,
    custom_domain_verified BOOLEAN DEFAULT false,
    custom_domain_cname_token TEXT,
    
    -- Identidade Visual
    theme_mode theme_mode DEFAULT 'white' NOT NULL,
    primary_color TEXT DEFAULT '#2563eb' NOT NULL,
    accent_color TEXT DEFAULT '#10b981' NOT NULL,
    font_family TEXT DEFAULT 'Inter' NOT NULL,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    og_image_url TEXT,
    
    -- Integrações
    enable_tawk BOOLEAN DEFAULT false,
    tawk_widget_id TEXT,
    enable_whatsapp_float BOOLEAN DEFAULT true,
    enable_dark_mode_toggle BOOLEAN DEFAULT false,
    
    -- Textos Hero & Apresentação
    hero_title TEXT,
    hero_subtitle TEXT,
    cta_button_text TEXT DEFAULT 'Ver Catálogo Completo',
    hero_image_url TEXT,
    trust_badge_rating TEXT DEFAULT '4,9 no Google',
    trust_badge_delivery TEXT DEFAULT 'Entrega Rápida',
    trust_badge_location TEXT DEFAULT 'Loja Verificada',
    trust_badge_payment TEXT DEFAULT 'Pague com PIX',
    
    -- Diferenciais (JSONB)
    differentials JSONB DEFAULT '[]'::jsonb,
    
    -- Trade-in / Troca
    enable_tradein BOOLEAN DEFAULT false,
    tradein_title TEXT,
    tradein_subtitle TEXT,
    tradein_button_text TEXT DEFAULT 'Simular Troca no WhatsApp',
    tradein_whatsapp_message TEXT,
    
    -- Ponto Físico
    enable_physical_location BOOLEAN DEFAULT false,
    location_title TEXT,
    location_desc TEXT,
    google_maps_url TEXT,
    
    -- Template de Mensagem WhatsApp
    whatsapp_message_template TEXT,
    
    -- Redes Sociais
    instagram_url TEXT,
    facebook_url TEXT,
    tiktok_url TEXT,
    
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela: product_categories (Categorias de Produtos)
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(profile_id, slug)
);

-- 6. Tabela: products (Catálogo de Produtos)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    category_name TEXT,
    name TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_installments NUMERIC(10, 2),
    installments_count INT DEFAULT 12,
    badge TEXT,
    quantity INT DEFAULT 1,
    is_available BOOLEAN DEFAULT true NOT NULL,
    deleted_at TIMESTAMPTZ,
    specs JSONB DEFAULT '{}'::jsonb,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela: store_reviews (Depoimentos de Clientes)
CREATE TABLE IF NOT EXISTS public.store_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    neighborhood TEXT,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabela: plans (Planos Comerciais ZapStore)
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug plan_slug UNIQUE NOT NULL,
    price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_yearly NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_products INT, -- NULL = ilimitado
    max_images INT DEFAULT 1,
    limits JSONB DEFAULT '{}'::jsonb,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabela: subscriptions (Assinaturas de Lojistas)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_slug plan_slug NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    stripe_subscription_id TEXT,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Tabela: platform_settings (Configurações Gerais do Super Admin)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id INT PRIMARY KEY DEFAULT 1,
    platform_name TEXT DEFAULT 'ZapStore' NOT NULL,
    support_email TEXT DEFAULT 'suporte@zapstore.com',
    support_whatsapp TEXT DEFAULT '5521964639999',
    maintenance_mode BOOLEAN DEFAULT false,
    allow_signups BOOLEAN DEFAULT true,
    asaas_api_key TEXT,
    stripe_webhook_secret TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Segurança por Nível de Linha
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Leitura pública para carregar dados da loja; edição apenas do próprio usuário
CREATE POLICY "Profiles são visíveis publicamente" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Usuários editam seu próprio perfil" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Store Settings: Leitura pública; edição apenas do lojista proprietário
CREATE POLICY "Configurações de lojas são visíveis publicamente" 
    ON public.store_settings FOR SELECT USING (true);

CREATE POLICY "Lojista atualiza suas configurações" 
    ON public.store_settings FOR ALL USING (auth.uid() = profile_id);

-- Categorias: Leitura pública; modificação pelo lojista
CREATE POLICY "Categorias são visíveis publicamente" 
    ON public.product_categories FOR SELECT USING (true);

CREATE POLICY "Lojista gerencia suas categorias" 
    ON public.product_categories FOR ALL USING (auth.uid() = profile_id);

-- Produtos: Leitura pública de produtos disponíveis; gestão pelo lojista
CREATE POLICY "Produtos disponíveis são visíveis publicamente" 
    ON public.products FOR SELECT USING (is_available = true AND deleted_at IS NULL);

CREATE POLICY "Lojista gerencia seu catálogo" 
    ON public.products FOR ALL USING (auth.uid() = profile_id);

-- Reviews: Leitura de depoimentos aprovados; gestão pelo lojista
CREATE POLICY "Depoimentos visíveis são públicos" 
    ON public.store_reviews FOR SELECT USING (is_visible = true);

CREATE POLICY "Lojista modera seus depoimentos" 
    ON public.store_reviews FOR ALL USING (auth.uid() = profile_id);

-- Planos: Leitura pública para todos os usuários
CREATE POLICY "Planos são visíveis publicamente" 
    ON public.plans FOR SELECT USING (is_active = true);

-- Platform Settings: Leitura pública de informações básicas; edição restrita a Admin
CREATE POLICY "Configurações da plataforma são públicas" 
    ON public.platform_settings FOR SELECT USING (true);

-- ============================================================
-- TRIGGER: Criar perfil automaticamente no Supabase Auth
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, slug, plan)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'slug', split_part(new.email, '@', 1)),
        'free'
    );

    INSERT INTO public.store_settings (profile_id, store_name)
    VALUES (
        new.id,
        coalesce(new.raw_user_meta_data->>'display_name', 'Minha Nova Loja')
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- STORAGE BUCKETS (Fotos de Produtos e Logos)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Visualização pública de store-assets"
    ON storage.objects FOR SELECT USING (bucket_id = 'store-assets');

CREATE POLICY "Upload autenticado de store-assets"
    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Visualização pública de products"
    ON storage.objects FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Upload autenticado de products"
    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA: Planos Oficiais ZapStore
-- ============================================================
INSERT INTO public.plans (name, slug, price_monthly, price_yearly, max_products, max_images, limits, features, is_active)
VALUES
(
    'Grátis',
    'free',
    0.00,
    0.00,
    10,
    1,
    '{"products": 10, "images_per_product": 1, "custom_domain": false}'::jsonb,
    ARRAY['Até 10 produtos cadastrados', '1 foto por produto', 'Pedidos diretos no WhatsApp', 'Suporte Comunitário'],
    true
),
(
    'Starter',
    'starter',
    19.99,
    199.90,
    50,
    3,
    '{"products": 50, "images_per_product": 3, "custom_domain": false}'::jsonb,
    ARRAY['Até 50 produtos cadastrados', 'Até 3 fotos por produto', 'Botão flutuante WhatsApp customizável', 'Badges e destaques promocionais', 'Suporte Prioritário no WhatsApp'],
    true
),
(
    'Pro',
    'pro',
    49.99,
    499.90,
    NULL,
    5,
    '{"products": null, "images_per_product": 5, "custom_domain": true}'::jsonb,
    ARRAY['Produtos ilimitados', 'Até 5 fotos por produto em alta resolução', 'Chat ao vivo Tawk.to integrado', 'Paleta de cores e temas 100% personalizados', 'Suporte VIP Exclusivo'],
    true
)
ON CONFLICT (slug) DO UPDATE SET
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    max_products = EXCLUDED.max_products,
    max_images = EXCLUDED.max_images,
    features = EXCLUDED.features;
