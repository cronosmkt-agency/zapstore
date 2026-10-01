// ============================================================
// AUTH — Sistema de autenticação local (localStorage)
// Em produção: substituir por @supabase/supabase-js auth
// ============================================================

import { db, initDb } from '@/lib/mockDb';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { AuthSession, PlanSlug, Profile } from '@/types';

const SESSION_KEY = 'saas_session';
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (session.expires_at < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const profile = db.profiles.getById(session.userId);
    if (profile) {
      session.slug = profile.slug;
      session.display_name = profile.display_name;
      session.plan = profile.plan;
      session.plan_slug = profile.plan;
      if (!session.impersonatedBy) {
        session.is_admin = profile.is_admin ?? false;
      }
    }
    if (!session.plan_slug) {
      session.plan_slug = session.plan;
    }
    session.user = {
      id: session.userId,
      email: session.email,
      display_name: session.display_name,
      slug: session.slug,
      plan: session.plan,
      plan_slug: session.plan,
      is_admin: session.is_admin,
      impersonatedBy: session.impersonatedBy,
    };
    return session;
  } catch {
    return null;
  }
}

const ADMIN_BACKUP_KEY = 'saas_admin_backup_session';

function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ADMIN_BACKUP_KEY);
}

export function impersonateUser(profileId: string): AuthSession | null {
  if (typeof window === 'undefined') return null;
  initDb();
  const current = getSession();
  if (!current || (!current.is_admin && !current.impersonatedBy)) return null;

  const targetProfile = db.profiles.getById(profileId);
  if (!targetProfile) return null;

  // Save admin original session if not already impersonating
  if (!localStorage.getItem(ADMIN_BACKUP_KEY)) {
    localStorage.setItem(ADMIN_BACKUP_KEY, JSON.stringify(current));
  }

  const impersonatedSession: AuthSession = {
    userId: targetProfile.id,
    email: targetProfile.email,
    display_name: targetProfile.display_name,
    slug: targetProfile.slug,
    plan: targetProfile.plan,
    plan_slug: targetProfile.plan,
    is_admin: false, // Allows accessing merchant dashboard routes
    impersonatedBy: current.impersonatedBy || current.email,
    expires_at: Date.now() + SESSION_TTL,
    user: {
      id: targetProfile.id,
      email: targetProfile.email,
      display_name: targetProfile.display_name,
      slug: targetProfile.slug,
      plan: targetProfile.plan,
      plan_slug: targetProfile.plan,
      is_admin: false,
      impersonatedBy: current.impersonatedBy || current.email,
    },
  };

  saveSession(impersonatedSession);
  db.activityLogs.log(targetProfile.id, `admin_impersonate_start (${current.email})`);
  return impersonatedSession;
}

export function stopImpersonating(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const backup = localStorage.getItem(ADMIN_BACKUP_KEY);
  if (!backup) return null;

  try {
    const adminSession = JSON.parse(backup) as AuthSession;
    localStorage.removeItem(ADMIN_BACKUP_KEY);
    saveSession(adminSession);
    return adminSession;
  } catch {
    localStorage.removeItem(ADMIN_BACKUP_KEY);
    return null;
  }
}

export function isImpersonating(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(ADMIN_BACKUP_KEY);
}

export interface LoginResult {
  ok: boolean;
  error?: string;
  session?: AuthSession;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  initDb();
  const cleanEmail = email.toLowerCase().trim();

  // 1. Tentar autenticação real via Supabase se configurado
  if (isSupabaseConfigured()) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!authError && authData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profile) {
          if (!profile.is_active) {
            return { ok: false, error: 'Conta desativada. Contate o suporte.' };
          }

          const session: AuthSession = {
            userId: profile.id,
            email: profile.email,
            display_name: profile.display_name,
            slug: profile.slug,
            plan: profile.plan,
            plan_slug: profile.plan,
            is_admin: profile.is_admin ?? false,
            expires_at: Date.now() + SESSION_TTL,
            user: {
              id: profile.id,
              email: profile.email,
              display_name: profile.display_name,
              slug: profile.slug,
              plan: profile.plan,
              plan_slug: profile.plan,
              is_admin: profile.is_admin ?? false,
            },
          };

          saveSession(session);
          return { ok: true, session };
        }
      }
    } catch (e) {
      console.warn('Supabase auth fallback para MockDB:', e);
    }
  }

  // 2. Fallback resiliente para banco Mock / contas demo locais
  const isMatch = db.passwords.verify ? db.passwords.verify(cleanEmail, password) : (db.passwords.get(cleanEmail) === password);
  if (!isMatch) {
    return { ok: false, error: 'Email ou senha incorretos.' };
  }

  const profile = db.profiles.getByEmail(cleanEmail);
  if (!profile) return { ok: false, error: 'Usuário não encontrado.' };
  if (!profile.is_active) return { ok: false, error: 'Conta desativada. Contate o suporte.' };

  const session: AuthSession = {
    userId: profile.id,
    email: profile.email,
    display_name: profile.display_name,
    slug: profile.slug,
    plan: profile.plan,
    plan_slug: profile.plan,
    is_admin: profile.is_admin ?? false,
    expires_at: Date.now() + SESSION_TTL,
    user: {
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      slug: profile.slug,
      plan: profile.plan,
      plan_slug: profile.plan,
      is_admin: profile.is_admin ?? false,
    },
  };

  saveSession(session);
  db.activityLogs.log(profile.id, 'login');
  return { ok: true, session };
}

export interface SignupData {
  display_name?: string;
  full_name?: string;
  email: string;
  password: string;
  slug: string;
  whatsapp?: string;
  store_name: string;
  plan?: PlanSlug;
  niche?: string;
}

export interface SignupResult {
  ok: boolean;
  error?: string;
  session?: AuthSession;
}

export async function signup(data: SignupData): Promise<SignupResult> {
  initDb();

  const email = data.email.toLowerCase().trim();
  const slug  = data.slug.toLowerCase().trim();
  const displayName = data.display_name || data.full_name || 'Lojista';
  const plan = data.plan || 'free';

  // 1. Cadastro no Supabase se configurado
  if (isSupabaseConfigured()) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          data: {
            display_name: displayName,
            slug,
            store_name: data.store_name,
            whatsapp: data.whatsapp,
            niche: data.niche || 'geral',
          },
        },
      });

      if (authError) {
        return { ok: false, error: authError.message };
      }

      if (authData.user) {
        // Garantir dados de perfil e configurações
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email,
          display_name: displayName,
          slug,
          whatsapp: data.whatsapp,
          plan,
          is_active: true,
          is_admin: false,
        });

        await supabase.from('store_settings').upsert({
          profile_id: authData.user.id,
          store_name: data.store_name,
          whatsapp: data.whatsapp,
          theme_mode: 'white',
          enable_tradein: data.niche === 'celulares',
        });

        const session: AuthSession = {
          userId: authData.user.id,
          email,
          display_name: displayName,
          slug,
          plan,
          plan_slug: plan,
          is_admin: false,
          expires_at: Date.now() + SESSION_TTL,
          user: {
            id: authData.user.id,
            email,
            display_name: displayName,
            slug,
            plan,
            plan_slug: plan,
            is_admin: false,
          },
        };

        saveSession(session);
        return { ok: true, session };
      }
    } catch (e) {
      console.warn('Supabase signup fallback para MockDB:', e);
    }
  }

  // 2. Fallback resiliente MockDB
  if (db.profiles.getByEmail(email)) {
    return { ok: false, error: 'Este email já está em uso.' };
  }
  if (!db.profiles.slugAvailable(slug)) {
    return { ok: false, error: 'Este nome de domínio já está em uso.' };
  }

  // Criar perfil
  const profile = db.profiles.create({
    slug,
    display_name: displayName,
    email,
    whatsapp: data.whatsapp,
    plan,
    is_active: true,
    is_admin: false,
  });

  const isCelulares = data.niche === 'celulares';

  const defaultTaglines: Record<string, string> = {
    celulares: 'Especialista em iPhones e Smartphones com garantia total.',
    moda: 'Moda autêntica, tendências exclusivas e entrega expressa.',
    gastronomia: 'Sabor irresistível preparado na hora com entrega rápida.',
    veiculos: 'Veículos selecionados, laudo 100% aprovado e garantia.',
    imoveis: 'Imóveis exclusivos e consultoria personalizada para seu novo lar.',
    infoprodutos: 'Aprenda novas habilidades e impulsione sua carreira hoje.',
    geral: 'Catálogo oficial de produtos com atendimento direto no WhatsApp.',
  };

  // Criar configurações padrão da loja
  db.storeSettings.create({
    profile_id: profile.id,
    store_name: data.store_name,
    store_tagline: defaultTaglines[data.niche || 'geral'] || defaultTaglines.geral,
    whatsapp: data.whatsapp,
    custom_domain_verified: false,
    theme_mode: 'white',
    primary_color: '#2563eb',
    accent_color: '#0ea5e9',
    font_family: 'Inter',
    enable_tawk: false,
    enable_whatsapp_float: true,
    enable_dark_mode_toggle: true,
    enable_tradein: isCelulares,
    cta_button_text: 'Ver Loja',
    differentials: [],
  });

  // Criar categorias padrão de acordo com o nicho
  const defaultCategories: Record<string, string[]> = {
    celulares: ['iPhones Novos', 'Seminovos Grade A+', 'Acessórios & Cabos'],
    moda: ['Lançamentos', 'Feminino', 'Masculino', 'Acessórios'],
    gastronomia: ['Mais Pedidos', 'Burgers & Pratos', 'Acompanhamentos', 'Bebidas'],
    veiculos: ['Seminovos Selecionados', 'Novos / 0km', 'Utilitários & SUVs'],
    imoveis: ['Apartamentos', 'Casas em Condomínio', 'Alto Padrão'],
    infoprodutos: ['Cursos & Formações', 'Mentorias & Workshops', 'E-books & Guias'],
    geral: ['Destaques', 'Novidades', 'Mais Vendidos'],
  };

  const categoriesToCreate = defaultCategories[data.niche || 'geral'] || defaultCategories.geral;
  categoriesToCreate.forEach((name, index) => {
    db.categories.create({
      profile_id: profile.id,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sort_order: index + 1,
    });
  });

  // Salvar senha
  db.passwords.set(email, data.password);
  db.activityLogs.log(profile.id, 'signup');

  // Criar sessão
  const session: AuthSession = {
    userId: profile.id,
    email: profile.email,
    display_name: profile.display_name,
    slug: profile.slug,
    plan: profile.plan,
    plan_slug: profile.plan,
    is_admin: false,
    expires_at: Date.now() + SESSION_TTL,
    user: {
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      slug: profile.slug,
      plan: profile.plan,
      plan_slug: profile.plan,
      is_admin: false,
    },
  };
  saveSession(session);

  return { ok: true, session };
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {}
  }
  clearSession();
}

export async function checkSlugAvailability(slug: string, excludeId?: string): Promise<boolean> {
  initDb();
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('profiles').select('id').eq('slug', slug.toLowerCase().trim());
      if (excludeId) query = query.neq('id', excludeId);
      const { data } = await query;
      if (data && data.length > 0) return false;
    } catch {}
  }
  return db.profiles.slugAvailable(slug, excludeId);
}

