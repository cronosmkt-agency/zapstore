-- ============================================================
-- 🛍️ SEED DAS 6 LOJAS DEMOS E PRODUTOS PARA SUPABASE
-- ============================================================

-- 1. Inserir Perfis
INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin', 'Administrador ZapStore', 'admin@cronos.com', NULL, 'pro'::plan_slug, true, true, '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'terephones', 'Terephones (Celulares)', 'terephones@example.com', '5521964639999', 'pro'::plan_slug, true, false, '2026-01-15T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('22222222-2222-2222-2222-222222222222', 'prime-motors', 'Prime Motors (Carros & Veículos)', 'motors@example.com', '5521999991111', 'pro'::plan_slug, true, false, '2026-02-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('33333333-3333-3333-3333-333333333333', 'nexus-digital', 'Nexus Digital (Cursos & Infoprodutos)', 'nexus@example.com', '5521999992222', 'pro'::plan_slug, true, false, '2026-02-15T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('44444444-4444-4444-4444-444444444444', 'aura-store', 'Aura Store (Moda & Streetwear)', 'aura@example.com', '5521999993333', 'starter'::plan_slug, true, false, '2026-03-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('55555555-5555-5555-5555-555555555555', 'craft-burger', 'Craft Burger (Gastronomia & Delivery)', 'burger@example.com', '5521999994444', 'starter'::plan_slug, true, false, '2026-03-10T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('66666666-6666-6666-6666-666666666666', 'alpha-imoveis', 'Alpha Imóveis (Imobiliária Alto Padrão)', 'imoveis@example.com', '5521999995555', 'pro'::plan_slug, true, false, '2026-03-20T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

INSERT INTO public.profiles (id, slug, display_name, email, whatsapp, plan, is_active, is_admin, created_at)
VALUES ('77777777-7777-7777-7777-777777777777', 'demo', 'Loja Demo Geral', 'demo@example.com', NULL, 'free'::plan_slug, true, false, '2026-09-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  plan = EXCLUDED.plan;

-- 2. Inserir Configurações das Lojas
INSERT INTO public.store_settings (
  profile_id, store_name, store_tagline, logo_url, favicon_url, whatsapp, phone_display,
  address, city, state, business_hours, theme_mode, primary_color, accent_color, font_family,
  hero_title, hero_subtitle, cta_button_text, hero_image_url, trust_badge_rating,
  trust_badge_delivery, trust_badge_location, trust_badge_payment, differentials,
  enable_tradein, tradein_title, tradein_subtitle, tradein_whatsapp_message,
  enable_physical_location, location_title, location_desc, google_maps_url,
  whatsapp_message_template, instagram_url
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'Terephones', 'iPhones Novos & Seminovos em Teresópolis', 'https://ik.imagekit.io/zinma/tr:w-300,f-auto,q-85/TerePhones-Logo.png', NULL,
  '5521964639999', '(21) 96463-9999', 'Loja Parceira SejaDelta — Centro de Teresópolis', 'Teresópolis', 'RJ',
  'Seg a Sab: 10h às 18h', 'white'::theme_mode, '#2563eb', '#0ea5e9', 'Inter',
  'O seu novo iPhone,
na sua mão hoje.', 'Entrega Express em até 1 hora na sua porta ou Retirada presencial na loja parceira SejaDelta. Aparelhos revisados com até 1 ano de garantia Apple e pagamento somente na entrega! 🍎⚡', 'Ver Catálogo na Loja', NULL, NULL,
  NULL, NULL, NULL, '[{"icon":"🚚","title":"Entrega Express em 1h","description":"Seu iPhone na porta em qualquer bairro de Teresópolis"},{"icon":"🏪","title":"Ponto Físico SejaDelta","description":"Veja, teste e retire presencialmente no centro"},{"icon":"🛡️","title":"1 Ano de Garantia Apple","description":"Lacrados com garantia mundial + 90 dias em seminovos"},{"icon":"💳","title":"Pague só na Entrega","description":"Zero risco: confira antes de pagar"}]'::jsonb,
  false, NULL, NULL, NULL,
  false, NULL, NULL, NULL,
  'Olá, equipe {store_name}! Gostaria de pedir:

📱 *Aparelho:* {nome}
💰 *Valor:* {preco}
💾 *Capacidade:* {storage}
✨ *Condição:* {condition}

Gostaria de confirmar disponibilidade!', 'https://instagram.com/terephones'
) ON CONFLICT (profile_id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_tagline = EXCLUDED.store_tagline,
  logo_url = EXCLUDED.logo_url;

INSERT INTO public.store_settings (
  profile_id, store_name, store_tagline, logo_url, favicon_url, whatsapp, phone_display,
  address, city, state, business_hours, theme_mode, primary_color, accent_color, font_family,
  hero_title, hero_subtitle, cta_button_text, hero_image_url, trust_badge_rating,
  trust_badge_delivery, trust_badge_location, trust_badge_payment, differentials,
  enable_tradein, tradein_title, tradein_subtitle, tradein_whatsapp_message,
  enable_physical_location, location_title, location_desc, google_maps_url,
  whatsapp_message_template, instagram_url
) VALUES (
  '22222222-2222-2222-2222-222222222222', 'Prime Motors', 'Veículos Seminovos Selecionados & Procedência Periciada', '/demos/logos/prime-motors.png', '/demos/logos/prime-motors.png',
  '5521999991111', '(21) 99999-1111', 'Av. das Américas, 4200 — Barra da Tijuca, Rio de Janeiro - RJ', 'Rio de Janeiro', 'RJ',
  'Seg a Sáb: 09h às 19h', 'white'::theme_mode, '#0284c7', '#38bdf8', 'Inter',
  'O seu próximo carro está aqui.
Procedência & Financiamento Fácil.', 'Seminovos criteriosamente periciados com laudo cautelar 100% aprovado, até 1 ano de garantia de motor e câmbio, e financiamento facilitado com as melhores taxas do mercado. 🚗⚡', 'Ver Estoque de Veículos', NULL, NULL,
  NULL, NULL, NULL, '[{"icon":"🛡️","title":"Laudo Cautelar 100% Aprovado","description":"Zero leilão, sem batidas estruturais e histórico periciado em órgão oficial"},{"icon":"🚗","title":"Financiamento em até 60x","description":"Parceria com os principais bancos para aprovação rápida na hora com as menores taxas"},{"icon":"🔄","title":"Aceitamos seu Usado na Troca","description":"Melhor avaliação do mercado para seu carro ou moto com opção de troco na troca"},{"icon":"⭐","title":"1 Ano de Garantia Completa","description":"Garantia de motor, câmbio e assistência 24 horas em todo o território nacional"}]'::jsonb,
  false, NULL, NULL, NULL,
  true, 'Mega Showroom Prime Motors na Barra da Tijuca', 'Venha tomar um café conosco, testar o carro na pista e sair de carro novo no mesmo dia com financiamento aprovado na hora.', NULL,
  'Olá, equipe Prime Motors! Gostaria de mais informações sobre este veículo que vi no site:

🚗 *Veículo:* {nome}
💰 *Valor:* {preco}

Gostaria de simular um financiamento ou agendar um test drive!', NULL
) ON CONFLICT (profile_id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_tagline = EXCLUDED.store_tagline,
  logo_url = EXCLUDED.logo_url;

INSERT INTO public.store_settings (
  profile_id, store_name, store_tagline, logo_url, favicon_url, whatsapp, phone_display,
  address, city, state, business_hours, theme_mode, primary_color, accent_color, font_family,
  hero_title, hero_subtitle, cta_button_text, hero_image_url, trust_badge_rating,
  trust_badge_delivery, trust_badge_location, trust_badge_payment, differentials,
  enable_tradein, tradein_title, tradein_subtitle, tradein_whatsapp_message,
  enable_physical_location, location_title, location_desc, google_maps_url,
  whatsapp_message_template, instagram_url
) VALUES (
  '33333333-3333-3333-3333-333333333333', 'Nexus Digital', 'Cursos, Ferramentas & Mentorias de Alta Performance', '/demos/logos/nexus-digital.png', '/demos/logos/nexus-digital.png',
  '5521999992222', '(21) 99999-2222', 'Nexus Tech Park — Coworking Digital', 'São Paulo', 'SP',
  'Suporte Online 24/7', 'black-piano'::theme_mode, '#8b5cf6', '#a78bfa', 'Inter',
  'Aprenda, Escale & Domine
o Mercado Digital.', 'Treinamentos práticos, templates validados e mentorias de alto impacto para acelerar seu faturamento e sua carreira na internet. 🚀', 'Explorar Cursos & Formações', NULL, NULL,
  NULL, NULL, NULL, '[{"icon":"⚡","title":"Acesso Imediato no E-mail","description":"Receba seus dados de acesso e links em segundos logo após a confirmação do pedido"},{"icon":"🛡️","title":"7 Dias de Garantia Total","description":"Garantia incondicional: se não gostar, devolvemos 100% do seu dinheiro sem perguntas"},{"icon":"🎓","title":"Aulas Práticas & Certificado","description":"Conteúdo direto ao ponto sem enrolação, com certificado profissional incluso"},{"icon":"💬","title":"Comunidade VIP Exclusiva","description":"Networking diário com especialistas e centenas de alunos acelerando juntos"}]'::jsonb,
  false, NULL, NULL, NULL,
  false, NULL, NULL, NULL,
  'Olá, equipe Nexus Digital! Gostaria de tirar dúvidas sobre este treinamento/produto:

💻 *Produto:* {nome}
💰 *Valor:* {preco}

Poderia me enviar os detalhes de acesso e conteúdo programático?', NULL
) ON CONFLICT (profile_id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_tagline = EXCLUDED.store_tagline,
  logo_url = EXCLUDED.logo_url;

INSERT INTO public.store_settings (
  profile_id, store_name, store_tagline, logo_url, favicon_url, whatsapp, phone_display,
  address, city, state, business_hours, theme_mode, primary_color, accent_color, font_family,
  hero_title, hero_subtitle, cta_button_text, hero_image_url, trust_badge_rating,
  trust_badge_delivery, trust_badge_location, trust_badge_payment, differentials,
  enable_tradein, tradein_title, tradein_subtitle, tradein_whatsapp_message,
  enable_physical_location, location_title, location_desc, google_maps_url,
  whatsapp_message_template, instagram_url
) VALUES (
  '44444444-4444-4444-4444-444444444444', 'Aura Store', 'Streetwear Contemporâneo & Peças Heavyweight', '/demos/logos/aura-store.png', '/demos/logos/aura-store.png',
  '5521999993333', '(21) 99999-3333', 'Rua Augusta, 1420 — Consolação, São Paulo - SP', 'São Paulo', 'SP',
  'Seg a Sáb: 10h às 20h', 'black-piano'::theme_mode, '#ec4899', '#f472b6', 'Inter',
  'Vista Sua Autenticidade.
Streetwear & Moda Premium.', 'Modelagens oversized, tecidos pesados de altíssima qualidade e coleções limitadas feitas para quem tem personalidade. 🔥', 'Ver Coleção Completa', NULL, NULL,
  NULL, NULL, NULL, '[{"icon":"🚚","title":"Envio Rápido para Todo o Brasil","description":"Frete grátis para todo o país em compras acima de R$ 199 com rastreio minuto a minuto"},{"icon":"🔄","title":"Primeira Troca 100% Grátis","description":"Até 30 dias para trocar de tamanho ou modelo sem nenhum custo ou burocracia"},{"icon":"🧵","title":"Algodão Peruano 280g","description":"Toque macio superior, máxima durabilidade pós-lavagem e costura ombro a ombro reforçada"},{"icon":"💳","title":"6x Sem Juros ou 5% OFF Pix","description":"Condições facilitadas de pagamento para você renovar seu guarda-roupa com estilo"}]'::jsonb,
  false, NULL, NULL, NULL,
  true, 'Loja Conceito Aura na Rua Augusta', 'Venha conhecer as peças de perto, provar os tamanhos oversized e sentir a textura dos tecidos heavyweight premium.', NULL,
  'Olá, equipe Aura Store! Gostaria de pedir esta peça que vi no catálogo:

👕 *Item:* {nome}
💰 *Valor:* {preco}

Gostaria de confirmar a disponibilidade e prazo de frete!', NULL
) ON CONFLICT (profile_id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_tagline = EXCLUDED.store_tagline,
  logo_url = EXCLUDED.logo_url;

INSERT INTO public.store_settings (
  profile_id, store_name, store_tagline, logo_url, favicon_url, whatsapp, phone_display,
  address, city, state, business_hours, theme_mode, primary_color, accent_color, font_family,
  hero_title, hero_subtitle, cta_button_text, hero_image_url, trust_badge_rating,
  trust_badge_delivery, trust_badge_location, trust_badge_payment, differentials,
  enable_tradein, tradein_title, tradein_subtitle, tradein_whatsapp_message,
  enable_physical_location, location_title, location_desc, google_maps_url,
  whatsapp_message_template, instagram_url
) VALUES (
  '55555555-5555-5555-5555-555555555555', 'Craft Burger', 'Hambúrgueres Artesanais na Brasa & Carnes Nobres Angus', '/demos/logos/craft-burger.png', '/demos/logos/craft-burger.png',
  '5521999994444', '(21) 99999-4444', 'Rua das Laranjeiras, 350 — Laranjeiras, Rio de Janeiro - RJ', 'Rio de Janeiro', 'RJ',
  'Terça a Domingo: 18h às 23h30', 'white'::theme_mode, '#ea580c', '#f97316', 'Inter',
  'O Verdadeiro Burger Artesanal
Feito na Brasa.', 'Blends 100% Angus fresco moído diariamente, bacon defumado na casa por 12h, queijos artesanais e molhos autorais. Peça e receba quentinho! 🍔🔥', 'Fazer Pedido no Cardápio', NULL, NULL,
  NULL, NULL, NULL, '[{"icon":"🍔","title":"Blend 100% Angus Fresco","description":"Carnes nobres moídas no dia, nunca congeladas, assadas na brasa no ponto perfeito"},{"icon":"🛵","title":"Delivery Rápido em 35 min","description":"Embalagens térmicas especiais anti-umidade para o pão e o queijo chegarem perfeitos"},{"icon":"🥓","title":"Bacon Defumado na Casa","description":"Defumação artesanal com lenha de macieira por 12 horas para máxima crocância"},{"icon":"⭐","title":"Programa de Fidelidade","description":"Junte selos a cada pedido e troque por burgers especiais grátis"}]'::jsonb,
  false, NULL, NULL, NULL,
  true, 'Espaço Gastronômico Craft Burger em Laranjeiras', 'Ambiente aconchegante com chopp artesanal gelado, deck ao ar livre e os melhores hambúrgueres artesanais na brasa.', NULL,
  'Olá, equipe Craft Burger! Gostaria de fazer este pedido do cardápio:

🍔 *Burger/Item:* {nome}
💰 *Valor:* {preco}

Poderia me informar o tempo de entrega para o meu endereço?', NULL
) ON CONFLICT (profile_id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_tagline = EXCLUDED.store_tagline,
  logo_url = EXCLUDED.logo_url;

INSERT INTO public.store_settings (
  profile_id, store_name, store_tagline, logo_url, favicon_url, whatsapp, phone_display,
  address, city, state, business_hours, theme_mode, primary_color, accent_color, font_family,
  hero_title, hero_subtitle, cta_button_text, hero_image_url, trust_badge_rating,
  trust_badge_delivery, trust_badge_location, trust_badge_payment, differentials,
  enable_tradein, tradein_title, tradein_subtitle, tradein_whatsapp_message,
  enable_physical_location, location_title, location_desc, google_maps_url,
  whatsapp_message_template, instagram_url
) VALUES (
  '66666666-6666-6666-6666-666666666666', 'Alpha Imóveis', 'Imóveis de Alto Padrão, Coberturas & Condomínios Fechados', '/demos/logos/alpha-imoveis.png', '/demos/logos/alpha-imoveis.png',
  '5521999995555', '(21) 99999-5555', 'Av. Lúcio Costa, 3100 — Barra da Tijuca, Rio de Janeiro - RJ', 'Rio de Janeiro', 'RJ',
  'Seg a Sáb: 08h às 20h | Dom com agendamento', 'white'::theme_mode, '#0f766e', '#14b8a6', 'Inter',
  'Os Melhores Imóveis
de Alto Padrão da Região.', 'Casas em condomínios fechados, coberturas exclusivas e apartamentos de luxo com assessoria jurídica e atendimento personalizado. 🏡🔑', 'Ver Imóveis Disponíveis', NULL, NULL,
  NULL, NULL, NULL, '[{"icon":"🏡","title":"Assessoria Jurídica Completa","description":"Segurança jurídica total do contrato de compra e venda à lavratura da escritura"},{"icon":"🔑","title":"Visitas Guiadas Exclusivas","description":"Corretores seniores credenciados para uma visita técnica detalhada no imóvel"},{"icon":"🏦","title":"Simulação Bancária Express","description":"Parceria com todos os bancos para aprovar as menores taxas de juros do mercado"},{"icon":"📸","title":"Fotos em Alta & Tour em Vídeo 4K","description":"Conheça cada cômodo em detalhes antes mesmo de agendar a visita presencial"}]'::jsonb,
  false, NULL, NULL, NULL,
  true, 'Sede Alpha Imóveis na Orla da Barra', 'Reuniões com assessoria jurídica privativa, simulação bancária imediata e atendimento VIP com corretores credenciados.', NULL,
  'Olá, equipe Alpha Imóveis! Gostaria de mais informações sobre este imóvel do portfólio:

🏡 *Imóvel:* {nome}
💰 *Valor:* {preco}

Gostaria de agendar uma visita guiada com o corretor!', NULL
) ON CONFLICT (profile_id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_tagline = EXCLUDED.store_tagline,
  logo_url = EXCLUDED.logo_url;

INSERT INTO public.store_settings (
  profile_id, store_name, store_tagline, logo_url, favicon_url, whatsapp, phone_display,
  address, city, state, business_hours, theme_mode, primary_color, accent_color, font_family,
  hero_title, hero_subtitle, cta_button_text, hero_image_url, trust_badge_rating,
  trust_badge_delivery, trust_badge_location, trust_badge_payment, differentials,
  enable_tradein, tradein_title, tradein_subtitle, tradein_whatsapp_message,
  enable_physical_location, location_title, location_desc, google_maps_url,
  whatsapp_message_template, instagram_url
) VALUES (
  '77777777-7777-7777-7777-777777777777', 'Loja Demo Geral', 'Os melhores produtos para você', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  NULL, 'white'::theme_mode, '#7c3aed', '#a78bfa', 'Inter',
  NULL, NULL, 'Ver Loja', NULL, NULL,
  NULL, NULL, NULL, '[{"icon":"🚚","title":"Entrega Express em 1h","description":"Seu iPhone na porta em qualquer bairro de Teresópolis"},{"icon":"🏪","title":"Ponto Físico SejaDelta","description":"Veja, teste e retire presencialmente no centro"},{"icon":"🛡️","title":"1 Ano de Garantia Apple","description":"Lacrados com garantia mundial + 90 dias em seminovos"},{"icon":"💳","title":"Pague só na Entrega","description":"Zero risco: confira antes de pagar"}]'::jsonb,
  false, NULL, NULL, NULL,
  false, NULL, NULL, NULL,
  NULL, NULL
) ON CONFLICT (profile_id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_tagline = EXCLUDED.store_tagline,
  logo_url = EXCLUDED.logo_url;

-- 3. Inserir Categorias
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('11111111-1111-1111-1111-111111111111', 'Lacrados', 'lacrados', 1)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('11111111-1111-1111-1111-111111111111', 'Seminovos', 'seminovos', 2)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('11111111-1111-1111-1111-111111111111', 'Acessórios', 'acessorios', 3)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('22222222-2222-2222-2222-222222222222', 'SUVs', 'suvs', 1)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('22222222-2222-2222-2222-222222222222', 'Sedans Premium', 'sedans-premium', 2)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('22222222-2222-2222-2222-222222222222', 'Hatches Compactos', 'hatches-compactos', 3)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pickups & 4x4', 'pickups-4x4', 4)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('33333333-3333-3333-3333-333333333333', 'Cursos & Formações', 'cursos-formacoes', 1)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('33333333-3333-3333-3333-333333333333', 'Templates & Dashboards', 'templates-dashboards', 2)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('33333333-3333-3333-3333-333333333333', 'Automações & IA', 'automacoes-ia', 3)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('33333333-3333-3333-3333-333333333333', 'Mentorias VIP', 'mentorias-vip', 4)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('44444444-4444-4444-4444-444444444444', 'Camisetas Oversized', 'camisetas-oversized', 1)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('44444444-4444-4444-4444-444444444444', 'Moletons & Jaquetas', 'moletons-jaquetas', 2)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('44444444-4444-4444-4444-444444444444', 'Calças Cargo', 'calcas-cargo', 3)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('44444444-4444-4444-4444-444444444444', 'Acessórios & Bonés', 'acessorios-bones', 4)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('55555555-5555-5555-5555-555555555555', 'Burgers na Brasa', 'burgers-na-brasa', 1)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('55555555-5555-5555-5555-555555555555', 'Smash Burgers', 'smash-burgers', 2)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('55555555-5555-5555-5555-555555555555', 'Acompanhamentos', 'acompanhamentos', 3)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('55555555-5555-5555-5555-555555555555', 'Bebidas & Shakes', 'bebidas-shakes', 4)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('66666666-6666-6666-6666-666666666666', 'Casas em Condomínio', 'casas-em-condominio', 1)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('66666666-6666-6666-6666-666666666666', 'Coberturas Lineares', 'coberturas-lineares', 2)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('66666666-6666-6666-6666-666666666666', 'Apartamentos Modernos', 'apartamentos-modernos', 3)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('66666666-6666-6666-6666-666666666666', 'Mansões Exclusivas', 'mansoes-exclusivas', 4)
ON CONFLICT (profile_id, slug) DO NOTHING;
INSERT INTO public.product_categories (profile_id, name, slug, sort_order)
VALUES ('77777777-7777-7777-7777-777777777777', 'Geral', 'geral', 1)
ON CONFLICT (profile_id, slug) DO NOTHING;

-- 4. Inserir Produtos
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 Pro Max 256GB Azul', NULL, NULL,
  7590, NULL, 18,
  '📦 2 un. Lacradas', 2, true, true,
  '{"storage":"256 GB","screen":"6.9\" Super Retina XDR OLED ProMotion 120Hz","chip":"Apple A19 Pro","camera":"Tripla 48MP Fusion Pro","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-pro-max-blue.webp']::TEXT[], 1
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 Pro Max 256GB Prata', NULL, NULL,
  7590, NULL, 18,
  '📦 5 un. Lacradas', 5, true, true,
  '{"storage":"256 GB","screen":"6.9\" Super Retina XDR OLED ProMotion 120Hz","chip":"Apple A19 Pro","camera":"Tripla 48MP Fusion Pro","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-pro-max-silver.webp']::TEXT[], 2
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 Pro Max 256GB Laranja', NULL, NULL,
  7590, NULL, 18,
  '📦 2 un. Lacradas', 2, true, false,
  '{"storage":"256 GB","screen":"6.9\" Super Retina XDR OLED ProMotion 120Hz","chip":"Apple A19 Pro","camera":"Tripla 48MP Fusion Pro","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-pro-max-orange.webp']::TEXT[], 3
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 Pro 256GB Prata', NULL, NULL,
  7190, NULL, 18,
  'Novo Lacrado Apple', 1, true, true,
  '{"storage":"256 GB","screen":"6.3\" Super Retina XDR OLED ProMotion 120Hz","chip":"Apple A19 Pro","camera":"Tripla 48MP Fusion Pro","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-pro-silver.webp']::TEXT[], 4
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 Pro 256GB Azul', NULL, NULL,
  7190, NULL, 18,
  'Novo Lacrado Apple', 1, true, false,
  '{"storage":"256 GB","screen":"6.3\" Super Retina XDR OLED ProMotion 120Hz","chip":"Apple A19 Pro","camera":"Tripla 48MP Fusion Pro","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-pro-blue.webp']::TEXT[], 5
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 256GB Branco', NULL, NULL,
  5390, NULL, 18,
  '📦 2 un. Lacradas', 2, true, false,
  '{"storage":"256 GB","screen":"6.1\" Super Retina XDR OLED com Dynamic Island","chip":"Apple A19 Bionic","camera":"Dupla 48MP Fusion + Ultra-Wide","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-white.webp']::TEXT[], 6
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 256GB Preto', NULL, NULL,
  5390, NULL, 18,
  '📦 2 un. Lacradas', 2, true, false,
  '{"storage":"256 GB","screen":"6.1\" Super Retina XDR OLED com Dynamic Island","chip":"Apple A19 Bionic","camera":"Dupla 48MP Fusion + Ultra-Wide","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-black.webp']::TEXT[], 7
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 256GB Azul', NULL, NULL,
  5390, NULL, 18,
  '📦 2 un. Lacradas', 2, true, false,
  '{"storage":"256 GB","screen":"6.1\" Super Retina XDR OLED com Dynamic Island","chip":"Apple A19 Bionic","camera":"Dupla 48MP Fusion + Ultra-Wide","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-blue.webp']::TEXT[], 8
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 17 256GB Verde', NULL, NULL,
  5390, NULL, 18,
  '📦 3 un. Lacradas', 3, true, false,
  '{"storage":"256 GB","screen":"6.1\" Super Retina XDR OLED com Dynamic Island","chip":"Apple A19 Bionic","camera":"Dupla 48MP Fusion + Ultra-Wide","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-17-green.webp']::TEXT[], 9
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 16 128GB Preto', NULL, NULL,
  4590, NULL, 18,
  'Novo Lacrado Apple', 1, true, false,
  '{"storage":"128 GB","screen":"6.1\" Super Retina XDR com Dynamic Island","chip":"Apple A18 Bionic","camera":"Dupla 48MP Fusion + Ultra-Wide","battery":"100% de Fábrica","warranty":"1 Ano Garantia Mundial Apple","condition":"Novo Lacrado de Fábrica Apple"}'::jsonb, ARRAY['/src/assets/devices/iphone-16-black.webp']::TEXT[], 10
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 16 Pro Max 256GB Desert', NULL, NULL,
  5290, NULL, 12,
  'Bateria 98%', 1, true, true,
  '{"storage":"256 GB","screen":"6.9\" Super Retina XDR ProMotion 120Hz","chip":"Apple A18 Pro","camera":"Tripla 48MP Fusion + Tele 5x","battery":"98% de Saúde Original","warranty":"90 Dias de Garantia","condition":"Seminovo Grade A+ Impecável"}'::jsonb, ARRAY['/src/assets/devices/iphone-16-pro-max-desert.webp']::TEXT[], 11
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 16 Pro Max 256GB Titânio Natural', NULL, NULL,
  5290, NULL, 12,
  'Bateria 89%', 1, true, false,
  '{"storage":"256 GB","screen":"6.9\" Super Retina XDR ProMotion 120Hz","chip":"Apple A18 Pro","camera":"Tripla 48MP Fusion + Tele 5x","battery":"89% de Saúde Original","warranty":"90 Dias de Garantia","condition":"Seminovo Grade A+ Impecável"}'::jsonb, ARRAY['/src/assets/devices/iphone-16-pro-max-natural.webp']::TEXT[], 12
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 16 Pro 256GB Desert', NULL, NULL,
  4990, NULL, 12,
  'Bateria 99%', 1, true, false,
  '{"storage":"256 GB","screen":"6.3\" Super Retina XDR ProMotion 120Hz","chip":"Apple A18 Pro","camera":"Tripla 48MP Fusion + Tele 5x","battery":"99% (Praticamente novo)","warranty":"90 Dias de Garantia","condition":"Seminovo Grade A+ Impecável"}'::jsonb, ARRAY['/src/assets/devices/iphone-16-pro-desert.webp']::TEXT[], 13
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 16 Pro 256GB Branco Titânio', NULL, NULL,
  4990, NULL, 12,
  'Bateria 92%', 1, true, false,
  '{"storage":"256 GB","screen":"6.3\" Super Retina XDR ProMotion 120Hz","chip":"Apple A18 Pro","camera":"Tripla 48MP Fusion + Tele 5x","battery":"92% de Saúde Original","warranty":"90 Dias de Garantia","condition":"Seminovo Grade A+ Impecável"}'::jsonb, ARRAY['/src/assets/devices/iphone-16-pro-white.webp']::TEXT[], 14
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 15 Pro 128GB Azul Titânio', NULL, NULL,
  3690, NULL, 12,
  'Bateria 85%', 1, true, false,
  '{"storage":"128 GB","screen":"6.1\" Super Retina XDR OLED 120Hz ProMotion","chip":"A17 Pro (3nm)","camera":"Tripla 48MP + Tele 3x + Macro","battery":"85% (Testado e certificado)","warranty":"90 Dias de Garantia","condition":"Seminovo Grade A+ Impecável"}'::jsonb, ARRAY['/src/assets/devices/iphone-15-pro-blue.webp']::TEXT[], 15
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 13 Pro Max 256GB Grafite', NULL, NULL,
  3190, NULL, 12,
  'Bateria 85%', 1, true, false,
  '{"storage":"256 GB","screen":"6.7\" Super Retina XDR 120Hz ProMotion","chip":"A15 Bionic Alta Performance","camera":"Sistema Pro Triplo 12MP com Tele 3x","battery":"85% (Testado e aprovado)","warranty":"90 Dias de Garantia","condition":"Seminovo Grade A+ Impecável"}'::jsonb, ARRAY['/src/assets/devices/iphone-13-pro-max-graphite.webp']::TEXT[], 16
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111', 'iPhone 12 Pro Max 128GB Azul Pacífico', NULL, NULL,
  1990, NULL, 12,
  'Bateria 82%', 1, true, false,
  '{"storage":"128 GB","screen":"6.7\" Super Retina XDR OLED tela grande","chip":"A14 Bionic com 5G","camera":"Sistema Pro Triplo 12MP com Sensor LiDAR","battery":"82% (Testado e certificado)","warranty":"90 Dias de Garantia","condition":"Seminovo Grade A+ Impecável"}'::jsonb, ARRAY['/src/assets/devices/iphone-12-pro-max-blue.webp']::TEXT[], 17
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '22222222-2222-2222-2222-222222222222', 'Toyota Corolla Cross XRE 2.0 Flex 2024', NULL, NULL,
  164900, 3890, 60,
  'Único Dono • 14.500 km', 1, true, true,
  '{"Ano":"2024/2024","Quilometragem":"14.500 km rodados","Câmbio":"Automático Direct Shift 10 marchas","Motor":"2.0 Dual VVT-iE 177 cv","Combustível":"Flex (Etanol/Gasolina)","Garantia":"Garantia de Fábrica Toyota até 2029","Destaque":"Laudo cautelar 100% aprovado"}'::jsonb, ARRAY['/demos/cars/corolla-cross.png']::TEXT[], 1
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '22222222-2222-2222-2222-222222222222', 'Jeep Compass Limited T270 Turbo Flex 2023', NULL, NULL,
  149900, 3550, 60,
  'Teto Solar Panorâmico', 1, true, true,
  '{"Ano":"2023/2023","Quilometragem":"26.800 km rodados","Câmbio":"Automático de 6 marchas","Motor":"1.3 Turbo T270 185 cv","Combustível":"Flex","Garantia":"1 Ano de Garantia Prime Motors","Opcionais":"Som Beats + Painel 100% Digital"}'::jsonb, ARRAY['/demos/cars/compass.png']::TEXT[], 2
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '22222222-2222-2222-2222-222222222222', 'BMW 320i M Sport 2.0 Turbo ActiveFlex 2023', NULL, NULL,
  269000, 7100, 48,
  'Pacote M Sport Completo', 1, true, true,
  '{"Ano":"2023/2023","Quilometragem":"19.200 km rodados","Câmbio":"Automático Steptronic 8 marchas","Motor":"2.0 TwinPower Turbo 184 cv","Tração":"Traseira RWD","Garantia":"Garantia Premium BMW + Laudo Dekra","Interior":"Couro Cognac com Costuras M Sport"}'::jsonb, ARRAY['/demos/cars/bmw-320i.png']::TEXT[], 3
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '22222222-2222-2222-2222-222222222222', 'Honda Civic Touring 1.5 Turbo 2021', NULL, NULL,
  139900, 3290, 60,
  'Revisões na Concessionária', 1, true, false,
  '{"Ano":"2021/2021","Quilometragem":"42.000 km rodados","Câmbio":"Automático CVT com Paddle Shift","Motor":"1.5 Turbo 173 cv","Combustível":"Gasolina","Garantia":"1 Ano Motor e Câmbio","Destaque":"Teto solar elétrico e som premium 450W"}'::jsonb, ARRAY['/demos/cars/civic.png']::TEXT[], 4
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '22222222-2222-2222-2222-222222222222', 'Toyota Hilux SRX 2.8 4x4 Turbo Diesel 2023', NULL, NULL,
  289900, 6700, 60,
  'Diesel 4x4 • Impecável', 1, true, true,
  '{"Ano":"2023/2023","Quilometragem":"31.000 km rodados","Câmbio":"Automático de 6 velocidades","Motor":"2.8 Turbo Diesel 204 cv e 50,9 kgfm","Tração":"4x4 com Reduzida e Bloqueio Diferencial","Garantia":"Garantia de Fábrica Toyota","Acessórios":"Capota marítima e santo antônio integrados"}'::jsonb, ARRAY['/demos/cars/hilux.png']::TEXT[], 5
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '33333333-3333-3333-3333-333333333333', 'Formação Gestor de Tráfego Pro (Meta Ads & Google Ads)', NULL, NULL,
  497, 49.7, 12,
  '🔥 Mais Vendido (+3.800 alunos)', 999, true, true,
  '{"Acesso":"Vitalício com Atualizações 2026","Carga Horária":"80 horas de aulas práticas passo a passo","Certificado":"Incluso com emissão instantânea","Bônus":"Pack com 250 criativos de alta conversão","Comunidade":"Grupo VIP no Discord com networking"}'::jsonb, ARRAY['/demos/digital/trafego-pro.png']::TEXT[], 1
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '33333333-3333-3333-3333-333333333333', 'Pack Notion Ultimate Business OS 2.0', NULL, NULL,
  97, 9.7, 12,
  '⚡ Acesso Imediato', 999, true, true,
  '{"Compatibilidade":"Notion Free e Notion Plus","Módulos":"CRM, Financeiro DRE, Projetos Kanban e Metas","Aulas":"15 tutoriais rápidos de customização","Atualizações":"Gratuitas para sempre","Entrega":"Link de duplicação automática 1 clique"}'::jsonb, ARRAY['/demos/digital/notion-os.png']::TEXT[], 2
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '33333333-3333-3333-3333-333333333333', 'Agente IA para WhatsApp com n8n & OpenAI GPT-4o', NULL, NULL,
  297, 29.7, 12,
  '🚀 Código Pronto para Usar', 999, true, true,
  '{"Tecnologia":"Workflows n8n + API OpenAI GPT-4o","Integrações":"WhatsApp Webhooks + Supabase / PostgreSQL","Instalação":"Vídeo-aula de 45 minutos passo a passo","Economia":"Sem taxas mensais de plataformas terceiras","Suporte":"Suporte técnico tira-dúvidas por 60 dias"}'::jsonb, ARRAY['/demos/digital/ia-whatsapp.png']::TEXT[], 3
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '33333333-3333-3333-3333-333333333333', 'Mentoria Individual Escala 100k (Vagas Limitadas)', NULL, NULL,
  3500, 350, 12,
  '💎 Apenas 5 Vagas/Mês', 3, true, true,
  '{"Formato":"4 encontros individuais 1:1 de 1h30 via Google Meet","Acompanhamento":"Canal privativo no WhatsApp direto com o mentor","Diagnóstico":"Auditoria completa de funil, tráfego e conversão","Materiais":"Playbooks operacionais e gravações em 4K"}'::jsonb, ARRAY['/demos/digital/mentoria-100k.png']::TEXT[], 4
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '33333333-3333-3333-3333-333333333333', 'Copywriting de Alta Conversão para VSLs e Ofertas', NULL, NULL,
  197, 19.7, 12,
  '📚 Guia Definitivo + Frameworks', 999, true, false,
  '{"Conteúdo":"6 módulos práticos com roteiros prontos","Gatilhos":"37 gatilhos mentais aplicados a vendas online","Estudos":"Dissecação de 10 VSLs que faturaram múltiplos 7 dígitos","Acesso":"2 anos de acesso completo na plataforma"}'::jsonb, ARRAY['/demos/digital/copywriting.png']::TEXT[], 5
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '44444444-4444-4444-4444-444444444444', 'Camiseta Heavyweight Oversized Black Vintage', NULL, NULL,
  149, 49.66, 3,
  'Algodão Peruano 280g', 18, true, true,
  '{"Modelagem":"Oversized Boxy Americana com caimento impecável","Composição":"100% Algodão Penteado Heavyweight 280g/m²","Gola":"Ribana Canelada 3cm anti-esgarçamento","Lavagem":"Estonado Vintage com toque aveludado peletizado","Tamanhos":"Disponível do P ao XGG"}'::jsonb, ARRAY['/demos/fashion/camiseta-oversized.png']::TEXT[], 1
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '44444444-4444-4444-4444-444444444444', 'Moletom Canguru 400g Drop Shadow Acid Wash', NULL, NULL,
  299, 49.83, 6,
  '🔥 Drop Limitado (50 peças)', 9, true, true,
  '{"Gramatura":"400g/m² Extra Pesado e Estruturado","Interior":"Flanelado Térmico Ultra Macio e Acolhedor","Capuz":"Duplo com cordão em algodão cru e ponteiras de metal","Costuras":"Pesponto reforçado nas cavas e punhos 2x1"}'::jsonb, ARRAY['/demos/fashion/moletom-acid.png']::TEXT[], 2
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '44444444-4444-4444-4444-444444444444', 'Calça Cargo Tática Multi-Bolsos Preto Grafite', NULL, NULL,
  249, 49.8, 5,
  'Tecido Ripstop Militar', 14, true, true,
  '{"Tecido":"Ripstop Militar 65% Algodão 35% Poliéster anti-rasgo","Bolsos":"6 bolsos táticos com fechamento em velcro e zíper","Ajuste":"Cós elástico com passador para cinto + cordão regulador no tornozelo"}'::jsonb, ARRAY['/demos/fashion/calca-cargo.png']::TEXT[], 3
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '44444444-4444-4444-4444-444444444444', 'Jaqueta Windbreaker Reflexiva Corta-Vento', NULL, NULL,
  279, 55.8, 5,
  'Repelente à Água (DWR)', 8, true, false,
  '{"Material":"Nylon Taslan resinado com forro interno respirável","Segurança":"Faixas reflexivas 3M de alta visibilidade noturna","Zíperes":"Zíperes YKK emborrachados selados contra vento e chuva"}'::jsonb, ARRAY['/demos/fashion/corta-vento.png']::TEXT[], 4
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '44444444-4444-4444-4444-444444444444', 'Boné Dad Hat Vintage Bordado Monogram', NULL, NULL,
  99, 49.5, 2,
  'Fivela de Metal Personalizada', 25, true, false,
  '{"Formato":"Dad Hat desestruturado com 6 gomos","Tecido":"Sarja 100% Algodão Premium pré-lavada","Fecho":"Fivela metálica envelhecida com regulagem em tecido"}'::jsonb, ARRAY['/demos/fashion/bone-vintage.png']::TEXT[], 5
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '55555555-5555-5555-5555-555555555555', 'Burger Grand Bacon Cheddar Bomb', NULL, NULL,
  42, 42, 1,
  '🏆 O Mais Premiado', 50, true, true,
  '{"Pão":"Brioche selado na manteiga de garrafa","Carne":"Blend 100% Angus 180g assado na brasa de carvão","Queijo":"Creme de cheddar artesanal fundido na cerveja IPA","Bacon":"Fatias fartas de bacon defumado por 12h na lenha de macieira","Molho":"Geleia de pimenta defumada artesanal da casa"}'::jsonb, ARRAY['/demos/food/burger-bacon.png']::TEXT[], 1
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '55555555-5555-5555-5555-555555555555', 'Truffle & Brie Prime Burger', NULL, NULL,
  48, 48, 1,
  '⭐ Toque Trufado Exclusivo', 35, true, true,
  '{"Pão":"Brioche com gergelim negro tostado","Carne":"Blend Angus 180g suculento ao ponto da casa","Queijo":"Fatia generosa de Queijo Brie maçaricado","Complementos":"Cebola caramelizada no balsâmico e maionese trufada"}'::jsonb, ARRAY['/demos/food/burger-truffle.png']::TEXT[], 2
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '55555555-5555-5555-5555-555555555555', 'Oklahoma Double Smash Cheese', NULL, NULL,
  34, 34, 1,
  '🔥 Crostinha Perfeita', 60, true, true,
  '{"Pão":"Pão de batata artesanal ultra macio","Carne":"2x Smash 90g prensados com cebola roxa fininha na chapa quente","Queijo":"Queijo prato cremoso duplo derretido","Molho":"Picles artesanal crocante de pepino e molho secreto Craft"}'::jsonb, ARRAY['/demos/food/burger-smash.png']::TEXT[], 3
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '55555555-5555-5555-5555-555555555555', 'Batatas Rústicas com Alecrim & Maionese de Alho Negro', NULL, NULL,
  26, 26, 1,
  'Porção Farta 400g', 80, true, true,
  '{"Batatas":"Cortadas à mão com casca, duplamente fritas crocantes","Tempero":"Flor de sal e ramos de alecrim fresco da horta","Acompanhamento":"Potinho de 100ml de maionese artesanal de alho negro"}'::jsonb, ARRAY['/demos/food/batata-rustica.png']::TEXT[], 4
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '55555555-5555-5555-5555-555555555555', 'Milkshake de Doce de Leite com Flor de Sal 500ml', NULL, NULL,
  22, 22, 1,
  'Sorvete Artesanal 500ml', 40, true, false,
  '{"Sorvete":"Sorvete artesanal cremoso de fava de baunilha","Calda":"Doce de leite mineiro legítimo cozido na panela","Topo":"Chantilly batido na hora com pitada de flor de sal marinho"}'::jsonb, ARRAY['/demos/food/milkshake.png']::TEXT[], 5
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '66666666-6666-6666-6666-666666666666', 'Casa Contemporânea em Condomínio Fechado (Mansões)', NULL, NULL,
  4850000, 34500, 240,
  '🔑 Pronta para Morar • 4 Suítes', 1, true, true,
  '{"Área Construída":"540 m² de área útil privativa","Terreno":"720 m² com paisagismo Burle Marx","Quartos":"4 Suítes completas com closet e hidromassagem","Vagas":"4 vagas cobertas + 4 descobertas","Lazer":"Piscina aquecida de borda infinita, sauna a vapor e espaço gourmet","Condomínio":"Segurança armada 24h, quadras de tênis de saibro e heliponto"}'::jsonb, ARRAY['/demos/realestate/casa-condominio.png']::TEXT[], 1
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '66666666-6666-6666-6666-666666666666', 'Cobertura Linear com Vista Panorâmica para o Mar', NULL, NULL,
  3200000, 32000, 120,
  '🌊 Vista Livre Definitiva', 1, true, true,
  '{"Área Privativa":"380 m² com circulação 360 graus","Quartos":"3 Suítes climatizadas com varandas privativas","Vagas":"3 vagas de garagem demarcadas e soltas","Terraço":"Deck em cumaru com jacuzzi para 6 pessoas e churrasqueira","Edifício":"Portaria blindada 24h e prédio com apenas 2 unidades por andar"}'::jsonb, ARRAY['/demos/realestate/cobertura-mar.png']::TEXT[], 2
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '66666666-6666-6666-6666-666666666666', 'Apartamento Alto Padrão 3 Quartos Totalmente Mobiliado', NULL, NULL,
  1650000, 12800, 360,
  '✨ Mobiliado e Decorado', 1, true, true,
  '{"Área Útil":"145 m² com projeto assinado por arquiteto","Quartos":"3 Quartos com armários planejados (1 Suíte Master)","Varanda":"Varanda gourmet integrada com cortina de vidro e churrasqueira","Vagas":"2 vagas cobertas na escritura","Acabamento":"Piso em porcelanato 120x120 e automação de iluminação"}'::jsonb, ARRAY['/demos/realestate/apartamento-decorado.png']::TEXT[], 3
);
INSERT INTO public.products (
  profile_id, name, slug, description, price, price_installments, installments_count,
  badge, quantity, is_available, is_featured, specs, images, sort_order
) VALUES (
  '66666666-6666-6666-6666-666666666666', 'Mansão Neoclássica com Vista para as Montanhas', NULL, NULL,
  7900000, 65000, 120,
  '👑 Terreno de 2.500m²', 1, true, true,
  '{"Área Construída":"880 m² com pé-direito duplo de 7 metros","Terreno":"2.500 m² cercado por mata nativa preservada","Quartos":"5 Suítes com closet e sacadas voltadas para o bosque","Vagas":"8 vagas para veículos de porte grande","Lazer Privativo":"Quadra de beach tennis privativa, adega subterrânea e cinema 4K"}'::jsonb, ARRAY['/demos/realestate/mansao-neoclassica.png']::TEXT[], 4
);

-- 5. Inserir Avaliações
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('11111111-1111-1111-1111-111111111111', 'Fernanda Lima', 'Agriões, Teresópolis', 5, 'Comprei pelo WhatsApp e em menos de 1h30 o aparelho estava aqui. Paguei no cartão na entrega. Nota 10!', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('11111111-1111-1111-1111-111111111111', 'Ricardo Santos', 'Alto, Teresópolis', 5, 'Fui retirar na loja parceira SejaDelta. Ambiente super seguro, equipe atenciosa, conferi tudo na hora.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('11111111-1111-1111-1111-111111111111', 'Bruno Ferreira', 'Várzea, Teresópolis', 5, 'Fiz a troca inteligente do meu iPhone 11 pelo 14 Pro com facilidade. Muito honestos e transparentes.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('11111111-1111-1111-1111-111111111111', 'Beatriz Lopes', 'Comary, Teresópolis', 5, 'A Terephones entregou na minha porta no mesmo dia. Atendimento impecável!', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('22222222-2222-2222-2222-222222222222', 'Rodrigo Alcântara', 'Barra da Tijuca, RJ', 5, 'Comprei meu Corolla Cross na Prime Motors. Atendimento impecável, carro entregue polido e revisado no mesmo dia. Recomendo de olhos fechados!', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('22222222-2222-2222-2222-222222222222', 'Camila Nogueira', 'Recreio, RJ', 5, 'Avaliaram meu seminovo na troca com valor justo e sem enrolação. A documentação saiu em menos de 48 horas!', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('22222222-2222-2222-2222-222222222222', 'Marcelo Bastos', 'Leblon, RJ', 5, 'A BMW 320i veio com laudo cautelar 100% aprovado. Transparência nota 10!', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('33333333-3333-3333-3333-333333333333', 'Gabriel Vasconcelos', 'São Paulo, SP', 5, 'A Formação Gestor de Tráfego mudou o jogo da minha agência. Triplicamos o faturamento em 3 meses com os criativos prontos.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('33333333-3333-3333-3333-333333333333', 'Juliana Matos', 'Belo Horizonte, MG', 5, 'O template de Notion é o mais completo que já vi. Minha equipe inteira usa todos os dias para organizar as demandas.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('33333333-3333-3333-3333-333333333333', 'Lucas Pinheiro', 'Curitiba, PR', 5, 'Implementei o agente de IA no WhatsApp da minha empresa e automatizei 80% do primeiro atendimento. Valeu cada centavo!', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('44444444-4444-4444-4444-444444444444', 'Matheus Rocha', 'Pinheiros, SP', 5, 'A qualidade da camiseta oversized é absurda! Tecido grosso de verdade, não encolheu nada na máquina e o caimento é perfeito.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('44444444-4444-4444-4444-444444444444', 'Thiago Mendes', 'Campinas, SP', 5, 'O moletom 400g é uma armadura de tão quente e confortável. Chegou em 2 dias aqui no interior de SP.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('44444444-4444-4444-4444-444444444444', 'Larissa Prado', 'Jardins, SP', 5, 'Comprei a calça cargo e serviu como uma luva. Atendimento no WhatsApp super atencioso para tirar dúvidas de tamanho.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('55555555-5555-5555-5555-555555555555', 'Guilherme Azevedo', 'Laranjeiras, RJ', 5, 'Simplesmente o melhor burger do Rio! O bacon defumado na casa é inacreditável de tão crocante e o pão chega fofinho.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('55555555-5555-5555-5555-555555555555', 'Priscila Duarte', 'Flamengo, RJ', 5, 'O Grand Bacon Cheddar veio quentinho na embalagem térmica em menos de 30 minutos. Virei cliente fiel!', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('55555555-5555-5555-5555-555555555555', 'Daniel Fonseca', 'Botafogo, RJ', 5, 'A batata rústica com a maionese de alho negro é viciante. Pedi no WhatsApp e foi tudo super rápido.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('66666666-6666-6666-6666-666666666666', 'Dr. Roberto Silveira', 'Barra da Tijuca, RJ', 5, 'A equipe da Alpha Imóveis conduziu a compra da nossa casa em condomínio com extrema discrição e segurança jurídica impecável.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('66666666-6666-6666-6666-666666666666', 'Patrícia Valença', 'Joá, RJ', 5, 'Corretores muito preparados que realmente entendem o padrão de imóveis de luxo. A visita guiada tirou todas as dúvidas.', true);
INSERT INTO public.store_reviews (profile_id, author_name, neighborhood, rating, comment, is_visible)
VALUES ('66666666-6666-6666-6666-666666666666', 'Henrique Brandão', 'São Conrado, RJ', 5, 'Aprovaram nossa simulação bancária com taxa diferenciada em menos de 24 horas. Experiência de compra maravilhosa!', true);
