// ============================================================
// SUPABASE DATABASE SERVICE — Camada de persistência real
// Utilizado quando VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
// estiverem configurados.
// ============================================================

import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Profile,
  StoreSettings,
  Product,
  ProductCategory,
  StoreReview,
  Plan,
} from '@/types';

export const supabaseDb = {
  // ─── PROFILES ───────────────────────────────────────────────
  profiles: {
    async getById(id: string): Promise<Profile | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) return null;
      return data as Profile;
    },

    async getBySlug(slug: string): Promise<Profile | null> {
      if (!isSupabaseConfigured()) return null;
      const cleanSlug = slug.toLowerCase().trim();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', cleanSlug)
        .single();
      if (error || !data) return null;
      return data as Profile;
    },

    async getByEmail(email: string): Promise<Profile | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
      if (error || !data) return null;
      return data as Profile;
    },

    async update(id: string, updates: Partial<Profile>): Promise<Profile | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error || !data) return null;
      return data as Profile;
    },
  },

  // ─── STORE SETTINGS ─────────────────────────────────────────
  storeSettings: {
    async getByProfileId(profileId: string): Promise<StoreSettings | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('profile_id', profileId)
        .single();
      if (error || !data) return null;
      return data as StoreSettings;
    },

    async getBySlug(slug: string): Promise<StoreSettings | null> {
      if (!isSupabaseConfigured()) return null;
      const profile = await supabaseDb.profiles.getBySlug(slug);
      if (!profile) return null;
      return supabaseDb.storeSettings.getByProfileId(profile.id);
    },

    async upsert(profileId: string, settings: Partial<StoreSettings>): Promise<StoreSettings | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('store_settings')
        .upsert({ ...settings, profile_id: profileId, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error || !data) return null;
      return data as StoreSettings;
    },
  },

  // ─── CATEGORIES ─────────────────────────────────────────────
  categories: {
    async getByProfileId(profileId: string): Promise<ProductCategory[]> {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('profile_id', profileId)
        .order('sort_order', { ascending: true });
      if (error || !data) return [];
      return data as ProductCategory[];
    },

    async create(category: Omit<ProductCategory, 'id' | 'created_at'>): Promise<ProductCategory | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('product_categories')
        .insert(category)
        .select()
        .single();
      if (error || !data) return null;
      return data as ProductCategory;
    },

    async delete(id: string): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      const { error } = await supabase.from('product_categories').delete().eq('id', id);
      return !error;
    },
  },

  // ─── PRODUCTS ───────────────────────────────────────────────
  products: {
    async getByProfileId(profileId: string): Promise<Product[]> {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', profileId)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true });
      if (error || !data) return [];
      return data as Product[];
    },

    async getBySlug(slug: string): Promise<Product[]> {
      if (!isSupabaseConfigured()) return [];
      const profile = await supabaseDb.profiles.getBySlug(slug);
      if (!profile) return [];
      return supabaseDb.products.getByProfileId(profile.id);
    },

    async getById(id: string): Promise<Product | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) return null;
      return data as Product;
    },

    async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error || !data) return null;
      return data as Product;
    },

    async update(id: string, updates: Partial<Product>): Promise<Product | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error || !data) return null;
      return data as Product;
    },

    async delete(id: string): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      // Soft-delete
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString(), is_available: false })
        .eq('id', id);
      return !error;
    },
  },

  // ─── REVIEWS ────────────────────────────────────────────────
  reviews: {
    async getVisibleBySlug(slug: string): Promise<StoreReview[]> {
      if (!isSupabaseConfigured()) return [];
      const profile = await supabaseDb.profiles.getBySlug(slug);
      if (!profile) return [];
      const { data, error } = await supabase
        .from('store_reviews')
        .select('*')
        .eq('profile_id', profile.id)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
      if (error || !data) return [];
      return data as StoreReview[];
    },
  },

  // ─── PLANS ──────────────────────────────────────────────────
  plans: {
    async getAll(): Promise<Plan[]> {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });
      if (error || !data) return [];
      return data as Plan[];
    },
  },

  // ─── STORAGE (UPLOADS) ──────────────────────────────────────
  storage: {
    async uploadImage(
      bucket: 'store-assets' | 'products',
      path: string,
      file: File | Blob
    ): Promise<string | null> {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });
      if (error || !data) return null;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    },
  },
};
