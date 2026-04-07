import { NextRequest, NextResponse } from 'next/server';
import { seedAddons, getAddonCount } from '@/lib/addons-store';
import { upsertPricingConfig } from '@/lib/addons-store';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

const SEED_DATA = [
  // ── CORE BUILD ──
  { id: 'addon_quote_engine', category: 'core_build', name: 'Quote Engine', slug: 'quote_engine', upfrontPrice: 199000, monthlyPrice: 0, sortOrder: 0 },
  { id: 'addon_advanced_quote_engine', category: 'core_build', name: 'Advanced Quote Engine', slug: 'advanced_quote_engine', upfrontPrice: 399000, monthlyPrice: 0, sortOrder: 1 },
  { id: 'addon_booking_system', category: 'core_build', name: 'Booking System', slug: 'booking_system', upfrontPrice: 149000, monthlyPrice: 0, sortOrder: 2 },
  { id: 'addon_qr_ordering', category: 'core_build', name: 'QR Ordering', slug: 'qr_ordering', upfrontPrice: 199000, monthlyPrice: 0, sortOrder: 3 },
  { id: 'addon_ecommerce_store', category: 'core_build', name: 'E-Commerce Store Module', slug: 'ecommerce_store', upfrontPrice: 399000, monthlyPrice: 0, sortOrder: 4 },
  { id: 'addon_admin_dashboard', category: 'core_build', name: 'Admin Dashboard', slug: 'admin_dashboard', upfrontPrice: 499000, monthlyPrice: 0, sortOrder: 5 },
  { id: 'addon_client_portal', category: 'core_build', name: 'Client Portal', slug: 'client_portal', upfrontPrice: 699000, monthlyPrice: 0, sortOrder: 6 },

  // ── AI ──
  { id: 'addon_ai_chat', category: 'ai', name: 'AI Chat Assistant', slug: 'ai_chat', upfrontPrice: 149000, monthlyPrice: 14900, sortOrder: 0 },
  { id: 'addon_ai_quote_assistant', category: 'ai', name: 'AI Quote Assistant', slug: 'ai_quote_assistant', upfrontPrice: 249000, monthlyPrice: 24900, sortOrder: 1 },
  { id: 'addon_ai_admin_automation', category: 'ai', name: 'AI Admin Assistant', slug: 'ai_admin_automation', upfrontPrice: 349000, monthlyPrice: 39900, sortOrder: 2 },
  { id: 'addon_ai_voice', category: 'ai', name: 'AI Voice/Reception Layer', slug: 'ai_voice', upfrontPrice: 299000, monthlyPrice: 49900, sortOrder: 3 },

  // ── INTEGRATIONS ──
  { id: 'addon_crm_integration', category: 'integrations', name: 'CRM Integration', slug: 'crm_integration', upfrontPrice: 199000, monthlyPrice: 0, sortOrder: 0 },
  { id: 'addon_calendar_integration', category: 'integrations', name: 'Calendar/Booking Integration', slug: 'calendar_integration', upfrontPrice: 125000, monthlyPrice: 0, sortOrder: 1 },
  { id: 'addon_email_automation', category: 'integrations', name: 'Email Automation Setup', slug: 'email_automation', upfrontPrice: 149000, monthlyPrice: 0, sortOrder: 2 },
  { id: 'addon_review_automation', category: 'integrations', name: 'Review Automation', slug: 'review_automation', upfrontPrice: 125000, monthlyPrice: 0, sortOrder: 3 },
  { id: 'addon_payments_integration', category: 'integrations', name: 'Payments Integration', slug: 'payments_integration', upfrontPrice: 149000, monthlyPrice: 0, sortOrder: 4 },

  // ── GROWTH ──
  { id: 'addon_seo_management', category: 'growth', name: 'SEO Monthly Management', slug: 'seo_management', upfrontPrice: 0, monthlyPrice: 99000, sortOrder: 0 },
  { id: 'addon_geo_management', category: 'growth', name: 'GEO Monthly Management', slug: 'geo_management', upfrontPrice: 0, monthlyPrice: 69000, sortOrder: 1 },
  { id: 'addon_seo_geo_bundle', category: 'growth', name: 'SEO + GEO Bundle', slug: 'seo_geo_bundle', upfrontPrice: 0, monthlyPrice: 149000, sortOrder: 2 },
  { id: 'addon_reporting_dashboard', category: 'growth', name: 'Reporting Dashboard', slug: 'reporting_dashboard', upfrontPrice: 199000, monthlyPrice: 9900, sortOrder: 3 },
  { id: 'addon_copywriting_pack', category: 'growth', name: 'Copywriting Pack', slug: 'copywriting_pack', upfrontPrice: 149000, monthlyPrice: 0, sortOrder: 4 },
  { id: 'addon_extra_landing_page', category: 'growth', name: 'Extra Landing Page', slug: 'extra_landing_page', upfrontPrice: 35000, monthlyPrice: 0, perUnit: true, sortOrder: 5 },
  { id: 'addon_suburb_page_pack', category: 'growth', name: 'Suburb/Service Page Pack', slug: 'suburb_page_pack', upfrontPrice: 129000, monthlyPrice: 0, sortOrder: 6 },
  { id: 'addon_blog_pack', category: 'growth', name: 'Blog/Content Pack', slug: 'blog_pack', upfrontPrice: 99000, monthlyPrice: 0, sortOrder: 7 },
  { id: 'addon_priority_support', category: 'growth', name: 'Priority Support', slug: 'priority_support', upfrontPrice: 0, monthlyPrice: 39900, sortOrder: 8 },
];

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await getAddonCount();
  if (existing > 0) {
    return NextResponse.json({ error: 'Addons already seeded. Delete existing addons first.', count: existing }, { status: 409 });
  }

  const count = await seedAddons(SEED_DATA);

  // Also seed pricing config
  await upsertPricingConfig('complexity_multipliers', { simple: 1, standard: 1.1, advanced: 1.2, highly_custom: 1.35 });
  await upsertPricingConfig('timeline_multipliers', { standard: 1, priority: 1.15, rush: 1.25 });

  return NextResponse.json({ success: true, seeded: count, configSeeded: true });
}
