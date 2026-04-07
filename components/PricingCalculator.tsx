'use client';

import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, ArrowRight, ChevronDown, Minus, Plus } from 'lucide-react';

interface Addon {
  id: string;
  category: string;
  name: string;
  slug: string;
  upfrontPrice: number;
  monthlyPrice: number;
  perUnit: boolean;
}

interface PackageOption {
  id: string;
  industry: string;
  tier: string;
  tierLabel: string;
  upfrontPrice: number;
  monthlyPrice: number;
}

interface PricingConfig {
  complexity_multipliers?: Record<string, number>;
  timeline_multipliers?: Record<string, number>;
}

const CATEGORY_LABELS: Record<string, string> = {
  core_build: 'Core Build',
  ai: 'AI',
  integrations: 'Integrations',
  growth: 'Growth',
};

const CATEGORY_ORDER = ['core_build', 'ai', 'integrations', 'growth'];

const COMPLEXITY_LABELS: Record<string, string> = {
  simple: 'Simple',
  standard: 'Standard',
  advanced: 'Advanced',
  highly_custom: 'Highly Custom',
};

const TIMELINE_LABELS: Record<string, string> = {
  standard: 'Standard',
  priority: 'Priority',
  rush: 'Rush',
};

const INDUSTRY_LABELS: Record<string, string> = {
  tradies: 'Tradies',
  restaurants: 'Restaurants',
  ecommerce: 'E-Commerce',
  'local-services': 'Local Services',
  corporate: 'Corporate',
  enterprise: 'Enterprise',
};

function formatPrice(cents: number): string {
  return 'A$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function PricingCalculator({ onQuoteClick }: { onQuoteClick: () => void }) {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [config, setConfig] = useState<PricingConfig>({});
  const [loaded, setLoaded] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [complexity, setComplexity] = useState('standard');
  const [timeline, setTimeline] = useState('standard');

  useEffect(() => {
    Promise.all([
      fetch('/api/addons').then(r => r.json()),
      fetch('/api/packages').then(r => r.json()),
    ]).then(([addonData, pkgData]) => {
      setAddons(addonData.addons || []);
      setConfig(addonData.config || {});
      setPackages(pkgData.packages || []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const groupedPackages = useMemo(() => {
    const groups: Record<string, PackageOption[]> = {};
    for (const pkg of packages) {
      if (!groups[pkg.industry]) groups[pkg.industry] = [];
      groups[pkg.industry].push(pkg);
    }
    return groups;
  }, [packages]);

  const groupedAddons = useMemo(() => {
    const groups: Record<string, Addon[]> = {};
    for (const addon of addons) {
      if (!groups[addon.category]) groups[addon.category] = [];
      groups[addon.category].push(addon);
    }
    return groups;
  }, [addons]);

  const basePkg = packages.find(p => p.id === selectedPackage);
  const complexityMultiplier = config.complexity_multipliers?.[complexity] ?? 1;
  const timelineMultiplier = config.timeline_multipliers?.[timeline] ?? 1;

  const calculation = useMemo(() => {
    const baseUpfront = basePkg?.upfrontPrice ?? 0;
    const baseMonthly = basePkg?.monthlyPrice ?? 0;

    let addonsUpfront = 0;
    let addonsMonthly = 0;
    for (const addon of addons) {
      if (!selectedAddons[addon.id]) continue;
      const qty = addon.perUnit ? (addonQuantities[addon.id] || 1) : 1;
      addonsUpfront += addon.upfrontPrice * qty;
      addonsMonthly += addon.monthlyPrice * qty;
    }

    const subtotalUpfront = baseUpfront + addonsUpfront;
    const totalUpfront = Math.round(subtotalUpfront * complexityMultiplier * timelineMultiplier);
    const totalMonthly = baseMonthly + addonsMonthly;

    return { baseUpfront, baseMonthly, addonsUpfront, addonsMonthly, subtotalUpfront, totalUpfront, totalMonthly };
  }, [basePkg, addons, selectedAddons, addonQuantities, complexityMultiplier, timelineMultiplier]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => {
      const next = { ...prev };
      if (next[id]) { delete next[id]; } else { next[id] = true; }
      return next;
    });
  };

  const setQuantity = (id: string, qty: number) => {
    setAddonQuantities(prev => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  if (!loaded) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-6 h-6 border-2 border-sm-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (addons.length === 0 && packages.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Step 1: Select base package */}
      <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 md:p-8 bg-sm-surface/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sm-accent/10 text-sm-accent font-display font-bold text-sm">1</span>
          <h3 className="font-display font-bold text-lg">Select a base package</h3>
        </div>
        <div className="relative">
          <select
            value={selectedPackage}
            onChange={e => setSelectedPackage(e.target.value)}
            className="w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white focus:outline-none focus:border-orange-500/30 transition-colors text-sm appearance-none cursor-pointer"
          >
            <option value="">Choose a package...</option>
            {Object.entries(groupedPackages).map(([industry, pkgs]) => (
              <optgroup key={industry} label={INDUSTRY_LABELS[industry] || industry}>
                {pkgs.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.tierLabel} — {formatPrice(pkg.upfrontPrice)} + {formatPrice(pkg.monthlyPrice)}/mo
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sm-muted pointer-events-none" />
        </div>
        {basePkg && (
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-sm-muted">Base upfront: <strong className="text-white">{formatPrice(basePkg.upfrontPrice)}</strong></span>
            <span className="text-sm-muted">Base monthly: <strong className="text-white">{formatPrice(basePkg.monthlyPrice)}/mo</strong></span>
          </div>
        )}
      </div>

      {/* Step 2: Select add-ons */}
      {addons.length > 0 && (
        <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 md:p-8 bg-sm-surface/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sm-accent/10 text-sm-accent font-display font-bold text-sm">2</span>
            <h3 className="font-display font-bold text-lg">Select add-ons</h3>
          </div>
          <div className="space-y-6">
            {CATEGORY_ORDER.map(cat => {
              const catAddons = groupedAddons[cat];
              if (!catAddons || catAddons.length === 0) return null;
              return (
                <div key={cat}>
                  <h4 className="font-display font-bold text-sm text-sm-accent mb-3">{CATEGORY_LABELS[cat]}</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {catAddons.map(addon => {
                      const isSelected = !!selectedAddons[addon.id];
                      const qty = addonQuantities[addon.id] || 1;
                      return (
                        <button
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`text-left p-4 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-orange-500/40 bg-orange-500/5'
                              : 'border-sm-border bg-sm-dark hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-sm-accent border-sm-accent' : 'border-sm-subtle'}`}>
                                  {isSelected && <CheckCircle2 className="w-3 h-3 text-black" />}
                                </div>
                                <span className="font-display font-bold text-sm">{addon.name}</span>
                              </div>
                              <div className="flex gap-3 mt-1 ml-6 text-xs text-sm-muted">
                                {addon.upfrontPrice > 0 && <span>{formatPrice(addon.upfrontPrice)}{addon.perUnit ? ' each' : ''}</span>}
                                {addon.monthlyPrice > 0 && <span>{formatPrice(addon.monthlyPrice)}/mo{addon.perUnit ? ' each' : ''}</span>}
                              </div>
                            </div>
                          </div>
                          {addon.perUnit && isSelected && (
                            <div className="flex items-center gap-2 mt-3 ml-6" onClick={e => e.stopPropagation()}>
                              <span className="text-xs text-sm-muted">Qty:</span>
                              <button
                                onClick={e => { e.stopPropagation(); setQuantity(addon.id, qty - 1); }}
                                className="w-6 h-6 flex items-center justify-center rounded border border-sm-border hover:border-white/30 text-sm-muted"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-sm w-6 text-center">{qty}</span>
                              <button
                                onClick={e => { e.stopPropagation(); setQuantity(addon.id, qty + 1); }}
                                className="w-6 h-6 flex items-center justify-center rounded border border-sm-border hover:border-white/30 text-sm-muted"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Complexity */}
      {config.complexity_multipliers && (
        <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 md:p-8 bg-sm-surface/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sm-accent/10 text-sm-accent font-display font-bold text-sm">3</span>
            <h3 className="font-display font-bold text-lg">Complexity level</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(config.complexity_multipliers).map(([key, mult]) => (
              <button
                key={key}
                onClick={() => setComplexity(key)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  complexity === key
                    ? 'border-orange-500/40 bg-orange-500/5'
                    : 'border-sm-border bg-sm-dark hover:border-white/20'
                }`}
              >
                <span className="font-display font-bold text-sm block">{COMPLEXITY_LABELS[key] || key}</span>
                <span className="text-xs text-sm-muted font-mono">{mult}x</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Timeline */}
      {config.timeline_multipliers && (
        <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 md:p-8 bg-sm-surface/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sm-accent/10 text-sm-accent font-display font-bold text-sm">4</span>
            <h3 className="font-display font-bold text-lg">Timeline</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(config.timeline_multipliers).map(([key, mult]) => (
              <button
                key={key}
                onClick={() => setTimeline(key)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  timeline === key
                    ? 'border-orange-500/40 bg-orange-500/5'
                    : 'border-sm-border bg-sm-dark hover:border-white/20'
                }`}
              >
                <span className="font-display font-bold text-sm block">{TIMELINE_LABELS[key] || key}</span>
                <span className="text-xs text-sm-muted font-mono">{mult}x</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Total */}
      <div className="shimmer-border border border-white/[0.06] rounded-xl p-6 md:p-8 bg-sm-surface/20">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sm-accent/10 text-sm-accent font-display font-bold text-sm">5</span>
          <h3 className="font-display font-bold text-lg">Your estimate</h3>
        </div>

        <div className="space-y-3 mb-6 text-sm">
          {basePkg && (
            <div className="flex justify-between text-sm-light">
              <span>Base package upfront</span>
              <span className="font-mono">{formatPrice(calculation.baseUpfront)}</span>
            </div>
          )}
          {calculation.addonsUpfront > 0 && (
            <div className="flex justify-between text-sm-light">
              <span>Add-ons upfront</span>
              <span className="font-mono">{formatPrice(calculation.addonsUpfront)}</span>
            </div>
          )}
          {(basePkg || calculation.addonsUpfront > 0) && (
            <div className="flex justify-between text-sm-muted border-t border-sm-border pt-2">
              <span>Subtotal upfront</span>
              <span className="font-mono">{formatPrice(calculation.subtotalUpfront)}</span>
            </div>
          )}
          {(complexityMultiplier !== 1 || timelineMultiplier !== 1) && calculation.subtotalUpfront > 0 && (
            <div className="flex justify-between text-sm-muted text-xs">
              <span>Multipliers: {complexityMultiplier}x complexity, {timelineMultiplier}x timeline</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-sm-dark border border-sm-border rounded-lg p-5 text-center">
            <p className="text-xs text-sm-muted uppercase tracking-wider mb-1">Estimated Setup</p>
            <p className="text-3xl md:text-4xl font-display font-bold text-sm-accent">{formatPrice(calculation.totalUpfront)}</p>
          </div>
          <div className="bg-sm-dark border border-sm-border rounded-lg p-5 text-center">
            <p className="text-xs text-sm-muted uppercase tracking-wider mb-1">Estimated Monthly</p>
            <p className="text-3xl md:text-4xl font-display font-bold text-white">{formatPrice(calculation.totalMonthly)}<span className="text-lg text-sm-muted">/mo</span></p>
          </div>
        </div>

        <p className="text-xs text-sm-muted text-center mb-4">
          All prices in AUD. GST not included. This is an estimate based on your selections.
        </p>

        <div className="text-center">
          <button
            onClick={onQuoteClick}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
          >
            This is an estimate. Get an exact quote. <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
