export interface QuoteParams {
  companyName: string;
  industry: string;
  employees: string;
  services: string[];
  otherService?: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  links?: string[];
  socials?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
  };
  urgency: 'standard' | 'fast' | 'asap';
}

interface PriceEstimate {
  setupMin: number;
  setupMax: number;
  monthlyMin: number;
  monthlyMax: number;
  confidence: 'low' | 'medium' | 'high';
  notes: string[];
}

const SERVICE_PRICING: Record<string, { setup: [number, number]; monthly: [number, number] }> = {
  'ai-agents': { setup: [3000, 8000], monthly: [499, 1299] },
  'automation': { setup: [2000, 6000], monthly: [399, 999] },
  'custom-software': { setup: [5000, 15000], monthly: [599, 1799] },
  'website': { setup: [2000, 5000], monthly: [199, 499] },
  'integrations': { setup: [1500, 4000], monthly: [299, 799] },
  'branding': { setup: [1500, 4000], monthly: [0, 0] },
  'data-analytics': { setup: [3000, 8000], monthly: [499, 1299] },
  'consulting': { setup: [1000, 3000], monthly: [299, 799] },
  'other': { setup: [2000, 8000], monthly: [299, 999] },
};

const SIZE_MULTIPLIER: Record<string, number> = {
  '1-5': 0.7,
  '6-20': 1.0,
  '21-50': 1.3,
  '51-200': 1.6,
  '200+': 2.0,
};

const URGENCY_MULTIPLIER: Record<string, number> = {
  standard: 1.0,
  fast: 1.3,
  asap: 1.6,
};

const INDUSTRY_PREMIUM: Record<string, number> = {
  mining: 1.4,
  'oil-gas': 1.4,
  construction: 1.2,
  finance: 1.3,
  healthcare: 1.2,
  retail: 1.0,
  hospitality: 0.9,
  agency: 1.1,
  other: 1.0,
};

export function estimatePrice(params: QuoteParams): PriceEstimate {
  const notes: string[] = [];
  let totalSetupMin = 0;
  let totalSetupMax = 0;
  let totalMonthlyMin = 0;
  let totalMonthlyMax = 0;

  const sizeMult = SIZE_MULTIPLIER[params.employees] ?? 1.0;
  const urgencyMult = URGENCY_MULTIPLIER[params.urgency] ?? 1.0;
  const industryMult = INDUSTRY_PREMIUM[params.industry] ?? 1.0;

  for (const service of params.services) {
    const pricing = SERVICE_PRICING[service];
    if (!pricing) continue;
    totalSetupMin += pricing.setup[0];
    totalSetupMax += pricing.setup[1];
    totalMonthlyMin += pricing.monthly[0];
    totalMonthlyMax += pricing.monthly[1];
  }

  const mult = sizeMult * urgencyMult * industryMult;
  totalSetupMin = Math.round(totalSetupMin * mult / 100) * 100;
  totalSetupMax = Math.round(totalSetupMax * mult / 100) * 100;
  totalMonthlyMin = Math.round(totalMonthlyMin * mult / 100) * 100;
  totalMonthlyMax = Math.round(totalMonthlyMax * mult / 100) * 100;

  if (params.services.length >= 3) {
    notes.push('Bundle discount potential — 10-15% off combined');
  }
  if (params.urgency === 'asap') {
    notes.push('Rush delivery premium applied');
  }
  if (industryMult > 1.2) {
    notes.push(`${params.industry} sector — specialized compliance/requirements`);
  }
  if (params.otherService) {
    notes.push(`Custom request: ${params.otherService}`);
  }

  const confidence = params.services.length > 0 && params.description.length > 20 ? 'medium' : 'low';

  return { setupMin: totalSetupMin, setupMax: totalSetupMax, monthlyMin: totalMonthlyMin, monthlyMax: totalMonthlyMax, confidence, notes };
}
