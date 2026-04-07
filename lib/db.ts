import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

let initialized = false;

export async function ensureTables() {
  if (initialized) return;
  initialized = true;

  await sql`CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    employees TEXT,
    services JSONB DEFAULT '[]',
    other_service TEXT,
    description TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    website TEXT,
    links JSONB DEFAULT '[]',
    socials JSONB DEFAULT '{}',
    urgency TEXT DEFAULT 'standard',
    status TEXT DEFAULT 'new',
    estimate JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS audits (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    industry TEXT,
    employees TEXT,
    description TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  )`;

  await sql`CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    quote_id TEXT,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_address TEXT,
    items JSONB DEFAULT '[]',
    subtotal NUMERIC DEFAULT 0,
    gst NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'draft',
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    notes TEXT
  )`;

  await sql`CREATE TABLE IF NOT EXISTS recurring_services (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT,
    service TEXT NOT NULL,
    description TEXT,
    monthly_amount NUMERIC NOT NULL,
    start_date TEXT,
    next_billing_date TEXT,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'queued',
    priority TEXT DEFAULT 'medium',
    start_date TEXT,
    due_date TEXT,
    completed_date TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    client_name TEXT,
    category TEXT,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    recurring BOOLEAN DEFAULT false,
    frequency TEXT,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS client_quotes (
    id TEXT PRIMARY KEY,
    access_code TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    title TEXT NOT NULL,
    description TEXT,
    items JSONB DEFAULT '[]',
    subtotal NUMERIC DEFAULT 0,
    gst NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    valid_until TEXT,
    status TEXT DEFAULT 'draft',
    payment_type TEXT DEFAULT 'one-time',
    monthly_amount NUMERIC,
    setup_fee NUMERIC,
    payment_terms TEXT,
    cancellation_policy TEXT,
    notes TEXT,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS portals (
    id TEXT PRIMARY KEY,
    access_code TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    project_title TEXT NOT NULL,
    project_description TEXT,
    status TEXT DEFAULT 'in-progress',
    deliverables JSONB DEFAULT '[]',
    updates JSONB DEFAULT '[]',
    handover_checklist JSONB DEFAULT '[]',
    support_email TEXT DEFAULT 'hello@stackmate.digital',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS mailing_list (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    source TEXT,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS auto_audits (
    id TEXT PRIMARY KEY,
    client_name TEXT,
    url TEXT NOT NULL,
    last_run TIMESTAMPTZ,
    frequency TEXT DEFAULT 'daily',
    geo_score INTEGER,
    seo_score INTEGER,
    performance_score INTEGER,
    status TEXT DEFAULT 'active',
    alerts JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS admin_posts (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    image_url TEXT,
    category TEXT,
    tags JSONB DEFAULT '[]',
    links JSONB DEFAULT '[]',
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS showcase_clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    hero_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    industry TEXT NOT NULL,
    tier TEXT NOT NULL,
    tier_label TEXT NOT NULL,
    upfront_price NUMERIC NOT NULL,
    monthly_price NUMERIC NOT NULL,
    features JSONB DEFAULT '[]',
    includes_description TEXT,
    visible BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS addons (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    upfront_price NUMERIC DEFAULT 0,
    monthly_price NUMERIC DEFAULT 0,
    per_unit BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS pricing_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS client_dashboards (
    id TEXT PRIMARY KEY,
    access_code TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_logo TEXT,
    client_domain TEXT,
    brand_color TEXT DEFAULT '#f97316',
    metrics JSONB DEFAULT '[]',
    seo_scores JSONB DEFAULT '[]',
    geo_scores JSONB DEFAULT '[]',
    traffic_data JSONB DEFAULT '[]',
    rankings JSONB DEFAULT '[]',
    leads JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
}

export { sql };
