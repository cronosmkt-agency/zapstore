// ============================================================
// MOCK DATABASE — localStorage + seedData em memória
// Simula Supabase para desenvolvimento local.
// Em produção: substituir chamadas por @supabase/supabase-js.
// ============================================================

import type {
  Profile, StoreSettings, Product, ProductCategory,
  StoreReview, Plan, Subscription, ActivityLog, PlanSlug
} from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

// ─── Seed data ────────────────────────────────────────────────
// IDs fixos para o demo
const ADMIN_ID        = 'admin-001';
const TEREPHONES_ID   = 'terephones-001';
const MOTORS_ID       = 'motors-001';
const DIGITAL_ID      = 'digital-001';
const MODA_ID         = 'moda-001';
const BURGER_ID       = 'burger-001';
const IMOVEIS_ID      = 'imoveis-001';
const DEMO_ID         = 'demo-001';

export const SEED_PROFILES: Profile[] = [
  {
    id: ADMIN_ID,
    slug: 'admin',
    display_name: 'Administrador ZapStore',
    email: 'admin@cronos.com',
    plan: 'pro',
    is_active: true,
    is_admin: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: TEREPHONES_ID,
    slug: 'terephones',
    display_name: 'Terephones (Celulares)',
    email: 'terephones@example.com',
    whatsapp: '5521964639999',
    plan: 'pro',
    plan_expires_at: '2027-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: MOTORS_ID,
    slug: 'prime-motors',
    display_name: 'Prime Motors (Carros & Veículos)',
    email: 'motors@example.com',
    whatsapp: '5521999991111',
    plan: 'pro',
    plan_expires_at: '2027-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: DIGITAL_ID,
    slug: 'nexus-digital',
    display_name: 'Nexus Digital (Cursos & Infoprodutos)',
    email: 'nexus@example.com',
    whatsapp: '5521999992222',
    plan: 'pro',
    plan_expires_at: '2027-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: MODA_ID,
    slug: 'aura-store',
    display_name: 'Aura Store (Moda & Streetwear)',
    email: 'aura@example.com',
    whatsapp: '5521999993333',
    plan: 'starter',
    plan_expires_at: '2027-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: BURGER_ID,
    slug: 'craft-burger',
    display_name: 'Craft Burger (Gastronomia & Delivery)',
    email: 'burger@example.com',
    whatsapp: '5521999994444',
    plan: 'starter',
    plan_expires_at: '2027-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-03-10T00:00:00Z',
  },
  {
    id: IMOVEIS_ID,
    slug: 'alpha-imoveis',
    display_name: 'Alpha Imóveis (Imobiliária)',
    email: 'imoveis@example.com',
    whatsapp: '5521999995555',
    plan: 'pro',
    plan_expires_at: '2027-01-01T00:00:00Z',
    is_active: true,
    created_at: '2026-03-20T00:00:00Z',
  },
  {
    id: DEMO_ID,
    slug: 'demo',
    display_name: 'Loja Demo Geral',
    email: 'demo@example.com',
    plan: 'free',
    is_active: true,
    created_at: '2026-09-01T00:00:00Z',
  },
];

const SEED_PASSWORDS: Record<string, string> = {
  // Super Admin
  'admin@cronos.com': 'admin123',
  'admin@zapstore.com': 'admin123',
  // Terephones
  'terephones@example.com': 'tere123',
  'terephones@zapstore.com': 'tere123',
  // Prime Motors
  'motors@example.com': 'motors123',
  'motors@zapstore.com': 'motors123',
  'motor@example.com': 'motors123',
  'motor@zapstore.com': 'motors123',
  // Nexus Digital
  'nexus@example.com': 'digital123',
  'nexus@zapstore.com': 'digital123',
  'digital@example.com': 'digital123',
  'digital@zapstore.com': 'digital123',
  // Aura Store
  'aura@example.com': 'moda123',
  'aura@zapstore.com': 'moda123',
  'moda@example.com': 'moda123',
  'moda@zapstore.com': 'moda123',
  // Craft Burger
  'burger@example.com': 'burger123',
  'burger@zapstore.com': 'burger123',
  // Alpha Imóveis
  'imoveis@example.com': 'imoveis123',
  'imoveis@zapstore.com': 'imoveis123',
  'imovel@example.com': 'imoveis123',
  'imovel@zapstore.com': 'imoveis123',
  // Demo Geral
  'demo@example.com': 'demo123',
  'demo@zapstore.com': 'demo123',
};

const COMMON_DIFFERENTIALS = [
  { icon: '🚚', title: 'Entrega Express em 1h', description: 'Seu iPhone na porta em qualquer bairro de Teresópolis' },
  { icon: '🏪', title: 'Ponto Físico SejaDelta', description: 'Veja, teste e retire presencialmente no centro' },
  { icon: '🛡️', title: '1 Ano de Garantia Apple', description: 'Lacrados com garantia mundial + 90 dias em seminovos' },
  { icon: '💳', title: 'Pague só na Entrega', description: 'Zero risco: confira antes de pagar' },
];

export const SEED_STORE_SETTINGS: StoreSettings[] = [
  {
    id: 'ss-tere-001',
    profile_id: TEREPHONES_ID,
    store_name: 'Terephones',
    store_tagline: 'iPhones Novos & Seminovos em Teresópolis',
    logo_url: 'https://ik.imagekit.io/zinma/tr:w-300,f-auto,q-85/TerePhones-Logo.png',
    whatsapp: '5521964639999',
    phone_display: '(21) 96463-9999',
    address: 'Loja Parceira SejaDelta — Centro de Teresópolis',
    city: 'Teresópolis',
    state: 'RJ',
    business_hours: 'Seg a Sab: 10h às 18h',
    custom_domain_verified: false,
    theme_mode: 'white',
    primary_color: '#2563eb',
    accent_color: '#0ea5e9',
    font_family: 'Inter',
    meta_title: 'Terephones — iPhones Novos & Seminovos em Teresópolis',
    meta_description: 'iPhones novos e seminovos em Teresópolis/RJ. Entrega Express em até 1h. Garantia de até 1 ano.',
    og_image_url: 'https://ik.imagekit.io/zinma/tr:w-1200,f-auto,q-85/TerePhones-Logo.png',
    enable_tawk: true,
    tawk_widget_id: '6aac00529d89af3444bee888/1k2o8b0j4',
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    hero_title: 'O seu novo iPhone,\nna sua mão hoje.',
    hero_subtitle: 'Entrega Express em até 1 hora na sua porta ou Retirada presencial na loja parceira SejaDelta. Aparelhos revisados com até 1 ano de garantia Apple e pagamento somente na entrega! 🍎⚡',
    cta_button_text: 'Ver Catálogo na Loja',
    header_show_announcement: true,
    header_announcement_text: '⚡ Entrega Express em até 1 hora em Teresópolis/RJ • Pagamento na entrega!',
    header_cta_text: 'Falar no WhatsApp',
    header_show_whatsapp_button: true,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Catálogo de iPhones',
    footer_about_text: 'Sua loja de confiança para iPhones novos e seminovos em Teresópolis e Região Serrana. Aparelhos revisados com até 1 ano de garantia Apple e entrega express imediata.',
    footer_show_navigation: true,
    footer_nav_title: 'Navegação',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Catálogo de iPhones',
    footer_show_tradein_link: true,
    footer_tradein_label: 'Troca com Troco (Trade-in)',
    footer_show_delivery_link: true,
    footer_delivery_label: 'Entrega Express em 1h',
    footer_show_location_link: true,
    footer_location_label: 'Ponto Físico SejaDelta',
    footer_show_institutional: true,
    footer_inst_title: 'Institucional',
    footer_about_link_label: 'Sobre a Terephones',
    footer_warranty_link_label: 'Termos de Garantia',
    footer_show_contact: true,
    footer_contact_title: 'Atendimento',
    footer_custom_copyright: '© 2026 Terephones. Todos os direitos reservados.',
    whatsapp_message_template: 'Olá, equipe {store_name}! Gostaria de pedir:\n\n📱 *Aparelho:* {nome}\n💰 *Valor:* {preco}\n💾 *Capacidade:* {storage}\n✨ *Condição:* {condition}\n\nGostaria de confirmar disponibilidade!',
    differentials: COMMON_DIFFERENTIALS,
    instagram_url: 'https://instagram.com/terephones',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'ss-mot-001',
    profile_id: MOTORS_ID,
    store_name: 'Prime Motors',
    store_tagline: 'Veículos Seminovos Selecionados & Procedência Periciada',
    logo_url: '/demos/logos/prime-motors.png',
    favicon_url: '/demos/logos/prime-motors.png',
    whatsapp: '5521999991111',
    phone_display: '(21) 99999-1111',
    address: 'Av. das Américas, 4200 — Barra da Tijuca, Rio de Janeiro - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    business_hours: 'Seg a Sáb: 09h às 19h',
    custom_domain_verified: false,
    theme_mode: 'white',
    primary_color: '#0284c7',
    accent_color: '#38bdf8',
    font_family: 'Inter',
    meta_title: 'Prime Motors — Veículos Seminovos de Procedência no RJ',
    meta_description: 'Seminovos criteriosamente periciados com laudo cautelar 100% aprovado, garantia de 1 ano e financiamento em até 60x.',
    og_image_url: '/demos/logos/prime-motors.png',
    enable_tawk: false,
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    enable_tradein: false,
    enable_physical_location: true,
    location_badge: 'Showroom Presencial',
    location_title: 'Mega Showroom Prime Motors na Barra da Tijuca',
    location_desc: 'Venha tomar um café conosco, testar o carro na pista e sair de carro novo no mesmo dia com financiamento aprovado na hora.',
    hero_title: 'O seu próximo carro está aqui.\nProcedência & Financiamento Fácil.',
    hero_subtitle: 'Seminovos criteriosamente periciados com laudo cautelar 100% aprovado, até 1 ano de garantia de motor e câmbio, e financiamento facilitado com as melhores taxas do mercado. 🚗⚡',
    cta_button_text: 'Ver Estoque de Veículos',
    header_show_announcement: true,
    header_announcement_text: '🚗 Taxas especiais de financiamento neste mês • Entrada facilitada no cartão',
    header_cta_text: 'Consultar Financiamento',
    header_show_whatsapp_button: true,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Estoque de Veículos',
    footer_about_text: 'Concessionária boutique especializada em veículos seminovos criteriosamente periciados, com laudo cautelar 100% aprovado, procedência garantida e financiamento facilitado.',
    footer_show_navigation: true,
    footer_nav_title: 'Showroom',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Ver Estoque de Veículos',
    footer_show_tradein_link: false,
    footer_show_delivery_link: true,
    footer_delivery_label: 'Entrega em Guincho Fechado',
    footer_show_location_link: true,
    footer_location_label: 'Mega Showroom Barra da Tijuca',
    footer_show_institutional: true,
    footer_inst_title: 'Transparência',
    footer_about_link_label: 'Sobre a Prime Motors',
    footer_warranty_link_label: 'Garantia & Laudo Cautelar',
    footer_show_contact: true,
    footer_contact_title: 'Atendimento VIP',
    footer_custom_copyright: '© 2026 Prime Motors. Todos os direitos reservados.',
    whatsapp_message_template: 'Olá, equipe Prime Motors! Gostaria de mais informações sobre este veículo que vi no site:\n\n🚗 *Veículo:* {nome}\n💰 *Valor:* {preco}\n\nGostaria de simular um financiamento ou agendar um test drive!',
    differentials: [
      { icon: '🛡️', title: 'Laudo Cautelar 100% Aprovado', description: 'Zero leilão, sem batidas estruturais e histórico periciado em órgão oficial' },
      { icon: '🚗', title: 'Financiamento em até 60x', description: 'Parceria com os principais bancos para aprovação rápida na hora com as menores taxas' },
      { icon: '🔄', title: 'Aceitamos seu Usado na Troca', description: 'Melhor avaliação do mercado para seu carro ou moto com opção de troco na troca' },
      { icon: '⭐', title: '1 Ano de Garantia Completa', description: 'Garantia de motor, câmbio e assistência 24 horas em todo o território nacional' },
    ],
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'ss-dig-001',
    profile_id: DIGITAL_ID,
    store_name: 'Nexus Digital',
    store_tagline: 'Cursos, Ferramentas & Mentorias de Alta Performance',
    logo_url: '/demos/logos/nexus-digital.png',
    favicon_url: '/demos/logos/nexus-digital.png',
    whatsapp: '5521999992222',
    phone_display: '(21) 99999-2222',
    address: 'Nexus Tech Park — Coworking Digital',
    city: 'São Paulo',
    state: 'SP',
    business_hours: 'Suporte Online 24/7',
    custom_domain_verified: false,
    theme_mode: 'black-piano',
    primary_color: '#8b5cf6',
    accent_color: '#a78bfa',
    font_family: 'Inter',
    meta_title: 'Nexus Digital — Cursos e Ferramentas para o Mercado Digital',
    meta_description: 'Acelere seus resultados no digital com formações práticas, automações com IA e mentorias de alto impacto.',
    og_image_url: '/demos/logos/nexus-digital.png',
    enable_tawk: false,
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    enable_tradein: false,
    enable_physical_location: false,
    hero_title: 'Aprenda, Escale & Domine\no Mercado Digital.',
    hero_subtitle: 'Treinamentos práticos, templates validados e mentorias de alto impacto para acelerar seu faturamento e sua carreira na internet. 🚀',
    cta_button_text: 'Explorar Cursos & Formações',
    header_show_announcement: true,
    header_announcement_text: '🚀 Acesso imediato a todas as formações e templates validados com suporte VIP',
    header_cta_text: 'Falar com Mentor',
    header_show_whatsapp_button: true,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Cursos & Formações',
    footer_about_text: 'Plataforma de aceleração e ferramentas de tecnologia para empreendedores digitais. Aulas práticas, metodologias validadas e networking exclusivo.',
    footer_show_navigation: true,
    footer_nav_title: 'Formações',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Todos os Treinamentos',
    footer_show_tradein_link: false,
    footer_show_delivery_link: true,
    footer_delivery_label: 'Acesso Imediato no E-mail',
    footer_show_location_link: false,
    footer_show_institutional: true,
    footer_inst_title: 'Segurança',
    footer_about_link_label: 'Sobre a Nexus Digital',
    footer_warranty_link_label: 'Garantia Incondicional 7 Dias',
    footer_show_contact: true,
    footer_contact_title: 'Suporte ao Aluno',
    footer_custom_copyright: '© 2026 Nexus Digital. Todos os direitos reservados.',
    whatsapp_message_template: 'Olá, equipe Nexus Digital! Gostaria de tirar dúvidas sobre este treinamento/produto:\n\n💻 *Produto:* {nome}\n💰 *Valor:* {preco}\n\nPoderia me enviar os detalhes de acesso e conteúdo programático?',
    differentials: [
      { icon: '⚡', title: 'Acesso Imediato no E-mail', description: 'Receba seus dados de acesso e links em segundos logo após a confirmação do pedido' },
      { icon: '🛡️', title: '7 Dias de Garantia Total', description: 'Garantia incondicional: se não gostar, devolvemos 100% do seu dinheiro sem perguntas' },
      { icon: '🎓', title: 'Aulas Práticas & Certificado', description: 'Conteúdo direto ao ponto sem enrolação, com certificado profissional incluso' },
      { icon: '💬', title: 'Comunidade VIP Exclusiva', description: 'Networking diário com especialistas e centenas de alunos acelerando juntos' },
    ],
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'ss-mod-001',
    profile_id: MODA_ID,
    store_name: 'Aura Store',
    store_tagline: 'Streetwear Contemporâneo & Peças Heavyweight',
    logo_url: '/demos/logos/aura-store.png',
    favicon_url: '/demos/logos/aura-store.png',
    whatsapp: '5521999993333',
    phone_display: '(21) 99999-3333',
    address: 'Rua Augusta, 1420 — Consolação, São Paulo - SP',
    city: 'São Paulo',
    state: 'SP',
    business_hours: 'Seg a Sáb: 10h às 20h',
    custom_domain_verified: false,
    theme_mode: 'black-piano',
    primary_color: '#ec4899',
    accent_color: '#f472b6',
    font_family: 'Inter',
    meta_title: 'Aura Store — Streetwear Autêntico & Roupas Oversized',
    meta_description: 'Camisetas oversized, moletons pesados 400g e calças cargo táticas com frete rápido para todo o Brasil.',
    og_image_url: '/demos/logos/aura-store.png',
    enable_tawk: false,
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    enable_tradein: false,
    enable_physical_location: true,
    location_badge: 'Flagship Store',
    location_title: 'Loja Conceito Aura na Rua Augusta',
    location_desc: 'Venha conhecer as peças de perto, provar os tamanhos oversized e sentir a textura dos tecidos heavyweight premium.',
    hero_title: 'Vista Sua Autenticidade.\nStreetwear & Moda Premium.',
    hero_subtitle: 'Modelagens oversized, tecidos pesados de altíssima qualidade e coleções limitadas feitas para quem tem personalidade. 🔥',
    cta_button_text: 'Ver Coleção Completa',
    header_show_announcement: true,
    header_announcement_text: '🔥 Frete Grátis acima de R$ 199 para todo o Brasil • Parcele em até 6x sem juros',
    header_cta_text: 'Falar com Consultor',
    header_show_whatsapp_button: true,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Coleção Streetwear',
    footer_about_text: 'Marca de moda urbana e streetwear autoral com modelagens oversized premium, tecidos heavyweight e costuras reforçadas para máxima durabilidade e estilo.',
    footer_show_navigation: true,
    footer_nav_title: 'Coleções',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Ver Coleção Completa',
    footer_show_tradein_link: false,
    footer_show_delivery_link: true,
    footer_delivery_label: 'Envio Rápido para Todo o Brasil',
    footer_show_location_link: true,
    footer_location_label: 'Flagship Store Rua Augusta',
    footer_show_institutional: true,
    footer_inst_title: 'Ajuda & Atendimento',
    footer_about_link_label: 'Manifesto Aura',
    footer_warranty_link_label: 'Política de Troca Grátis',
    footer_show_contact: true,
    footer_contact_title: 'Central de Atendimento',
    footer_custom_copyright: '© 2026 Aura Store. Todos os direitos reservados.',
    whatsapp_message_template: 'Olá, equipe Aura Store! Gostaria de pedir esta peça que vi no catálogo:\n\n👕 *Item:* {nome}\n💰 *Valor:* {preco}\n\nGostaria de confirmar a disponibilidade e prazo de frete!',
    differentials: [
      { icon: '🚚', title: 'Envio Rápido para Todo o Brasil', description: 'Frete grátis para todo o país em compras acima de R$ 199 com rastreio minuto a minuto' },
      { icon: '🔄', title: 'Primeira Troca 100% Grátis', description: 'Até 30 dias para trocar de tamanho ou modelo sem nenhum custo ou burocracia' },
      { icon: '🧵', title: 'Algodão Peruano 280g', description: 'Toque macio superior, máxima durabilidade pós-lavagem e costura ombro a ombro reforçada' },
      { icon: '💳', title: '6x Sem Juros ou 5% OFF Pix', description: 'Condições facilitadas de pagamento para você renovar seu guarda-roupa com estilo' },
    ],
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'ss-brg-001',
    profile_id: BURGER_ID,
    store_name: 'Craft Burger',
    store_tagline: 'Hambúrgueres Artesanais na Brasa & Carnes Nobres Angus',
    logo_url: '/demos/logos/craft-burger.png',
    favicon_url: '/demos/logos/craft-burger.png',
    whatsapp: '5521999994444',
    phone_display: '(21) 99999-4444',
    address: 'Rua das Laranjeiras, 350 — Laranjeiras, Rio de Janeiro - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    business_hours: 'Terça a Domingo: 18h às 23h30',
    custom_domain_verified: false,
    theme_mode: 'white',
    primary_color: '#ea580c',
    accent_color: '#f97316',
    font_family: 'Inter',
    meta_title: 'Craft Burger — Hamburgueria Artesanal na Brasa no RJ',
    meta_description: 'Blends 100% Angus, bacon defumado por 12h e molhos artesanais. Peça pelo WhatsApp e receba quentinho em até 35 min!',
    og_image_url: '/demos/logos/craft-burger.png',
    enable_tawk: false,
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    enable_tradein: false,
    enable_physical_location: true,
    location_badge: 'Hamburgueria & Bar',
    location_title: 'Espaço Gastronômico Craft Burger em Laranjeiras',
    location_desc: 'Ambiente aconchegante com chopp artesanal gelado, deck ao ar livre e os melhores hambúrgueres artesanais na brasa.',
    hero_title: 'O Verdadeiro Burger Artesanal\nFeito na Brasa.',
    hero_subtitle: 'Blends 100% Angus fresco moído diariamente, bacon defumado na casa por 12h, queijos artesanais e molhos autorais. Peça e receba quentinho! 🍔🔥',
    cta_button_text: 'Fazer Pedido no Cardápio',
    header_show_announcement: true,
    header_announcement_text: '🍔 Peça agora pelo WhatsApp e receba quentinho em até 35 minutos!',
    header_cta_text: 'Fazer Pedido no WhatsApp',
    header_show_whatsapp_button: true,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Cardápio na Brasa',
    footer_about_text: 'O verdadeiro hambúrguer artesanal assado na brasa. Blends 100% Angus fresco moídos no dia, bacon defumado na casa por 12 horas e molhos autorais.',
    footer_show_navigation: true,
    footer_nav_title: 'Cardápio',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Burgers, Smashes & Shakes',
    footer_show_tradein_link: false,
    footer_show_delivery_link: true,
    footer_delivery_label: 'Delivery Rápido em 35min',
    footer_show_location_link: true,
    footer_location_label: 'Espaço Gastronômico Laranjeiras',
    footer_show_institutional: true,
    footer_inst_title: 'Informações',
    footer_about_link_label: 'Nossa História & Blends',
    footer_warranty_link_label: 'Padrão Angus de Qualidade',
    footer_show_contact: true,
    footer_contact_title: 'Central de Pedidos',
    footer_custom_copyright: '© 2026 Craft Burger. Todos os direitos reservados.',
    whatsapp_message_template: 'Olá, equipe Craft Burger! Gostaria de fazer este pedido do cardápio:\n\n🍔 *Burger/Item:* {nome}\n💰 *Valor:* {preco}\n\nPoderia me informar o tempo de entrega para o meu endereço?',
    differentials: [
      { icon: '🍔', title: 'Blend 100% Angus Fresco', description: 'Carnes nobres moídas no dia, nunca congeladas, assadas na brasa no ponto perfeito' },
      { icon: '🛵', title: 'Delivery Rápido em 35 min', description: 'Embalagens térmicas especiais anti-umidade para o pão e o queijo chegarem perfeitos' },
      { icon: '🥓', title: 'Bacon Defumado na Casa', description: 'Defumação artesanal com lenha de macieira por 12 horas para máxima crocância' },
      { icon: '⭐', title: 'Programa de Fidelidade', description: 'Junte selos a cada pedido e troque por burgers especiais grátis' },
    ],
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'ss-imv-001',
    profile_id: IMOVEIS_ID,
    store_name: 'Alpha Imóveis',
    store_tagline: 'Imóveis de Alto Padrão, Coberturas & Condomínios Fechados',
    logo_url: '/demos/logos/alpha-imoveis.png',
    favicon_url: '/demos/logos/alpha-imoveis.png',
    whatsapp: '5521999995555',
    phone_display: '(21) 99999-5555',
    address: 'Av. Lúcio Costa, 3100 — Barra da Tijuca, Rio de Janeiro - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    business_hours: 'Seg a Sáb: 08h às 20h | Dom com agendamento',
    custom_domain_verified: false,
    theme_mode: 'white',
    primary_color: '#0f766e',
    accent_color: '#14b8a6',
    font_family: 'Inter',
    meta_title: 'Alpha Imóveis — Casas em Condomínio e Coberturas de Alto Padrão',
    meta_description: 'Portfólio exclusivo de imóveis de luxo no Rio de Janeiro. Assessoria jurídica completa e agendamento de visita VIP.',
    og_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    enable_tawk: false,
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    enable_tradein: false,
    enable_physical_location: true,
    location_badge: 'Escritório Imobiliário',
    location_title: 'Sede Alpha Imóveis na Orla da Barra',
    location_desc: 'Reuniões com assessoria jurídica privativa, simulação bancária imediata e atendimento VIP com corretores credenciados.',
    hero_title: 'Os Melhores Imóveis\nde Alto Padrão da Região.',
    hero_subtitle: 'Casas em condomínios fechados, coberturas exclusivas e apartamentos de luxo com assessoria jurídica e atendimento personalizado. 🏡🔑',
    cta_button_text: 'Ver Imóveis Disponíveis',
    header_show_announcement: true,
    header_announcement_text: '🏡 Atendimento privativo com corretores credenciados e assessoria jurídica completa',
    header_cta_text: 'Agendar Visita VIP',
    header_show_whatsapp_button: true,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Portfólio de Imóveis',
    footer_about_text: 'Imobiliária de alto padrão focada em casas em condomínios fechados, coberturas lineares e mansões exclusivas na Barra da Tijuca e Zona Sul.',
    footer_show_navigation: true,
    footer_nav_title: 'Portfólio',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Ver Imóveis Disponíveis',
    footer_show_tradein_link: false,
    footer_show_delivery_link: true,
    footer_delivery_label: 'Agendamento de Visita Técnica',
    footer_show_location_link: true,
    footer_location_label: 'Sede Alpha na Orla da Barra',
    footer_show_institutional: true,
    footer_inst_title: 'Segurança Jurídica',
    footer_about_link_label: 'Sobre a Alpha Imóveis',
    footer_warranty_link_label: 'Assessoria & Certidões',
    footer_show_contact: true,
    footer_contact_title: 'Atendimento Exclusivo',
    footer_custom_copyright: '© 2026 Alpha Imóveis. Todos os direitos reservados.',
    whatsapp_message_template: 'Olá, equipe Alpha Imóveis! Gostaria de mais informações sobre este imóvel do portfólio:\n\n🏡 *Imóvel:* {nome}\n💰 *Valor:* {preco}\n\nGostaria de agendar uma visita guiada com o corretor!',
    differentials: [
      { icon: '🏡', title: 'Assessoria Jurídica Completa', description: 'Segurança jurídica total do contrato de compra e venda à lavratura da escritura' },
      { icon: '🔑', title: 'Visitas Guiadas Exclusivas', description: 'Corretores seniores credenciados para uma visita técnica detalhada no imóvel' },
      { icon: '🏦', title: 'Simulação Bancária Express', description: 'Parceria com todos os bancos para aprovar as menores taxas de juros do mercado' },
      { icon: '📸', title: 'Fotos em Alta & Tour em Vídeo 4K', description: 'Conheça cada cômodo em detalhes antes mesmo de agendar a visita presencial' },
    ],
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'ss-demo-001',
    profile_id: DEMO_ID,
    store_name: 'Loja Demo Geral',
    store_tagline: 'Os melhores produtos para você',
    custom_domain_verified: false,
    theme_mode: 'white',
    primary_color: '#7c3aed',
    accent_color: '#a78bfa',
    font_family: 'Inter',
    enable_tawk: false,
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    cta_button_text: 'Ver Loja',
    header_show_announcement: false,
    header_cta_text: 'Falar no WhatsApp',
    header_show_whatsapp_button: true,
    header_nav_home_label: 'Início',
    header_nav_catalog_label: 'Catálogo',
    footer_about_text: 'Sua vitrine online completa para vender diretamente pelo WhatsApp com praticidade e elegância.',
    footer_show_navigation: true,
    footer_nav_title: 'Navegação',
    footer_nav_home_label: 'Início',
    footer_catalog_link_label: 'Catálogo de Produtos',
    footer_show_tradein_link: false,
    footer_show_delivery_link: true,
    footer_delivery_label: 'Entrega Segura',
    footer_show_location_link: false,
    footer_show_institutional: true,
    footer_inst_title: 'Institucional',
    footer_about_link_label: 'Sobre a Loja',
    footer_warranty_link_label: 'Termos & Garantia',
    footer_show_contact: true,
    footer_contact_title: 'Atendimento',
    footer_custom_copyright: '© 2026 ZapStore. Todos os direitos reservados.',
    differentials: COMMON_DIFFERENTIALS,
    updated_at: '2026-09-01T00:00:00Z',
  },
];

export const SEED_CATEGORIES: ProductCategory[] = [
  // Terephones (Loja Modelo Celulares)
  { id: 'cat-tere-2', profile_id: TEREPHONES_ID, name: 'Lacrados', slug: 'lacrados', sort_order: 1, created_at: '2026-01-15T00:00:00Z' },
  { id: 'cat-tere-3', profile_id: TEREPHONES_ID, name: 'Seminovos', slug: 'seminovos', sort_order: 2, created_at: '2026-01-15T00:00:00Z' },
  { id: 'cat-tere-4', profile_id: TEREPHONES_ID, name: 'Acessórios', slug: 'acessorios', sort_order: 3, created_at: '2026-01-15T00:00:00Z' },

  // Prime Motors (Carros & Veículos)
  { id: 'cat-mot-1', profile_id: MOTORS_ID, name: 'SUVs', slug: 'suvs', sort_order: 1, created_at: '2026-02-01T00:00:00Z' },
  { id: 'cat-mot-2', profile_id: MOTORS_ID, name: 'Sedans Premium', slug: 'sedans-premium', sort_order: 2, created_at: '2026-02-01T00:00:00Z' },
  { id: 'cat-mot-3', profile_id: MOTORS_ID, name: 'Hatches Compactos', slug: 'hatches-compactos', sort_order: 3, created_at: '2026-02-01T00:00:00Z' },
  { id: 'cat-mot-4', profile_id: MOTORS_ID, name: 'Pickups & 4x4', slug: 'pickups-4x4', sort_order: 4, created_at: '2026-02-01T00:00:00Z' },

  // Nexus Digital (Infoprodutos & Cursos)
  { id: 'cat-dig-1', profile_id: DIGITAL_ID, name: 'Cursos & Formações', slug: 'cursos-formacoes', sort_order: 1, created_at: '2026-02-15T00:00:00Z' },
  { id: 'cat-dig-2', profile_id: DIGITAL_ID, name: 'Templates & Dashboards', slug: 'templates-dashboards', sort_order: 2, created_at: '2026-02-15T00:00:00Z' },
  { id: 'cat-dig-3', profile_id: DIGITAL_ID, name: 'Automações & IA', slug: 'automacoes-ia', sort_order: 3, created_at: '2026-02-15T00:00:00Z' },
  { id: 'cat-dig-4', profile_id: DIGITAL_ID, name: 'Mentorias VIP', slug: 'mentorias-vip', sort_order: 4, created_at: '2026-02-15T00:00:00Z' },

  // Aura Streetwear (Moda & Roupas)
  { id: 'cat-mod-1', profile_id: MODA_ID, name: 'Camisetas Oversized', slug: 'camisetas-oversized', sort_order: 1, created_at: '2026-03-01T00:00:00Z' },
  { id: 'cat-mod-2', profile_id: MODA_ID, name: 'Moletons & Jaquetas', slug: 'moletons-jaquetas', sort_order: 2, created_at: '2026-03-01T00:00:00Z' },
  { id: 'cat-mod-3', profile_id: MODA_ID, name: 'Calças Cargo', slug: 'calcas-cargo', sort_order: 3, created_at: '2026-03-01T00:00:00Z' },
  { id: 'cat-mod-4', profile_id: MODA_ID, name: 'Acessórios & Bonés', slug: 'acessorios-bones', sort_order: 4, created_at: '2026-03-01T00:00:00Z' },

  // Craft Burger (Hamburgueria & Gastronomia)
  { id: 'cat-brg-1', profile_id: BURGER_ID, name: 'Burgers na Brasa', slug: 'burgers-na-brasa', sort_order: 1, created_at: '2026-03-10T00:00:00Z' },
  { id: 'cat-brg-2', profile_id: BURGER_ID, name: 'Smash Burgers', slug: 'smash-burgers', sort_order: 2, created_at: '2026-03-10T00:00:00Z' },
  { id: 'cat-brg-3', profile_id: BURGER_ID, name: 'Acompanhamentos', slug: 'acompanhamentos', sort_order: 3, created_at: '2026-03-10T00:00:00Z' },
  { id: 'cat-brg-4', profile_id: BURGER_ID, name: 'Bebidas & Shakes', slug: 'bebidas-shakes', sort_order: 4, created_at: '2026-03-10T00:00:00Z' },

  // Alpha Imóveis (Imobiliária & Alto Padrão)
  { id: 'cat-imv-1', profile_id: IMOVEIS_ID, name: 'Casas em Condomínio', slug: 'casas-em-condominio', sort_order: 1, created_at: '2026-03-20T00:00:00Z' },
  { id: 'cat-imv-2', profile_id: IMOVEIS_ID, name: 'Coberturas Lineares', slug: 'coberturas-lineares', sort_order: 2, created_at: '2026-03-20T00:00:00Z' },
  { id: 'cat-imv-3', profile_id: IMOVEIS_ID, name: 'Apartamentos Modernos', slug: 'apartamentos-modernos', sort_order: 3, created_at: '2026-03-20T00:00:00Z' },
  { id: 'cat-imv-4', profile_id: IMOVEIS_ID, name: 'Mansões Exclusivas', slug: 'mansoes-exclusivas', sort_order: 4, created_at: '2026-03-20T00:00:00Z' },

  // Loja Demo
  { id: 'cat-demo-1', profile_id: DEMO_ID, name: 'Destaques', slug: 'destaques', sort_order: 1, created_at: '2026-09-01T00:00:00Z' },
];

const IMG_BASE = '/devices/';
function img(name: string) { return `${IMG_BASE}${name}.webp`; }

interface BaseProduct {
  name: string;
  category_name: 'Lacrados' | 'Seminovos';
  price: number;
  installments_count: number;
  badge: string;
  quantity: number;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  image: string;
  specs: Record<string, string>;
}

const BASE_PRODUCTS: BaseProduct[] = [
  // ── Lacrados ─────────────────────────────────────────────────
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 Pro Max 256GB Azul', price: 7590, installments_count: 18,
    badge: '📦 2 un. Lacradas', quantity: 2, is_available: true, is_featured: true, sort_order: 1,
    image: img('iphone-17-pro-max-blue'),
    specs: { storage: '256 GB', screen: '6.9" Super Retina XDR OLED ProMotion 120Hz', chip: 'Apple A19 Pro', camera: 'Tripla 48MP Fusion Pro', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 Pro Max 256GB Prata', price: 7590, installments_count: 18,
    badge: '📦 5 un. Lacradas', quantity: 5, is_available: true, is_featured: true, sort_order: 2,
    image: img('iphone-17-pro-max-silver'),
    specs: { storage: '256 GB', screen: '6.9" Super Retina XDR OLED ProMotion 120Hz', chip: 'Apple A19 Pro', camera: 'Tripla 48MP Fusion Pro', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 Pro Max 256GB Laranja', price: 7590, installments_count: 18,
    badge: '📦 2 un. Lacradas', quantity: 2, is_available: true, is_featured: false, sort_order: 3,
    image: img('iphone-17-pro-max-orange'),
    specs: { storage: '256 GB', screen: '6.9" Super Retina XDR OLED ProMotion 120Hz', chip: 'Apple A19 Pro', camera: 'Tripla 48MP Fusion Pro', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 Pro 256GB Prata', price: 7190, installments_count: 18,
    badge: 'Novo Lacrado Apple', quantity: 1, is_available: true, is_featured: true, sort_order: 4,
    image: img('iphone-17-pro-silver'),
    specs: { storage: '256 GB', screen: '6.3" Super Retina XDR OLED ProMotion 120Hz', chip: 'Apple A19 Pro', camera: 'Tripla 48MP Fusion Pro', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 Pro 256GB Azul', price: 7190, installments_count: 18,
    badge: 'Novo Lacrado Apple', quantity: 1, is_available: true, is_featured: false, sort_order: 5,
    image: img('iphone-17-pro-blue'),
    specs: { storage: '256 GB', screen: '6.3" Super Retina XDR OLED ProMotion 120Hz', chip: 'Apple A19 Pro', camera: 'Tripla 48MP Fusion Pro', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 256GB Branco', price: 5390, installments_count: 18,
    badge: '📦 2 un. Lacradas', quantity: 2, is_available: true, is_featured: false, sort_order: 6,
    image: img('iphone-17-white'),
    specs: { storage: '256 GB', screen: '6.1" Super Retina XDR OLED com Dynamic Island', chip: 'Apple A19 Bionic', camera: 'Dupla 48MP Fusion + Ultra-Wide', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 256GB Preto', price: 5390, installments_count: 18,
    badge: '📦 2 un. Lacradas', quantity: 2, is_available: true, is_featured: false, sort_order: 7,
    image: img('iphone-17-black'),
    specs: { storage: '256 GB', screen: '6.1" Super Retina XDR OLED com Dynamic Island', chip: 'Apple A19 Bionic', camera: 'Dupla 48MP Fusion + Ultra-Wide', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 256GB Azul', price: 5390, installments_count: 18,
    badge: '📦 2 un. Lacradas', quantity: 2, is_available: true, is_featured: false, sort_order: 8,
    image: img('iphone-17-blue'),
    specs: { storage: '256 GB', screen: '6.1" Super Retina XDR OLED com Dynamic Island', chip: 'Apple A19 Bionic', camera: 'Dupla 48MP Fusion + Ultra-Wide', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 17 256GB Verde', price: 5390, installments_count: 18,
    badge: '📦 3 un. Lacradas', quantity: 3, is_available: true, is_featured: false, sort_order: 9,
    image: img('iphone-17-green'),
    specs: { storage: '256 GB', screen: '6.1" Super Retina XDR OLED com Dynamic Island', chip: 'Apple A19 Bionic', camera: 'Dupla 48MP Fusion + Ultra-Wide', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  {
    category_name: 'Lacrados',
    name: 'iPhone 16 128GB Preto', price: 4590, installments_count: 18,
    badge: 'Novo Lacrado Apple', quantity: 1, is_available: true, is_featured: false, sort_order: 10,
    image: img('iphone-16-black'),
    specs: { storage: '128 GB', screen: '6.1" Super Retina XDR com Dynamic Island', chip: 'Apple A18 Bionic', camera: 'Dupla 48MP Fusion + Ultra-Wide', battery: '100% de Fábrica', warranty: '1 Ano Garantia Mundial Apple', condition: 'Novo Lacrado de Fábrica Apple' },
  },
  // ── Seminovos ─────────────────────────────────────────────────
  {
    category_name: 'Seminovos',
    name: 'iPhone 16 Pro Max 256GB Desert', price: 5290, installments_count: 12,
    badge: 'Bateria 98%', quantity: 1, is_available: true, is_featured: true, sort_order: 11,
    image: img('iphone-16-pro-max-desert'),
    specs: { storage: '256 GB', screen: '6.9" Super Retina XDR ProMotion 120Hz', chip: 'Apple A18 Pro', camera: 'Tripla 48MP Fusion + Tele 5x', battery: '98% de Saúde Original', warranty: '90 Dias de Garantia', condition: 'Seminovo Grade A+ Impecável' },
  },
  {
    category_name: 'Seminovos',
    name: 'iPhone 16 Pro Max 256GB Titânio Natural', price: 5290, installments_count: 12,
    badge: 'Bateria 89%', quantity: 1, is_available: true, is_featured: false, sort_order: 12,
    image: img('iphone-16-pro-max-natural'),
    specs: { storage: '256 GB', screen: '6.9" Super Retina XDR ProMotion 120Hz', chip: 'Apple A18 Pro', camera: 'Tripla 48MP Fusion + Tele 5x', battery: '89% de Saúde Original', warranty: '90 Dias de Garantia', condition: 'Seminovo Grade A+ Impecável' },
  },
  {
    category_name: 'Seminovos',
    name: 'iPhone 16 Pro 256GB Desert', price: 4990, installments_count: 12,
    badge: 'Bateria 99%', quantity: 1, is_available: true, is_featured: false, sort_order: 13,
    image: img('iphone-16-pro-desert'),
    specs: { storage: '256 GB', screen: '6.3" Super Retina XDR ProMotion 120Hz', chip: 'Apple A18 Pro', camera: 'Tripla 48MP Fusion + Tele 5x', battery: '99% (Praticamente novo)', warranty: '90 Dias de Garantia', condition: 'Seminovo Grade A+ Impecável' },
  },
  {
    category_name: 'Seminovos',
    name: 'iPhone 16 Pro 256GB Branco Titânio', price: 4990, installments_count: 12,
    badge: 'Bateria 92%', quantity: 1, is_available: true, is_featured: false, sort_order: 14,
    image: img('iphone-16-pro-white'),
    specs: { storage: '256 GB', screen: '6.3" Super Retina XDR ProMotion 120Hz', chip: 'Apple A18 Pro', camera: 'Tripla 48MP Fusion + Tele 5x', battery: '92% de Saúde Original', warranty: '90 Dias de Garantia', condition: 'Seminovo Grade A+ Impecável' },
  },
  {
    category_name: 'Seminovos',
    name: 'iPhone 15 Pro 128GB Azul Titânio', price: 3690, installments_count: 12,
    badge: 'Bateria 85%', quantity: 1, is_available: true, is_featured: false, sort_order: 15,
    image: img('iphone-15-pro-blue'),
    specs: { storage: '128 GB', screen: '6.1" Super Retina XDR OLED 120Hz ProMotion', chip: 'A17 Pro (3nm)', camera: 'Tripla 48MP + Tele 3x + Macro', battery: '85% (Testado e certificado)', warranty: '90 Dias de Garantia', condition: 'Seminovo Grade A+ Impecável' },
  },
  {
    category_name: 'Seminovos',
    name: 'iPhone 13 Pro Max 256GB Grafite', price: 3190, installments_count: 12,
    badge: 'Bateria 85%', quantity: 1, is_available: true, is_featured: false, sort_order: 16,
    image: img('iphone-13-pro-max-graphite'),
    specs: { storage: '256 GB', screen: '6.7" Super Retina XDR 120Hz ProMotion', chip: 'A15 Bionic Alta Performance', camera: 'Sistema Pro Triplo 12MP com Tele 3x', battery: '85% (Testado e aprovado)', warranty: '90 Dias de Garantia', condition: 'Seminovo Grade A+ Impecável' },
  },
  {
    category_name: 'Seminovos',
    name: 'iPhone 12 Pro Max 128GB Azul Pacífico', price: 1990, installments_count: 12,
    badge: 'Bateria 82%', quantity: 1, is_available: true, is_featured: false, sort_order: 17,
    image: img('iphone-12-pro-max-blue'),
    specs: { storage: '128 GB', screen: '6.7" Super Retina XDR OLED tela grande', chip: 'A14 Bionic com 5G', camera: 'Sistema Pro Triplo 12MP com Sensor LiDAR', battery: '82% (Testado e certificado)', warranty: '90 Dias de Garantia', condition: 'Seminovo Grade A+ Impecável' },
  },
];

function buildProductsFor(profileId: string, idPrefix: string, catPrefix: string): Product[] {
  return BASE_PRODUCTS.map((b, idx) => ({
    id: `${idPrefix}-${String(idx + 1).padStart(3, '0')}`,
    profile_id: profileId,
    category_id: b.category_name === 'Lacrados' ? `${catPrefix}-2` : `${catPrefix}-3`,
    category_name: b.category_name,
    name: b.name,
    price: b.price,
    installments_count: b.installments_count,
    badge: b.badge,
    quantity: b.quantity,
    is_available: b.is_available,
    is_featured: b.is_featured,
    sort_order: b.sort_order,
    images: [b.image],
    primary_image: b.image,
    specs: b.specs,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  }));
}

export const MOTORS_PRODUCTS: Product[] = [
  {
    id: 'prod-mot-001',
    profile_id: MOTORS_ID,
    category_id: 'cat-mot-1',
    category_name: 'SUVs',
    name: 'Toyota Corolla Cross XRE 2.0 Flex 2024',
    price: 164900,
    price_installments: 3890,
    installments_count: 60,
    badge: 'Único Dono • 14.500 km',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 1,
    images: ['/demos/cars/corolla-cross.png'],
    primary_image: '/demos/cars/corolla-cross.png',
    specs: {
      'Ano': '2024/2024',
      'Quilometragem': '14.500 km rodados',
      'Câmbio': 'Automático Direct Shift 10 marchas',
      'Motor': '2.0 Dual VVT-iE 177 cv',
      'Combustível': 'Flex (Etanol/Gasolina)',
      'Garantia': 'Garantia de Fábrica Toyota até 2029',
      'Destaque': 'Laudo cautelar 100% aprovado',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mot-002',
    profile_id: MOTORS_ID,
    category_id: 'cat-mot-1',
    category_name: 'SUVs',
    name: 'Jeep Compass Limited T270 Turbo Flex 2023',
    price: 149900,
    price_installments: 3550,
    installments_count: 60,
    badge: 'Teto Solar Panorâmico',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 2,
    images: ['/demos/cars/compass.png'],
    primary_image: '/demos/cars/compass.png',
    specs: {
      'Ano': '2023/2023',
      'Quilometragem': '26.800 km rodados',
      'Câmbio': 'Automático de 6 marchas',
      'Motor': '1.3 Turbo T270 185 cv',
      'Combustível': 'Flex',
      'Garantia': '1 Ano de Garantia Prime Motors',
      'Opcionais': 'Som Beats + Painel 100% Digital',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mot-003',
    profile_id: MOTORS_ID,
    category_id: 'cat-mot-2',
    category_name: 'Sedans Premium',
    name: 'BMW 320i M Sport 2.0 Turbo ActiveFlex 2023',
    price: 269000,
    price_installments: 7100,
    installments_count: 48,
    badge: 'Pacote M Sport Completo',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 3,
    images: ['/demos/cars/bmw-320i.png'],
    primary_image: '/demos/cars/bmw-320i.png',
    specs: {
      'Ano': '2023/2023',
      'Quilometragem': '19.200 km rodados',
      'Câmbio': 'Automático Steptronic 8 marchas',
      'Motor': '2.0 TwinPower Turbo 184 cv',
      'Tração': 'Traseira RWD',
      'Garantia': 'Garantia Premium BMW + Laudo Dekra',
      'Interior': 'Couro Cognac com Costuras M Sport',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mot-004',
    profile_id: MOTORS_ID,
    category_id: 'cat-mot-2',
    category_name: 'Sedans Premium',
    name: 'Honda Civic Touring 1.5 Turbo 2021',
    price: 139900,
    price_installments: 3290,
    installments_count: 60,
    badge: 'Revisões na Concessionária',
    quantity: 1,
    is_available: true,
    is_featured: false,
    sort_order: 4,
    images: ['/demos/cars/civic.png'],
    primary_image: '/demos/cars/civic.png',
    specs: {
      'Ano': '2021/2021',
      'Quilometragem': '42.000 km rodados',
      'Câmbio': 'Automático CVT com Paddle Shift',
      'Motor': '1.5 Turbo 173 cv',
      'Combustível': 'Gasolina',
      'Garantia': '1 Ano Motor e Câmbio',
      'Destaque': 'Teto solar elétrico e som premium 450W',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mot-005',
    profile_id: MOTORS_ID,
    category_id: 'cat-mot-4',
    category_name: 'Pickups & 4x4',
    name: 'Toyota Hilux SRX 2.8 4x4 Turbo Diesel 2023',
    price: 289900,
    price_installments: 6700,
    installments_count: 60,
    badge: 'Diesel 4x4 • Impecável',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 5,
    images: ['/demos/cars/hilux.png'],
    primary_image: '/demos/cars/hilux.png',
    specs: {
      'Ano': '2023/2023',
      'Quilometragem': '31.000 km rodados',
      'Câmbio': 'Automático de 6 velocidades',
      'Motor': '2.8 Turbo Diesel 204 cv e 50,9 kgfm',
      'Tração': '4x4 com Reduzida e Bloqueio Diferencial',
      'Garantia': 'Garantia de Fábrica Toyota',
      'Acessórios': 'Capota marítima e santo antônio integrados',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
];

export const DIGITAL_PRODUCTS: Product[] = [
  {
    id: 'prod-dig-001',
    profile_id: DIGITAL_ID,
    category_id: 'cat-dig-1',
    category_name: 'Cursos & Formações',
    name: 'Formação Gestor de Tráfego Pro (Meta Ads & Google Ads)',
    price: 497,
    price_installments: 49.70,
    installments_count: 12,
    badge: '🔥 Mais Vendido (+3.800 alunos)',
    quantity: 999,
    is_available: true,
    is_featured: true,
    sort_order: 1,
    images: ['/demos/digital/trafego-pro.png'],
    primary_image: '/demos/digital/trafego-pro.png',
    specs: {
      'Acesso': 'Vitalício com Atualizações 2026',
      'Carga Horária': '80 horas de aulas práticas passo a passo',
      'Certificado': 'Incluso com emissão instantânea',
      'Bônus': 'Pack com 250 criativos de alta conversão',
      'Comunidade': 'Grupo VIP no Discord com networking',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-dig-002',
    profile_id: DIGITAL_ID,
    category_id: 'cat-dig-2',
    category_name: 'Templates & Dashboards',
    name: 'Pack Notion Ultimate Business OS 2.0',
    price: 97,
    price_installments: 9.70,
    installments_count: 12,
    badge: '⚡ Acesso Imediato',
    quantity: 999,
    is_available: true,
    is_featured: true,
    sort_order: 2,
    images: ['/demos/digital/notion-os.png'],
    primary_image: '/demos/digital/notion-os.png',
    specs: {
      'Compatibilidade': 'Notion Free e Notion Plus',
      'Módulos': 'CRM, Financeiro DRE, Projetos Kanban e Metas',
      'Aulas': '15 tutoriais rápidos de customização',
      'Atualizações': 'Gratuitas para sempre',
      'Entrega': 'Link de duplicação automática 1 clique',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-dig-003',
    profile_id: DIGITAL_ID,
    category_id: 'cat-dig-3',
    category_name: 'Automações & IA',
    name: 'Agente IA para WhatsApp com n8n & OpenAI GPT-4o',
    price: 297,
    price_installments: 29.70,
    installments_count: 12,
    badge: '🚀 Código Pronto para Usar',
    quantity: 999,
    is_available: true,
    is_featured: true,
    sort_order: 3,
    images: ['/demos/digital/ia-whatsapp.png'],
    primary_image: '/demos/digital/ia-whatsapp.png',
    specs: {
      'Tecnologia': 'Workflows n8n + API OpenAI GPT-4o',
      'Integrações': 'WhatsApp Webhooks + Supabase / PostgreSQL',
      'Instalação': 'Vídeo-aula de 45 minutos passo a passo',
      'Economia': 'Sem taxas mensais de plataformas terceiras',
      'Suporte': 'Suporte técnico tira-dúvidas por 60 dias',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-dig-004',
    profile_id: DIGITAL_ID,
    category_id: 'cat-dig-4',
    category_name: 'Mentorias VIP',
    name: 'Mentoria Individual Escala 100k (Vagas Limitadas)',
    price: 3500,
    price_installments: 350,
    installments_count: 12,
    badge: '💎 Apenas 5 Vagas/Mês',
    quantity: 3,
    is_available: true,
    is_featured: true,
    sort_order: 4,
    images: ['/demos/digital/mentoria-100k.png'],
    primary_image: '/demos/digital/mentoria-100k.png',
    specs: {
      'Formato': '4 encontros individuais 1:1 de 1h30 via Google Meet',
      'Acompanhamento': 'Canal privativo no WhatsApp direto com o mentor',
      'Diagnóstico': 'Auditoria completa de funil, tráfego e conversão',
      'Materiais': 'Playbooks operacionais e gravações em 4K',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-dig-005',
    profile_id: DIGITAL_ID,
    category_id: 'cat-dig-1',
    category_name: 'Cursos & Formações',
    name: 'Copywriting de Alta Conversão para VSLs e Ofertas',
    price: 197,
    price_installments: 19.70,
    installments_count: 12,
    badge: '📚 Guia Definitivo + Frameworks',
    quantity: 999,
    is_available: true,
    is_featured: false,
    sort_order: 5,
    images: ['/demos/digital/copywriting.png'],
    primary_image: '/demos/digital/copywriting.png',
    specs: {
      'Conteúdo': '6 módulos práticos com roteiros prontos',
      'Gatilhos': '37 gatilhos mentais aplicados a vendas online',
      'Estudos': 'Dissecação de 10 VSLs que faturaram múltiplos 7 dígitos',
      'Acesso': '2 anos de acesso completo na plataforma',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
];

export const MODA_PRODUCTS: Product[] = [
  {
    id: 'prod-mod-001',
    profile_id: MODA_ID,
    category_id: 'cat-mod-1',
    category_name: 'Camisetas Oversized',
    name: 'Camiseta Heavyweight Oversized Black Vintage',
    price: 149,
    price_installments: 49.66,
    installments_count: 3,
    badge: 'Algodão Peruano 280g',
    quantity: 18,
    is_available: true,
    is_featured: true,
    sort_order: 1,
    images: ['/demos/fashion/camiseta-oversized.png'],
    primary_image: '/demos/fashion/camiseta-oversized.png',
    specs: {
      'Modelagem': 'Oversized Boxy Americana com caimento impecável',
      'Composição': '100% Algodão Penteado Heavyweight 280g/m²',
      'Gola': 'Ribana Canelada 3cm anti-esgarçamento',
      'Lavagem': 'Estonado Vintage com toque aveludado peletizado',
      'Tamanhos': 'Disponível do P ao XGG',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mod-002',
    profile_id: MODA_ID,
    category_id: 'cat-mod-2',
    category_name: 'Moletons & Jaquetas',
    name: 'Moletom Canguru 400g Drop Shadow Acid Wash',
    price: 299,
    price_installments: 49.83,
    installments_count: 6,
    badge: '🔥 Drop Limitado (50 peças)',
    quantity: 9,
    is_available: true,
    is_featured: true,
    sort_order: 2,
    images: ['/demos/fashion/moletom-acid.png'],
    primary_image: '/demos/fashion/moletom-acid.png',
    specs: {
      'Gramatura': '400g/m² Extra Pesado e Estruturado',
      'Interior': 'Flanelado Térmico Ultra Macio e Acolhedor',
      'Capuz': 'Duplo com cordão em algodão cru e ponteiras de metal',
      'Costuras': 'Pesponto reforçado nas cavas e punhos 2x1',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mod-003',
    profile_id: MODA_ID,
    category_id: 'cat-mod-3',
    category_name: 'Calças Cargo',
    name: 'Calça Cargo Tática Multi-Bolsos Preto Grafite',
    price: 249,
    price_installments: 49.80,
    installments_count: 5,
    badge: 'Tecido Ripstop Militar',
    quantity: 14,
    is_available: true,
    is_featured: true,
    sort_order: 3,
    images: ['/demos/fashion/calca-cargo.png'],
    primary_image: '/demos/fashion/calca-cargo.png',
    specs: {
      'Tecido': 'Ripstop Militar 65% Algodão 35% Poliéster anti-rasgo',
      'Bolsos': '6 bolsos táticos com fechamento em velcro e zíper',
      'Ajuste': 'Cós elástico com passador para cinto + cordão regulador no tornozelo',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mod-004',
    profile_id: MODA_ID,
    category_id: 'cat-mod-2',
    category_name: 'Moletons & Jaquetas',
    name: 'Jaqueta Windbreaker Reflexiva Corta-Vento',
    price: 279,
    price_installments: 55.80,
    installments_count: 5,
    badge: 'Repelente à Água (DWR)',
    quantity: 8,
    is_available: true,
    is_featured: false,
    sort_order: 4,
    images: ['/demos/fashion/corta-vento.png'],
    primary_image: '/demos/fashion/corta-vento.png',
    specs: {
      'Material': 'Nylon Taslan resinado com forro interno respirável',
      'Segurança': 'Faixas reflexivas 3M de alta visibilidade noturna',
      'Zíperes': 'Zíperes YKK emborrachados selados contra vento e chuva',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-mod-005',
    profile_id: MODA_ID,
    category_id: 'cat-mod-4',
    category_name: 'Acessórios & Bonés',
    name: 'Boné Dad Hat Vintage Bordado Monogram',
    price: 99,
    price_installments: 49.50,
    installments_count: 2,
    badge: 'Fivela de Metal Personalizada',
    quantity: 25,
    is_available: true,
    is_featured: false,
    sort_order: 5,
    images: ['/demos/fashion/bone-vintage.png'],
    primary_image: '/demos/fashion/bone-vintage.png',
    specs: {
      'Formato': 'Dad Hat desestruturado com 6 gomos',
      'Tecido': 'Sarja 100% Algodão Premium pré-lavada',
      'Fecho': 'Fivela metálica envelhecida com regulagem em tecido',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
];

export const BURGER_PRODUCTS: Product[] = [
  {
    id: 'prod-brg-001',
    profile_id: BURGER_ID,
    category_id: 'cat-brg-1',
    category_name: 'Burgers na Brasa',
    name: 'Burger Grand Bacon Cheddar Bomb',
    price: 42,
    price_installments: 42,
    installments_count: 1,
    badge: '🏆 O Mais Premiado',
    quantity: 50,
    is_available: true,
    is_featured: true,
    sort_order: 1,
    images: ['/demos/food/burger-bacon.png'],
    primary_image: '/demos/food/burger-bacon.png',
    specs: {
      'Pão': 'Brioche selado na manteiga de garrafa',
      'Carne': 'Blend 100% Angus 180g assado na brasa de carvão',
      'Queijo': 'Creme de cheddar artesanal fundido na cerveja IPA',
      'Bacon': 'Fatias fartas de bacon defumado por 12h na lenha de macieira',
      'Molho': 'Geleia de pimenta defumada artesanal da casa',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-brg-002',
    profile_id: BURGER_ID,
    category_id: 'cat-brg-1',
    category_name: 'Burgers na Brasa',
    name: 'Truffle & Brie Prime Burger',
    price: 48,
    price_installments: 48,
    installments_count: 1,
    badge: '⭐ Toque Trufado Exclusivo',
    quantity: 35,
    is_available: true,
    is_featured: true,
    sort_order: 2,
    images: ['/demos/food/burger-truffle.png'],
    primary_image: '/demos/food/burger-truffle.png',
    specs: {
      'Pão': 'Brioche com gergelim negro tostado',
      'Carne': 'Blend Angus 180g suculento ao ponto da casa',
      'Queijo': 'Fatia generosa de Queijo Brie maçaricado',
      'Complementos': 'Cebola caramelizada no balsâmico e maionese trufada',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-brg-003',
    profile_id: BURGER_ID,
    category_id: 'cat-brg-2',
    category_name: 'Smash Burgers',
    name: 'Oklahoma Double Smash Cheese',
    price: 34,
    price_installments: 34,
    installments_count: 1,
    badge: '🔥 Crostinha Perfeita',
    quantity: 60,
    is_available: true,
    is_featured: true,
    sort_order: 3,
    images: ['/demos/food/burger-smash.png'],
    primary_image: '/demos/food/burger-smash.png',
    specs: {
      'Pão': 'Pão de batata artesanal ultra macio',
      'Carne': '2x Smash 90g prensados com cebola roxa fininha na chapa quente',
      'Queijo': 'Queijo prato cremoso duplo derretido',
      'Molho': 'Picles artesanal crocante de pepino e molho secreto Craft',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-brg-004',
    profile_id: BURGER_ID,
    category_id: 'cat-brg-3',
    category_name: 'Acompanhamentos',
    name: 'Batatas Rústicas com Alecrim & Maionese de Alho Negro',
    price: 26,
    price_installments: 26,
    installments_count: 1,
    badge: 'Porção Farta 400g',
    quantity: 80,
    is_available: true,
    is_featured: true,
    sort_order: 4,
    images: ['/demos/food/batata-rustica.png'],
    primary_image: '/demos/food/batata-rustica.png',
    specs: {
      'Batatas': 'Cortadas à mão com casca, duplamente fritas crocantes',
      'Tempero': 'Flor de sal e ramos de alecrim fresco da horta',
      'Acompanhamento': 'Potinho de 100ml de maionese artesanal de alho negro',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-brg-005',
    profile_id: BURGER_ID,
    category_id: 'cat-brg-4',
    category_name: 'Bebidas & Shakes',
    name: 'Milkshake de Doce de Leite com Flor de Sal 500ml',
    price: 22,
    price_installments: 22,
    installments_count: 1,
    badge: 'Sorvete Artesanal 500ml',
    quantity: 40,
    is_available: true,
    is_featured: false,
    sort_order: 5,
    images: ['/demos/food/milkshake.png'],
    primary_image: '/demos/food/milkshake.png',
    specs: {
      'Sorvete': 'Sorvete artesanal cremoso de fava de baunilha',
      'Calda': 'Doce de leite mineiro legítimo cozido na panela',
      'Topo': 'Chantilly batido na hora com pitada de flor de sal marinho',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
];

export const IMOVEIS_PRODUCTS: Product[] = [
  {
    id: 'prod-imv-001',
    profile_id: IMOVEIS_ID,
    category_id: 'cat-imv-1',
    category_name: 'Casas em Condomínio',
    name: 'Casa Contemporânea em Condomínio Fechado (Mansões)',
    price: 4850000,
    price_installments: 34500,
    installments_count: 240,
    badge: '🔑 Pronta para Morar • 4 Suítes',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 1,
    images: ['/demos/realestate/casa-condominio.png'],
    primary_image: '/demos/realestate/casa-condominio.png',
    specs: {
      'Área Construída': '540 m² de área útil privativa',
      'Terreno': '720 m² com paisagismo Burle Marx',
      'Quartos': '4 Suítes completas com closet e hidromassagem',
      'Vagas': '4 vagas cobertas + 4 descobertas',
      'Lazer': 'Piscina aquecida de borda infinita, sauna a vapor e espaço gourmet',
      'Condomínio': 'Segurança armada 24h, quadras de tênis de saibro e heliponto',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-imv-002',
    profile_id: IMOVEIS_ID,
    category_id: 'cat-imv-2',
    category_name: 'Coberturas Lineares',
    name: 'Cobertura Linear com Vista Panorâmica para o Mar',
    price: 3200000,
    price_installments: 32000,
    installments_count: 120,
    badge: '🌊 Vista Livre Definitiva',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 2,
    images: ['/demos/realestate/cobertura-mar.png'],
    primary_image: '/demos/realestate/cobertura-mar.png',
    specs: {
      'Área Privativa': '380 m² com circulação 360 graus',
      'Quartos': '3 Suítes climatizadas com varandas privativas',
      'Vagas': '3 vagas de garagem demarcadas e soltas',
      'Terraço': 'Deck em cumaru com jacuzzi para 6 pessoas e churrasqueira',
      'Edifício': 'Portaria blindada 24h e prédio com apenas 2 unidades por andar',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-imv-003',
    profile_id: IMOVEIS_ID,
    category_id: 'cat-imv-3',
    category_name: 'Apartamentos Modernos',
    name: 'Apartamento Alto Padrão 3 Quartos Totalmente Mobiliado',
    price: 1650000,
    price_installments: 12800,
    installments_count: 360,
    badge: '✨ Mobiliado e Decorado',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 3,
    images: ['/demos/realestate/apartamento-decorado.png'],
    primary_image: '/demos/realestate/apartamento-decorado.png',
    specs: {
      'Área Útil': '145 m² com projeto assinado por arquiteto',
      'Quartos': '3 Quartos com armários planejados (1 Suíte Master)',
      'Varanda': 'Varanda gourmet integrada com cortina de vidro e churrasqueira',
      'Vagas': '2 vagas cobertas na escritura',
      'Acabamento': 'Piso em porcelanato 120x120 e automação de iluminação',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
  {
    id: 'prod-imv-004',
    profile_id: IMOVEIS_ID,
    category_id: 'cat-imv-4',
    category_name: 'Mansões Exclusivas',
    name: 'Mansão Neoclássica com Vista para as Montanhas',
    price: 7900000,
    price_installments: 65000,
    installments_count: 120,
    badge: '👑 Terreno de 2.500m²',
    quantity: 1,
    is_available: true,
    is_featured: true,
    sort_order: 4,
    images: ['/demos/realestate/mansao-neoclassica.png'],
    primary_image: '/demos/realestate/mansao-neoclassica.png',
    specs: {
      'Área Construída': '880 m² com pé-direito duplo de 7 metros',
      'Terreno': '2.500 m² cercado por mata nativa preservada',
      'Quartos': '5 Suítes com closet e sacadas voltadas para o bosque',
      'Vagas': '8 vagas para veículos de porte grande',
      'Lazer Privativo': 'Quadra de beach tennis privativa, adega subterrânea e cinema 4K',
    },
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-24T00:00:00Z',
  },
];

export const SEED_PRODUCTS: Product[] = [
  ...buildProductsFor(TEREPHONES_ID, 'prod-tere', 'cat-tere'),
  ...MOTORS_PRODUCTS,
  ...DIGITAL_PRODUCTS,
  ...MODA_PRODUCTS,
  ...BURGER_PRODUCTS,
  ...IMOVEIS_PRODUCTS,
];

export const SEED_REVIEWS: StoreReview[] = [
  // Terephones (iPhones)
  { id: 'rev-tere-001', profile_id: TEREPHONES_ID, author_name: 'Fernanda Lima', neighborhood: 'Agriões, Teresópolis', rating: 5, comment: 'Comprei pelo WhatsApp e em menos de 1h30 o aparelho estava aqui. Paguei no cartão na entrega. Nota 10!', is_visible: true, created_at: '2026-09-20T00:00:00Z' },
  { id: 'rev-tere-002', profile_id: TEREPHONES_ID, author_name: 'Ricardo Santos', neighborhood: 'Alto, Teresópolis', rating: 5, comment: 'Fui retirar na loja parceira SejaDelta. Ambiente super seguro, equipe atenciosa, conferi tudo na hora.', is_visible: true, created_at: '2026-09-18T00:00:00Z' },
  { id: 'rev-tere-003', profile_id: TEREPHONES_ID, author_name: 'Bruno Ferreira', neighborhood: 'Várzea, Teresópolis', rating: 5, comment: 'Fiz a troca inteligente do meu iPhone 11 pelo 14 Pro com facilidade. Muito honestos e transparentes.', is_visible: true, created_at: '2026-09-15T00:00:00Z' },
  { id: 'rev-tere-004', profile_id: TEREPHONES_ID, author_name: 'Beatriz Lopes', neighborhood: 'Comary, Teresópolis', rating: 5, comment: 'A Terephones entregou na minha porta no mesmo dia. Atendimento impecável!', is_visible: true, created_at: '2026-09-10T00:00:00Z' },

  // Prime Motors (Carros)
  { id: 'rev-mot-001', profile_id: MOTORS_ID, author_name: 'Rodrigo Alcântara', neighborhood: 'Barra da Tijuca, RJ', rating: 5, comment: 'Comprei meu Corolla Cross na Prime Motors. Atendimento impecável, carro entregue polido e revisado no mesmo dia. Recomendo de olhos fechados!', is_visible: true, created_at: '2026-09-21T00:00:00Z' },
  { id: 'rev-mot-002', profile_id: MOTORS_ID, author_name: 'Camila Nogueira', neighborhood: 'Recreio, RJ', rating: 5, comment: 'Avaliaram meu seminovo na troca com valor justo e sem enrolação. A documentação saiu em menos de 48 horas!', is_visible: true, created_at: '2026-09-19T00:00:00Z' },
  { id: 'rev-mot-003', profile_id: MOTORS_ID, author_name: 'Marcelo Bastos', neighborhood: 'Leblon, RJ', rating: 5, comment: 'A BMW 320i veio com laudo cautelar 100% aprovado. Transparência nota 10!', is_visible: true, created_at: '2026-09-16T00:00:00Z' },

  // Nexus Digital (Infoprodutos)
  { id: 'rev-dig-001', profile_id: DIGITAL_ID, author_name: 'Gabriel Vasconcelos', neighborhood: 'São Paulo, SP', rating: 5, comment: 'A Formação Gestor de Tráfego mudou o jogo da minha agência. Triplicamos o faturamento em 3 meses com os criativos prontos.', is_visible: true, created_at: '2026-09-22T00:00:00Z' },
  { id: 'rev-dig-002', profile_id: DIGITAL_ID, author_name: 'Juliana Matos', neighborhood: 'Belo Horizonte, MG', rating: 5, comment: 'O template de Notion é o mais completo que já vi. Minha equipe inteira usa todos os dias para organizar as demandas.', is_visible: true, created_at: '2026-09-18T00:00:00Z' },
  { id: 'rev-dig-003', profile_id: DIGITAL_ID, author_name: 'Lucas Pinheiro', neighborhood: 'Curitiba, PR', rating: 5, comment: 'Implementei o agente de IA no WhatsApp da minha empresa e automatizei 80% do primeiro atendimento. Valeu cada centavo!', is_visible: true, created_at: '2026-09-14T00:00:00Z' },

  // Aura Store (Moda Streetwear)
  { id: 'rev-mod-001', profile_id: MODA_ID, author_name: 'Matheus Rocha', neighborhood: 'Pinheiros, SP', rating: 5, comment: 'A qualidade da camiseta oversized é absurda! Tecido grosso de verdade, não encolheu nada na máquina e o caimento é perfeito.', is_visible: true, created_at: '2026-09-20T00:00:00Z' },
  { id: 'rev-mod-002', profile_id: MODA_ID, author_name: 'Thiago Mendes', neighborhood: 'Campinas, SP', rating: 5, comment: 'O moletom 400g é uma armadura de tão quente e confortável. Chegou em 2 dias aqui no interior de SP.', is_visible: true, created_at: '2026-09-17T00:00:00Z' },
  { id: 'rev-mod-003', profile_id: MODA_ID, author_name: 'Larissa Prado', neighborhood: 'Jardins, SP', rating: 5, comment: 'Comprei a calça cargo e serviu como uma luva. Atendimento no WhatsApp super atencioso para tirar dúvidas de tamanho.', is_visible: true, created_at: '2026-09-13T00:00:00Z' },

  // Craft Burger (Gastronomia)
  { id: 'rev-brg-001', profile_id: BURGER_ID, author_name: 'Guilherme Azevedo', neighborhood: 'Laranjeiras, RJ', rating: 5, comment: 'Simplesmente o melhor burger do Rio! O bacon defumado na casa é inacreditável de tão crocante e o pão chega fofinho.', is_visible: true, created_at: '2026-09-21T00:00:00Z' },
  { id: 'rev-brg-002', profile_id: BURGER_ID, author_name: 'Priscila Duarte', neighborhood: 'Flamengo, RJ', rating: 5, comment: 'O Grand Bacon Cheddar veio quentinho na embalagem térmica em menos de 30 minutos. Virei cliente fiel!', is_visible: true, created_at: '2026-09-19T00:00:00Z' },
  { id: 'rev-brg-003', profile_id: BURGER_ID, author_name: 'Daniel Fonseca', neighborhood: 'Botafogo, RJ', rating: 5, comment: 'A batata rústica com a maionese de alho negro é viciante. Pedi no WhatsApp e foi tudo super rápido.', is_visible: true, created_at: '2026-09-15T00:00:00Z' },

  // Alpha Imóveis (Alto Padrão)
  { id: 'rev-imv-001', profile_id: IMOVEIS_ID, author_name: 'Dr. Roberto Silveira', neighborhood: 'Barra da Tijuca, RJ', rating: 5, comment: 'A equipe da Alpha Imóveis conduziu a compra da nossa casa em condomínio com extrema discrição e segurança jurídica impecável.', is_visible: true, created_at: '2026-09-20T00:00:00Z' },
  { id: 'rev-imv-002', profile_id: IMOVEIS_ID, author_name: 'Patrícia Valença', neighborhood: 'Joá, RJ', rating: 5, comment: 'Corretores muito preparados que realmente entendem o padrão de imóveis de luxo. A visita guiada tirou todas as dúvidas.', is_visible: true, created_at: '2026-09-17T00:00:00Z' },
  { id: 'rev-imv-003', profile_id: IMOVEIS_ID, author_name: 'Henrique Brandão', neighborhood: 'São Conrado, RJ', rating: 5, comment: 'Aprovaram nossa simulação bancária com taxa diferenciada em menos de 24 horas. Experiência de compra maravilhosa!', is_visible: true, created_at: '2026-09-12T00:00:00Z' },
];

export const SEED_PLANS: Plan[] = [
  { id: 'plan-free', name: 'Grátis', slug: 'free', price: 0, price_monthly: 0, max_products: 10, max_images: 1, limits: { products: 10, images: 1, custom_domain: false }, features: ['Até 10 produtos', '1 imagem por produto', 'Catálogo online', 'Botão WhatsApp', 'Painel de gerenciamento'], is_active: true },
  { id: 'plan-starter', name: 'Starter', slug: 'starter', price: 19.99, price_monthly: 19.99, price_yearly: 199.90, max_products: 50, max_images: 5, limits: { products: 50, images: 5, custom_domain: false }, features: ['Até 50 produtos', 'Até 5 fotos por produto', 'Categorias ilimitadas', 'Upload de logo e banner', 'Chat Tawk.to integrado', 'Suporte via WhatsApp'], is_active: true },
  { id: 'plan-pro', name: 'Pro', slug: 'pro', price: 49.99, price_monthly: 49.99, price_yearly: 499.90, max_images: 20, limits: { products: -1, images: 20, custom_domain: true }, features: ['Produtos ilimitados', 'Até 20 fotos por produto', 'Domínio próprio (.com.br)', 'Upload de fotos em alta qualidade', 'SEO avançado e Meta Pixel', 'Suporte prioritário VIP'], is_active: true },
];

// ─── LocalStorage Keys ────────────────────────────────────────
const KEYS = {
  profiles:       'saas_profiles',
  store_settings: 'saas_store_settings',
  categories:     'saas_categories',
  products:       'saas_products',
  reviews:        'saas_reviews',
  plans:          'saas_plans',
  subscriptions:  'saas_subscriptions',
  activity_logs:  'saas_activity_logs',
  passwords:      'saas_passwords',
  initialized:    'saas_db_initialized',
} as const;

// Versão do banco para forçar migração transparente no navegador do usuário
const DB_VERSION = 'v19_header_footer_customization';

// ─── Helpers ──────────────────────────────────────────────────
function isClient() { return typeof window !== 'undefined'; }

function read<T>(key: string, fallback: T[]): T[] {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch { return fallback; }
}

function write<T>(key: string, data: T[]): void {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(data));
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function now(): string { return new Date().toISOString(); }

// ─── Sincronização Supabase ───────────────────────────────────
let isSyncing = false;
export async function syncFromSupabase(): Promise<void> {
  if (!isSupabaseConfigured() || !isClient() || isSyncing) return;
  isSyncing = true;
  try {
    const [profilesRes, settingsRes, categoriesRes, productsRes, reviewsRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('store_settings').select('*'),
      supabase.from('product_categories').select('*'),
      supabase.from('products').select('*').is('deleted_at', null),
      supabase.from('store_reviews').select('*'),
    ]);

    if (profilesRes.data && profilesRes.data.length > 0) {
      write(KEYS.profiles, profilesRes.data as Profile[]);
    }
    if (settingsRes.data && settingsRes.data.length > 0) {
      write(KEYS.store_settings, settingsRes.data as StoreSettings[]);
    }
    if (categoriesRes.data && categoriesRes.data.length > 0) {
      write(KEYS.categories, categoriesRes.data as ProductCategory[]);
    }
    if (productsRes.data && productsRes.data.length > 0) {
      write(KEYS.products, productsRes.data as Product[]);
    }
    if (reviewsRes.data && reviewsRes.data.length > 0) {
      write(KEYS.reviews, reviewsRes.data as StoreReview[]);
    }
  } catch (e) {
    console.warn('Sync from Supabase failed, using local cache:', e);
  } finally {
    isSyncing = false;
  }
}

// ─── Inicialização do DB ──────────────────────────────────────
export function initDb(): void {
  if (!isClient()) return;
  
  if (isSupabaseConfigured()) {
    syncFromSupabase();
  }

  if (localStorage.getItem(KEYS.initialized) === DB_VERSION) return;
  
  write(KEYS.profiles,       SEED_PROFILES);
  write(KEYS.store_settings, SEED_STORE_SETTINGS);
  write(KEYS.categories,     SEED_CATEGORIES);
  write(KEYS.products,       SEED_PRODUCTS);
  write(KEYS.reviews,        SEED_REVIEWS);
  write(KEYS.plans,          SEED_PLANS);
  write(KEYS.subscriptions,  []);
  write(KEYS.activity_logs,  []);
  localStorage.setItem(KEYS.passwords, JSON.stringify(SEED_PASSWORDS));
  localStorage.setItem(KEYS.initialized, DB_VERSION);
}

export function resetDb(): void {
  if (!isClient()) return;
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}

// ─── PROFILES ────────────────────────────────────────────────
export const db = {
  profiles: {
    getAll: (): Profile[] => read<Profile>(KEYS.profiles, SEED_PROFILES),
    getById: (id: string): Profile | undefined => db.profiles.getAll().find(p => p.id === id),
    getBySlug: (slug: string): Profile | undefined => {
      const all = db.profiles.getAll();
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      return all.find(p => {
        const pSlug = p.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (p.slug.toLowerCase() === slug.toLowerCase() || pSlug === cleanSlug) return true;
        // Aliases for craft-burger / burger-craft
        if ((cleanSlug === 'craftburger' || cleanSlug === 'burgercraft') && (pSlug === 'craftburger' || pSlug === 'burgercraft')) return true;
        return false;
      });
    },
    getByEmail: (email: string): Profile | undefined => {
      const target = email.toLowerCase().trim();
      const all = db.profiles.getAll();
      const direct = all.find(p => p.email.toLowerCase() === target);
      if (direct) return direct;
      const aliasMap: Record<string, string> = {
        'admin@zapstore.com': 'admin@cronos.com',
        'motors@zapstore.com': 'motors@example.com',
        'digital@zapstore.com': 'nexus@example.com',
        'digital@example.com': 'nexus@example.com',
        'moda@zapstore.com': 'aura@example.com',
        'moda@example.com': 'aura@example.com',
        'burger@zapstore.com': 'burger@example.com',
        'imoveis@zapstore.com': 'imoveis@example.com',
      };
      const aliased = aliasMap[target];
      if (aliased) {
        return all.find(p => p.email.toLowerCase() === aliased);
      }
      return undefined;
    },
    slugAvailable: (slug: string, excludeId?: string): boolean => {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      return !db.profiles.getAll().some(p => {
        const pSlug = p.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
        return (p.slug.toLowerCase() === slug.toLowerCase() || pSlug === cleanSlug) && p.id !== excludeId;
      });
    },
    create: (data: Omit<Profile, 'id' | 'created_at'>): Profile => {
      const profile: Profile = { ...data, id: uuid(), created_at: now() };
      const all = db.profiles.getAll();
      write(KEYS.profiles, [...all, profile]);
      return profile;
    },
    update: (id: string, data: Partial<Profile>): Profile | undefined => {
      const all = db.profiles.getAll();
      const idx = all.findIndex(p => p.id === id);
      if (idx === -1) return undefined;
      const updated = { ...all[idx], ...data };
      all[idx] = updated;
      write(KEYS.profiles, all);
      if (isSupabaseConfigured()) {
        supabase.from('profiles').update(data).eq('id', id).then();
      }
      return updated;
    },
  },

  passwords: {
    get: (email: string): string | undefined => {
      const clean = email.toLowerCase().trim();
      let stored: string | undefined;
      if (isClient()) {
        try {
          const raw = localStorage.getItem(KEYS.passwords);
          const map: Record<string, string> = raw ? JSON.parse(raw) : {};
          stored = map[clean];
        } catch {}
      }
      return stored || SEED_PASSWORDS[clean];
    },
    verify: (email: string, passAttempt: string): boolean => {
      const clean = email.toLowerCase().trim();
      const expected = db.passwords.get(clean);
      if (expected && expected === passAttempt) return true;

      // Tolerant fallback for all demo account variations
      const validDemoPasswords: Record<string, string[]> = {
        'admin@cronos.com': ['admin123'],
        'admin@zapstore.com': ['admin123'],
        'terephones@example.com': ['tere123', 'terephones123'],
        'terephones@zapstore.com': ['tere123', 'terephones123'],
        'motors@example.com': ['motors123', 'motor123'],
        'motors@zapstore.com': ['motors123', 'motor123'],
        'motor@example.com': ['motors123', 'motor123'],
        'motor@zapstore.com': ['motors123', 'motor123'],
        'digital@example.com': ['digital123', 'nexus123'],
        'digital@zapstore.com': ['digital123', 'nexus123'],
        'nexus@example.com': ['digital123', 'nexus123'],
        'nexus@zapstore.com': ['digital123', 'nexus123'],
        'moda@example.com': ['moda123', 'aura123'],
        'moda@zapstore.com': ['moda123', 'aura123'],
        'aura@example.com': ['moda123', 'aura123'],
        'aura@zapstore.com': ['moda123', 'aura123'],
        'burger@example.com': ['burger123'],
        'burger@zapstore.com': ['burger123'],
        'imoveis@example.com': ['imoveis123', 'imovel123'],
        'imoveis@zapstore.com': ['imoveis123', 'imovel123'],
        'imovel@example.com': ['imoveis123', 'imovel123'],
        'imovel@zapstore.com': ['imoveis123', 'imovel123'],
        'demo@example.com': ['demo123'],
        'demo@zapstore.com': ['demo123'],
      };

      const allowed = validDemoPasswords[clean];
      if (allowed && allowed.includes(passAttempt)) {
        return true;
      }
      return false;
    },
    set: (email: string, password: string): void => {
      if (!isClient()) return;
      const raw = localStorage.getItem(KEYS.passwords);
      const map: Record<string, string> = raw ? JSON.parse(raw) : {};
      map[email.toLowerCase()] = password;
      localStorage.setItem(KEYS.passwords, JSON.stringify(map));
    },
  },

  storeSettings: {
    getAll: (): StoreSettings[] => read<StoreSettings>(KEYS.store_settings, SEED_STORE_SETTINGS),
    getByProfileId: (profileId: string): StoreSettings | undefined =>
      db.storeSettings.getAll().find(s => s.profile_id === profileId),
    getBySlug: (slug: string): StoreSettings | undefined => {
      const profile = db.profiles.getBySlug(slug);
      if (!profile) return undefined;
      return db.storeSettings.getByProfileId(profile.id);
    },
    create: (data: Omit<StoreSettings, 'id' | 'updated_at'>): StoreSettings => {
      const s: StoreSettings = { ...data, id: uuid(), updated_at: now() };
      write(KEYS.store_settings, [...db.storeSettings.getAll(), s]);
      if (isSupabaseConfigured()) {
        supabase.from('store_settings').upsert({ ...s, profile_id: s.profile_id }).then();
      }
      return s;
    },
    update: (profileId: string, data: Partial<StoreSettings>): StoreSettings => {
      const all = db.storeSettings.getAll();
      const idx = all.findIndex(s => s.profile_id === profileId);
      if (idx === -1) {
        const created: StoreSettings = {
          id: uuid(),
          profile_id: profileId,
          store_name: 'Minha Loja',
          store_tagline: '',
          theme_mode: 'white',
          differentials: [],
          custom_domain_verified: false,
          enable_tawk: false,
          enable_whatsapp_float: true,
          enable_dark_mode_toggle: true,
          primary_color: '#2563eb',
          accent_color: '#0ea5e9',
          font_family: 'Inter',
          cta_button_text: 'Ver Catálogo na Loja',
          ...data,
          updated_at: now(),
        } as StoreSettings;
        write(KEYS.store_settings, [...all, created]);
        if (isSupabaseConfigured()) {
          supabase.from('store_settings').upsert({ ...created, profile_id: profileId }).then();
        }
        return created;
      }
      const updated = { ...all[idx], ...data, updated_at: now() };
      all[idx] = updated;
      write(KEYS.store_settings, all);
      if (isSupabaseConfigured()) {
        supabase.from('store_settings').upsert({ profile_id: profileId, ...data, updated_at: now() }).then();
      }
      return updated;
    },
  },

  categories: {
    getAll: (): ProductCategory[] => read<ProductCategory>(KEYS.categories, SEED_CATEGORIES),
    getByProfileId: (profileId: string): ProductCategory[] =>
      db.categories.getAll().filter(c => c.profile_id === profileId),
    create: (data: Omit<ProductCategory, 'id' | 'created_at'>): ProductCategory => {
      const c: ProductCategory = { ...data, id: uuid(), created_at: now() };
      write(KEYS.categories, [...db.categories.getAll(), c]);
      if (isSupabaseConfigured()) {
        supabase.from('product_categories').insert({ profile_id: c.profile_id, name: c.name, slug: c.slug, sort_order: c.sort_order }).then();
      }
      return c;
    },
    update: (id: string, data: Partial<ProductCategory>): ProductCategory | undefined => {
      const all = db.categories.getAll();
      const idx = all.findIndex(c => c.id === id);
      if (idx === -1) return undefined;
      const updated = { ...all[idx], ...data };
      all[idx] = updated;
      write(KEYS.categories, all);
      if (isSupabaseConfigured()) {
        supabase.from('product_categories').update(data).eq('id', id).then();
      }
      return updated;
    },
    delete: (id: string): void => {
      write(KEYS.categories, db.categories.getAll().filter(c => c.id !== id));
      if (isSupabaseConfigured()) {
        supabase.from('product_categories').delete().eq('id', id).then();
      }
    },
  },

  products: {
    getAll: (): Product[] => {
      const prods = read<Product>(KEYS.products, SEED_PRODUCTS);
      return prods.map(p => {
        const fixImg = (url: string) => (url ? url.replace(/^\/src\/assets\/devices\//, '/devices/') : url);
        const primary = p.primary_image ? fixImg(p.primary_image) : p.primary_image;
        const imgs = Array.isArray(p.images) ? p.images.map(fixImg) : [];
        return {
          ...p,
          primary_image: primary,
          images: imgs.length > 0 ? imgs : (primary ? [primary] : []),
        };
      });
    },
    getByProfileId: (profileId: string): Product[] =>
      db.products.getAll().filter(p => p.profile_id === profileId && !p.deleted_at),
    getBySlug: (storeSlug: string): Product[] => {
      const profile = db.profiles.getBySlug(storeSlug);
      if (!profile) return [];
      return db.products.getByProfileId(profile.id).filter(p => p.is_available);
    },
    getById: (id: string): Product | undefined => db.products.getAll().find(p => p.id === id),
    create: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product => {
      const p: Product = { ...data, id: uuid(), created_at: now(), updated_at: now() };
      write(KEYS.products, [...db.products.getAll(), p]);
      if (isSupabaseConfigured()) {
        supabase.from('products').insert(p).then();
      }
      return p;
    },
    update: (id: string, data: Partial<Product>): Product | undefined => {
      const all = db.products.getAll();
      const idx = all.findIndex(p => p.id === id);
      if (idx === -1) return undefined;
      const updated = { ...all[idx], ...data, updated_at: now() };
      all[idx] = updated;
      write(KEYS.products, all);
      if (isSupabaseConfigured()) {
        supabase.from('products').update({ ...data, updated_at: now() }).eq('id', id).then();
      }
      return updated;
    },
    softDelete: (id: string): void => {
      db.products.update(id, { deleted_at: now(), is_available: false });
      if (isSupabaseConfigured()) {
        supabase.from('products').update({ deleted_at: now(), is_available: false }).eq('id', id).then();
      }
    },
    countByProfileId: (profileId: string): number =>
      db.products.getByProfileId(profileId).length,
    duplicate: (id: string): Product | undefined => {
      const original = db.products.getById(id);
      if (!original) return undefined;
      const clone: Product = {
        ...original,
        id: uuid(),
        name: `${original.name} (Cópia)`,
        created_at: now(),
        updated_at: now(),
      };
      const all = db.products.getAll();
      write(KEYS.products, [...all, clone]);
      if (isSupabaseConfigured()) {
        supabase.from('products').insert(clone).then();
      }
      return clone;
    },
  },

  reviews: {
    getAll: (): StoreReview[] => read<StoreReview>(KEYS.reviews, SEED_REVIEWS),
    getByProfileId: (profileId: string): StoreReview[] =>
      db.reviews.getAll().filter(r => r.profile_id === profileId),
    getVisibleBySlug: (storeSlug: string): StoreReview[] => {
      const profile = db.profiles.getBySlug(storeSlug);
      if (!profile) return [];
      return db.reviews.getByProfileId(profile.id).filter(r => r.is_visible);
    },
    create: (data: Omit<StoreReview, 'id' | 'created_at'>): StoreReview => {
      const r: StoreReview = { ...data, id: uuid(), created_at: now() };
      write(KEYS.reviews, [...db.reviews.getAll(), r]);
      return r;
    },
    update: (id: string, data: Partial<StoreReview>): void => {
      const all = db.reviews.getAll();
      const idx = all.findIndex(r => r.id === id);
      if (idx === -1) return;
      all[idx] = { ...all[idx], ...data };
      write(KEYS.reviews, all);
    },
    delete: (id: string): void => {
      write(KEYS.reviews, db.reviews.getAll().filter(r => r.id !== id));
    },
  },

  plans: {
    getAll: (): Plan[] => read<Plan>(KEYS.plans, SEED_PLANS),
    getBySlug: (slug: PlanSlug): Plan | undefined => db.plans.getAll().find(p => p.slug === slug),
    update: (slug: PlanSlug, data: Partial<Plan>): Plan | undefined => {
      const all = db.plans.getAll();
      const idx = all.findIndex(p => p.slug === slug);
      if (idx === -1) return undefined;
      const updated = { ...all[idx], ...data };
      all[idx] = updated;
      write(KEYS.plans, all);
      return updated;
    },
  },

  platformSettings: {
    get: () => {
      if (typeof window === 'undefined') {
        return {
          platform_name: 'ZapStore SaaS',
          support_whatsapp: '5521964639999',
          support_email: 'suporte@zapstore.com',
          default_trial_days: 14,
          payment_gateway: 'asaas',
          payment_mode: 'sandbox',
          pix_key: 'financeiro@zapstore.com',
          asaas_api_key: 'ak_test_demo99182371239',
          mercadopago_access_token: '',
          stripe_webhook_secret: '',
          global_banner_enabled: false,
          global_banner_message: '',
        };
      }
      const saved = localStorage.getItem('zapstore_platform_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
      return {
        platform_name: 'ZapStore SaaS',
        support_whatsapp: '5521964639999',
        support_email: 'suporte@zapstore.com',
        default_trial_days: 14,
        payment_gateway: 'asaas',
        payment_mode: 'sandbox',
        pix_key: 'financeiro@zapstore.com',
        asaas_api_key: 'ak_test_demo99182371239',
        mercadopago_access_token: '',
        stripe_webhook_secret: '',
        global_banner_enabled: false,
        global_banner_message: '',
      };
    },
    save: (data: any) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('zapstore_platform_settings', JSON.stringify(data));
      }
      return data;
    },
  },

  subscriptions: {
    getAll: (): Subscription[] => read<Subscription>(KEYS.subscriptions, []),
    getByProfileId: (profileId: string): Subscription | undefined =>
      db.subscriptions.getAll().find(s => s.profile_id === profileId && s.status === 'active'),
  },

  activityLogs: {
    getAll: (): ActivityLog[] => read<ActivityLog>(KEYS.activity_logs, []),
    getByProfileId: (profileId: string): ActivityLog[] =>
      db.activityLogs.getAll()
        .filter(l => l.profile_id === profileId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 50),
    log: (profileId: string, action: string, metadata?: Record<string, unknown>): void => {
      const entry: ActivityLog = { id: uuid(), profile_id: profileId, action, metadata, created_at: now() };
      const all = db.activityLogs.getAll();
      write(KEYS.activity_logs, [entry, ...all].slice(0, 200));
    },
  },

  // ── Admin stats ─────────────────────────────────────────────
  stats: {
    totalUsers: (): number => db.profiles.getAll().filter(p => !p.is_admin).length,
    activeUsers: (): number => db.profiles.getAll().filter(p => !p.is_admin && p.plan !== 'free').length,
    totalProducts: (): number => db.products.getAll().filter(p => !p.deleted_at).length,
    mrr: (): number => {
      const prices: Record<PlanSlug, number> = { free: 0, starter: 19.99, pro: 49.99 };
      return db.profiles.getAll()
        .filter(p => !p.is_admin && p.plan !== 'free')
        .reduce((sum, p) => sum + (prices[p.plan] ?? 0), 0);
    },
  },

  // ── Analytics & Conversion tracking ─────────────────────────
  analytics: {
    trackVisit: (profileId: string): void => {
      if (!isClient() || !profileId) return;
      try {
        const key = `zapstore_stats_${profileId}`;
        const raw = localStorage.getItem(key);
        const data = raw ? JSON.parse(raw) : { visits: 0, leads: 0, lastUpdated: now() };
        data.visits = (data.visits || 0) + 1;
        data.lastUpdated = now();
        localStorage.setItem(key, JSON.stringify(data));
      } catch {}
    },
    trackLead: (profileId: string): void => {
      if (!isClient() || !profileId) return;
      try {
        const key = `zapstore_stats_${profileId}`;
        const raw = localStorage.getItem(key);
        const data = raw ? JSON.parse(raw) : { visits: 0, leads: 0, lastUpdated: now() };
        data.leads = (data.leads || 0) + 1;
        data.lastUpdated = now();
        localStorage.setItem(key, JSON.stringify(data));
      } catch {}
    },
    getStats: (profileId: string): { visits: number; leads: number } => {
      if (!isClient() || !profileId) return { visits: 0, leads: 0 };
      try {
        const key = `zapstore_stats_${profileId}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            visits: Math.max(parsed.visits || 0, 1),
            leads: parsed.leads || 0,
          };
        }
      } catch {}
      return { visits: 1, leads: 0 };
    },
  },

  syncFromSupabase: syncFromSupabase,
};
