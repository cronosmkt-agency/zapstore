import type { PlanSlug } from '@/types';

interface PlanLimits {
  max_products: number; // Infinity = ilimitado
  max_images: number;
  custom_domain: boolean;
  tawk: boolean;
  analytics: boolean;
}

const LIMITS: Record<PlanSlug, PlanLimits> = {
  free:    { max_products: 10,       max_images: 1,  custom_domain: false, tawk: false, analytics: false },
  starter: { max_products: 50,       max_images: 5,  custom_domain: false, tawk: true,  analytics: true  },
  pro:     { max_products: Infinity, max_images: 20, custom_domain: true,  tawk: true,  analytics: true  },
};

export const planLimits: Record<PlanSlug, { products: number; images: number; custom_domain: boolean }> = {
  free: { products: 10, images: 1, custom_domain: false },
  starter: { products: 50, images: 5, custom_domain: false },
  pro: { products: 999999, images: 20, custom_domain: true },
};

export function getLimits(plan: PlanSlug): PlanLimits {
  return LIMITS[plan] ?? LIMITS.free;
}

export function canAddProduct(plan: PlanSlug, currentCount: number): boolean {
  return currentCount < getLimits(plan).max_products;
}

export function maxImages(plan: PlanSlug): number {
  return getLimits(plan).max_images;
}

export function canUseCustomDomain(plan: PlanSlug): boolean {
  return getLimits(plan).custom_domain;
}

export function canUseTawk(plan: PlanSlug): boolean {
  return getLimits(plan).tawk;
}

export function planLabel(plan: PlanSlug): string {
  const labels: Record<PlanSlug, string> = {
    free: 'Grátis', starter: 'Starter', pro: 'Pro',
  };
  return labels[plan] ?? 'Grátis';
}

export function planColor(plan: PlanSlug): string {
  const colors: Record<PlanSlug, string> = {
    free: 'text-slate-500', starter: 'text-blue-600', pro: 'text-violet-600',
  };
  return colors[plan] ?? 'text-slate-500';
}

export function planBadgeClass(plan: PlanSlug): string {
  const classes: Record<PlanSlug, string> = {
    free:    'bg-slate-100 text-slate-700 border-slate-200',
    starter: 'bg-blue-50 text-blue-700 border-blue-200',
    pro:     'bg-violet-50 text-violet-700 border-violet-200',
  };
  return classes[plan] ?? classes.free;
}
